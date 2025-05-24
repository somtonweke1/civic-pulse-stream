-- Create verifications table
CREATE TABLE IF NOT EXISTS public.verifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_id INTEGER REFERENCES public.civic_actions(id) ON DELETE CASCADE,
    image_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own verifications
CREATE POLICY "Users can insert their own verifications"
    ON public.verifications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own verifications
CREATE POLICY "Users can view their own verifications"
    ON public.verifications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can update their own verifications
CREATE POLICY "Users can update their own verifications"
    ON public.verifications
    FOR UPDATE
    USING (auth.uid() = user_id); 