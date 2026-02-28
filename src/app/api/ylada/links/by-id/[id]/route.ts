/**
 * GET /api/ylada/links/by-id/[id] — obtém um link do usuário (para edição).
 * PUT /api/ylada/links/by-id/[id] — atualiza título, CTA WhatsApp e status.
 * @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_ROLES = ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'] as const
const ALLOWED_STATUSES = ['active', 'paused', 'archived'] as const

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_ROLES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id } = await params
    if (!id) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: link, error } = await supabaseAdmin
      .from('ylada_links')
      .select('id, slug, title, template_id, status, config_json, cta_whatsapp, created_at, updated_at')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error || !link) {
      return NextResponse.json({ success: false, error: 'Link não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: link })
  } catch (e) {
    console.error('[ylada/links/by-id/[id]] GET', e)
    return NextResponse.json({ success: false, error: 'Erro ao buscar link' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_ROLES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id } = await params
    if (!id) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('ylada_links')
      .select('id, config_json')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError || !existing) {
      return NextResponse.json({ success: false, error: 'Link não encontrado' }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const title = typeof body.title === 'string' ? body.title.trim() || null : undefined
    const ctaWhatsapp = typeof body.cta_whatsapp === 'string' ? body.cta_whatsapp.trim() || null : undefined
    const status = typeof body.status === 'string' && ALLOWED_STATUSES.includes(body.status as (typeof ALLOWED_STATUSES)[number])
      ? body.status
      : undefined

    const updates: Record<string, unknown> = {}
    if (title !== undefined) updates.title = title
    if (ctaWhatsapp !== undefined) updates.cta_whatsapp = ctaWhatsapp
    if (status !== undefined) updates.status = status

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, data: existing })
    }

    const configJson = (existing.config_json as Record<string, unknown>) || {}
    if (title !== undefined) configJson.title = title
    if (ctaWhatsapp !== undefined) configJson.ctaText = ctaWhatsapp
    updates.config_json = configJson

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('ylada_links')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, slug, title, status, config_json, cta_whatsapp, updated_at')
      .single()

    if (updateError) {
      console.error('[ylada/links/by-id/[id]] PUT', updateError)
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (e) {
    console.error('[ylada/links/by-id/[id]] PUT', e)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar link' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_ROLES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth
    const { id } = await params
    if (!id) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { error } = await supabaseAdmin
      .from('ylada_links')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('[ylada/links/by-id/[id]] DELETE', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[ylada/links/by-id/[id]] DELETE', e)
    return NextResponse.json({ success: false, error: 'Erro ao excluir link' }, { status: 500 })
  }
}
