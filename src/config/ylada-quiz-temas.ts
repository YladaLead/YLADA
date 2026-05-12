/**
 * Quizzes por tema — conteúdo baseado em Nutri (textos e nomes).
 * Usado quando o usuário cria link com flow_id + tema.
 * O diagnóstico é gerado pelo motor YLADA (adapta por segment_code).
 * Perguntas 2 e 4: foco em vivência (sinais, rotina), não em “valoriza plano” ou venda.
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
    label: 'No dia a dia, como sua energia “se segura”?',
    type: 'single',
    options: [
      'Dependo muito de café, doce ou estímulo para funcionar — sem isso apago',
      'Tenho quedas fortes e ainda não sei bem o que estabiliza de verdade',
      'Oscila, mas já percebo alguns gatilhos (sono, fome, estresse)',
      'Consigo manter ritmo aceitável com o que já faço hoje',
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
    label: 'Sono e refeições — como estão sustentando sua energia?',
    type: 'single',
    options: [
      'Bem difíceis: noites curtas ou irregulares e refeições muito soltas',
      'Um dos dois costuma falhar (sono OU horário de comer)',
      'Razoáveis na maior parte das semanas',
      'Consistentes o suficiente para eu sentir diferença no dia',
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
    label: 'Depois de comer, o seu abdômen costuma reagir como?',
    type: 'single',
    options: [
      'Muito: desconforto, gases ou “peso” quase sempre',
      'Frequentemente incomoda, depende do que como',
      'Às vezes, em dias ou refeições específicas',
      'Raramente incomoda de forma relevante',
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
    label: 'E evacuar — você sente regularidade e leveza na rotina?',
    type: 'single',
    options: [
      'Não: muito irregular ou desconfortável na maior parte do tempo',
      'Costuma ser instável ou incomodo várias vezes por semana',
      'Oscila, mas tem períodos ok',
      'Na maior parte do tempo é aceitável e previsível',
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
    label: 'Quando incha, isso costuma coincidir com quê?',
    type: 'single',
    options: [
      'Com quase tudo: sal, final do dia, hormônios, viagem — difícil prever',
      'Com refeições mais pesadas ou pouca água no dia',
      'Só em alguns contextos que já identifiquei',
      'É raro ou tenho um padrão bem claro e controlável',
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
    label: 'Movimento e pernas no fim do dia — o que mais combina com você?',
    type: 'single',
    options: [
      'Passo muitas horas parado(a) e sinto pernas/pés pesados quase sempre',
      'Pouco movimento e final do dia costuma piorar',
      'Depende do dia; quando me movimento melhora',
      'Movimento e hidratação já ajudam bastante a evitar o pior',
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
    label: 'Sobre tentativas de mudar peso ou hábito — o que mais descreve você?',
    type: 'single',
    options: [
      'Já passei por muitos ciclos de ir e voltar — cansa e confunde',
      'Algumas tentativas sem conseguir manter consistência',
      'Estou num momento de retomada com mais clareza',
      'É um começo recente ou nunca encarei com método de verdade',
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
    label: 'Sono, estresse e rotina alimentar — como estão hoje em relação ao peso?',
    type: 'single',
    options: [
      'Na maior parte do tempo ajudam mais do que atrapalham',
      'Oscilam, mas não é o tempo todo',
      'Um ou dois desses fatores pesa forte na semana',
      'Muito desalinhados: noites ruins e dias em que a comida “compensa” o cansaço',
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
    label: 'Quando o estresse sobe, o corpo costuma reagir como?',
    type: 'single',
    options: [
      'Tudo de uma vez: peito apertado, taquicardia, choro ou explosão frequente',
      'Irritação, tensão muscular ou comer sem fome aparecem bastante',
      'Sinto cansaço ou dificuldade de foco, mas consigo contornar às vezes',
      'Consigo perceber cedo e usar algo que me acalma (ar, movimento, pausa)',
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
    label: 'Sono e “desligar” a cabeça — o que mais combina?',
    type: 'single',
    options: [
      'Muito difícil: demoro a dormir ou acordo com a mente acelerada',
      'Durmo, mas acordo cansado(a) ou com pensamentos intrusivos',
      'Tem noites ruins, mas há padrão de recuperação',
      'Consigo desligar razoavelmente e acordar com sensação de descanso',
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
    label: 'Noite e rotina antes de dormir — como tem sido?',
    type: 'single',
    options: [
      'Horários muito soltos, telas até tarde e cabeça acelerada',
      'Demoro a pegar no sono ou acordo no meio da noite várias vezes',
      'Alguns deslizes, mas em parte dos dias consigo ritual mínimo',
      'Tenho janela de sono mais estável e ritual que ajuda a fechar o dia',
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
    label: 'E no dia seguinte — como o sono paga na energia e no humor?',
    type: 'single',
    options: [
      'Muito mal: arrasto, irritação ou sonolência até de noite',
      'Impacto claro em foco ou humor em vários dias da semana',
      'Sinto em alguns dias, mas recupero em parte',
      'Na maior parte do tempo o dia segue aceitável quando durmo ok',
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
    label: 'Hábitos básicos (água, movimento, refeições) na semana — como estão?',
    type: 'single',
    options: [
      'Bem fragmentados: dias inteiros sem estrutura mínima',
      'Falha em mais de um pilar na maior parte dos dias',
      'Um pilar costuma falhar, os outros seguram um pouco',
      'Tenho base simples que sustenta a semana na maior parte do tempo',
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
    label: 'Quando pensa em mudar um hábito, o que mais acontece?',
    type: 'single',
    options: [
      'Paraliso ou começo forte e paro em poucos dias',
      'Começo, mas sem clareza do próximo passo — desanimo',
      'Consigo pequenas sequências com altos e baixos',
      'Consigo manter micro-hábitos e ajustar quando a vida muda',
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
