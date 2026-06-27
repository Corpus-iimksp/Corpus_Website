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
  const { addSystemNotification, winningDecks, frameworks, basicsTopics, quizzes } = useStore();
  const [activeTab, setActiveTab] = useState<'basics' | 'frameworks' | 'decks' | 'practice'>('frameworks');
  
  // Practice Quiz States
  const [selectedPractice, setSelectedPractice] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [practiceScore, setPracticeScore] = useState<number | null>(null);
  const [practiceCompleted, setPracticeCompleted] = useState<boolean>(false);

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
          🧩 Mock Case Practice
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
          {winningDecks.map(deck => (
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
                    {deck.tags?.map((tag: string, i: number) => (
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

      {/* 4. MOCK CASE PRACTICE (MCQ Quizzes) */}
      {activeTab === 'practice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
          
          {/* Side Select Column */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-widest mb-2">Practice Quizzes</h3>
            {quizzes.map((quiz) => {
              return (
                <button
                  key={quiz.id}
                  onClick={() => {
                    setSelectedPractice(quiz.id);
                    setCurrentQuestionIndex(0);
                    setUserAnswers({});
                    setPracticeScore(null);
                    setPracticeCompleted(false);
                  }}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedPractice === quiz.id
                      ? 'bg-indigo-950/20 border-indigo-500/50 text-indigo-300 font-extrabold'
                      : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold">{quiz.title}</h4>
                    <span className="text-[9px] text-zinc-500">{(quiz.questions || []).length} MCQs | Frameworks & Strategy</span>
                  </div>
                  <Play className="w-4 h-4 shrink-0 text-indigo-400" />
                </button>
              );
            })}
          </div>

          {/* Quiz Workspace Area */}
          <div className="lg:col-span-2">
            {selectedPractice ? (() => {
              const quiz = quizzes.find(q => q.id === selectedPractice);
              if (!quiz) return null;
              const questions = quiz.questions || [];
              const activeQuestion = questions[currentQuestionIndex];
              const totalQuestions = questions.length;
              
              return (
                <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
                  
                  {/* Header status */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {quiz.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {practiceCompleted ? 'Status: Completed' : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
                    </span>
                  </div>

                  {!practiceCompleted ? (
                    // Active Question View
                    activeQuestion ? (
                      <div className="space-y-6">
                        {/* Question text */}
                        <div>
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider block mb-1">
                            Question {currentQuestionIndex + 1}
                          </span>
                          <h3 className="text-sm font-extrabold text-white leading-relaxed">
                            {activeQuestion.q}
                          </h3>
                        </div>

                        {/* Options list */}
                        <div className="space-y-2.5">
                          {(activeQuestion.options || []).map((opt, idx) => {
                            const isSelected = userAnswers[currentQuestionIndex] === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: idx }));
                                }}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs leading-relaxed ${
                                  isSelected
                                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                                    : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                                }`}
                              >
                                <span className="inline-block w-5 h-5 rounded-full bg-zinc-900/60 border border-white/10 text-center leading-5 mr-3 text-[10px] font-bold text-zinc-400">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-white/5">
                          <button
                            onClick={() => {
                              if (currentQuestionIndex > 0) {
                                setCurrentQuestionIndex(prev => prev - 1);
                              }
                            }}
                            disabled={currentQuestionIndex === 0}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 border border-white/5 text-zinc-450 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                          >
                            Previous
                          </button>

                          {currentQuestionIndex < totalQuestions - 1 ? (
                            <button
                              onClick={() => {
                                if (userAnswers[currentQuestionIndex] !== undefined) {
                                  setCurrentQuestionIndex(prev => prev + 1);
                                } else {
                                  alert('Please select an option to proceed.');
                                }
                              }}
                              disabled={userAnswers[currentQuestionIndex] === undefined}
                              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:pointer-events-none transition-all"
                            >
                              Next Question
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (userAnswers[currentQuestionIndex] === undefined) {
                                  alert('Please select an option to finish.');
                                  return;
                                }
                                
                                // Calculate score
                                let finalScore = 0;
                                questions.forEach((q, idx) => {
                                  if (userAnswers[idx] === q.correctIndex) {
                                    finalScore += 1;
                                  }
                                });
                                
                                setPracticeScore(finalScore);
                                setPracticeCompleted(true);
                                
                                addSystemNotification({
                                  id: `quiz-complete-${Date.now()}`,
                                  title: '📊 Practice Session Complete',
                                  message: `You completed ${quiz.title} with score ${finalScore}/${totalQuestions}.`,
                                  type: 'system',
                                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                });
                              }}
                              disabled={userAnswers[currentQuestionIndex] === undefined}
                              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:pointer-events-none transition-all"
                            >
                              Submit Answers
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-zinc-500 py-10 text-center">No questions added in this quiz yet.</div>
                    )
                  ) : (
                    // Results Review View
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="text-center p-6 bg-zinc-900/40 border border-white/5 rounded-2xl">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Your Final Score</span>
                        <h2 className="text-4xl font-black text-amber-400 mt-2">
                          {practiceScore} <span className="text-lg text-zinc-500">/ {totalQuestions}</span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
                          {practiceScore !== null && practiceScore >= Math.floor(totalQuestions * 0.8) 
                            ? "Outstanding! You have a strong grasp of case competition structuring and concepts." 
                            : practiceScore !== null && practiceScore >= Math.floor(totalQuestions * 0.5) 
                            ? "Good effort! Review the detailed solutions below to sharpen your methodology." 
                            : "Keep learning! Review the flashcards in Interactive Frameworks and try again."}
                        </p>
                      </div>

                      {/* Solutions Detail */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-xs text-zinc-300 uppercase tracking-wider mb-2">Question Review & Explanations</h4>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                          {questions.map((q, idx) => {
                            const userAns = userAnswers[idx];
                            const isCorrect = userAns === q.correctIndex;
                            
                            return (
                              <div key={idx} className="p-4 bg-zinc-900/20 border border-white/5 rounded-xl space-y-2 text-left">
                                <div className="flex justify-between items-start gap-2">
                                  <h5 className="font-bold text-xs text-zinc-200">
                                    {idx + 1}. {q.q}
                                  </h5>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 border ${
                                    isCorrect 
                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                                  }`}>
                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                  </span>
                                </div>

                                <div className="text-[11px] space-y-1">
                                  <p className="text-zinc-500">
                                    Your answer: <span className={isCorrect ? "text-emerald-400" : "text-red-400"}>
                                      {q.options[userAns] || 'None'}
                                    </span>
                                  </p>
                                  {!isCorrect && (
                                    <p className="text-zinc-500">
                                      Correct answer: <span className="text-emerald-400">{q.options[q.correctIndex]}</span>
                                    </p>
                                  )}
                                </div>

                                <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-white/5 pt-2 mt-2 font-mono">
                                  💡 {q.feedback}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reset button */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setCurrentQuestionIndex(0);
                            setUserAnswers({});
                            setPracticeScore(null);
                            setPracticeCompleted(false);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
                        >
                          Restart Practice
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPractice(null);
                            setPracticeScore(null);
                            setPracticeCompleted(false);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          Choose Other Practice
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })() : (
              <div className="glass-panel p-12 rounded-2xl border-white/5 text-center flex flex-col items-center justify-center">
                <BrainCircuit className="w-10 h-10 text-zinc-600 mb-2" />
                <h4 className="font-bold text-sm text-zinc-400">Select a practice set to start the mock challenge.</h4>
                <p className="text-xs text-zinc-500 mt-1">Test your framework knowledge across profit diagnostics, market entry, product-specs, and growth roadmaps.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
