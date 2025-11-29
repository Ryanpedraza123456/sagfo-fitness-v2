-- Disable Row Level Security on all tables to allow full access
-- This effectively removes all policy restrictions as requested.

ALTER TABLE public.equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config DISABLE ROW LEVEL SECURITY;

-- Optional: Drop existing policies to ensure a clean slate if RLS is re-enabled later (optional but good for cleanup)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.equipment;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.events;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.gallery;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.site_config;
-- Add drops for other policies if they exist, but disabling RLS is the main key.
