-- =============================================================================
-- Hardening from the security review
-- =============================================================================
-- 1. Orders can only be created through place_order()
--    "Users can create their own orders" (orders) and "Insert order items for
--    own orders" (order_items) let any signed-in student INSERT directly with
--    any status / total_amount / unit_price, e.g. a fake 'completed' order for
--    a huge amount, which then feeds admin_sales_summary and admin_top_items.
--    The app only ever creates orders via place_order() (SECURITY DEFINER, so
--    it bypasses RLS), so the direct-insert policies are simply dropped.
--
-- 2. Canteen/admin status updates can't overwrite a finished order
--    The old UPDATE policy had no status condition. A "mark picked up" that
--    waits on cancel_order's row lock would overwrite 'cancelled' with
--    'completed' (stock already restored, and the order now counts as
--    revenue), and a direct status='cancelled' update would skip the restock.
--    Now: only rows that are not already cancelled/completed can be updated
--    (Postgres re-checks USING after a lock wait), and the new status may not
--    be 'cancelled' (cancel via cancel_order(), which restocks).
--
-- 3. Staff -> admin escalation through profile INSERT/DELETE
--    "Admins and Staff have full access" is FOR ALL with no WITH CHECK and the
--    existing guard only covers UPDATE OF role. A staff user could DELETE a
--    profile (including the last admin's) or INSERT a profile with role
--    'admin'. The new trigger: a signed-in non-admin may only INSERT a
--    'student' profile and may not DELETE any; admins may not delete the last
--    admin. Calls with no auth.uid() (signup trigger handle_new_user, SQL
--    editor, migrations, service_role) are unaffected, so signup still works.
-- =============================================================================

-- 1 ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Insert order items for own orders" ON public.order_items;

-- 2 ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Canteen and admins can update order status" ON public.orders;

CREATE POLICY "Canteen and admins can update order status"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    public.is_canteen_or_admin()
    AND status NOT IN ('cancelled', 'completed')
  )
  WITH CHECK (
    public.is_canteen_or_admin()
    AND status IN ('pending', 'preparing', 'ready', 'completed')
  );

-- 3 ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_profile_insert_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF auth.uid() IS NOT NULL
       AND NOT public.is_admin()
       AND NEW.role IS DISTINCT FROM 'student' THEN
      RAISE EXCEPTION 'not authorized to create a profile with role %', NEW.role
        USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  -- DELETE
  IF auth.uid() IS NOT NULL THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'not authorized to delete profiles' USING ERRCODE = '42501';
    END IF;
    IF OLD.role = 'admin'
       AND (SELECT count(*) FROM public.profiles WHERE role = 'admin') <= 1 THEN
      RAISE EXCEPTION 'cannot delete the last admin' USING ERRCODE = '55000';
    END IF;
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profile_insert_delete ON public.profiles;
CREATE TRIGGER trg_guard_profile_insert_delete
  BEFORE INSERT OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_insert_delete();
