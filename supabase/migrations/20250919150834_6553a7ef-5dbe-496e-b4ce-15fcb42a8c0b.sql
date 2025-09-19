-- Fix security issues by enabling RLS on tables that need it
-- Enable RLS on existing tables that were missing it
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fra_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geometry_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geography_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for api_keys (admin only access)
CREATE POLICY "Admin access only for API keys" 
ON public.api_keys FOR ALL 
USING (false); -- Block all access by default

-- Create basic RLS policies for fra_claims (public read access for now)
CREATE POLICY "Public can view FRA claims" 
ON public.fra_claims FOR SELECT 
USING (true);

-- Create basic RLS policies for geometry/geography columns (public read access)
CREATE POLICY "Public can view geometry columns" 
ON public.geometry_columns FOR SELECT 
USING (true);

CREATE POLICY "Public can view geography columns" 
ON public.geography_columns FOR SELECT 
USING (true);

-- Create basic RLS policies for spatial_ref_sys (public read access)
CREATE POLICY "Public can view spatial reference systems" 
ON public.spatial_ref_sys FOR SELECT 
USING (true);