/**
 * Biblioteca Estética (/pt/estetica/links): filtro **Terapia capilar** | **Estética corporal** | Todos (nomenclatura BR).
 * URL: `?linha=terapia-capilar` ou `?linha=estetica-corporal`. Aceita ainda `capilar`, `corporal` e o legado `?terapia=`.
 */

import type { BibliotecaSegmentCode } from '@/config/ylada-biblioteca'
import {
  dedupeBibliotecaItensEsteticaCorporal,
  itemBibliotecaEsteticaCorporal,
} from '@/config/pro-estetica-corporal-biblioteca'

/** Query preferida na URL; `terapia` é só retrocompatibilidade. */
export const ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY = 'linha' as const
export const ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY_LEGACY = 'terapia' as const

/** Slugs na URL alinhados ao que o mercado brasileiro costuma dizer. */
export const ESTETICA_LINHA_URL_TERAPIA_CAPILAR = 'terapia-capilar' as const
export const ESTETICA_LINHA_URL_ESTETICA_CORPORAL = 'estetica-corporal' as const

export type EsteticaTerapiaLinha = 'todos' | 'capilar' | 'corporal'

const CORPORAL_TEMAS = new Set(['celulite', 'flacidez', 'gordura_localizada', 'peso_gordura'])

/** Quizzes/calculadoras corporais com tema genérico no banco (incl. migration 333). */
const CORPORAL_TEMPLATE_IDS_EXTRAS = new Set([
  'b1000119-0119-4000-8000-000000000119',
  'b1000120-0120-4000-8000-000000000120',
  'b1000121-0121-4000-8000-000000000121',
  'b1000122-0122-4000-8000-000000000122',
  'b1000123-0123-4000-8000-000000000123',
  'b1000124-0124-4000-8000-000000000124',
  'b1000125-0125-4000-8000-000000000125',
  'b1000126-0126-4000-8000-000000000126',
  'b1000127-0127-4000-8000-000000000127',
])

export function parseEsteticaTerapiaLinhaParam(raw: string | null | undefined): EsteticaTerapiaLinha {
  const v = (raw || '').trim().toLowerCase().replace(/_/g, '-')
  if (v === 'capilar' || v === ESTETICA_LINHA_URL_TERAPIA_CAPILAR || v === 'terapiacapilar') return 'capilar'
  if (v === 'corporal' || v === ESTETICA_LINHA_URL_ESTETICA_CORPORAL || v === 'esteticacorporal') return 'corporal'
  return 'todos'
}

/** Valor do query param `linha` para gravar na URL (null = sem filtro). */
export function esteticaLinhaToQueryValue(linha: EsteticaTerapiaLinha): string | null {
  if (linha === 'todos') return null
  if (linha === 'capilar') return ESTETICA_LINHA_URL_TERAPIA_CAPILAR
  return ESTETICA_LINHA_URL_ESTETICA_CORPORAL
}

/** Lê `linha` ou, em fallback, `terapia` (URLs antigas). */
export function rawEsteticaBibliotecaLinhaFromSearchParams(searchParams: {
  get: (key: string) => string | null
}): string | null {
  return searchParams.get(ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY) ?? searchParams.get(ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY_LEGACY)
}

/** Redirecionamento pós-login estética: preserva filtro na área de links (`?linha=`). */
export function buildEsteticaLinksPathWithTerapia(linha: EsteticaTerapiaLinha): string {
  const qv = esteticaLinhaToQueryValue(linha)
  if (!qv) return '/pt/estetica/links'
  return `/pt/estetica/links?${ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY}=${encodeURIComponent(qv)}`
}

export function buildEsteticaLinksRedirectWithTerapia(terapiaRaw: string | null | undefined): string {
  return buildEsteticaLinksPathWithTerapia(parseEsteticaTerapiaLinhaParam(terapiaRaw))
}

export function itemMatchesTerapiaCapilar(item: { tema: string }): boolean {
  return item.tema === 'cabelo'
}

export function itemMatchesTerapiaCorporal(item: {
  tema: string
  template_id?: string | null
}): boolean {
  if (itemBibliotecaEsteticaCorporal(item)) return true
  const tid = String(item.template_id ?? '').trim()
  if (CORPORAL_TEMPLATE_IDS_EXTRAS.has(tid)) return true
  return CORPORAL_TEMAS.has(item.tema)
}

export function filterBibliotecaItemsByEsteticaTerapiaLinha<
  T extends { tema: string; template_id?: string | null },
>(items: T[], linha: EsteticaTerapiaLinha): T[] {
  if (linha === 'todos') return items
  if (linha === 'capilar') return items.filter(itemMatchesTerapiaCapilar)
  return items.filter(itemMatchesTerapiaCorporal)
}

/** Um card por título exibido (mesma regra do painel corporal, segmento aesthetics). */
export function dedupeEsteticaBibliotecaPorTitulo<
  T extends { id: string; tema: string; titulo: string; template_id?: string | null },
>(items: T[]): T[] {
  return dedupeBibliotecaItensEsteticaCorporal(items, 'aesthetics' as BibliotecaSegmentCode)
}
