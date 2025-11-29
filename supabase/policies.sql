-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (ALLOW ALL)

-- Users
CREATE POLICY "Enable all access for all users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- Equipment
CREATE POLICY "Enable all access for all users" ON public.equipment FOR ALL USING (true) WITH CHECK (true);

-- Events
CREATE POLICY "Enable all access for all users" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- Gallery
CREATE POLICY "Enable all access for all users" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

-- Orders
CREATE POLICY "Enable all access for all users" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Order Items
CREATE POLICY "Enable all access for all users" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
