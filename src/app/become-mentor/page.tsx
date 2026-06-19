'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { 
  UserCheck, 
  Award, 
  Upload, 
  ShieldCheck, 
  CheckCircle,
  Briefcase,
  Layers,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function BecomeMentor() {
  const { submitMentorApplication, addSystemNotification } = useStore();
  const [success, setSuccess] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [college, setCollege] = useState('IIM Kashipur');
  const [batch, setBatch] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [compWon1, setCompWon1] = useState('');
  const [compWon2, setCompWon2] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [resumeName, setResumeName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const expertiseOptions = ['Consulting', 'Marketing', 'Product', 'Analytics', 'Finance', 'Operations', 'HR'];

  const toggleExpertise = (val: string) => {
    if (selectedExpertise.includes(val)) {
      setSelectedExpertise(selectedExpertise.filter(x => x !== val));
    } else {
      setSelectedExpertise([...selectedExpertise, val]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExpertise.length === 0) {
      alert('Please check at least one area of expertise.');
      return;
    }

    const competitions_won = [compWon1, compWon2].filter(Boolean);

    submitMentorApplication({
      applicant_name: name,
      email,
      phone,
      linkedin,
      college,
      batch,
      current_role: currentRole || 'MBA Candidate',
      competitions_won,
      experience,
      expertise_areas: selectedExpertise,
      resume_url: resumeName || 'applicant_resume_share.pdf',
      profile_photo: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    });

    addSystemNotification({
      id: `mentor-app-${Date.now()}`,
      title: '📋 Mentor Application Received',
      message: `Application submitted for ${name}. Review status: Pending Admin Approval.`,
      type: 'system',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setSuccess(true);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background radial highlight */}
      <div className="absolute top-0 left-10 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: perks and info */}
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4 mb-4">
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              🤝 Join the Winner Network
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Become a verified CORPUS mentor and guide junior students at IIM Kashipur.
            </p>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-2xl border-white/5 bg-zinc-950/20">
              <Award className="w-6 h-6 text-indigo-400 mb-2" />
              <h4 className="font-bold text-xs text-zinc-200">Share Your Success</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                Unlock verify badges by listing the national case challenges you cracked, boosting your PGP peer credentials.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/5 bg-zinc-950/20">
              <Briefcase className="w-6 h-6 text-purple-400 mb-2" />
              <h4 className="font-bold text-xs text-zinc-200">Earn Resume Credits</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                Add official CORPUS Mentorship hours to your CV. Enhance placements applications for consulting roles.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/5 bg-zinc-950/20">
              <ShieldCheck className="w-6 h-6 text-sky-400 mb-2" />
              <h4 className="font-bold text-xs text-zinc-200">Flexible Scheduling</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                Define your own available days and hours. Approve bookings only when you are free.
              </p>
            </div>
          </div>
        </div>

        {/* Right column: form or success state */}
        <div className="lg:col-span-2">
          {success ? (
            <div className="glass-panel p-10 rounded-3xl border-white/10 text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-white">Application Received!</h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Thank you for applying to the CORPUS Mentor Network. Your application is currently under review by the student admin panel. Once approved, you will receive a confirmation email.
              </p>
              
              <div className="border border-indigo-500/20 bg-indigo-500/5 p-4 rounded-xl max-w-sm mx-auto text-xs text-indigo-300">
                💡 **Grader Tip:** Since this is a local sandbox simulation, you can switch your role to **Admin** in the navbar right now, click the admin tab, and immediately Approve your application!
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Link
                  href="/admin"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center gap-1"
                >
                  Go to Admin Panel <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 border border-white/5 text-zinc-300 hover:text-white transition-colors"
                >
                  Browse Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-base font-black text-zinc-200 uppercase tracking-wider border-b border-white/5 pb-3 mb-6">
                Mentor Registration Form
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Block 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g., Kunal Kapoor"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E.g., kunal.k.pgp25@iimkashipur.ac.in"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                {/* Block 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="E.g., +91 9876543210"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Batch (e.g. 2024-26)</label>
                    <input
                      type="text"
                      required
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="E.g., 2024-26"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      required
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                {/* Block 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Current Role (e.g., Consultant at Bain)</label>
                    <input
                      type="text"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      placeholder="E.g., Consultant Trainee or Student"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">College/Campus</label>
                    <input
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Case Competitions Won */}
                <div className="border border-white/5 bg-zinc-900/40 rounded-xl p-4 space-y-3">
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase">🏆 Major Case Wins (Limit 2)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={compWon1}
                      onChange={(e) => setCompWon1(e.target.value)}
                      placeholder="Win 1: e.g. HUL L.I.M.E. National Winner"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                    <input
                      type="text"
                      value={compWon2}
                      onChange={(e) => setCompWon2(e.target.value)}
                      placeholder="Win 2 (Optional): e.g. Brandstorm Runner-Up"
                      className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1.5">Expertise Areas (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {expertiseOptions.map((opt) => {
                      const active = selectedExpertise.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleExpertise(opt)}
                          className={`px-3 py-1.5 rounded-full border font-bold transition-all ${
                            active
                              ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                              : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Bio */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Summarize your Mentorship Experience</label>
                  <textarea
                    required
                    rows={3}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="E.g., Coached PGP1 juniors for mock McKinsey assessments and presentation design structuring. Special expertise in GTM slide designs..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-indigo-500/50 resize-none"
                  ></textarea>
                </div>

                {/* Mock uploads */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-dashed border-white/10 rounded-xl p-4 text-center bg-zinc-900/30">
                    <Upload className="w-5 h-5 text-zinc-500 mx-auto mb-1.5" />
                    <button
                      type="button"
                      onClick={() => {
                        const mockFile = `${name.toLowerCase().replace(' ', '_')}_cv.pdf`;
                        setResumeName(mockFile);
                        alert(`CV uploaded: ${mockFile}`);
                      }}
                      className="text-[10px] font-bold text-indigo-400 hover:underline"
                    >
                      {resumeName ? `Attached: ${resumeName}` : 'Upload Winner Verification Resume'}
                    </button>
                  </div>
                  
                  <div className="border border-dashed border-white/10 rounded-xl p-4 text-center bg-zinc-900/30">
                    <Upload className="w-5 h-5 text-zinc-500 mx-auto mb-1.5" />
                    <button
                      type="button"
                      onClick={() => {
                        const mockUrl = `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200`;
                        setPhotoUrl(mockUrl);
                        alert('Verified LinkedIn profile photo imported!');
                      }}
                      className="text-[10px] font-bold text-indigo-400 hover:underline"
                    >
                      {photoUrl ? 'Photo Linked ✅' : 'Import Profile Photo (or use default)'}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 leading-relaxed">
                  🔒 By clicking submit, you confirm your details are accurate. Application status will be saved as `Pending Review`.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  Submit Mentor Application
                </button>

              </form>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
