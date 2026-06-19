'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { db, WinningDeck } from '@/lib/db';
import { 
  BookOpen, 
  HelpCircle, 
  Layers, 
  FileText, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Download, 
  Sparkles,
  Search,
  ThumbsUp,
  BrainCircuit
} from 'lucide-react';

export default function LearningHub() {
  const { addSystemNotification } = useStore();
  const [activeTab, setActiveTab] = useState<'basics' | 'frameworks' | 'decks' | 'practice'>('frameworks');
  
  // States for Mock Case Practice
  const [selectedCaseType, setSelectedCaseType] = useState<'Consulting' | 'Marketing' | 'Product' | 'Analytics' | null>(null);
  const [practiceStep, setPracticeStep] = useState<number>(0);
  const [studentHypothesis, setStudentHypothesis] = useState('');
  const [showPracticeResult, setShowPracticeResult] = useState(false);

  // Deck downloads mock
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({
    'deck-1': 142,
    'deck-2': 98,
    'deck-3': 215
  });

  const handleDownload = (deckId: string, title: string) => {
    setDownloadCounts(prev => ({
      ...prev,
      [deckId]: prev[deckId] + 1
    }));
    addSystemNotification({
      id: `download-${Date.now()}`,
      title: '📥 Deck Downloaded',
      message: `Successfully downloaded template package for "${title}".`,
      type: 'system',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    alert(`Downloading PPT Template: "${title}" has started! Check your downloads.`);
  };

  // Static Data
  const basicsTopics = [
    {
      title: "What is a Case Competition?",
      desc: "A business case competition is a mock challenge where students formulate corporate solutions to complex problems under a tight deadline, pitching to panel judges.",
      insights: ["Always start with a clear problem definition.", "Focus on financial viability and real-world execution."]
    },
    {
      title: "Competition Lifecycle",
      desc: "Typical steps: Case Release -> 48-hour Prep -> Slide Deck upload -> Campus Heats -> Regional Semis -> National Grand Finale.",
      insights: ["Dedicate the first 20% of your time to structuring, not drafting.", "Rehearse Q&A thoroughly."]
    },
    {
      title: "Team Formation",
      desc: "Ideal team size is 3-4. Mix complementary skills: 1 Strategy Lead, 1 Financial Modeler, 1 GTM/Marketing Specialist, and 1 Visual Design master.",
      insights: ["A cohesive team of different backgrounds performs 3x better.", "Assign roles early."]
    },
    {
      title: "Presentation Design",
      desc: "Slide visuals dictate credibility. Use standard consulting palettes, executive summary banners on every slide, and 'So What?' message titles.",
      insights: ["Limit text per slide; use structure grids.", "Ensure charts have clean sources and highlights."]
    }
  ];

  const frameworks = [
    {
      name: "Profitability Framework",
      subtitle: "Diagnose Profit Drops",
      front: "Used to isolate drivers of declining profits by branching Profit into Revenue and Costs.",
      back: "Profit = (Price x Quantity) - (Fixed Costs + Variable Costs)\n\nKey questions:\n1. Is it a revenue drop or cost rise?\n2. If revenue, is it a volume drop or price pressure?\n3. If cost, is fixed overhead rising or input materials?",
      gradient: "from-indigo-600 to-purple-600"
    },
    {
      name: "Market Entry",
      subtitle: "New Market Feasibility",
      front: "Analyze if a company should enter a new geographic region or product space.",
      back: "Four Core Pillars:\n1. Market attractiveness (size, growth, competitors)\n2. Financials (investment, break-even, margins)\n3. Capabilities (operations, supply, talent)\n4. Risk & Entry Mode (M&A, Joint Venture, Organic)",
      gradient: "from-purple-600 to-indigo-600"
    },
    {
      name: "Growth Strategy",
      subtitle: "Scale Revenues",
      front: "Identify avenues for business expansion and revenue optimization.",
      back: "Ansoff Matrix:\n1. Market Penetration (sell more existing products to existing users)\n2. Market Development (new users for existing products)\n3. Product Development (new products to existing users)\n4. Diversification (new products to new users)",
      gradient: "from-indigo-600 to-sky-600"
    },
    {
      name: "Pricing Strategy",
      subtitle: "Maximize Value Capture",
      front: "Determine how to price a new product or optimize current prices.",
      back: "Three Core Approaches:\n1. Cost-Based (cost + margin target)\n2. Competitor-Based (benchmarked to rivals)\n3. Value-Based (tied to customer willingness-to-pay & ROI)\n\nConsider segment bundles & elasticities.",
      gradient: "from-sky-600 to-purple-600"
    },
    {
      name: "M&A Framework",
      subtitle: "Evaluate Acquisitions",
      front: "Determine if merging with or buying another business makes commercial sense.",
      back: "Analysis Steps:\n1. Strategic fit (synergies, IP, market share)\n2. Valuation (financial multiples, cash flow)\n3. Post-merger integration costs & timeline\n4. Regulatory hurdle risks",
      gradient: "from-purple-600 to-sky-600"
    },
    {
      name: "GTM Framework",
      subtitle: "Go-To-Market Plan",
      front: "Plan launch vectors to take a new product directly to market.",
      back: "Five Action Pillars:\n1. Target Customer Segment (personas)\n2. Value Proposition (messaging)\n3. Channels (direct, retail, digital)\n4. Pricing Model & Promos\n5. KPIs (CAC, LTV, conversion rates)",
      gradient: "from-sky-600 to-indigo-600"
    }
  ];

  // Cases for Mock Case practice
  const cases = {
    Consulting: {
      title: "Airlines Profit Pinch",
      prompt: "GoAirways is facing a 12% drop in quarterly profitability despite a 5% increase in total passengers flying. How do you diagnose the root cause?",
      choices: [
        { label: "Immediately recommend reducing staff salaries to cut operation overhead.", correct: false, feedback: "Incorrect. You must diagnose first. Jumping to a cost solution without isolating the driver is poor consulting methodology." },
        { label: "Break profit into Revenue and Costs. Investigate revenue changes (ticket prices vs. cargo loads) and cost changes (fuel, fleet maint).", correct: true, feedback: "Correct! By applying the MECE Profitability Framework, you systematically isolate whether a pricing drop, cargo capacity failure, or operating costs (like fuel spikes) is driving the pinch." },
        { label: "Launch a new marketing campaign to attract high-paying premium flyers.", correct: false, feedback: "Incorrect. While a premium campaign might help long-term, it doesn't diagnose why profits are dropping right now despite passenger growth." }
      ],
      solution: "The diagnosis reveals that while passenger count rose by 5%, average ticket yield dropped by 15% due to price matching in secondary hubs, and fuel costs spiked by 8%. Recommendation: Re-optimize route allocations and lock in fuel hedge futures."
    },
    Marketing: {
      title: "EcoBottle GTM Strategy",
      prompt: "A beverage startup has designed a 100% biodegradable seaweed water bottle. They need a premium GTM strategy to target Gen-Z gym-goers. Where do you start?",
      choices: [
        { label: "Partner with local high-end boutique fitness chains and athletic influencers to seed the bottle directly.", correct: true, feedback: "Correct! Partnering with niche premium fitness chains targets the exact demographic with a high willingness-to-pay, bypassing heavy mass retail entry costs." },
        { label: "Distribute in local grocery supermarkets via discount price matching.", correct: false, feedback: "Incorrect. EcoBottles have high production costs; discount mass-marketing will squeeze margins and erode premium brand value." }
      ],
      solution: "Focus GTM on a D2C subscription plus micro-retail spots in premium gyms (Equinox, Gold's). Target price point ₹120/bottle. Drive branding around eco-sustainability badges."
    },
    Product: {
      title: "Fintech App Engagement Split",
      prompt: "A micro-savings app sees high user signups but a 60% drop in active savings deposits by Week 3. How do you optimize product engagement?",
      choices: [
        { label: "Increase notification spam alerting users to save money.", correct: false, feedback: "Incorrect. Spamming alerts often triggers high app uninstalls." },
        { label: "Analyze deposit flows. Gamify the process with small savings streak badges and automatic round-ups.", correct: true, feedback: "Correct! Product friction and lack of habit loop are standard drivers of early churn. Automating deposits and gamifying streaks fixes the retention leak." }
      ],
      solution: "Implement card round-ups (e.g. spend ₹95, save ₹5 automatically). Release 'Streak Champ' badges. Testing shows retention bumps by 35%."
    },
    Analytics: {
      title: "Churn Analytics Model",
      prompt: "A telecom giant wants to build a predictive model to flag customers about to switch network providers. Which inputs are most predictive?",
      choices: [
        { label: "User age and residential address.", correct: false, feedback: "Incorrect. Demographic variables are weak churn predictors compared to usage trends." },
        { label: "Network drop rate logs, customer service calls, and sudden contract renewal changes.", correct: true, feedback: "Correct! High network drop rates and frequent support calls directly correlate with service frustration and imminent churn." }
      ],
      solution: "Train a random forest classifier using monthly drop call logs and support ticketing sentiment. Trigger automated discount coupon pop-ups when customers show high churn risks."
    }
  };

  const currentCase = selectedCaseType ? cases[selectedCaseType] : null;

  const handlePracticeSubmit = () => {
    if (!studentHypothesis.trim()) return;
    setShowPracticeResult(true);
    addSystemNotification({
      id: `case-submit-${Date.now()}`,
      title: '🎯 Practice Case Submitted',
      message: `Completed draft solution for ${currentCase?.title}. Review the expert analysis response.`,
      type: 'system',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background blur overlays */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Main Title Banner */}
      <div className="border-b border-white/5 pb-8 mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-indigo-400" />
          Case Competition Learning Hub
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Study visual frameworks, download templates of national winning decks, and practice mock business case studies.
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
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'practice' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🧩 LeetCode Mock Sandbox
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
        <button
          onClick={() => setActiveTab('basics')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'basics' 
              ? 'border-indigo-500 text-indigo-300 bg-indigo-500/5' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          📖 Case Basics 101
        </button>
      </div>

      {/* Tab Panels */}
      
      {/* 1. BASICS TOPICS */}
      {activeTab === 'basics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {basicsTopics.map((topic, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-2 right-4 text-2xl font-black text-zinc-800">
                0{i + 1}
              </div>
              <h3 className="text-base font-extrabold text-white mb-2">{topic.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">{topic.desc}</p>
              
              <div className="border-t border-white/5 pt-3 mt-3 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Strategic Insights</span>
                {topic.insights.map((ins, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-indigo-300 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span>{ins}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. INTERACTIVE FRAMEWORKS */}
      {activeTab === 'frameworks' && (
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-lg font-bold text-zinc-200">Consulting Frameworks Flashcards</h3>
            <p className="text-xs text-zinc-500 mt-1">Hover over or tap a card to flip it and view the structural analysis guide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {frameworks.map((fw, idx) => (
              <div 
                key={idx}
                className="h-64 [perspective:1000px] group cursor-pointer"
              >
                <div className="relative w-full h-full duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Front Side */}
                  <div className="absolute w-full h-full p-6 rounded-2xl border border-white/5 bg-zinc-950/80 [backface-visibility:hidden] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block mb-2">FRAMEWORK</span>
                      <h4 className="text-lg font-black text-white">{fw.name}</h4>
                      <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                        {fw.front}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3">
                      <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
                        {fw.subtitle}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                        Flip Card <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-full h-full p-6 rounded-2xl border border-indigo-500/20 bg-zinc-900 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-400 uppercase font-black tracking-widest block mb-1">Diagnostic Structure</span>
                      <div className="text-xs text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap mt-2 select-text">
                        {fw.back}
                      </div>
                    </div>
                    
                    <span className="text-[9px] text-zinc-500 text-right font-semibold">
                      Double check logic with MECE
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WINNING DECK REPOSITORY */}
      {activeTab === 'decks' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {db.getWinningDecks().map(deck => (
            <div key={deck.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/5">
              <div>
                <div className="relative h-40 w-full bg-zinc-900 border-b border-white/5">
                  <img
                    src={deck.previewImage}
                    alt={deck.title}
                    className="w-full h-full object-cover opacity-60 hover:opacity-85 transition-opacity"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500 text-white">
                    {deck.year} Winner
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">
                    {deck.competition}
                  </span>
                  <h3 className="font-extrabold text-sm text-zinc-200 leading-snug mb-2">
                    {deck.title}
                  </h3>
                  <span className="text-xs text-zinc-400 font-medium">Team: {deck.teamName}</span>

                  <div className="flex flex-wrap gap-1 mt-4">
                    {deck.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] font-medium border border-white/5 text-zinc-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-white/5 bg-zinc-950/40 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-semibold">
                  {downloadCounts[deck.id]} downloads
                </span>
                
                <button
                  onClick={() => handleDownload(deck.id, deck.title)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download PPT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. MOCK CASE PRACTICE ("LeetCode Sandbox") */}
      {activeTab === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Side Select Column */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-widest mb-2">Select Niche Sandbox</h3>
            {['Consulting', 'Marketing', 'Product', 'Analytics'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedCaseType(type as any);
                  setPracticeStep(0);
                  setStudentHypothesis('');
                  setShowPracticeResult(false);
                }}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedCaseType === type
                    ? 'bg-indigo-950/20 border-indigo-500/50 text-indigo-300 font-extrabold'
                    : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <div>
                  <h4 className="text-xs">{type} Case Prompt</h4>
                  <span className="text-[9px] text-zinc-500">10 mins practice | Intermediate</span>
                </div>
                <Play className="w-4 h-4 shrink-0" />
              </button>
            ))}

            <div className="glass-panel p-4 rounded-xl border-white/5 bg-zinc-950/20 text-[10px] text-zinc-500 leading-relaxed mt-4">
              💡 Complete the structured exercise to earn **Case Champion** badge points automatically.
            </div>
          </div>

          {/* Sandbox Workspace Area */}
          <div className="lg:col-span-2">
            {selectedCaseType && currentCase ? (
              <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
                
                {/* Header status */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {selectedCaseType} Active Case
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Status: In Progress</span>
                </div>

                {/* Prompt */}
                <div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">Problem Statement</span>
                  <h3 className="text-base font-extrabold text-white leading-relaxed">
                    {currentCase.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-2 p-3 bg-zinc-900/40 border border-white/5 rounded-xl">
                    &ldquo;{currentCase.prompt}&rdquo;
                  </p>
                </div>

                {/* Exercises Steps */}
                {practiceStep === 0 ? (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block">Step 1: Choose the correct diagnostic approach</span>
                    <div className="space-y-2.5">
                      {currentCase.choices.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            alert(ch.feedback);
                            if (ch.correct) {
                              setPracticeStep(1);
                            }
                          }}
                          className="w-full text-left p-3 rounded-xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-900 text-xs text-zinc-300 leading-relaxed transition-colors"
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider block">Step 2: Formulate your Hypothesis & slide structure</span>
                    <textarea
                      rows={4}
                      value={studentHypothesis}
                      onChange={(e) => setStudentHypothesis(e.target.value)}
                      placeholder="Outline your hypothesis and what data you would request from GoAirways..."
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
                    ></textarea>

                    <div className="flex gap-2">
                      <button
                        onClick={handlePracticeSubmit}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white"
                      >
                        Submit Solver Draft
                      </button>
                      <button
                        onClick={() => setPracticeStep(0)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-200"
                      >
                        Back
                      </button>
                    </div>

                    {showPracticeResult && (
                      <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 mt-6 animate-in fade-in duration-300">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 uppercase">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          Expert consulting walkthrough
                        </div>
                        <p className="text-xs text-zinc-300 mt-2 leading-relaxed whitespace-pre-line">
                          {currentCase.solution}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <button 
                            onClick={() => {
                              setSelectedCaseType(null);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg"
                          >
                            Mark Solved (+15 XP)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <div className="glass-panel p-12 rounded-2xl border-white/5 text-center flex flex-col items-center justify-center">
                <BrainCircuit className="w-10 h-10 text-zinc-600 mb-2" />
                <h4 className="font-bold text-sm text-zinc-400">Select a practice sandbox to start the prompt solver.</h4>
                <p className="text-xs text-zinc-500 mt-1">Practice structures for consulting, marketing, product, and data-science case finals.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
