/**
 * Recomendação de 2 estratégias (activation + authority).
 * Usa catálogo real de fluxos (ylada-flow-catalog).
 * Função pura: sem banco, sem IA.
 */

import { FLOW_IDS, getFlowById } from '@/config/ylada-flow-catalog'
import type { ProfileInput, BehaviorInput, StrategyRecommendation, StrategyCard, StrategyQuestion } from './types'
import { getProfessionalDiagnosis } from './profile-diagnosis'

/** Mapeia flow_id do catálogo para questions no formato StrategyQuestion. */
function flowToQuestions(
  flowId: string,
  theme: string,
  profile: ProfileInput
): StrategyQuestion[] {
  const flow = getFlowById(flowId)
  const labels = flow?.question_labels ?? ['O que mais atrapalha', 'Rotina e constância', 'Clareza do processo']
  return labels.map((label, i) => ({
    key: `q${i + 1}`,
    label,
    type: 'text' as const,
    required: false,
  }))
}

/** Retorna tema sugerido baseado no perfil. */
function getThemeFromProfile(profile: ProfileInput): string {
  const prof = (profile.profession ?? profile.area_profissional ?? '').toLowerCase()
  const cat = (profile.category ?? '').toLowerCase()
  const dor = (profile.dor_principal ?? '').toLowerCase()

  if (/medico|medicina/.test(prof)) return 'saúde e consultas'
  if (/nutri|nutricionista/.test(prof)) return 'nutrição e alimentação'
  if (/dentista|odonto/.test(prof)) return 'saúde bucal'
  if (/psi|psicolog|coach/.test(prof)) return 'bem-estar e desenvolvimento'
  if (/vendedor|vendas|seller/.test(prof)) return 'resultados e metas'
  if (/estetica|estética/.test(prof)) return 'estética e cuidados'
  if (/agenda|agenda_vazia/.test(dor)) return 'previsibilidade de agenda'
  if (/conversao|nao_converte/.test(dor)) return 'conversão e qualificação'

  return 'seu tema principal'
}

/**
 * Retorna recomendação completa: diagnóstico + 2 estratégias.
 * Usa flow_ids reais do catálogo (@/config/ylada-flow-catalog).
 */
export function getStrategyRecommendation(
  profile: ProfileInput,
  behavior?: BehaviorInput
): StrategyRecommendation {
  const diagnosis = getProfessionalDiagnosis(profile)
  const theme = getThemeFromProfile(profile)

  const linksTotal = behavior?.links_created_total ?? 0
  const submissions = behavior?.submissions_last_7_days ?? 0
  const lastType = behavior?.last_link_type

  // Etapa 5: lógica de comportamento
  // 0 links → ativação simples (checklist + diagnostico)
  // activation + poucos submissions → manter ativação (checklist + diagnostico)
  // activation + bons submissions → sugerir autoridade (diagnostico + calculadora)
  // authority ou desconhecido → diagnostico + calculadora

  const SUBMISSIONS_THRESHOLD = 5 // "bons" submissions nos últimos 7 dias

  let activationFlowId = FLOW_IDS.checklist_prontidao
  let authorityFlowId = FLOW_IDS.diagnostico_bloqueio

  if (linksTotal === 0) {
    activationFlowId = FLOW_IDS.checklist_prontidao
    authorityFlowId = FLOW_IDS.diagnostico_bloqueio
  } else if (lastType === 'activation' && submissions < SUBMISSIONS_THRESHOLD) {
    // Manter ativação: ainda poucos submissions
    activationFlowId = FLOW_IDS.checklist_prontidao
    authorityFlowId = FLOW_IDS.diagnostico_bloqueio
  } else {
    // Bons submissions ou já usa authority: sugerir autoridade
    activationFlowId = FLOW_IDS.diagnostico_bloqueio
    authorityFlowId = FLOW_IDS.calculadora_projecao
  }

  const activationFlow = getFlowById(activationFlowId)
  const authorityFlow = getFlowById(authorityFlowId)

  const activationCard: StrategyCard = {
    type: 'activation',
    flow_id: activationFlowId,
    title: activationFlow?.display_name ?? 'Conversas Diretas',
    reason: activationFlow?.impact_line ?? 'Ideal para gerar contatos rapidamente.',
    theme,
    questions: flowToQuestions(activationFlowId, theme, profile),
    cta_suggestion: activationFlow?.cta_default ?? 'Quero analisar meu caso',
  }

  const authorityCard: StrategyCard = {
    type: 'authority',
    flow_id: authorityFlowId,
    title: authorityFlow?.display_name ?? 'Autoridade',
    reason: authorityFlow?.impact_line ?? 'Ideal para aumentar percepção de valor.',
    theme,
    questions: flowToQuestions(authorityFlowId, theme, profile),
    cta_suggestion: authorityFlow?.cta_default ?? 'Quero o próximo passo',
  }

  return {
    professional_diagnosis: diagnosis,
    strategies: [activationCard, authorityCard],
    meta: {
      version: '1.0',
      generated_at: new Date().toISOString(),
    },
  }
}
