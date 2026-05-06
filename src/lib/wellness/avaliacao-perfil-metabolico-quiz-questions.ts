/**
 * Perguntas canónicas da Avaliação do Perfil Metabólico (Wellness).
 * Usadas na ferramenta real, no preview dedicado e como override no DynamicTemplatePreview
 * quando o content em BD está incompleto ou desatualizado.
 */

export type PerfilMetabolicoQuizOption = { id: string; label: string }

export type PerfilMetabolicoQuizQuestionDynamic = {
  question: string
  options: PerfilMetabolicoQuizOption[]
}

const toOptions = (labels: string[]): PerfilMetabolicoQuizOption[] =>
  labels.map((label, i) => ({ id: String(i), label }))

const RAW_PERGUNTAS: Array<{ question: string; labels: string[] }> = [
  {
    question: 'Como você descreveria seu metabolismo?',
    labels: [
      'Muito lento, ganho peso facilmente',
      'Lento, tenho dificuldade para perder peso',
      'Moderado, equilibrado',
      'Rápido, queimo calorias facilmente',
    ],
  },
  {
    question: 'Você sente que precisa de ajuda para otimizar seu metabolismo?',
    labels: [
      'Sim, preciso muito de orientação profissional',
      'Sim, seria útil ter um acompanhamento',
      'Talvez, se for algo prático e personalizado',
      'Não, consigo otimizar sozinho(a)',
    ],
  },
  {
    question: 'Você valoriza ter um plano personalizado baseado no seu perfil metabólico?',
    labels: [
      'Muito, é essencial para resultados eficazes',
      'Bastante, acredito que faria diferença',
      'Moderadamente, se for algo prático',
      'Pouco, prefiro seguir padrões gerais',
    ],
  },
  {
    question: 'Você sente que produtos específicos para seu metabolismo ajudariam seus resultados?',
    labels: [
      'Sim, faria toda diferença e aceleraria resultados',
      'Sim, acredito que seria muito útil',
      'Talvez, se for algo comprovado e eficaz',
      'Não, não vejo necessidade',
    ],
  },
  {
    question: 'Você acredita que um acompanhamento especializado pode transformar seu metabolismo?',
    labels: [
      'Sim, absolutamente! Estou pronto(a) para mudanças',
      'Sim, acredito que pode fazer diferença',
      'Talvez, se for algo estruturado e eficaz',
      'Não, acho que não é necessário',
    ],
  },
]

/** Formato esperado por DynamicTemplatePreview (`question` + `options`). */
export const AVALIACAO_PERFIL_METABOLICO_QUIZ_QUESTIONS_DYNAMIC: PerfilMetabolicoQuizQuestionDynamic[] =
  RAW_PERGUNTAS.map(({ question, labels }) => ({
    question,
    options: toOptions(labels),
  }))

export function isAvaliacaoPerfilMetabolicoWellnessSlug(rawSlug: string): boolean {
  const s = rawSlug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (s.includes('perfil-nutricional') || s.includes('nutricional')) return false
  if (s.includes('avaliacao-perfil-metabolico') || s.includes('quiz-perfil-metabolico')) return true
  if (s === 'perfil-metabolico' || s.includes('perfil-metabolico')) return true
  return s.includes('metabolico') && s.includes('perfil')
}

/** Para `metabolic-profile-assessment` / preview TS (apenas strings nas opções). */
export function getAvaliacaoPerfilMetabolicoPerguntasTemplate(): Array<{
  id: number
  pergunta: string
  tipo: 'multipla'
  opcoes: string[]
}> {
  return AVALIACAO_PERFIL_METABOLICO_QUIZ_QUESTIONS_DYNAMIC.map((q, i) => ({
    id: i + 1,
    pergunta: q.question,
    tipo: 'multipla' as const,
    opcoes: q.options.map((o) => o.label),
  }))
}
