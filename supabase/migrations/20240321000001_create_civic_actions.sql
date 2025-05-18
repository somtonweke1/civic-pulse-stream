-- Create civic_actions table
CREATE TABLE IF NOT EXISTS public.civic_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    location TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('sublet', 'mutual-aid', 'childcare', 'food-sharing', 'vacant-use', 'community-event')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_method TEXT,
    verification_url TEXT,
    impact_tags TEXT[],
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.civic_actions ENABLE ROW LEVEL SECURITY;

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