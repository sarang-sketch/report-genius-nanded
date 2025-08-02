-- Create storage bucket for generated reports
INSERT INTO storage.buckets (id, name, public) VALUES ('reports', 'reports', false);

-- Create policies for report storage
CREATE POLICY "Users can view their own reports" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "System can upload reports" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'reports');

CREATE POLICY "System can update reports" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'reports');