import { supabaseAdmin } from '@/lib/supabase'
import { ensureProLideresPresetYladaLinks } from '@/lib/pro-lideres/ensure-pro-lideres-preset-links'
import { isProLideresPresetLink } from '@/lib/pro-lideres/wellness-fluxo-to-ylada-config'
import {
  type ProLideresFlowCatalogKind,
  inferProLideresFlowCatalogKindFromHref,
} from '@/lib/pro-lideres-flow-catalog-kind'

/** Tipos em ylada_link_templates que entram no catálogo (ferramentas com resultado / diagnóstico). */
const YLADA_CATALOG_TEMPLATE_TYPES = new Set(['calculator', 'diagnostico', 'quiz', 'triagem'])

export type ProLideresSituationBucket =
  | 'all'
  | 'gerar_contatos'
  | 'iniciar_conversa'
  | 'entender_cliente'
  | 'reativar'

export type ProLideresCatalogCategory = 'sales' | 'recruitment'

/** Biblioteca base (presets) vs ferramentas criadas pelo líder em Meus links / extras. */
export type ProLideresCatalogOrigin = 'library' | 'mine'

export type ProLideresCatalogItem = {
  id: string
  label: string
  href: string
  publicUrl: string
  source: 'ylada' | 'custom'
  kind: 'calculator' | 'quiz' | 'link'
  /** Presets Pro Líderes vs links criados pelo utilizador. */
  origin: ProLideresCatalogOrigin
  /** Vendas vs recrutamento (UI em separadores). */
  catalogCategory: ProLideresCatalogCategory
  /** Se a equipe vê no catálogo; o líder controla (fluxos custom + override YLADA). */
  visibleToTeam: boolean
  stats: { views: number; conversions: number; shares: number }
  yladaLinkId?: string
  description: string | null
  /** Ex.: "Metabolismo · ~1 min · 5 perguntas" */
  metaLine: string | null
  whenToUse: string | null
  segmentLabel: string | null
  themeLabel: string | null
  situationBucket: ProLideresSituationBucket
  createdAt: string | null
  badge: 'most_used' | 'most_shared' | null
  /** Só em entradas `custom` (BD): notas do líder (edição no painel). */
  customFlowNotes?: string
  /** Só `source === 'custom'`: atalho vs diagnóstico YLADA (3 níveis). */
  customCatalogKind?: ProLideresFlowCatalogKind
}

type EventRow = { link_id: string; event_type: string; cnt: number | string }

function buildStatsMap(
  rows: EventRow[] | null
): Record<string, { view: number; cta_click: number; share_click: number }> {
  const map: Record<string, { view: number; cta_click: number; share_click: number }> = {}
  if (!rows?.length) return map
  for (const r of rows) {
    if (!map[r.link_id]) map[r.link_id] = { view: 0, cta_click: 0, share_click: 0 }
    const n = typeof r.cnt === 'number' ? r.cnt : parseInt(String(r.cnt), 10) || 0
    if (r.event_type === 'view') map[r.link_id].view = n
    else if (r.event_type === 'cta_click') map[r.link_id].cta_click = n
    else if (r.event_type === 'share_click') map[r.link_id].share_click = n
  }
  return map
}

function normalizePublicUrl(baseUrl: string, href: string): string {
  const t = href.trim()
  if (t.startsWith('http://') || t.startsWith('https://')) return t
  const path = t.startsWith('/') ? t : `/${t}`
  const prefix = baseUrl.replace(/\/$/, '')
  return prefix ? `${prefix}${path}` : path
}

/**
 * HOM / apresentação gravada (vídeo) não são questionários com diagnóstico no mesmo formato —
 * classificam-se em Vendas para não misturar com os fluxos de perguntas em Recrutamento.
 */
function isHomGravadaOrVideoPresentation(title: string, slug: string, config: unknown): boolean {
  const t = title.trim().toLowerCase()
  const s = slug.trim().toLowerCase()
  const cfg = (config && typeof config === 'object' ? config : {}) as Record<string, unknown>
  const page = (cfg.page && typeof cfg.page === 'object' ? cfg.page : {}) as Record<string, unknown>
  const subtitle = typeof page.subtitle === 'string' ? page.subtitle.toLowerCase() : ''
  const blob = `${t} ${s} ${subtitle}`

  if (/\bhom\b/.test(blob) && /grav|grava|vídeo|video|filmagem/.test(blob)) return true
  if (/apresenta(ç|c)ão gravada|apresentacao gravada/.test(blob)) return true
  if (/link da hom\b|hom gravad/.test(blob)) return true
  if (s === 'hom' && /\bhom\b/.test(t)) return true

  return false
}

function inferYladaCatalogCategory(
  row: {
    category?: string | null
    sub_category?: string | null
    segment?: string | null
    title?: string | null
    slug?: string | null
  },
  config: unknown
): ProLideresCatalogCategory {
  const title = (row.title ?? '').trim() || (row.slug ?? '').trim() || ''
  const slug = (row.slug ?? '').trim() || ''
  const seg = (row.segment ?? '').toLowerCase()
  const cat = (row.category ?? '').toLowerCase()
  /** HYPE Drink: sempre no funil de vendas no painel Pro Líderes. */
  if (seg === 'hype' || cat === 'hype') {
    return 'sales'
  }

  if (title && isHomGravadaOrVideoPresentation(title, slug, config)) {
    return 'sales'
  }

  const cfg = (config && typeof config === 'object' ? config : {}) as Record<string, unknown>
  const meta = (cfg.meta && typeof cfg.meta === 'object' ? cfg.meta : {}) as Record<string, unknown>
  const pk = meta.pro_lideres_kind
  if (pk === 'recruitment' || pk === 'sales') {
    return pk
  }

  const metaStr = JSON.stringify(cfg.meta ?? {})
  const pageStr = JSON.stringify(cfg.page ?? {})
  const hay = [row.category, row.sub_category, row.segment, metaStr, pageStr]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  if (
    hay.includes('recrut') ||
    hay.includes('recruit') ||
    hay.includes('oportunidade') ||
    hay.includes('negócio') ||
    hay.includes('negocio') ||
    hay.includes('distribuidor') ||
    hay.includes('consultor') ||
    hay.includes('empreendedor') ||
    hay.includes('renda extra')
  ) {
    return 'recruitment'
  }
  return 'sales'
}

function inferCustomKind(href: string): 'calculator' | 'quiz' | 'link' {
  const h = href.toLowerCase()
  if (h.includes('/l/')) return 'link'
  if (h.includes('calculadora') || h.includes('calculator') || h.includes('/templates/imc')) return 'calculator'
  if (h.includes('quiz') || h.includes('diagnostico') || h.includes('avalia')) return 'quiz'
  return 'link'
}

function segmentCodeToLabel(code: string | null | undefined): string | null {
  if (!code || typeof code !== 'string') return null
  const c = code.trim().toLowerCase()
  const map: Record<string, string> = {
    nutrition: 'Nutrição',
    nutricao: 'Nutrição',
    geral: 'Geral',
    perfumaria: 'Perfumaria',
    aesthetics: 'Estética',
    estetica: 'Estética',
    medicine: 'Saúde',
    fitness: 'Fitness',
    joias: 'Joias e bijuterias',
    alimentacao: 'Alimentação',
    metabolismo: 'Metabolismo',
    intestino: 'Intestino',
    peso: 'Peso',
    energia: 'Energia',
    inchaço: 'Inchaço',
    inchaco: 'Inchaço',
    hype: 'HYPE Drink',
  }
  return map[c] ?? c.charAt(0).toUpperCase() + c.slice(1)
}

function objectiveToBucket(obj: unknown): ProLideresSituationBucket {
  const o = typeof obj === 'string' ? obj.toLowerCase().trim() : ''
  if (o === 'captar') return 'gerar_contatos'
  if (o === 'indicar') return 'gerar_contatos'
  if (o === 'propagar') return 'iniciar_conversa'
  if (o === 'educar') return 'entender_cliente'
  if (o === 'reter') return 'reativar'
  return 'all'
}

function countQuestions(config: Record<string, unknown>): number {
  const form = config.form as { fields?: unknown[] } | undefined
  if (Array.isArray(form?.fields)) return form.fields.length
  const q = config.questions as unknown[] | undefined
  if (Array.isArray(q)) return q.length
  const calc = config.fields as unknown[] | undefined
  if (Array.isArray(calc)) return calc.length
  return 0
}

function parseConfigJson(
  configJson: unknown,
  linkSegment: string | null,
  titleFallback: string,
  kind: 'calculator' | 'quiz'
): Pick<
  ProLideresCatalogItem,
  'description' | 'metaLine' | 'whenToUse' | 'segmentLabel' | 'themeLabel' | 'situationBucket'
> {
  const config = (configJson && typeof configJson === 'object' ? configJson : {}) as Record<string, unknown>
  const meta = (config.meta && typeof config.meta === 'object' ? config.meta : {}) as Record<string, unknown>
  const page = (config.page && typeof config.page === 'object' ? config.page : {}) as Record<string, unknown>
  const result = (config.result && typeof config.result === 'object' ? config.result : {}) as Record<string, unknown>

  const themeRaw =
    (typeof meta.theme_raw === 'string' && meta.theme_raw.trim()) ||
    (typeof meta.theme_display === 'string' && meta.theme_display.trim()) ||
    (typeof meta.theme_text === 'string' && meta.theme_text.trim()) ||
    null

  const themeLabel = themeRaw || titleFallback

  const segmentFromMeta =
    (typeof meta.segment_code === 'string' && meta.segment_code.trim()) || (linkSegment && String(linkSegment).trim()) || null

  const segmentLabel = segmentCodeToLabel(segmentFromMeta)

  const description =
    (typeof page.subtitle === 'string' && page.subtitle.trim()) ||
    (typeof config.description === 'string' && config.description.trim()) ||
    (typeof result.headline === 'string' && result.headline.trim()) ||
    null

  const whenFromConfig =
    (typeof page.when_to_use === 'string' && page.when_to_use.trim()) ||
    (typeof meta.suggested_angle === 'string' && meta.suggested_angle.trim()) ||
    null

  const whenToUse =
    whenFromConfig ||
    'Use quando quiser qualificar interesse com um resultado claro: o visitante responde no link público e recebe o diagnóstico no formato YLADA (motor institucional), não no fluxo antigo de Wellness.'

  const n = countQuestions(config)
  const mins =
    n > 0
      ? kind === 'calculator'
        ? Math.max(1, Math.ceil(n / 4))
        : Math.max(1, Math.ceil(n / 5))
      : kind === 'calculator'
        ? 1
        : 1

  const metaParts: string[] = []
  if (themeLabel) metaParts.push(themeLabel)
  metaParts.push(`~${mins} min`)
  if (n > 0) {
    metaParts.push(`${n} ${n === 1 ? 'pergunta' : 'perguntas'}`)
  } else {
    metaParts.push('Ferramenta')
  }
  const metaLine = metaParts.join(' · ')

  return {
    description,
    metaLine,
    whenToUse,
    segmentLabel,
    themeLabel,
    situationBucket: objectiveToBucket(meta.objective),
  }
}

function normalizeCatalogLabelKey(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, ' ')
}

function catalogItemHrefPath(href: string): string {
  const t = href.trim()
  if (t.startsWith('http://') || t.startsWith('https://')) {
    try {
      const u = new URL(t)
      const p = u.pathname.replace(/\/$/, '') || '/'
      return p.toLowerCase()
    } catch {
      return t.toLowerCase()
    }
  }
  const path = (t.startsWith('/') ? t : `/${t}`).replace(/\/$/, '') || '/'
  return path.toLowerCase()
}

function pickBetterCatalogItem(a: ProLideresCatalogItem, b: ProLideresCatalogItem): ProLideresCatalogItem {
  const score = (x: ProLideresCatalogItem) =>
    x.stats.views * 10_000 + x.stats.shares * 100 + x.stats.conversions
  const sa = score(a)
  const sb = score(b)
  if (sa !== sb) return sa > sb ? a : b
  if (a.origin !== b.origin) return a.origin === 'library' ? a : b
  if (a.source !== b.source) return a.source === 'ylada' ? a : b
  if (a.visibleToTeam !== b.visibleToTeam) return a.visibleToTeam ? a : b
  const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
  const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
  return tb >= ta ? b : a
}

/**
 * Remove duplicados: mesmo destino (caminho) no separador, depois mesmo título no separador.
 * Mantém a entrada com mais envolvimento (views/partilhas); em empate, preferência por link YLADA e mais recente.
 */
function dedupeProLideresCatalogItems(items: ProLideresCatalogItem[]): ProLideresCatalogItem[] {
  const pathOrder: string[] = []
  const byPath = new Map<string, ProLideresCatalogItem>()
  for (const item of items) {
    const key = `${item.origin}|${item.catalogCategory}|${catalogItemHrefPath(item.href)}`
    const prev = byPath.get(key)
    if (!prev) {
      byPath.set(key, item)
      pathOrder.push(key)
    } else {
      byPath.set(key, pickBetterCatalogItem(prev, item))
    }
  }
  const afterPath = pathOrder.map((k) => byPath.get(k)!)

  const labelOrder: string[] = []
  const byLabel = new Map<string, ProLideresCatalogItem>()
  for (const item of afterPath) {
    const key = `${item.origin}|${item.catalogCategory}|${normalizeCatalogLabelKey(item.label)}`
    const prev = byLabel.get(key)
    if (!prev) {
      byLabel.set(key, item)
      labelOrder.push(key)
    } else {
      byLabel.set(key, pickBetterCatalogItem(prev, item))
    }
  }
  return labelOrder.map((k) => byLabel.get(k)!)
}

function assignBadges(items: ProLideresCatalogItem[]): void {
  for (const origin of ['library', 'mine'] as const) {
    const ylada = items.filter((i) => i.source === 'ylada' && i.origin === origin)
    if (!ylada.length) continue

    const byViews = [...ylada].sort((a, b) => b.stats.views - a.stats.views)
    const topView = byViews[0]
    if (topView && topView.stats.views > 0) {
      topView.badge = 'most_used'
    }

    const byShares = [...ylada].sort((a, b) => b.stats.shares - a.stats.shares)
    const topShare = byShares[0]
    if (!topShare?.stats.shares) continue

    const usedId = ylada.find((x) => x.badge === 'most_used')?.id
    if (topShare.id !== usedId) {
      if (!topShare.badge) topShare.badge = 'most_shared'
    } else {
      const second = byShares.find((x) => x.id !== usedId && x.stats.shares > 0)
      if (second && !second.badge) second.badge = 'most_shared'
    }
  }
}

/**
 * Catálogo Pro Líderes: ferramentas YLADA (templates elegíveis) do dono do tenant,
 * mais entradas custom em leader_tenant_flow_entries (sales | recruitment). Duplicados são fundidos.
 */
export async function buildProLideresCatalog(
  ownerUserId: string,
  baseUrl: string,
  customRows: Array<{
    id: string
    label: string
    href: string
    sort_order: number
    category?: string
    notes?: string | null
    visible_to_team?: boolean
  }>,
  opts?: {
    /** Por `ylada_links.id`: false = equipe não vê (override em leader_tenant_catalog_ylada_visibility). */
    yladaVisibleToTeamByLinkId?: Record<string, boolean>
  }
): Promise<ProLideresCatalogItem[]> {
  const out: ProLideresCatalogItem[] = []

  if (supabaseAdmin) {
    await ensureProLideresPresetYladaLinks(ownerUserId)

    const { data: linksData, error } = await supabaseAdmin
      .from('ylada_links')
      .select('id, slug, title, template_id, status, created_at, config_json, segment, category, sub_category')
      .eq('user_id', ownerUserId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (!error && linksData?.length) {
      const templateIds = [...new Set(linksData.map((l) => l.template_id).filter(Boolean))] as string[]
      const templatesMap: Record<string, { type: string }> = {}
      if (templateIds.length) {
        const { data: tpl } = await supabaseAdmin.from('ylada_link_templates').select('id, type').in('id', templateIds)
        for (const t of tpl ?? []) {
          templatesMap[t.id as string] = { type: String(t.type) }
        }
      }

      const filtered = linksData.filter((row) => {
        const tid = row.template_id as string | null
        if (!tid) return false
        const ty = templatesMap[tid]?.type
        return ty ? YLADA_CATALOG_TEMPLATE_TYPES.has(ty) : false
      })

      const linkIds = filtered.map((l) => l.id as string)
      let statsMap: Record<string, { view: number; cta_click: number; share_click: number }> = {}
      if (linkIds.length) {
        try {
          const statsRes = await supabaseAdmin.rpc('get_ylada_link_stats', { link_ids: linkIds })
          if (Array.isArray(statsRes.data)) {
            statsMap = buildStatsMap(statsRes.data as EventRow[])
          }
        } catch {
          /* stats opcionais */
        }
      }

      const prefix = baseUrl.replace(/\/$/, '')
      for (const row of filtered) {
        const tid = row.template_id as string
        const ty = templatesMap[tid]?.type
        const kind: 'calculator' | 'quiz' = ty === 'calculator' ? 'calculator' : 'quiz'
        const path = `/l/${row.slug as string}`
        const publicUrl = prefix ? `${prefix}${path}` : path
        const st = statsMap[row.id as string] ?? { view: 0, cta_click: 0, share_click: 0 }
        const label = ((row.title as string)?.trim() || (row.slug as string) || 'Link YLADA') as string
        const enriched = parseConfigJson(row.config_json, (row.segment as string) ?? null, label, kind)
        const catalogCategory = inferYladaCatalogCategory(
          {
            category: row.category as string | null,
            sub_category: row.sub_category as string | null,
            segment: row.segment as string | null,
            title: label,
            slug: (row.slug as string) ?? '',
          },
          row.config_json
        )
        const slugStr = (row.slug as string) ?? ''
        const origin: ProLideresCatalogOrigin = isProLideresPresetLink(ownerUserId, slugStr) ? 'library' : 'mine'
        const linkRowId = row.id as string
        const yladaVis = opts?.yladaVisibleToTeamByLinkId?.[linkRowId]
        const visibleToTeam = yladaVis === undefined ? true : Boolean(yladaVis)

        out.push({
          id: `ylada-${row.id}`,
          label,
          href: path,
          publicUrl,
          source: 'ylada',
          kind,
          origin,
          catalogCategory,
          visibleToTeam,
          stats: { views: st.view, conversions: st.cta_click, shares: st.share_click },
          yladaLinkId: row.id as string,
          description: enriched.description,
          metaLine: enriched.metaLine,
          whenToUse: enriched.whenToUse,
          segmentLabel: enriched.segmentLabel,
          themeLabel: enriched.themeLabel,
          situationBucket: enriched.situationBucket,
          createdAt: (row.created_at as string) ?? null,
          badge: null,
        })
      }
    }
  }

  const customs = customRows
    .filter((r) => {
      const c = String(r.href ?? '').toLowerCase()
      return c.startsWith('/') || c.startsWith('http://') || c.startsWith('https://')
    })
    .sort((a, b) => a.sort_order - b.sort_order)

  const customFallbackWhen =
    'Entrada extra no catálogo. Os links principais vêm de Meus links ou do Noel; podes remover esta linha se já não precisares.'

  for (const r of customs) {
    const href = r.href.trim()
    const k = inferCustomKind(href)
    const label = r.label.trim()
    const catalogKind = inferProLideresFlowCatalogKindFromHref(r.href)
    const catalogCategory: ProLideresCatalogCategory =
      r.category === 'recruitment' ? 'recruitment' : 'sales'
    const rawNotes = typeof r.notes === 'string' ? r.notes.trim() : ''
    const visibleToTeam = r.visible_to_team !== false
    const diagnosisMeta = 'Diagnóstico YLADA · 3 níveis (leve / moderado / urgente)'
    const metaLine =
      catalogKind === 'ylada_diagnosis'
        ? diagnosisMeta
        : k === 'calculator'
          ? `Ferramenta · ~1 min`
          : rawNotes
            ? `${rawNotes.slice(0, 40)}${rawNotes.length > 40 ? '…' : ''}`
            : `${label.slice(0, 24)}${label.length > 24 ? '…' : ''} · extra`

    const whenToUse =
      catalogKind === 'ylada_diagnosis'
        ? `Resultado em três faixas (leve, moderado, urgente), gerido pela YLADA. ${rawNotes ? rawNotes : customFallbackWhen}`
        : rawNotes || customFallbackWhen

    out.push({
      id: r.id,
      label,
      href,
      publicUrl: normalizePublicUrl(baseUrl, href),
      source: 'custom',
      kind: k,
      origin: 'mine',
      catalogCategory,
      visibleToTeam,
      stats: { views: 0, conversions: 0, shares: 0 },
      description: null,
      metaLine,
      whenToUse,
      customFlowNotes: rawNotes,
      customCatalogKind: catalogKind,
      segmentLabel: null,
      themeLabel: null,
      situationBucket: 'all',
      createdAt: null,
      badge: null,
    })
  }

  const deduped = dedupeProLideresCatalogItems(out)
  assignBadges(deduped)
  return deduped
}
