-- Create impact_calculations table
CREATE TABLE IF NOT EXISTS public.impact_calculations (
    id SERIAL PRIMARY KEY,
    action_id INTEGER REFERENCES public.civic_actions(id) ON DELETE CASCADE,
    metric TEXT NOT NULL,
    value NUMERIC NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.impact_calculations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view impact calculations for their actions
CREATE POLICY "Users can view their own impact calculations"
    ON public.impact_calculations
    FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.civic_actions WHERE id = action_id AND user_id = auth.uid())); 