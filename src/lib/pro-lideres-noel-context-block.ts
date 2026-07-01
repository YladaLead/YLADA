/**
 * Bloco de contexto Pro Líderes para o Noel da matriz (Fase 1 — unificação).
 * Monta papel (líder | membro), operação, catálogo filtrado e override de conduta do líder.
 */
import type { NextRequest } from 'next/server'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { formatLinksAtivosParaNoel, getNoelYladaLinks } from '@/lib/noel-ylada-links'
import { formatProLideresCatalogForNoel } from '@/lib/pro-lideres-noel-catalog-context'
import { resolveProLideresNoelProfileId } from '@/lib/pro-lideres-noel-prompt'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import {
  buildProLideresMemberNoelDailyTasksExcerpt,
  buildProLideresMemberNoelObjectionExcerpt,
  fetchProLideresMemberNoelObjection,
} from '@/lib/pro-lideres-member-noel-context'
import { buildProLideresMemberNoelCatalogExcerpt } from '@/lib/pro-lideres-member-noel-catalog'
import { fetchProLideresMemberTabulatorName } from '@/lib/pro-lideres-noel-member-access'
import { isNoelProLideresUnifiedForTenant } from '@/lib/pro-lideres-noel-unified-flag'
import { resolvedUserEmail } from '@/lib/pro-lideres-server'
import type { LeaderTenantRow } from '@/types/leader-tenant'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

export type ProLideresNoelUnifiedPapel = 'leader' | 'member'

export type BuildProLideresNoelContextBlockParams = {
  papel: ProLideresNoelUnifiedPapel
  operationLabel: string
  verticalCode: string
  focusNotes: string | null
  replyLanguage: string
  noelProfileId: string
  tenantRole: ProLideresTenantRole
  /** Líder: links ativos do dono (formato matriz). */
  linksAtivosContext?: string | null
  /** Líder: catálogo pré-construído pl-* com status ativado. */
  catalogContext?: string | null
  painelTarefasDiariasUrl?: string | null
  /** Membro: URLs personalizadas em Meus links. */
  catalogExcerpt?: string | null
  tabulatorName?: string | null
  dailyTasksExcerpt?: string | null
  objectionExcerpt?: string | null
}

import { resolveProLideresNoelPublicBaseUrl } from '@/lib/pro-lideres-noel-public-base-url'

function replyLanguageLabel(locale: string | undefined): string {
  if (locale === 'en') return 'English'
  if (locale === 'es') return 'Español'
  return 'Português (Brasil)'
}

function operationLabelFromTenant(t: LeaderTenantRow): string {
  return t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Pro Líderes'
}

/** Resolve papel a partir do body da matriz (área ou campo explícito). */
export function resolveProLideresNoelUnifiedPapel(input: {
  area?: string
  proLideresPapel?: string
}): ProLideresNoelUnifiedPapel | null {
  const explicit = typeof input.proLideresPapel === 'string' ? input.proLideresPapel.trim().toLowerCase() : ''
  if (explicit === 'leader' || explicit === 'lider') return 'leader'
  if (explicit === 'member' || explicit === 'membro') return 'member'

  const area = typeof input.area === 'string' ? input.area.trim() : ''
  if (area === 'pro_lideres') return 'leader'
  if (area === 'pro_lideres_member') return 'member'
  return null
}

/** Override de conduta: ENTREGA PRIMEIRO sobrepõe regras genéricas da matriz. */
export function buildProLideresNoelLeaderConducaoOverrideBlock(): string {
  return `[PRO LÍDERES — RAMO LÍDER — PRIORIDADE SOBRE REGRAS GENÉRICAS]
Quando este bloco está ativo (papel=líder, Pro Líderes), a regra **ENTREGA PRIMEIRO** sobrepõe instruções genéricas de "perguntar antes de entregar", "coletar briefing" ou "faça pelo menos 1 pergunta estratégica" (incluindo [COMPORTAMENTO ESTRATÉGICO] e [MODO EXECUTOR] quando conflitarem).
- Pedido explícito de **criar / gerar / montar** quiz, fluxo, diagnóstico ou link: a **primeira** resposta deve ser **executável** (rascunho MODELO VISUAL ou remessa ao bloco oficial de link); **no máximo 1–2** perguntas de refino no fim, ou **nenhuma** se o brief já veio completo.
- **Proibido** abrir só com formulário de briefing ou travar em "preciso de mais informações" quando o líder já trouxe tema, público ou canal.
- Links novos ficam na conta YLADA do **dono** da operação; a equipe só vê no catálogo após **Disponibilizar à equipe**.`
}

function buildMemberRamoRulesBlock(): string {
  return `[PRO LÍDERES — RAMO MEMBRO (CAMPO)]
- Você é o mesmo Noel: apoia quem está **em campo** nesta operação, atendendo e crescendo a rede.
- **Nesta operação a conversa é negócio (oportunidade/renda) ou educacional (servir/diagnosticar) — nunca produto.** Não abra nem empurre produto, marca de terceiro ou "kit"; produto é consequência, jamais a porta. (O método — servir antes de vender, ler o estágio 20/80, educar os 80% — você já traz da matriz; aqui só vale a trava de não virar venda de produto.)
- Tem o motor completo do YLADA: pode montar diagnóstico/quiz/link quando fizer sentido, **e** usar os endereços prontos em **[MEUS LINKS]** para compartilhar rápido.
- Nunca **escreva ou invente uma URL à mão**: use um link de [MEUS LINKS] ou deixe o sistema gerar o link de verdade.
- Marca: **YLADA** / **Pro Líderes** — nunca "Wellness" como nome da plataforma.`
}

function appendFocusNotes(focusNotes: string | null): string {
  if (!focusNotes?.trim()) return ''
  return `- Notas de foco do líder (use com critério): ${focusNotes.trim().slice(0, 2000)}\n`
}

function appendLeaderExtras(params: BuildProLideresNoelContextBlockParams): string {
  const parts: string[] = []
  parts.push(buildProLideresNoelLeaderConducaoOverrideBlock())
  if (params.catalogContext?.trim()) parts.push('\n' + params.catalogContext.trim())
  if (params.linksAtivosContext?.trim()) {
    parts.push('\n' + params.linksAtivosContext.trim())
    parts.push(
      `\n[REGRAS — LINKS ATIVOS DO DONO]
- "Último link" = o primeiro da lista. Ao sugerir ferramenta do catálogo ⬜, oriente ativar em **Ferramentas → Catálogo** no painel.`
    )
  }
  if (params.painelTarefasDiariasUrl?.trim()) {
    const url = params.painelTarefasDiariasUrl.trim()
    parts.push(
      `\n[TAREFAS DIÁRIAS — PAINEL]
URL oficial: ${url}
Formato na mensagem: [Tarefas diárias — Painel Pro Líderes](${url}) + bloco de código com o URL numa linha.`
    )
  }
  return parts.join('\n')
}

function appendMemberExtras(params: BuildProLideresNoelContextBlockParams): string {
  const parts: string[] = [buildMemberRamoRulesBlock()]
  const tab = params.tabulatorName?.trim()
    ? `Tabulador: **${params.tabulatorName.trim()}**.`
    : 'Sem tabulador na ficha.'
  parts.push(`\n${tab}`)
  if (params.dailyTasksExcerpt?.trim()) {
    parts.push(`\n[DISCIPLINA DIÁRIA — TAREFAS DE HOJE]\n${params.dailyTasksExcerpt.trim()}`)
  }
  if (params.objectionExcerpt?.trim()) {
    parts.push(`\n[OBJEÇÃO — BASE]\n${params.objectionExcerpt.trim()}`)
  }
  if (params.catalogExcerpt?.trim()) {
    parts.push(
      `\n[MEUS LINKS — SEUS ENDEREÇOS PARA COMPARTILHAR]\nCada linha é **seu link** (URL personalizada). Indique qual enviar.\n${params.catalogExcerpt.trim()}`
    )
  } else {
    parts.push(
      '\n[MEUS LINKS]\nEm Meus links cada ferramenta já é **seu link** com URL própria. **Nunca** invente URL.'
    )
  }
  return parts.join('\n')
}

/**
 * Monta o bloco `[CONTEXTO PRO LÍDERES]` injetado no system prompt da matriz.
 * Exemplo: papel=líder inclui catálogo pl-* + override ENTREGA PRIMEIRO.
 */
export function buildProLideresNoelContextBlock(params: BuildProLideresNoelContextBlockParams): string {
  const papelLabel = params.papel === 'leader' ? 'líder (dono do espaço)' : 'membro da equipe'
  const header = `[CONTEXTO PRO LÍDERES — RAMO ATIVO]
- **papel:** ${params.papel} (${papelLabel})
- **operação:** ${params.operationLabel}
- **vertical:** ${params.verticalCode}
- **perfil Noel:** ${params.noelProfileId}
- **papel no tenant (auth):** ${params.tenantRole}
- **idioma das respostas:** ${params.replyLanguage}
${appendFocusNotes(params.focusNotes)}`

  const body =
    params.papel === 'leader' ? appendLeaderExtras(params) : appendMemberExtras(params)

  return `${header}\n${body}`
}

function papelAllowedForRole(
  papel: ProLideresNoelUnifiedPapel,
  role: ProLideresTenantRole
): boolean {
  if (papel === 'leader') return role === 'leader'
  return role === 'leader' || role === 'member'
}

async function fetchLeaderCatalogSlugs(
  supabase: SupabaseClient,
  ownerUserId: string
): Promise<string[]> {
  const { data } = await supabase
    .from('ylada_links')
    .select('slug')
    .eq('user_id', ownerUserId)
    .eq('status', 'active')
    .limit(100)
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

async function loadLeaderContextFields(
  supabase: SupabaseClient,
  tenant: LeaderTenantRow,
  baseUrl: string
): Promise<Pick<
  BuildProLideresNoelContextBlockParams,
  'linksAtivosContext' | 'catalogContext' | 'painelTarefasDiariasUrl'
>> {
  const origin = baseUrl.replace(/\/$/, '')
  const linksRows = await getNoelYladaLinks(tenant.owner_user_id, origin)
  const slugs = await fetchLeaderCatalogSlugs(supabase, tenant.owner_user_id)
  return {
    linksAtivosContext: linksRows.length ? formatLinksAtivosParaNoel(linksRows) : null,
    catalogContext: formatProLideresCatalogForNoel(slugs),
    painelTarefasDiariasUrl: `${origin}/pro-lideres/painel/tarefas`,
  }
}

async function loadMemberContextFields(
  supabase: SupabaseClient,
  tenant: LeaderTenantRow,
  memberUserId: string,
  baseUrl: string,
  message: string
): Promise<
  Pick<
    BuildProLideresNoelContextBlockParams,
    'catalogExcerpt' | 'tabulatorName' | 'dailyTasksExcerpt' | 'objectionExcerpt'
  >
> {
  let catalogExcerpt: string | null = null
  let dailyTasksExcerpt: string | null = null
  let objectionExcerpt: string | null = null
  let tabulatorName: string | null = null

  try {
    catalogExcerpt = await buildProLideresMemberNoelCatalogExcerpt(supabase, {
      tenant,
      memberUserId,
      baseUrl,
    })
  } catch (e) {
    console.warn('[pro-lideres-noel-context-block] catálogo membro', e)
  }

  try {
    dailyTasksExcerpt = await buildProLideresMemberNoelDailyTasksExcerpt(supabase, {
      tenant,
      role: 'member',
    })
  } catch (e) {
    console.warn('[pro-lideres-noel-context-block] tarefas membro', e)
  }

  try {
    const obj = await fetchProLideresMemberNoelObjection(message)
    objectionExcerpt = buildProLideresMemberNoelObjectionExcerpt(obj)
  } catch (e) {
    console.warn('[pro-lideres-noel-context-block] objeção membro', e)
  }

  try {
    tabulatorName = await fetchProLideresMemberTabulatorName(supabase, tenant.id, memberUserId)
  } catch (e) {
    console.warn('[pro-lideres-noel-context-block] tabulador', e)
  }

  return { catalogExcerpt, tabulatorName, dailyTasksExcerpt, objectionExcerpt }
}

export type LoadProLideresNoelMatrixContextInput = {
  supabase: SupabaseClient
  user: User
  request: NextRequest
  message: string
  area?: string
  proLideresPapel?: string
  locale?: string
}

export type ProLideresNoelMatrixSession = {
  papel: ProLideresNoelUnifiedPapel
  tenant: LeaderTenantRow
  tenantRole: ProLideresTenantRole
  contextBlock: string
}

async function buildSessionContextBlock(
  input: LoadProLideresNoelMatrixContextInput,
  papel: ProLideresNoelUnifiedPapel,
  ctx: { tenant: LeaderTenantRow; role: ProLideresTenantRole }
): Promise<string> {
  const tenant = ctx.tenant
  const verticalCode = (tenant.vertical_code ?? 'h-lider').trim() || 'h-lider'
  const baseUrl = resolveProLideresNoelPublicBaseUrl(input.request).replace(/\/$/, '')
  const replyLanguage = replyLanguageLabel(input.locale)

  const baseParams: BuildProLideresNoelContextBlockParams = {
    papel,
    operationLabel: operationLabelFromTenant(tenant),
    verticalCode,
    focusNotes: tenant.focus_notes?.trim() || null,
    replyLanguage,
    noelProfileId: resolveProLideresNoelProfileId(verticalCode),
    tenantRole: ctx.role,
  }

  if (papel === 'leader') {
    const leaderFields = await loadLeaderContextFields(input.supabase, tenant, baseUrl)
    return buildProLideresNoelContextBlock({ ...baseParams, ...leaderFields })
  }

  const memberFields = await loadMemberContextFields(
    input.supabase,
    tenant,
    input.user.id,
    baseUrl,
    input.message
  )
  return buildProLideresNoelContextBlock({ ...baseParams, ...memberFields })
}

/**
 * Carrega tenant + dados e devolve sessão PL para a matriz.
 * Retorna `null` se unificação inativa, sem papel PL, sem tenant ou papel não autorizado.
 */
export async function loadProLideresNoelMatrixSession(
  input: LoadProLideresNoelMatrixContextInput
): Promise<ProLideresNoelMatrixSession | null> {
  const papel = resolveProLideresNoelUnifiedPapel({
    area: input.area,
    proLideresPapel: input.proLideresPapel,
  })
  if (!papel) return null

  const ctx = await resolveProLideresTenantContext(input.supabase, input.user)
  if (!ctx) return null
  if (!papelAllowedForRole(papel, ctx.role)) return null

  const ownerEmail =
    ctx.role === 'leader' ? resolvedUserEmail(input.user) : null
  if (!isNoelProLideresUnifiedForTenant(ctx.tenant, { ownerEmail, role: ctx.role })) {
    return null
  }

  const contextBlock = await buildSessionContextBlock(input, papel, ctx)
  return {
    papel,
    tenant: ctx.tenant,
    tenantRole: ctx.role,
    contextBlock,
  }
}

/**
 * Carrega tenant + dados e devolve o bloco de contexto PL para a matriz.
 * Retorna `null` se flag OFF, sem papel PL, sem tenant ou papel não autorizado.
 */
export async function loadProLideresNoelMatrixContext(
  input: LoadProLideresNoelMatrixContextInput
): Promise<string | null> {
  const session = await loadProLideresNoelMatrixSession(input)
  return session?.contextBlock ?? null
}
