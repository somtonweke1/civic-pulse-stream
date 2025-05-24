-- Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (user_id, follower_id)
);

-- Enable Row Level Security
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own followers and who they follow
CREATE POLICY "Users can view their own followers and following"
    ON public.followers
    FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = follower_id); 