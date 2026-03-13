/**
 * GET /api/ylada/dashboard — métricas para o Painel do Dia (hoje e esta semana).
 */
import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'

function startOfTodayUtc(): string {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

function startOfWeekUtc(): string {
  const d = new Date()
  const day = d.getUTCDay()
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1)
  d.setUTCDate(diff)
  d.setUTCHours(0, 0, 0, 0)
  return d.toISOString()
}

export async function GET(request: Request) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: links, error: linksErr } = await supabaseAdmin
      .from('ylada_links')
      .select('id, slug, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (linksErr || !links?.length) {
      return NextResponse.json({
        success: true,
        data: {
          respostas_hoje: 0,
          conversas_hoje: 0,
          respostas_semana: 0,
          conversas_semana: 0,
          links_criados_semana: 0,
          link_mais_ativo_semana: null,
        },
      })
    }

    const linkIds = links.map((l) => l.id)
    const hoje = startOfTodayUtc()
    const semana = startOfWeekUtc()

    const { data: metrics, error: metricsErr } = await supabaseAdmin
      .from('ylada_diagnosis_metrics')
      .select('link_id, clicked_whatsapp, created_at')
      .in('link_id', linkIds)
      .gte('created_at', semana)

    if (metricsErr) {
      console.error('[ylada/dashboard]', metricsErr)
      return NextResponse.json({
        success: true,
        data: {
          respostas_hoje: 0,
          conversas_hoje: 0,
          respostas_semana: 0,
          conversas_semana: 0,
          links_criados_semana: links.filter((l) => new Date(l.created_at) >= new Date(semana)).length,
          link_mais_ativo_semana: null,
        },
      })
    }

    const list = metrics ?? []
    const respostasSemana = list.length
    const conversasSemana = list.filter((m) => m.clicked_whatsapp).length
    const respostasHoje = list.filter((m) => m.created_at >= hoje).length
    const conversasHoje = list.filter((m) => m.created_at >= hoje && m.clicked_whatsapp).length

    const byLink: Record<string, number> = {}
    for (const m of list) {
      byLink[m.link_id] = (byLink[m.link_id] ?? 0) + 1
    }
    const linkMaisAtivoId =
      Object.entries(byLink).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    const linkMaisAtivo =
      linkMaisAtivoId != null
        ? (() => {
            const link = links.find((l) => l.id === linkMaisAtivoId)
            const count = byLink[linkMaisAtivoId] ?? 0
            const conversasLink = list.filter(
              (m) => m.link_id === linkMaisAtivoId && m.clicked_whatsapp
            ).length
            return link
              ? {
                  id: link.id,
                  title: link.title || link.slug,
                  respostas: count,
                  conversas: conversasLink,
                }
              : null
          })()
        : null

    const linksCriadosSemana = links.filter(
      (l) => new Date(l.created_at) >= new Date(semana)
    ).length

    return NextResponse.json({
      success: true,
      data: {
        respostas_hoje: respostasHoje,
        conversas_hoje: conversasHoje,
        respostas_semana: respostasSemana,
        conversas_semana: conversasSemana,
        links_criados_semana: linksCriadosSemana,
        link_mais_ativo_semana: linkMaisAtivo,
      },
    })
  } catch (e) {
    console.error('[ylada/dashboard]', e)
    return NextResponse.json({ success: false, error: 'Erro ao carregar painel' }, { status: 500 })
  }
}
