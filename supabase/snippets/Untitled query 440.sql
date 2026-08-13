ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';


CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Drop the old policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;

-- 2. Create the new policy using the helper function
CREATE POLICY "Admins and Staff have full access" 
  ON public.profiles FOR ALL 
  USING (public.is_admin_or_staff());