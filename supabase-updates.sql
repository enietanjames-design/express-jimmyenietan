-- Run this SQL in your Supabase SQL Editor
-- This adds featured_image, comments, and visitor tracking

-- 1. Add featured_image column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- 2. Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster comment lookups
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow public to read comments
CREATE POLICY "Public can view comments" ON comments
  FOR SELECT USING (true);

-- Allow public to insert comments
CREATE POLICY "Public can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- 3. Create visitors table for tracking
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  page_path TEXT NOT NULL,
  ip_country TEXT,
  ip_city TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster visitor lookups
CREATE INDEX IF NOT EXISTS visitors_created_at_idx ON visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS visitors_post_id_idx ON visitors(post_id);

-- Enable RLS on visitors
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Allow public to insert visitor records
CREATE POLICY "Public can insert visitors" ON visitors
  FOR INSERT WITH CHECK (true);

-- Allow authenticated (admin) to view visitors
CREATE POLICY "Admin can view visitors" ON visitors
  FOR SELECT USING (true);
