import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim()
  if (!token) {
    return NextResponse.json({ ok: false, reason: 'missing_token' }, { status: 400 })
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, reason: 'server' }, { status: 503 })
  }

  const { data, error } = await supabaseAdmin
    .from('pro_estetica_capilar_onboarding_links')
    .select('id,professional_name,invited_email,status,expires_at,response_completed_at')
    .eq('token', token)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ ok: false, reason: 'not_found' })
  }

  const now = new Date()
  const expired = new Date(String(data.expires_at)) < now
  if (expired && data.status === 'pending') {
    await supabaseAdmin
      .from('pro_estetica_capilar_onboarding_links')
      .update({ status: 'expired' })
      .eq('id', data.id)
      .eq('status', 'pending')
  }

  if (data.status === 'cancelled') return NextResponse.json({ ok: false, reason: 'cancelled' })
  if (data.status === 'completed') return NextResponse.json({ ok: false, reason: 'completed' })
  if (expired) return NextResponse.json({ ok: false, reason: 'expired' })

  return NextResponse.json({
    ok: true,
    professionalName: data.professional_name,
    invitedEmail: data.invited_email,
    expiresAt: data.expires_at,
  })
}
