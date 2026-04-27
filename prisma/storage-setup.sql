-- ============================================================
-- SalonOS — Supabase Storage Setup
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================


-- ── 1. Create buckets ────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars',        'avatars',        true,  2097152,  ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('stylist-photos', 'stylist-photos', true,  5242880,  ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('portfolios',     'portfolios',     true,  8388608,  ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('services',       'services',       true,  4194304,  ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('blog',           'blog',           true,  5242880,  ARRAY['image/jpeg','image/png','image/webp','image/avif'])
ON CONFLICT (id) DO NOTHING;

-- ── 2. RLS Policies ──────────────────────────────────────────

-- AVATARS: users can manage their own folder
CREATE POLICY "Avatar public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Avatar owner upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatar owner update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatar owner delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- STYLIST-PHOTOS: stylists manage their own, admins manage all
CREATE POLICY "Stylist photos public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'stylist-photos');

CREATE POLICY "Stylist photos authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'stylist-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Stylist photos owner delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'stylist-photos' AND auth.role() = 'authenticated');

-- PORTFOLIOS: stylists upload to their own folder
CREATE POLICY "Portfolio public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'portfolios');

CREATE POLICY "Portfolio authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolios' AND auth.role() = 'authenticated');

CREATE POLICY "Portfolio owner delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolios' AND auth.role() = 'authenticated');

-- SERVICES: admin only
CREATE POLICY "Services public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'services');

CREATE POLICY "Services admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'services' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (auth.uid())::text AND profiles.role = 'ADMIN')
  );

CREATE POLICY "Services admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'services' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (auth.uid())::text AND profiles.role = 'ADMIN')
  );

-- BLOG: admin only
CREATE POLICY "Blog public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'blog');

CREATE POLICY "Blog admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (auth.uid())::text AND profiles.role = 'ADMIN')
  );

CREATE POLICY "Blog admin delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog' AND
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = (auth.uid())::text AND profiles.role = 'ADMIN')
  );

-- ── 3. Prisma schema additions ────────────────────────────────
-- Add these columns to your DB after running prisma db push:

ALTER TABLE stylists
  ADD COLUMN IF NOT EXISTS avatar_url       TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_url   TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_images JSONB DEFAULT '[]'::jsonb;
-- portfolio_images shape: [{ id, url, path, caption }]

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
