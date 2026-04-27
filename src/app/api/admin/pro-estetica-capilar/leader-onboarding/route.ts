import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  buildProEsteticaCapilarOnboardingUrl,
  capilarOnboardingExpiresAtDefault,
  generateCapilarOnboardingToken,
  isValidCapilarOnboardingEmail,
  normalizeCapilarOnboardingEmail,
} from '@/lib/pro-estetica-capilar-onboarding'

function requestOrigin(request: NextRequest): string {
  try {
    return new URL(request.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://www.ylada.com'
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const q = (request.nextUrl.searchParams.get('q') ?? '').trim().toLowerCase()
  const status = (request.nextUrl.searchParams.get('status') ?? 'all').trim().toLowerCase()

  let query = supabaseAdmin
    .from('pro_estetica_capilar_onboarding_links')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: 'Erro ao listar links de onboarding' }, { status: 500 })
  }

  const rows = (data ?? []).filter((r) => {
    if (!q) return true
    const name = String(r.professional_name ?? '').toLowerCase()
    const email = String(r.invited_email ?? '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })

  return NextResponse.json({ items: rows })
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: { professionalName?: string; email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const professionalName = String(body.professionalName ?? '').trim().slice(0, 160)
  const invitedEmail = normalizeCapilarOnboardingEmail(body.email ?? '')

  if (professionalName.length < 2) {
    return NextResponse.json({ error: 'Nome inválido.' }, { status: 400 })
  }
  if (!isValidCapilarOnboardingEmail(invitedEmail)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  const token = generateCapilarOnboardingToken()
  const expiresAt = capilarOnboardingExpiresAtDefault().toISOString()

  const { data, error } = await supabaseAdmin
    .from('pro_estetica_capilar_onboarding_links')
    .insert({
      token,
      professional_name: professionalName,
      invited_email: invitedEmail,
      status: 'pending',
      created_by_user_id: user.id,
      expires_at: expiresAt,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao criar link de onboarding.' }, { status: 500 })
  }

  return NextResponse.json({
    item: data,
    onboarding_url: buildProEsteticaCapilarOnboardingUrl(requestOrigin(request), token),
  })
}
