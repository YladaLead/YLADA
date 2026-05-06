/**
 * Questionário único do recrutamento Pro Líderes (biblioteca): mesmas 4 perguntas e opções
 * do template Wellness `src/app/pt/wellness/templates/ganhos/page.tsx`.
 *
 * Todos os fluxos de `getProLideresRecruitmentPresetFluxos()` usam este bloco; o `flow_id`
 * continua a selecionar copy/outcomes em `ylada_flow_diagnosis_outcomes`.
 *
 * Pontuação no link: `meta.invert_risk_mcq_score` (ver `wellnessFluxoToYladaConfigJson`).
 */
import type { FluxoCliente } from '@/types/wellness-system'

export const PRO_LIDERES_RECRUITMENT_UNIFIED_PERGUNTAS: FluxoCliente['perguntas'] = [
  {
    id: 'p1',
    texto: 'Como você vê sua situação financeira atual?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Dificuldade para chegar ao final do mês',
      'Suficiente para sobreviver',
      'Confortável, mas sem sobrar',
      'Próspera, consigo investir',
    ],
  },
  {
    id: 'p2',
    texto: 'Você tem uma fonte de renda adicional?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Não, apenas uma fonte',
      'Sim, tenho freelas esporádicos',
      'Sim, tenho um negócio próprio',
      'Sim, tenho investimentos gerando renda',
    ],
  },
  {
    id: 'p3',
    texto: 'Quanto tempo você dedica a atividades que geram renda?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Apenas trabalho fixo (40h semanais)',
      'Algumas horas extras (45-50h/semana)',
      'Dedico bastante tempo (55-60h/semana)',
      'Múltiplas fontes ativas (60h+/semana)',
    ],
  },
  {
    id: 'p4',
    texto: 'Você está satisfeito com sua capacidade de gerar renda?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Não, sinto que poderia ganhar muito mais',
      'Parcialmente, consigo mais se me dedicar',
      'Sim, estou no meu limite atual',
      'Sim, estou prosperando como desejado',
    ],
  },
]
