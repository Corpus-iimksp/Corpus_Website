'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore, checkProfileIncomplete } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Framework } from '@/lib/db';
import { 
  ArrowRight, 
  Search, 
  BrainCircuit, 
  ExternalLink, 
  X, 
  BookOpen, 
  Layers,
  ChevronDown,
  Check,
  Building2,
  Trophy
} from 'lucide-react';

export default function LearningHub() {
  const { winningDecks, frameworks, currentStudent } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (currentStudent && checkProfileIncomplete(currentStudent)) {
      router.push('/portal');
    }
  }, [currentStudent, router]);

  const [activeTab, setActiveTab] = useState<'frameworks' | 'decks'>('frameworks');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);

  // Search & Dropdown Filter States for Slide Decks
  const [deckSearchQuery, setDeckSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Distinct list of Companies and Competitions
  const distinctCompanies = Array.from(
    new Set((winningDecks || []).map((d) => d.company?.trim()).filter(Boolean) as string[])
  ).sort();

  const distinctCompetitions = Array.from(
    new Set((winningDecks || []).map((d) => d.competition?.trim()).filter(Boolean) as string[])
  ).sort();

  const q = deckSearchQuery.toLowerCase().trim();

  const matchingCompanies = distinctCompanies.filter((c) =>
    !q || c.toLowerCase().includes(q)
  );

  const matchingCompetitions = distinctCompetitions.filter((c) =>
    !q || c.toLowerCase().includes(q)
  );

  // Filtered winning decks based on search query matching company or competition title
  const filteredDecks = (winningDecks || []).filter((deck) => {
    if (!q) return true;
    const matchCompany = deck.company ? deck.company.toLowerCase().includes(q) : false;
    const matchComp = deck.competition ? deck.competition.toLowerCase().includes(q) : false;
    return matchCompany || matchComp;
  });

  return (
    <div className="relative flex-1 w-full bg-transparent text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background blur overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px]"></div>
      </div>

      {/* Main Title Banner */}
      <div className="border-b border-white/5 pb-8 mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-indigo-400" />
          Case Competition Learning Hub
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Study visual frameworks and access templates of national winning decks.
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-white/5 mb-8 gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('frameworks')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'frameworks' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🗂️ Interactive Frameworks
        </button>
        <button
          onClick={() => setActiveTab('decks')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'decks' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          📂 Winning Deck Repository
        </button>
      </div>

      {/* Tab Panels */}
      
      {/* 2. INTERACTIVE FRAMEWORKS */}
      {activeTab === 'frameworks' && (
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-lg font-bold text-zinc-200">Consulting Frameworks</h3>
            <p className="text-xs text-zinc-500 mt-1">Select any framework to view comprehensive strategic analysis, issue trees, and diagnostic guidance.</p>
          </div>

          {frameworks.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 border border-dashed border-white/5 rounded-2xl">
              No frameworks available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {frameworks.map((fw, idx) => (
                <div 
                  key={fw.id || idx}
                  onClick={() => setSelectedFramework(fw)}
                  className="glass-card rounded-2xl p-6 border border-white/5 hover:border-indigo-500/40 hover:bg-zinc-900/60 transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block">
                        FRAMEWORK
                      </span>
                      {fw.subtitle && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                          {fw.subtitle}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-black text-white group-hover:text-indigo-200 transition-colors">
                      {fw.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed line-clamp-3">
                      {fw.front}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFramework(fw);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm"
                    >
                      <span>Know in Detail</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <span className="text-[10px] text-zinc-500 font-medium">Click to view</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. WINNING DECK REPOSITORY */}
      {activeTab === 'decks' && (
        <div className="space-y-6">
          {/* Search & Filter Dropdown (Combobox with searchable typing & dropdown options) */}
          <div className="relative w-full max-w-xl" ref={dropdownRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={deckSearchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setDeckSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder="Filter by company or competition title (type or pick from dropdown)..."
                className="w-full bg-zinc-950/70 border border-white/10 rounded-2xl pl-10 pr-20 py-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all backdrop-blur-md shadow-lg"
              />
              <div className="absolute right-3 flex items-center gap-1.5">
                {deckSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeckSearchQuery('');
                      setIsDropdownOpen(false);
                    }}
                    className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Clear filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
                  title="Toggle suggestions dropdown"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 z-30 bg-zinc-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-white/5 animate-in fade-in zoom-in-95 duration-150">
                {/* All Decks Option */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeckSearchQuery('');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                      !deckSearchQuery.trim()
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <span>✨ All Decks ({winningDecks.length})</span>
                    {!deckSearchQuery.trim() && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                </div>

                {/* Companies Section */}
                {matchingCompanies.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400/80 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" /> Filter by Company ({matchingCompanies.length})
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {matchingCompanies.map((comp) => {
                        const isSelected = deckSearchQuery.toLowerCase().trim() === comp.toLowerCase().trim();
                        const count = (winningDecks || []).filter(d => d.company?.toLowerCase().trim() === comp.toLowerCase().trim()).length;
                        return (
                          <button
                            key={`comp-${comp}`}
                            type="button"
                            onClick={() => {
                              setDeckSearchQuery(comp);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                              isSelected
                                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                                : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                            }`}
                          >
                            <span className="truncate">{comp}</span>
                            <span className="text-[10px] text-zinc-500 font-medium px-2 py-0.5 rounded bg-zinc-900 border border-white/5 shrink-0 ml-2">
                              {count} {count === 1 ? 'deck' : 'decks'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Competitions Section */}
                {matchingCompetitions.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-indigo-400/80 flex items-center gap-1.5">
                      <Trophy className="w-3 h-3" /> Filter by Competition ({matchingCompetitions.length})
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {matchingCompetitions.map((competition) => {
                        const isSelected = deckSearchQuery.toLowerCase().trim() === competition.toLowerCase().trim();
                        const count = (winningDecks || []).filter(d => d.competition?.toLowerCase().trim() === competition.toLowerCase().trim()).length;
                        return (
                          <button
                            key={`competition-${competition}`}
                            type="button"
                            onClick={() => {
                              setDeckSearchQuery(competition);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                              isSelected
                                ? 'bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/30'
                                : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                            }`}
                          >
                            <span className="truncate">{competition}</span>
                            <span className="text-[10px] text-zinc-500 font-medium px-2 py-0.5 rounded bg-zinc-900 border border-white/5 shrink-0 ml-2">
                              {count} {count === 1 ? 'deck' : 'decks'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* If no exact match in dropdown */}
                {matchingCompanies.length === 0 && matchingCompetitions.length === 0 && (
                  <div className="p-4 text-center text-xs text-zinc-500">
                    No exact company or competition title matches &ldquo;{deckSearchQuery}&rdquo;. Searching across decks by keyword...
                  </div>
                )}
              </div>
            )}
          </div>

          {filteredDecks.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 border border-dashed border-white/5 rounded-2xl">
              No winning decks found matching &ldquo;{deckSearchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredDecks.map(deck => (
                <div key={deck.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
                  <div>
                    <div className="relative h-44 w-full bg-zinc-900 border-b border-white/5 overflow-hidden">
                      <img
                        src={deck.previewImage}
                        alt={deck.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-zinc-300 border border-white/10 shadow-sm">
                          {deck.year}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      {/* Company name & Competition title in BOLD and LARGE text */}
                      <div>
                        {deck.company && (
                          <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">
                            {deck.company}
                          </span>
                        )}
                        <h3 className="font-black text-lg text-white leading-snug group-hover:text-indigo-200 transition-colors">
                          {deck.competition}
                        </h3>
                      </div>

                      {/* Presentation title in smaller text and in grey colour */}
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        {deck.title}
                      </p>

                      {/* Team Name */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Team: <strong className="text-zinc-300 font-semibold">{deck.teamName}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Action / PPT Link */}
                  <div className="p-4 border-t border-white/5 bg-zinc-950/40 flex flex-col gap-2">
                    <a
                      href={deck.fileUrl && deck.fileUrl !== '#' ? deck.fileUrl : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-2 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors text-center ${
                        deck.fileUrl && deck.fileUrl !== '#' 
                          ? 'bg-indigo-500 hover:bg-indigo-600 shadow-sm' 
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                      }`}
                      onClick={(e) => {
                        if (!deck.fileUrl || deck.fileUrl === '#') {
                          e.preventDefault();
                          alert('No custom PPT link has been filled for this deck yet.');
                        }
                      }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open PPT Link
                    </a>
                    {deck.fileUrl && deck.fileUrl !== '#' ? (
                      <a
                        href={deck.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-zinc-500 hover:text-indigo-400 transition-colors underline truncate max-w-full block text-center"
                        title={deck.fileUrl}
                      >
                        {deck.fileUrl}
                      </a>
                    ) : (
                      <div className="text-[10px] text-zinc-500 text-center italic">
                        No custom PPT link filled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Framework Detailed Explanation Modal Popup */}
      {selectedFramework && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedFramework(null)}
        >
          <div 
            className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-5 shrink-0">
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {selectedFramework.subtitle || 'Consulting Framework'}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-semibold">Strategic Methodology</span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">
                  {selectedFramework.name}
                </h2>
              </div>
              
              <button
                onClick={() => setSelectedFramework(null)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="space-y-6 overflow-y-auto pr-2">
              {/* Executive Overview */}
              <div>
                <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Executive Overview
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                  {selectedFramework.front}
                </p>
              </div>

              {/* Detailed Diagnostic Structure */}
              <div>
                <h3 className="text-xs uppercase font-bold text-zinc-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Detailed Explanation & Diagnostic Structure
                </h3>
                <div className="bg-zinc-950/80 p-5 rounded-xl border border-indigo-500/20 font-mono text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed select-text shadow-inner">
                  {selectedFramework.back}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-end shrink-0">
              <button
                onClick={() => setSelectedFramework(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
