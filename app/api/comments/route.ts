import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET comments for a post
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('post_id')

  if (!postId) {
    return NextResponse.json({ error: 'post_id required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST new comment
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { post_id, author_name, author_email, content, parent_id } = body

  if (!post_id || !author_name || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id,
      author_name,
      author_email: author_email || null,
      content,
      parent_id: parent_id || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
