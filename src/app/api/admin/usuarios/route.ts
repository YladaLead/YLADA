import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { getNamesForCanonical, getCanonicalName } from '@/lib/presidente-canonicos'

/**
 * GET /api/admin/usuarios
 * Retorna lista de usuários com dados reais (perfil, assinaturas, leads, etc.)
 * Apenas admin pode acessar
 * 
 * Query params:
 * - bloco?: 'todos' | 'ylada' | 'wellness' - Separar YLADA de Wellness (princípios diferentes)
 * - area?: 'todos' | 'wellness' | 'nutri' | 'coach' | 'nutra' - Filtrar por área
 * - status?: 'todos' | 'ativo' | 'inativo' - Filtrar por status
 * - assinatura?: 'todos' | 'gratuita' | 'mensal' | 'anual' | 'sem' - Filtrar por tipo de assinatura
 * - presidente?: string - Filtrar por nome do presidente (equipe do presidente)
 * - busca?: string - Buscar por nome ou email
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const blocoFiltro = searchParams.get('bloco') || 'todos'
    const areaFiltro = searchParams.get('area') || 'todos'
    const statusFiltro = searchParams.get('status') || 'todos'
    const assinaturaFiltro = searchParams.get('assinatura') || 'todos'
    const presidenteFiltro = searchParams.get('presidente') || ''
    const busca = searchParams.get('busca') || ''

    // Buscar todos os perfis de usuários
    const YLADA_AREAS = ['nutri', 'coach', 'nutra', 'med', 'psi', 'psicanalise', 'odonto', 'estetica', 'fitness', 'perfumaria', 'ylada']
    let profilesQuery = supabaseAdmin
      .from('user_profiles')
      .select('id, user_id, nome_completo, email, perfil, created_at, nome_presidente')

    // Aplicar filtro de bloco (YLADA vs Wellness - princípios diferentes)
    if (blocoFiltro === 'ylada') {
      profilesQuery = profilesQuery.in('perfil', YLADA_AREAS)
    } else if (blocoFiltro === 'wellness') {
      profilesQuery = profilesQuery.eq('perfil', 'wellness')
    }

    // Aplicar filtro de área (refinamento dentro do bloco)
    if (areaFiltro !== 'todos') {
      profilesQuery = profilesQuery.eq('perfil', areaFiltro)
    }

    // Aplicar filtro por presidente (equipe do presidente); aceita nome canônico e expande variantes
    if (presidenteFiltro) {
      const nomesPresidente = getNamesForCanonical(presidenteFiltro)
      if (nomesPresidente.length > 0) {
        profilesQuery = profilesQuery.in('nome_presidente', nomesPresidente)
      }
    }

    // Aplicar busca por nome ou email
    if (busca) {
      profilesQuery = profilesQuery.or(`nome_completo.ilike.%${busca}%,email.ilike.%${busca}%`)
    }

    const { data: profiles, error: profilesError } = await profilesQuery

    if (profilesError) {
      console.error('Erro ao buscar perfis:', profilesError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários' },
        { status: 500 }
      )
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        usuarios: [],
        stats: {
          total: 0,
          ativos: 0,
          inativos: 0
        }
      })
    }

    // Buscar assinaturas (ativas e vencidas) para todos os usuários
    const userIds = profiles.map(p => p.user_id)
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id, area, plan_type, status, current_period_end, is_migrated')
      .in('user_id', userIds)
      .order('current_period_end', { ascending: false })

    // Buscar leads para todos os usuários
    const { data: leads } = await supabaseAdmin
      .from('leads')
      .select('user_id, template_id')
      .in('user_id', userIds)

    // Contar leads por usuário
    const leadsPorUsuario: Record<string, number> = {}
    if (leads) {
      leads.forEach(lead => {
        leadsPorUsuario[lead.user_id] = (leadsPorUsuario[lead.user_id] || 0) + 1
      })
    }

    // Buscar templates (cursos/ferramentas) por usuário — user_templates (legado)
    const { data: templates } = await supabaseAdmin
      .from('user_templates')
      .select('user_id, views')
      .in('user_id', userIds)

    // Contar templates por usuário
    const templatesPorUsuario: Record<string, number> = {}
    const cliquesPorUsuario: Record<string, number> = {}
    if (templates) {
      templates.forEach((template: { user_id: string; views?: number }) => {
        templatesPorUsuario[template.user_id] = (templatesPorUsuario[template.user_id] || 0) + 1
        cliquesPorUsuario[template.user_id] = (cliquesPorUsuario[template.user_id] || 0) + (template.views || 0)
      })
    }

    // Incluir ylada_links (links inteligentes integrados à conta) — Links + Cliques
    try {
      const { data: yladaLinks } = await supabaseAdmin
        .from('ylada_links')
        .select('id, user_id')
        .in('user_id', userIds)

      if (yladaLinks && yladaLinks.length > 0) {
        yladaLinks.forEach((link: { id: string; user_id: string }) => {
          templatesPorUsuario[link.user_id] = (templatesPorUsuario[link.user_id] || 0) + 1
        })

        // Buscar eventos (views) dos ylada_links para somar cliques
        const linkIds = yladaLinks.map((l: { id: string }) => l.id)
        const linkIdToUserId = new Map(yladaLinks.map((l: { id: string; user_id: string }) => [l.id, l.user_id]))

        const { data: yladaEvents } = await supabaseAdmin
          .from('ylada_link_events')
          .select('link_id')
          .in('link_id', linkIds)
          .eq('event_type', 'view')

        if (yladaEvents) {
          yladaEvents.forEach((ev: { link_id: string }) => {
            const uid = linkIdToUserId.get(ev.link_id)
            if (uid) {
              cliquesPorUsuario[uid] = (cliquesPorUsuario[uid] || 0) + 1
            }
          })
        }
      }
    } catch (err) {
      console.warn('Erro ao buscar ylada_links (pode não existir):', err)
    }

    let presidentesUserIds = new Set<string>()
    try {
      const { data: presLinks } = await supabaseAdmin
        .from('presidentes_autorizados')
        .select('user_id')
        .eq('status', 'ativo')
      ;(presLinks || []).forEach((p: { user_id?: string }) => {
        if (p.user_id) presidentesUserIds.add(p.user_id)
      })
    } catch {
      // Coluna user_id pode não existir (migration 222 não rodada)
    }

    const now = new Date()

    // Montar lista de usuários com dados completos
    const usuarios = profiles.map(profile => {
      const userArea = profile.perfil || 'wellness'
      const userSubscriptions = subscriptions?.filter(s => s.user_id === profile.user_id && s.area === userArea) || []
      const activeSubscription = userSubscriptions.find(sub => {
        if (!sub.current_period_end) return false
        const expiresAt = new Date(sub.current_period_end)
        return sub.status === 'active' && expiresAt.getTime() > now.getTime()
      })
      const latestSubscription = userSubscriptions[0]

      const subscriptionToEdit = activeSubscription || latestSubscription || null
      const subscriptionForStatus = activeSubscription || latestSubscription || null
      const isAtivo = !!activeSubscription
      const status = isAtivo ? 'ativo' : 'inativo'

      // Aplicar filtro de status
      if (statusFiltro !== 'todos' && status !== statusFiltro) {
        return null
      }

      // Determinar tipo de assinatura (antes do filtro)
      let assinaturaTipo = 'sem assinatura'
      let assinaturaVencimento: string | null = null
      let assinaturaSituacao: 'ativa' | 'vencida' | 'sem' = 'sem'
      let assinaturaDiasVencida: number | null = null
      
      if (subscriptionForStatus) {
        if (subscriptionForStatus.plan_type === 'free') {
          assinaturaTipo = 'gratuita'
        } else if (subscriptionForStatus.plan_type === 'monthly') {
          assinaturaTipo = 'mensal'
        } else if (subscriptionForStatus.plan_type === 'annual') {
          assinaturaTipo = 'anual'
        }
        assinaturaVencimento = subscriptionForStatus.current_period_end
      }

      if (activeSubscription) {
        assinaturaSituacao = 'ativa'
      } else if (latestSubscription && latestSubscription.current_period_end) {
        assinaturaSituacao = 'vencida'
        const vencimento = new Date(latestSubscription.current_period_end)
        assinaturaVencimento = latestSubscription.current_period_end
        const diffMs = now.getTime() - vencimento.getTime()
        assinaturaDiasVencida = diffMs > 0 ? Math.floor(diffMs / (1000 * 60 * 60 * 24)) : 0
      } else {
        assinaturaSituacao = 'sem'
      }

      // Aplicar filtro de assinatura ('sem' no filtro = 'sem assinatura' no tipo)
      if (assinaturaFiltro !== 'todos') {
        const tipoMatch = assinaturaFiltro === 'sem'
          ? assinaturaTipo === 'sem assinatura'
          : assinaturaTipo === assinaturaFiltro
        if (!tipoMatch) return null
      }

      return {
        id: profile.user_id,
        nome: profile.nome_completo || profile.email?.split('@')[0] || 'Sem nome',
        email: profile.email || '',
        area: profile.perfil || 'wellness',
        status,
        assinatura: assinaturaTipo,
        assinaturaId: subscriptionToEdit?.id || null,
        assinaturaVencimento: assinaturaVencimento ? new Date(assinaturaVencimento).toISOString().split('T')[0] : null,
        dataCadastro: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : null,
        leadsGerados: leadsPorUsuario[profile.user_id] || 0,
        cursosCompletos: templatesPorUsuario[profile.user_id] || 0, // legacy (UI não deve mais exibir como cursos)
        linksEnviados: templatesPorUsuario[profile.user_id] || 0,
        cliquesLinks: cliquesPorUsuario[profile.user_id] || 0,
        isMigrado: subscriptionForStatus?.is_migrated || false,
        assinaturaSituacao,
        assinaturaDiasVencida,
        statusAssinatura: subscriptionForStatus?.status || null, // active | canceled | past_due (para admin editar)
        nome_presidente: profile.nome_presidente || null,
        nome_presidente_canonico: getCanonicalName(profile.nome_presidente) || null,
        is_presidente: presidentesUserIds.has(profile.user_id),
      }
    }).filter(u => u !== null) // Remover nulls do filtro de status

    // Calcular estatísticas
    const stats = {
      total: usuarios.length,
      ativos: usuarios.filter(u => u?.status === 'ativo').length,
      inativos: usuarios.filter(u => u?.status === 'inativo').length
    }

    return NextResponse.json({
      success: true,
      usuarios,
      stats
    })
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar usuários',
        technical: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

