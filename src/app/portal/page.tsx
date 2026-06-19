'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { db, Student } from '@/lib/db';
import { 
  User, 
  Settings, 
  Star, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Search, 
  BadgeCheck, 
  Video, 
  MessageSquare, 
  Users, 
  Trophy, 
  ArrowRight,
  Upload,
  Heart
} from 'lucide-react';

interface TeamListing {
  id: string;
  teamName: string;
  competition: string;
  lookingFor: 'Finance' | 'Marketing' | 'Analytics' | 'Product' | 'Consulting';
  description: string;
  contactEmail: string;
}

const DEFAULT_TEAM_LISTINGS: TeamListing[] = [
  {
    id: 'team-1',
    teamName: 'The Bainiacs',
    competition: 'McKinsey Case Excellence',
    lookingFor: 'Finance',
    description: 'Preparing the financial models and cost branches for McKinsey case. Need someone who can build a clean Excel projection model.',
    contactEmail: 'bainiacs.pgp26@iimkashipur.ac.in'
  },
  {
    id: 'team-2',
    teamName: 'Marketing Mavericks',
    competition: 'L\'Oréal Brandstorm 2026',
    lookingFor: 'Product',
    description: 'Designing seaweed packaging water bottle. Need a PM-minded teammate to flesh out product requirements and wireframes.',
    contactEmail: 'mavericks.pgp25@iimkashipur.ac.in'
  }
];

export default function StudentPortal() {
  const { 
    currentStudent, 
    updateStudent, 
    competitions, 
    savedCompetitions, 
    bookings, 
    meetings, 
    addSystemNotification,
    refreshData
  } = useStore();

  const [activePortalTab, setActivePortalTab] = useState<'dashboard' | 'profile' | 'coach' | 'team' | 'recommend'>('dashboard');

  // Profile Form States
  const [profileName, setProfileName] = useState(currentStudent?.name || '');
  const [profileCollege, setProfileCollege] = useState(currentStudent?.college || 'IIM Kashipur');
  const [profileProgram, setProfileProgram] = useState(currentStudent?.program || 'PGP MBA');
  const [profileYear, setProfileYear] = useState(currentStudent?.year || '1st Year');
  const [profileLinkedin, setProfileLinkedin] = useState(currentStudent?.linkedin || '');
  const [profileInterests, setProfileInterests] = useState<string[]>(currentStudent?.interests || []);
  const [resumeName, setResumeName] = useState(currentStudent?.resume || '');

  // AI Coach Chat States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'coach'; text: string }[]>([
    { role: 'coach', text: 'Hello! I am your CORPUS AI Case Coach. Ask me how to structure or approach any case study (e.g. "How do I solve a profitability drop?") and I will draft a consulting plan.' }
  ]);
  const [isCoachThinking, setIsCoachThinking] = useState(false);

  // Team Finder States
  const [teamListings, setTeamListings] = useState<TeamListing[]>(DEFAULT_TEAM_LISTINGS);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamComp, setNewTeamComp] = useState('');
  const [newTeamLooking, setNewTeamLooking] = useState<'Finance' | 'Marketing' | 'Analytics' | 'Product' | 'Consulting'>('Finance');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [teamSearchQuery, setTeamSearchQuery] = useState('');

  // Sync profile form when student store state is updated
  useEffect(() => {
    if (currentStudent) {
      setProfileName(currentStudent.name);
      setProfileCollege(currentStudent.college);
      setProfileProgram(currentStudent.program);
      setProfileYear(currentStudent.year);
      setProfileLinkedin(currentStudent.linkedin);
      setProfileInterests(currentStudent.interests);
      setResumeName(currentStudent.resume);
    }
  }, [currentStudent]);

  // Handle Profile Update
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    updateStudent({
      ...currentStudent,
      name: profileName,
      college: profileCollege,
      program: profileProgram,
      year: profileYear,
      linkedin: profileLinkedin,
      interests: profileInterests,
      resume: resumeName || 'uploaded_resume.pdf'
    });

    addSystemNotification({
      id: `profile-save-${Date.now()}`,
      title: '👤 Profile Saved Successfully',
      message: 'Your portal details and areas of interest have been updated.',
      type: 'system',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    alert('Profile saved!');
  };

  // Toggle interests selection helper
  const handleInterestToggle = (interest: string) => {
    if (profileInterests.includes(interest)) {
      setProfileInterests(profileInterests.filter(i => i !== interest));
    } else {
      setProfileInterests([...profileInterests, interest]);
    }
  };

  // AI Coach logic
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsCoachThinking(true);

    // Simulated consulting AI response based on keywords
    setTimeout(() => {
      let coachReply = 'That is an interesting case question. To solve this, apply a MECE structural framework. Break down the problem into key segments, form hypotheses, and identify variables you need from the case booklet.';
      
      const query = userText.toLowerCase();
      if (query.includes('profit') || query.includes('revenue') || query.includes('cost')) {
        coachReply = `Let's break down this Profitability Case. Use the Profitability Framework:
1. Isolate the drop: Is Revenue falling or are Costs rising?
2. If Revenue is down: Is it volume (Q) dropping or pricing (P) pressures? Check market demand and competitor price Matching.
3. If Cost is up: Are Fixed Overheads rising or Variable costs spiking?
4. Recommendation: Once drivers are isolated, propose 2 short-term quick wins and 1 long-term strategic pivot.`;
      } else if (query.includes('market entry') || query.includes('new market')) {
        coachReply = `Here is how to structure a Market Entry Case:
1. Market Attractiveness: Size, growth rate, margins, and competitor strengths.
2. Financials: Initial capital required, expected payback period, and break-even sales.
3. Operational Capability: Do we have distribution, sourcing, and localized regulatory compliance?
4. Entry Mode: Should we acquire a local competitor (M&A), enter organically, or form a JV?`;
      } else if (query.includes('marketing') || query.includes('gtm') || query.includes('launch')) {
        coachReply = `For a GTM or Product Launch case, outline a 5-step GTM roadmap:
1. Customer Segmentation: Define primary and secondary target user personas (like Gen-Z MBA students vs. corporate professionals).
2. Product Proposition: What is the core USP?
3. Channels: Direct-to-Consumer (D2C), organic social campaigns, or corporate affiliate partnerships.
4. Pricing & Promos: Penetration pricing vs. premium positioning.
5. Metrics: Track CAC (Customer Acquisition Cost) and LTV (Customer Lifetime Value).`;
      }

      setChatMessages(prev => [...prev, { role: 'coach', text: coachReply }]);
      setIsCoachThinking(false);

      // Trigger XP increment alert simulated
      addSystemNotification({
        id: `coach-chat-${Date.now()}`,
        title: '🤖 Coach Session Complete',
        message: 'Completed AI chat consulting structured review. Solved prompt tracker updated.',
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1200);
  };

  // Team Finder Listing creation
  const handlePostTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newTeamComp || !newTeamDesc) return;

    const newListing: TeamListing = {
      id: `team-${Date.now()}`,
      teamName: newTeamName,
      competition: newTeamComp,
      lookingFor: newTeamLooking,
      description: newTeamDesc,
      contactEmail: currentStudent?.email || 'student@iimkashipur.ac.in'
    };

    setTeamListings(prev => [newListing, ...prev]);
    setNewTeamName('');
    setNewTeamComp('');
    setNewTeamDesc('');

    addSystemNotification({
      id: `team-post-${Date.now()}`,
      title: '👥 Teammate Request Posted',
      message: `Your listing for "${newTeamComp}" is now live on the board.`,
      type: 'system',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    alert('Teammate post published successfully!');
  };

  // Recommendation Engine: recommend based on selected student interest
  const recommendedCompetitions = competitions.filter(comp => {
    const studentInterests = currentStudent?.interests || [];
    return studentInterests.includes(comp.category);
  });

  // Saved Competitions Details
  const savedCompsDetails = competitions.filter(comp => savedCompetitions.includes(comp.id));

  // Student booked sessions details
  // Filter bookings that match the student ID
  const studentBookings = bookings.filter(b => b.student_id === currentStudent?.id);

  // Sync state data on load
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background blur overlays */}
      <div className="absolute top-0 left-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Banner */}
      <div className="border-b border-white/5 pb-8 mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          👤 Student Portal
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Monitor your preparation stats, update interest niches, chat with the AI Coach, and search for teammates.
        </p>
      </div>

      {/* Portal Tabs Selector */}
      <div className="flex border-b border-white/5 mb-8 gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActivePortalTab('dashboard')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activePortalTab === 'dashboard' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          📊 Preparation Dashboard
        </button>
        <button
          onClick={() => setActivePortalTab('coach')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activePortalTab === 'coach' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🤖 AI Case Coach
        </button>
        <button
          onClick={() => setActivePortalTab('team')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activePortalTab === 'team' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          👥 Team Finder Board
        </button>
        <button
          onClick={() => setActivePortalTab('recommend')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activePortalTab === 'recommend' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          💡 AI Smart Match Recommendations
        </button>
        <button
          onClick={() => setActivePortalTab('profile')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activePortalTab === 'profile' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          ⚙️ Profile Registration
        </button>
      </div>

      {/* Tab Panels */}

      {/* 1. PREPARATION DASHBOARD */}
      {activePortalTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel: Stats & Badges */}
          <div className="space-y-6">
            
            {/* Gamification Stats */}
            <div className="glass-panel p-6 rounded-2xl border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Preparation Analytics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-indigo-400 block">{currentStudent?.wins || 0}</span>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">National Wins</span>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-purple-400 block">{currentStudent?.shortlists || 0}</span>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Shortlists</span>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-sky-400 block">{currentStudent?.participations || 0}</span>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Participated</span>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-center">
                  <span className="text-2xl font-black text-emerald-400 block">{studentBookings.length}</span>
                  <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Sessions Booked</span>
                </div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Unlocked Badges</h3>
              
              <div className="space-y-3">
                {currentStudent?.badges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 bg-zinc-900/40 border border-white/5 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <Trophy className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-200">{badge}</h4>
                      <span className="text-[9px] text-zinc-500">Unlocked via verified milestones</span>
                    </div>
                  </div>
                ))}
                {(!currentStudent?.badges || currentStudent.badges.length === 0) && (
                  <div className="text-center py-4 text-xs text-zinc-600">
                    Solve cases or apply to challenges to unlock badges.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Active bookmarks & upcoming zoom sessions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bookmarked Competitions */}
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Saved Case Challenges</h3>
              
              <div className="space-y-3">
                {savedCompsDetails.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-500 border border-dashed border-white/5 rounded-xl">
                    You haven&rsquo;t bookmarked any competition yet. Go to the dashboard to save items.
                  </div>
                ) : (
                  savedCompsDetails.map(comp => (
                    <div key={comp.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <h4 className="font-bold text-sm text-zinc-200">{comp.title}</h4>
                        <span className="text-xs text-zinc-500">{comp.company} | Deadline: {comp.deadline}</span>
                      </div>
                      <a
                        href={comp.apply_link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-bold border border-white/5 text-center flex items-center justify-center gap-1.5 shrink-0"
                      >
                        Launch Direct <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Sessions Queue */}
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Booked Sessions Queue</h3>
              
              <div className="space-y-3">
                {studentBookings.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-500 border border-dashed border-white/5 rounded-xl">
                    No active mentorship bookings found. Click &ldquo;Book Session&rdquo; on the homepage to start.
                  </div>
                ) : (
                  studentBookings.map(booking => {
                    const mentorObj = db.getMentor(booking.mentor_id);
                    const meetingObj = meetings.find(m => m.session_id === booking.id);
                    
                    return (
                      <div key={booking.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/5 pb-3 mb-3">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Booking ID: {booking.id}</span>
                            <h4 className="font-bold text-sm text-zinc-200 mt-0.5">Mentorship call with {mentorObj?.name || 'Mentor'}</h4>
                            <span className="text-xs text-zinc-400">Scheduled Time: {booking.preferred_time}</span>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-center border uppercase shrink-0 ${
                            booking.status === 'approved'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : booking.status === 'rejected'
                              ? 'bg-red-500/10 border-red-500/20 text-red-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>

                        {booking.status === 'approved' && meetingObj && (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-indigo-950/20 border border-indigo-500/15 p-2.5 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Video className="w-4.5 h-4.5 text-indigo-400" />
                              <div>
                                <span className="text-[10px] text-zinc-400 block font-semibold">MOCK ZOOM CONFERENCE</span>
                                <span className="text-xs font-bold text-indigo-300">ID: {meetingObj.zoom_id}</span>
                              </div>
                            </div>
                            <a
                              href={meetingObj.zoom_link}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full sm:w-auto px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                        
                        <p className="text-xs text-zinc-400 leading-relaxed italic mt-2">
                          <strong>Note sent to mentor:</strong> &ldquo;{booking.notes}&rdquo;
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. AI CASE COACH */}
      {activePortalTab === 'coach' && (
        <div className="glass-panel rounded-2xl border-white/5 overflow-hidden flex flex-col h-[500px]">
          {/* Chat Header */}
          <div className="bg-zinc-900/80 p-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-zinc-200">AI Case Coach</h3>
              <span className="text-[10px] text-zinc-500 font-semibold block">Ask about GTM, Profitability, Pricing, Market Entry structuring</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-indigo-500 text-white rounded-tr-none'
                    : 'bg-zinc-900 border border-white/5 text-zinc-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isCoachThinking && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-white/5 text-zinc-500 rounded-xl rounded-tl-none p-3.5 text-xs animate-pulse">
                  AI Coach is structuring MECE analysis...
                </div>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendMessage} className="bg-zinc-900/40 p-4 border-t border-white/5 flex gap-2">
            <input
              type="text"
              required
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask: 'How should I structure a growth case study?'..."
              className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Ask Coach
            </button>
          </form>
        </div>
      )}

      {/* 3. TEAM FINDER BOARD */}
      {activePortalTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Post teammate request Form */}
          <div>
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-4">Request Teammates</h3>
              
              <form onSubmit={handlePostTeam} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Your Team Name</label>
                  <input
                    type="text"
                    required
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="E.g., Bain Titans"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Case Competition Name</label>
                  <input
                    type="text"
                    required
                    value={newTeamComp}
                    onChange={(e) => setNewTeamComp(e.target.value)}
                    placeholder="E.g., McKinsey Strategy Cup"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Expertise Needed</label>
                  <select
                    value={newTeamLooking}
                    onChange={(e) => setNewTeamLooking(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                  >
                    <option value="Finance">Finance / Valuations</option>
                    <option value="Marketing">Marketing / GTM</option>
                    <option value="Product">Product / App Specs</option>
                    <option value="Analytics">Analytics / Datasets</option>
                    <option value="Consulting">Consulting / Slides</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Description / Project Scope</label>
                  <textarea
                    required
                    rows={4}
                    value={newTeamDesc}
                    onChange={(e) => setNewTeamDesc(e.target.value)}
                    placeholder="Briefly describe what your solution is and what tasks the new partner will address..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-xs font-bold text-white transition-colors"
                >
                  Publish Team Request
                </button>
              </form>
            </div>
          </div>

          {/* Teammate request Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 bg-zinc-900/60 p-3 rounded-xl border border-white/5 mb-4">
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                placeholder="Search case challenges or skill needed..."
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-200 focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              {teamListings
                .filter(listing => 
                  listing.competition.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
                  listing.lookingFor.toLowerCase().includes(teamSearchQuery.toLowerCase())
                )
                .map(listing => (
                  <div key={listing.id} className="glass-card p-5 rounded-2xl border border-white/5 relative">
                    <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-3 mb-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-zinc-200">{listing.teamName}</h4>
                        <span className="text-xs text-zinc-500">Entering: {listing.competition}</span>
                      </div>
                      
                      <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase shrink-0">
                        Needs: {listing.lookingFor}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      {listing.description}
                    </p>

                    <div className="flex justify-between items-center text-[10px] text-zinc-500">
                      <span>Posted by verified student portal member</span>
                      <a
                        href={`mailto:${listing.contactEmail}`}
                        className="text-indigo-400 font-bold hover:underline"
                      >
                        Contact: {listing.contactEmail}
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. RECOMMENDATIONS ENGINE */}
      {activePortalTab === 'recommend' && (
        <div className="space-y-6">
          <div className="bg-indigo-950/10 border border-indigo-500/10 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="font-black text-sm text-zinc-200">CORPUS AI Recommender</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We analyzed your student profile and registered interests ({currentStudent?.interests.join(', ') || 'None Selected'}). Here are your top personalized live matches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedCompetitions.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-xs text-zinc-500 border border-dashed border-white/5 rounded-2xl">
                Go to the &ldquo;Profile Registration&rdquo; tab and check areas of interest to populate personalized matches.
              </div>
            ) : (
              recommendedCompetitions.map(comp => (
                <div key={comp.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[9px] font-bold uppercase tracking-wider block w-max mb-3">
                      {comp.category} Match (98% Relevance)
                    </span>
                    <h3 className="font-bold text-base text-zinc-200 leading-snug">{comp.title}</h3>
                    <span className="text-xs text-zinc-500 font-medium block mt-0.5">{comp.company}</span>
                    <p className="text-xs text-zinc-400 mt-3">Timeline: {comp.timeline}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
                    <span className="text-xs font-bold text-emerald-400">{comp.prize_pool}</span>
                    <a
                      href={comp.apply_link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      Quick Apply <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. PROFILE REGISTRATION */}
      {activePortalTab === 'profile' && (
        <div className="glass-panel p-6 rounded-2xl border-white/5 max-w-xl mx-auto">
          <h3 className="text-base font-black text-zinc-200 uppercase tracking-wider border-b border-white/5 pb-3 mb-6">
            Student Profile Registry
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">College/Campus</label>
                <input
                  type="text"
                  required
                  value={profileCollege}
                  onChange={(e) => setProfileCollege(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Degree Program</label>
                <input
                  type="text"
                  required
                  value={profileProgram}
                  onChange={(e) => setProfileProgram(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Year</label>
                <select
                  value={profileYear}
                  onChange={(e) => setProfileYear(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="1st Year">1st Year MBA</option>
                  <option value="2nd Year">2nd Year MBA</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  required
                  value={profileLinkedin}
                  onChange={(e) => setProfileLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Areas of Interest</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {['Consulting', 'Marketing', 'Product', 'Analytics', 'Finance', 'Operations', 'HR'].map((interest) => {
                  const selected = profileInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-full border font-bold transition-all ${
                        selected
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                          : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resume upload mock */}
            <div className="border border-dashed border-white/10 rounded-xl p-5 text-center bg-zinc-900/30">
              <Upload className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
              <span className="text-[10px] text-zinc-500 block">Drag & Drop Resume PDF (Consulting formatted)</span>
              <button
                type="button"
                onClick={() => {
                  const mockName = `${profileName.toLowerCase().replace(' ', '_')}_resume_seed.pdf`;
                  setResumeName(mockName);
                  alert(`File upload simulation complete: ${mockName}`);
                }}
                className="mt-2 text-[10px] font-bold text-indigo-400 hover:underline"
              >
                {resumeName ? `Attached: ${resumeName}` : 'Select mock file upload'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Update Registration Info
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
