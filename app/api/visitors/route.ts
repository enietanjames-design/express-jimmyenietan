import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Get visitor IP from request headers
function getIP(request: NextRequest): string | null {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    return xff.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || null
}

// Fetch geolocation data from IP
async function getGeoFromIP(ip: string): Promise<{ country: string | null; city: string | null }> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`)
    const data = await res.json()
    
    if (data.status === 'success') {
      return {
        country: data.country || null,
        city: data.city || null,
      }
    }
  } catch (error) {
    console.error('Failed to fetch geo data:', error)
  }
  return { country: null, city: null }
}

// POST new visitor record
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { post_id, page_path, referrer, user_agent } = body

  // Get IP and geolocation
  const ip = getIP(request)
  let ip_country: string | null = null
  let ip_city: string | null = null

  if (ip && ip !== '127.0.0.1' && ip !== '::1') {
    const geo = await getGeoFromIP(ip)
    ip_country = geo.country
    ip_city = geo.city
  }

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
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
