import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          dek: string
          section: string
          status: string
          reading_time: string
          published_at: string
          author: string
          tags: string[]
          body: string
          featured_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          dek: string
          section: string
          status?: string
          reading_time?: string
          published_at?: string
          author?: string
          tags?: string[]
          body?: string
          featured_image?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          dek?: string
          section?: string
          status?: string
          reading_time?: string
          published_at?: string
          author?: string
          tags?: string[]
          body?: string
          featured_image?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type Comment = {
  id: string
  post_id: string
  author_name: string
  author_email: string | null
  content: string
  parent_id: string | null
  created_at: string
}

export type Reaction = {
  id: string
  comment_id: string
  reaction_type: string
  created_at: string
}

export type Visitor = {
  id: string
  post_id: string | null
  page_path: string
  ip_country: string | null
  ip_city: string | null
  referrer: string | null
  user_agent: string | null
  created_at: string
}
