-- Run this SQL in your Supabase SQL Editor

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  dek TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'Essays',
  status TEXT NOT NULL DEFAULT 'Draft',
  reading_time TEXT DEFAULT '5 min read',
  published_at TIMESTAMPTZ,
  author TEXT DEFAULT 'Jimmy Enietan',
  tags TEXT[] DEFAULT '{}',
  body TEXT,
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_status_idx ON posts(status);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (status = 'Published');

-- Create policy to allow all operations for authenticated users (for admin)
-- You'll need to set up authentication later, for now we'll allow all
CREATE POLICY "Allow all operations" ON posts
  FOR ALL USING (true);

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to post-images bucket
CREATE POLICY "Public can view post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

CREATE POLICY "Anyone can upload post images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Anyone can update post images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'post-images');

CREATE POLICY "Anyone can delete post images" ON storage.objects
  FOR DELETE USING (bucket_id = 'post-images');

-- Insert sample posts
INSERT INTO posts (slug, title, dek, section, status, reading_time, published_at, author, tags, body) VALUES
(
  'the-age-of-deliberate-builders',
  'The Age of Deliberate Builders',
  'Velocity is cheap. Intention is rare. What wins now is craftsmanship at startup speed.',
  'Featured',
  'Published',
  '8 min read',
  NOW(),
  'Jimmy Enietan',
  ARRAY['Identity', 'Craft', 'Strategy'],
  '<p>The internet no longer rewards noise by default. It rewards people who can design, ship, and explain with precision. That means deliberate builders are becoming the new operators.</p><p>Deliberate work is not slow work. It is directional work. Every page, line, and interaction should reveal intent, not trend-following.</p><p>When a product reads like everybody else, it disappears. When it feels authored, it compounds trust.</p><p>This is the central thesis of Express: publication as product, writing as interface, and clarity as leverage.</p>'
),
(
  'editorial-systems-for-modern-founders',
  'Editorial Systems for Modern Founders',
  'A publication cadence is not about posting more; it is about creating a repeatable authority engine.',
  'Essays',
  'Published',
  '6 min read',
  NOW() - INTERVAL '9 days',
  'Jimmy Enietan',
  ARRAY['Founders', 'Content', 'Systems'],
  '<p>Most founders treat content like promotion. The strongest founders treat content like infrastructure.</p><p>An editorial system maps topics to outcomes: trust, demand, hiring quality, and category positioning.</p><p>The key is distinction. A recognizable voice, a clear lens, and a consistent publishing rhythm.</p><p>Once the system is real, each post becomes an asset instead of a one-time announcement.</p>'
),
(
  'designing-for-authority-not-attention',
  'Designing for Authority, Not Attention',
  'Attention spikes are temporary. Authority compounds when form and message remain coherent.',
  'Insights',
  'Published',
  '5 min read',
  NOW() - INTERVAL '19 days',
  'Jimmy Enietan',
  ARRAY['Design', 'Authority', 'Brand'],
  '<p>Attention-seeking interfaces optimize for reaction. Authority-led interfaces optimize for trust.</p><p>Authority is built through consistency in typography, spacing, pacing, and language.</p><p>A premium publication does not need excess visuals. It needs confidence in hierarchy and tone.</p><p>That confidence is visible long before a user reads the first full paragraph.</p>'
);
