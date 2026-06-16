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
import type { FluxoCliente } from '@/types/ylada-flow-legacy'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'

/** FluxoCliente para a Calculadora de IMC (template `calc-imc`). */
function fluxoCalculadoraIMC(): FluxoCliente {
  return {
    id: 'calc-imc',
    nome: 'Calculadora de IMC',
    objetivo:
      'Calcula o Índice de Massa Corporal a partir de peso, altura, idade e gênero — abre conversa sobre saúde e bem-estar no WhatsApp.',
    perguntas: [
      { id: 'p1', texto: 'Idade *', tipo: 'numero', placeholder: 'Ex: 30', min: 1, max: 120, step: 1 },
      { id: 'p2', texto: 'Gênero *', tipo: 'multipla_escolha', opcoes: ['Masculino', 'Feminino'] },
      { id: 'p3', texto: 'Peso (kg) *', tipo: 'numero', placeholder: 'Ex: 70.5', min: 1, max: 300, step: 0.1 },
      { id: 'p4', texto: 'Altura (cm) *', tipo: 'numero', placeholder: 'Ex: 175', min: 50, max: 250, step: 0.5 },
    ],
    diagnostico: {
      titulo: 'Seu IMC',
      descricao: 'Com peso e altura calculamos o IMC e abrimos uma conversa personalizada sobre saúde.',
      sintomas: ['Dúvida sobre peso saudável', 'Interesse em medir progresso'],
      beneficios: ['Resultado imediato', 'Conversa direta no WhatsApp'],
      mensagemPositiva: 'Pequenas mudanças diárias fazem grande diferença no bem-estar.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero falar no WhatsApp',
    tags: ['wellness', 'calculadora', 'imc'],
  }
}

export function getCoachBemEstarCalculadorasEspelhoProLideres(): FluxoCliente[] {
  return [
    fluxoCalculadoraIMC(),
    ...getProLideresWellnessCalculadorasBasicasPresetFluxos(),
    ...getProLideresHypeCalculadoraPresetFluxos(),
  ]
}

const HYPE_CALC_SLUGS = new Set<string>(HYPE_CALCULADORA_PRESET_FLUXO_IDS as unknown as string[])

export function isHypeCalculadoraFluxoProLideres(fluxoId: string): boolean {
  const id = normalizeTemplateSlug(fluxoId) || fluxoId
  return HYPE_CALC_SLUGS.has(id)
}

/** Página pública de modelo (sem slug do profissional) — sempre na área Coach de bem-estar. */
export function coachBemEstarCatalogUrlParaFluxoProLideres(fluxoId: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '')
  const id = normalizeTemplateSlug(fluxoId) || fluxoId

  if (HYPE_CALC_SLUGS.has(id)) {
    return `${base}/pt/coach-bem-estar/links/novo?template=${encodeURIComponent(id)}`
  }

  const calculadorasBasicas = new Set([
    'calc-imc',
    'calc-hidratacao',
    'calc-calorias',
    'calc-proteina',
    'hidratacao',
    'agua',
  ])
  if (calculadorasBasicas.has(id)) {
    return `${base}/pt/coach-bem-estar/links/novo?template=${encodeURIComponent(id)}`
  }

  return `${base}/pt/coach-bem-estar/links/novo?template=${encodeURIComponent(id)}`
}
