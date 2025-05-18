-- Drop existing bucket if it exists
DELETE FROM storage.buckets WHERE id = 'verifications';

-- Create storage bucket for verification images with proper error handling
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'verifications'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('verifications', 'verifications', true);
    END IF;
END $$;

-- Ensure storage policies are properly set up
DROP POLICY IF EXISTS "Users can upload their own verification images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own verification images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own verification images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own verification images" ON storage.objects;

-- Recreate storage policies
CREATE POLICY "Users can upload their own verification images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'verifications' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can view their own verification images"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'verifications' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can update their own verification images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'verifications' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can delete their own verification images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'verifications' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
); 