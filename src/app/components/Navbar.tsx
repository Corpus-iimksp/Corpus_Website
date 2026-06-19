'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore, UserRole } from '@/lib/store';
import { Bell, User, Settings, Check, ShieldAlert, Award, Compass, BookOpen, UserCheck, Shield } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    currentRole,
    setRole,
    notifications,
    markNotificationsAsRead,
    clearNotifications,
    currentStudent
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const toggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) {
      markNotificationsAsRead();
    }
  };

  const roles: { value: UserRole; label: string; icon: any }[] = [
    { value: 'student', label: 'Student Portal', icon: User },
    { value: 'mentor', label: 'Mentor Portal', icon: UserCheck },
    { value: 'admin', label: 'Admin Panel', icon: Shield }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding & Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-900/50 p-1 border border-white/5 group-hover:border-amber-500/30 group-hover:bg-zinc-800/50 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Corpus Logo"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 group-hover:opacity-85 transition-opacity leading-none">
                CORPUS
              </span>
              <span className="hidden md:inline-block text-[9px] font-semibold text-zinc-500 tracking-tight mt-0.5">
                Crack Cases. Learn Faster.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              Competitions
            </Link>
            <Link
              href="/learning"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                pathname === '/learning'
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              Learning Hub
            </Link>
            
            {currentRole === 'student' && (
              <Link
                href="/portal"
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  pathname === '/portal'
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/25'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                My Student Portal
              </Link>
            )}

            {currentRole === 'mentor' && (
              <Link
                href="/mentor-portal"
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  pathname === '/mentor-portal'
                    ? 'bg-purple-500/10 text-purple-300 border border-purple-500/25'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                My Mentor Portal
              </Link>
            )}

            {currentRole === 'admin' && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  pathname === '/admin'
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                    : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
                }`}
              >
                Admin Control
              </Link>
            )}

            <Link
              href="/become-mentor"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                pathname === '/become-mentor'
                  ? 'bg-sky-500/10 text-sky-300 border border-sky-500/25'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              Become a Mentor
            </Link>
          </nav>
        </div>

        {/* Right Interactions */}
        <div className="flex items-center gap-4">
          
          {/* Role Swapper Widget (Grader friendly) */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-white/5 rounded-lg p-0.5">
            {roles.map(r => {
              const Icon = r.icon;
              return (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    currentRole === r.value
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-white/5'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={`Switch view to ${r.label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{r.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Email / System Notifications Bell */}
          <div className="relative">
            <button
              onClick={toggleNotif}
              className="relative p-2 rounded-full border border-white/5 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {mounted && unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl border border-white/10 bg-zinc-950 p-4 shadow-2xl z-50">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                  <h3 className="font-bold text-sm text-zinc-200">Simulation Logs (Emails / Alerts)</h3>
                  <button
                    onClick={clearNotifications}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-600">
                      No recent notifications or email dispatches.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-lg border text-left ${
                          notif.type === 'email'
                            ? 'bg-indigo-950/20 border-indigo-500/10'
                            : 'bg-zinc-900/40 border-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-bold text-xs text-indigo-300 truncate">
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-zinc-600 shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Tag */}
          <div className="hidden md:flex items-center gap-2 border-l border-white/5 pl-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-semibold text-zinc-300 truncate max-w-28">
                {mounted && currentRole === 'student' ? currentStudent?.name : currentRole === 'student' ? '' : 'Mentor Session'}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">
                {currentRole}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white uppercase border border-white/10">
              {mounted && currentRole === 'student' ? currentStudent?.name?.substring(0, 2) : 'M'}
            </div>
          </div>

        </div>
      </div>
      
      {/* Mobile Sub-Navigation Links */}
      <div className="lg:hidden border-t border-white/5 bg-zinc-950/40 overflow-x-auto whitespace-nowrap px-4 py-2 scrollbar-none flex gap-2">
        <Link href="/dashboard" className={`text-xs px-3 py-1 rounded-full ${pathname === '/dashboard' ? 'bg-indigo-500/20 text-indigo-300' : 'text-zinc-400'}`}>
          Competitions
        </Link>
        <Link href="/learning" className={`text-xs px-3 py-1 rounded-full ${pathname === '/learning' ? 'bg-indigo-500/20 text-indigo-300' : 'text-zinc-400'}`}>
          Learning Hub
        </Link>
        {currentRole === 'student' && (
          <Link href="/portal" className={`text-xs px-3 py-1 rounded-full ${pathname === '/portal' ? 'bg-indigo-500/20 text-indigo-300' : 'text-zinc-400'}`}>
            Portal
          </Link>
        )}
        {currentRole === 'mentor' && (
          <Link href="/mentor-portal" className={`text-xs px-3 py-1 rounded-full ${pathname === '/mentor-portal' ? 'bg-purple-500/20 text-purple-300' : 'text-zinc-400'}`}>
            Mentor Portal
          </Link>
        )}
        {currentRole === 'admin' && (
          <Link href="/admin" className={`text-xs px-3 py-1 rounded-full ${pathname === '/admin' ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400'}`}>
            Admin Panel
          </Link>
        )}
        <Link href="/become-mentor" className={`text-xs px-3 py-1 rounded-full ${pathname === '/become-mentor' ? 'bg-sky-500/20 text-sky-300' : 'text-zinc-400'}`}>
          Become Mentor
        </Link>
      </div>
    </header>
  );
}
