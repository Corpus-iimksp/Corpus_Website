const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
let envFile = '';
try {
  envFile = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error("❌ Could not find .env.local in the current directory.");
  process.exit(1);
}

const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let val = match[2] || '';
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[key] = val.trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local.");
  process.exit(1);
}

console.log(`🔌 Connecting to Supabase at: ${SUPABASE_URL}`);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Define Default Seed Data
const DEFAULT_COMPETITIONS = [
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

const DEFAULT_USERS = [
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
    participations: 4,
    saved_competitions: ['comp-1', 'comp-2', 'comp-3', 'comp-4'],
    competition_stages: {
      "comp-1": "won",
      "comp-2": "shortlisted",
      "comp-3": "participated",
      "comp-4": "participated"
    }
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

const DEFAULT_DECKS = [
  {
    id: 'deck-1',
    title: 'L\'Oréal Brandstorm 2024 - Paris Finalist Deck',
    competition: 'L\'Oréal Brandstorm',
    year: '2024',
    teamname: 'Team Mavericks',
    tags: ['Marketing', 'GTM', 'Sustainability'],
    fileurl: '#',
    previewimage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'deck-2',
    title: 'McKinsey Strategy Cup - Winning Solution',
    competition: 'McKinsey Strategy Cup',
    year: '2025',
    teamname: 'The Strategy Hub',
    tags: ['Consulting', 'Growth Strategy', 'M&A'],
    fileurl: '#',
    previewimage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'deck-3',
    title: 'Tata Imagination Challenge - National Winner PPT',
    competition: 'Tata Imagination Challenge',
    year: '2024',
    teamname: 'Genesis',
    tags: ['Product Launch', 'Pricing Strategy', 'Operations'],
    fileurl: '#',
    previewimage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300'
  }
];

const DEFAULT_FRAMEWORKS = [
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

const DEFAULT_QUIZZES = [
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

async function seedTable(tableName, data) {
  console.log(`🌱 Seeding table: '${tableName}' with ${data.length} records...`);
  const { error } = await supabase.from(tableName).upsert(data);
  if (error) {
    console.error(`❌ Error seeding table '${tableName}':`, error);
  } else {
    console.log(`✅ Table '${tableName}' seeded successfully!`);
  }
}

async function run() {
  try {
    await seedTable('competitions', DEFAULT_COMPETITIONS);
    await seedTable('users', DEFAULT_USERS);
    await seedTable('winning_decks', DEFAULT_DECKS);
    await seedTable('frameworks', DEFAULT_FRAMEWORKS);
    await seedTable('quizzes', DEFAULT_QUIZZES);
    console.log("\n🎉 Database seeding completed!");
  } catch (err) {
    console.error("❌ Unexpected seeding error:", err);
  }
}

run();
