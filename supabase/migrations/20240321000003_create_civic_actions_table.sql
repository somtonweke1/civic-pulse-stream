-- Create civic_actions table
CREATE TABLE IF NOT EXISTS public.civic_actions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    details TEXT,
    location TEXT,
    action_type TEXT NOT NULL,
    verification_status TEXT DEFAULT 'pending',
    verification_method TEXT,
    verification_url TEXT,
    impact_tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.civic_actions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own actions
CREATE POLICY "Users can insert their own actions"
    ON public.civic_actions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own actions
CREATE POLICY "Users can view their own actions"
    ON public.civic_actions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can update their own actions
CREATE POLICY "Users can update their own actions"
    ON public.civic_actions
    FOR UPDATE
    USING (auth.uid() = user_id); 