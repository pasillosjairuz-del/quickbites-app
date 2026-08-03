-- 1. Create Enum for Order Status
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'completed', 'cancelled');

-- 2. Create Parent Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status order_status NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    notes TEXT, -- Optional special instructions (e.g., "No onions")
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Order Items Table (Line Items)
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL, -- Price at the time of purchase
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- ORDERS: Customers can see their OWN orders; Admins see ALL orders
CREATE POLICY "View orders" 
  ON public.orders FOR SELECT 
  TO authenticated 
  USING (
    customer_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ORDERS: Customers can place their own orders
CREATE POLICY "Place orders" 
  ON public.orders FOR INSERT 
  TO authenticated 
  WITH CHECK (customer_id = auth.uid());

-- ORDERS: Only Admins can update status (e.g., 'pending' -> 'preparing' -> 'ready')
CREATE POLICY "Admins update order status" 
  ON public.orders FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ORDER ITEMS: Customers can view items in their own orders; Admins view all
CREATE POLICY "View order items" 
  ON public.order_items FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE public.orders.id = public.order_items.order_id 
      AND (public.orders.customer_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

-- ORDER ITEMS: Customers can insert items for their own orders
CREATE POLICY "Insert order items" 
  ON public.order_items FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE public.orders.id = public.order_items.order_id 
      AND public.orders.customer_id = auth.uid()
    )
  );