/**
 * Diagnóstico Estratégico do Profissional — quiz sobre o negócio do próprio profissional.
 * Resultado alimenta memória estratégica e mapa. Inclui growth_stage para conectar ao mapa.
 *
 * Perguntas do ChatGPT:
 * 1. Como você gera a maioria dos seus clientes hoje?
 * 2. Quantas conversas com interessados você tem por semana?
 * 3. O que mais acontece nas conversas?
 * 4. Você usa algum diagnóstico ou triagem antes da conversa?
 */

import type { StrategyMapStage } from '@/lib/noel-wellness/noel-strategy-map'

export interface ProfessionalDiagnosisQuestion {
  id: string
  label: string
  options: Array<{ value: string; label: string }>
}

export const DIAGNOSTICO_PROFISSIONAL_QUESTIONS: ProfessionalDiagnosisQuestion[] = [
  {
    id: 'q1_geracao',
    label: 'Como você gera a maioria dos seus clientes hoje?',
    options: [
      { value: 'indicacao', label: 'Indicação' },
      { value: 'redes_sociais', label: 'Redes sociais' },
      { value: 'anuncios', label: 'Anúncios' },
      { value: 'sem_estrategia', label: 'Não tenho estratégia' },
    ],
  },
  {
    id: 'q2_conversas',
    label: 'Quantas conversas com interessados você tem por semana?',
    options: [
      { value: '0_5', label: '0 a 5' },
      { value: '5_15', label: '5 a 15' },
      { value: '15_30', label: '15 a 30' },
      { value: '30_mais', label: '30+' },
    ],
  },
  {
    id: 'q3_conversas',
    label: 'O que mais acontece nas conversas?',
    options: [
      { value: 'perguntam_preco', label: 'Perguntam preço' },
      { value: 'nao_respondem', label: 'Não respondem' },
      { value: 'agendam_nao_aparecem', label: 'Agendam mas não aparecem' },
      { value: 'fecham_poucos', label: 'Fecham poucos' },
    ],
  },
  {
    id: 'q4_diagnostico',
    label: 'Você usa algum diagnóstico ou triagem antes da conversa?',
    options: [
      { value: 'sim', label: 'Sim' },
      { value: 'nao', label: 'Não' },
      { value: 'as_vezes', label: 'Às vezes' },
    ],
  },
]

export interface ProfessionalDiagnosisResult {
  profile_title: string
  main_blocker: string
  growth_potential: string
  recommended_strategy: string
  next_action: string
  growth_stage: StrategyMapStage
}

/**
 * Mapeamento: combinação de respostas → resultado.
 * Ordem de prioridade: q3 (bloqueio) > q1 (fonte) > q2 (volume) > q4 (uso diagnóstico).
 */
function interpretAnswers(answers: Record<string, string>): ProfessionalDiagnosisResult {
  const q1 = answers.q1_geracao || answers.q1 || ''
  const q2 = answers.q2_conversas || answers.q2 || ''
  const q3 = answers.q3_conversas || answers.q3 || ''
  const q4 = answers.q4_diagnostico || answers.q4 || ''

  // q3 define o bloqueio principal
  if (q3 === 'perguntam_preco') {
    return {
      profile_title: 'Profissional em fase de atração inicial',
      main_blocker: 'Conversa começa direto pelo preço',
      growth_potential: 'Alto',
      recommended_strategy: 'Usar diagnóstico antes da conversa',
      next_action: 'Criar diagnóstico simples de 3 perguntas',
      growth_stage: q4 === 'sim' ? 'conversa' : q4 === 'as_vezes' ? 'diagnostico' : 'atracao',
    }
  }
  if (q3 === 'nao_respondem') {
    return {
      profile_title: 'Profissional em fase de atração',
      main_blocker: 'Pouca interação nas conversas',
      growth_potential: 'Alto',
      recommended_strategy: 'Usar diagnósticos para despertar curiosidade',
      next_action: 'Compartilhar diagnóstico em posts e stories',
      growth_stage: q2 === '0_5' ? 'atracao' : 'diagnostico',
    }
  }
  if (q3 === 'agendam_nao_aparecem') {
    return {
      profile_title: 'Profissional com volume de interessados',
      main_blocker: 'Agendam mas não aparecem',
      growth_potential: 'Médio',
      recommended_strategy: 'Qualificar melhor antes de agendar',
      next_action: 'Usar diagnóstico para filtrar quem está pronto',
      growth_stage: 'conversa',
    }
  }
  if (q3 === 'fecham_poucos') {
    return {
      profile_title: 'Profissional em fase de conversão',
      main_blocker: 'Interessados não fecham',
      growth_potential: 'Alto',
      recommended_strategy: 'Melhorar condução da conversa',
      next_action: 'Usar método: descobrir → repetir dor → 3 sims → valor',
      growth_stage: 'clientes',
    }
  }

  // Fallback por q1 (fonte de clientes)
  if (q1 === 'sem_estrategia' || q1 === '') {
    return {
      profile_title: 'Profissional em fase inicial',
      main_blocker: 'Falta de estratégia de geração',
      growth_potential: 'Alto',
      recommended_strategy: 'Criar primeiro diagnóstico para atrair',
      next_action: 'Criar diagnóstico simples e compartilhar',
      growth_stage: 'posicionamento',
    }
  }
  if (q1 === 'indicacao') {
    return {
      profile_title: 'Profissional dependente de indicações',
      main_blocker: 'Uma única fonte de clientes',
      growth_potential: 'Alto',
      recommended_strategy: 'Criar novas fontes com diagnósticos',
      next_action: 'Divulgar diagnósticos em conteúdos',
      growth_stage: 'atracao',
    }
  }
  if (q2 === '0_5') {
    return {
      profile_title: 'Profissional com agenda vazia',
      main_blocker: 'Poucas conversas',
      growth_potential: 'Alto',
      recommended_strategy: 'Aumentar atração com diagnósticos',
      next_action: 'Criar e compartilhar diagnóstico',
      growth_stage: 'atracao',
    }
  }

  // Default
  return {
    profile_title: 'Profissional em fase de crescimento',
    main_blocker: 'Organizar estratégia de geração',
    growth_potential: 'Alto',
    recommended_strategy: 'Usar diagnósticos como ferramenta central',
    next_action: 'Criar diagnóstico e testar em 3 conversas',
    growth_stage: 'diagnostico',
  }
}

/**
 * Interpreta as respostas e retorna o resultado estruturado.
 */
export function getProfessionalDiagnosisResult(answers: Record<string, unknown>): ProfessionalDiagnosisResult {
  const normalized: Record<string, string> = {}
  for (const [k, v] of Object.entries(answers)) {
    if (typeof v === 'string') normalized[k] = v
    else if (typeof v === 'number') normalized[k] = String(v)
  }
  return interpretAnswers(normalized)
}
