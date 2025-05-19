-- Add INSERT policy for profiles table
CREATE POLICY "Enable insert for authenticated users only"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Add policy to allow the handle_new_user function to insert profiles
CREATE POLICY "Enable insert for service role"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role'); 