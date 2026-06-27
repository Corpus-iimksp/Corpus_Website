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
  Video, 
  MessageSquare, 
  Users, 
  ArrowRight,
  Upload,
  Heart,
  Lock
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
    refreshData,
    currentRole
  } = useStore();

  const [activePortalTab, setActivePortalTab] = useState<'dashboard' | 'profile' | 'team'>('dashboard');
  const [mounted, setMounted] = useState(false);

  // Competition stages mapping
  const [competitionStages, setCompetitionStages] = useState<Record<string, 'saved' | 'participated' | 'shortlisted' | 'won'>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStages = localStorage.getItem('corpus_competition_stages');
      if (savedStages) {
        setCompetitionStages(JSON.parse(savedStages));
      }
    }
  }, []);

  // Profile Form States
  const [profileName, setProfileName] = useState(currentStudent?.name || '');
  const [profileCollege, setProfileCollege] = useState(currentStudent?.college || 'IIM Kashipur');
  const [profileProgram, setProfileProgram] = useState(currentStudent?.program || 'PGP MBA');
  const [profileYear, setProfileYear] = useState(currentStudent?.year || '1st Year');
  const [profileLinkedin, setProfileLinkedin] = useState(currentStudent?.linkedin || '');
  const [profileInterests, setProfileInterests] = useState<string[]>(currentStudent?.interests || []);
  const [resumeName, setResumeName] = useState(currentStudent?.resume || '');

  const [profileWins, setProfileWins] = useState(currentStudent?.wins || 0);
  const [profileShortlists, setProfileShortlists] = useState(currentStudent?.shortlists || 0);
  const [profileParticipations, setProfileParticipations] = useState(currentStudent?.participations || 0);

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
      setProfileWins(currentStudent.wins || 0);
      setProfileShortlists(currentStudent.shortlists || 0);
      setProfileParticipations(currentStudent.participations || 0);
    }
  }, [currentStudent]);

  // Handle Competition stage transition in Pipeline Tracker
  const handleStageTransition = (compId: string, nextStage: 'saved' | 'participated' | 'shortlisted' | 'won') => {
    if (!currentStudent) return;
    
    const currentStage = competitionStages[compId] || 'saved';
    if (currentStage === nextStage) return;

    // 1. Update stages map
    const updatedStages = { ...competitionStages, [compId]: nextStage };
    setCompetitionStages(updatedStages);
    localStorage.setItem('corpus_competition_stages', JSON.stringify(updatedStages));

    // 2. Compute deltas
    const stageWeights = {
      saved: { wins: 0, shortlists: 0, participations: 0 },
      participated: { wins: 0, shortlists: 0, participations: 1 },
      shortlisted: { wins: 0, shortlists: 1, participations: 1 },
      won: { wins: 1, shortlists: 1, participations: 1 }
    };

    const deltaWins = stageWeights[nextStage].wins - stageWeights[currentStage].wins;
    const deltaShortlists = stageWeights[nextStage].shortlists - stageWeights[currentStage].shortlists;
    const deltaParticipations = stageWeights[nextStage].participations - stageWeights[currentStage].participations;

    updateStudent({
      ...currentStudent,
      wins: Math.max(0, (currentStudent.wins || 0) + deltaWins),
      shortlists: Math.max(0, (currentStudent.shortlists || 0) + deltaShortlists),
      participations: Math.max(0, (currentStudent.participations || 0) + deltaParticipations)
    });

    // 3. Add system notification
    const compObj = competitions.find(c => c.id === compId);
    if (compObj) {
      const isBackward = stageWeights[nextStage].participations < stageWeights[currentStage].participations ||
                         stageWeights[nextStage].shortlists < stageWeights[currentStage].shortlists ||
                         stageWeights[nextStage].wins < stageWeights[currentStage].wins;
      
      const stageName = nextStage === 'saved' ? 'Bookmarked' : nextStage === 'participated' ? 'Participated' : nextStage === 'shortlisted' ? 'Shortlisted' : 'National Win';
      addSystemNotification({
        id: `stage-${compId}-${Date.now()}`,
        title: isBackward ? '🔄 Milestone Reset' : `🏆 Milestone: ${stageName}`,
        message: `"${compObj.title}" moved to ${stageName.toLowerCase()} segment. Stats updated accordingly!`,
        type: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

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
      resume: resumeName || 'uploaded_resume.pdf',
      wins: profileWins,
      shortlists: profileShortlists,
      participations: profileParticipations
    });

    addSystemNotification({
      id: `profile-save-${Date.now()}`,
      title: '👤 Profile Saved Successfully',
      message: 'Your portal details and track record values have been updated.',
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



  // Saved Competitions Details
  const savedCompsDetails = competitions.filter(comp => savedCompetitions.includes(comp.id));

  // Filter Saved Challenges by Pipeline Stage
  const savedCases = savedCompsDetails.filter(comp => {
    const stage = competitionStages[comp.id] || 'saved';
    return stage === 'saved';
  });

  const participatedCases = savedCompsDetails.filter(comp => {
    const stage = competitionStages[comp.id];
    return stage === 'participated';
  });

  const shortlistedAndWonCases = savedCompsDetails.filter(comp => {
    const stage = competitionStages[comp.id];
    return stage === 'shortlisted' || stage === 'won';
  });

  // Student booked sessions details
  // Filter bookings that match the student ID
  const studentBookings = bookings.filter(b => b.student_id === currentStudent?.id);

  // Sync state data on load
  useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  if (mounted && !currentStudent && currentRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-md mx-auto space-y-6">
        <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Lock className="w-10 h-10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Student Portal Locked</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Authorized access only. Please sign in with your verified college email address ending with <span className="text-indigo-400 font-semibold">@iimkashipur.ac.in</span> using the Sign In button in the navigation bar to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

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
          Monitor your preparation stats, update interest niches, and search for teammates.
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
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-6">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Case Challenge Tracker Pipeline</h3>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Track your competition milestones automatically. Transition saved challenges from saved, to participated, to shortlisted, and won!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Column 1: Saved (Bookmarked but not participated yet) */}
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5 space-y-3 flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                    <span className="text-[10px] font-black text-zinc-400 uppercase">📌 Bookmarked ({savedCases.length})</span>
                  </div>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-none flex-1">
                    {savedCases.length === 0 ? (
                      <div className="text-center py-12 text-[10px] text-zinc-650 italic">
                        No bookmarked cases. Save opportunities from the dashboard.
                      </div>
                    ) : (
                      savedCases.map(comp => (
                        <div key={comp.id} className="p-3 bg-zinc-900/50 border border-white/5 rounded-lg text-[11px] space-y-2 text-left">
                          <div className="font-bold text-zinc-250 leading-tight">{comp.title}</div>
                          <div className="text-[9px] text-zinc-550 leading-tight">{comp.company}</div>
                          <button
                            onClick={() => handleStageTransition(comp.id, 'participated')}
                            className="w-full py-1.5 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white rounded text-[10px] font-bold text-indigo-400 flex items-center justify-center gap-1 transition-all"
                          >
                            🚀 Participate
                          </button>
                           <div className="flex items-center mt-4" onClick={e => e.stopPropagation()}>
                                              <a
                                                href={comp.apply_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full text-center py-2 rounded-lg text-[10px] font-bold bg-indigo-600/95 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
                                              >
                                                Register Now <ExternalLink className="w-3 h-3" />
                                              </a>
                                            </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 2: Participated (Participated but not shortlisted) */}
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5 space-y-3 flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                    <span className="text-[10px] font-black text-purple-400 uppercase">🚀 Participated ({participatedCases.length})</span>
                  </div>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-none flex-1">
                    {participatedCases.length === 0 ? (
                      <div className="text-center py-12 text-[10px] text-zinc-650 italic">
                        Click "Participate" on saved challenges to track them here.
                      </div>
                    ) : (
                      participatedCases.map(comp => (
                        <div key={comp.id} className="p-3 bg-zinc-900/50 border border-white/5 rounded-lg text-[11px] space-y-2 text-left">
                          <div className="font-bold text-zinc-250 leading-tight">{comp.title}</div>
                          <div className="text-[9px] text-zinc-550 leading-tight">{comp.company}</div>
                          <button
                            onClick={() => handleStageTransition(comp.id, 'shortlisted')}
                            className="w-full py-1.5 bg-purple-500/10 hover:bg-purple-500 hover:text-white rounded text-[10px] font-bold text-purple-400 flex items-center justify-center gap-1 transition-all"
                          >
                            🏆 Shortlist
                          </button>
                          <button
                            onClick={() => handleStageTransition(comp.id, 'saved')}
                            className="w-full text-[9px] text-zinc-500 hover:text-zinc-300 hover:underline transition-all block text-center mt-1"
                          >
                            ← Move to Saved
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Column 3: Shortlisted & Won */}
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5 space-y-3 flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                    <span className="text-[10px] font-black text-emerald-400 uppercase">🥇 Shortlisted & Wins ({shortlistedAndWonCases.length})</span>
                  </div>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-none flex-1">
                    {shortlistedAndWonCases.length === 0 ? (
                      <div className="text-center py-12 text-[10px] text-zinc-650 italic">
                        Milestones reached will appear here.
                      </div>
                    ) : (
                      shortlistedAndWonCases.map(comp => {
                        const isWon = competitionStages[comp.id] === 'won';
                        return (
                          <div 
                            key={comp.id} 
                            className={`p-3 border rounded-lg text-[11px] space-y-2 text-left transition-all ${
                              isWon 
                                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5' 
                                : 'bg-zinc-900/50 border-white/5 text-zinc-250'
                            }`}
                          >
                            <div className="font-bold leading-tight">{comp.title}</div>
                            <div className={`text-[9px] leading-tight ${isWon ? 'text-emerald-500/70' : 'text-zinc-550'}`}>{comp.company}</div>
                            
                            {isWon ? (
                              <div className="space-y-1.5">
                                <div className="w-full py-1 text-center font-black text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20 flex items-center justify-center gap-1 animate-pulse">
                                  👑 National Winner
                                </div>
                                <button
                                  onClick={() => handleStageTransition(comp.id, 'shortlisted')}
                                  className="w-full text-[9px] text-emerald-500/70 hover:text-emerald-400 hover:underline transition-all block text-center font-semibold"
                                >
                                  ← Undo Win (Shortlisted)
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <button
                                  onClick={() => handleStageTransition(comp.id, 'won')}
                                  className="w-full py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black rounded text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1 transition-all"
                                >
                                  🥇 National Win
                                </button>
                                <button
                                  onClick={() => handleStageTransition(comp.id, 'participated')}
                                  className="w-full text-[9px] text-zinc-500 hover:text-zinc-300 hover:underline transition-all block text-center"
                                >
                                  ← Move to Participated
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

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
                              : booking.status === 'pending_mentor'
                              ? 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          }`}>
                            {booking.status === 'pending_admin' ? 'Admin Verifying' : booking.status === 'pending_mentor' ? 'Mentor Reviewing' : booking.status}
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
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-900/20 p-3 border border-white/5 rounded-xl text-xs my-3">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Competition</span>
                            <span className="text-zinc-300 font-bold">{booking.competition_name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Clearing Proof Document</span>
                            <span className="text-indigo-400 font-semibold">📄 {booking.proof_url || 'No document'}</span>
                          </div>
                        </div>

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
