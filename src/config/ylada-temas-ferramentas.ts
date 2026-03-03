/**
 * Ferramentas concretas por tema — quizzes e calculadoras que o profissional pode criar.
 * Cada ferramenta mapeia para um flow_id do catálogo; o tema personaliza título e perguntas.
 * @see docs/PLANO-IMPLANTACAO-DIRECAO-ESTRATEGICA.md
 */

import { FLOW_IDS } from './ylada-flow-catalog'

export interface FerramentaConcreta {
  id: string
  name: string
  flow_id: string
  description: string
  /** Override opcional das perguntas (por tema). Se vazio, usa do flow. */
  question_labels?: string[]
  cta_default?: string
  /** quiz | calculadora — para ícone e agrupamento */
  tipo: 'quiz' | 'calculadora'
}

/** Ferramentas por tema. Tema genérico 'outro' serve de fallback. */
export const FERRAMENTAS_BY_TEMA: Record<string, FerramentaConcreta[]> = {
  emagrecimento: [
    {
      id: 'quiz-pronto-emagrecer',
      name: 'Quiz Pronto para Emagrecer?',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia se a pessoa está pronta física e emocionalmente para emagrecer.',
      question_labels: ['Como você se sente em relação ao peso hoje?', 'O que já tentou antes?', 'O que mais atrapalha?', 'Qual seu principal objetivo?'],
      cta_default: 'Quero uma avaliação completa',
      tipo: 'quiz',
    },
    {
      id: 'quiz-tipo-fome',
      name: 'Qual seu Tipo de Fome?',
      flow_id: FLOW_IDS.diagnostico_bloqueio,
      description: 'Identifica o principal bloqueio (emocional, rotina, hábitos) na relação com a comida.',
      question_labels: ['O que mais atrapalha sua alimentação?', 'Como é sua rotina de refeições?', 'O que você espera ao emagrecer?', 'Já tentou algo que funcionou?'],
      cta_default: 'Quero destravar isso',
      tipo: 'quiz',
    },
    {
      id: 'calc-projecao-100',
      name: 'Calculadora de Projeção em 100 dias',
      flow_id: FLOW_IDS.calculadora_projecao,
      description: 'Projeção realista de peso em 100 dias com base em consistência.',
      question_labels: ['Peso atual (kg)', 'Meta de peso (kg)', 'Prazo (dias) — ex.: 100', 'Nível de consistência (1–10)'],
      cta_default: 'Quero calibrar minha meta',
      tipo: 'calculadora',
    },
    {
      id: 'quiz-checklist-emagrecer',
      name: 'Checklist: Pronto para Emagrecer?',
      flow_id: FLOW_IDS.checklist_prontidao,
      description: 'Checklist de prontidão (sim/não) para emagrecimento saudável.',
      cta_default: 'Quero revisar meus pontos',
      tipo: 'quiz',
    },
  ],
  intestino: [
    {
      id: 'quiz-sintomas-intestino',
      name: 'Diagnóstico de Sintomas Intestinais',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia sinais e impacto dos sintomas intestinais no dia a dia.',
      question_labels: ['Quais sintomas você sente com mais frequência?', 'Há quanto tempo isso acontece?', 'O que já tentou?', 'Como isso impacta sua rotina?'],
      cta_default: 'Quero analisar meu caso',
      tipo: 'quiz',
    },
    {
      id: 'quiz-bloqueio-intestino',
      name: 'O que está travando sua digestão?',
      flow_id: FLOW_IDS.diagnostico_bloqueio,
      description: 'Identifica bloqueios (alimentação, estresse, hábitos) que afetam o intestino.',
      cta_default: 'Quero destravar isso',
      tipo: 'quiz',
    },
  ],
  alimentacao: [
    {
      id: 'quiz-alimentacao-saudavel',
      name: 'Quiz Alimentação Saudável',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia como está a relação com a alimentação e próximos passos.',
      question_labels: ['Como você se alimenta hoje?', 'O que mais dificulta?', 'Qual sua maior preocupação?', 'O que você gostaria de melhorar?'],
      cta_default: 'Quero uma orientação',
      tipo: 'quiz',
    },
    {
      id: 'calc-projecao-alimentacao',
      name: 'Calculadora de Projeção',
      flow_id: FLOW_IDS.calculadora_projecao,
      description: 'Projeção realista de metas (peso, hábitos) com base em consistência.',
      cta_default: 'Quero calibrar minha meta',
      tipo: 'calculadora',
    },
  ],
  energia: [
    {
      id: 'quiz-nivel-energia',
      name: 'Quiz Nível de Energia',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia como está a energia e o que pode estar afetando.',
      question_labels: ['Como está sua energia no dia a dia?', 'O que mais cansa você?', 'O que já tentou para ter mais disposição?', 'Qual seu principal objetivo?'],
      cta_default: 'Quero mais energia',
      tipo: 'quiz',
    },
    {
      id: 'quiz-bloqueio-energia',
      name: 'O que está roubando sua energia?',
      flow_id: FLOW_IDS.diagnostico_bloqueio,
      description: 'Identifica bloqueios (sono, alimentação, estresse) que afetam a disposição.',
      cta_default: 'Quero destravar isso',
      tipo: 'quiz',
    },
  ],
  b12_vitaminas: [
    {
      id: 'quiz-sinais-b12',
      name: 'Sinais de Deficiência de B12',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia sinais que podem indicar necessidade de suplementação.',
      question_labels: ['Você sente cansaço ou fraqueza?', 'Tem formigamento ou dormência?', 'Como está sua memória e concentração?', 'Qual sua rotina alimentar?'],
      cta_default: 'Quero saber mais',
      tipo: 'quiz',
    },
    {
      id: 'calc-projecao-vitaminas',
      name: 'Calculadora de Projeção',
      flow_id: FLOW_IDS.calculadora_projecao,
      description: 'Projeção de resultados com suplementação consistente.',
      cta_default: 'Quero calibrar minha meta',
      tipo: 'calculadora',
    },
  ],
  bem_estar: [
    {
      id: 'quiz-bem-estar',
      name: 'Quiz de Bem-Estar',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia rotina de bem-estar e sugere próximos passos.',
      cta_default: 'Quero melhorar',
      tipo: 'quiz',
    },
    {
      id: 'quiz-perfil-bem-estar',
      name: 'Seu Perfil de Bem-Estar',
      flow_id: FLOW_IDS.perfil_comportamental,
      description: 'Identifica seu estilo (consistente, ansioso, etc.) e melhor caminho.',
      cta_default: 'Quero o caminho do meu perfil',
      tipo: 'quiz',
    },
  ],
  ansiedade: [
    {
      id: 'quiz-nivel-ansiedade',
      name: 'Quiz Nível de Ansiedade',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia como a ansiedade aparece e impacto no dia a dia.',
      question_labels: ['Como a ansiedade aparece para você?', 'Com que frequência?', 'O que já tentou?', 'O que mais importa hoje?'],
      cta_default: 'Quero conversar sobre isso',
      tipo: 'quiz',
    },
    {
      id: 'quiz-bloqueio-ansiedade',
      name: 'O que está alimentando sua ansiedade?',
      flow_id: FLOW_IDS.diagnostico_bloqueio,
      description: 'Identifica padrões e bloqueios que mantêm a ansiedade.',
      cta_default: 'Quero destravar isso',
      tipo: 'quiz',
    },
  ],
  sono: [
    {
      id: 'quiz-qualidade-sono',
      name: 'Quiz Qualidade do Sono',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia hábitos de sono e impacto na rotina.',
      question_labels: ['Como você dorme hoje?', 'O que mais atrapalha?', 'O que já tentou?', 'Qual seu objetivo?'],
      cta_default: 'Quero dormir melhor',
      tipo: 'quiz',
    },
  ],
  carreira: [
    {
      id: 'quiz-bloqueio-carreira',
      name: 'O que está travando sua carreira?',
      flow_id: FLOW_IDS.diagnostico_bloqueio,
      description: 'Identifica bloqueios (rotina, decisão, expectativa) no crescimento profissional.',
      cta_default: 'Quero destravar isso',
      tipo: 'quiz',
    },
    {
      id: 'calc-projecao-carreira',
      name: 'Calculadora de Projeção',
      flow_id: FLOW_IDS.calculadora_projecao,
      description: 'Projeção realista de metas profissionais.',
      cta_default: 'Quero calibrar minha meta',
      tipo: 'calculadora',
    },
  ],
  produtividade: [
    {
      id: 'quiz-perfil-produtividade',
      name: 'Seu Perfil de Produtividade',
      flow_id: FLOW_IDS.perfil_comportamental,
      description: 'Identifica seu estilo e melhores estratégias.',
      cta_default: 'Quero o caminho do meu perfil',
      tipo: 'quiz',
    },
    {
      id: 'quiz-bloqueio-produtividade',
      name: 'O que está travando sua produtividade?',
      flow_id: FLOW_IDS.diagnostico_bloqueio,
      description: 'Identifica bloqueios (rotina, foco, planejamento).',
      cta_default: 'Quero destravar isso',
      tipo: 'quiz',
    },
  ],
  saude_bucal: [
    {
      id: 'quiz-saude-bucal',
      name: 'Quiz Saúde Bucal',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia hábitos e preocupações com a saúde bucal.',
      cta_default: 'Quero uma avaliação',
      tipo: 'quiz',
    },
  ],
  clareamento: [
    {
      id: 'quiz-prontidao-clareamento',
      name: 'Pronto para Clarear?',
      flow_id: FLOW_IDS.checklist_prontidao,
      description: 'Checklist de prontidão para clareamento dental.',
      cta_default: 'Quero saber mais',
      tipo: 'quiz',
    },
  ],
  implantes: [
    {
      id: 'quiz-avaliacao-implantes',
      name: 'Avaliação para Implantes',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia expectativas e condições para implantes.',
      cta_default: 'Quero uma avaliação',
      tipo: 'quiz',
    },
  ],
  pele: [
    {
      id: 'quiz-cuidados-pele',
      name: 'Quiz Cuidados com a Pele',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia rotina e necessidades de cuidados com a pele.',
      cta_default: 'Quero uma orientação',
      tipo: 'quiz',
    },
  ],
  autoconhecimento: [
    {
      id: 'quiz-perfil-autoconhecimento',
      name: 'Seu Perfil de Autoconhecimento',
      flow_id: FLOW_IDS.perfil_comportamental,
      description: 'Identifica seu estilo e melhor caminho de desenvolvimento.',
      cta_default: 'Quero o caminho do meu perfil',
      tipo: 'quiz',
    },
  ],
  suplementacao: [
    {
      id: 'quiz-necesidade-suplementacao',
      name: 'Você Precisa de Suplementação?',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia sinais e rotina para orientar sobre suplementos.',
      cta_default: 'Quero uma orientação',
      tipo: 'quiz',
    },
    {
      id: 'calc-projecao-suplementacao',
      name: 'Calculadora de Projeção',
      flow_id: FLOW_IDS.calculadora_projecao,
      description: 'Projeção de resultados com uso consistente.',
      cta_default: 'Quero calibrar minha meta',
      tipo: 'calculadora',
    },
  ],
  /** Fallback para tema não mapeado ou "Outro". */
  outro: [
    {
      id: 'quiz-raio-x',
      name: 'Raio-X de Saúde',
      flow_id: FLOW_IDS.diagnostico_risco,
      description: 'Avalia sinais, histórico e impacto no dia a dia.',
      cta_default: 'Quero analisar meu caso',
      tipo: 'quiz',
    },
    {
      id: 'quiz-raio-x-estrategia',
      name: 'Raio-X de Estratégia',
      flow_id: FLOW_IDS.diagnostico_bloqueio,
      description: 'Identifica o principal bloqueio e primeiro passo para destravar.',
      cta_default: 'Quero destravar isso',
      tipo: 'quiz',
    },
    {
      id: 'calc-projecao',
      name: 'Calculadora de Projeção',
      flow_id: FLOW_IDS.calculadora_projecao,
      description: 'Projeção realista de metas com base em consistência.',
      cta_default: 'Quero calibrar minha meta',
      tipo: 'calculadora',
    },
    {
      id: 'quiz-perfil',
      name: 'Perfil Comportamental',
      flow_id: FLOW_IDS.perfil_comportamental,
      description: 'Identifica seu perfil e melhor caminho.',
      cta_default: 'Quero o caminho do meu perfil',
      tipo: 'quiz',
    },
  ],
}

/** Retorna ferramentas para um tema. Fallback para 'outro' se não houver. */
export function getFerramentasForTema(tema: string | null | undefined): FerramentaConcreta[] {
  if (!tema || tema === '_outro') return FERRAMENTAS_BY_TEMA.outro
  const key = String(tema).toLowerCase().trim()
  return FERRAMENTAS_BY_TEMA[key] ?? FERRAMENTAS_BY_TEMA.outro
}
