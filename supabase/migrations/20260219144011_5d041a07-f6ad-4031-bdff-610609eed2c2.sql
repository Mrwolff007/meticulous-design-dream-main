
-- Create public bucket for vehicle photos
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-photos', 'vehicle-photos', true);

-- Anyone can view vehicle photos
CREATE POLICY "Anyone can view vehicle photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-photos');

-- Admins can upload vehicle photos
CREATE POLICY "Admins can upload vehicle photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can update vehicle photos
CREATE POLICY "Admins can update vehicle photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admins can delete vehicle photos
CREATE POLICY "Admins can delete vehicle photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'vehicle-photos' AND public.has_role(auth.uid(), 'admin'::public.app_role));
