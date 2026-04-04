import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get geolocation from Vercel headers (accurate, real-time)
function getGeoFromHeaders(request: NextRequest): { country: string | null; city: string | null } {
  // Vercel provides these headers automatically at the edge
  const country = request.headers.get('x-vercel-ip-country')
  const city = request.headers.get('x-vercel-ip-city')
  
  return {
    country,
    city,
  }
}

// POST new visitor record
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { post_id, page_path, referrer, user_agent } = body

  // Get geolocation from Vercel headers (accurate, real-time)
  const geo = getGeoFromHeaders(request)
  const ip_country = geo.country
  const ip_city = geo.city

  const { data, error } = await supabase
    .from('visitors')
    .insert({
      post_id: post_id || null,
      page_path,
      ip_country,
      ip_city,
      referrer: referrer || null,
      user_agent: user_agent || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to track visitor:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// GET visitor stats (for admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '7')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
