/**
 * Pro Estética Corporal — biblioteca (`subscope=estetica_corporal`):
 * **lista fechada por `template_id`**: calculadoras + quizzes corporais (migrations 236, 242, 293, 308, **333**).
 * Tópicos prontos + links que a pessoa cria continuam noutras áreas da UI; aqui só estes itens globais passam no filtro.
 */

import type { IdeiaRapidaNoel } from '@/config/ylada-biblioteca'
import {
  IDEIAS_RAPIDAS_ESTETICA_CORPORAIS,
  getTituloAdaptado,
  type BibliotecaSegmentCode,
} from '@/config/ylada-biblioteca'

/** Temas só para referência em sugestões noutros contextos (painel corporal usa lista fechada por template). */
export const SUGESTAO_NOEL_TEMAS_ESTETICA_CORPORAL: string[] = [
  'pele',
  'celulite',
  'flacidez',
  'peso_gordura',
  'inchaço_retencao',
  'hidratacao',
  'habitos',
]

export function getIdeiaRapidaDoDiaEsteticaCorporal(): IdeiaRapidaNoel {
  const arr = IDEIAS_RAPIDAS_ESTETICA_CORPORAIS
  const idx = Math.floor(Date.now() / 86400000) % arr.length
  return arr[idx]!
}

/** Segmentos na query da API (overlap amplo); o corte é `TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CORPORAL_PERMITIDOS`. */
export const SEGMENT_CODES_BIBLIOTECA_ESTETICA_CORPORAL = ['aesthetics', 'nutrition', 'fitness'] as const

/**
 * Únicos itens da biblioteca YLADA mostrados no painel Pro Estética Corporal.
 * Inclui migration **333** (drenagem vs tecnologia, tecnologia-alvo, expectativa de sessões, camadas, agenda, retenção/hábitos).
 */
export const TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CORPORAL_PERMITIDOS = new Set([
  'b1000026-0026-4000-8000-000000000026',
  'b1000025-0025-4000-8000-000000000025',
  'b1000028-0028-4000-8000-000000000028',
  'b1000027-0027-4000-8000-000000000027',
  'b1000031-0031-4000-8000-000000000031',
  'b1000044-0044-4000-8000-000000000044',
  'b1000038-0038-4000-8000-000000000038',
  'b1000048-0048-4000-8000-000000000048',
  'b1000046-0046-4000-8000-000000000046',
  'b1000050-0050-4000-8000-000000000050',
  'b1000119-0119-4000-8000-000000000119',
  'b1000120-0120-4000-8000-000000000120',
  'b1000121-0121-4000-8000-000000000121',
  'b1000122-0122-4000-8000-000000000122',
  'b1000123-0123-4000-8000-000000000123',
  'b1000124-0124-4000-8000-000000000124',
  'b1000125-0125-4000-8000-000000000125',
  'b1000126-0126-4000-8000-000000000126',
])

export type BibliotecaItemSegmentFilter = {
  tema?: string | null
  segment_codes?: string[] | null
  tipo?: string | null
  template_id?: string | null
}

export function itemBibliotecaEsteticaCorporal(item: BibliotecaItemSegmentFilter): boolean {
  const tid = String(item.template_id ?? '').trim()
  return tid.length > 0 && TEMPLATE_IDS_BIBLIOTECA_ESTETICA_CORPORAL_PERMITIDOS.has(tid)
}

export function filtrarBibliotecaItensEsteticaCorporal<T extends BibliotecaItemSegmentFilter>(
  items: T[],
): T[] {
  return items.filter(itemBibliotecaEsteticaCorporal)
}

/** Ordem no topo: calculadoras → conteúdo estratégico (333) → demais quizzes. */
export const TEMPLATE_IDS_ORDEM_DESTAQUE_ESTETICA_CORPORAL = [
  'b1000026-0026-4000-8000-000000000026',
  'b1000025-0025-4000-8000-000000000025',
  'b1000028-0028-4000-8000-000000000028',
  'b1000027-0027-4000-8000-000000000027',
  'b1000031-0031-4000-8000-000000000031',
  'b1000123-0123-4000-8000-000000000123',
  'b1000121-0121-4000-8000-000000000121',
  'b1000122-0122-4000-8000-000000000122',
  'b1000124-0124-4000-8000-000000000124',
  'b1000125-0125-4000-8000-000000000125',
  'b1000126-0126-4000-8000-000000000126',
  'b1000044-0044-4000-8000-000000000044',
  'b1000038-0038-4000-8000-000000000038',
  'b1000048-0048-4000-8000-000000000048',
  'b1000046-0046-4000-8000-000000000046',
  'b1000050-0050-4000-8000-000000000050',
  'b1000119-0119-4000-8000-000000000119',
  'b1000120-0120-4000-8000-000000000120',
] as const

/** Chave estável para agrupar o mesmo título que aparece no cartão (adaptado + base). */
export function tituloExibidoBibliotecaCorporalKey(
  item: { tema: string; titulo: string },
  segmentCode: BibliotecaSegmentCode,
): string {
  const display = (getTituloAdaptado(item.tema, segmentCode) || item.titulo || '').trim()
  const key = display
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[?.!,:;'"()[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return key.length > 0 ? key : item.tema + '|' + item.id
}

/**
 * Um fluxo por título exibido (igual ao do cartão). Ignora `template_id` — duas linhas com o mesmo
 * texto visível ficam só com a primeira na ordem recebida (ordenar antes para priorizar destaques).
 */
export function dedupeBibliotecaItensEsteticaCorporal<
  T extends { id: string; tema: string; titulo: string; template_id?: string | null },
>(items: T[], segmentCode: BibliotecaSegmentCode): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const it of items) {
    const key = tituloExibidoBibliotecaCorporalKey(it, segmentCode)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(it)
  }
  return out
}

export function ordenarItemsEsteticaCorporal<T extends { id: string; template_id?: string | null }>(
  items: T[],
): T[] {
  const used = new Set<string>()
  const out: T[] = []
  for (const tid of TEMPLATE_IDS_ORDEM_DESTAQUE_ESTETICA_CORPORAL) {
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
