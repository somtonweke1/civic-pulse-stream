-- Create impact_aggregations table
CREATE TABLE IF NOT EXISTS public.impact_aggregations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    total_impact NUMERIC NOT NULL DEFAULT 0,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.impact_aggregations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own impact aggregations
CREATE POLICY "Users can view their own impact aggregations"
    ON public.impact_aggregations
    FOR SELECT
    USING (auth.uid() = user_id); 