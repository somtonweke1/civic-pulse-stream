-- Add trigger to verifications table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.verifications
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at(); 