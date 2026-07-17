import { create } from 'zustand';
import { db, Student, Mentor, Competition, SessionRequest, Meeting, UserProfile, WinningDeck, Framework, Quiz, supabase } from './db';

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
  quizzes: Quiz[];
  
  // Actions
  setRole: (role: UserRole) => void;
  registerStudent: (student: Omit<Student, 'id' | 'badges' | 'wins' | 'shortlists' | 'participations'>) => Promise<Student>;
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

    registerStudent: async (studentData) => {
      const newStudent: Student = {
        ...studentData,
        id: `student-${Date.now()}`,
        badges: ['First Step'],
        wins: 0,
        shortlists: 0,
        participations: 0
      };
      if (supabase) {
        try {
          await supabase.from('users').insert({
            id: newStudent.id,
            name: newStudent.name,
            email: newStudent.email,
            role: 'student',
            college: newStudent.college,
            program: newStudent.program,
            year: newStudent.year,
            resume: newStudent.resume,
            linkedin: newStudent.linkedin,
            interests: newStudent.interests || [],
            badges: newStudent.badges,
            wins: newStudent.wins,
            shortlists: newStudent.shortlists,
            participations: newStudent.participations
          });
        } catch (e) {
          console.error("Supabase registerStudent failed:", e);
        }
      }
      set({ currentStudent: newStudent });
      await get().refreshData();
      return newStudent;
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
          }).eq('email', student.email);
        } catch (e) {
          console.error("Supabase updateStudent failed:", e);
        }
      }
      set({ currentStudent: student });
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
          competitions: [],
          mentors: [],
          bookings: [],
          meetings: [],
          winningDecks: [],
          students: [],
          frameworks: [],
          quizzes: []
        });

        const currentUserEmail = localStorage.getItem('corpus_session_email');
        if (currentUserEmail) {
          set({
            currentUser: null,
            currentRole: 'student',
            currentStudent: null,
            currentMentor: null
          });
        }
      } else {
        try {
          const [compRes, mentorRes, bookingRes, meetingRes, deckRes, studentRes, fwRes, quizRes] = await Promise.all([
            client.from('competitions').select('*'),
            client.from('users').select('*').eq('role', 'mentor'),
            client.from('bookings').select('*'),
            client.from('meetings').select('*'),
            client.from('winning_decks').select('*'),
            client.from('users').select('*').eq('role', 'student'),
            client.from('frameworks').select('*'),
            client.from('quizzes').select('*')
          ]);

          const liveCompetitions = compRes.data || [];
          const liveMentors = (mentorRes.data as unknown as Mentor[]) || [];
          const liveBookings = bookingRes.data || [];
          const liveMeetings = meetingRes.data || [];
          const liveDecks = (deckRes.data || []).map((deck: any) => ({
            id: deck.id,
            title: deck.title,
            competition: deck.competition,
            year: deck.year,
            tags: deck.tags,
            teamName: deck.teamname !== undefined ? deck.teamname : deck.teamName,
            fileUrl: deck.fileurl !== undefined ? deck.fileurl : deck.fileUrl,
            previewImage: deck.previewimage !== undefined ? deck.previewimage : deck.previewImage
          }));
          const liveStudents = (studentRes.data as unknown as Student[]) || [];
          const liveFrameworks = fwRes.data || [];
          const liveQuizzes = quizRes.data || [];

          set({
            competitions: liveCompetitions,
            mentors: liveMentors,
            bookings: liveBookings,
            meetings: liveMeetings,
            winningDecks: liveDecks,
            students: liveStudents,
            frameworks: liveFrameworks,
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
          console.error("Supabase sync failed, falling back to empty state", e);
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

      const bookingId = `booking-${Date.now()}`;
      const newBooking = {
        id: bookingId,
        student_id: student.id,
        mentor_id: mentorId,
        status: 'pending_admin',
        preferred_time: preferredTime,
        notes: notes,
        competition_name: competitionName,
        proof_url: proofUrl
      };

      if (supabase) {
        try {
          const { error } = await supabase.from('bookings').insert(newBooking);
          if (error) {
            console.error("Supabase booking failed:", error);
          }
        } catch (e) {
          console.error("Supabase booking exception:", e);
        }
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

          const { data, error } = await supabase.from('bookings').update(updates).eq('id', bookingId).select().maybeSingle();
          if (error) {
            console.error("Supabase session update failed:", error);
          } else {
            updatedBooking = data;

            // If approved, create meeting record in Supabase
            if (status === 'approved' && updatedBooking) {
              const meetingId = Math.floor(100000000 + Math.random() * 900000000).toString();
              const newMeeting = {
                id: `meet-${Date.now()}`,
                session_id: bookingId,
                zoom_id: meetingId,
                zoom_link: `https://zoom.us/j/${meetingId}`,
                meeting_time: updatedBooking.preferred_time
              };
              const { error: meetError } = await supabase.from('meetings').insert(newMeeting);
              if (meetError) {
                console.error("Supabase meeting insert failed:", meetError);
              }
            }
          }
        } catch (e) {
          console.error("Supabase session update failed:", e);
        }
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
          const { error } = await supabase.from('competitions').upsert(comp);
          if (error) {
            console.error("Supabase addCompetition failed:", error);
            alert(`Failed to save competition to Supabase: ${error.message}\n${error.details || ''}`);
            return;
          }
        } catch (e) {
          console.error("Supabase addCompetition exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
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
          const { error } = await supabase.from('competitions').delete().eq('id', compId);
          if (error) {
            console.error("Supabase deleteCompetition failed:", error);
            alert(`Failed to delete competition from Supabase: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase deleteCompetition exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      get().addSystemNotification({
        id: `del-comp-${Date.now()}`,
        title: '🗑️ Competition Removed',
        message: `Competition ID ${compId} was removed from the database.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
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
          
          const { data: existingUser, error: selectError } = await supabase.from('users').select('*').eq('email', mentor.email).maybeSingle();
          if (selectError) {
            console.error("Supabase select error in addMentor:", selectError);
            alert(`Failed to check existing mentor: ${selectError.message}`);
            return;
          }
          if (existingUser) {
            const { error: updateError } = await supabase.from('users').update(profileUpdates).eq('email', mentor.email);
            if (updateError) {
              console.error("Supabase update error in addMentor:", updateError);
              alert(`Failed to update mentor profile: ${updateError.message}`);
              return;
            }
          } else {
            const { error: insertError } = await supabase.from('users').insert({
              id: mentor.id,
              ...profileUpdates
            });
            if (insertError) {
              console.error("Supabase insert error in addMentor:", insertError);
              alert(`Failed to insert mentor profile: ${insertError.message}`);
              return;
            }
          }
        } catch (e) {
          console.error("Supabase mentor insert failed:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      
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
          const { error } = await supabase.from('users').delete().eq('id', mentorId);
          if (error) {
            console.error("Supabase delete mentor failed:", error);
            alert(`Failed to delete mentor: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase delete mentor failed:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      
      get().addSystemNotification({
        id: `del-mentor-${Date.now()}`,
        title: '🗑️ Mentor Removed',
        message: `Mentor profile ID ${mentorId} was removed from the database.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    grantAdmin: async (email) => {
      const emailLower = email.trim().toLowerCase();
      if (supabase) {
        try {
          const { data: existingUser, error: selectError } = await supabase.from('users').select('*').eq('email', emailLower).maybeSingle();
          if (selectError) {
            console.error("Supabase select error in grantAdmin:", selectError);
            alert(`Failed to find user: ${selectError.message}`);
            return;
          }
          if (existingUser) {
            const { error: updateError } = await supabase.from('users').update({ role: 'admin' }).eq('email', emailLower);
            if (updateError) {
              console.error("Supabase update error in grantAdmin:", updateError);
              alert(`Failed to grant admin: ${updateError.message}`);
              return;
            }
          } else {
            const name = emailLower.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            const { error: insertError } = await supabase.from('users').insert({
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
            if (insertError) {
              console.error("Supabase insert error in grantAdmin:", insertError);
              alert(`Failed to insert new admin: ${insertError.message}`);
              return;
            }
          }
        } catch (e) {
          console.error("Supabase grantAdmin failed:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      
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
          const { error } = await supabase.from('users').update({ role: 'student' }).eq('email', emailLower);
          if (error) {
            console.error("Supabase revokeAdmin failed:", error);
            alert(`Failed to revoke admin: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase revokeAdmin failed:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }

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
          const { error } = await supabase.from('users').update(profileUpdates).eq('id', mentor.id);
          if (error) {
            console.error("Supabase updateMentor failed:", error);
            alert(`Failed to update mentor profile: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase updateMentor failed:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
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
          const dbDeck = {
            id: deck.id,
            title: deck.title,
            competition: deck.competition,
            year: deck.year,
            tags: deck.tags,
            teamname: deck.teamName,
            fileurl: deck.fileUrl,
            previewimage: deck.previewImage
          };
          const { error } = await supabase.from('winning_decks').insert(dbDeck);
          if (error) {
            console.error("Supabase addWinningDeck failed:", error);
            alert(`Failed to add winning deck: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase addWinningDeck exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
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
          const dbDeck = {
            id: deck.id,
            title: deck.title,
            competition: deck.competition,
            year: deck.year,
            tags: deck.tags,
            teamname: deck.teamName,
            fileurl: deck.fileUrl,
            previewimage: deck.previewImage
          };
          const { error } = await supabase.from('winning_decks').update(dbDeck).eq('id', deck.id);
          if (error) {
            console.error("Supabase updateWinningDeck failed:", error);
            alert(`Failed to update winning deck: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase updateWinningDeck exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
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
          const { error } = await supabase.from('winning_decks').delete().eq('id', deckId);
          if (error) {
            console.error("Supabase deleteWinningDeck failed:", error);
            alert(`Failed to delete winning deck: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase deleteWinningDeck exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      get().addSystemNotification({
        id: `del-deck-${Date.now()}`,
        title: '🗑️ Winning Deck Removed',
        message: `Deck ID ${deckId} has been removed.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      await get().refreshData();
    },

    addFramework: async (fw) => {
      if (supabase) {
        try {
          const { error } = await supabase.from('frameworks').insert(fw);
          if (error) {
            console.error("Supabase addFramework failed:", error);
            alert(`Failed to add framework: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase addFramework exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      await get().refreshData();
    },

    updateFramework: async (fw) => {
      if (supabase) {
        try {
          const { error } = await supabase.from('frameworks').update(fw).eq('id', fw.id);
          if (error) {
            console.error("Supabase updateFramework failed:", error);
            alert(`Failed to update framework: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase updateFramework exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      await get().refreshData();
    },

    deleteFramework: async (fwId) => {
      if (supabase) {
        try {
          const { error } = await supabase.from('frameworks').delete().eq('id', fwId);
          if (error) {
            console.error("Supabase deleteFramework failed:", error);
            alert(`Failed to delete framework: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase deleteFramework exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      await get().refreshData();
    },



    addQuiz: async (quiz) => {
      if (supabase) {
        try {
          const { error } = await supabase.from('quizzes').insert(quiz);
          if (error) {
            console.error("Supabase addQuiz failed:", error);
            alert(`Failed to add quiz: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase addQuiz exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      await get().refreshData();
    },

    updateQuiz: async (quiz) => {
      if (supabase) {
        try {
          const { error } = await supabase.from('quizzes').update(quiz).eq('id', quiz.id);
          if (error) {
            console.error("Supabase updateQuiz failed:", error);
            alert(`Failed to update quiz: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase updateQuiz exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      await get().refreshData();
    },

    deleteQuiz: async (quizId) => {
      if (supabase) {
        try {
          const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
          if (error) {
            console.error("Supabase deleteQuiz failed:", error);
            alert(`Failed to delete quiz: ${error.message}`);
            return;
          }
        } catch (e) {
          console.error("Supabase deleteQuiz exception:", e);
          alert(`An unexpected error occurred: ${e instanceof Error ? e.message : String(e)}`);
          return;
        }
      }
      await get().refreshData();
    }
  };
});

// Helper for exporting notification actions directly
export const addSystemNotification = (notification: Omit<SystemNotification, 'read'>) => {
  useStore.getState().addSystemNotification(notification);
};
