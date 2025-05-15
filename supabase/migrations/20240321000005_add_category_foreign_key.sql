-- Ensure categories table exists
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default categories if they don't exist
INSERT INTO public.categories (name, description) VALUES
    ('Housing', 'Actions related to housing, subletting, and space sharing'),
    ('Food Security', 'Actions related to food sharing, community gardens, and food banks'),
    ('Childcare', 'Actions related to childcare, education, and youth programs'),
    ('Community Events', 'Actions related to community gatherings, workshops, and cultural events'),
    ('Mutual Aid', 'Actions related to resource sharing, skill exchange, and community support'),
    ('Urban Space', 'Actions related to vacant space use, public space activation, and urban planning')
ON CONFLICT (name) DO NOTHING;

-- Add foreign key constraint for category_id
ALTER TABLE public.civic_actions
ADD CONSTRAINT fk_category
FOREIGN KEY (category_id)
REFERENCES public.categories(id)
ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_civic_actions_category_id
ON public.civic_actions(category_id); 