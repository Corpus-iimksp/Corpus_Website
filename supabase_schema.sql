-- Supabase Database Schema for CORPUS Website
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)

-- 1. Create Competitions Table
CREATE TABLE IF NOT EXISTS public.competitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  open_date DATE NOT NULL,
  deadline DATE NOT NULL,
  apply_link TEXT NOT NULL,
  prize_pool TEXT NOT NULL,
  organizer TEXT NOT NULL,
  timeline TEXT NOT NULL
);

-- 2. Create Users Table (for Students, Mentors, and Admins)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'mentor', 'admin')),
  college TEXT NOT NULL,
  program TEXT,
  year TEXT,
  resume TEXT,
  linkedin TEXT,
  interests TEXT[],
  badges TEXT[],
  wins INTEGER DEFAULT 0,
  shortlists INTEGER DEFAULT 0,
  participations INTEGER DEFAULT 0,
  batch TEXT,
  current_role TEXT,
  competitions_won TEXT[],
  expertise TEXT[],
  rating NUMERIC,
  profile_photo TEXT,
  available_days TEXT[],
  available_slots TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Create Bookings Table (Session Requests)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mentor_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  notes TEXT,
  competition_name TEXT NOT NULL,
  proof_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Create Meetings Table
CREATE TABLE IF NOT EXISTS public.meetings (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  zoom_link TEXT NOT NULL,
  zoom_id TEXT NOT NULL,
  meeting_time TEXT NOT NULL
);

-- 5. Create Winning Decks Table
CREATE TABLE IF NOT EXISTS public.winning_decks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  competition TEXT NOT NULL,
  year TEXT NOT NULL,
  teamName TEXT NOT NULL,
  tags TEXT[],
  fileUrl TEXT NOT NULL,
  previewImage TEXT,
  downloadsCount INTEGER DEFAULT 0
);

-- 6. Create Frameworks Table
CREATE TABLE IF NOT EXISTS public.frameworks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  gradient TEXT NOT NULL
);


-- 8. Create Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  questions JSONB NOT NULL
);

-- RLS CONFIGURATION
-- Option A: Disable RLS on all tables (easiest for development and client-side setup)
ALTER TABLE public.competitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.winning_decks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.frameworks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes DISABLE ROW LEVEL SECURITY;

-- Option B (Alternative): If you prefer to keep RLS enabled, uncomment the policies below:
/*
-- Competitions policies
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.competitions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.competitions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.competitions FOR DELETE USING (true);

-- Users policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.users FOR DELETE USING (true);

-- Bookings policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.bookings FOR DELETE USING (true);

-- Meetings policies
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.meetings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.meetings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.meetings FOR DELETE USING (true);

-- Winning Decks policies
ALTER TABLE public.winning_decks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.winning_decks FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.winning_decks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.winning_decks FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.winning_decks FOR DELETE USING (true);

-- Frameworks policies
ALTER TABLE public.frameworks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.frameworks FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.frameworks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.frameworks FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.frameworks FOR DELETE USING (true);


-- Quizzes policies
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.quizzes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.quizzes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.quizzes FOR DELETE USING (true);
*/
