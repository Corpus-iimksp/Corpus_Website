-- ==============================================================================
-- CORPUS WEBSITE - SUPABASE DATABASE MIGRATION SCRIPT
-- ==============================================================================
-- Run this script in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. UPDATE WINNING_DECKS TABLE
-- Adds the new company column for Slide Decks
ALTER TABLE public.winning_decks 
ADD COLUMN IF NOT EXISTS company TEXT;

-- 2. UPDATE FRAMEWORKS TABLE
-- Removes strict NOT NULL on gradient and sets modern default gradient
ALTER TABLE public.frameworks 
ALTER COLUMN gradient DROP NOT NULL;

ALTER TABLE public.frameworks 
ALTER COLUMN gradient SET DEFAULT 'from-indigo-600 to-purple-600';

-- 3. UPDATE COMPETITIONS TABLE
-- Ensures category and open_date columns exist
ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Consulting';

ALTER TABLE public.competitions 
ADD COLUMN IF NOT EXISTS open_date DATE;

-- 4. ENSURE ROW LEVEL SECURITY (RLS) DOES NOT BLOCK DELETES / UPDATES
-- Option A: Recommended for public/client-side access (disables RLS blocks)
ALTER TABLE public.winning_decks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.frameworks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings DISABLE ROW LEVEL SECURITY;

-- Option B: Permissive Policies in case RLS is left enabled
DROP POLICY IF EXISTS "Allow all operations for winning_decks" ON public.winning_decks;
CREATE POLICY "Allow all operations for winning_decks" ON public.winning_decks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for frameworks" ON public.frameworks;
CREATE POLICY "Allow all operations for frameworks" ON public.frameworks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for competitions" ON public.competitions;
CREATE POLICY "Allow all operations for competitions" ON public.competitions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for users" ON public.users;
CREATE POLICY "Allow all operations for users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for bookings" ON public.bookings;
CREATE POLICY "Allow all operations for bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations for meetings" ON public.meetings;
CREATE POLICY "Allow all operations for meetings" ON public.meetings FOR ALL USING (true) WITH CHECK (true);
