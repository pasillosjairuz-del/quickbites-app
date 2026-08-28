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

-- Postgres won't change a column's type while any same-table RLS policy
-- references it, even indirectly through a function. The starter template's
-- own policies (unknown names, not necessarily what our other migrations
-- expect) trip this. Drop every existing policy on profiles rather than
-- guess names, then recreate exactly the ones this app needs.
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;
END $$;

ALTER TABLE public.profiles
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE public.app_role USING role::public.app_role,
  ALTER COLUMN role SET DEFAULT 'student'::public.app_role;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins and Staff have full access"
  ON public.profiles FOR ALL
  USING (public.is_admin_or_staff());
