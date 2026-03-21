import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { PLATFORM_SUPPORT_AREA } from '@/lib/platform-support-constants'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('area', PLATFORM_SUPPORT_AREA)
      .order('updated_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: tickets, error } = await query

    if (error) {
      console.error('[admin/support/tickets GET]', error)
      return NextResponse.json({ error: 'Erro ao buscar tickets' }, { status: 500 })
    }

    const enriched = await Promise.all(
      (tickets || []).map(async (t: any) => {
        const { data: u } = await supabaseAdmin.auth.admin.getUserById(t.user_id)
        const userName =
          u?.user?.user_metadata?.full_name ||
          u?.user?.email?.split('@')[0] ||
          'Usuário'
        const userEmail = u?.user?.email || null
        return { ...t, user_name: userName, user_email: userEmail }
      })
    )

    return NextResponse.json({ success: true, tickets: enriched })
  } catch (e: any) {
    console.error('[admin/support/tickets GET]', e)
    return NextResponse.json({ error: 'Erro ao listar tickets' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const body = await request.json()
    const { id, status, prioridade } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do ticket é obrigatório' }, { status: 400 })
    }

    const { data: existing, error: findErr } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single()

    if (findErr || !existing || existing.area !== PLATFORM_SUPPORT_AREA) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (status) {
      updates.status = status
      if (status === 'resolvido' || status === 'fechado') {
        updates.resolved_at = new Date().toISOString()
        if (existing.created_at) {
          const created = new Date(existing.created_at)
          updates.tempo_resolucao_segundos = Math.floor(
            (Date.now() - created.getTime()) / 1000
          )
        }
      }
    }

    if (prioridade) {
      updates.prioridade = prioridade
    }

    const { data: updated, error: upErr } = await supabaseAdmin
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (upErr) {
      return NextResponse.json({ error: 'Erro ao atualizar ticket' }, { status: 500 })
    }

    return NextResponse.json({ success: true, ticket: updated })
  } catch (e: any) {
    console.error('[admin/support/tickets PUT]', e)
    return NextResponse.json({ error: 'Erro ao atualizar ticket' }, { status: 500 })
  }
}
