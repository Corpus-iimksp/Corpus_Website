import { create } from 'zustand';
import { db, Student, Mentor, Competition, SessionRequest, Meeting } from './db';

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
  savedCompetitions: string[]; // ids
  notifications: SystemNotification[];
  competitions: Competition[];
  mentors: Mentor[];
  bookings: SessionRequest[];
  meetings: Meeting[];
  
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
  bookSession: (mentorId: string, preferredTime: string, notes: string) => void;
  updateSessionStatus: (bookingId: string, status: 'approved' | 'rejected' | 'rescheduled', preferred_time?: string) => void;
  addCompetition: (comp: Competition) => void;
  deleteCompetition: (compId: string) => void;
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
  // Try loading default student
  let initialStudent: Student | null = null;
  if (typeof window !== 'undefined') {
    const students = db.getStudents();
    initialStudent = students.find(s => s.id === 'student-demo') || null;
    if (!initialStudent) {
      initialStudent = db.upsertStudent(DEMO_STUDENT);
    }
  }

  return {
    currentRole: 'student',
    currentStudent: initialStudent,
    currentMentor: typeof window !== 'undefined' ? db.getMentors()[0] || null : null, // Default first mentor for mentor portal view
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
    competitions: db.getCompetitions(),
    mentors: db.getMentors(),
    bookings: db.getSessionRequests(),
    meetings: db.getMeetings(),

    setRole: (role) => {
      set({ currentRole: role });
      // If mentor role selected, make sure we have a currentMentor representation
      if (role === 'mentor' && !get().currentMentor) {
        const mentors = db.getMentors();
        set({ currentMentor: mentors[0] || null });
      }
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

    updateStudent: (student) => {
      const saved = db.upsertStudent(student);
      set({ currentStudent: saved });
      get().refreshData();
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

    refreshData: () => {
      if (typeof window === 'undefined') return;
      set({
        competitions: db.getCompetitions(),
        mentors: db.getMentors(),
        bookings: db.getSessionRequests(),
        meetings: db.getMeetings(),
        currentMentor: db.getMentors()[0] || null
      });
    },

    submitMentorApplication: (app) => {
      db.submitMentorApplication(app);
      get().refreshData();
    },

    approveMentorApplication: (appId) => {
      const updatedApp = db.updateMentorApplicationStatus(appId, 'approved');
      if (updatedApp) {
        // Send email notification trigger
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
      get().refreshData();
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

    bookSession: (mentorId, preferredTime, notes) => {
      const student = get().currentStudent;
      if (!student) return;

      const newBooking = db.createSessionRequest({
        student_id: student.id,
        mentor_id: mentorId,
        preferred_time: preferredTime,
        notes: notes
      });

      get().addSystemNotification({
        id: `book-${Date.now()}`,
        title: '📅 Session Requested',
        message: `Your session booking request has been sent to the mentor. Status is Pending.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      get().refreshData();
    },

    updateSessionStatus: (bookingId, status, preferred_time) => {
      const updatedBooking = db.updateSessionRequestStatus(bookingId, status, preferred_time);
      if (updatedBooking) {
        const student = db.getStudent(updatedBooking.student_id);
        const mentor = db.getMentor(updatedBooking.mentor_id);
        const { emailService } = require('./emailService');

        if (student && mentor) {
          if (status === 'approved') {
            const meetings = db.getMeetings();
            const meeting = meetings.find(m => m.session_id === bookingId);
            const zoomLink = meeting ? meeting.zoom_link : 'https://zoom.us/mock';
            
            // Send standard emails
            emailService.sendApprovalEmail(student.name, student.email, mentor.name, updatedBooking.preferred_time, zoomLink);
            emailService.sendSessionConfirmationEmail(student.name, student.email, mentor.name, mentor.email, updatedBooking.preferred_time, zoomLink);
          } else if (status === 'rejected') {
            emailService.sendRejectionEmail(student.name, student.email, mentor.name);
          } else if (status === 'rescheduled') {
            emailService.sendRescheduleEmail(student.name, student.email, mentor.name, updatedBooking.preferred_time);
          }
        }

        get().addSystemNotification({
          id: `session-status-${Date.now()}`,
          title: `📅 Session Status: ${status.toUpperCase()}`,
          message: `Booking has been marked as ${status}. Emails have been sent.`,
          type: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
      get().refreshData();
    },

    addCompetition: (comp) => {
      db.upsertCompetition(comp);
      get().addSystemNotification({
        id: `add-comp-${Date.now()}`,
        title: '🏆 New Competition Added',
        message: `${comp.title} by ${comp.company} is now available in the opportunities pool.`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      get().refreshData();
    },

    deleteCompetition: (compId) => {
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
      get().refreshData();
    }
  };
});

// Helper for exporting notification actions directly
export const addSystemNotification = (notification: Omit<SystemNotification, 'read'>) => {
  useStore.getState().addSystemNotification(notification);
};
