import { create } from 'zustand';
import { db, Student, Mentor, Competition, SessionRequest, Meeting, UserProfile, WinningDeck, Framework, BasicsTopic, Quiz, supabase } from './db';

// Role simulation type
export type UserRole = 'student' | 'mentor' | 'admin';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'system' | 'alert';
  time: string;
  read?: boolean;
}

interface AppState {
  currentRole: UserRole;
  currentStudent: Student | null;
  currentMentor: Mentor | null;
  currentUser: UserProfile | null;
  savedCompetitions: string[]; // ids
  notifications: SystemNotification[];
  competitions: Competition[];
  mentors: Mentor[];
  bookings: SessionRequest[];
  meetings: Meeting[];
  winningDecks: WinningDeck[];
  students: Student[];
  frameworks: Framework[];
  basicsTopics: BasicsTopic[];
  quizzes: Quiz[];
  
  // Actions
  setRole: (role: UserRole) => void;
  registerStudent: (student: Omit<Student, 'id' | 'badges' | 'wins' | 'shortlists' | 'participations'>) => Student;
  updateStudent: (student: Student) => void;
  toggleBookmark: (compId: string) => void;
  addSystemNotification: (notification: Omit<SystemNotification, 'read'>) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  // Reload items from DB (mock sync)
  refreshData: () => void;
  
  // Admin & Booking Actions inside store for immediate UI update
  submitMentorApplication: (app: any) => void;
  approveMentorApplication: (appId: string) => void;
  rejectMentorApplication: (appId: string) => void;
  bookSession: (mentorId: string, preferredTime: string, notes: string, competitionName: string, proofUrl: string) => void;
  updateSessionStatus: (bookingId: string, status: 'pending_admin' | 'pending_mentor' | 'approved' | 'rejected' | 'rescheduled', preferred_time?: string) => void;
  addCompetition: (comp: Competition) => Promise<void>;
  deleteCompetition: (compId: string) => Promise<void>;
  addMentor: (mentor: Mentor) => Promise<void>;
  updateMentor: (mentor: Mentor) => Promise<void>;
  deleteMentor: (mentorId: string) => Promise<void>;

  // Authentication Actions
  signInWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;

  // Admin Management Actions
  grantAdmin: (email: string) => Promise<void>;
  revokeAdmin: (email: string) => Promise<void>;

  // Learning Hub Decks Management Actions
  addWinningDeck: (deck: WinningDeck) => Promise<void>;
  updateWinningDeck: (deck: WinningDeck) => Promise<void>;
  deleteWinningDeck: (deckId: string) => Promise<void>;

  addFramework: (fw: Framework) => Promise<void>;
  updateFramework: (fw: Framework) => Promise<void>;
  deleteFramework: (fwId: string) => Promise<void>;

  addBasicsTopic: (topic: BasicsTopic) => Promise<void>;
  updateBasicsTopic: (topic: BasicsTopic) => Promise<void>;
  deleteBasicsTopic: (topicId: string) => Promise<void>;

  addQuiz: (quiz: Quiz) => Promise<void>;
  updateQuiz: (quiz: Quiz) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
}

// Initial default student for demo purposes
const DEMO_STUDENT: Student = {
  id: 'student-demo',
  name: 'Aravind Swamy',
  email: 'aravind.swamy.pgp26@iimkashipur.ac.in',
  college: 'IIM Kashipur',
  program: 'PGP MBA',
  year: '1st Year',
  resume: 'aravind_resume_consulting.pdf',
  linkedin: 'https://linkedin.com/in/aravind-swamy-iim',
  interests: ['Consulting', 'Product', 'Marketing'],
  badges: ['Case Champion', 'First Competition'],
  wins: 1,
  shortlists: 2,
  participations: 4
};

export const useStore = create<AppState>((set, get) => {
  return {
    currentUser: null,
    currentRole: 'student',
    currentStudent: null,
    currentMentor: null,
    savedCompetitions: [],
    notifications: [
      {
        id: 'init-1',
        title: '🎉 Welcome to CORPUS!',
        message: 'The ultimate Case Competition Excellence Platform is now live. Explore frameworks, seek mentorship, and practice cases.',
        type: 'system',
        time: 'Just now',
        read: false
      }
    ],
    competitions: [],
    mentors: [],
    bookings: [],
    meetings: [],
    winningDecks: [],
    students: [],
    frameworks: [],
    basicsTopics: [],
    quizzes: [],

    setRole: (role) => {
      // Manual swapper widget is removed from navbar, but let's keep this action for programmatic role adjustments if required
      set({ currentRole: role });
    },

    signInWithEmail: async (email) => {
      const emailLower = email.trim().toLowerCase();
      if (!emailLower.endsWith('@iimkashipur.ac.in')) {
        return { success: false, error: 'Access restricted! Must log in using a @iimkashipur.ac.in email address.' };
      }

      const envAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'teamcorpus@iimkashipur.ac.in')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);
      const isSystemAdmin = envAdmins.includes(emailLower);
      const defaultRole: UserRole = isSystemAdmin ? 'admin' : 'student';

      let profile: UserProfile | null = null;

      if (supabase) {
        try {
          const { data, error } = await supabase.from('users').select('*').eq('email', emailLower).maybeSingle();
          if (data) {
            profile = data as UserProfile;
            const expectedRole = isSystemAdmin ? 'admin' : (profile.role === 'admin' ? 'student' : profile.role);
            if (profile.role !== expectedRole) {
              profile.role = expectedRole;
              await supabase.from('users').update({ role: expectedRole }).eq('email', emailLower);
            }
          } else {
            // New user registration
            const name = emailLower.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            const newProfile: UserProfile = {
              id: `user-${Date.now()}`,
              name,
              email: emailLower,
              role: defaultRole,
              college: 'IIM Kashipur',
              badges: ['First Step'],
              wins: 0,
              shortlists: 0,
              participations: 0,
              interests: [],
              competitions_won: [],
              expertise: [],
              available_days: [],
              available_slots: []
            };
            const { data: inserted } = await supabase.from('users').insert(newProfile).select().single();
            if (inserted) {
              profile = inserted as UserProfile;
            }
          }
        } catch (e) {
          console.error("Supabase sign in failed, falling back to LocalDb", e);
        }
      }

      // Fallback if Supabase not connected or failed
      if (!profile) {
        const existing = db.getUserByEmail(emailLower);
        if (existing) {
          profile = existing;
          const expectedRole = isSystemAdmin ? 'admin' : (profile.role === 'admin' ? 'student' : profile.role);
          if (profile.role !== expectedRole) {
            profile.role = expectedRole;
            db.upsertUser(profile);
          }
        } else {
          const name = emailLower.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
          const newProfile: UserProfile = {
            id: `user-${Date.now()}`,
            name,
            email: emailLower,
            role: defaultRole,
            college: 'IIM Kashipur',
            badges: ['First Step'],
            wins: 0,
            shortlists: 0,
            participations: 0,
            interests: [],
            competitions_won: [],
            expertise: [],
            available_days: [],
            available_slots: []
          };
          profile = db.upsertUser(newProfile);
        }
      }

      if (profile) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('corpus_session_email', emailLower);
        }
        set({
          currentUser: profile,
          currentRole: profile.role === 'mentor' ? 'student' : profile.role,
          currentStudent: profile as unknown as Student,
          currentMentor: null
        });

        get().addSystemNotification({
          id: `auth-${Date.now()}`,
          title: '🔑 Sign In Successful',
          message: `Logged in as ${profile.name} (${profile.role.toUpperCase()})`,
          type: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });

        await get().refreshData();
        return { success: true };
      }

      return { success: false, error: 'Unable to establish session. Please try again.' };
    },

    signOut: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('corpus_session_email');
      }
      set({
        currentUser: null,
        currentRole: 'student',
        currentStudent: null,
        currentMentor: null
      });
      get().addSystemNotification({
        id: `auth-${Date.now()}`,
        title: '🔒 Signed Out',
        message: 'Your session has been terminated.',
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    },

    registerStudent: (studentData) => {
      const newStudent: Student = {
        ...studentData,
        id: `student-${Date.now()}`,
        badges: ['First Step'],
        wins: 0,
        shortlists: 0,
        participations: 0
      };
      const saved = db.upsertStudent(newStudent);
      set({ currentStudent: saved });
      get().refreshData();
      return saved;
    },

    updateStudent: async (student) => {
      if (supabase) {
        try {
          await supabase.from('users').update({
            name: student.name,
            college: student.college,
            program: student.program,
            year: student.year,
            linkedin: student.linkedin,
            interests: student.interests,
            resume: student.resume,
            wins: student.wins,
            shortlists: student.shortlists,
            participations: student.participations
          }).eq('id', student.id);
        } catch (e) {
          console.error("Supabase updateStudent failed:", e);
        }
      }
      const saved = db.upsertStudent(student);
      set({ currentStudent: saved });
      await get().refreshData();
    },

    toggleBookmark: (compId) => {
      const current = get().savedCompetitions;
      const updated = current.includes(compId)
        ? current.filter(id => id !== compId)
        : [...current, compId];
      set({ savedCompetitions: updated });

      // Trigger standard system notification
      const comp = get().competitions.find(c => c.id === compId);
      if (comp) {
        get().addSystemNotification({
          id: `bookmark-${Date.now()}`,
          title: updated.includes(compId) ? '📌 Competition Saved' : '📌 Competition Removed',
          message: `${comp.title} by ${comp.company} is ${updated.includes(compId) ? 'bookmarked' : 'unbookmarked'}.`,
          type: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    },

    addSystemNotification: (notification) => {
      set(state => ({
        notifications: [{ ...notification, read: false }, ...state.notifications]
      }));
    },

    markNotificationsAsRead: () => {
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      }));
    },

    clearNotifications: () => {
      set({ notifications: [] });
    },

    refreshData: async () => {
      if (typeof window === 'undefined') return;

      const client = supabase;
      const isFallback = !client;

      const envAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'teamcorpus@iimkashipur.ac.in')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);

      if (isFallback) {
        set({
          competitions: db.getCompetitions(),
          mentors: db.getMentors(),
          bookings: db.getSessionRequests(),
          meetings: db.getMeetings(),
          winningDecks: db.getWinningDecks(),
          students: db.getStudents(),
          frameworks: db.getFrameworks(),
          basicsTopics: db.getBasicsTopics(),
          quizzes: db.getQuizzes()
        });

        const currentUserEmail = localStorage.getItem('corpus_session_email');
        if (currentUserEmail) {
          const isSystemAdmin = envAdmins.includes(currentUserEmail.toLowerCase());
          const profile = db.getUserByEmail(currentUserEmail);
          if (profile) {
            const expectedRole = isSystemAdmin ? 'admin' : (profile.role === 'admin' ? 'student' : profile.role);
            if (profile.role !== expectedRole) {
              profile.role = expectedRole;
              db.upsertUser(profile);
            }
            set({
              currentUser: profile,
              currentRole: profile.role === 'mentor' ? 'student' : profile.role,
              currentStudent: profile as unknown as Student,
              currentMentor: null
            });
          }
        }
      } else {
        try {
          const [compRes, mentorRes, bookingRes, meetingRes, deckRes, studentRes, fwRes, topicRes, quizRes] = await Promise.all([
            client.from('competitions').select('*'),
            client.from('users').select('*').eq('role', 'mentor'),
            client.from('bookings').select('*'),
            client.from('meetings').select('*'),
            client.from('winning_decks').select('*'),
            client.from('users').select('*').eq('role', 'student'),
            client.from('frameworks').select('*'),
            client.from('code_basics').select('*'),
            client.from('quizzes').select('*')
          ]);

          const liveCompetitions = compRes.data && compRes.data.length > 0 ? compRes.data : db.getCompetitions();
          const liveMentors = mentorRes.data && mentorRes.data.length > 0 ? (mentorRes.data as unknown as Mentor[]) : db.getMentors();
          const liveBookings = bookingRes.data && bookingRes.data.length > 0 ? bookingRes.data : db.getSessionRequests();
          const liveMeetings = meetingRes.data && meetingRes.data.length > 0 ? meetingRes.data : db.getMeetings();
          const liveDecks = deckRes.data && deckRes.data.length > 0 ? deckRes.data : db.getWinningDecks();
          const liveStudents = studentRes.data && studentRes.data.length > 0 ? (studentRes.data as unknown as Student[]) : db.getStudents();
          const liveFrameworks = fwRes.data && fwRes.data.length > 0 ? fwRes.data : db.getFrameworks();
          const liveTopics = topicRes.data && topicRes.data.length > 0 ? topicRes.data.map((t: any) => ({
            id: t.id,
            title: t.title,
            desc: t.desc_text || t.desc || '',
            insights: t.insights || []
          })) : db.getBasicsTopics();
          const liveQuizzes = quizRes.data && quizRes.data.length > 0 ? quizRes.data : db.getQuizzes();

          set({
            competitions: liveCompetitions,
            mentors: liveMentors,
            bookings: liveBookings,
            meetings: liveMeetings,
            winningDecks: liveDecks,
            students: liveStudents,
            frameworks: liveFrameworks,
            basicsTopics: liveTopics,
            quizzes: liveQuizzes
          });

          const currentUserEmail = localStorage.getItem('corpus_session_email');
          if (currentUserEmail) {
            const isSystemAdmin = envAdmins.includes(currentUserEmail.toLowerCase());
            const { data: profile } = await client.from('users').select('*').eq('email', currentUserEmail).maybeSingle();
            if (profile) {
              const updatedProfile = { ...profile } as UserProfile;
              const expectedRole = isSystemAdmin ? 'admin' : (profile.role === 'admin' ? 'student' : profile.role);
              if (profile.role !== expectedRole) {
                updatedProfile.role = expectedRole;
                await client.from('users').update({ role: expectedRole }).eq('email', currentUserEmail);
              }
              set({
                currentUser: updatedProfile,
                currentRole: (updatedProfile.role === 'mentor' ? 'student' : updatedProfile.role) as UserRole,
                currentStudent: updatedProfile as unknown as Student,
                currentMentor: null
              });
            }
          }
        } catch (e) {
          console.error("Supabase sync failed, falling back to LocalDb", e);
        }
      }
    },

    submitMentorApplication: (app) => {
      db.submitMentorApplication(app);
      get().refreshData();
    },

    approveMentorApplication: async (appId) => {
      const updatedApp = db.updateMentorApplicationStatus(appId, 'approved');
      if (updatedApp) {
        if (supabase) {
          try {
            const { data: existingUser } = await supabase.from('users').select('*').eq('email', updatedApp.email).maybeSingle();
            const profileUpdates = {
              role: 'mentor',
              batch: updatedApp.batch,
              current_role: updatedApp.current_role,
              competitions_won: updatedApp.competitions_won,
              expertise: updatedApp.expertise_areas,
              rating: 5.0,
              profile_photo: updatedApp.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
              available_days: ['Monday', 'Friday'],
              available_slots: ['18:00 - 19:00', '20:00 - 21:00']
            };

            if (existingUser) {
              await supabase.from('users').update(profileUpdates).eq('email', updatedApp.email);
            } else {
              await supabase.from('users').insert({
                id: `user-${Date.now()}`,
                name: updatedApp.applicant_name,
                email: updatedApp.email,
                college: updatedApp.college,
                ...profileUpdates
              });
            }
          } catch (e) {
            console.error("Supabase update error inside approvals:", e);
          }
        }

        const { emailService } = require('./emailService');
        emailService.sendMentorApprovalEmail(updatedApp.applicant_name, updatedApp.email);
        
        get().addSystemNotification({
          id: `approve-app-${Date.now()}`,
          title: '✅ Mentor Application Approved',
          message: `Application for ${updatedApp.applicant_name} has been successfully approved. Their profile is now live.`,
          type: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      await get().refreshData();
    },

    rejectMentorApplication: (appId) => {
      const updatedApp = db.updateMentorApplicationStatus(appId, 'rejected');
      if (updatedApp) {
        get().addSystemNotification({
          id: `reject-app-${Date.now()}`,
          title: '❌ Mentor Application Rejected',
          message: `Application for ${updatedApp.applicant_name} has been rejected.`,
          type: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      get().refreshData();
    },

    bookSession: async (mentorId, preferredTime, notes, competitionName, proofUrl) => {
      const student = get().currentStudent;
      if (!student) return;

      if (supabase) {
        try {
          const newBooking = {
            student_id: student.id,
            mentor_id: mentorId,
            status: 'pending_admin',
            preferred_time: preferredTime,
            notes: notes,
            competition_name: competitionName,
            proof_url: proofUrl
          };
          await supabase.from('bookings').insert(newBooking);
        } catch (e) {
          console.error("Supabase booking failed, falling back to LocalDb:", e);
          db.createSessionRequest({
            student_id: student.id,
            mentor_id: mentorId,
            preferred_time: preferredTime,
            notes: notes,
            competition_name: competitionName,
            proof_url: proofUrl
          });
        }
      } else {
        db.createSessionRequest({
          student_id: student.id,
          mentor_id: mentorId,
          preferred_time: preferredTime,
          notes: notes,
          competition_name: competitionName,
          proof_url: proofUrl
        });
      }

      await get().refreshData();
    },

    updateSessionStatus: async (bookingId, status, preferred_time) => {
      let updatedBooking: any = null;

      if (supabase) {
        try {
          const updates: any = { status };
          if (preferred_time) {
            updates.preferred_time = preferred_time;
          }

          if (status === 'approved') {
            const meetingId = Math.floor(100000000 + Math.random() * 900000000).toString();
            updates.zoom_id = meetingId;
            updates.zoom_link = `https://zoom.us/j/${meetingId}`;
          }

          const { data } = await supabase.from('bookings').update(updates).eq('id', bookingId).select().maybeSingle();
          updatedBooking = data;
        } catch (e) {
          console.error("Supabase session update failed, falling back to LocalDb:", e);
          updatedBooking = db.updateSessionRequestStatus(bookingId, status, preferred_time);
        }
      } else {
        updatedBooking = db.updateSessionRequestStatus(bookingId, status, preferred_time);
      }

      if (updatedBooking) {
        let studentObj: any = null;
        let mentorObj: any = null;

        if (supabase) {
          try {
            const { data: s } = await supabase.from('users').select('*').eq('id', updatedBooking.student_id).maybeSingle();
            const { data: m } = await supabase.from('users').select('*').eq('id', updatedBooking.mentor_id).maybeSingle();
            studentObj = s;
            mentorObj = m;
          } catch (e) {
            console.error("Fetch profiles failed for emails:", e);
          }
        } else {
          studentObj = db.getStudent(updatedBooking.student_id);
          mentorObj = db.getMentor(updatedBooking.mentor_id);
        }

        const { emailService } = require('./emailService');

        if (studentObj && mentorObj) {
          if (status === 'approved') {
            const zoomLink = updatedBooking.zoom_link || 'https://zoom.us/mock';
            emailService.sendApprovalEmail(studentObj.name, studentObj.email, mentorObj.name, updatedBooking.preferred_time, zoomLink);
            emailService.sendSessionConfirmationEmail(studentObj.name, studentObj.email, mentorObj.name, mentorObj.email, updatedBooking.preferred_time, zoomLink);
          } else if (status === 'rejected') {
            emailService.sendRejectionEmail(studentObj.name, studentObj.email, mentorObj.name);
          } else if (status === 'rescheduled') {
            emailService.sendRescheduleEmail(studentObj.name, studentObj.email, mentorObj.name, updatedBooking.preferred_time);
          }
        }
      }
      await get().refreshData();
    },

    addCompetition: async (comp) => {
      if (supabase) {
        try {
          await supabase.from('competitions').upsert(comp);
        } catch (e) {
          console.error("Supabase addCompetition failed:", e);
        }
      }
      db.upsertCompetition(comp);
      get().addSystemNotification({
        id: `add-comp-${Date.now()}`,
        title: '🏆 Competition Published',
        message: `${comp.title} by ${comp.company} is now available in the opportunities pool.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    deleteCompetition: async (compId) => {
      if (supabase) {
        try {
          await supabase.from('competitions').delete().eq('id', compId);
        } catch (e) {
          console.error("Supabase deleteCompetition failed:", e);
        }
      }
      const success = db.deleteCompetition(compId);
      if (success) {
        get().addSystemNotification({
          id: `del-comp-${Date.now()}`,
          title: '🗑️ Competition Removed',
          message: `Competition ID ${compId} was removed from the database.`,
          type: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      await get().refreshData();
    },

    addMentor: async (mentor) => {
      if (supabase) {
        try {
          const profileUpdates = {
            role: 'mentor',
            name: mentor.name,
            email: mentor.email,
            college: mentor.college,
            batch: mentor.batch,
            current_role: mentor.current_role,
            competitions_won: mentor.competitions_won,
            expertise: mentor.expertise,
            rating: mentor.rating || 5.0,
            profile_photo: mentor.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
            available_days: mentor.available_days || ['Monday', 'Friday'],
            available_slots: mentor.available_slots || ['18:00 - 19:00', '20:00 - 21:00']
          };
          
          const { data: existingUser } = await supabase.from('users').select('*').eq('email', mentor.email).maybeSingle();
          if (existingUser) {
            await supabase.from('users').update(profileUpdates).eq('email', mentor.email);
          } else {
            await supabase.from('users').insert({
              id: mentor.id,
              ...profileUpdates
            });
          }
        } catch (e) {
          console.error("Supabase mentor insert failed:", e);
        }
      }
      
      db.upsertMentor(mentor);
      get().addSystemNotification({
        id: `add-mentor-${Date.now()}`,
        title: '🤝 Mentor Profile Published',
        message: `${mentor.name} has been added directly to the mentor directory by Admin.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    deleteMentor: async (mentorId) => {
      if (supabase) {
        try {
          await supabase.from('users').delete().eq('id', mentorId);
        } catch (e) {
          console.error("Supabase delete mentor failed:", e);
        }
      }
      
      const success = db.deleteMentor(mentorId);
      if (success) {
        get().addSystemNotification({
          id: `del-mentor-${Date.now()}`,
          title: '🗑️ Mentor Removed',
          message: `Mentor profile ID ${mentorId} was removed from the database.`,
          type: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      await get().refreshData();
    },

    grantAdmin: async (email) => {
      const emailLower = email.trim().toLowerCase();
      if (supabase) {
        try {
          const { data: existingUser } = await supabase.from('users').select('*').eq('email', emailLower).maybeSingle();
          if (existingUser) {
            await supabase.from('users').update({ role: 'admin' }).eq('email', emailLower);
          } else {
            const name = emailLower.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            await supabase.from('users').insert({
              id: `user-${Date.now()}`,
              name,
              email: emailLower,
              role: 'admin',
              college: 'IIM Kashipur',
              badges: ['First Step'],
              wins: 0,
              shortlists: 0,
              participations: 0
            });
          }
        } catch (e) {
          console.error("Supabase grantAdmin failed:", e);
        }
      }
      db.grantAdmin(emailLower);
      
      get().addSystemNotification({
        id: `grant-admin-${Date.now()}`,
        title: '🛡️ Admin Access Granted',
        message: `${emailLower} has been granted administrator access.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    revokeAdmin: async (email) => {
      const emailLower = email.trim().toLowerCase();
      if (supabase) {
        try {
          await supabase.from('users').update({ role: 'student' }).eq('email', emailLower);
        } catch (e) {
          console.error("Supabase revokeAdmin failed:", e);
        }
      }
      db.revokeAdmin(emailLower);

      get().addSystemNotification({
        id: `revoke-admin-${Date.now()}`,
        title: '🛡️ Admin Access Revoked',
        message: `${emailLower}'s administrator access has been revoked.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    updateMentor: async (mentor) => {
      if (supabase) {
        try {
          const profileUpdates = {
            name: mentor.name,
            email: mentor.email,
            college: mentor.college,
            batch: mentor.batch,
            current_role: mentor.current_role,
            competitions_won: mentor.competitions_won,
            expertise: mentor.expertise,
            rating: mentor.rating,
            profile_photo: mentor.profile_photo,
            available_days: mentor.available_days,
            available_slots: mentor.available_slots
          };
          await supabase.from('users').update(profileUpdates).eq('id', mentor.id);
        } catch (e) {
          console.error("Supabase updateMentor failed:", e);
        }
      }
      db.upsertMentor(mentor);
      get().addSystemNotification({
        id: `update-mentor-${Date.now()}`,
        title: '🤝 Mentor Profile Updated',
        message: `Profile details for ${mentor.name} have been updated by Admin.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    addWinningDeck: async (deck) => {
      if (supabase) {
        try {
          await supabase.from('winning_decks').insert(deck);
        } catch (e) {
          console.error("Supabase addWinningDeck failed:", e);
        }
      }
      db.upsertWinningDeck(deck);
      get().addSystemNotification({
        id: `add-deck-${Date.now()}`,
        title: '📂 New Winning Deck Added',
        message: `"${deck.title}" has been published to the repository.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    updateWinningDeck: async (deck) => {
      if (supabase) {
        try {
          await supabase.from('winning_decks').update(deck).eq('id', deck.id);
        } catch (e) {
          console.error("Supabase updateWinningDeck failed:", e);
        }
      }
      db.upsertWinningDeck(deck);
      get().addSystemNotification({
        id: `update-deck-${Date.now()}`,
        title: '📂 Winning Deck Updated',
        message: `"${deck.title}" details have been updated.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    deleteWinningDeck: async (deckId) => {
      if (supabase) {
        try {
          await supabase.from('winning_decks').delete().eq('id', deckId);
        } catch (e) {
          console.error("Supabase deleteWinningDeck failed:", e);
        }
      }
      const success = db.deleteWinningDeck(deckId);
      if (success) {
        get().addSystemNotification({
          id: `del-deck-${Date.now()}`,
          title: '🗑️ Winning Deck Removed',
          message: `Deck ID ${deckId} has been removed.`,
          type: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      await get().refreshData();
    },

    addFramework: async (fw) => {
      if (supabase) {
        try {
          await supabase.from('frameworks').insert(fw);
        } catch (e) {
          console.error("Supabase addFramework failed:", e);
        }
      }
      db.upsertFramework(fw);
      await get().refreshData();
    },

    updateFramework: async (fw) => {
      if (supabase) {
        try {
          await supabase.from('frameworks').update(fw).eq('id', fw.id);
        } catch (e) {
          console.error("Supabase updateFramework failed:", e);
        }
      }
      db.upsertFramework(fw);
      await get().refreshData();
    },

    deleteFramework: async (fwId) => {
      if (supabase) {
        try {
          await supabase.from('frameworks').delete().eq('id', fwId);
        } catch (e) {
          console.error("Supabase deleteFramework failed:", e);
        }
      }
      db.deleteFramework(fwId);
      await get().refreshData();
    },

    addBasicsTopic: async (topic) => {
      if (supabase) {
        try {
          await supabase.from('code_basics').insert({
            id: topic.id,
            title: topic.title,
            desc_text: topic.desc,
            insights: topic.insights
          });
        } catch (e) {
          console.error("Supabase addBasicsTopic failed:", e);
        }
      }
      db.upsertBasicsTopic(topic);
      await get().refreshData();
    },

    updateBasicsTopic: async (topic) => {
      if (supabase) {
        try {
          await supabase.from('code_basics').update({
            id: topic.id,
            title: topic.title,
            desc_text: topic.desc,
            insights: topic.insights
          }).eq('id', topic.id);
        } catch (e) {
          console.error("Supabase updateBasicsTopic failed:", e);
        }
      }
      db.upsertBasicsTopic(topic);
      await get().refreshData();
    },

    deleteBasicsTopic: async (topicId) => {
      if (supabase) {
        try {
          await supabase.from('code_basics').delete().eq('id', topicId);
        } catch (e) {
          console.error("Supabase deleteBasicsTopic failed:", e);
        }
      }
      db.deleteBasicsTopic(topicId);
      await get().refreshData();
    },

    addQuiz: async (quiz) => {
      if (supabase) {
        try {
          await supabase.from('quizzes').insert(quiz);
        } catch (e) {
          console.error("Supabase addQuiz failed:", e);
        }
      }
      db.upsertQuiz(quiz);
      await get().refreshData();
    },

    updateQuiz: async (quiz) => {
      if (supabase) {
        try {
          await supabase.from('quizzes').update(quiz).eq('id', quiz.id);
        } catch (e) {
          console.error("Supabase updateQuiz failed:", e);
        }
      }
      db.upsertQuiz(quiz);
      await get().refreshData();
    },

    deleteQuiz: async (quizId) => {
      if (supabase) {
        try {
          await supabase.from('quizzes').delete().eq('id', quizId);
        } catch (e) {
          console.error("Supabase deleteQuiz failed:", e);
        }
      }
      db.deleteQuiz(quizId);
      await get().refreshData();
    }
  };
});

// Helper for exporting notification actions directly
export const addSystemNotification = (notification: Omit<SystemNotification, 'read'>) => {
  useStore.getState().addSystemNotification(notification);
};
