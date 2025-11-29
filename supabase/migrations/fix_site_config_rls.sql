-- Drop previous restrictive policies
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.site_config;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.site_config;

-- Create permissive policies because the app uses custom authentication (not Supabase Auth)
-- This allows the application to update the configuration without a Supabase session token.
CREATE POLICY "Enable update for all" ON public.site_config
  FOR UPDATE USING (true);

CREATE POLICY "Enable insert for all" ON public.site_config
  FOR INSERT WITH CHECK (true);
