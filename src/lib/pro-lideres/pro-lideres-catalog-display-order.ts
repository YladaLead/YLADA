type ProLideresCatalogCategory = 'sales' | 'recruitment'

type SortableCatalogItem = {
  href: string
  label: string
  catalogCategory: ProLideresCatalogCategory
  origin: 'library' | 'mine'
  stats: { views: number }
  createdAt: string | null
  presetFluxoId?: string | null
}

/**
 * Ordem de exibição no catálogo Pro Líderes (Vendas / Recrutamento).
 * Itens fora da lista ficam depois, ordenados por views (mais usados primeiro).
 */

/** Vendas: calculadoras básicas → avaliações mais usadas → demais presets. */
export const PRO_LIDERES_SALES_CATALOG_FLUXO_ORDER: readonly string[] = [
  'calc-hidratacao',
  'agua',
  'calc-proteina',
  'calc-calorias',
  'avaliacao-sindrome-metabolica',
  'sindrome-metabolica',
  'avaliacao-sensibilidades',
  'avaliacao-fome-emocional',
  'avaliacao-emagrecimento-consciente',
  'calc-imc',
  'avaliacao-perfil-metabolico',
  'energia-foco',
  'pre-treino',
  'pos-treino',
  'consumo-cafeina',
  'custo-energia',
]

/** Recrutamento: quizzes temáticos (mais usados) → fluxos clássicos frequentes. */
export const PRO_LIDERES_RECRUITMENT_CATALOG_FLUXO_ORDER: readonly string[] = [
  'quiz-recrut-ganhos-prosperidade',
  'quiz-recrut-proposito-equilibrio',
  'quiz-recrut-potencial-crescimento',
  'renda-extra-imediata',
  'transformar-consumo-renda',
  'maes-trabalhar-casa',
  'ja-consome-bem-estar',
  'perderam-emprego-transicao',
  'cansadas-trabalho-atual',
  'trabalhar-apenas-links',
  'ja-usa-energia-acelera',
  'ja-tentaram-outros-negocios',
  'querem-trabalhar-digital',
  'ja-empreendem',
  'querem-emagrecer-renda',
  'boas-venda-comercial',
  'jovens-empreendedores',
]

export function extractProLideresPresetFluxoIdFromSlug(slug: string): string | null {
  const m = slug.trim().match(/^pl-[a-f0-9]{12}-(?:v|r)-(.+)$/i)
  return m?.[1] ?? null
}

function fluxoOrderIndex(fluxoId: string | null, category: ProLideresCatalogCategory): number {
  if (!fluxoId) return -1
  const list =
    category === 'recruitment'
      ? PRO_LIDERES_RECRUITMENT_CATALOG_FLUXO_ORDER
      : PRO_LIDERES_SALES_CATALOG_FLUXO_ORDER
  const idx = list.indexOf(fluxoId as (typeof list)[number])
  return idx
}

function resolvePresetFluxoId(item: SortableCatalogItem): string | null {
  if (item.presetFluxoId) return item.presetFluxoId
  const slug = item.href.replace(/^\/l\//, '').split('?')[0]?.trim() ?? ''
  return extractProLideresPresetFluxoIdFromSlug(slug)
}

/** Ordena o catálogo completo (UI filtra por separador depois). */
export function sortProLideresCatalogForDisplay<T extends SortableCatalogItem>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const fluxoA = resolvePresetFluxoId(a)
    const fluxoB = resolvePresetFluxoId(b)
    const idxA = fluxoOrderIndex(fluxoA, a.catalogCategory)
    const idxB = fluxoOrderIndex(fluxoB, b.catalogCategory)

    const tierA = idxA >= 0 ? 0 : a.origin === 'library' ? 1 : 2
    const tierB = idxB >= 0 ? 0 : b.origin === 'library' ? 1 : 2
    if (tierA !== tierB) return tierA - tierB

    if (tierA === 0 && idxA !== idxB) return idxA - idxB

    if (tierA === 1) {
      const viewsDiff = b.stats.views - a.stats.views
      if (viewsDiff !== 0) return viewsDiff
    }

    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
    if (tb !== ta) return tb - ta

    return a.label.localeCompare(b.label, 'pt-BR')
  })
}
