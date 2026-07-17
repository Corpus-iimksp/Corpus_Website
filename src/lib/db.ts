import { createClient } from '@supabase/supabase-js';

// Types
export interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  program: string;
  year: string;
  resume: string;
  linkedin: string;
  interests: string[];
  badges: string[];
  wins: number;
  shortlists: number;
  participations: number;
  created_at?: string;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  college: string;
  batch: string;
  current_role: string;
  competitions_won: string[];
  expertise: string[];
  rating: number;
  profile_photo: string;
  available_days: string[];
  available_slots: string[];
  created_at?: string;
}

export interface MentorApplication {
  id: string;
  applicant_name: string;
  email: string;
  phone: string;
  linkedin: string;
  college: string;
  batch: string;
  current_role: string;
  competitions_won: string[];
  experience: string;
  expertise_areas: string[];
  resume_url: string;
  profile_photo: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Competition {
  id: string;
  title: string;
  company: string;
  category: 'Marketing' | 'Analytics' | 'Product' | 'Consulting' | 'Finance' | 'Operations' | 'HR';
  open_date: string;
  deadline: string;
  apply_link: string;
  prize_pool: string;
  organizer: string;
  timeline: string;
}

export interface SessionRequest {
  id: string;
  student_id: string;
  mentor_id: string;
  status: 'pending_admin' | 'pending_mentor' | 'approved' | 'rejected' | 'rescheduled';
  preferred_time: string;
  notes: string;
  competition_name: string;
  proof_url: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  session_id: string;
  zoom_link: string;
  zoom_id: string;
  meeting_time: string;
}

export interface WinningDeck {
  id: string;
  title: string;
  competition: string;
  year: string;
  teamName: string;
  tags: string[];
  fileUrl: string;
  previewImage: string;
}

export interface Framework {
  id: string;
  name: string;
  subtitle: string;
  front: string;
  back: string;
  gradient: string;
}



export interface QuizQuestion {
  q: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

const DEFAULT_FRAMEWORKS: Framework[] = [];



const DEFAULT_QUIZZES: Quiz[] = [];

// Initial Seed Data
const DEFAULT_COMPETITIONS: Competition[] = [];

const DEFAULT_MENTORS: Mentor[] = [];

const DEFAULT_DECKS: WinningDeck[] = [];

// Helper to determine if we should fall back
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const useFallback = !SUPABASE_URL || SUPABASE_URL.includes('YOUR_SUPABASE') || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');

// Initialize Supabase Client
export const supabase = !useFallback ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// LocalStorage Database Client Fallback
// Combined User Profile structure representing the database row
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'admin';
  college: string;
  program?: string;
  year?: string;
  resume?: string;
  linkedin?: string;
  interests?: string[];
  badges?: string[];
  wins?: number;
  shortlists?: number;
  participations?: number;
  batch?: string;
  current_role?: string;
  competitions_won?: string[];
  expertise?: string[];
  rating?: number;
  profile_photo?: string;
  available_days?: string[];
  available_slots?: string[];
  created_at?: string;
}

const DEFAULT_USERS: UserProfile[] = [];

// LocalStorage Database Client Fallback
class LocalDb {
  private getStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const data = localStorage.getItem(`corpus_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  }

  private setStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`corpus_${key}`, JSON.stringify(value));
  }

  // --- Unified Users (Students + Mentors + Admins) ---
  getUsers(): UserProfile[] {
    return this.getStorage<UserProfile[]>('users', DEFAULT_USERS);
  }

  getUser(id: string): UserProfile | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  getUserByEmail(email: string): UserProfile | null {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  upsertUser(user: UserProfile): UserProfile {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    this.setStorage('users', users);
    return user;
  }

  // --- Students (Compatibility wrappers for existing screens) ---
  getStudents(): Student[] {
    // Map profiles containing student data
    return this.getUsers() as unknown as Student[];
  }

  getStudent(id: string): Student | null {
    return this.getUser(id) as unknown as Student;
  }

  upsertStudent(student: Student): Student {
    const profile: UserProfile = {
      ...(this.getUser(student.id) || { role: 'student' }),
      ...student
    } as UserProfile;
    this.upsertUser(profile);
    return student;
  }

  // --- Mentors (Compatibility wrappers) ---
  getMentors(): Mentor[] {
    return this.getUsers().filter(u => u.role === 'mentor') as unknown as Mentor[];
  }

  getMentor(id: string): Mentor | null {
    const user = this.getUser(id);
    return user && user.role === 'mentor' ? (user as unknown as Mentor) : null;
  }

  upsertMentor(mentor: Mentor): Mentor {
    const profile: UserProfile = {
      ...(this.getUser(mentor.id) || { role: 'mentor' }),
      ...mentor,
      role: 'mentor'
    } as UserProfile;
    this.upsertUser(profile);
    return mentor;
  }

  deleteMentor(id: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter(u => !(u.id === id && u.role === 'mentor'));
    this.setStorage('users', filtered);
    return filtered.length !== users.length;
  }

  // --- Mentor Applications ---
  getMentorApplications(): MentorApplication[] {
    return this.getStorage<MentorApplication[]>('mentor_applications', []);
  }

  submitMentorApplication(app: Omit<MentorApplication, 'id' | 'status' | 'created_at'>): MentorApplication {
    const applications = this.getMentorApplications();
    const newApp: MentorApplication = {
      ...app,
      id: `app-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    applications.push(newApp);
    this.setStorage('mentor_applications', applications);
    return newApp;
  }

  updateMentorApplicationStatus(id: string, status: 'approved' | 'rejected'): MentorApplication | null {
    const applications = this.getMentorApplications();
    const idx = applications.findIndex(a => a.id === id);
    if (idx >= 0) {
      applications[idx].status = status;
      this.setStorage('mentor_applications', applications);

      // If approved, update user role to 'mentor' in users table
      if (status === 'approved') {
        const app = applications[idx];
        const existingUser = this.getUserByEmail(app.email);
        
        const profile: UserProfile = {
          ...(existingUser || {
            id: `user-${Date.now()}`,
            name: app.applicant_name,
            email: app.email,
            college: app.college,
          }),
          role: 'mentor',
          batch: app.batch,
          current_role: app.current_role,
          competitions_won: app.competitions_won,
          expertise: app.expertise_areas,
          rating: 5.0,
          profile_photo: app.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          available_days: ['Monday', 'Friday'],
          available_slots: ['18:00 - 19:00', '20:00 - 21:00']
        };
        this.upsertUser(profile);
      }
      return applications[idx];
    }
    return null;
  }

  // --- Competitions ---
  getCompetitions(): Competition[] {
    return this.getStorage<Competition[]>('competitions', DEFAULT_COMPETITIONS);
  }

  upsertCompetition(comp: Competition): Competition {
    const competitions = this.getCompetitions();
    const idx = competitions.findIndex(c => c.id === comp.id);
    if (idx >= 0) {
      competitions[idx] = comp;
    } else {
      competitions.push(comp);
    }
    this.setStorage('competitions', competitions);
    return comp;
  }

  deleteCompetition(id: string): boolean {
    const competitions = this.getCompetitions();
    const filtered = competitions.filter(c => c.id !== id);
    this.setStorage('competitions', filtered);
    return filtered.length !== competitions.length;
  }

  // --- Session Bookings ---
  getSessionRequests(): SessionRequest[] {
    return this.getStorage<SessionRequest[]>('session_requests', []);
  }

  createSessionRequest(req: Omit<SessionRequest, 'id' | 'status' | 'created_at'>): SessionRequest {
    const requests = this.getSessionRequests();
    const newReq: SessionRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'pending_admin',
      created_at: new Date().toISOString()
    };
    requests.push(newReq);
    this.setStorage('session_requests', requests);
    return newReq;
  }

  updateSessionRequestStatus(id: string, status: 'pending_admin' | 'pending_mentor' | 'approved' | 'rejected' | 'rescheduled', preferred_time?: string): SessionRequest | null {
    const requests = this.getSessionRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx >= 0) {
      requests[idx].status = status;
      if (preferred_time) {
        requests[idx].preferred_time = preferred_time;
      }
      this.setStorage('session_requests', requests);

      // If approved, create Zoom meeting record
      if (status === 'approved') {
        const req = requests[idx];
        const meetingId = Math.floor(100000000 + Math.random() * 900000000).toString();
        const newMeeting: Meeting = {
          id: `meet-${Date.now()}`,
          session_id: req.id,
          zoom_id: meetingId,
          zoom_link: `https://zoom.us/j/${meetingId}`,
          meeting_time: req.preferred_time
        };
        this.createMeeting(newMeeting);
      }

      return requests[idx];
    }
    return null;
  }

  // --- Meetings ---
  getMeetings(): Meeting[] {
    return this.getStorage<Meeting[]>('meetings', []);
  }

  createMeeting(meeting: Meeting): Meeting {
    const meetings = this.getMeetings();
    meetings.push(meeting);
    this.setStorage('meetings', meetings);
    return meeting;
  }

  // --- Decks ---
  getWinningDecks(): WinningDeck[] {
    return this.getStorage<WinningDeck[]>('winning_decks', DEFAULT_DECKS);
  }

  upsertWinningDeck(deck: WinningDeck): WinningDeck {
    const decks = this.getWinningDecks();
    const idx = decks.findIndex(d => d.id === deck.id);
    if (idx >= 0) {
      decks[idx] = deck;
    } else {
      decks.push(deck);
    }
    this.setStorage('winning_decks', decks);
    return deck;
  }

  deleteWinningDeck(id: string): boolean {
    const decks = this.getWinningDecks();
    const filtered = decks.filter(d => d.id !== id);
    this.setStorage('winning_decks', filtered);
    return filtered.length !== decks.length;
  }

  // --- Interactive Frameworks ---
  getFrameworks(): Framework[] {
    return this.getStorage<Framework[]>('learning_frameworks', DEFAULT_FRAMEWORKS);
  }

  upsertFramework(fw: Framework): Framework {
    const list = this.getFrameworks();
    const idx = list.findIndex(f => f.id === fw.id);
    if (idx >= 0) {
      list[idx] = fw;
    } else {
      list.push(fw);
    }
    this.setStorage('learning_frameworks', list);
    return fw;
  }

  deleteFramework(id: string): boolean {
    const list = this.getFrameworks();
    const filtered = list.filter(f => f.id !== id);
    this.setStorage('learning_frameworks', filtered);
    return filtered.length !== list.length;
  }



  // --- Mock Case Practice Quizzes ---
  getQuizzes(): Quiz[] {
    return this.getStorage<Quiz[]>('learning_quizzes', DEFAULT_QUIZZES);
  }

  upsertQuiz(quiz: Quiz): Quiz {
    const list = this.getQuizzes();
    const idx = list.findIndex(q => q.id === quiz.id);
    if (idx >= 0) {
      list[idx] = quiz;
    } else {
      list.push(quiz);
    }
    this.setStorage('learning_quizzes', list);
    return quiz;
  }

  deleteQuiz(id: string): boolean {
    const list = this.getQuizzes();
    const filtered = list.filter(q => q.id !== id);
    this.setStorage('learning_quizzes', filtered);
    return filtered.length !== list.length;
  }

  // --- Admin Access Control ---
  grantAdmin(email: string): UserProfile {
    const emailLower = email.trim().toLowerCase();
    const existing = this.getUserByEmail(emailLower);
    if (existing) {
      existing.role = 'admin';
      return this.upsertUser(existing);
    } else {
      const name = emailLower.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name,
        email: emailLower,
        role: 'admin',
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
      return this.upsertUser(newProfile);
    }
  }

  revokeAdmin(email: string): UserProfile | null {
    const emailLower = email.trim().toLowerCase();
    const existing = this.getUserByEmail(emailLower);
    if (existing) {
      existing.role = 'student';
      return this.upsertUser(existing);
    }
    return null;
  }
}

export const db = new LocalDb();
