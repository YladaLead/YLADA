import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCapilarTenantContext } from '@/lib/pro-estetica-capilar-server'

function clampExcerpt(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

/**
 * POST — regista feedback (útil / não útil) sobre uma resposta do Noel capilar.
 * Corpo: { messageId: string, rating: 'up' | 'down', excerpt?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
    if (!ctx) {
      return NextResponse.json({ success: false, error: 'Sem acesso ao painel Pro Estética Capilar.' }, { status: 403 })
    }

    let body: { messageId?: string; rating?: string; excerpt?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: 'JSON inválido' }, { status: 400 })
    }

    const messageId = typeof body.messageId === 'string' ? body.messageId.trim().slice(0, 128) : ''
    const rating = body.rating === 'up' || body.rating === 'down' ? body.rating : null
    if (!messageId || !rating) {
      return NextResponse.json({ success: false, error: 'messageId e rating (up|down) são obrigatórios.' }, { status: 400 })
    }

    const excerpt =
      typeof body.excerpt === 'string' && body.excerpt.trim()
        ? clampExcerpt(body.excerpt, 600)
        : null

    const { error } = await supabaseAdmin.from('pro_estetica_capilar_noel_message_feedback').insert({
      user_id: user.id,
      message_id: messageId,
      rating,
      excerpt,
    })

    if (error) {
      console.error('[pro-estetica-capilar/noel-feedback]', error)
      return NextResponse.json({ success: false, error: 'Não foi possível guardar o feedback.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[pro-estetica-capilar/noel-feedback]', e)
    return NextResponse.json({ success: false, error: 'Erro ao processar feedback.' }, { status: 500 })
  }
}
