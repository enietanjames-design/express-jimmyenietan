import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/posts'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message, data: [] }, { status: 500 })
    }
    
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Failed to fetch posts', data: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const post = {
    ...body,
    slug: body.slug || generateSlug(body.title),
    status: body.status || 'Draft',
    reading_time: body.reading_time || '5 min read',
    published_at: body.published_at || null,
    author: body.author || 'Jimmy Enietan',
    tags: body.tags || [],
    body: body.body || '',
  }
  
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
