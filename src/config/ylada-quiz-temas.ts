/**
 * Quizzes por tema — conteúdo baseado em Nutri (textos e nomes).
 * Usado quando o usuário cria link com flow_id + tema.
 * O diagnóstico é gerado pelo motor YLADA (adapta por segment_code).
 * @see docs/YLADA-SEGMENTOS-E-VARIANTES-IMPLANTACAO.md
 */

import type { QuizQuestion } from './ylada-quiz-emagrecimento'

/** Quiz Energia — baseado em quiz-energetico (Nutri). */
const QUIZ_ENERGIA: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Como você descreveria sua energia ao longo do dia?',
    type: 'single',
    options: [
      'Muito baixa, me sinto esgotado(a)',
      'Baixa, tenho picos e quedas',
      'Moderada, consigo me manter',
      'Alta, me sinto bem disposto(a)',
    ],
  },
  {
    id: 'q2',
    label: 'Você sente que precisa de ajuda para melhorar sua energia?',
    type: 'single',
    options: [
      'Sim, preciso muito de orientação profissional',
      'Sim, seria muito útil ter um acompanhamento',
      'Talvez, se for algo prático e eficaz',
      'Não, consigo resolver sozinho(a)',
    ],
  },
  {
    id: 'q3',
    label: 'Como a falta de energia impacta sua rotina?',
    type: 'single',
    options: [
      'Muito, atrapalha trabalho e vida pessoal',
      'Moderado, algumas atividades sofrem',
      'Pouco, mas gostaria de melhorar',
      'Quase não impacta',
    ],
  },
  {
    id: 'q4',
    label: 'Você valoriza ter um plano personalizado para aumentar sua disposição?',
    type: 'single',
    options: [
      'Muito, é essencial para meu bem-estar',
      'Bastante, acredito que faria diferença',
      'Moderadamente, se for algo eficaz',
      'Pouco, prefiro seguir padrões gerais',
    ],
  },
  {
    id: 'q5',
    label: 'Qual seu principal objetivo em relação à energia?',
    type: 'single',
    options: [
      'Entender melhor o que está acontecendo',
      'Saber por onde começar',
      'Falar com alguém que entende',
      'Só quero me informar',
    ],
  },
]

/** Quiz Intestino — baseado em sintomas-intestinais (Nutri/Wellness). */
const QUIZ_INTESTINO: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Você sente desconforto digestivo, gases, inchaço ou problemas intestinais frequentemente?',
    type: 'single',
    options: [
      'Sim, tenho esses sintomas quase diariamente',
      'Sim, acontece várias vezes por semana',
      'Às vezes, mas não é constante',
      'Raramente ou nunca tenho esses problemas',
    ],
  },
  {
    id: 'q2',
    label: 'Você sente que precisa de ajuda para melhorar sua saúde intestinal?',
    type: 'single',
    options: [
      'Sim, preciso muito de orientação profissional',
      'Sim, seria muito útil ter um acompanhamento',
      'Talvez, se for algo prático e eficaz',
      'Não, consigo resolver sozinho(a)',
    ],
  },
  {
    id: 'q3',
    label: 'Como a saúde intestinal impacta seu dia a dia?',
    type: 'single',
    options: [
      'Muito, atrapalha bastante',
      'Moderado, às vezes incomoda',
      'Pouco, mas gostaria de melhorar',
      'Quase não impacta',
    ],
  },
  {
    id: 'q4',
    label: 'Você valoriza ter um plano personalizado para sua saúde digestiva?',
    type: 'single',
    options: [
      'Muito, é essencial para meu bem-estar',
      'Bastante, acredito que faria diferença',
      'Moderadamente, se for algo eficaz',
      'Pouco, prefiro seguir padrões gerais',
    ],
  },
  {
    id: 'q5',
    label: 'Qual seu principal objetivo em relação ao intestino?',
    type: 'single',
    options: [
      'Entender melhor o que está acontecendo',
      'Saber por onde começar',
      'Falar com alguém que entende',
      'Só quero me informar',
    ],
  },
]

/** Quiz Metabolismo — alinhado a `avaliacao-perfil-metabolico-quiz-questions.ts` (descoberta, não qualificação comercial). */
const QUIZ_METABOLISMO: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Na prática, como você sente que seu corpo “queima” energia no dia a dia?',
    type: 'single',
    options: [
      'Parece que gasta pouco: fácil acumular e difícil ver mudança no espelho ou na roupa',
      'Mais para lento: demoro a ver resultado e um desvio na rotina pesa rápido',
      'Algo no meio: nem extremamente rápido nem travado',
      'Mais acelerado: costumo sentir fome ou esfriar energia se como pouco ou pulo refeição',
    ],
  },
  {
    id: 'q2',
    label: 'Como está sua energia ao longo do dia?',
    type: 'single',
    options: [
      'Bem irregular: difícil acordar e à tarde “apago”, dependo de estímulo pra segurar',
      'Quedas frequentes: bom trecho e depois cansaço ou sonolência',
      'Oscila, mas na maior parte do tempo me viro',
      'Relativamente estável: picos existem, mas recupero com descanso ou refeição',
    ],
  },
  {
    id: 'q3',
    label: 'Como descrever sua fome e vontade de comer no dia a dia?',
    type: 'single',
    options: [
      'Muito intensa ou “fora de hora”: doce/carboidrato chama forte várias vezes',
      'Picos claros de fome ou ansiedade por comida, nem sempre ligados à fome real',
      'Mais previsível, alinhada às refeições',
      'Leve ou fácil de saciar com pouco',
    ],
  },
  {
    id: 'q4',
    label: 'E quanto a sensação de corpo “pesado”, inchado ou digestão lenta?',
    type: 'single',
    options: [
      'Frequente: inchaço, desconforto ou sensação de corpo travado',
      'Comum depois de certas refeições ou em alguns períodos do mês/dia',
      'Acontece às vezes, depende do que como ou do sono',
      'Raramente ou quase nunca',
    ],
  },
  {
    id: 'q5',
    label: 'Sono, estresse e regularidade da rotina — como você avalia hoje?',
    type: 'single',
    options: [
      'Muito desalinhado: sono ruim ou curto e estresse alto na maior parte dos dias',
      'Um dos dois pesa: ou sono frágil ou estresse que desorganiza comida e energia',
      'Razoável: tem dias ruins, mas não é o padrão dominante',
      'Relativamente estável: consigo manter rotina e descanso aceitáveis',
    ],
  },
]

/** Quiz Inchaço/Retenção — baseado em retencao-liquidos (Nutri/Wellness). */
const QUIZ_INCHAO: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Você sente que retém líquidos ou tem inchaço frequente?',
    type: 'single',
    options: [
      'Sim, sinto muito inchaço e desconforto',
      'Sim, às vezes sinto retenção leve',
      'Às vezes, mas não sei se é retenção',
      'Não, não tenho esse problema',
    ],
  },
  {
    id: 'q2',
    label: 'Você sente que precisa de ajuda profissional para identificar e tratar retenção de líquidos?',
    type: 'single',
    options: [
      'Sim, preciso muito de orientação especializada',
      'Sim, seria muito útil ter um acompanhamento',
      'Talvez, se for algo prático e personalizado',
      'Não, consigo resolver sozinho(a)',
    ],
  },
  {
    id: 'q3',
    label: 'Como o inchaço impacta seu dia a dia?',
    type: 'single',
    options: [
      'Muito, atrapalha bastante',
      'Moderado, às vezes incomoda',
      'Pouco, mas gostaria de melhorar',
      'Quase não impacta',
    ],
  },
  {
    id: 'q4',
    label: 'Você valoriza ter um plano personalizado para reduzir retenção?',
    type: 'single',
    options: [
      'Muito, é essencial para meu bem-estar',
      'Bastante, acredito que faria diferença',
      'Moderadamente, se for algo eficaz',
      'Pouco, prefiro seguir padrões gerais',
    ],
  },
  {
    id: 'q5',
    label: 'Qual seu principal objetivo em relação ao inchaço?',
    type: 'single',
    options: [
      'Entender melhor o que está acontecendo',
      'Saber por onde começar',
      'Falar com alguém que entende',
      'Só quero me informar',
    ],
  },
]

/** Quiz Peso/Gordura — baseado em pronto-emagrecer (Nutri/Wellness). */
const QUIZ_PESO: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Você está pronto(a) para começar uma jornada de emagrecimento saudável?',
    type: 'single',
    options: [
      'Sim, estou muito motivado(a) e pronto(a) para começar',
      'Sim, mas preciso de orientação para começar',
      'Talvez, se tiver um acompanhamento adequado',
      'Ainda não, preciso de mais informações',
    ],
  },
  {
    id: 'q2',
    label: 'Você sente que precisa de ajuda profissional para emagrecer com saúde?',
    type: 'single',
    options: [
      'Sim, preciso muito de orientação especializada',
      'Sim, seria muito útil ter um acompanhamento',
      'Talvez, se for algo prático e personalizado',
      'Não, consigo fazer sozinho(a)',
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
    label: 'Como o peso impacta seu dia a dia?',
    type: 'single',
    options: [
      'Muito, atrapalha bastante',
      'Moderado, às vezes incomoda',
      'Pouco, mas quero mudar',
      'Quase não impacta',
    ],
  },
  {
    id: 'q5',
    label: 'Qual seu principal objetivo?',
    type: 'single',
    options: [
      'Entender melhor o que está acontecendo',
      'Saber por onde começar',
      'Falar com alguém que entende',
      'Só quero me informar',
    ],
  },
]

/** Quiz Estresse — baseado em quiz-bem-estar / avaliacao-emocional. */
const QUIZ_ESTRESSE: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Como você descreveria seu nível de estresse?',
    type: 'single',
    options: [
      'Muito alto, me sinto sobrecarregado(a)',
      'Alto, tenho dias difíceis',
      'Moderado, consigo lidar',
      'Baixo, me sinto equilibrado(a)',
    ],
  },
  {
    id: 'q2',
    label: 'Você sente que precisa de ajuda para lidar com estresse e ansiedade?',
    type: 'single',
    options: [
      'Sim, preciso muito de orientação',
      'Sim, seria útil ter um acompanhamento',
      'Talvez, se for algo prático',
      'Não, consigo lidar sozinho(a)',
    ],
  },
  {
    id: 'q3',
    label: 'Como o estresse impacta sua rotina?',
    type: 'single',
    options: [
      'Muito, atrapalha sono, trabalho e relações',
      'Moderado, algumas áreas sofrem',
      'Pouco, mas gostaria de melhorar',
      'Quase não impacta',
    ],
  },
  {
    id: 'q4',
    label: 'Você valoriza ter estratégias personalizadas para equilíbrio emocional?',
    type: 'single',
    options: [
      'Muito, é essencial para meu bem-estar',
      'Bastante, acredito que faria diferença',
      'Moderadamente, se for algo eficaz',
      'Pouco, prefiro seguir sozinho(a)',
    ],
  },
  {
    id: 'q5',
    label: 'Qual seu principal objetivo em relação ao estresse?',
    type: 'single',
    options: [
      'Entender melhor o que está acontecendo',
      'Saber por onde começar',
      'Falar com alguém que entende',
      'Só quero me informar',
    ],
  },
]

/** Quiz Sono — baseado em avaliacao-sono-energia. */
const QUIZ_SONO: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Como você avalia a qualidade do seu sono?',
    type: 'single',
    options: [
      'Muito ruim, acordo cansado(a)',
      'Ruim, tenho dificuldade para dormir',
      'Regular, poderia ser melhor',
      'Boa, durmo bem na maioria das noites',
    ],
  },
  {
    id: 'q2',
    label: 'Você sente que precisa de ajuda para melhorar seu sono?',
    type: 'single',
    options: [
      'Sim, preciso muito de orientação',
      'Sim, seria útil ter um acompanhamento',
      'Talvez, se for algo prático',
      'Não, consigo resolver sozinho(a)',
    ],
  },
  {
    id: 'q3',
    label: 'Como a qualidade do sono impacta seu dia?',
    type: 'single',
    options: [
      'Muito, afeta energia e concentração',
      'Moderado, às vezes me atrapalha',
      'Pouco, mas gostaria de melhorar',
      'Quase não impacta',
    ],
  },
  {
    id: 'q4',
    label: 'Você valoriza ter um plano personalizado para dormir melhor?',
    type: 'single',
    options: [
      'Muito, é essencial para meu bem-estar',
      'Bastante, acredito que faria diferença',
      'Moderadamente, se for algo eficaz',
      'Pouco, prefiro seguir padrões gerais',
    ],
  },
  {
    id: 'q5',
    label: 'Qual seu principal objetivo em relação ao sono?',
    type: 'single',
    options: [
      'Entender melhor o que está acontecendo',
      'Saber por onde começar',
      'Falar com alguém que entende',
      'Só quero me informar',
    ],
  },
]

/** Quiz Vitalidade geral — baseado em quiz-bem-estar. */
const QUIZ_VITALIDADE: QuizQuestion[] = [
  {
    id: 'q1',
    label: 'Como você avalia seu bem-estar geral?',
    type: 'single',
    options: [
      'Ruim, sinto que preciso de mudanças',
      'Regular, poderia ser melhor',
      'Bom, mas quero otimizar',
      'Ótimo, me sinto bem',
    ],
  },
  {
    id: 'q2',
    label: 'Você sente que precisa de ajuda para melhorar sua qualidade de vida?',
    type: 'single',
    options: [
      'Sim, preciso muito de orientação',
      'Sim, seria útil ter um acompanhamento',
      'Talvez, se for algo prático',
      'Não, consigo sozinho(a)',
    ],
  },
  {
    id: 'q3',
    label: 'O que mais importa para você hoje?',
    type: 'single',
    options: [
      'Mais energia e disposição',
      'Melhor alimentação e hábitos',
      'Equilíbrio emocional',
      'Só quero me informar',
    ],
  },
  {
    id: 'q4',
    label: 'Você valoriza ter um plano personalizado para sua saúde?',
    type: 'single',
    options: [
      'Muito, é essencial',
      'Bastante, acredito que faria diferença',
      'Moderadamente, se for algo eficaz',
      'Pouco, prefiro seguir sozinho(a)',
    ],
  },
  {
    id: 'q5',
    label: 'Qual seu principal objetivo?',
    type: 'single',
    options: [
      'Entender melhor o que está acontecendo',
      'Saber por onde começar',
      'Falar com alguém que entende',
      'Só quero me informar',
    ],
  },
]

/** Mapeamento tema (Top 12) → quiz. */
const QUIZ_POR_TEMA: Record<string, QuizQuestion[]> = {
  energia: QUIZ_ENERGIA,
  intestino: QUIZ_INTESTINO,
  metabolismo: QUIZ_METABOLISMO,
  inchaço_retencao: QUIZ_INCHAO,
  peso_gordura: QUIZ_PESO,
  estresse: QUIZ_ESTRESSE,
  sono: QUIZ_SONO,
  vitalidade_geral: QUIZ_VITALIDADE,
  alimentacao: QUIZ_VITALIDADE,
  hidratacao: QUIZ_VITALIDADE,
  foco_concentracao: QUIZ_ESTRESSE,
  rotina_saudavel: QUIZ_VITALIDADE,
}

/**
 * Retorna quiz por tema para flow RISK_DIAGNOSIS ou BLOCKER_DIAGNOSIS.
 * Fallback: emagrecimento usa getQuizEmagrecimento; outros temas usam este mapeamento.
 */
export function getQuizByTema(themeRaw: string, flowId: string): QuizQuestion[] | null {
  const theme = (themeRaw || '').toLowerCase().trim().replace(/\s+/g, '_')
  const isRiskOrBlocker = flowId === 'diagnostico_risco' || flowId === 'diagnostico_bloqueio'
  if (!isRiskOrBlocker) return null

  const direct = QUIZ_POR_TEMA[theme]
  if (direct) return direct

  for (const [key, quiz] of Object.entries(QUIZ_POR_TEMA)) {
    if (theme.includes(key.replace(/_/g, ' ')) || key.replace(/_/g, ' ').includes(theme.replace(/_/g, ' '))) {
      return quiz
    }
  }
  return null
}
