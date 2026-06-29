/**
 * Questionário único do recrutamento Pro Líderes (biblioteca): mesmas perguntas e opções
 * do template Wellness `src/app/pt/wellness/templates/ganhos/page.tsx` (5 MCQs: 4 raio‑X
 * financeiro + 1 reflexiva para autoconsciência / próximo passo).
 *
 * Todos os fluxos de `getProLideresRecruitmentPresetFluxos()` usam este bloco; o `flow_id`
 * continua a selecionar copy/outcomes em `ylada_flow_diagnosis_outcomes`.
 *
 * Pontuação no link: `meta.invert_risk_mcq_score` (ver `wellnessFluxoToYladaConfigJson`).
 */
import type { FluxoCliente } from '@/types/ylada-flow-legacy'

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
      'Sim, faço uns trabalhos por fora de vez em quando',
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
  {
    id: 'p5',
    texto:
      'Olhando com honestidade para as próximas semanas: o que mais descreve sua relação com a ideia de renda extra ou de mudar esse quadro?',
    tipo: 'multipla_escolha',
    opcoes: [
      'Só consigo pensar no dia a dia; renda extra parece distante',
      'Acho possível, mas ainda não organizei ideias concretas',
      'Se fizer sentido no meu tempo, quero avaliar com cuidado',
      'Quero um próximo passo claro, ainda que pequeno, nas próximas semanas',
    ],
  },
]
