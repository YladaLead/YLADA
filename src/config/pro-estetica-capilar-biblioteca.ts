/**
 * Pro Estética Capilar — biblioteca (`subscope=estetica_capilar`):
 * **lista fechada por `template_id`**: quizzes capilares (migration **284**).
 */

import {
  type IdeiaRapidaNoel,
  type BibliotecaSegmentCode,
  IDEIAS_RAPIDAS_ESTETICA_CAPILAR,
} from '@/config/ylada-biblioteca'
import {
  type BibliotecaItemSegmentFilter,
  dedupeBibliotecaItensEsteticaCorporal,
} from '@/config/pro-estetica-corporal-biblioteca'

export const SUGESTAO_NOEL_TEMAS_ESTETICA_CAPILAR: string[] = ['cabelo', 'habitos']

export function getIdeiaRapidaDoDiaEsteticaCapilar(): IdeiaRapidaNoel {
  const arr = IDEIAS_RAPIDAS_ESTETICA_CAPILAR
  const idx = Math.floor(Date.now() / 86400000) % arr.length
  return arr[idx]!
}

export const SEGMENT_CODES_BIBLIOTECA_ESTETICA_CAPILAR = ['aesthetics'] as const

export const TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CAPILAR_PERMITIDOS = new Set([
  'b1000103-0103-4000-8000-000000000103',
  'b1000104-0104-4000-8000-000000000104',
  'b1000105-0105-4000-8000-000000000105',
  'b1000106-0106-4000-8000-000000000106',
  'b1000107-0107-4000-8000-000000000107',
])

export function itemBibliotecaEsteticaCapilar(item: BibliotecaItemSegmentFilter): boolean {
  const tid = String(item.template_id ?? '').trim()
  return tid.length > 0 && TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CAPILAR_PERMITIDOS.has(tid)
}

export function filtrarBibliotecaItensEsteticaCapilar<T extends BibliotecaItemSegmentFilter>(
  items: T[],
): T[] {
  return items.filter(itemBibliotecaEsteticaCapilar)
}

export const TEMPLATE_IDS_ORDEM_DESTAQUE_ESTETICA_CAPILAR = [
  'b1000103-0103-4000-8000-000000000103',
  'b1000104-0104-4000-8000-000000000104',
  'b1000105-0105-4000-8000-000000000105',
  'b1000106-0106-4000-8000-000000000106',
  'b1000107-0107-4000-8000-000000000107',
] as const

export function ordenarItemsEsteticaCapilar<T extends { id: string; template_id?: string | null }>(
  items: T[],
): T[] {
  const used = new Set<string>()
  const out: T[] = []
  for (const tid of TEMPLATE_IDS_ORDEM_DESTAQUE_ESTETICA_CAPILAR) {
    const found = items.find((i) => (i.template_id || '') === tid)
    if (found) {
      out.push(found)
      used.add(found.id)
    }
  }
  for (const i of items) {
    if (!used.has(i.id)) out.push(i)
  }
  return out
}

export function dedupeBibliotecaItensEsteticaCapilar<
  T extends { id: string; tema: string; titulo: string; template_id?: string | null },
>(items: T[], segmentCode: BibliotecaSegmentCode): T[] {
  return dedupeBibliotecaItensEsteticaCorporal(items, segmentCode)
}
