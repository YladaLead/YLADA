/**
 * Perguntas canónicas da Avaliação do Perfil Metabólico (Wellness / Pro Líderes).
 * Foco em **autopercepção e rotina** (energia, fome, corpo, sono/estresse), não em intenção de compra.
 *
 * Ordem das opções em cada pergunta: índice **0** = sinais mais associados a metabolismo “pesado” ou
 * menos favorável na vivência da pessoa (maior pontuação no motor do template); índice **3** = mais leve/equilibrado.
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
    question: 'Na prática, como você sente que seu corpo “queima” energia no dia a dia?',
    labels: [
      'Parece que gasta pouco: fácil acumular e difícil ver mudança no espelho ou na roupa',
      'Mais para lento: demoro a ver resultado e um desvio na rotina pesa rápido',
      'Algo no meio: nem extremamente rápido nem travado',
      'Mais acelerado: costumo sentir fome ou esfriar energia se como pouco ou pulo refeição',
    ],
  },
  {
    question: 'Como está sua energia ao longo do dia?',
    labels: [
      'Bem irregular: difícil acordar e à tarde “apago”, dependo de estímulo pra segurar',
      'Quedas frequentes: bom trecho e depois cansaço ou sonolência',
      'Oscila, mas na maior parte do tempo me viro',
      'Relativamente estável: picos existem, mas recupero com descanso ou refeição',
    ],
  },
  {
    question: 'Como descrever sua fome e vontade de comer no dia a dia?',
    labels: [
      'Muito intensa ou “fora de hora”: doce/carboidrato chama forte várias vezes',
      'Picos claros de fome ou ansiedade por comida, nem sempre ligados à fome real',
      'Mais previsível, alinhada às refeições',
      'Leve ou fácil de saciar com pouco',
    ],
  },
  {
    question: 'E quanto a sensação de corpo “pesado”, inchado ou digestão lenta?',
    labels: [
      'Frequente: inchaço, desconforto ou sensação de corpo travado',
      'Comum depois de certas refeições ou em alguns períodos do mês/dia',
      'Acontece às vezes, depende do que como ou do sono',
      'Raramente ou quase nunca',
    ],
  },
  {
    question: 'Sono, estresse e regularidade da rotina — como você avalia hoje?',
    labels: [
      'Muito desalinhado: sono ruim ou curto e estresse alto na maior parte dos dias',
      'Um dos dois pesa: ou sono frágil ou estresse que desorganiza comida e energia',
      'Razoável: tem dias ruins, mas não é o padrão dominante',
      'Relativamente estável: consigo manter rotina e descanso aceitáveis',
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
