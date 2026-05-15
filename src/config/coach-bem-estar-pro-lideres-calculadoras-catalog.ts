/**
 * Catálogo de calculadoras para o hub Coach de bem-estar (`/pt/coach-bem-estar/links`).
 *
 * Fonte: **apenas leitura** dos mesmos fluxos preset que o Pro Líderes usa em `ensureProLideresPresetYladaLinks`
 * (`getProLideresWellnessCalculadorasBasicasPresetFluxos` + `getProLideresHypeCalculadoraPresetFluxos`).
 * Nenhum ficheiro em `src/lib/pro-lideres/` é alterado aqui.
 */
import { getProLideresWellnessCalculadorasBasicasPresetFluxos } from '@/lib/pro-lideres/pro-lideres-wellness-calculadoras-basicas-preset-fluxos'
import {
  getProLideresHypeCalculadoraPresetFluxos,
  HYPE_CALCULADORA_PRESET_FLUXO_IDS,
} from '@/lib/pro-lideres/pro-lideres-hype-calculadora-preset-fluxos'
import type { FluxoCliente } from '@/types/wellness-system'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'

export function getCoachBemEstarCalculadorasEspelhoProLideres(): FluxoCliente[] {
  return [
    ...getProLideresWellnessCalculadorasBasicasPresetFluxos(),
    ...getProLideresHypeCalculadoraPresetFluxos(),
  ]
}

const HYPE_CALC_SLUGS = new Set<string>(HYPE_CALCULADORA_PRESET_FLUXO_IDS as unknown as string[])

export function isHypeCalculadoraFluxoProLideres(fluxoId: string): boolean {
  const id = normalizeTemplateSlug(fluxoId) || fluxoId
  return HYPE_CALC_SLUGS.has(id)
}

/** Página pública de modelo (sem slug do profissional). */
export function coachBemEstarCatalogUrlParaFluxoProLideres(fluxoId: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '')
  const id = normalizeTemplateSlug(fluxoId) || fluxoId

  if (HYPE_CALC_SLUGS.has(id)) {
    return `${base}/pt/wellness/templates/hype-drink/${id}`
  }

  const wellnessTemplatePath: Record<string, string> = {
    'calc-hidratacao': '/pt/wellness/templates/hidratacao',
    'calc-calorias': '/pt/wellness/templates/calorias',
    'calc-proteina': '/pt/wellness/templates/proteina',
  }

  const path = wellnessTemplatePath[id]
  if (path) return `${base}${path}`

  return `${base}/pt/wellness/ferramentas/nova?template=${encodeURIComponent(id)}`
}
