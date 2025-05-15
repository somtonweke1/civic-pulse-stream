-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Enable read access for all users"
    ON public.categories
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON public.categories
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users"
    ON public.categories
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users"
    ON public.categories
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
    ('Housing', 'Actions related to housing, subletting, and space sharing'),
    ('Food Security', 'Actions related to food sharing, community gardens, and food banks'),
    ('Childcare', 'Actions related to childcare, education, and youth programs'),
    ('Community Events', 'Actions related to community gatherings, workshops, and cultural events'),
    ('Mutual Aid', 'Actions related to resource sharing, skill exchange, and community support'),
    ('Urban Space', 'Actions related to vacant space use, public space activation, and urban planning')
ON CONFLICT (name) DO NOTHING; 