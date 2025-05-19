-- Create storage bucket for verifications
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Create new policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'verifications');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'verifications' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'verifications' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'verifications' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.buckets TO anon;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create function to handle file uploads
CREATE OR REPLACE FUNCTION storage.handle_file_upload()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure the user has permission to upload
  IF auth.role() != 'authenticated' THEN
    RAISE EXCEPTION 'Only authenticated users can upload files';
  END IF;
  
  -- Set the owner of the file to the uploading user
  NEW.owner = auth.uid();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for file uploads
DROP TRIGGER IF EXISTS on_file_upload ON storage.objects;
CREATE TRIGGER on_file_upload
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION storage.handle_file_upload(); 