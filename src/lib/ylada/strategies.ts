/**
 * Regra de decisão: objetivo + área → 2 estratégias (qualidade + volume).
 * Respeita a Camada 0 (Interpretador Estratégico): temas sensíveis (ex.: medicamento)
 * restringem arquiteturas permitidas (ex.: não mostrar RISK_DIAGNOSIS).
 * @see docs/CHECKLIST-LINKS-INTELIGENTES-ETAPAS.md (Etapa 2)
 * @see docs/ANALISE-PROMPT-CAMADA-DECISAO-SERGIO.md
 */

import { FLOW_IDS, getFlowById, YLADA_FLOW_CATALOG, type FlowId } from '@/config/ylada-flow-catalog'
import { interpretStrategyContext } from './strategic-interpreter'

export type LinkObjective = 'captar' | 'educar' | 'reter' | 'propagar' | 'indicar'

/** Área normalizada para a tabela de decisão. */
export type AreaSegment =
  | 'saude'
  | 'profissional_liberal'
  | 'vendas'
  | 'wellness'
  | 'geral'

/** Entrada: interpretação (objetivo + área + tema opcional). */
export interface StrategiesInput {
  objetivo: LinkObjective
  area_profissional: string
  tema?: string
  /** Para wellness: distingue consumidor (risco+perfil) vs parceiro (checklist+calculadora). */
  tipo_publico?: string
}

/** Card de estratégia para a UI (1 card quando só 1 arquitetura permitida; 2 cards caso contrário). */
export type StrategyCard = {
  slot: 'single' | 'qualidade' | 'volume'
  architecture: string
  flow_id: string
  title: string
  subtitle?: string
  description?: string
}

export interface StrategiesOutput {
  qualityFlowId: FlowId
  volumeFlowId: FlowId
  /** Lista para a UI: 1 card (slot single) quando só BLOCKER permitido; 2 cards (qualidade + volume) caso contrário. */
  strategyCards: StrategyCard[]
}

const FALLBACK_QUALITY: FlowId = FLOW_IDS.checklist_prontidao
const FALLBACK_VOLUME: FlowId = FLOW_IDS.perfil_comportamental

/** Normaliza area_profissional (string do interpret) para segmento da tabela. */
function normalizeArea(area_profissional: string): AreaSegment {
  const a = area_profissional.toLowerCase().trim()
  if (
    /medico|médico|nutri|nutricionista|dentista|psicolog|odont|fisio|enferm|saude|saúde/.test(a)
  )
    return 'saude'
  if (/coach|consultor|advogado|liberal/.test(a)) return 'profissional_liberal'
  if (/venda|vendedor|representante|comercial/.test(a)) return 'vendas'
  if (/wellness|multi|mlm/.test(a)) return 'wellness'
  return 'geral'
}

/** Wellness: parceiro = indicados/parceiros/equipe; consumidor = pacientes/clientes/leads. */
function isWellnessParceiro(tipo_publico?: string): boolean {
  if (!tipo_publico) return false
  const t = tipo_publico.toLowerCase()
  return /parceiro|indicado|equipe|rede|time/.test(t)
}

/**
 * Retorna os 2 IDs de fluxo (qualidade + volume) para a interpretação.
 * Sempre 2 IDs válidos do catálogo; fallback = [checklist_prontidao, perfil_comportamental].
 * Aplica Camada 0: se o tema for sensível (ex.: medicamento) e objetivo captar,
 * allowed_architectures pode restringir a BLOCKER_DIAGNOSIS — aí ajustamos os IDs retornados.
 */
export function getStrategies(input: StrategiesInput): StrategiesOutput {
  const area = normalizeArea(input.area_profissional)
  const objetivo = input.objetivo
  const wellnessParceiro = area === 'wellness' && isWellnessParceiro(input.tipo_publico)

  let qualityFlowId: FlowId
  let volumeFlowId: FlowId

  // Saúde: captar → risco + bloqueio; educar/reter → checklist + perfil
  if (area === 'saude') {
    if (objetivo === 'captar') {
      qualityFlowId = FLOW_IDS.diagnostico_risco
      volumeFlowId = FLOW_IDS.diagnostico_bloqueio
    } else if (objetivo === 'educar' || objetivo === 'reter') {
      const q = getFlowById(FLOW_IDS.checklist_prontidao)
      const v = getFlowById(FLOW_IDS.perfil_comportamental)
      return {
        qualityFlowId: FLOW_IDS.checklist_prontidao,
        volumeFlowId: FLOW_IDS.perfil_comportamental,
        strategyCards: [
          { slot: 'qualidade', architecture: q?.architecture ?? '', flow_id: FLOW_IDS.checklist_prontidao, title: q?.display_name ?? 'Checklist', subtitle: 'Qualidade', description: q?.impact_line },
          { slot: 'volume', architecture: v?.architecture ?? '', flow_id: FLOW_IDS.perfil_comportamental, title: v?.display_name ?? 'Perfil', subtitle: 'Volume', description: v?.impact_line },
        ],
      }
    } else {
      qualityFlowId = FALLBACK_QUALITY
      volumeFlowId = FALLBACK_VOLUME
    }
  } else if (area === 'profissional_liberal') {
    if (objetivo === 'captar') {
      const q = getFlowById(FLOW_IDS.checklist_prontidao)
      const v = getFlowById(FLOW_IDS.perfil_comportamental)
      return {
        qualityFlowId: FLOW_IDS.checklist_prontidao,
        volumeFlowId: FLOW_IDS.perfil_comportamental,
        strategyCards: [
          { slot: 'qualidade', architecture: q?.architecture ?? '', flow_id: FLOW_IDS.checklist_prontidao, title: q?.display_name ?? 'Checklist', subtitle: 'Qualidade', description: q?.impact_line },
          { slot: 'volume', architecture: v?.architecture ?? '', flow_id: FLOW_IDS.perfil_comportamental, title: v?.display_name ?? 'Perfil', subtitle: 'Volume', description: v?.impact_line },
        ],
      }
    }
    qualityFlowId = FALLBACK_QUALITY
    volumeFlowId = FALLBACK_VOLUME
  } else if (area === 'vendas') {
    if (objetivo === 'captar') {
      const q = getFlowById(FLOW_IDS.checklist_prontidao)
      const v = getFlowById(FLOW_IDS.calculadora_projecao)
      return {
        qualityFlowId: FLOW_IDS.checklist_prontidao,
        volumeFlowId: FLOW_IDS.calculadora_projecao,
        strategyCards: [
          { slot: 'qualidade', architecture: q?.architecture ?? '', flow_id: FLOW_IDS.checklist_prontidao, title: q?.display_name ?? 'Checklist', subtitle: 'Qualidade', description: q?.impact_line },
          { slot: 'volume', architecture: v?.architecture ?? '', flow_id: FLOW_IDS.calculadora_projecao, title: v?.display_name ?? 'Calculadora', subtitle: 'Volume', description: v?.impact_line },
        ],
      }
    }
    qualityFlowId = FALLBACK_QUALITY
    volumeFlowId = FALLBACK_VOLUME
  } else if (area === 'wellness') {
    if (objetivo === 'captar') {
      if (wellnessParceiro) {
        const q = getFlowById(FLOW_IDS.checklist_prontidao)
        const v = getFlowById(FLOW_IDS.calculadora_projecao)
        return {
          qualityFlowId: FLOW_IDS.checklist_prontidao,
          volumeFlowId: FLOW_IDS.calculadora_projecao,
          strategyCards: [
            { slot: 'qualidade', architecture: q?.architecture ?? '', flow_id: FLOW_IDS.checklist_prontidao, title: q?.display_name ?? 'Checklist', subtitle: 'Qualidade', description: q?.impact_line },
            { slot: 'volume', architecture: v?.architecture ?? '', flow_id: FLOW_IDS.calculadora_projecao, title: v?.display_name ?? 'Calculadora', subtitle: 'Volume', description: v?.impact_line },
          ],
        }
      }
      qualityFlowId = FLOW_IDS.diagnostico_risco
      volumeFlowId = FLOW_IDS.perfil_comportamental
    } else {
      qualityFlowId = FALLBACK_QUALITY
      volumeFlowId = FALLBACK_VOLUME
    }
  } else {
    qualityFlowId = FALLBACK_QUALITY
    volumeFlowId = FALLBACK_VOLUME
  }

  // Camada 0: filtrar por allowed_architectures (ex.: tema sensível → só BLOCKER)
  const decision = interpretStrategyContext({
    objective: objetivo,
    theme_raw: input.tema ?? '',
    area_profissional: input.area_profissional,
  })
  const allowedSet = new Set(decision.allowed_architectures)
  const firstAllowedFlowId =
    YLADA_FLOW_CATALOG.find((f) => allowedSet.has(f.architecture))?.id ?? FLOW_IDS.diagnostico_bloqueio

  const qFlow = getFlowById(qualityFlowId)
  const vFlow = getFlowById(volumeFlowId)
  const qualityAllowed = qFlow && allowedSet.has(qFlow.architecture)
  const volumeAllowed = vFlow && allowedSet.has(vFlow.architecture)

  const finalQualityId = qualityAllowed ? qualityFlowId : firstAllowedFlowId
  const finalVolumeId = volumeAllowed ? volumeFlowId : firstAllowedFlowId

  // UX: quando só 1 arquitetura é permitida, retornar 1 card (slot single) para não mostrar dois iguais
  const strategyCards: StrategyCard[] =
    decision.allowed_architectures.length === 1
      ? [
          {
            slot: 'single',
            architecture: 'BLOCKER_DIAGNOSIS',
            flow_id: firstAllowedFlowId,
            title: 'Raio-X de Estratégia',
            subtitle: 'Recomendado',
            description:
              'Foco em agenda, posicionamento e conversão — para transformar interesse em consultas.',
          },
        ]
      : [
          {
            slot: 'qualidade',
            architecture: getFlowById(finalQualityId)?.architecture ?? 'RISK_DIAGNOSIS',
            flow_id: finalQualityId,
            title: getFlowById(finalQualityId)?.display_name ?? 'Qualidade',
            subtitle: 'Qualidade',
            description: getFlowById(finalQualityId)?.impact_line,
          },
          {
            slot: 'volume',
            architecture: getFlowById(finalVolumeId)?.architecture ?? 'BLOCKER_DIAGNOSIS',
            flow_id: finalVolumeId,
            title: getFlowById(finalVolumeId)?.display_name ?? 'Volume',
            subtitle: 'Volume',
            description: getFlowById(finalVolumeId)?.impact_line,
          },
        ]

  return {
    qualityFlowId: finalQualityId,
    volumeFlowId: finalVolumeId,
    strategyCards,
  }
}
