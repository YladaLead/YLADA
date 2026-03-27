/**
 * Perguntas de exemplo no lugar do CLIENTE (visão de quem vende/indica suplementos).
 */

export type NutraDemoNicho =
  | 'emagrecimento'
  | 'hipertrofia'
  | 'energia'
  | 'pele_cabelo'
  | 'imunidade'
  | 'esporte'

export interface NutraDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface NutraDemoNichoClienteConfig {
  value: NutraDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: NutraDemoPerguntaCliente[]
}

const NICHOS: NutraDemoNichoClienteConfig[] = [
  {
    value: 'emagrecimento',
    label: 'Emagrecimento / composição',
    tituloQuiz: 'Shake e promessa milagrosa e o efeito sanfona continua?',
    subtitulo: 'Quem te indica entende seu caso em segundos. Responda rápido.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda hoje em relação ao peso ou ao corpo?',
        opcoes: [
          { label: 'Escala não mexe mesmo cuidando', valor: 0 },
          { label: 'Efeito sanfona (perde e recupera)', valor: 1 },
          { label: 'Falta de constância na rotina', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já usa algum suplemento ou shake?',
        opcoes: [
          { label: 'Não, seria o começo', valor: 0 },
          { label: 'Já usei, quero algo que funcione pra mim', valor: 1 },
          { label: 'Uso, mas quero organizar melhor', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera agora?',
        opcoes: [
          { label: 'Entender opções com segurança', valor: 0 },
          { label: 'Plano simples que eu consiga seguir', valor: 1 },
          { label: 'Comparar com orientação clara', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Receber orientação e pensar', valor: 1 },
          { label: 'Fechar pedido com apoio', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'hipertrofia',
    label: 'Hipertrofia / proteína e treino',
    tituloQuiz: 'Whey no automático e o treino ainda não “fecha”?',
    subtitulo: 'Alinhe treino, rotina e suplemento antes da conversa.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda no progresso hoje?',
        opcoes: [
          { label: 'Dificuldade para ganhar massa ou peso', valor: 0 },
          { label: 'Não sei o que tomar nem quando', valor: 1 },
          { label: 'Treino ok, mas a suplementação não acompanha', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você treina com regularidade?',
        opcoes: [
          { label: 'Sim, várias vezes na semana', valor: 0 },
          { label: 'Treino, mas irregular', valor: 1 },
          { label: 'Estou começando agora', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você quer resolver primeiro?',
        opcoes: [
          { label: 'Proteína e timing das refeições', valor: 0 },
          { label: 'Energia pré e pós-treino', valor: 1 },
          { label: 'Combo simples sem complicar', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Tirar dúvidas no WhatsApp', valor: 0 },
          { label: 'Receber sugestão por escrito', valor: 1 },
          { label: 'Montar kit com a pessoa', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'energia',
    label: 'Energia e disposição',
    tituloQuiz: 'Bateria no chão depois do almoço virou seu normal?',
    subtitulo: 'Mostre o ritmo real: menos chute, mais encaixe.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Como você descreve sua energia ultimamente?',
        opcoes: [
          { label: 'Canso fácil no dia a dia', valor: 0 },
          { label: 'Picos e quedas (café não resolve)', valor: 1 },
          { label: 'Quero mais fôlego sem exageros', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que mais pesa na rotina?',
        opcoes: [
          { label: 'Trabalho ou estudo intenso', valor: 0 },
          { label: 'Falta de sono regular', valor: 1 },
          { label: 'Filhos, casa, agenda cheia', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você busca com suplementação?',
        opcoes: [
          { label: 'Algo seguro e prático', valor: 0 },
          { label: 'Combinar com alimentação', valor: 1 },
          { label: 'Orientação de quem entende', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere seguir?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Receber opções e decidir', valor: 1 },
          { label: 'Pedido direto com explicação', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'pele_cabelo',
    label: 'Pele, cabelo e unhas',
    tituloQuiz: 'Pele e cabelo pedindo ajuda e você comprando no escuro?',
    subtitulo: 'Objetivo claro. Indicação com menos tentativa e erro.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda?',
        opcoes: [
          { label: 'Cabelo quebradiço ou queda', valor: 0 },
          { label: 'Pele opaca ou sem viço', valor: 1 },
          { label: 'Unhas fracas', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já investiu em produtos externos (cremes, etc.)?',
        opcoes: [
          { label: 'Sim, quero complementar por dentro', valor: 0 },
          { label: 'Pouco, quero começar certo', valor: 1 },
          { label: 'Quero entender o que faz sentido', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera?',
        opcoes: [
          { label: 'Rotina simples de suplementos', valor: 0 },
          { label: 'Combinar com hábitos que já tenho', valor: 1 },
          { label: 'Acompanhamento de quem vende com critério', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Ver catálogo com explicação', valor: 1 },
          { label: 'Fechar com orientação', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'imunidade',
    label: 'Imunidade e rotina saudável',
    tituloQuiz: 'Imunidade virou vitrine de caixa sem explicação que faça sentido?',
    subtitulo: 'Contexto em poucos toques e conversa mais segura e direta.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que te motiva a buscar suplementação agora?',
        opcoes: [
          { label: 'Me resfrio fácil ou me sinto baixa', valor: 0 },
          { label: 'Quero reforçar a rotina preventiva', valor: 1 },
          { label: 'Família ou médico sugeriu cuidar mais', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Como está sua alimentação no geral?',
        opcoes: [
          { label: 'Tento equilibrar, mas falta prática', valor: 0 },
          { label: 'Correria, como o que dá', valor: 1 },
          { label: 'Organizada, quero otimizar', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que é prioridade?',
        opcoes: [
          { label: 'Algo confiável e fácil de tomar', valor: 0 },
          { label: 'Entender o que cada coisa faz', valor: 1 },
          { label: 'Plano que eu consiga manter meses', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'WhatsApp com a pessoa', valor: 0 },
          { label: 'Material e depois decido', valor: 1 },
          { label: 'Pedido com suporte', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'esporte',
    label: 'Esporte e performance',
    tituloQuiz: 'Pré e pós-treino no chute ou no achismo?',
    subtitulo: 'Performance com base no que você faz de verdade na semana.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Qual é seu foco principal agora?',
        opcoes: [
          { label: 'Força e hipertrofia', valor: 0 },
          { label: 'Cardio, corrida ou resistência', valor: 1 },
          { label: 'Esporte em equipe ou funcional', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Como está sua recuperação entre treinos?',
        opcoes: [
          { label: 'Dolorido ou cansado demais', valor: 0 },
          { label: 'Razoável, mas quero melhorar', valor: 1 },
          { label: 'Quero otimizar com suplementos certos', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você busca?',
        opcoes: [
          { label: 'Pré e pós-treino claros', valor: 0 },
          { label: 'Hidratação e eletrólitos', valor: 1 },
          { label: 'Pacote alinhado ao meu esporte', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere seguir?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Sugestão por escrito', valor: 1 },
          { label: 'Montar kit na hora', valor: 2 },
        ],
      },
    ],
  },
]

export const NUTRA_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getNutraDemoClienteConfig(nicho: string | null | undefined): NutraDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isNutraDemoNicho(s: string): s is NutraDemoNicho {
  return NICHOS.some((n) => n.value === s)
}
