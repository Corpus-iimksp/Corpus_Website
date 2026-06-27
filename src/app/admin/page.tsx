'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { db, Competition, MentorApplication } from '@/lib/db';
import { 
  Users, 
  UserCheck, 
  Trophy, 
  Calendar, 
  Trash2, 
  Check, 
  X, 
  TrendingUp, 
  ExternalLink,
  Plus,
  Sparkles,
  BarChart,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const { 
    competitions, 
    mentors, 
    bookings, 
    addCompetition, 
    deleteCompetition, 
    addMentor,
    updateMentor,
    deleteMentor,
    refreshData,
    currentUser,
    currentRole,
    updateSessionStatus,
    grantAdmin,
    revokeAdmin,
    winningDecks,
    addWinningDeck,
    updateWinningDeck,
    deleteWinningDeck,
    students,
    frameworks,
    addFramework,
    updateFramework,
    deleteFramework,
    basicsTopics,
    addBasicsTopic,
    updateBasicsTopic,
    deleteBasicsTopic,
    quizzes,
    addQuiz,
    updateQuiz,
    deleteQuiz
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'mentors' | 'competitions' | 'sessions' | 'admins' | 'decks'>('analytics');
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [mounted, setMounted] = useState(false);

  // Edit state trackers
  const [editingCompId, setEditingCompId] = useState<string | null>(null);
  const [editingMentorId, setEditingMentorId] = useState<string | null>(null);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);

  const [activeHubTab, setActiveHubTab] = useState<'decks' | 'frameworks' | 'basics' | 'quizzes'>('decks');

  // Framework states
  const [editingFrameworkId, setEditingFrameworkId] = useState<string | null>(null);
  const [fwName, setFwName] = useState('');
  const [fwSubtitle, setFwSubtitle] = useState('');
  const [fwFront, setFwFront] = useState('');
  const [fwBack, setFwBack] = useState('');
  const [fwGradient, setFwGradient] = useState('from-indigo-600 to-purple-600');

  // Basics states
  const [editingBasicsId, setEditingBasicsId] = useState<string | null>(null);
  const [basicsTitle, setBasicsTitle] = useState('');
  const [basicsDesc, setBasicsDesc] = useState('');
  const [basicsInsights, setBasicsInsights] = useState('');

  // Quiz states
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizTitleText, setQuizTitleText] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<{ q: string; options: string[]; correctIndex: number; feedback: string }[]>([]);
  
  // Quiz Question builder form inputs
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qFeedback, setQFeedback] = useState('');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // Slide Decks Form States
  const [deckTitle, setDeckTitle] = useState('');
  const [deckCompetition, setDeckCompetition] = useState('');
  const [deckYear, setDeckYear] = useState('2025');
  const [deckTeamName, setDeckTeamName] = useState('');
  const [deckTags, setDeckTags] = useState('');
  const [deckFileUrl, setDeckFileUrl] = useState('');
  const [deckPreviewImage, setDeckPreviewImage] = useState('');

  // New Mentor Form States
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorCollege, setMentorCollege] = useState('IIM Kashipur');
  const [mentorBatch, setMentorBatch] = useState('');
  const [mentorCurrentRole, setMentorCurrentRole] = useState('');
  const [mentorCompWon, setMentorCompWon] = useState('');
  const [mentorPhoto, setMentorPhoto] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [mentorSlots, setMentorSlots] = useState('17:00 - 18:00, 19:30 - 20:30');

  // New Competition Form States
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newCategory, setNewCategory] = useState<'Consulting' | 'Marketing' | 'Product' | 'Analytics' | 'Finance' | 'Operations' | 'HR'>('Consulting');
  const [newOpenDate, setNewOpenDate] = useState('2026-06-01');
  const [newDeadline, setNewDeadline] = useState('2026-08-01');
  const [newPrize, setNewPrize] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newTimeline, setNewTimeline] = useState('');
  const [newApplyLink, setNewApplyLink] = useState('');

  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const toggleExpertise = (val: string) => {
    if (selectedExpertise.includes(val)) {
      setSelectedExpertise(selectedExpertise.filter(x => x !== val));
    } else {
      setSelectedExpertise([...selectedExpertise, val]);
    }
  };

  const toggleDay = (val: string) => {
    if (selectedDays.includes(val)) {
      setSelectedDays(selectedDays.filter(x => x !== val));
    } else {
      setSelectedDays([...selectedDays, val]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setMentorPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeckImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setDeckPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorName || !mentorEmail) return;

    const compWonList = mentorCompWon.split(',').map(s => s.trim()).filter(Boolean);
    const slotsList = mentorSlots.split(',').map(s => s.trim()).filter(Boolean);

    const mentorObj = {
      id: editingMentorId || `mentor-${Date.now()}`,
      name: mentorName,
      email: mentorEmail,
      college: mentorCollege,
      batch: mentorBatch || '2024-26',
      current_role: mentorCurrentRole || 'MBA Candidate',
      competitions_won: compWonList,
      expertise: selectedExpertise,
      rating: 5.0,
      profile_photo: mentorPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      available_days: selectedDays.length > 0 ? selectedDays : ['Monday', 'Friday'],
      available_slots: slotsList.length > 0 ? slotsList : ['18:00 - 19:00', '20:00 - 21:00']
    };

    if (editingMentorId) {
      updateMentor(mentorObj);
    } else {
      addMentor(mentorObj);
    }

    // Reset Form
    setMentorName('');
    setMentorEmail('');
    setMentorCollege('IIM Kashipur');
    setMentorBatch('');
    setMentorCurrentRole('');
    setMentorCompWon('');
    setMentorPhoto('');
    setSelectedExpertise([]);
    setSelectedDays([]);
    setMentorSlots('17:00 - 18:00, 19:30 - 20:30');
    setEditingMentorId(null);

    alert(editingMentorId ? `Success: Mentor profile for ${mentorName} has been updated!` : `Success: Mentor profile for ${mentorName} has been published directly!`);
  };

  // Handle Competition creation & edit
  const handleAddComp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany || !newPrize) return;

    const compObj: Competition = {
      id: editingCompId || `comp-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      category: newCategory,
      open_date: newOpenDate,
      deadline: newDeadline,
      apply_link: newApplyLink || 'https://google.com',
      prize_pool: newPrize,
      organizer: newOrganizer || newCompany,
      timeline: newTimeline || 'Standard round checklist'
    };

    addCompetition(compObj);
    
    // Reset form
    setNewTitle('');
    setNewCompany('');
    setNewPrize('');
    setNewOrganizer('');
    setNewTimeline('');
    setNewApplyLink('');
    setEditingCompId(null);
    
    alert(editingCompId ? 'Success: Competition details have been updated!' : 'Success: New Competition has been added and published!');
  };

  // Handle Slide Deck creation & edit
  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckTitle || !deckCompetition || !deckYear || !deckTeamName) return;

    const tagsList = deckTags.split(',').map(s => s.trim()).filter(Boolean);

    const deckObj = {
      id: editingDeckId || `deck-${Date.now()}`,
      title: deckTitle,
      competition: deckCompetition,
      year: deckYear,
      teamName: deckTeamName,
      tags: tagsList,
      fileUrl: deckFileUrl || 'https://google.com',
      previewImage: deckPreviewImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      downloadsCount: 0
    };

    if (editingDeckId) {
      updateWinningDeck(deckObj);
    } else {
      addWinningDeck(deckObj);
    }

    // Reset Form
    setDeckTitle('');
    setDeckCompetition('');
    setDeckYear('2025');
    setDeckTeamName('');
    setDeckTags('');
    setDeckFileUrl('');
    setDeckPreviewImage('');
    setEditingDeckId(null);

    alert(editingDeckId ? `Success: Slide deck "${deckTitle}" has been updated!` : `Success: Slide deck "${deckTitle}" has been published directly!`);
  };

  // Handle Framework creation & edit
  const handleCreateFramework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fwName || !fwSubtitle || !fwFront || !fwBack) return;

    const fwObj = {
      id: editingFrameworkId || `fw-${Date.now()}`,
      name: fwName,
      subtitle: fwSubtitle,
      front: fwFront,
      back: fwBack,
      gradient: fwGradient
    };

    if (editingFrameworkId) {
      updateFramework(fwObj);
    } else {
      addFramework(fwObj);
    }

    // Reset Form
    setFwName('');
    setFwSubtitle('');
    setFwFront('');
    setFwBack('');
    setFwGradient('from-indigo-600 to-purple-600');
    setEditingFrameworkId(null);

    alert(editingFrameworkId ? 'Success: Framework updated!' : 'Success: Framework published!');
  };

  // Handle Case Basics creation & edit
  const handleCreateBasicsTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!basicsTitle || !basicsDesc) return;

    const insightsList = basicsInsights
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const topicObj = {
      id: editingBasicsId || `topic-${Date.now()}`,
      title: basicsTitle,
      desc: basicsDesc,
      insights: insightsList
    };

    if (editingBasicsId) {
      updateBasicsTopic(topicObj);
    } else {
      addBasicsTopic(topicObj);
    }

    // Reset Form
    setBasicsTitle('');
    setBasicsDesc('');
    setBasicsInsights('');
    setEditingBasicsId(null);

    alert(editingBasicsId ? 'Success: Basics Topic updated!' : 'Success: Basics Topic published!');
  };

  // Handle Quiz creation & edit
  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitleText) return;
    if (quizQuestions.length === 0) {
      alert('Please add at least one question to the quiz.');
      return;
    }

    const quizObj = {
      id: editingQuizId || `quiz-${Date.now()}`,
      title: quizTitleText,
      questions: quizQuestions
    };

    if (editingQuizId) {
      updateQuiz(quizObj);
    } else {
      addQuiz(quizObj);
    }

    // Reset Form
    setQuizTitleText('');
    setQuizQuestions([]);
    setEditingQuizId(null);
    clearQuestionBuilder();

    alert(editingQuizId ? 'Success: Practice Quiz updated!' : 'Success: Practice Quiz published!');
  };

  const clearQuestionBuilder = () => {
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrectIndex(0);
    setQFeedback('');
    setEditingQuestionIndex(null);
  };

  const handleAddQuestionToBuilder = () => {
    if (!qText || !qOptA || !qOptB || !qOptC || !qOptD) {
      alert('Please fill out the question and all four options.');
      return;
    }

    const newQuestionObj = {
      q: qText,
      options: [qOptA, qOptB, qOptC, qOptD],
      correctIndex: qCorrectIndex,
      feedback: qFeedback || 'None'
    };

    if (editingQuestionIndex !== null) {
      const updated = [...quizQuestions];
      updated[editingQuestionIndex] = newQuestionObj;
      setQuizQuestions(updated);
    } else {
      setQuizQuestions([...quizQuestions, newQuestionObj]);
    }

    clearQuestionBuilder();
  };

  // Charts Mock Data
  const monthlyGrowthData = [
    { name: 'Jan', students: 120, sessions: 12 },
    { name: 'Feb', students: 180, sessions: 25 },
    { name: 'Mar', students: 310, sessions: 42 },
    { name: 'Apr', students: 480, sessions: 65 },
    { name: 'May', students: 650, sessions: 98 },
    { name: 'Jun', students: 820, sessions: 140 }
  ];

  const categoryDistributionData = [
    { category: 'Consulting', count: competitions.filter(c => c.category === 'Consulting').length || 2 },
    { category: 'Marketing', count: competitions.filter(c => c.category === 'Marketing').length || 2 },
    { category: 'Product', count: competitions.filter(c => c.category === 'Product').length || 1 },
    { category: 'Analytics', count: competitions.filter(c => c.category === 'Analytics').length || 1 },
    { category: 'Finance', count: competitions.filter(c => c.category === 'Finance').length || 0 },
    { category: 'Operations', count: competitions.filter(c => c.category === 'Operations').length || 1 }
  ];

  const studentsList = students;

  // Cohort & Gender analysis logic
  let mbaCount = 0;
  let mbaaCount = 0;
  let maleCount = 0;
  let femaleCount = 0;

  studentsList.forEach(student => {
    const email = student.email.toLowerCase();
    if (email.includes('.mbaa')) {
      mbaaCount++;
    } else if (email.includes('.mba')) {
      mbaCount++;
    } else {
      // Fallback distribution
      const charSum = student.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      if (charSum % 2 === 0) {
        mbaaCount++;
      } else {
        mbaCount++;
      }
    }

    const nameLower = student.name.toLowerCase();
    const femaleNames = ['priya', 'sharma', 'aarti', 'neha', 'divya', 'ananya', 'sneha', 'riddhi', 'aditi', 'pooja', 'kiran', 'shreya'];
    if (femaleNames.some(n => nameLower.includes(n))) {
      femaleCount++;
    } else {
      const charSum = student.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      if (charSum % 3 === 0) {
        femaleCount++;
      } else {
        maleCount++;
      }
    }
  });

  const cohortData = [
    { name: 'MBA', value: mbaCount, color: '#3b82f6' },
    { name: 'MBA Analytics', value: mbaaCount, color: '#10b981' }
  ];

  const genderData = [
    { name: 'Male', value: maleCount, color: '#6366f1' },
    { name: 'Female', value: femaleCount, color: '#ec4899' }
  ];

  const mentorRatio = mentors.length > 0 ? (studentsList.length / mentors.length).toFixed(1) : studentsList.length.toFixed(1);

  const envAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'teamcorpus@iimkashipur.ac.in')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);

  if (mounted && (!currentUser || currentRole !== 'admin')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-md mx-auto space-y-6">
        <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Admin Control Locked</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Authorized access strictly restricted to the official system administrator accounts: <span className="text-amber-400 font-bold">{envAdmins.join(', ')}</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Banner */}
      <div className="border-b border-white/5 pb-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            🛡️ Admin Control Panel
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            System overview. Approve mentor registry entries, create corporate opportunities, and analyze bookings.
          </p>
        </div>

        {/* Admin Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-zinc-900 border border-white/5 rounded-xl p-1 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveAdminTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'analytics' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveAdminTab('mentors')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'mentors' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            🤝 Manage Mentors ({mentors.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('competitions')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'competitions' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            🏆 Opportunities
          </button>

          <button
            onClick={() => setActiveAdminTab('sessions')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'sessions' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            📅 Booking Approvals ({bookings.filter(b => b.status === 'pending_admin').length})
          </button>

          <button
            onClick={() => setActiveAdminTab('decks')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'decks' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            📖 Manage Learning Hub
          </button>
        </div>
      </div>

      {/* Main Admin Tab Panel Content */}
      
      {/* 1. ANALYTICS & CHARTS PANEL */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Total Students</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">{studentsList.length || 1}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Active Mentors</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">{mentors.length}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Opportunities</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">{competitions.length}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Bookings Met</span>
              <span className="text-3xl font-black text-amber-400 mt-1 block">{bookings.length}</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Slide Decks</span>
              <span className="text-3xl font-black text-indigo-400 mt-1 block">{winningDecks.length}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Frameworks</span>
              <span className="text-3xl font-black text-indigo-400 mt-1 block">{frameworks.length}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Case Basics</span>
              <span className="text-3xl font-black text-indigo-400 mt-1 block">{basicsTopics.length}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Practice Quizzes</span>
              <span className="text-3xl font-black text-indigo-400 mt-1 block">{quizzes.length}</span>
            </div>
          </div>

          {/* Recharts Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Cohort & Student-Mentor Ratio */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-black text-zinc-300 uppercase tracking-wider mb-4">Cohort Distribution</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-450 font-medium">MBA Candidates</span>
                      <span className="text-blue-400 font-bold">{mbaCount} ({studentsList.length > 0 ? Math.round((mbaCount / studentsList.length) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-2 border border-white/5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${studentsList.length > 0 ? (mbaCount / studentsList.length) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-450 font-medium">MBA Analytics Candidates</span>
                      <span className="text-emerald-400 font-bold">{mbaaCount} ({studentsList.length > 0 ? Math.round((mbaaCount / studentsList.length) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-2 border border-white/5">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${studentsList.length > 0 ? (mbaaCount / studentsList.length) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-black text-zinc-500 tracking-wider">Student-Mentor Ratio</span>
                  <span className="text-2xl font-black text-white block mt-0.5">{mentorRatio} : 1</span>
                </div>
                <div className="text-[10px] text-zinc-500 leading-tight text-right max-w-[130px]">
                  Average number of students assigned per registered mentor.
                </div>
              </div>
            </div>

            {/* Gender wise bifurcation Pie Chart */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-between">
              <h3 className="text-sm font-black text-zinc-300 uppercase tracking-wider mb-4">Gender Distribution</h3>
              <div className="h-48 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#f4f4f5', fontSize: '11px' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(value) => <span className="text-[10px] text-zinc-400 font-semibold">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competition Category Distribution Bar Chart */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-between">
              <h3 className="text-sm font-black text-zinc-300 uppercase tracking-wider mb-6">Competitions Category Split</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={categoryDistributionData}>
                    <XAxis dataKey="category" stroke="#52525b" fontSize={9} />
                    <YAxis stroke="#52525b" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#f4f4f5', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. MANAGE MENTORS PANEL */}
      {activeAdminTab === 'mentors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Mentor Form */}
          <div>
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-4">
                {editingMentorId ? 'Edit Mentor Profile' : 'Create Mentor Profile'}
              </h3>
              
              <form onSubmit={handleCreateMentor} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    placeholder="E.g., Kunal Kapoor"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={mentorEmail}
                    onChange={(e) => setMentorEmail(e.target.value)}
                    placeholder="E.g., kunal.k@iimkashipur.ac.in"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">College</label>
                    <input
                      type="text"
                      required
                      value={mentorCollege}
                      onChange={(e) => setMentorCollege(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Batch</label>
                    <input
                      type="text"
                      required
                      value={mentorBatch}
                      onChange={(e) => setMentorBatch(e.target.value)}
                      placeholder="E.g., 2024-26"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Current Role</label>
                  <input
                    type="text"
                    required
                    value={mentorCurrentRole}
                    onChange={(e) => setMentorCurrentRole(e.target.value)}
                    placeholder="E.g., Associate Consultant at Bain"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Profile Photo</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center bg-zinc-900/40 p-3 rounded-xl border border-white/5">
                    
                    {/* Thumbnail preview */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {mentorPhoto ? (
                          <img src={mentorPhoto} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-zinc-600 font-bold uppercase">No Pic</span>
                        )}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-extrabold text-zinc-300">Live Preview</span>
                        <span className="text-[9px] text-zinc-500">{mentorPhoto ? 'Custom photo set' : 'Default placeholder active'}</span>
                      </div>
                    </div>

                    {/* Upload button or link entry */}
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-zinc-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 text-[10px] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={mentorPhoto.startsWith('data:') ? '' : mentorPhoto}
                        onChange={(e) => setMentorPhoto(e.target.value)}
                        placeholder="Or paste external image URL..."
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg p-1.5 text-zinc-300 focus:outline-none text-[10px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Case Competitions Won (comma separated)</label>
                  <input
                    type="text"
                    value={mentorCompWon}
                    onChange={(e) => setMentorCompWon(e.target.value)}
                    placeholder="Win 1, Win 2..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                  />
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1.5">Expertise Areas</label>
                  <div className="flex flex-wrap gap-1">
                    {['Consulting', 'Marketing', 'Product', 'Analytics', 'Finance', 'Operations', 'HR'].map((opt) => {
                      const active = selectedExpertise.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleExpertise(opt)}
                          className={`px-2 py-1 rounded border font-bold text-[10px] transition-all ${
                            active
                              ? 'bg-amber-500/25 border-amber-500/50 text-amber-400'
                              : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Days */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1.5">Available Days</label>
                  <div className="flex flex-wrap gap-1">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                      const active = selectedDays.includes(day);
                      return (
                        <button
                          type="button"
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-2 py-1 rounded border font-bold text-[10px] transition-all ${
                            active
                              ? 'bg-amber-500/25 border-amber-500/50 text-amber-400'
                              : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Hourly Slots (comma separated)</label>
                  <input
                    type="text"
                    value={mentorSlots}
                    onChange={(e) => setMentorSlots(e.target.value)}
                    placeholder="17:00 - 18:00, 19:30 - 20:30"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-black transition-colors"
                >
                  {editingMentorId ? 'Update Mentor Profile' : 'Publish Mentor Profile'}
                </button>
                {editingMentorId && (
                  <button
                    type="button"
                    onClick={() => {
                      setMentorName('');
                      setMentorEmail('');
                      setMentorCollege('IIM Kashipur');
                      setMentorBatch('');
                      setMentorCurrentRole('');
                      setMentorCompWon('');
                      setMentorPhoto('');
                      setSelectedExpertise([]);
                      setSelectedDays([]);
                      setMentorSlots('17:00 - 18:00, 19:30 - 20:30');
                      setEditingMentorId(null);
                    }}
                    className="w-full mt-2 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* List Mentors */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Mentor Directory ({mentors.length})</h3>
            
            <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                      <th className="p-4">Mentor Info</th>
                      <th className="p-4">Batch</th>
                      <th className="p-4">Expertise</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {mentors.map((mentor) => (
                      <tr key={mentor.id} className="hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-zinc-200 flex items-center gap-3">
                          <img src={mentor.profile_photo} alt="" className="w-8 h-8 rounded-full object-cover border border-white/5 shrink-0" />
                          <div>
                            {mentor.name}
                            <span className="block text-[10px] text-zinc-500 font-medium">{mentor.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-400">{mentor.batch}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {mentor.expertise.map((x, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-900 text-[9px] border border-white/5 text-zinc-300">
                                {x}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setEditingMentorId(mentor.id);
                              setMentorName(mentor.name);
                              setMentorEmail(mentor.email);
                              setMentorCollege(mentor.college);
                              setMentorBatch(mentor.batch || '');
                              setMentorCurrentRole(mentor.current_role || '');
                              setMentorCompWon(mentor.competitions_won.join(', '));
                              setMentorPhoto(mentor.profile_photo || '');
                              setSelectedExpertise(mentor.expertise);
                              setSelectedDays(mentor.available_days);
                              setMentorSlots(mentor.available_slots.join(', '));
                            }}
                            className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-lg mr-1.5"
                            title="Edit Mentor Profile"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${mentor.name}'s profile?`)) {
                                deleteMentor(mentor.id);
                              }
                            }}
                            className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg"
                            title="Delete Mentor Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {mentors.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-500">No mentors configured in the directory.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 3. OPPORTUNITIES PANEL (Create & list competitions) */}
      {activeAdminTab === 'competitions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create form */}
          <div>
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-4">
                {editingCompId ? 'Edit Corporate Challenge' : 'Add Corporate Challenge'}
              </h3>
              
              <form onSubmit={handleAddComp} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Competition Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="E.g., HUL L.I.M.E. Season 18"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Company</label>
                    <input
                      type="text"
                      required
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="E.g., Unilever"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="Consulting">Consulting</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Product">Product</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Launch Date</label>
                    <input
                      type="date"
                      required
                      value={newOpenDate}
                      onChange={(e) => setNewOpenDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Hard Deadline</label>
                    <input
                      type="date"
                      required
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Prize Pool / Rewards</label>
                  <input
                    type="text"
                    required
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    placeholder="E.g., ₹10,00,000 + PPO"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Official apply url link</label>
                  <input
                    type="url"
                    value={newApplyLink}
                    onChange={(e) => setNewApplyLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Competition Timeline Steps</label>
                  <input
                    type="text"
                    value={newTimeline}
                    onChange={(e) => setNewTimeline(e.target.value)}
                    placeholder="Launch -> Quiz -> Campus submission..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-black transition-colors"
                >
                  {editingCompId ? 'Update Challenge' : 'Publish Challenge'}
                </button>
                {editingCompId && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewTitle('');
                      setNewCompany('');
                      setNewPrize('');
                      setNewOrganizer('');
                      setNewTimeline('');
                      setNewApplyLink('');
                      setEditingCompId(null);
                    }}
                    className="w-full mt-2 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* List and deletes */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Opportunities Pool ({competitions.length})</h3>
            
            <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Deadline</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {competitions.map((comp) => (
                      <tr key={comp.id} className="hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-zinc-200">
                          {comp.title}
                          <span className="block text-[10px] text-zinc-500 font-medium">{comp.company}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-zinc-400">
                            {comp.category}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-400">{comp.deadline}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setEditingCompId(comp.id);
                              setNewTitle(comp.title);
                              setNewCompany(comp.company);
                              setNewCategory(comp.category);
                              setNewOpenDate(comp.open_date);
                              setNewDeadline(comp.deadline);
                              setNewPrize(comp.prize_pool);
                              setNewOrganizer(comp.organizer);
                              setNewTimeline(comp.timeline);
                              setNewApplyLink(comp.apply_link);
                            }}
                            className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-lg mr-1.5"
                            title="Edit Competition"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this competition?')) {
                                deleteCompetition(comp.id);
                              }
                            }}
                            className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}



      {/* 5. SESSION BOOKINGS LOG */}
      {activeAdminTab === 'sessions' && (
        <div className="space-y-8">
          
          {/* Section A: Pending Student Bookings Verification */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Pending Student Bookings Verification ({bookings.filter(b => b.status === 'pending_admin').length})</h3>
            
            {bookings.filter(b => b.status === 'pending_admin').length === 0 ? (
              <div className="glass-panel text-center py-12 rounded-2xl border-white/5 text-zinc-500 text-xs">
                No student bookings require admin verification at this time.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {bookings.filter(b => b.status === 'pending_admin').map((booking) => {
                  const studentObj = db.getStudent(booking.student_id);
                  const mentorObj = db.getMentor(booking.mentor_id);
                  
                  return (
                    <div key={booking.id} className="glass-card p-5 rounded-2xl border border-white/5 relative text-xs">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b border-white/5 pb-3 mb-3">
                        <div>
                          <h4 className="font-extrabold text-sm text-zinc-200">Student: {studentObj?.name || 'Student'}</h4>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">{studentObj?.email}</span>
                          <span className="text-xs text-indigo-400 font-bold block mt-1">Requested Mentor: {mentorObj?.name || 'Mentor'}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold uppercase text-[9px]">
                          Pending Admin Verification
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/30 p-4 border border-white/5 rounded-xl mb-4">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Case Challenge / Competition</span>
                          <span className="text-zinc-200 font-bold block">{booking.competition_name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Uploaded Round 1 Verification Proof</span>
                          {booking.proof_url ? (
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Downloading mock proof document: ${booking.proof_url}`);
                              }}
                              className="text-indigo-400 font-bold hover:underline flex items-center gap-1 mt-0.5"
                            >
                              📄 {booking.proof_url} <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-red-400 italic">No proof file uploaded</span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        <strong>Outline of case questions / problem:</strong> &ldquo;{booking.notes}&rdquo;
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            updateSessionStatus(booking.id, 'approved');
                            alert('Booking request approved! Zoom link generated and sent to student & mentor.');
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Booking
                        </button>
                        <button
                          onClick={() => {
                            updateSessionStatus(booking.id, 'rejected');
                            alert('Booking request rejected.');
                          }}
                          className="px-4 py-2 bg-red-650 hover:bg-red-750 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Reject Request
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section B: All Bookings Log */}
          <div className="space-y-4 pt-6 border-t border-white/5">
            <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Overall Bookings Queue Log ({bookings.length})</h3>
            
            <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                      <th className="p-4">Student</th>
                      <th className="p-4">Mentor</th>
                      <th className="p-4">Competition</th>
                      <th className="p-4">Proposed Time</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((booking) => {
                      const studentObj = db.getStudent(booking.student_id);
                      const mentorObj = db.getMentor(booking.mentor_id);
                      
                      return (
                        <tr key={booking.id} className="hover:bg-zinc-900/10">
                          <td className="p-4 font-bold text-zinc-200">
                            {studentObj?.name || 'Student'}
                            <span className="block text-[9px] text-zinc-500 font-medium">{studentObj?.email}</span>
                          </td>
                          <td className="p-4 text-zinc-400">{mentorObj?.name || 'Mentor'}</td>
                          <td className="p-4 text-zinc-400">{booking.competition_name || 'N/A'}</td>
                          <td className="p-4 text-indigo-300 font-bold">{booking.preferred_time}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                              booking.status === 'approved'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : booking.status === 'rejected'
                                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                : booking.status === 'pending_mentor'
                                ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">No session requests booked yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}
      {/* 7. MANAGE LEARNING HUB */}
      {activeAdminTab === 'decks' && (
        <div className="space-y-6">
          
          {/* Sub Tab selector */}
          <div className="flex border-b border-white/5 mb-6 gap-2 pb-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveHubTab('decks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${activeHubTab === 'decks' ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              📂 Slide Decks ({winningDecks.length})
            </button>
            <button
              onClick={() => setActiveHubTab('frameworks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${activeHubTab === 'frameworks' ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              🗂️ Interactive Frameworks ({frameworks.length})
            </button>
            <button
              onClick={() => setActiveHubTab('basics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${activeHubTab === 'basics' ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              📖 Case Basics 101 ({basicsTopics.length})
            </button>
            <button
              onClick={() => setActiveHubTab('quizzes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${activeHubTab === 'quizzes' ? 'bg-indigo-950 text-indigo-400 border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              🧩 Mock Practice Quizzes ({quizzes.length})
            </button>
          </div>

          {/* SUB-PANEL 1: SLIDE DECKS */}
          {activeHubTab === 'decks' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              
              {/* Add/Edit Form */}
              <div>
                <div className="glass-panel p-6 rounded-2xl border-white/5">
                  <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-4">
                    {editingDeckId ? 'Edit slide deck' : 'Add winning slide deck'}
                  </h3>
                  
                  <form onSubmit={handleCreateDeck} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Presentation Title</label>
                      <input
                        type="text"
                        required
                        value={deckTitle}
                        onChange={(e) => setDeckTitle(e.target.value)}
                        placeholder="E.g., Bain & Co. Case Champ Slide Deck"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Competition</label>
                        <input
                          type="text"
                          required
                          value={deckCompetition}
                          onChange={(e) => setDeckCompetition(e.target.value)}
                          placeholder="E.g., Bain Case Competition"
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Year</label>
                        <input
                          type="text"
                          required
                          value={deckYear}
                          onChange={(e) => setDeckYear(e.target.value)}
                          placeholder="E.g., 2025"
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Team Name</label>
                      <input
                        type="text"
                        required
                        value={deckTeamName}
                        onChange={(e) => setDeckTeamName(e.target.value)}
                        placeholder="E.g., Team Synergy"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={deckTags}
                        onChange={(e) => setDeckTags(e.target.value)}
                        placeholder="E.g., Consulting, Energy, Pricing"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Deck Document Link</label>
                      <input
                        type="url"
                        value={deckFileUrl}
                        onChange={(e) => setDeckFileUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Preview Image</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center bg-zinc-900/40 p-3 rounded-xl border border-white/5">
                        
                        {/* Thumbnail preview */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                            {deckPreviewImage ? (
                              <img src={deckPreviewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-zinc-600 font-bold uppercase">No Pic</span>
                            )}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-extrabold text-zinc-300">Live Preview</span>
                            <span className="text-[9px] text-zinc-500">{deckPreviewImage ? 'Custom photo set' : 'Default placeholder active'}</span>
                          </div>
                        </div>

                        {/* Upload button or link entry */}
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleDeckImageUpload}
                            className="w-full text-zinc-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 text-[10px] cursor-pointer"
                          />
                          <input
                            type="text"
                            value={deckPreviewImage.startsWith('data:') ? '' : deckPreviewImage}
                            onChange={(e) => setDeckPreviewImage(e.target.value)}
                            placeholder="Or paste external image URL..."
                            className="w-full bg-zinc-950 border border-white/10 rounded-lg p-1.5 text-zinc-300 focus:outline-none text-[10px]"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-black transition-colors"
                    >
                      {editingDeckId ? 'Update Slide Deck' : 'Publish Slide Deck'}
                    </button>

                    {editingDeckId && (
                      <button
                        type="button"
                        onClick={() => {
                          setDeckTitle('');
                          setDeckCompetition('');
                          setDeckYear('2025');
                          setDeckTeamName('');
                          setDeckTags('');
                          setDeckFileUrl('');
                          setDeckPreviewImage('');
                          setEditingDeckId(null);
                        }}
                        className="w-full mt-2 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* List Decks */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Decks in Repository ({winningDecks.length})</h3>
                
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                          <th className="p-4">Presentation Info</th>
                          <th className="p-4">Team</th>
                          <th className="p-4">Downloads</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {winningDecks.map((deck) => (
                          <tr key={deck.id} className="hover:bg-zinc-900/10">
                            <td className="p-4 font-bold text-zinc-200">
                              {deck.title}
                              <span className="block text-[10px] text-zinc-500 font-medium">{deck.competition} ({deck.year})</span>
                            </td>
                            <td className="p-4 text-zinc-400">{deck.teamName}</td>
                            <td className="p-4 text-indigo-400 font-bold">{deck.downloadsCount || 0}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  setEditingDeckId(deck.id);
                                  setDeckTitle(deck.title);
                                  setDeckCompetition(deck.competition);
                                  setDeckYear(deck.year);
                                  setDeckTeamName(deck.teamName);
                                  setDeckTags(deck.tags ? deck.tags.join(', ') : '');
                                  setDeckFileUrl(deck.fileUrl || '');
                                  setDeckPreviewImage(deck.previewImage || '');
                                }}
                                className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-lg mr-1.5"
                                title="Edit Deck"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${deck.title}"?`)) {
                                    deleteWinningDeck(deck.id);
                                  }
                                }}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg"
                                title="Delete Deck"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {winningDecks.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-zinc-500">No slide decks published in repository.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SUB-PANEL 2: FRAMEWORKS */}
          {activeHubTab === 'frameworks' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              
              {/* Form */}
              <div>
                <div className="glass-panel p-6 rounded-2xl border-white/5">
                  <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-4">
                    {editingFrameworkId ? 'Edit Framework' : 'Add Framework Card'}
                  </h3>
                  
                  <form onSubmit={handleCreateFramework} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Framework Name</label>
                      <input
                        type="text"
                        required
                        value={fwName}
                        onChange={(e) => setFwName(e.target.value)}
                        placeholder="E.g., Profitability Framework"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Subtitle / Focus area</label>
                      <input
                        type="text"
                        required
                        value={fwSubtitle}
                        onChange={(e) => setFwSubtitle(e.target.value)}
                        placeholder="E.g., Diagnose Profit Drops"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Front description (Summarized Goal)</label>
                      <textarea
                        required
                        rows={3}
                        value={fwFront}
                        onChange={(e) => setFwFront(e.target.value)}
                        placeholder="E.g., Used to systematically isolate drivers of profit drops..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Back details (Diagnostic Structure / Equations)</label>
                      <textarea
                        required
                        rows={6}
                        value={fwBack}
                        onChange={(e) => setFwBack(e.target.value)}
                        placeholder="Profit = (Price x Quantity) - (Fixed + Variable Costs)..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Card Background Gradient</label>
                      <select
                        value={fwGradient}
                        onChange={(e) => setFwGradient(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      >
                        <option value="from-indigo-600 to-purple-600">Indigo to Purple</option>
                        <option value="from-purple-600 to-indigo-600">Purple to Indigo</option>
                        <option value="from-indigo-600 to-sky-600">Indigo to Sky</option>
                        <option value="from-sky-600 to-purple-600">Sky to Purple</option>
                        <option value="from-purple-600 to-sky-600">Purple to Sky</option>
                        <option value="from-sky-600 to-indigo-600">Sky to Indigo</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-black transition-colors"
                    >
                      {editingFrameworkId ? 'Update Framework Card' : 'Publish Framework Card'}
                    </button>

                    {editingFrameworkId && (
                      <button
                        type="button"
                        onClick={() => {
                          setFwName('');
                          setFwSubtitle('');
                          setFwFront('');
                          setFwBack('');
                          setFwGradient('from-indigo-600 to-purple-600');
                          setEditingFrameworkId(null);
                        }}
                        className="w-full mt-2 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Framework Cards ({frameworks.length})</h3>
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                          <th className="p-4">Framework Info</th>
                          <th className="p-4">Focus</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {frameworks.map((fw) => (
                          <tr key={fw.id} className="hover:bg-zinc-900/10">
                            <td className="p-4 font-bold text-zinc-200">
                              {fw.name}
                              <span className="block text-[10px] text-zinc-500 font-medium">{fw.front.substring(0, 50)}...</span>
                            </td>
                            <td className="p-4 text-zinc-400">{fw.subtitle}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  setEditingFrameworkId(fw.id);
                                  setFwName(fw.name);
                                  setFwSubtitle(fw.subtitle);
                                  setFwFront(fw.front);
                                  setFwBack(fw.back);
                                  setFwGradient(fw.gradient);
                                }}
                                className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-lg mr-1.5"
                                title="Edit Framework"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${fw.name}"?`)) {
                                    deleteFramework(fw.id);
                                  }
                                }}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg"
                                title="Delete Framework"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SUB-PANEL 3: BASICS */}
          {activeHubTab === 'basics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              
              {/* Form */}
              <div>
                <div className="glass-panel p-6 rounded-2xl border-white/5">
                  <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-4">
                    {editingBasicsId ? 'Edit Topic' : 'Add Case Topic'}
                  </h3>
                  
                  <form onSubmit={handleCreateBasicsTopic} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Topic Title</label>
                      <input
                        type="text"
                        required
                        value={basicsTitle}
                        onChange={(e) => setBasicsTitle(e.target.value)}
                        placeholder="E.g., Team Formation"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Topic Summary Description</label>
                      <textarea
                        required
                        rows={3}
                        value={basicsDesc}
                        onChange={(e) => setBasicsDesc(e.target.value)}
                        placeholder="E.g., An ideal team size is 3-4 combining complementary skillsets..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Strategic Insights (One item per line)</label>
                      <textarea
                        required
                        rows={4}
                        value={basicsInsights}
                        onChange={(e) => setBasicsInsights(e.target.value)}
                        placeholder="E.g., Assign roles early.&#10;Incorporate graphic elements."
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-black transition-colors"
                    >
                      {editingBasicsId ? 'Update Topic' : 'Publish Topic'}
                    </button>

                    {editingBasicsId && (
                      <button
                        type="button"
                        onClick={() => {
                          setBasicsTitle('');
                          setBasicsDesc('');
                          setBasicsInsights('');
                          setEditingBasicsId(null);
                        }}
                        className="w-full mt-2 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Basics Topics ({basicsTopics.length})</h3>
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                          <th className="p-4">Basics Topic Info</th>
                          <th className="p-4">Insights Count</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {basicsTopics.map((topic) => (
                          <tr key={topic.id} className="hover:bg-zinc-900/10">
                            <td className="p-4 font-bold text-zinc-200">
                              {topic.title}
                              <span className="block text-[10px] text-zinc-500 font-medium">{topic.desc.substring(0, 55)}...</span>
                            </td>
                            <td className="p-4 text-indigo-400 font-bold">{(topic.insights || []).length} insights</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  setEditingBasicsId(topic.id);
                                  setBasicsTitle(topic.title);
                                  setBasicsDesc(topic.desc);
                                  setBasicsInsights((topic.insights || []).join('\n'));
                                }}
                                className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-lg mr-1.5"
                                title="Edit Topic"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${topic.title}"?`)) {
                                    deleteBasicsTopic(topic.id);
                                  }
                                }}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg"
                                title="Delete Topic"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SUB-PANEL 4: QUIZZES */}
          {activeHubTab === 'quizzes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              
              {/* Quiz Builder form */}
              <div>
                <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
                  <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider">
                    {editingQuizId ? 'Edit Practice Quiz' : 'Add Practice Quiz'}
                  </h3>
                  
                  <form onSubmit={handleCreateQuiz} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Quiz Title</label>
                      <input
                        type="text"
                        required
                        value={quizTitleText}
                        onChange={(e) => setQuizTitleText(e.target.value)}
                        placeholder="E.g., Practice 3: Advanced Pricing Mechanics"
                        className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none"
                      />
                    </div>

                    <div className="border-t border-white/5 pt-3 mt-3 space-y-3">
                      <h4 className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                        {editingQuestionIndex !== null ? `Edit Question #${editingQuestionIndex + 1}` : 'Add MCQ Question'}
                      </h4>

                      <div>
                        <label className="block text-[9px] font-bold text-zinc-500 uppercase mb-1">Question Description</label>
                        <input
                          type="text"
                          value={qText}
                          onChange={(e) => setQText(e.target.value)}
                          placeholder="E.g., What is the target markup percentage in..."
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none text-[11px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <label className="block text-zinc-450 mb-0.5">Choice A</label>
                          <input type="text" value={qOptA} onChange={(e) => setQOptA(e.target.value)} placeholder="Option A" className="w-full bg-zinc-900 border border-white/10 rounded p-1.5 text-zinc-200 focus:outline-none"/>
                        </div>
                        <div>
                          <label className="block text-zinc-450 mb-0.5">Choice B</label>
                          <input type="text" value={qOptB} onChange={(e) => setQOptB(e.target.value)} placeholder="Option B" className="w-full bg-zinc-900 border border-white/10 rounded p-1.5 text-zinc-200 focus:outline-none"/>
                        </div>
                        <div>
                          <label className="block text-zinc-450 mb-0.5">Choice C</label>
                          <input type="text" value={qOptC} onChange={(e) => setQOptC(e.target.value)} placeholder="Option C" className="w-full bg-zinc-900 border border-white/10 rounded p-1.5 text-zinc-200 focus:outline-none"/>
                        </div>
                        <div>
                          <label className="block text-zinc-450 mb-0.5">Choice D</label>
                          <input type="text" value={qOptD} onChange={(e) => setQOptD(e.target.value)} placeholder="Option D" className="w-full bg-zinc-900 border border-white/10 rounded p-1.5 text-zinc-200 focus:outline-none"/>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-zinc-500 uppercase mb-1">Correct Choice</label>
                        <select
                          value={qCorrectIndex}
                          onChange={(e) => setQCorrectIndex(Number(e.target.value))}
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-1.5 text-zinc-200 focus:outline-none"
                        >
                          <option value={0}>Option A</option>
                          <option value={1}>Option B</option>
                          <option value={2}>Option C</option>
                          <option value={3}>Option D</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-zinc-500 uppercase mb-1">Answer Explanation (MECE feedback)</label>
                        <textarea
                          rows={2}
                          value={qFeedback}
                          onChange={(e) => setQFeedback(e.target.value)}
                          placeholder="Provide the step-by-step logic breakdown..."
                          className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-205 focus:outline-none text-[11px]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleAddQuestionToBuilder}
                          className="flex-1 py-1.5 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-lg transition-colors text-[10px]"
                        >
                          {editingQuestionIndex !== null ? 'Save Question Changes' : 'Add Question to Quiz'}
                        </button>
                        {editingQuestionIndex !== null && (
                          <button
                            type="button"
                            onClick={clearQuestionBuilder}
                            className="px-3 py-1.5 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-400 rounded-lg text-[10px]"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Questions Added: {quizQuestions.length}</span>
                        {quizQuestions.length > 0 && (
                          <span className="text-[9px] text-emerald-400 font-bold">● Validated Ready</span>
                        )}
                      </div>
                      
                      {quizQuestions.length > 0 && (
                        <div className="max-h-[150px] overflow-y-auto space-y-1.5 mb-4 pr-1 border border-white/5 rounded-lg p-2 bg-zinc-900/30 text-[10px]">
                          {quizQuestions.map((q, idx) => (
                            <div key={idx} className="flex justify-between items-center p-1.5 bg-zinc-900/50 rounded border border-white/5">
                              <span className="truncate font-semibold text-zinc-300 max-w-[130px]">
                                {idx + 1}. {q.q}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingQuestionIndex(idx);
                                    setQText(q.q);
                                    setQOptA(q.options[0] || '');
                                    setQOptB(q.options[1] || '');
                                    setQOptC(q.options[2] || '');
                                    setQOptD(q.options[3] || '');
                                    setQCorrectIndex(q.correctIndex);
                                    setQFeedback(q.feedback);
                                  }}
                                  className="text-indigo-400 font-bold hover:underline"
                                >
                                  Edit
                                </button>
                                <span className="text-zinc-700">|</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuizQuestions(quizQuestions.filter((_, i) => i !== idx));
                                  }}
                                  className="text-red-400 font-bold hover:underline"
                                >
                                  Del
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={quizQuestions.length === 0}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-xs font-bold text-black transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {editingQuizId ? 'Update and Save Quiz' : 'Publish Complete Quiz'}
                    </button>

                    {editingQuizId && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuizTitleText('');
                          setQuizQuestions([]);
                          setEditingQuizId(null);
                          clearQuestionBuilder();
                        }}
                        className="w-full mt-2 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        Cancel Quiz Edit
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Practice Quizzes Pool ({quizzes.length})</h3>
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                          <th className="p-4">Quiz Title</th>
                          <th className="p-4">Questions Count</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {quizzes.map((quiz) => (
                          <tr key={quiz.id} className="hover:bg-zinc-900/10">
                            <td className="p-4 font-bold text-zinc-200">
                              {quiz.title}
                            </td>
                            <td className="p-4 text-indigo-400 font-bold">{(quiz.questions || []).length} MCQs</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  setEditingQuizId(quiz.id);
                                  setQuizTitleText(quiz.title);
                                  setQuizQuestions(quiz.questions || []);
                                }}
                                className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 rounded-lg mr-1.5"
                                title="Edit Quiz"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
                                    deleteQuiz(quiz.id);
                                  }
                                }}
                                className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg"
                                title="Delete Quiz"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
