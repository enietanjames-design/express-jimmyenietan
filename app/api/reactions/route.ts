import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET reactions for a comment
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const commentId = searchParams.get('comment_id')

  if (!commentId) {
    return NextResponse.json({ error: 'comment_id required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .eq('comment_id', commentId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST new reaction
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { comment_id, reaction_type } = body

  if (!comment_id || !reaction_type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('reactions')
    .insert({
      comment_id,
      reaction_type,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE reaction
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
