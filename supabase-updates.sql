-- Run this SQL in your Supabase SQL Editor
-- This adds featured_image, comments, visitor tracking, and reactions

-- 1. Add featured_image column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- 2. Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster comment lookups
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);

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

-- 4. Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster reaction lookups
CREATE INDEX IF NOT EXISTS reactions_comment_id_idx ON reactions(comment_id);

-- Enable RLS on reactions
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Allow public to view reactions
CREATE POLICY "Public can view reactions" ON reactions
  FOR SELECT USING (true);

-- Allow public to insert reactions
CREATE POLICY "Public can insert reactions" ON reactions
  FOR INSERT WITH CHECK (true);

-- Allow public to delete their own reactions (optional)
CREATE POLICY "Public can delete reactions" ON reactions
  FOR DELETE USING (true);
