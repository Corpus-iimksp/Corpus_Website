'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Competition } from '@/lib/db';
import { 
  Search, 
  Calendar as CalendarIcon, 
  List, 
  LayoutGrid, 
  Star, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Sparkles,
  Download,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const { competitions, savedCompetitions, toggleBookmark, addSystemNotification } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'calendar'>('card');
  const [selectedCompForCountdown, setSelectedCompForCountdown] = useState<Competition | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Default to July 2026 for the interactive calendar (since our data is set there)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed, so 6 is July)

  // Seed default selected competition for countdown if none selected
  useEffect(() => {
    if (competitions.length > 0 && !selectedCompForCountdown) {
      setSelectedCompForCountdown(competitions[0]);
    }
  }, [competitions, selectedCompForCountdown]);

  // Countdown timer effect
  useEffect(() => {
    if (!selectedCompForCountdown) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(`${selectedCompForCountdown.deadline}T23:59:59`).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCompForCountdown]);

  // Filters & Search logic
  const filteredCompetitions = competitions.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Consulting', 'Marketing', 'Product', 'Analytics', 'Finance', 'Operations', 'HR'];



  // Calendar builder helper (July 2026)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalSlots = [...blanks, ...days];

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
      <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-extrabold text-lg text-zinc-100">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/5 rounded-lg p-1">
            <button 
              onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day Grid Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-500 mb-2">
          {dayLabels.map(lbl => <div key={lbl}>{lbl}</div>)}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {totalSlots.map((day, idx) => {
            if (day === null) {
              return <div key={`blank-${idx}`} className="h-20 bg-zinc-900/10 rounded-xl border border-transparent"></div>;
            }

            // Check if any competition deadline falls on this day
            // Construct string date format 'YYYY-MM-DD'
            const currentDayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const matches = competitions.filter(c => c.deadline === currentDayString);
            const opens = competitions.filter(c => c.open_date === currentDayString);

            return (
              <div 
                key={`day-${day}`} 
                className={`h-24 bg-zinc-900/30 rounded-xl border border-white/5 p-1.5 flex flex-col justify-between hover:border-indigo-500/30 hover:bg-zinc-900/60 transition-colors relative overflow-hidden group ${
                  matches.length > 0 ? 'ring-1 ring-red-500/25 bg-red-950/5' : ''
                }`}
              >
                <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300">{day}</span>
                <div className="space-y-1 overflow-y-auto scrollbar-none flex-1 mt-1 max-h-16">
                  {opens.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setSelectedCompForCountdown(o)}
                      className="w-full text-left bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-extrabold text-[8px] rounded px-1 py-0.5 truncate block"
                      title={`Open: ${o.title}`}
                    >
                      🚀 {o.title}
                    </button>
                  ))}
                  {matches.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedCompForCountdown(m)}
                      className="w-full text-left bg-red-500/15 border border-red-500/20 text-red-400 font-extrabold text-[8px] rounded px-1 py-0.5 truncate block animate-pulse"
                      title={`Deadline: ${m.title}`}
                    >
                      🚨 {m.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            🏆 Opportunity Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Discover upcoming national case challenges, manage milestones, and book mentoring slots.
          </p>
        </div>

        {/* View Switches & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search title, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 border border-white/5 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'card' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="List View"
            >
              <List className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'calendar' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Calendar Timeline View"
            >
              <CalendarIcon className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filters/Feed, Right Highlight Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: Filters & Competition Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Categories Horizontal Scrolling Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-500/10 border-indigo-500/35 text-indigo-300'
                    : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Conditional Views Render */}
          {filteredCompetitions.length === 0 ? (
            <div className="glass-panel text-center py-20 rounded-2xl border-white/5 text-zinc-500">
              No matching competitions found for &ldquo;{searchQuery}&rdquo; under {selectedCategory}.
            </div>
          ) : viewMode === 'calendar' ? (
            renderCalendar()
          ) : viewMode === 'list' ? (
            /* LIST VIEW */
            <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40 uppercase tracking-wider">
                      <th className="p-4">Competition</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Deadline</th>
                      <th className="p-4">Prize Pool</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredCompetitions.map(comp => (
                      <tr 
                        key={comp.id}
                        className="hover:bg-zinc-900/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedCompForCountdown(comp)}
                      >
                        <td className="p-4 font-bold text-zinc-200">{comp.title}</td>
                        <td className="p-4 text-zinc-400">{comp.company}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-white/5">
                            {comp.category}
                          </span>
                        </td>
                        <td className="p-4 text-red-400 font-semibold">{comp.deadline}</td>
                        <td className="p-4 text-emerald-400 font-bold">{comp.prize_pool}</td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleBookmark(comp.id)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                savedCompetitions.includes(comp.id)
                                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                                  : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'
                              }`}
                              title="Bookmark"
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>

                            <a
                              href={comp.apply_link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* CARD VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCompetitions.map(comp => (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompForCountdown(comp)}
                  className={`glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer border ${
                    selectedCompForCountdown?.id === comp.id ? 'border-indigo-500 bg-indigo-950/10' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase">
                        {comp.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(comp.id);
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            savedCompetitions.includes(comp.id)
                              ? 'text-amber-400 hover:text-amber-500'
                              : 'text-zinc-600 hover:text-zinc-400'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold text-white mb-1 leading-snug">{comp.title}</h3>
                    <span className="text-xs text-zinc-500 font-semibold mb-3 block">{comp.company}</span>

                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 mb-4">
                      <div>
                        <span className="text-zinc-500 block">PRIZE POOL</span>
                        <span className="font-bold text-emerald-400">{comp.prize_pool}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">DEADLINE</span>
                        <span className="font-bold text-red-400">{comp.deadline}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-4" onClick={e => e.stopPropagation()}>
                    <a
                      href={comp.apply_link}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center py-2 rounded-lg text-[10px] font-bold bg-indigo-600/95 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      Register Now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Hand: Countdown Focus & Milestones Details */}
        <div className="space-y-6">
          
          {selectedCompForCountdown ? (
            <div className="glass-panel p-6 rounded-2xl border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-1 text-[10px] font-extrabold text-red-400 uppercase tracking-widest animate-pulse mb-3">
                <Clock className="w-3.5 h-3.5" />
                Live Registration Ticker
              </div>

              <h3 className="text-lg font-black text-white mb-1 leading-snug">
                {selectedCompForCountdown.title}
              </h3>
              <span className="text-xs text-zinc-500 font-semibold mb-6 block">
                by {selectedCompForCountdown.company}
              </span>

              {/* Countdown Ticker */}
              <div className="grid grid-cols-4 gap-2 text-center mb-6">
                <div className="bg-zinc-900 border border-white/5 rounded-xl py-2.5">
                  <span className="block text-2xl font-black text-indigo-400">{timeLeft.days}</span>
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Days</span>
                </div>
                <div className="bg-zinc-900 border border-white/5 rounded-xl py-2.5">
                  <span className="block text-2xl font-black text-indigo-400">{timeLeft.hours}</span>
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Hours</span>
                </div>
                <div className="bg-zinc-900 border border-white/5 rounded-xl py-2.5">
                  <span className="block text-2xl font-black text-indigo-400">{timeLeft.minutes}</span>
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Mins</span>
                </div>
                <div className="bg-zinc-900 border border-white/5 rounded-xl py-2.5">
                  <span className="block text-2xl font-black text-indigo-400">{timeLeft.seconds}</span>
                  <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Secs</span>
                </div>
              </div>

              {/* Milestones / Timelines */}
              <div className="border-t border-white/5 pt-4 space-y-4 mb-6 text-xs">
                <div>
                  <span className="text-zinc-500 block font-bold">Registration Opens:</span>
                  <span className="text-zinc-300 font-semibold">{selectedCompForCountdown.open_date}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-bold">Hard Deadline:</span>
                  <span className="text-red-400 font-semibold">{selectedCompForCountdown.deadline} 23:59 IST</span>
                </div>
                <div>
                  <span className="text-zinc-500 block font-bold">Structure Timeline:</span>
                  <span className="text-zinc-400 leading-relaxed block mt-1">
                    {selectedCompForCountdown.timeline}
                  </span>
                </div>
              </div>

              <a
                href={selectedCompForCountdown.apply_link}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center py-2.5 rounded-xl text-xs font-bold neon-gradient hover:opacity-90 block text-white shadow-md shadow-indigo-500/10"
              >
                Launch Register Portal
              </a>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border-white/5 text-center text-xs text-zinc-600">
              Select a competition card to view its live registration ticker and milestone checklist.
            </div>
          )}

          {/* Quick Mentors Banner */}
          <div className="glass-panel p-5 rounded-2xl border-white/5 bg-gradient-to-br from-indigo-950/20 to-purple-950/20">
            <Sparkles className="w-6 h-6 text-indigo-400 mb-2" />
            <h4 className="font-bold text-xs text-zinc-200">Stuck on a case submission?</h4>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
              Book a verified winner mentor to review your structure. Get input on your MECE framework.
            </p>
            <a href="/#mentors-section" className="text-[10px] font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1 mt-3">
              Browse Mentors Now <ArrowRight className="w-3 h-3" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
