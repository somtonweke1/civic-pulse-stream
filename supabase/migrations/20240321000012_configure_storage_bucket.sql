-- Create storage bucket for verifications
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;

-- Set up storage policies for verifications bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'verifications');

-- More permissive upload policy
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verifications'
  AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
);

-- More permissive update policy
CREATE POLICY "Allow users to update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'verifications'
  AND (auth.uid() = owner OR auth.role() = 'authenticated')
);

-- More permissive delete policy
CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'verifications'
  AND (auth.uid() = owner OR auth.role() = 'authenticated')
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.buckets TO anon; 