-- Create a new storage bucket for verifications
INSERT INTO storage.buckets (id, name, public)
VALUES ('verifications', 'verifications', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for the verifications bucket
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
        auth.uid() = owner
    );

CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'verifications' AND
        auth.uid() = owner
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated, anon;
GRANT SELECT ON storage.objects TO authenticated, anon;
GRANT INSERT ON storage.objects TO authenticated;
GRANT UPDATE ON storage.objects TO authenticated;
GRANT DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.buckets TO authenticated, anon;

-- Create function to handle file uploads
CREATE OR REPLACE FUNCTION public.handle_file_upload()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure the user has permission to upload
  IF auth.role() != 'authenticated' THEN
    RAISE EXCEPTION 'Only authenticated users can upload files';
  END IF;
  
  -- Set the owner of the file to the uploading user
  NEW.owner = auth.uid();
  
  -- Set the bucket_id to verifications
  NEW.bucket_id = 'verifications';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for file uploads
DROP TRIGGER IF EXISTS on_file_upload ON storage.objects;
CREATE TRIGGER on_file_upload
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_file_upload(); 