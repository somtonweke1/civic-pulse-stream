-- Create profiles table
-- CREATE TABLE IF NOT EXISTS public.profiles (
--     id UUID PRIMARY KEY,
--     name TEXT NOT NULL,
--     email TEXT NOT NULL UNIQUE,
--     trust_score INTEGER DEFAULT 0,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
--     updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
-- );

-- Enable Row Level Security
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
-- DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable insert for all users" ON public.profiles;
-- DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable insert for signup" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
-- DROP POLICY IF EXISTS "Enable delete for service role" ON public.profiles;

-- Create new policies with more permissive rules
-- CREATE POLICY "Enable read access for all users"
--     ON public.profiles
--     FOR SELECT
--     USING (true);

-- CREATE POLICY "Enable insert for all users"
--     ON public.profiles
--     FOR INSERT
--     WITH CHECK (true);

-- CREATE POLICY "Enable update for users based on id"
--     ON public.profiles
--     FOR UPDATE
--     USING (auth.uid() = id);

-- CREATE POLICY "Enable delete for service role"
--     ON public.profiles
--     FOR DELETE
--     USING (auth.role() = 'service_role');

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if a profile already exists for this email
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = NEW.email) THEN
        -- Update the existing profile with the new user ID
        UPDATE public.profiles
        SET id = NEW.id
        WHERE email = NEW.email;
    ELSE
        -- Create a new profile
        INSERT INTO public.profiles (id, name, email)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
            NEW.email
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.profiles WHERE id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
    AFTER DELETE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_deletion(); 