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
  downloadsCount: number;
}

export interface Framework {
  id: string;
  name: string;
  subtitle: string;
  front: string;
  back: string;
  gradient: string;
}

export interface BasicsTopic {
  id: string;
  title: string;
  desc: string;
  insights: string[];
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

const DEFAULT_FRAMEWORKS: Framework[] = [
  {
    id: "fw-1",
    name: "Profitability Framework",
    subtitle: "Diagnose Profit Drops",
    front: "Used to isolate drivers of declining profits by branching Profit into Revenue and Costs.",
    back: "Profit = (Price x Quantity) - (Fixed Costs + Variable Costs)\n\nKey questions:\n1. Is it a revenue drop or cost rise?\n2. If revenue, is it a volume drop or price pressure?\n3. If cost, is fixed overhead rising or input materials?",
    gradient: "from-indigo-600 to-purple-600"
  },
  {
    id: "fw-2",
    name: "Market Entry",
    subtitle: "New Market Feasibility",
    front: "Analyze if a company should enter a new geographic region or product space.",
    back: "Four Core Pillars:\n1. Market attractiveness (size, growth, competitors)\n2. Financials (investment, break-even, margins)\n3. Capabilities (operations, supply, talent)\n4. Risk & Entry Mode (M&A, Joint Venture, Organic)",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    id: "fw-3",
    name: "Growth Strategy",
    subtitle: "Scale Revenues",
    front: "Identify avenues for business expansion and revenue optimization.",
    back: "Ansoff Matrix:\n1. Market Penetration (sell more existing products to existing users)\n2. Market Development (new users for existing products)\n3. Product Development (new products to existing users)\n4. Diversification (new products to new users)",
    gradient: "from-indigo-600 to-sky-600"
  },
  {
    id: "fw-4",
    name: "Pricing Strategy",
    subtitle: "Maximize Value Capture",
    front: "Determine how to price a new product or optimize current prices.",
    back: "Three Core Approaches:\n1. Cost-Based (cost + margin target)\n2. Competitor-Based (benchmarked to rivals)\n3. Value-Based (tied to customer willingness-to-pay & ROI)\n\nConsider segment bundles & elasticities.",
    gradient: "from-sky-600 to-purple-600"
  },
  {
    id: "fw-5",
    name: "M&A Framework",
    subtitle: "Evaluate Acquisitions",
    front: "Determine if merging with or buying another business makes commercial sense.",
    back: "Analysis Steps:\n1. Strategic fit (synergies, IP, market share)\n2. Valuation (financial multiples, cash flow)\n3. Post-merger integration costs & timeline\n4. Regulatory hurdle risks",
    gradient: "from-purple-600 to-sky-600"
  },
  {
    id: "fw-6",
    name: "GTM Framework",
    subtitle: "Go-To-Market Plan",
    front: "Plan launch vectors to take a new product directly to market.",
    back: "Five Action Pillars:\n1. Target Customer Segment (personas)\n2. Value Proposition (messaging)\n3. Channels (direct, retail, digital)\n4. Pricing Model & Promos\n5. KPIs (CAC, LTV, conversion rates)",
    gradient: "from-sky-600 to-indigo-600"
  }
];

const DEFAULT_BASICS_TOPICS: BasicsTopic[] = [
  {
    id: "topic-1",
    title: "What is a Case Competition?",
    desc: "A business case competition is a mock challenge where students formulate corporate solutions to complex problems under a tight deadline, pitching to panel judges.",
    insights: ["Always start with a clear problem definition.", "Focus on financial viability and real-world execution."]
  },
  {
    id: "topic-2",
    title: "Competition Lifecycle",
    desc: "Typical steps: Case Release -> 48-hour Prep -> Slide Deck upload -> Campus Heats -> Regional Semis -> National Grand Finale.",
    insights: ["Dedicate the first 20% of your time to structuring, not drafting.", "Rehearse Q&A thoroughly."]
  },
  {
    id: "topic-3",
    title: "Team Formation",
    desc: "Ideal team size is 3-4. Mix complementary skills: 1 Strategy Lead, 1 Financial Modeler, 1 GTM/Marketing Specialist, and 1 Visual Design master.",
    insights: ["A cohesive team of different backgrounds performs 3x better.", "Assign roles early."]
  },
  {
    id: "topic-4",
    title: "Presentation Design",
    desc: "Slide visuals dictate credibility. Use standard consulting palettes, executive summary banners on every slide, and 'So What?' message titles.",
    insights: ["Limit text per slide; use structure grids.", "Ensure charts have clean sources and highlights."]
  }
];

const DEFAULT_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    title: "Practice 1: Core Frameworks & MECE Structuring",
    questions: [
      {
        q: "Which framework divides profit into price, quantity, fixed cost, and variable cost?",
        options: ["Market Entry", "Profitability Framework", "Porter's Five Forces", "Growth Strategy (Ansoff)"],
        correctIndex: 1,
        feedback: "The Profitability Framework decomposes profits mathematically: Profit = (Price * Quantity) - (Fixed Costs + Variable Costs) to systematically isolate drivers."
      },
      {
        q: "If a company wants to evaluate expanding its current product line into a completely new geography, which framework is most appropriate?",
        options: ["Pricing Strategy", "Cost-Benefit Analysis", "Market Entry", "MECE Mutually Exclusive"],
        correctIndex: 2,
        feedback: "Market Entry is designed to evaluate entering new geography, product lines, or sectors across multiple operational and financial pillars."
      },
      {
        q: "What does MECE stand for in consulting problem-solving?",
        options: ["Mutually Exclusive, Collectively Exhaustive", "Most Effective, Cost Efficient", "Market Entry, Competitor Evaluation", "Macro Environment, Customer Experience"],
        correctIndex: 0,
        feedback: "MECE means categories should not overlap (mutually exclusive) and should cover all options (collectively exhaustive)."
      },
      {
        q: "Under the Ansoff Matrix, introducing new products to existing markets is known as:",
        options: ["Market Penetration", "Product Development", "Market Development", "Diversification"],
        correctIndex: 1,
        feedback: "Product Development involves offering new products to customers in existing target markets."
      },
      {
        q: "Which pricing strategy benchmarks price primarily against competitors' prices?",
        options: ["Value-Based Pricing", "Cost-Plus Pricing", "Competitor-Based Pricing", "Penetration Pricing"],
        correctIndex: 2,
        feedback: "Competitor-Based Pricing relies directly on prices set by other companies in the market."
      },
      {
        q: "In Porter's Five Forces, what does a high barrier to entry signify?",
        options: ["High threat of substitute products", "Low threat of new entrants", "High bargaining power of buyers", "Low industry rivalry"],
        correctIndex: 1,
        feedback: "High barriers to entry make it difficult for new competitors to enter the industry, resulting in a low threat of new entrants."
      },
      {
        q: "What is a GTM strategy's primary focus?",
        options: ["Finding internal corporate synergies", "Launching a new product/service to the market", "Reducing fixed manufacturing overheads", "Resolving legal compliance bottlenecks"],
        correctIndex: 1,
        feedback: "A Go-To-Market (GTM) strategy defines how a company launches and delivers its value proposition to target customers."
      },
      {
        q: "In value-based pricing, what is price primarily benchmarked against?",
        options: ["Total cost of production plus margin", "Competitors' prices", "Customer willingness-to-pay & perceived value", "Inflation rates"],
        correctIndex: 2,
        feedback: "Value-based pricing captures pricing power by benchmarking against the customer's perceived benefit and willingness-to-pay."
      },
      {
        q: "Which framework evaluates M&A opportunities?",
        options: ["GTM Framework", "M&A Framework", "Ansoff Matrix", "BCG Matrix"],
        correctIndex: 1,
        feedback: "The M&A Framework evaluates corporate acquisitions based on strategic fit, valuations, synergy capture, and integration hurdles."
      },
      {
        q: "A profitability diagnostic shows that passenger counts rose by 5%, but profitability fell. What is the logical first driver to isolate?",
        options: ["Fixed overhead costs", "Average yield per passenger vs fuel costs", "CEO compensation structure", "Global exchange rate fluctuations"],
        correctIndex: 1,
        feedback: "Since passenger volume rose but profits fell, revenue yield per passenger (pricing) or variable flight operating costs (fuel) must be isolated first."
      }
    ]
  },
  {
    id: "quiz-2",
    title: "Practice 2: Market Strategy & Industry Competitiveness",
    questions: [
      {
        q: "Which BCG Matrix quadrant represents businesses with high market share in slow-growing industries?",
        options: ["Stars", "Cash Cows", "Question Marks", "Dogs"],
        correctIndex: 1,
        feedback: "Cash Cows generate more cash than they consume, holding high share in mature markets."
      },
      {
        q: "What is the main driver behind Cost-Plus Pricing?",
        options: ["Competitor matching", "Production/operation costs plus a markup percentage", "Consumer survey data on pricing elasticity", "Brand prestige levels"],
        correctIndex: 1,
        feedback: "Cost-Plus pricing calculates price by adding a fixed profit margin markup to the calculated cost of production."
      },
      {
        q: "Which framework helps companies evaluate the micro-environment of an industry's competitiveness?",
        options: ["3 C's Model", "PESTEL Analysis", "Porter's Five Forces", "Value Chain"],
        correctIndex: 2,
        feedback: "Porter's Five Forces focuses on industry structure and rivalry dynamics, determining overall profit attractiveness."
      },
      {
        q: "If a company wants to sell its current products to current customers more frequently, they are pursuing:",
        options: ["Market Development", "Market Penetration", "Product Development", "Diversification"],
        correctIndex: 1,
        feedback: "Market Penetration seeks to capture more usage and frequency from existing customer segments with current products."
      },
      {
        q: "In the 3 C's framework, what are the three pillars?",
        options: ["Costs, Customers, Competitors", "Company, Customers, Competitors", "Company, Channels, Compliance", "Capital, Costs, Cashflow"],
        correctIndex: 1,
        feedback: "Kenichi Ohmae's 3 C's lists Company (internal skills), Customers (demographics & needs), and Competitors (rival strategies)."
      },
      {
        q: "What does PESTEL stand for?",
        options: ["Political, Economic, Social, Technological, Environmental, Legal", "Pricing, Elasticity, Sourcing, Taxes, Entry, Location", "Product, Promotion, Place, Price, Package, Position", "Profit, Equity, Sales, Turnover, Expenses, Liabilities"],
        correctIndex: 0,
        feedback: "PESTEL evaluates macro-environmental external drivers: Political, Economic, Social, Technological, Environmental, and Legal factors."
      },
      {
        q: "What is a synergy in the context of an acquisition?",
        options: ["The total debt inherited from the target firm", "Financial/operational value created when combined that exceeds sum of individual parts", "The regulatory approval process timeline", "The stock option dilution rate"],
        correctIndex: 1,
        feedback: "Synergies occur when '1 + 1 = 3', meaning cost savings or revenue cross-sell opportunities make the combined business more valuable than the sum of both separate entities."
      },
      {
        q: "Under what scenario is a Joint Venture entry mode preferred over organic entry?",
        options: ["When the company wants 100% control and ownership", "When local market knowledge and assets are critical but restricted", "When entering a market with no competitors", "When production costs are negligible"],
        correctIndex: 1,
        feedback: "Joint Ventures partner with local firms to leverage local assets, distribute risks, or comply with domestic foreign ownership regulations."
      },
      {
        q: "In GTM, what is CAC?",
        options: ["Capital Asset Cost", "Customer Acquisition Cost", "Corporate Affiliate Commission", "Customer Activity Count"],
        correctIndex: 1,
        feedback: "Customer Acquisition Cost (CAC) tracks total sales and marketing spend divided by the number of new customers acquired."
      },
      {
        q: "MECE analysis requires that problem categories should be:",
        options: ["Extremely complex", "Mutually exclusive and collectively exhaustive", "Cost-minimizing and revenue-maximizing", "Aligned with competitor branding"],
        correctIndex: 1,
        feedback: "MECE stands for Mutually Exclusive (no overlap) and Collectively Exhaustive (covers all issues, no gaps)."
      }
    ]
  }
];

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

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'student-demo',
    name: 'Aravind Swamy',
    email: 'aravind.swamy.pgp26@iimkashipur.ac.in',
    role: 'student',
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
  },
  {
    id: 'mentor-1',
    name: 'Abhishek Sen',
    email: 'abhishek.sen.pgp25@iimkashipur.ac.in',
    role: 'mentor',
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
    role: 'mentor',
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
    role: 'mentor',
    college: 'IIM Kashipur',
    batch: '2022-24',
    current_role: 'Product Manager at Microsoft',
    competitions_won: ['Tata Imagination Challenge National Winner', 'Uber Elevate Winner'],
    expertise: ['Product', 'Analytics', 'Pricing Strategy'],
    rating: 4.95,
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    available_days: ['Friday', 'Saturday'],
    available_slots: ['18:00 - 19:00', '19:30 - 20:30', '21:00 - 22:00']
  },
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'roushan.mbaa25133@iimkashipur.ac.in',
    role: 'admin',
    college: 'IIM Kashipur',
    current_role: 'Student Admin Panel',
    profile_photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  }
];

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

  // --- Case Basics 101 Topics ---
  getBasicsTopics(): BasicsTopic[] {
    return this.getStorage<BasicsTopic[]>('learning_basics', DEFAULT_BASICS_TOPICS);
  }

  upsertBasicsTopic(topic: BasicsTopic): BasicsTopic {
    const list = this.getBasicsTopics();
    const idx = list.findIndex(t => t.id === topic.id);
    if (idx >= 0) {
      list[idx] = topic;
    } else {
      list.push(topic);
    }
    this.setStorage('learning_basics', list);
    return topic;
  }

  deleteBasicsTopic(id: string): boolean {
    const list = this.getBasicsTopics();
    const filtered = list.filter(t => t.id !== id);
    this.setStorage('learning_basics', filtered);
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
