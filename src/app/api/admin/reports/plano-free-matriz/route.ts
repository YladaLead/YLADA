import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { PERFIS_MATRIZ_YLADA } from '@/lib/admin-matriz-constants'

/**
 * GET /api/admin/reports/plano-free-matriz
 * Lista assinaturas area=ylada + plan_type=free e prévia de perfis matriz sem linha ylada (free implícito).
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const incluirExpiradas = searchParams.get('incluir_expiradas') === '1'

    const now = new Date()

    const { data: subs, error: subsError } = await supabaseAdmin
      .from('subscriptions')
      .select(
        'id, user_id, area, plan_type, status, current_period_start, current_period_end, created_at'
      )
      .eq('area', 'ylada')
      .eq('plan_type', 'free')
      .order('current_period_end', { ascending: false })

    if (subsError) {
      console.error('plano-free-matriz subs:', subsError)
      return NextResponse.json({ error: 'Erro ao carregar assinaturas' }, { status: 500 })
    }

    let lista = subs || []
    if (!incluirExpiradas) {
      lista = lista.filter(
        (s) =>
          s.status === 'active' &&
          s.current_period_end &&
          new Date(s.current_period_end).getTime() > now.getTime()
      )
    }

    const userIds = [...new Set(lista.map((s) => s.user_id))]

    const emailPorUser = new Map<string, string>()
    const perfilPorUser = new Map<
      string,
      { nome_completo: string | null; email: string | null; perfil: string | null; created_at: string | null }
    >()

    if (userIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, nome_completo, email, perfil, created_at')
        .in('user_id', userIds)

      for (const p of profiles || []) {
        perfilPorUser.set(p.user_id, {
          nome_completo: p.nome_completo,
          email: p.email,
          perfil: p.perfil,
          created_at: p.created_at,
        })
      }

      const semEmail = userIds.filter((id) => !perfilPorUser.get(id)?.email?.trim())
      await Promise.all(
        semEmail.slice(0, 40).map(async (uid) => {
          try {
            const { data } = await supabaseAdmin.auth.admin.getUserById(uid)
            const em = data?.user?.email
            if (em) emailPorUser.set(uid, em)
          } catch {
            /* ignore */
          }
        })
      )
    }

    const leadsPorUsuario: Record<string, number> = {}
    if (userIds.length > 0) {
      const { data: leads } = await supabaseAdmin.from('leads').select('user_id').in('user_id', userIds)
      for (const l of leads || []) {
        leadsPorUsuario[l.user_id] = (leadsPorUsuario[l.user_id] || 0) + 1
      }
    }

    const comRegistro = lista.map((s) => {
      const pr = perfilPorUser.get(s.user_id)
      const email =
        (pr?.email && pr.email.trim()) || emailPorUser.get(s.user_id) || ''
      const end = s.current_period_end ? new Date(s.current_period_end) : null
      const diasRestantes =
        end && !Number.isNaN(end.getTime())
          ? Math.ceil((end.getTime() - now.getTime()) / (86400 * 1000))
          : null
      const start = s.current_period_start ? new Date(s.current_period_start) : null
      const diasDesdeInicio =
        start && !Number.isNaN(start.getTime())
          ? Math.max(0, Math.floor((now.getTime() - start.getTime()) / (86400 * 1000)))
          : null

      return {
        subscriptionId: s.id,
        userId: s.user_id,
        email,
        nome: pr?.nome_completo || email.split('@')[0] || '—',
        perfil: pr?.perfil || null,
        status: s.status,
        currentPeriodStart: s.current_period_start,
        currentPeriodEnd: s.current_period_end,
        diasRestantes,
        diasDesdeInicio,
        leads: leadsPorUsuario[s.user_id] || 0,
        perfilCadastro: pr?.created_at || null,
      }
    })

    const { data: todosYladaSubs } = await supabaseAdmin.from('subscriptions').select('user_id').eq('area', 'ylada')
    const comLinhaYlada = new Set((todosYladaSubs || []).map((r: { user_id: string }) => r.user_id))

    const { data: candidatosImplicitos } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo, email, perfil, created_at')
      .in('perfil', [...PERFIS_MATRIZ_YLADA])
      .order('created_at', { ascending: false })
      .limit(800)

    const implicitosPreview = (candidatosImplicitos || [])
      .filter((p) => !comLinhaYlada.has(p.user_id))
      .slice(0, 200)
      .map((p) => ({
        userId: p.user_id,
        email: p.email?.trim() || '',
        nome: p.nome_completo || '—',
        perfil: p.perfil,
        dataCadastro: p.created_at,
        observacao: 'Sem linha em subscriptions (area ylada) — free implícito na listagem de Usuários',
      }))

    return NextResponse.json({
      success: true,
      geradoEm: now.toISOString(),
      comRegistro,
      implicitosPreview,
      notas: {
        implicitos:
          'A prévia lista até 200 perfis matriz (entre os 800 cadastros mais recentes) sem qualquer assinatura area=ylada. Para busca pontual use Admin → Usuários, filtro Gratuita.',
      },
    })
  } catch (e: any) {
    console.error('plano-free-matriz:', e)
    return NextResponse.json({ error: e?.message || 'Erro interno' }, { status: 500 })
  }
}
