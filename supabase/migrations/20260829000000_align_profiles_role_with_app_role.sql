-- This project's public.profiles table pre-existed (from a Supabase starter
-- template: role text CHECK IN ('student','faculty','admin')) before any of
-- our migrations ran. Every earlier migration used CREATE TABLE IF NOT EXISTS,
-- so the table's real role column never actually became public.app_role like
-- the rest of the schema (trigger, RLS policies, canteen role checks) assumes.
-- This reconciles it.

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Map the starter template's 'faculty' onto our closest equivalent before
-- converting the column type, since 'faculty' isn't a public.app_role label.
UPDATE public.profiles SET role = 'instructor' WHERE role = 'faculty';

ALTER TABLE public.profiles
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE public.app_role USING role::public.app_role,
  ALTER COLUMN role SET DEFAULT 'student'::public.app_role;
