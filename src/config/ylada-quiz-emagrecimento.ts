/**
 * Quiz pré-definido "Pronto para Emagrecer" com opções (A, B, C, D).
 * Usado quando interpret retorna emagrecimento + diagnostico_risco.
 * Respostas estruturadas → mapeamento claro para o motor de diagnóstico.
 */

export interface QuizQuestion {
  id: string
  label: string
  type: 'single'
  options: string[]
}

export const QUIZ_EMAGRECIMENTO_RISK: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Como você se sente em relação ao peso hoje?',
    type: 'single',
    options: [
      'Quero me cuidar mais',
      'Já estou buscando informações',
      'Às vezes penso nisso',
      'Ainda não parei para pensar',
    ],
  },
  {
    id: 'q2',
    label: 'O que já tentou antes?',
    type: 'single',
    options: [
      'Nunca tentei nada',
      'Uma ou duas vezes (dieta, exercício)',
      'Várias vezes, sem resultado',
      'Muitas vezes, já desisti de tentar',
    ],
  },
  {
    id: 'q3',
    label: 'Quantos quilos você gostaria de perder?',
    type: 'single',
    options: [
      'Menos de 5kg',
      '5–10kg',
      '10–20kg',
      'Mais de 20kg',
    ],
  },
  {
    id: 'q4',
    label: 'Como isso impacta seu dia a dia?',
    type: 'single',
    options: [
      'Pouco, mas quero mudar',
      'Moderado, atrapalha algumas coisas',
      'Muito, afeta bastante',
      'Demais, é prioridade mudar',
    ],
  },
  {
    id: 'q5',
    label: 'Qual seu principal objetivo?',
    type: 'single',
    options: [
      'Quero entender melhor',
      'Saber por onde começar',
      'Falar com alguém que entende',
      'Só quero me informar',
    ],
  },
]

/** Retorna o quiz se o tema for emagrecimento e flow for diagnostico_risco. */
export function getQuizEmagrecimento(theme: string, flowId: string): QuizQuestion[] | null {
  const themeLower = theme.toLowerCase().trim()
  const isEmagrecimento = /emagrecimento|perda de peso|emagrecer|peso/.test(themeLower)
  const isRisk = flowId === 'diagnostico_risco'
  if (isEmagrecimento && isRisk) return QUIZ_EMAGRECIMENTO_RISK
  return null
}
