-- Allow public access to 'gallery' bucket
-- Note: You need to create the policy in the Storage section of Supabase dashboard or via SQL if supported (Supabase SQL editor supports storage policies).

-- Policy for SELECT (Read)
CREATE POLICY "Public Access Select"
ON storage.objects FOR SELECT
USING ( bucket_id = 'gallery' );

-- Policy for INSERT (Upload)
CREATE POLICY "Public Access Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'gallery' );

-- Policy for UPDATE
CREATE POLICY "Public Access Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'gallery' );

-- Policy for DELETE
CREATE POLICY "Public Access Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'gallery' );
