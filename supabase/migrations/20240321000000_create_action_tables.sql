-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    trust_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    role TEXT DEFAULT 'user',
    CONSTRAINT valid_role CHECK (role IN ('user', 'admin', 'moderator'))
);

-- Create civic_actions table
CREATE TABLE IF NOT EXISTS public.civic_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    location TEXT NOT NULL,
    action_type TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'pending',
    verification_method TEXT,
    verification_url TEXT,
    impact_tags TEXT[],
    category_id INTEGER,
    CONSTRAINT valid_verification_status CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    CONSTRAINT valid_action_type CHECK (action_type IN ('sublet', 'mutual-aid', 'childcare', 'food-sharing', 'vacant-use', 'community-event'))
);

-- Create verifications table
CREATE TABLE IF NOT EXISTS public.verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_id UUID NOT NULL REFERENCES public.civic_actions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    evidence_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_method CHECK (method IN ('photo', 'receipt', 'peer', 'other')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create action_impacts table
CREATE TABLE IF NOT EXISTS public.action_impacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_id UUID NOT NULL REFERENCES public.civic_actions(id) ON DELETE CASCADE,
    impact_type TEXT NOT NULL,
    impact_score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_impact_type CHECK (impact_type IN ('sustainability', 'mutual_aid', 'urban_density', 'community_building')),
    CONSTRAINT valid_impact_score CHECK (impact_score >= 0 AND impact_score <= 100)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.civic_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_impacts ENABLE ROW LEVEL SECURITY;

-- Create policies for civic_actions
CREATE POLICY "Enable read access for all users"
    ON public.civic_actions
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON public.civic_actions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for action owners"
    ON public.civic_actions
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for action owners"
    ON public.civic_actions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for verifications
CREATE POLICY "Enable read access for all users"
    ON public.verifications
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON public.verifications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for verification owners"
    ON public.verifications
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for verification owners"
    ON public.verifications
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for action_impacts
CREATE POLICY "Enable read access for all users"
    ON public.action_impacts
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON public.action_impacts
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.civic_actions
        WHERE id = action_id AND user_id = auth.uid()
    ));

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', new.email),
        new.email
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to increment trust score
CREATE OR REPLACE FUNCTION public.increment_trust_score(user_id UUID, increment_amount INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET trust_score = trust_score + increment_amount
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for verification images
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for verification images
CREATE POLICY "Allow public read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'verifications');

CREATE POLICY "Allow authenticated users to upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'verifications' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Allow users to update their own files"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'verifications' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

CREATE POLICY "Allow users to delete their own files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'verifications' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    ); 