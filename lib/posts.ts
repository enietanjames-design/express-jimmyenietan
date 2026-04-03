import { supabase, Post, PostInsert, PostUpdate } from './supabase'

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }
  
  return data || []
}

export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'Published')
    .order('published_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching published posts:', error)
    return []
  }
  
  return data || []
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'Published')
    .single()
  
  if (error) {
    console.error('Error fetching post:', error)
    return null
  }
  
  return data
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching post:', error)
    return null
  }
  
  return data
}

export async function createPost(post: PostInsert): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating post:', error)
    return null
  }
  
  return data
}

export async function updatePost(id: string, post: PostUpdate): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .update({ ...post, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating post:', error)
    return null
  }
  
  return data
}

export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting post:', error)
    return false
  }
  
  return true
}

export async function publishPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .update({ 
      status: 'Published', 
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error publishing post:', error)
    return null
  }
  
  return data
}

export async function unpublishPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .update({ 
      status: 'Draft', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error unpublishing post:', error)
    return null
  }
  
  return data
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
