'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Star, 
  Briefcase, 
  Target, 
  Award,
  ChevronRight,
  TrendingUp,
  FileCheck,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Upload
} from 'lucide-react';

export default function Home() {
  const { competitions, mentors, bookSession, currentStudent } = useStore();
  const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingCompName, setBookingCompName] = useState('');
  const [bookingProofName, setBookingProofName] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: 'Live Opportunities', val: '50+' },
    { label: 'Winner Mentors', val: '15+' },
    { label: 'Total Prize Pools', val: '₹50L+' },
    { label: 'Mock Cases Solved', val: '1,200+' }
  ];

  const testimonials = [
    { name: 'Kunal Verma', role: 'PGP MBA 2nd Year', quote: 'CORPUS was my secret weapon for L\'Oréal Brandstorm. The profitability framework and the mock feedback from Abhishek helped us clinch the National Semi-finals.', rating: 5, avatar: 'KV' },
    { name: 'Shreya Iyer', role: 'PGP MBA 1st Year', quote: 'Connecting with Priya gave us instant clarity on HUL L.I.M.E.\'s target persona. Highly recommend booking a session before submitting your executive summary!', rating: 5, avatar: 'SI' }
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;
    if (!bookingCompName || !bookingProofName) {
      alert("Please fill in Case Competition Name and upload Round 1 Proof document.");
      return;
    }
    
    bookSession(selectedMentor.id, bookingTime, bookingNotes, bookingCompName, bookingProofName);
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedMentor(null);
      setBookingSuccess(false);
      setBookingTime('');
      setBookingNotes('');
      setBookingCompName('');
      setBookingProofName('');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 pb-20">
      
      {/* Background Neon Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Built exclusively for IIM Kashipur students
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Master Case Competitions <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400">
              Like a Consultant
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            CORPUS is your ultimate preparation platform. Discover upcoming case challenges, study structured winning frameworks, and get 1:1 mentoring from verified champions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="glow-btn neon-gradient text-white px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 hover:opacity-90 shadow-lg shadow-indigo-500/20 w-full sm:w-auto justify-center"
            >
              Explore Competitions
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#mentors-section"
              className="glass-card text-zinc-300 px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 hover:text-white border border-white/10 hover:bg-white/5 w-full sm:w-auto justify-center"
            >
              Book a Mentor
            </a>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-zinc-950/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center p-4">
              <span className="block text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                {s.val}
              </span>
              <span className="text-xs sm:text-sm text-zinc-500 font-medium uppercase tracking-wider block mt-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Competitions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Featured Competitions</h2>
            <p className="text-zinc-500 text-sm mt-1">High-stakes corporate challenges closing registration soon.</p>
          </div>
          <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1">
            View All Dashboard
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mounted && competitions.slice(0, 3).map((comp) => (
            <div key={comp.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase">
                    {comp.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {comp.deadline}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 leading-snug">{comp.title}</h3>
                <span className="text-xs text-zinc-500 font-semibold mb-4 block">{comp.company}</span>

                <div className="bg-zinc-900/60 rounded-xl p-3.5 border border-white/5 mb-6">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Prize Pool:</span>
                    <span className="font-bold text-emerald-400">{comp.prize_pool}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1.5">
                    <span className="text-zinc-500">Organizer:</span>
                    <span className="font-medium text-zinc-300">{comp.organizer}</span>
                  </div>
                </div>
              </div>

              <a
                href={comp.apply_link}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/5 transition-colors"
              >
                Apply Direct
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Mentors Section */}
      <section id="mentors-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Get 1:1 Mentorship from Winners</h2>
          <p className="text-zinc-500 text-sm mt-2">Skip the trial-and-error. Connect with seniors who won the specific challenges.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mounted && mentors.map((mentor) => (
            <div key={mentor.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={mentor.profile_photo}
                    alt={mentor.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/25 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{mentor.name}</h3>
                    <span className="text-xs text-zinc-500 block">{mentor.current_role}</span>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold mt-1">
                      <Star className="w-3 h-3 fill-current" />
                      {mentor.rating} (Verified Winner)
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Expertise</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mentor.expertise.map((exp, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-900 border border-white/5 text-zinc-300">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">National Titles</span>
                  <div className="space-y-1 mt-1">
                    {mentor.competitions_won.map((title, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                        <Award className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                        <span className="truncate">{title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMentor(mentor)}
                className="w-full text-center py-3 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/10 transition-colors"
              >
                Book Session
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
        
        {/* Left Column: Corpus 2025-26 Leaderboard */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <div>
              <h2 className="text-lg font-black text-white">🏆 Corpus 2025-26 Leaderboard</h2>
              <span className="text-[11px] text-zinc-500 font-medium">Top performers ranked by accumulated XP Points</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Season 2025-26
            </span>
          </div>

          <div className="space-y-3">
            {/* Rank 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/10">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-black text-amber-400 text-sm">1</span>
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-300 uppercase">
                  AS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Abhishek Sen (Mentor)</h4>
                  <span className="text-[9px] text-zinc-500">2 wins, 1 runner-up | Bain & Co.</span>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-300">1,200 XP Points</span>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-black text-zinc-400 text-sm">2</span>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-xs text-purple-300 uppercase">
                  RM
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Rohan Mehta (Mentor)</h4>
                  <span className="text-[9px] text-zinc-500">1 win, 2 final lists | Microsoft PM</span>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-300">1,050 XP Points</span>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-black text-amber-750 text-sm">3</span>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-xs text-emerald-300 uppercase">
                  PS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Priya Sharma (Mentor)</h4>
                  <span className="text-[9px] text-zinc-500">1 win | HUL Management Trainee</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-300">980 XP Points</span>
            </div>

            {/* Rank 4 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-semibold text-zinc-600 text-xs">4</span>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-semibold text-xs text-zinc-300 uppercase">
                  {mounted && currentStudent ? currentStudent.name.substring(0, 2) : 'AS'}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">
                    {mounted && currentStudent ? `${currentStudent.name} (Mentee)` : 'Aravind Swamy (Mentee)'}
                  </h4>
                  <span className="text-[9px] text-zinc-500">1 win, 2 shortlists | PGP1 Student</span>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400">820 XP Points</span>
            </div>

            {/* Rank 5 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-semibold text-zinc-600 text-xs">5</span>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-semibold text-xs text-zinc-300 uppercase">
                  SI
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Shreya Iyer (Mentee)</h4>
                  <span className="text-[9px] text-zinc-500">1 shortlist | PGP1 Student</span>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400">750 XP Points</span>
            </div>
          </div>
        </div>

        {/* Right Column: Corpus 2026-27 Leaderboard */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <div>
              <h2 className="text-lg font-black text-white">🏆 Corpus 2026-27 Leaderboard</h2>
              <span className="text-[11px] text-zinc-500 font-medium">Top active candidates ranked by current experience points</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Season 2026-27
            </span>
          </div>

          <div className="space-y-3">
            {/* Rank 1 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/10">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-black text-amber-400 text-sm">1</span>
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-xs text-purple-300 uppercase">
                  KV
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Kunal Verma (Mentee)</h4>
                  <span className="text-[9px] text-zinc-500">2 wins, Brandstorm National Finalist</span>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-300">1,450 Experience Points</span>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-black text-zinc-400 text-sm">2</span>
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-xs text-indigo-300 uppercase">
                  AS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Abhishek Sen (Mentor)</h4>
                  <span className="text-[9px] text-zinc-500">Associate Consultant | Bain & Co.</span>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-300">1,300 Experience Points</span>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-black text-amber-750 text-sm">3</span>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-xs text-emerald-300 uppercase">
                  PS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Priya Sharma (Mentor)</h4>
                  <span className="text-[9px] text-zinc-500">Management Trainee | HUL</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-300">1,150 Experience Points</span>
            </div>

            {/* Rank 4 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-semibold text-zinc-600 text-xs">4</span>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-semibold text-xs text-zinc-300 uppercase">
                  RM
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Rohan Mehta (Mentor)</h4>
                  <span className="text-[9px] text-zinc-500">Product Manager | Microsoft</span>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400">980 Experience Points</span>
            </div>

            {/* Rank 5 */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 border border-white/5">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-semibold text-zinc-600 text-xs">5</span>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-semibold text-xs text-zinc-300 uppercase">
                  RG
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-200">Riya Goel (Mentee)</h4>
                  <span className="text-[9px] text-zinc-500">1 win | PGP2 Student</span>
                </div>
              </div>
              <span className="text-xs font-bold text-zinc-400">880 Experience Points</span>
            </div>
          </div>
        </div>

      </section>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl border-white/10 p-6 shadow-2xl animate-in fade-in duration-200 relative">
            <button
              onClick={() => setSelectedMentor(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 text-sm font-semibold"
            >
              Cancel
            </button>

            <h3 className="text-xl font-bold text-white mb-4">Book 1:1 Mentorship Session</h3>
            
            {bookingSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 animate-bounce" />
                <h4 className="text-lg font-bold text-white">Request Submitted!</h4>
                <p className="text-xs text-zinc-400 mt-1">Pending review. Mentor will receive request and emails will be dispatched.</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-white/5 mb-2">
                  <img src={selectedMentor.profile_photo} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold block">MENTOR</span>
                    <h4 className="text-sm font-bold text-zinc-200">{selectedMentor.name}</h4>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Select Slots / Available Days</label>
                  <select
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">-- Choose Slot --</option>
                    {selectedMentor.available_days.map((day: string) => 
                      selectedMentor.available_slots.map((slot: string) => (
                        <option key={`${day}-${slot}`} value={`${day} at ${slot}`}>
                          {day} - {slot}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Case Competition Name</label>
                  <input
                    type="text"
                    required
                    value={bookingCompName}
                    onChange={(e) => setBookingCompName(e.target.value)}
                    placeholder="E.g., L'Oréal Brandstorm 2026"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Upload Proof of Clearing Round 1</label>
                  <div className="border border-dashed border-white/10 rounded-xl p-4 text-center bg-zinc-900/30">
                    <Upload className="w-5 h-5 text-zinc-500 mx-auto mb-1.5" />
                    <button
                      type="button"
                      onClick={() => {
                        const mockFile = `${currentStudent?.name?.toLowerCase().replace(/\s+/g, '_') || 'student'}_round1_proof.pdf`;
                        setBookingProofName(mockFile);
                        alert(`Document uploaded: ${mockFile}`);
                      }}
                      className="text-[10px] font-bold text-indigo-400 hover:underline cursor-pointer"
                    >
                      {bookingProofName ? `Attached: ${bookingProofName}` : 'Upload Round 1 Clearance Verification File'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Briefly outline your case questions</label>
                  <textarea
                    required
                    rows={4}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="E.g., We are preparing our draft slides for Tata Imagination Challenge, need feedback on our profitability breakdown methodology..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div className="text-[10px] text-zinc-500">
                  ⚡ Requesting standard simulation. Status pending. Email notification sent automatically.
                </div>

                <button
                  type="submit"
                  className="w-full text-center py-2.5 rounded-lg text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                >
                  Submit Booking Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

