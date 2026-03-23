import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { getNamesForCanonical, getCanonicalName } from '@/lib/presidente-canonicos'
import { isPerfilMatrizYlada, PERFIS_MATRIZ_YLADA } from '@/lib/admin-matriz-constants'
import { parseYladaFreeGrantKind } from '@/lib/admin-ylada-free-matriz'
import { isAdminTestAccountEmail } from '@/lib/admin-test-accounts'

/**
 * GET /api/admin/usuarios
 * Retorna lista de usuários com dados reais (perfil, assinaturas, leads, etc.)
 * Apenas admin pode acessar
 * 
 * Query params:
 * - bloco?: 'todos' | 'ylada' | 'wellness' — escopo da listagem (UI: um único filtro “Base”).
 *   ylada = todos os perfis da matriz (PERFIS_MATRIZ_YLADA: med, psi, ylada, nutri…); wellness = só perfil wellness; omitido/todos = sem filtro de bloco.
 * - perfil?: slug exato em user_profiles.perfil (nutri, coach, ylada, …). UI: filtro “Segmento”.
 *   Preferir a `perfil` em vez de `area` para o perfil literal `ylada` ( `area=ylada` continua legado = matriz inteira).
 * - area?: legado | demais_segmentos | ylada (matriz) | todos — refinamentos antigos; sem `perfil`.
 * - status?: 'todos' | 'ativo' | 'inativo' - Filtrar por status
 * - assinatura?: 'todos' | 'gratuita' | 'mensal' | 'anual' | 'sem' - Filtrar por tipo de assinatura
 * - presidente?: string - Filtrar por nome do presidente (equipe do presidente)
 * - busca?: string - Buscar por nome, email (user_profiles ou Auth) ou WhatsApp
 */
function sanitizeBuscaIlike(raw: string) {
  // Vírgula quebra o operador .or() do PostgREST; %/_ em e-mail são raros
  return raw.trim().replace(/,/g, ' ').slice(0, 120)
}

export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const blocoFiltro = searchParams.get('bloco') || 'todos'
    const perfilFiltro = (searchParams.get('perfil') || '').trim().toLowerCase()
    const areaFiltro = searchParams.get('area') || 'todos'
    const statusFiltro = searchParams.get('status') || 'todos'
    const assinaturaFiltro = searchParams.get('assinatura') || 'todos'
    const presidenteFiltro = searchParams.get('presidente') || ''
    const busca = searchParams.get('busca') || ''

    // Buscar todos os perfis de usuários
    const LEGADO_AREAS = ['nutri', 'coach', 'nutra']
    const DEMAIS_SEGMENTOS = ['med', 'psi', 'psicanalise', 'odonto', 'estetica', 'fitness', 'perfumaria', 'seller']
    let profilesQuery = supabaseAdmin
      .from('user_profiles')
      .select('id, user_id, nome_completo, email, whatsapp, perfil, created_at, nome_presidente')

    // Aplicar filtro de bloco (YLADA vs Wellness - princípios diferentes)
    if (blocoFiltro === 'ylada') {
      profilesQuery = profilesQuery.in('perfil', [...PERFIS_MATRIZ_YLADA])
    } else if (blocoFiltro === 'wellness') {
      profilesQuery = profilesQuery.eq('perfil', 'wellness')
    }

    // Segmento exato (coluna Área) — não usar `area=ylada` aqui (esse valor é legado = matriz inteira)
    if (perfilFiltro && perfilFiltro !== 'todos') {
      profilesQuery = profilesQuery.eq('perfil', perfilFiltro)
    } else if (areaFiltro === 'legado') {
      profilesQuery = profilesQuery.in('perfil', LEGADO_AREAS)
    } else if (areaFiltro === 'demais_segmentos') {
      profilesQuery = profilesQuery.in('perfil', DEMAIS_SEGMENTOS)
    } else if (areaFiltro === 'ylada') {
      // Rótulo na UI: "Matriz YLADA (/pt)" — todos os segmentos da matriz, inclusive Med, não só perfil literal 'ylada'
      profilesQuery = profilesQuery.in('perfil', [...PERFIS_MATRIZ_YLADA])
    } else if (areaFiltro !== 'todos') {
      profilesQuery = profilesQuery.eq('perfil', areaFiltro)
    }

    // Aplicar filtro por presidente (equipe do presidente); aceita nome canônico e expande variantes
    if (presidenteFiltro) {
      const nomesPresidente = getNamesForCanonical(presidenteFiltro)
      if (nomesPresidente.length > 0) {
        profilesQuery = profilesQuery.in('nome_presidente', nomesPresidente)
      }
    }

    // Busca: nome, e-mail ou WhatsApp em user_profiles
    const buscaLimpa = busca ? sanitizeBuscaIlike(busca) : ''
    if (buscaLimpa) {
      profilesQuery = profilesQuery.or(
        `nome_completo.ilike.%${buscaLimpa}%,email.ilike.%${buscaLimpa}%,whatsapp.ilike.%${buscaLimpa}%`
      )
    }

    let { data: profiles, error: profilesError } = await profilesQuery

    if (profilesError) {
      console.error('Erro ao buscar perfis:', profilesError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários' },
        { status: 500 }
      )
    }

    // E-mail existe no Auth e às vezes não está copiado em user_profiles — localizar pelo Auth e carregar o perfil
    if (buscaLimpa && buscaLimpa.includes('@') && (!profiles || profiles.length === 0)) {
      const q = buscaLimpa.toLowerCase()
      let foundId: string | null = null
      const perPage = 200
      for (let page = 1; page <= 25 && !foundId; page++) {
        const { data: lu, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page, perPage })
        if (listErr || !lu?.users?.length) break
        const hit = lu.users.find(
          (x) =>
            (x.email && x.email.toLowerCase() === q) ||
            (x.email && x.email.toLowerCase().includes(q))
        )
        if (hit) foundId = hit.id
        if (lu.users.length < perPage) break
      }
      if (foundId) {
        const { data: p } = await supabaseAdmin
          .from('user_profiles')
          .select('id, user_id, nome_completo, email, whatsapp, perfil, created_at, nome_presidente')
          .eq('user_id', foundId)
          .maybeSingle()
        if (p) profiles = [p]
      }
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

    // Preencher e-mail a partir do Auth quando a linha do perfil está sem e-mail (até 60 usuários por request)
    const idsSemEmail = profiles.filter((p) => !p.email?.trim()).map((p) => p.user_id)
    const emailDoAuth = new Map<string, string>()
    const limiteAuth = 60
    for (let i = 0; i < Math.min(idsSemEmail.length, limiteAuth); i += 15) {
      const slice = idsSemEmail.slice(i, i + 15)
      await Promise.all(
        slice.map(async (uid) => {
          try {
            const { data } = await supabaseAdmin.auth.admin.getUserById(uid)
            const em = data?.user?.email
            if (em) emailDoAuth.set(uid, em)
          } catch {
            /* ignore */
          }
        })
      )
    }

    // WhatsApp em user_profiles às vezes vazio; tentar phone / metadata do Auth (lista atual)
    const idsSemWhatsapp = profiles.filter((p) => !p.whatsapp?.trim()).map((p) => p.user_id)
    const whatsappDoAuth = new Map<string, string>()
    const limiteWa = 120
    const phoneFromAuthUser = (u: { phone?: string | null; user_metadata?: Record<string, unknown> } | null | undefined) => {
      if (!u) return ''
      if (u.phone && String(u.phone).trim()) return String(u.phone).trim()
      const m = u.user_metadata
      if (!m || typeof m !== 'object') return ''
      for (const key of ['whatsapp', 'phone', 'phone_number', 'telefone'] as const) {
        const v = m[key]
        if (typeof v === 'string' && v.trim()) return v.trim()
      }
      return ''
    }
    for (let i = 0; i < Math.min(idsSemWhatsapp.length, limiteWa); i += 12) {
      const slice = idsSemWhatsapp.slice(i, i + 12)
      await Promise.all(
        slice.map(async (uid) => {
          try {
            const { data } = await supabaseAdmin.auth.admin.getUserById(uid)
            const ph = phoneFromAuthUser(data?.user ?? null)
            if (ph) whatsappDoAuth.set(uid, ph)
          } catch {
            /* ignore */
          }
        })
      )
    }

    // Buscar assinaturas (ativas e vencidas) para todos os usuários
    const userIds = profiles.map(p => p.user_id)
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id, area, plan_type, status, current_period_end, is_migrated, stripe_subscription_id')
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
      const todasSubsUsuario = subscriptions?.filter((s) => s.user_id === profile.user_id) || []
      const subsMesmaArea = todasSubsUsuario.filter((s) => s.area === userArea)
      const subsYlada = todasSubsUsuario.filter((s) => s.area === 'ylada')

      const isSubVigente = (sub: { status: string; current_period_end: string | null }) => {
        if (!sub.current_period_end || sub.status !== 'active') return false
        return new Date(sub.current_period_end).getTime() > now.getTime()
      }

      // Se existir linha "do segmento" mas só vencida/cancelada, não esconder ylada ativa (ex.: Med + free matriz)
      const mesmaAreaTemVigente = subsMesmaArea.some(isSubVigente)
      const userSubscriptions = mesmaAreaTemVigente
        ? subsMesmaArea
        : subsYlada.length > 0
          ? subsYlada
          : subsMesmaArea.length > 0
            ? subsMesmaArea
            : todasSubsUsuario
      const activeSubscription = userSubscriptions.find(sub => {
        if (!sub.current_period_end) return false
        const expiresAt = new Date(sub.current_period_end)
        return sub.status === 'active' && expiresAt.getTime() > now.getTime()
      })
      const latestSubscription = userSubscriptions[0]

      let subscriptionToEdit = activeSubscription || latestSubscription || null
      const subscriptionForStatus = activeSubscription || latestSubscription || null

      /**
       * Matriz /pt: zero linhas em `subscriptions` — acesso gratuito exibido no admin até criar registro (ex. ylada + prazo).
       * Diferente de plano free com linha (cortesia 90 dias etc.).
       */
      const implicitMatrizFree = isPerfilMatrizYlada(userArea) && todasSubsUsuario.length === 0

      const subsYladaOrdenadas = todasSubsUsuario.filter((s) => s.area === 'ylada')
      const yladaSubAtiva = subsYladaOrdenadas.find(
        (s) =>
          s.status === 'active' &&
          s.current_period_end &&
          new Date(s.current_period_end).getTime() > now.getTime()
      )
      const yladaSubParaAdmin = yladaSubAtiva || subsYladaOrdenadas[0] || null

      let isAtivo: boolean
      let status: 'ativo' | 'inativo'
      let assinaturaTipo: 'mensal' | 'anual' | 'gratuita' | 'sem assinatura'
      let assinaturaVencimento: string | null = null
      let assinaturaSituacao: 'ativa' | 'vencida' | 'sem'
      let assinaturaDiasVencida: number | null = null

      if (implicitMatrizFree) {
        isAtivo = true
        status = 'ativo'
        assinaturaTipo = 'gratuita'
        assinaturaSituacao = 'ativa'
        assinaturaDiasVencida = null
        subscriptionToEdit = null
      } else {
        isAtivo = !!activeSubscription
        status = isAtivo ? 'ativo' : 'inativo'
        assinaturaTipo = 'sem assinatura'
        assinaturaSituacao = 'sem'

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
      }

      // Aplicar filtro de status
      if (statusFiltro !== 'todos' && status !== statusFiltro) {
        return null
      }

      // Aplicar filtro de assinatura ('sem' no filtro = 'sem assinatura' no tipo)
      if (assinaturaFiltro !== 'todos') {
        const tipoMatch = assinaturaFiltro === 'sem'
          ? assinaturaTipo === 'sem assinatura'
          : assinaturaTipo === assinaturaFiltro
        if (!tipoMatch) return null
      }

      const emailExibicao =
        (profile.email && profile.email.trim()) || emailDoAuth.get(profile.user_id) || ''

      const whatsappExibicao =
        (profile.whatsapp && profile.whatsapp.trim()) || whatsappDoAuth.get(profile.user_id) || null

      return {
        id: profile.user_id,
        nome: profile.nome_completo || emailExibicao.split('@')[0] || 'Sem nome',
        email: emailExibicao,
        whatsapp: whatsappExibicao,
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
        statusAssinatura: implicitMatrizFree
          ? 'active'
          : subscriptionForStatus?.status || null, // active | canceled | past_due (para admin editar)
        nome_presidente: profile.nome_presidente || null,
        nome_presidente_canonico: getCanonicalName(profile.nome_presidente) || null,
        is_presidente: presidentesUserIds.has(profile.user_id),
        implicitMatrizFree,
        podeGerenciarFreeMatriz: isPerfilMatrizYlada(userArea),
        yladaFreeSubscriptionId: yladaSubParaAdmin?.id ?? null,
        yladaFreePeriodEnd: yladaSubParaAdmin?.current_period_end ?? null,
        yladaFreeGrantKind: yladaSubParaAdmin
          ? parseYladaFreeGrantKind(
              (yladaSubParaAdmin as { stripe_subscription_id?: string | null }).stripe_subscription_id
            )
          : null,
        isContaTeste: isAdminTestAccountEmail(emailExibicao),
      }
    }).filter(u => u !== null) // Remover nulls do filtro de status

    const lista = usuarios as NonNullable<(typeof usuarios)[number]>[]
    const producao = lista.filter((u) => !u.isContaTeste)
    const testes = lista.filter((u) => u.isContaTeste)

    // Totais “reais”: sem e-mails de domínios de teste (ex.: @ylada.com); ver getAdminTestEmailDomains
    const stats = {
      total: producao.length,
      ativos: producao.filter((u) => u.status === 'ativo').length,
      inativos: producao.filter((u) => u.status === 'inativo').length,
      contasTeste: {
        total: testes.length,
        ativos: testes.filter((u) => u.status === 'ativo').length,
        inativos: testes.filter((u) => u.status === 'inativo').length,
      },
    }

    return NextResponse.json({
      success: true,
      usuarios,
      stats,
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

