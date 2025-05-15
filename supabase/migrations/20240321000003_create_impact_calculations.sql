-- Create function to calculate impact score
CREATE OR REPLACE FUNCTION public.calculate_impact_score(
    action_type TEXT,
    verification_status TEXT,
    trust_score INTEGER
) RETURNS INTEGER AS $$
DECLARE
    base_score INTEGER;
    verification_multiplier FLOAT;
    trust_multiplier FLOAT;
BEGIN
    -- Base score based on action type
    CASE action_type
        WHEN 'sublet' THEN base_score := 5;
        WHEN 'mutual-aid' THEN base_score := 8;
        WHEN 'childcare' THEN base_score := 7;
        WHEN 'food-sharing' THEN base_score := 6;
        WHEN 'vacant-use' THEN base_score := 4;
        WHEN 'community-event' THEN base_score := 3;
        ELSE base_score := 1;
    END CASE;

    -- Verification multiplier
    CASE verification_status
        WHEN 'verified' THEN verification_multiplier := 1.5;
        WHEN 'pending' THEN verification_multiplier := 1.0;
        WHEN 'rejected' THEN verification_multiplier := 0.0;
        ELSE verification_multiplier := 1.0;
    END CASE;

    -- Trust score multiplier (0-10 scale)
    trust_multiplier := 1.0 + (trust_score::FLOAT / 20.0);

    -- Calculate final score (capped at 10)
    RETURN LEAST(10, ROUND(base_score * verification_multiplier * trust_multiplier));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate impact type
CREATE OR REPLACE FUNCTION public.calculate_impact_type(
    action_type TEXT,
    impact_tags TEXT[]
) RETURNS TEXT AS $$
BEGIN
    -- If impact tags are provided, use the first one
    IF array_length(impact_tags, 1) > 0 THEN
        RETURN impact_tags[1];
    END IF;

    -- Otherwise, determine impact type based on action type
    CASE action_type
        WHEN 'sublet' THEN RETURN 'urban_density';
        WHEN 'mutual-aid' THEN RETURN 'mutual_aid';
        WHEN 'childcare' THEN RETURN 'community_building';
        WHEN 'food-sharing' THEN RETURN 'sustainability';
        WHEN 'vacant-use' THEN RETURN 'urban_density';
        WHEN 'community-event' THEN RETURN 'community_building';
        ELSE RETURN 'community_building';
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate and store impact
CREATE OR REPLACE FUNCTION public.calculate_and_store_impact(
    action_id UUID,
    action_type TEXT,
    verification_status TEXT,
    user_id UUID,
    impact_tags TEXT[]
) RETURNS void AS $$
DECLARE
    impact_score INTEGER;
    impact_type TEXT;
    user_trust_score INTEGER;
BEGIN
    -- Get user's trust score
    SELECT trust_score INTO user_trust_score
    FROM public.profiles
    WHERE id = user_id;

    -- Calculate impact score
    impact_score := public.calculate_impact_score(
        action_type,
        verification_status,
        COALESCE(user_trust_score, 0)
    );

    -- Calculate impact type
    impact_type := public.calculate_impact_type(action_type, impact_tags);

    -- Insert impact record
    INSERT INTO public.action_impacts (
        action_id,
        impact_type,
        impact_score
    ) VALUES (
        action_id,
        impact_type,
        impact_score
    );

    -- Update user's trust score
    UPDATE public.profiles
    SET trust_score = trust_score + impact_score
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to calculate impact when action is created or updated
CREATE OR REPLACE FUNCTION public.trigger_calculate_impact()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate and store impact
    PERFORM public.calculate_and_store_impact(
        NEW.id,
        NEW.action_type,
        NEW.verification_status,
        NEW.user_id,
        NEW.impact_tags
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_action_created_or_updated
    AFTER INSERT OR UPDATE ON public.civic_actions
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_calculate_impact(); 