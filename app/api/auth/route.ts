import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = 'Jimmydebillionaire(100%)'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-auth')
  return NextResponse.json({ success: true })
}

export async function GET() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin-auth')
  return NextResponse.json({ authenticated: !!auth })
}
