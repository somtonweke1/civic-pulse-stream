-- Create storage bucket for verifications
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for verifications bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'verifications');

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verifications'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'verifications'
  AND auth.uid() = owner
);

CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'verifications'
  AND auth.uid() = owner
); 