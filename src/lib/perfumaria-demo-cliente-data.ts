/**
 * Perguntas de exemplo no lugar do CLIENTE (visão de quem vende ou indica fragrância).
 * Tom consultivo. Não substitui prova na pele nem avaliação de alergia.
 */

export type PerfumariaDemoNicho =
  | 'primeira_fragancia'
  | 'presente'
  | 'assinatura_dia'
  | 'pele_ou_alergia'
  | 'ocasiao'
  | 'familias_olfativas'

export interface PerfumariaDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface PerfumariaDemoNichoClienteConfig {
  value: PerfumariaDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: PerfumariaDemoPerguntaCliente[]
}

const NICHOS: PerfumariaDemoNichoClienteConfig[] = [
  {
    value: 'primeira_fragancia',
    label: 'Primeira compra ou redescobrir estilo',
    tituloQuiz: 'Frasco bonito na prateleira e você quase não usa?',
    subtitulo: 'Gosto e rotina em poucos toques. O consultor chega mais certeiro. Não substitui prova na pele.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Hoje você usa perfume com que frequência?',
        opcoes: [
          { label: 'Quase todos os dias', valor: 0 },
          { label: 'Só em ocasiões especiais', valor: 1 },
          { label: 'Quase nunca ou estou começando', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que você quer sentir na pele, em uma palavra?',
        opcoes: [
          { label: 'Leve e limpo', valor: 0 },
          { label: 'Marcante e confiante', valor: 1 },
          { label: 'Ainda estou descobrindo', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Você já teve perfume que “não combinou” com você?',
        opcoes: [
          { label: 'Sim, mais de uma vez', valor: 0 },
          { label: 'Uma vez', valor: 1 },
          { label: 'Não lembro ou nunca usei direito', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp ou direct', valor: 0 },
          { label: 'Ir à loja com ideias anotadas', valor: 1 },
          { label: 'Receber sugestões e decidir depois', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'presente',
    label: 'Presente para alguém',
    tituloQuiz: 'Presente errado em perfume dói mais que errar o tamanho da roupa?',
    subtitulo: 'Perfil de quem vai ganhar em claro. Não garante gosto alheio.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Para quem é o presente?',
        opcoes: [
          { label: 'Parceiro ou parceira', valor: 0 },
          { label: 'Amigo ou familiar', valor: 1 },
          { label: 'Colega ou chefe', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'A pessoa já usa perfume com frequência?',
        opcoes: [
          { label: 'Sim, tem assinatura clara', valor: 0 },
          { label: 'Usa às vezes', valor: 1 },
          { label: 'Não sei ou quase não usa', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Qual vibe você imagina para o presente?',
        opcoes: [
          { label: 'Clássico e seguro', valor: 0 },
          { label: 'Moderno e surpresa', valor: 1 },
          { label: 'Discreto e versátil', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Conversar no WhatsApp com fotos de referência', valor: 0 },
          { label: 'Lista curta para provar na loja', valor: 1 },
          { label: 'Embalagem pronta com troca flexível', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'assinatura_dia',
    label: 'Perfume do dia a dia',
    tituloQuiz: 'Cansou do mesmo cheiro ou nunca achou “o seu”?',
    subtitulo: 'Rotina e ambiente com honestidade. Não é reformulação técnica.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Onde você mais usa perfume no dia a dia?',
        opcoes: [
          { label: 'Trabalho ou estudos', valor: 0 },
          { label: 'Lazer e encontros', valor: 1 },
          { label: 'Em tudo, quero um só versátil', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que incomoda no que você usa hoje?',
        opcoes: [
          { label: 'Some rápido demais', valor: 0 },
          { label: 'Fica forte demais no ambiente', valor: 1 },
          { label: 'Enjoo ou cansa do cheiro', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Estações ou clima importam pra você?',
        opcoes: [
          { label: 'Sim, quero algo que funcione o ano todo', valor: 0 },
          { label: 'Quero um pro calor e outro pro frio', valor: 1 },
          { label: 'Não penso muito nisso', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere decidir?',
        opcoes: [
          { label: 'Amostras antes de comprar o frasco', valor: 0 },
          { label: 'Indicação direta com justificativa', valor: 1 },
          { label: 'Comparar duas opções no Zap', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'pele_ou_alergia',
    label: 'Pele sensível ou preferências sem álcool',
    tituloQuiz: 'Pele sensível e medo de reação. Comprando no escuro?',
    subtitulo: 'Preferências declaradas com cuidado. Não substitui avaliação médica ou teste de alergia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você quer evitar?',
        opcoes: [
          { label: 'Irritação ou vermelhidão com alguns perfumes', valor: 0 },
          { label: 'Cheiro muito alcoólico no primeiro spray', valor: 1 },
          { label: 'Ingredientes específicos (me avisaram)', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já usou perfume sem álcool ou óleo?',
        opcoes: [
          { label: 'Sim, quero mais opções assim', valor: 0 },
          { label: 'Não, mas quero experimentar', valor: 1 },
          { label: 'Prefiro clássico, com cuidado na aplicação', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que seria sucesso pra você?',
        opcoes: [
          { label: 'Lista de fragrâncias mais amenas', valor: 0 },
          { label: 'Conversa sobre concentração e aplicação', valor: 1 },
          { label: 'Encaminhamento se houver dúvida de saúde', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp com tempo pra responder com calma', valor: 0 },
          { label: 'Prova na loja com orientação', valor: 1 },
          { label: 'Kit de amostras em casa', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'ocasiao',
    label: 'Ocasião especial',
    tituloQuiz: 'Look fechado e o perfume ainda é uma dúvida nervosa?',
    subtitulo: 'Data e clima da ocasião em foco. Não substitui prova antes do evento.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Que tipo de ocasião?',
        opcoes: [
          { label: 'Casamento ou festa formal', valor: 0 },
          { label: 'Trabalho ou entrevista', valor: 1 },
          { label: 'Encontro ou celebração íntima', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Quanto tempo falta para o dia?',
        opcoes: [
          { label: 'Menos de uma semana', valor: 0 },
          { label: 'Algumas semanas', valor: 1 },
          { label: 'Ainda estou planejando', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Você quer que o perfume seja percebido…',
        opcoes: [
          { label: 'Só de perto, elegante', valor: 0 },
          { label: 'Marcante o evento inteiro', valor: 1 },
          { label: 'Equilibrado, sem exagerar', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Agendar prova ou videochamada', valor: 0 },
          { label: 'Sugestões com frete a tempo', valor: 1 },
          { label: 'Combinar retirada na loja', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'familias_olfativas',
    label: 'Explorar famílias olfativas',
    tituloQuiz: '“Algo doce mas não enjoativo”: frase que nunca funcionou sozinha?',
    subtitulo: 'Referências e curiosidade com precisão. Não copia fórmula nem garante equivalência.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te atrai hoje?',
        opcoes: [
          { label: 'Florais e frescos', valor: 0 },
          { label: 'Amadeirados e especiarias', valor: 1 },
          { label: 'Cítricos ou aquáticos', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você tem um perfume de referência que ama?',
        opcoes: [
          { label: 'Sim, quero algo na mesma linha', valor: 0 },
          { label: 'Tenho, mas quero mudar o estilo', valor: 1 },
          { label: 'Não, quero descobrir do zero', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Importa se for nicho ou tradicional?',
        opcoes: [
          { label: 'Quero descoberta e história da marca', valor: 0 },
          { label: 'Prefiro clássicos conhecidos', valor: 1 },
          { label: 'Me mostre os dois mundos', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere receber sugestões?',
        opcoes: [
          { label: 'Três opções com notas explicadas', valor: 0 },
          { label: 'Roteiro de prova na loja', valor: 1 },
          { label: 'Conversa no direct com áudio', valor: 2 },
        ],
      },
    ],
  },
]

export const PERFUMARIA_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getPerfumariaDemoClienteConfig(
  nicho: string | null | undefined
): PerfumariaDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isPerfumariaDemoNicho(s: string): s is PerfumariaDemoNicho {
  return NICHOS.some((n) => n.value === s)
}
