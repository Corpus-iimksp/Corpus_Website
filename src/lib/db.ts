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
  status: 'pending' | 'approved' | 'rejected' | 'rescheduled';
  preferred_time: string;
  notes: string;
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
  downloadsCount: number;
}

// Initial Seed Data
const DEFAULT_COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: 'L\'Oréal Brandstorm 2026',
    company: 'L\'Oréal',
    category: 'Marketing',
    open_date: '2026-05-01',
    deadline: '2026-07-15',
    apply_link: 'https://brandstorm.loreal.com',
    prize_pool: '₹15,00,000 + Paris Trip',
    organizer: 'L\'Oréal Global',
    timeline: 'Launch -> Campus Round -> National Semis -> National Finals -> International Finals'
  },
  {
    id: 'comp-2',
    title: 'HUL L.I.M.E. Season 18',
    company: 'Hindustan Unilever',
    category: 'Marketing',
    open_date: '2026-06-10',
    deadline: '2026-07-28',
    apply_link: 'https://www.hul.co.in',
    prize_pool: '₹10,00,000 + PPO',
    organizer: 'HUL India',
    timeline: 'Case Release -> Campus Submission -> Semis -> Grand Finale'
  },
  {
    id: 'comp-3',
    title: 'McKinsey Case Excellence',
    company: 'McKinsey & Company',
    category: 'Consulting',
    open_date: '2026-06-15',
    deadline: '2026-08-05',
    apply_link: 'https://mckinsey.com',
    prize_pool: '₹8,00,000 + Mentorship',
    organizer: 'McKinsey India Office',
    timeline: 'Round 1 MCQ -> Case Presentation -> Partner Interviews'
  },
  {
    id: 'comp-4',
    title: 'Tata Imagination Challenge',
    company: 'Tata Group',
    category: 'Product',
    open_date: '2026-07-01',
    deadline: '2026-08-20',
    apply_link: 'https://tatatitans.com',
    prize_pool: '₹5,00,000 + Tata Seminar',
    organizer: 'Tata Sons',
    timeline: 'Ideation Quiz -> Case Submission -> Video Pitch -> National Pitch'
  },
  {
    id: 'comp-5',
    title: 'KPMG K-Innovate Analytics',
    company: 'KPMG',
    category: 'Analytics',
    open_date: '2026-06-01',
    deadline: '2026-07-10',
    apply_link: 'https://kpmg.com',
    prize_pool: '₹6,00,000 + PPO interviews',
    organizer: 'KPMG Analytics',
    timeline: 'Dataset Release -> Jupyter Submission -> Dashboard Demo'
  },
  {
    id: 'comp-6',
    title: 'Amazon Ace Challenge',
    company: 'Amazon',
    category: 'Operations',
    open_date: '2026-07-05',
    deadline: '2026-08-15',
    apply_link: 'https://amazon.jobs',
    prize_pool: '₹7,50,000 + AWS Credits',
    organizer: 'Amazon Operations',
    timeline: 'Round 1 Simulation -> Case Study -> Live Pitch'
  }
];

const DEFAULT_MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Abhishek Sen',
    email: 'abhishek.sen.pgp25@iimkashipur.ac.in',
    college: 'IIM Kashipur',
    batch: '2023-25',
    current_role: 'Associate Consultant at Bain & Co.',
    competitions_won: ['L\'Oréal Brandstorm National Winner', 'McKinsey Strategy Cup Runner-up'],
    expertise: ['Consulting', 'Marketing', 'Presentation Design'],
    rating: 4.9,
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    available_days: ['Monday', 'Wednesday', 'Saturday'],
    available_slots: ['17:00 - 18:00', '18:30 - 19:30', '21:00 - 22:00']
  },
  {
    id: 'mentor-2',
    name: 'Priya Sharma',
    email: 'priya.sharma.pgp25@iimkashipur.ac.in',
    college: 'IIM Kashipur',
    batch: '2023-25',
    current_role: 'Management Trainee at HUL',
    competitions_won: ['HUL L.I.M.E. Season 16 National Champion', 'Colgate Transcend Winner'],
    expertise: ['Marketing', 'GTM Framework', 'Growth Strategy'],
    rating: 4.85,
    profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    available_days: ['Tuesday', 'Thursday', 'Sunday'],
    available_slots: ['16:00 - 17:00', '19:00 - 20:00', '20:30 - 21:30']
  },
  {
    id: 'mentor-3',
    name: 'Rohan Mehta',
    email: 'rohan.mehta.pgp24@iimkashipur.ac.in',
    college: 'IIM Kashipur',
    batch: '2022-24',
    current_role: 'Product Manager at Microsoft',
    competitions_won: ['Tata Imagination Challenge National Winner', 'Uber Elevate Winner'],
    expertise: ['Product', 'Analytics', 'Pricing Strategy'],
    rating: 4.95,
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    available_days: ['Friday', 'Saturday'],
    available_slots: ['18:00 - 19:00', '19:30 - 20:30', '21:00 - 22:00']
  }
];

const DEFAULT_DECKS: WinningDeck[] = [
  {
    id: 'deck-1',
    title: 'L\'Oréal Brandstorm 2024 - Paris Finalist Deck',
    competition: 'L\'Oréal Brandstorm',
    year: '2024',
    teamName: 'Team Mavericks',
    tags: ['Marketing', 'GTM', 'Sustainability'],
    fileUrl: '#',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
    downloadsCount: 142
  },
  {
    id: 'deck-2',
    title: 'McKinsey Strategy Cup - Winning Solution',
    competition: 'McKinsey Strategy Cup',
    year: '2025',
    teamName: 'The Strategy Hub',
    tags: ['Consulting', 'Growth Strategy', 'M&A'],
    fileUrl: '#',
    previewImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=300',
    downloadsCount: 98
  },
  {
    id: 'deck-3',
    title: 'Tata Imagination Challenge - National Winner PPT',
    competition: 'Tata Imagination Challenge',
    year: '2024',
    teamName: 'Genesis',
    tags: ['Product Launch', 'Pricing Strategy', 'Operations'],
    fileUrl: '#',
    previewImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300',
    downloadsCount: 215
  }
];

// Helper to determine if we should fall back
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const useFallback = !SUPABASE_URL || SUPABASE_URL.includes('YOUR_SUPABASE') || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');

// Initialize Supabase Client
export const supabase = !useFallback ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

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

  // --- Students ---
  getStudents(): Student[] {
    return this.getStorage<Student[]>('students', []);
  }

  getStudent(id: string): Student | null {
    const students = this.getStudents();
    return students.find(s => s.id === id) || null;
  }

  upsertStudent(student: Student): Student {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === student.id || s.email === student.email);
    if (idx >= 0) {
      students[idx] = { ...students[idx], ...student };
    } else {
      students.push(student);
    }
    this.setStorage('students', students);
    return student;
  }

  // --- Mentors ---
  getMentors(): Mentor[] {
    return this.getStorage<Mentor[]>('mentors', DEFAULT_MENTORS);
  }

  getMentor(id: string): Mentor | null {
    const mentors = this.getMentors();
    return mentors.find(m => m.id === id) || null;
  }

  upsertMentor(mentor: Mentor): Mentor {
    const mentors = this.getMentors();
    const idx = mentors.findIndex(m => m.id === mentor.id || m.email === mentor.email);
    if (idx >= 0) {
      mentors[idx] = { ...mentors[idx], ...mentor };
    } else {
      mentors.push(mentor);
    }
    this.setStorage('mentors', mentors);
    return mentor;
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

      // If approved, add application to Mentors table
      if (status === 'approved') {
        const app = applications[idx];
        const newMentor: Mentor = {
          id: `mentor-${Date.now()}`,
          name: app.applicant_name,
          email: app.email,
          college: app.college,
          batch: app.batch,
          current_role: app.current_role,
          competitions_won: app.competitions_won,
          expertise: app.expertise_areas,
          rating: 5.0, // Initial rating
          profile_photo: app.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          available_days: ['Monday', 'Friday'], // default
          available_slots: ['18:00 - 19:00', '20:00 - 21:00'] // default
        };
        this.upsertMentor(newMentor);
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

  // --- Session Requests ---
  getSessionRequests(): SessionRequest[] {
    return this.getStorage<SessionRequest[]>('session_requests', []);
  }

  createSessionRequest(req: Omit<SessionRequest, 'id' | 'status' | 'created_at'>): SessionRequest {
    const requests = this.getSessionRequests();
    const newReq: SessionRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    requests.push(newReq);
    this.setStorage('session_requests', requests);
    return newReq;
  }

  updateSessionRequestStatus(id: string, status: 'approved' | 'rejected' | 'rescheduled', preferred_time?: string): SessionRequest | null {
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
}

export const db = new LocalDb();
