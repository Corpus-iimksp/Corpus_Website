'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';
import { 
  Clock, 
  Calendar, 
  Check, 
  X, 
  ArrowRight, 
  Star, 
  Award, 
  Video, 
  Mail,
  User,
  Settings,
  Sparkles
} from 'lucide-react';

export default function MentorPortal() {
  const { 
    currentMentor, 
    bookings, 
    meetings, 
    updateSessionStatus, 
    addSystemNotification,
    refreshData
  } = useStore();

  const [activeTab, setActiveTab] = useState<'bookings' | 'availability'>('bookings');
  
  // Availability local states
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');

  // Reschedule state
  const [reschedulingBookingId, setReschedulingBookingId] = useState<string | null>(null);
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Sync state data on load
  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (currentMentor) {
      setAvailableDays(currentMentor.available_days || []);
      setAvailableSlots(currentMentor.available_slots || []);
    }
  }, [currentMentor]);

  // Handle Availability save
  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMentor) return;

    // Simulate updating mentor registry
    db.upsertMentor({
      ...currentMentor,
      available_days: availableDays,
      available_slots: availableSlots
    });

    addSystemNotification({
      id: `avail-save-${Date.now()}`,
      title: '📅 Availability Updated',
      message: 'Your slots calendar has been published successfully.',
      type: 'system',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    alert('Availability saved!');
    refreshData();
  };

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const addSlot = () => {
    if (!newSlot.trim()) return;
    if (availableSlots.includes(newSlot)) return;
    setAvailableSlots([...availableSlots, newSlot]);
    setNewSlot('');
  };

  const removeSlot = (slot: string) => {
    setAvailableSlots(availableSlots.filter(s => s !== slot));
  };

  // Filter bookings assigned to this active mentor representation
  const mentorBookings = bookings.filter(b => b.mentor_id === currentMentor?.id);

  const handleApprove = (id: string) => {
    updateSessionStatus(id, 'approved');
  };

  const handleReject = (id: string) => {
    updateSessionStatus(id, 'rejected');
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBookingId || !rescheduleTime) return;

    updateSessionStatus(reschedulingBookingId, 'rescheduled', rescheduleTime);
    setReschedulingBookingId(null);
    setRescheduleTime('');
  };

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background blur overlays */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Banner */}
      {currentMentor ? (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <img 
              src={currentMentor.profile_photo} 
              alt={currentMentor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/25"
            />
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                {currentMentor.name}
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                  Verified Mentor
                </span>
              </h1>
              <span className="text-xs text-zinc-500 block mt-0.5">{currentMentor.current_role} | {currentMentor.college}</span>
              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold mt-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                Rating: {currentMentor.rating}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bookings' 
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/15'
                  : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              📅 Booking Requests ({mentorBookings.filter(b => b.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'availability' 
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/15'
                  : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ⚙️ Manage Availability
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl border-white/5 text-center text-xs text-zinc-500">
          No active mentor profile synced. Please register using Become a Mentor or Switch role.
        </div>
      )}

      {/* Tab Panels */}

      {/* 1. BOOKING REQUESTS LIST */}
      {activeTab === 'bookings' && currentMentor && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-zinc-200 uppercase tracking-wider mb-2">Student Bookings Queue</h3>
            
            {mentorBookings.length === 0 ? (
              <div className="glass-panel text-center py-20 rounded-2xl border-white/5 text-zinc-500 text-xs">
                No bookings have been requested for your slots yet.
              </div>
            ) : (
              mentorBookings.map((booking) => {
                const studentObj = db.getStudent(booking.student_id);
                const meetingObj = meetings.find(m => m.session_id === booking.id);
                
                return (
                  <div key={booking.id} className="glass-card p-5 rounded-2xl border border-white/5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b border-white/5 pb-3 mb-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-zinc-200">{studentObj?.name || 'Student applicant'}</h4>
                        <span className="text-xs text-zinc-500 block mt-0.5">{studentObj?.program} | {studentObj?.college}</span>
                        <span className="text-[10px] text-purple-400 font-bold block mt-1">Requested: {booking.preferred_time}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border shrink-0 ${
                        booking.status === 'approved'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : booking.status === 'rejected'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400'
                          : booking.status === 'rescheduled'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-zinc-800 text-zinc-400 border-white/5'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/30 p-2.5 rounded-xl border border-white/5 mb-4">
                      <strong>Outline case question:</strong> &ldquo;{booking.notes}&rdquo;
                    </p>

                    {booking.status === 'pending' && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Call
                        </button>
                        <button
                          onClick={() => setReschedulingBookingId(booking.id)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/5 flex items-center gap-1 transition-colors"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-650 hover:bg-red-750 text-white flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}

                    {booking.status === 'approved' && meetingObj && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-purple-950/20 border border-purple-500/15 p-2.5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Video className="w-4.5 h-4.5 text-purple-400" />
                          <div>
                            <span className="text-[10px] text-zinc-400 block font-semibold">MOCK ZOOM CONFERENCE</span>
                            <span className="text-xs font-bold text-purple-300">ID: {meetingObj.zoom_id}</span>
                          </div>
                        </div>
                        <a
                          href={meetingObj.zoom_link}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
                        >
                          Launch Call
                        </a>
                      </div>
                    )}

                    {booking.status === 'rescheduled' && (
                      <span className="text-[10px] text-amber-300 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 block">
                        🕒 Rescheduled. Pending student verification update.
                      </span>
                    )}

                  </div>
                );
              })
            )}
          </div>

          {/* Right column: metrics */}
          <div className="space-y-6">
            <div className="glass-panel p-5 rounded-2xl border-white/5 bg-zinc-950/20">
              <Sparkles className="w-6 h-6 text-purple-400 mb-2 animate-pulse" />
              <h4 className="font-bold text-xs text-zinc-200">How to handle mock sessions?</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                Review student pitch drafts or structural diagrams. Give feedback on profitability or GTM segmentation. Generate Zoom ID and join call on time.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-white/5">
              <h4 className="font-bold text-xs text-zinc-200 mb-3 uppercase tracking-wider">Titles & Wins</h4>
              <div className="space-y-2">
                {currentMentor.competitions_won.map((title, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-purple-300 font-semibold bg-zinc-900/50 p-2 border border-white/5 rounded-xl">
                    <Award className="w-4.5 h-4.5 text-purple-400" />
                    <span>{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. AVAILABILITY SCHEDULER */}
      {activeTab === 'availability' && currentMentor && (
        <div className="glass-panel p-6 rounded-2xl border-white/5 max-w-xl mx-auto">
          <h3 className="text-base font-black text-zinc-200 uppercase tracking-wider border-b border-white/5 pb-3 mb-6">
            Slots Availability Calendar
          </h3>

          <form onSubmit={handleSaveAvailability} className="space-y-6 text-xs">
            
            {/* Days Selection */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Available Days</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {weekdays.map((day) => {
                  const active = availableDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-2 rounded-lg border font-bold text-center transition-all ${
                        active
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slots Selection */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Hourly Slots List</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {availableSlots.map((slot) => (
                  <div 
                    key={slot} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-300 font-semibold"
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>{slot}</span>
                    <button
                      type="button"
                      onClick={() => removeSlot(slot)}
                      className="text-red-400 hover:text-red-300 font-bold shrink-0 ml-1.5"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                {availableSlots.length === 0 && (
                  <span className="text-zinc-600 italic">No slots defined yet. Use form below to add.</span>
                )}
              </div>

              {/* Add Slot form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.g. 17:00 - 18:00 or 19:30 - 20:30"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500/50"
                />
                <button
                  type="button"
                  onClick={addSlot}
                  className="px-4 py-2 bg-zinc-800 border border-white/5 hover:bg-zinc-700 text-zinc-200 rounded-lg font-bold"
                >
                  Add Slot
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 rounded-xl text-xs font-bold text-white transition-colors"
            >
              Update Availability Schedule
            </button>

          </form>
        </div>
      )}

      {/* Reschedule Modal Overlay */}
      {reschedulingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-sm rounded-2xl border-white/10 p-6 shadow-2xl relative">
            <button
              onClick={() => setReschedulingBookingId(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 text-sm font-semibold"
            >
              Cancel
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Reschedule Mentorship Call</h3>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">New Proposed Day & Time</label>
                <input
                  type="text"
                  required
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  placeholder="E.g., Sunday at 20:00 - 21:00"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="text-[10px] text-zinc-500">
                🕒 The student will be notified of the rescheduling update, and SendGrid mock dispatches will trigger.
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-xs font-bold text-white transition-colors"
              >
                Confirm Rescheduling Propose
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
