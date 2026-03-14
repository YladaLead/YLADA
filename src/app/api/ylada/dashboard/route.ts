/**
 * GET /api/ylada/dashboard — métricas para o Painel do Dia (hoje e esta semana).
 */
import { NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'
import { hasYladaProPlan } from '@/lib/subscription-helpers'
import { FREEMIUM_LIMITS } from '@/config/freemium-limits'
import { getNoelUsageCount } from '@/lib/noel-usage-helpers'

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

function startOfMonthUtc(): string {
  const d = new Date()
  d.setUTCDate(1)
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
      const isPro = await hasYladaProPlan(user.id)
      const noelUsage = !isPro ? await getNoelUsageCount(user.id) : 0
      return NextResponse.json({
        success: true,
        data: {
          respostas_hoje: 0,
          conversas_hoje: 0,
          respostas_semana: 0,
          conversas_semana: 0,
          links_criados_semana: 0,
          link_mais_ativo_semana: null,
          respostas_mes: 0,
          freemium: {
            is_pro: isPro,
            whatsapp_clicks_mes: 0,
            limite_whatsapp_clicks: FREEMIUM_LIMITS.FREE_LIMIT_WHATSAPP_CLICKS_PER_MONTH,
            noel_analises_mes: noelUsage,
            limite_noel_analises: FREEMIUM_LIMITS.FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH,
          },
        },
      })
    }

    const linkIds = links.map((l) => l.id)
    const hoje = startOfTodayUtc()
    const semana = startOfWeekUtc()
    const inicioMes = startOfMonthUtc()

    const { data: metrics, error: metricsErr } = await supabaseAdmin
      .from('ylada_diagnosis_metrics')
      .select('link_id, clicked_whatsapp, created_at')
      .in('link_id', linkIds)
      .gte('created_at', inicioMes)

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
    const listSemana = list.filter((m) => m.created_at >= semana)
    const respostasMes = list.length
    const respostasSemana = listSemana.length
    const whatsappClicksMes = list.filter((m) => m.clicked_whatsapp).length
    const conversasSemana = listSemana.filter((m) => m.clicked_whatsapp).length
    const respostasHoje = list.filter((m) => m.created_at >= hoje).length
    const conversasHoje = list.filter((m) => m.created_at >= hoje && m.clicked_whatsapp).length

    const isPro = await hasYladaProPlan(user.id)
    const noelUsage = !isPro ? await getNoelUsageCount(user.id) : 0
    const byLink: Record<string, number> = {}
    for (const m of listSemana) {
      byLink[m.link_id] = (byLink[m.link_id] ?? 0) + 1
    }
    const linkMaisAtivoId =
      Object.entries(byLink).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    const linkMaisAtivo =
      linkMaisAtivoId != null
        ? (() => {
            const link = links.find((l) => l.id === linkMaisAtivoId)
            const count = byLink[linkMaisAtivoId] ?? 0
            const conversasLink = listSemana.filter(
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
        respostas_mes: respostasMes,
        freemium: {
          is_pro: isPro,
          whatsapp_clicks_mes: whatsappClicksMes,
          limite_whatsapp_clicks: FREEMIUM_LIMITS.FREE_LIMIT_WHATSAPP_CLICKS_PER_MONTH,
          noel_analises_mes: noelUsage,
          limite_noel_analises: FREEMIUM_LIMITS.FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH,
        },
      },
    })
  } catch (e) {
    console.error('[ylada/dashboard]', e)
    return NextResponse.json({ success: false, error: 'Erro ao carregar painel' }, { status: 500 })
  }
}
