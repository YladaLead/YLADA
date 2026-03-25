/**
 * Perguntas de exemplo no lugar do PACIENTE (visão da nutri).
 */

export type NutriDemoNicho =
  | 'emagrecimento'
  | 'ganho_massa'
  | 'reeducacao'
  | 'esporte'
  | 'gestante'
  | 'clinico'

export interface NutriDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface NutriDemoNichoClienteConfig {
  value: NutriDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: NutriDemoPerguntaCliente[]
}

const NICHOS: NutriDemoNichoClienteConfig[] = [
  {
    value: 'emagrecimento',
    label: 'Emagrecimento / composição',
    tituloQuiz: 'Antes de falar com a nutricionista',
    subtitulo: 'Algumas perguntas rápidas sobre seu objetivo.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda hoje em relação ao peso ou ao corpo?',
        opcoes: [
          { label: 'Escala não mexe mesmo cuidando', valor: 0 },
          { label: 'Efeito sanfona (perde e recupera)', valor: 1 },
          { label: 'Falta de rotina ou constância', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Como está sua alimentação no dia a dia?',
        opcoes: [
          { label: 'Tento equilibrar, mas oscila muito', valor: 0 },
          { label: 'Dependo de delivery ou praticidade', valor: 1 },
          { label: 'Quero recomeçar do zero com orientação', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você busca agora?',
        opcoes: [
          { label: 'Perder peso com saúde', valor: 0 },
          { label: 'Definir melhor e ganhar hábito', valor: 1 },
          { label: 'Entender o que funciona pro meu corpo', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere dar o próximo passo?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Receber orientação e pensar com calma', valor: 1 },
          { label: 'Marcar consulta', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'ganho_massa',
    label: 'Ganho de massa / hipertrofia',
    tituloQuiz: 'Antes de falar com a nutricionista',
    subtitulo: 'Algumas perguntas rápidas sobre treino e alimentação.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda no progresso hoje?',
        opcoes: [
          { label: 'Dificuldade para ganhar peso ou massa', valor: 0 },
          { label: 'Não sei quanto comer nem quando', valor: 1 },
          { label: 'Treino ok, mas a dieta não acompanha', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você treina com regularidade?',
        opcoes: [
          { label: 'Sim, várias vezes na semana', valor: 0 },
          { label: 'Treino, mas irregular', valor: 1 },
          { label: 'Ainda estou começando', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você quer resolver primeiro?',
        opcoes: [
          { label: 'Montar refeições no ponto certo', valor: 0 },
          { label: 'Suplementação e timing', valor: 1 },
          { label: 'Plano simples que eu consiga seguir', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Tirar dúvidas no WhatsApp', valor: 0 },
          { label: 'Receber direcionamento por escrito', valor: 1 },
          { label: 'Marcar avaliação', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'reeducacao',
    label: 'Reeducação alimentar',
    tituloQuiz: 'Antes de falar com a nutricionista',
    subtitulo: 'Algumas perguntas rápidas sobre hábitos.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você quer mudar primeiro?',
        opcoes: [
          { label: 'Horários e rotina das refeições', valor: 0 },
          { label: 'Escolhas no supermercado e em casa', valor: 1 },
          { label: 'Ansiedade ou compulsão com comida', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você cozinha ou monta marmita?',
        opcoes: [
          { label: 'Sim, com frequência', valor: 0 },
          { label: 'Às vezes', valor: 1 },
          { label: 'Quase nunca, preciso de caminho fácil', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera da nutricionista?',
        opcoes: [
          { label: 'Plano realista pro meu dia a dia', valor: 0 },
          { label: 'Entender o que comer sem neura', valor: 1 },
          { label: 'Acompanhamento e ajustes ao longo do tempo', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Chamar no WhatsApp', valor: 0 },
          { label: 'Receber material e decidir depois', valor: 1 },
          { label: 'Agendar horário', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'esporte',
    label: 'Esporte e performance',
    tituloQuiz: 'Antes de falar com a nutricionista',
    subtitulo: 'Algumas perguntas rápidas sobre treino e nutrição.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Qual é seu foco principal agora?',
        opcoes: [
          { label: 'Performance em prova ou competição', valor: 0 },
          { label: 'Resistência ou corrida', valor: 1 },
          { label: 'Treino de força e composição', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Como está sua hidratação e energia nos treinos?',
        opcoes: [
          { label: 'Canso fácil ou falta pique', valor: 0 },
          { label: 'Oscila conforme o dia', valor: 1 },
          { label: 'Quero otimizar com orientação', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você busca?',
        opcoes: [
          { label: 'Plano pré e pós-treino', valor: 0 },
          { label: 'Ajuste de macros e calorias', valor: 1 },
          { label: 'Estratégia completa pro meu esporte', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere seguir?',
        opcoes: [
          { label: 'WhatsApp com a profissional', valor: 0 },
          { label: 'Material e depois consulta', valor: 1 },
          { label: 'Marcar avaliação presencial ou online', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'gestante',
    label: 'Gestante / pós-parto',
    tituloQuiz: 'Antes de falar com a nutricionista',
    subtitulo: 'Algumas perguntas rápidas sobre essa fase.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Em que momento você está?',
        opcoes: [
          { label: 'Gravidez', valor: 0 },
          { label: 'Pós-parto recente', valor: 1 },
          { label: 'Amamentação', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que mais te preocupa na alimentação?',
        opcoes: [
          { label: 'Enjoos, restrições ou medo de errar', valor: 0 },
          { label: 'Energia, ferro ou vitaminas', valor: 1 },
          { label: 'Peso e saúde com tranquilidade', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera agora?',
        opcoes: [
          { label: 'Segurança com cardápio adequado', valor: 0 },
          { label: 'Ajuste fino com acompanhamento', valor: 1 },
          { label: 'Tirar dúvidas pontuais', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Receber orientações por escrito', valor: 1 },
          { label: 'Marcar consulta', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'clinico',
    label: 'Saúde clínica (diabetes, lipídios, etc.)',
    tituloQuiz: 'Antes de falar com a nutricionista',
    subtitulo: 'Algumas perguntas rápidas sobre seu cuidado.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que trouxe você a buscar orientação?',
        opcoes: [
          { label: 'Exames alterados (glicose, colesterol…)', valor: 0 },
          { label: 'Indicação médica para dieta', valor: 1 },
          { label: 'Prevenção e hábito de vida', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já segue alguma orientação alimentar?',
        opcoes: [
          { label: 'Sim, mas quero organizar melhor', valor: 0 },
          { label: 'Pouco, preciso de plano claro', valor: 1 },
          { label: 'Não, seria o começo', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que é prioridade para você?',
        opcoes: [
          { label: 'Entender o que mudar no prato', valor: 0 },
          { label: 'Rotina que eu consiga manter', valor: 1 },
          { label: 'Acompanhamento próximo com ajustes', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere dar o próximo passo?',
        opcoes: [
          { label: 'WhatsApp com a nutricionista', valor: 0 },
          { label: 'Receber direcionamento e pensar', valor: 1 },
          { label: 'Agendar consulta', valor: 2 },
        ],
      },
    ],
  },
]

export const NUTRI_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getNutriDemoClienteConfig(nicho: string | null | undefined): NutriDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isNutriDemoNicho(s: string): s is NutriDemoNicho {
  return NICHOS.some((n) => n.value === s)
}
