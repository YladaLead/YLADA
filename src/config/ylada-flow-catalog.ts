/**
 * Catálogo de fluxos universais — Links Inteligentes (YLADA).
 * 5 arquiteturas; o tema preenche título/perguntas no momento da geração.
 * @see docs/CHECKLIST-LINKS-INTELIGENTES-ETAPAS.md (Etapa 1)
 * @see docs/LINKS-INTELIGENTES-PACOTES-1-5-CONSOLIDADO.md (Pacote 1 e 3)
 */

import type { DiagnosisArchitecture } from '@/lib/ylada/diagnosis-types'

export type FlowType = 'qualidade' | 'volume'

export interface FlowCatalogItem {
  /** ID estável do fluxo (usado em getStrategies e generate). */
  id: string
  /** Arquitetura do motor de diagnóstico (mapeia para schema/config). */
  architecture: DiagnosisArchitecture
  /** Qualidade = lead mais qualificado; Volume = maior volume de leads. */
  type: FlowType
  /** Nome exibido nos cards (ex.: "Raio-X de Saúde"). */
  display_name: string
  /** Uma linha de impacto (ex.: "Atrai pessoas mais conscientes e preparadas para agir."). */
  impact_line: string
  /** O que o fluxo faz (2–3 linhas). */
  description: string
  /** Perfil do lead atraído (ex.: "pessoas preocupadas com saúde e exames"). */
  perfil_lead_atraido: string
  /** Rótulos das perguntas (ex.: ["Sintomas", "Histórico", "Tentativas"]). */
  question_labels: string[]
  /** Resumo do que a pessoa recebe (ex.: "Nível de risco + próximo passo + convite no WhatsApp"). */
  result_preview: string
  /** Texto padrão do botão CTA (ex.: "Quero analisar meu caso"). */
  cta_default: string
}

/** IDs dos fluxos — usar em getStrategies e na UI. */
export const FLOW_IDS = {
  diagnostico_risco: 'diagnostico_risco',
  diagnostico_bloqueio: 'diagnostico_bloqueio',
  calculadora_projecao: 'calculadora_projecao',
  perfil_comportamental: 'perfil_comportamental',
  checklist_prontidao: 'checklist_prontidao',
} as const

export type FlowId = (typeof FLOW_IDS)[keyof typeof FLOW_IDS]

/** Catálogo dos 5 fluxos universais. */
export const YLADA_FLOW_CATALOG: FlowCatalogItem[] = [
  {
    id: FLOW_IDS.diagnostico_risco,
    architecture: 'RISK_DIAGNOSIS',
    type: 'qualidade',
    display_name: 'Raio-X de Saúde',
    impact_line: 'Atrai pessoas mais conscientes e preparadas para agir.',
    description:
      'O visitante responde sobre sinais, histórico e impacto. O link devolve um nível de risco (baixo/médio/alto) com explicação e próximo passo. Ideal para temas com consequência ou urgência.',
    perfil_lead_atraido: 'Pessoas preocupadas com saúde, exames e prevenção.',
    question_labels: ['Sinais ou sintomas', 'Histórico relevante', 'Impacto no dia a dia', 'Tentativas anteriores'],
    result_preview: 'Nível de risco + explicação + evidências + próximo passo + botão WhatsApp.',
    cta_default: 'Quero analisar meu caso',
  },
  {
    id: FLOW_IDS.diagnostico_bloqueio,
    architecture: 'BLOCKER_DIAGNOSIS',
    type: 'volume',
    display_name: 'Raio-X de Estratégia',
    impact_line: 'Desperta curiosidade e gera maior volume de leads.',
    description:
      'Identifica o principal bloqueio (rotina, emocional, processo, hábitos ou expectativa) a partir das respostas. O visitante recebe um diagnóstico direto e um primeiro passo para destravar.',
    perfil_lead_atraido: 'Pessoas que sentem que "não conseguem" ou que algo as trava.',
    question_labels: ['O que mais atrapalha', 'Rotina e constância', 'Clareza do processo', 'Expectativa em relação à meta'],
    result_preview: 'Principal bloqueio + por que acontece + primeiro passo + botão WhatsApp.',
    cta_default: 'Quero destravar isso',
  },
  {
    id: FLOW_IDS.calculadora_projecao,
    architecture: 'PROJECTION_CALCULATOR',
    type: 'volume',
    display_name: 'Calculadora de Projeção',
    impact_line: 'Projeção realista gera engajamento e sensação de controle.',
    description:
      'O visitante informa ponto atual, meta e prazo. O link devolve uma projeção realista (min/max) considerando consistência, e um aviso se a meta estiver agressiva.',
    perfil_lead_atraido: 'Pessoas que gostam de números e querem ver cenário possível.',
    question_labels: ['Valor atual', 'Meta desejada', 'Prazo (dias)', 'Nível de consistência'],
    result_preview: 'Projeção realista (min–max) + aviso se meta agressiva + próximo passo + WhatsApp.',
    cta_default: 'Quero calibrar minha meta',
  },
  {
    id: FLOW_IDS.perfil_comportamental,
    architecture: 'PROFILE_TYPE',
    type: 'volume',
    display_name: 'Perfil Comportamental',
    impact_line: 'Identificação com o perfil aumenta conexão e adesão.',
    description:
      'Perguntas sobre estilo (planejamento, decisão, constância) definem um perfil (consistente, 8ou80, ansioso, analítico, improvisador). O resultado mostra forças, armadilhas e melhor próximo passo.',
    perfil_lead_atraido: 'Pessoas que gostam de se reconhecer em um tipo e receber caminho personalizado.',
    question_labels: ['Constância', 'Estilo de planejamento', 'Emoção nas decisões', 'Velocidade de decisão', 'Seguir até o fim'],
    result_preview: 'Seu perfil + forças e armadilhas + caminho ideal + botão WhatsApp.',
    cta_default: 'Quero o caminho do meu perfil',
  },
  {
    id: FLOW_IDS.checklist_prontidao,
    architecture: 'READINESS_CHECKLIST',
    type: 'qualidade',
    display_name: 'Checklist de Prontidão',
    impact_line: 'Leads que já se veem prontos para o próximo passo.',
    description:
      'Checklist de itens (sim/não) sobre prontidão para o tema. O visitante recebe pontuação 0–100, os principais gaps e prioridade de ajuste.',
    perfil_lead_atraido: 'Pessoas que querem saber se estão prontas antes de dar o próximo passo.',
    question_labels: ['Itens do checklist (sim/não por tema)'],
    result_preview: 'Pontuação 0–100 + pontos críticos + por onde começar + botão WhatsApp.',
    cta_default: 'Quero revisar meus pontos',
  },
]

/** Busca um fluxo do catálogo por id. */
export function getFlowById(id: string): FlowCatalogItem | undefined {
  return YLADA_FLOW_CATALOG.find((f) => f.id === id)
}

/** Lista de IDs válidos (para validação em strategies e generate). */
export const VALID_FLOW_IDS = YLADA_FLOW_CATALOG.map((f) => f.id)
