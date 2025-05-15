-- Create materialized view for impact aggregations
CREATE MATERIALIZED VIEW IF NOT EXISTS public.impact_aggregations AS
SELECT
    DATE_TRUNC('day', ca.created_at) as date,
    ca.action_type,
    ai.impact_type,
    COUNT(*) as action_count,
    AVG(ai.impact_score) as avg_impact_score,
    SUM(ai.impact_score) as total_impact_score,
    COUNT(DISTINCT ca.user_id) as unique_users
FROM public.civic_actions ca
JOIN public.action_impacts ai ON ca.id = ai.action_id
GROUP BY
    DATE_TRUNC('day', ca.created_at),
    ca.action_type,
    ai.impact_type
WITH DATA;

-- Create index on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS impact_aggregations_idx
ON public.impact_aggregations (date, action_type, impact_type);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION public.refresh_impact_aggregations()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.impact_aggregations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to refresh the materialized view when actions are modified
CREATE OR REPLACE FUNCTION public.trigger_refresh_impact_aggregations()
RETURNS TRIGGER AS $$
BEGIN
    -- Schedule a refresh of the materialized view
    PERFORM public.refresh_impact_aggregations();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_action_modified
    AFTER INSERT OR UPDATE OR DELETE ON public.civic_actions
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_refresh_impact_aggregations();

-- Create view for user impact rankings
CREATE OR REPLACE VIEW public.user_impact_rankings AS
SELECT
    p.id as user_id,
    p.name,
    p.avatar_url,
    p.trust_score,
    COUNT(DISTINCT ca.id) as total_actions,
    SUM(ai.impact_score) as total_impact,
    AVG(ai.impact_score) as avg_impact,
    COUNT(DISTINCT ai.impact_type) as impact_types_contributed
FROM public.profiles p
LEFT JOIN public.civic_actions ca ON p.id = ca.user_id
LEFT JOIN public.action_impacts ai ON ca.id = ai.action_id
GROUP BY p.id, p.name, p.avatar_url, p.trust_score
ORDER BY total_impact DESC;

-- Create view for location-based impact
CREATE OR REPLACE VIEW public.location_impact AS
SELECT
    ca.location,
    COUNT(DISTINCT ca.id) as total_actions,
    COUNT(DISTINCT ca.user_id) as unique_users,
    SUM(ai.impact_score) as total_impact,
    AVG(ai.impact_score) as avg_impact,
    COUNT(DISTINCT ai.impact_type) as impact_types
FROM public.civic_actions ca
JOIN public.action_impacts ai ON ca.id = ai.action_id
GROUP BY ca.location
ORDER BY total_impact DESC; 