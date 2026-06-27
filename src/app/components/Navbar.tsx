'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore, UserRole } from '@/lib/store';
import { Bell, User, Settings, Check, ShieldAlert, Award, Compass, BookOpen, UserCheck, Shield, LogIn, LogOut, Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/db';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    currentRole,
    notifications,
    markNotificationsAsRead,
    clearNotifications,
    currentStudent,
    signInWithEmail,
    signOut
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Authentication & Login Modal states
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-login from localStorage if present
    const savedEmail = localStorage.getItem('corpus_session_email');
    if (savedEmail) {
      signInWithEmail(savedEmail);
    }

    // Testing backdoor query parameter
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mockEmail = params.get('mock_email');
      if (mockEmail && mockEmail.endsWith('@iimkashipur.ac.in')) {
        signInWithEmail(mockEmail);
      }
    }
  }, []);

  // Supabase Auth listener
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        const email = session.user.email;
        if (email.endsWith('@iimkashipur.ac.in')) {
          await signInWithEmail(email);
        } else {
          if (supabase) {
            await supabase.auth.signOut();
          }
          alert('Access restricted to @iimkashipur.ac.in accounts only!');
        }
      }
    });
    return () => subscription.unsubscribe();
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

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      alert("Supabase integration is currently running in local storage fallback mode (dev). Please use the Direct Email Login field below!");
      return;
    }
    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          hd: 'iimkashipur.ac.in'
        }
      }
    });
    if (error) {
      setLoginError(error.message);
      setIsLoggingIn(false);
    }
  };

  const handleDirectSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const emailClean = loginEmail.trim().toLowerCase();
    if (!emailClean.endsWith('@iimkashipur.ac.in')) {
      setLoginError('Access restricted! Email must end with @iimkashipur.ac.in');
      setIsLoggingIn(false);
      return;
    }

    const { success, error } = await signInWithEmail(emailClean);
    if (success) {
      setIsLoginOpen(false);
      setLoginEmail('');
    } else {
      setLoginError(error || 'Failed to sign in.');
    }
    setIsLoggingIn(false);
  };

  return (
    <>
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
              
              {mounted && currentUser && (currentRole === 'student' || currentRole === 'admin') && (
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

              {mounted && currentUser && currentRole === 'admin' && (
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
            </nav>
          </div>

          {/* Right Interactions */}
          <div className="flex items-center gap-4">
            
            {/* User Sign In / Profile dropdown (replaces role swapper widget) */}
            {mounted && (
              currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-zinc-900/60 hover:bg-zinc-900 text-left transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-[10px] text-white uppercase">
                      {currentUser.name?.substring(0, 2)}
                    </div>
                    <div className="hidden sm:flex flex-col">
                      <span className="text-[10px] font-black text-zinc-300 leading-none max-w-24 truncate">{currentUser.name}</span>
                      <span className="text-[8px] text-zinc-500 leading-none uppercase font-bold tracking-wider mt-0.5">{currentRole}</span>
                    </div>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-2 pb-2 mb-2 border-b border-white/5 text-left">
                        <span className="block text-xs font-bold text-zinc-200 truncate">{currentUser.name}</span>
                        <span className="block text-[10px] text-zinc-500 truncate mt-0.5">{currentUser.email}</span>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-900 border border-white/5 text-[8px] font-black uppercase text-indigo-450 tracking-wider mt-1.5">
                          {currentRole}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {(currentRole === 'student' || currentRole === 'admin') && (
                          <Link
                            href="/portal"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                          >
                            <User className="w-3.5 h-3.5" />
                            My Student Portal
                          </Link>
                        )}

                        {currentRole === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            Admin Control
                          </Link>
                        )}

                        <button
                          onClick={async () => {
                            setIsUserDropdownOpen(false);
                            if (confirm('Are you sure you want to sign out?')) {
                              await signOut();
                              router.push('/');
                            }
                          }}
                          className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )
            )}
          </div>
        </div>
        
        {/* Mobile Sub-Navigation Links */}
        {mounted && currentUser && (
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
            {currentRole === 'admin' && (
              <Link href="/admin" className={`text-xs px-3 py-1 rounded-full ${pathname === '/admin' ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400'}`}>
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/95 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative text-left">
            <button
              onClick={() => {
                setIsLoginOpen(false);
                setLoginError('');
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-none">College Sign In</h3>
                <span className="text-[10px] text-zinc-500 font-semibold block mt-1">Authorized access strict for @iimkashipur.ac.in domains</span>
              </div>
            </div>

            {loginError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              {/* Primary Google Login */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4 shrink-0" />
                Sign In with Google
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
