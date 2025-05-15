-- Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Enable Row Level Security
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Create policies for followers
CREATE POLICY "Enable read access for all users"
    ON public.followers
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON public.followers
    FOR INSERT
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Enable delete for follower"
    ON public.followers
    FOR DELETE
    USING (auth.uid() = follower_id);

-- Create function to follow a user
CREATE OR REPLACE FUNCTION public.follow_user(
    p_following_id UUID
) RETURNS void AS $$
BEGIN
    -- Check if already following
    IF EXISTS (
        SELECT 1 FROM public.followers
        WHERE follower_id = auth.uid() AND following_id = p_following_id
    ) THEN
        RAISE EXCEPTION 'Already following this user';
    END IF;

    -- Create follow relationship
    INSERT INTO public.followers (follower_id, following_id)
    VALUES (auth.uid(), p_following_id);

    -- Create notification
    PERFORM public.create_notification(
        p_following_id,
        'new_follower',
        'New Follower',
        'Someone started following you',
        jsonb_build_object('follower_id', auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to unfollow a user
CREATE OR REPLACE FUNCTION public.unfollow_user(
    p_following_id UUID
) RETURNS void AS $$
BEGIN
    DELETE FROM public.followers
    WHERE follower_id = auth.uid() AND following_id = p_following_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get followers
CREATE OR REPLACE FUNCTION public.get_followers(
    p_user_id UUID
) RETURNS TABLE (
    user_id UUID,
    name TEXT,
    avatar_url TEXT,
    trust_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.avatar_url,
        p.trust_score,
        f.created_at
    FROM public.followers f
    JOIN public.profiles p ON f.follower_id = p.id
    WHERE f.following_id = p_user_id
    ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get following
CREATE OR REPLACE FUNCTION public.get_following(
    p_user_id UUID
) RETURNS TABLE (
    user_id UUID,
    name TEXT,
    avatar_url TEXT,
    trust_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.avatar_url,
        p.trust_score,
        f.created_at
    FROM public.followers f
    JOIN public.profiles p ON f.following_id = p.id
    WHERE f.follower_id = p_user_id
    ORDER BY f.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 