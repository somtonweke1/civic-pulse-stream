-- Drop existing policies
-- DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable update for profile owners" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable delete for profile owners" ON public.profiles;

-- Recreate policies
-- CREATE POLICY "Enable read access for all users"
--     ON public.profiles
--     FOR SELECT
--     USING (true);

-- CREATE POLICY "Enable insert for authenticated users"
--     ON public.profiles
--     FOR INSERT
--     WITH CHECK (auth.uid() = id);

-- CREATE POLICY "Enable update for profile owners"
--     ON public.profiles
--     FOR UPDATE
--     USING (auth.uid() = id);

-- CREATE POLICY "Enable delete for profile owners"
--     ON public.profiles
--     FOR DELETE
--     USING (auth.uid() = id); 