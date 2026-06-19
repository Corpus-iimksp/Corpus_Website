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
  BarChart
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AdminDashboard() {
  const { 
    competitions, 
    mentors, 
    bookings, 
    addCompetition, 
    deleteCompetition, 
    approveMentorApplication, 
    rejectMentorApplication,
    refreshData
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'approvals' | 'competitions' | 'students' | 'sessions'>('analytics');
  
  // Mentor Applications list local state
  const [applications, setApplications] = useState<MentorApplication[]>([]);

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

  // Sync data on load
  const syncLocalApps = () => {
    setApplications(db.getMentorApplications());
  };

  useEffect(() => {
    refreshData();
    syncLocalApps();
  }, []);

  // Handle Competition creation
  const handleAddComp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany || !newPrize) return;

    const compObj: Competition = {
      id: `comp-${Date.now()}`,
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
    
    alert('Success: New Competition has been added and published!');
  };

  // Handle mentor applications actions
  const handleApproveApp = (id: string) => {
    approveMentorApplication(id);
    syncLocalApps();
    refreshData();
    alert('Mentor application approved and profile published!');
  };

  const handleRejectApp = (id: string) => {
    rejectMentorApplication(id);
    syncLocalApps();
    refreshData();
    alert('Application rejected.');
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

  const studentsList = db.getStudents();

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
            onClick={() => setActiveAdminTab('approvals')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'approvals' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            🤝 Mentor Approvals ({applications.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveAdminTab('competitions')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'competitions' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            🏆 Opportunities
          </button>
          <button
            onClick={() => setActiveAdminTab('students')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'students' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            👤 Student Registry
          </button>
          <button
            onClick={() => setActiveAdminTab('sessions')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeAdminTab === 'sessions' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            📅 Bookings Log
          </button>
        </div>
      </div>

      {/* Main Admin Tab Panel Content */}
      
      {/* 1. ANALYTICS & CHARTS PANEL */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
            <div className="glass-panel p-5 rounded-2xl border-white/5 col-span-2 lg:col-span-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Monthly Growth</span>
              <span className="text-3xl font-black text-emerald-400 mt-1 block flex items-center gap-1">
                +24% <TrendingUp className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Recharts Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Student Registration & Bookings Area Chart */}
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-zinc-300 uppercase tracking-wider mb-6">User Registrations Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyGrowthData}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} />
                    <YAxis stroke="#52525b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#f4f4f5', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="students" stroke="#f59e0b" fillOpacity={1} fill="url(#colorStudents)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competition Category Distribution Bar Chart */}
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-zinc-300 uppercase tracking-wider mb-6">Competitions Category Split</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={categoryDistributionData}>
                    <XAxis dataKey="category" stroke="#52525b" fontSize={10} />
                    <YAxis stroke="#52525b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#f4f4f5', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. MENTOR APPROVAL PANEL */}
      {activeAdminTab === 'approvals' && (
        <div className="space-y-6">
          <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-4">Pending Mentor Applications</h3>
          
          {applications.filter(a => a.status === 'pending').length === 0 ? (
            <div className="glass-panel text-center py-20 rounded-2xl border-white/5 text-zinc-500 text-xs">
              No pending mentor applications to review.
            </div>
          ) : (
            applications.filter(a => a.status === 'pending').map((app) => (
              <div key={app.id} className="glass-card p-6 rounded-2xl border border-white/5 relative">
                <span className="absolute top-4 right-4 text-[10px] text-zinc-600 font-mono">ID: {app.id}</span>
                
                <div className="flex items-center gap-4 mb-4">
                  <img src={app.profile_photo} alt="" className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10" />
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-200">{app.applicant_name}</h4>
                    <span className="text-xs text-zinc-500">{app.batch} Batch | {app.college}</span>
                    <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">Role: {app.current_role}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-zinc-900/30 p-4 border border-white/5 rounded-xl mb-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Won Titles</span>
                    {app.competitions_won.map((title, i) => (
                      <span key={i} className="text-indigo-300 font-bold block">🏆 {title}</span>
                    ))}
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-zinc-500 block mb-1">Expertise Check</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {app.expertise_areas.map((exp, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-zinc-950 text-[10px] border border-white/5 text-zinc-300">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 leading-relaxed mb-6">
                  <strong>Mentorship Statement:</strong> &ldquo;{app.experience}&rdquo;
                  <div className="mt-3 text-[10px] text-zinc-500 flex items-center gap-4">
                    <span>Email: {app.email}</span>
                    <span>Phone: {app.phone}</span>
                    <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-0.5">
                      LinkedIn <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveApp(app.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve applicant
                  </button>
                  <button
                    onClick={() => handleRejectApp(app.id)}
                    className="px-4 py-2 bg-red-650 hover:bg-red-750 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Reject Application
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* 3. OPPORTUNITIES PANEL (Create & list competitions) */}
      {activeAdminTab === 'competitions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create form */}
          <div>
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-4">Add Corporate Challenge</h3>
              
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
                  Publish Challenge
                </button>
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

      {/* 4. STUDENTS OVERVIEW */}
      {activeAdminTab === 'students' && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Registered Student Registry ({studentsList.length})</h3>
          
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                    <th className="p-4">Name</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Niche Interests</th>
                    <th className="p-4">Wins</th>
                    <th className="p-4">Linked CV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {studentsList.map((stu) => (
                    <tr key={stu.id} className="hover:bg-zinc-900/10">
                      <td className="p-4 font-bold text-zinc-200">
                        {stu.name}
                        <span className="block text-[10px] text-zinc-500 font-medium">{stu.email}</span>
                      </td>
                      <td className="p-4 text-zinc-400">{stu.program} | {stu.college}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {stu.interests.map((x, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 text-[9px] border border-white/5 text-zinc-300">
                              {x}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-amber-400 font-bold">{stu.wins}</td>
                      <td className="p-4">
                        <span className="text-[10px] text-zinc-500 font-mono">{stu.resume}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. SESSION BOOKINGS LOG */}
      {activeAdminTab === 'sessions' && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Mentorship Bookings Log ({bookings.length})</h3>
          
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 font-bold bg-zinc-900/40">
                    <th className="p-4">Student</th>
                    <th className="p-4">Mentor</th>
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
                        <td className="p-4 font-bold text-zinc-200">{studentObj?.name || 'Student'}</td>
                        <td className="p-4 text-zinc-400">{mentorObj?.name || 'Mentor'}</td>
                        <td className="p-4 text-indigo-300 font-bold">{booking.preferred_time}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                            booking.status === 'approved'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : booking.status === 'rejected'
                              ? 'bg-red-500/10 border-red-500/20 text-red-400'
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
                      <td colSpan={4} className="p-8 text-center text-zinc-500">No session requests booked yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
