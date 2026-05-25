import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription } from '@/lib/subscription-helpers'
import { ensureUserSlugSaved } from '@/lib/user-slug-generator'

/**
 * POST /api/promo/bem-estar/convert-perfil
 * wellness → coach-bem-estar no user_profiles, mantendo assinatura wellness.
 * Exige sessão e e-mail do body igual ao da conta logada.
 */
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user } = authResult

  try {
    const body = await request.json().catch(() => ({}))
    const emailBody = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const sessionEmail = (user.email || '').trim().toLowerCase()

    if (!emailBody || !sessionEmail || emailBody !== sessionEmail) {
      return NextResponse.json(
        {
          error:
            'Para sua segurança, use o mesmo e-mail da conta em que está logado. Entre com este e-mail e tente de novo.',
        },
        { status: 403 }
      )
    }

    if (!(await hasActiveSubscription(user.id, 'wellness'))) {
      return NextResponse.json(
        { error: 'Não há assinatura wellness ativa nesta conta.' },
        { status: 400 }
      )
    }

    const { data: prof, error: readErr } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil, nome_completo, user_slug')
      .eq('user_id', user.id)
      .maybeSingle()

    if (readErr) {
      console.error('[promo/bem-estar/convert-perfil] read', readErr)
      return NextResponse.json({ error: 'Não foi possível ler o perfil.' }, { status: 500 })
    }

    const perfil = prof?.perfil
    if (perfil === 'coach-bem-estar') {
      return NextResponse.json({ success: true, alreadyCoachBemEstar: true })
    }

    if (perfil !== 'wellness') {
      return NextResponse.json(
        {
          error:
            'Esta ação só está disponível para contas com perfil wellness e assinatura ativa. Fale com o suporte se precisar de ajuda.',
        },
        { status: 400 }
      )
    }

    const { error: updErr } = await supabaseAdmin
      .from('user_profiles')
      .update({ perfil: 'coach-bem-estar' })
      .eq('user_id', user.id)

    if (updErr) {
      console.error('[promo/bem-estar/convert-perfil] update', updErr)
      return NextResponse.json({ error: 'Não foi possível atualizar o perfil.' }, { status: 500 })
    }

    let userSlug = prof?.user_slug?.trim() || null
    if (!userSlug) {
      userSlug = await ensureUserSlugSaved(
        user.id,
        prof?.nome_completo || user.user_metadata?.full_name || user.user_metadata?.name || '',
        sessionEmail
      )
    }

    return NextResponse.json({ success: true, userSlug })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erro ao converter'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
