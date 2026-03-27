/**
 * Perguntas e resultados de exemplo no lugar da CLIENTE (não do dono do negócio).
 * Cada nicho = fluxo curto para demonstrar o que a profissional pode oferecer no link.
 */

export type EsteticaDemoNicho = 'pele' | 'cabelo' | 'unhas' | 'sobrancelha' | 'maquiagem' | 'corporal'

export interface EsteticaDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface EsteticaDemoNichoClienteConfig {
  value: EsteticaDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: EsteticaDemoPerguntaCliente[]
}

const NICHOS: EsteticaDemoNichoClienteConfig[] = [
  {
    value: 'pele',
    label: 'Pele / facial',
    tituloQuiz: 'Rotina cheia de produto e a pele continua te incomodando?',
    subtitulo: 'Quatro perguntas. A profissional já vê seu contexto antes de marcar.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda na pele no dia a dia?',
        opcoes: [
          { label: 'Oleosidade ou poros', valor: 0 },
          { label: 'Ressecamento ou repuxar', valor: 1 },
          { label: 'Manchas ou textura (acne, cicatrizes)', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você tem rotina de cuidados em casa?',
        opcoes: [
          { label: 'Sim, mais ou menos organizada', valor: 0 },
          { label: 'Faço o básico quando lembro', valor: 1 },
          { label: 'Quase nada / não sei por onde começar', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você busca agora?',
        opcoes: [
          { label: 'Entender o que minha pele precisa', valor: 0 },
          { label: 'Preparar a pele para um procedimento', valor: 1 },
          { label: 'Avaliação com alguém de confiança', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere dar o próximo passo?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Receber orientação e pensar com calma', valor: 1 },
          { label: 'Ir direto ao agendamento', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'cabelo',
    label: 'Cabelo / capilar',
    tituloQuiz: 'Cabelo que cai, quebra ou não obedece mesmo com tratamento?',
    subtitulo: 'Mostre o que incomoda. Ela entende a urgência antes do primeiro oi.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda no cabelo hoje?',
        opcoes: [
          { label: 'Queda ou enfraquecimento', valor: 0 },
          { label: 'Ressecamento ou frizz', valor: 1 },
          { label: 'Química, cor ou danos', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Com que frequência você cuida dele em casa?',
        opcoes: [
          { label: 'Tenho produtos e uso direto', valor: 0 },
          { label: 'Só o essencial', valor: 1 },
          { label: 'Preciso de ajuda para montar rotina', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você quer resolver primeiro?',
        opcoes: [
          { label: 'Saúde do couro e fios', valor: 0 },
          { label: 'Visual / corte / cor', valor: 1 },
          { label: 'Tratamento em salão ou clínica capilar', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal para você?',
        opcoes: [
          { label: 'Tirar dúvidas no WhatsApp', valor: 0 },
          { label: 'Receber indicação de cuidados', valor: 1 },
          { label: 'Marcar avaliação', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'unhas',
    label: 'Unhas',
    tituloQuiz: 'Unhas que lascam ou nunca ficam como você imagina?',
    subtitulo: 'Respostas rápidas para alinhar expectativa antes de sentar na cadeira.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda nas unhas?',
        opcoes: [
          { label: 'Lascam ou quebram fácil', valor: 0 },
          { label: 'Quero alongamento ou blindagem', valor: 1 },
          { label: 'Cutículas, formato ou estética', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você costuma fazer as unhas com frequência?',
        opcoes: [
          { label: 'Sim, de forma regular', valor: 0 },
          { label: 'De vez em quando', valor: 1 },
          { label: 'Quero começar / voltar a cuidar', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você busca agora?',
        opcoes: [
          { label: 'Fortalecer e naturalidade', valor: 0 },
          { label: 'Alongamento ou nail art', valor: 1 },
          { label: 'Manutenção com calendário fixo', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'Chamar no WhatsApp', valor: 0 },
          { label: 'Ver opções e valores depois', valor: 1 },
          { label: 'Agendar horário', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'sobrancelha',
    label: 'Sobrancelha / design',
    tituloQuiz: 'Sobrancelha assimétrica ou medo de errar o desenho?',
    subtitulo: 'Ela já chega sabendo o que você quer resolver primeiro.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você quer resolver primeiro?',
        opcoes: [
          { label: 'Desenho ou simetria', valor: 0 },
          { label: 'Falhas ou pouco pelo', valor: 1 },
          { label: 'Cor, henna ou micropigmentação', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Já fez design ou procedimento antes?',
        opcoes: [
          { label: 'Sim, com frequência', valor: 0 },
          { label: 'Já fiz, mas faz tempo', valor: 1 },
          { label: 'Seria a primeira vez', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Qual resultado você imagina?',
        opcoes: [
          { label: 'Natural, alinhado ao rosto', valor: 0 },
          { label: 'Marcado / glam conforme ocasião', valor: 1 },
          { label: 'Preciso de orientação', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Enviar foto depois', valor: 1 },
          { label: 'Marcar avaliação', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'maquiagem',
    label: 'Maquiagem',
    tituloQuiz: 'Data marcada e você ainda não sabe se a make vai durar?',
    subtitulo: 'Contexto e pele em poucos toques, com menos surpresa no dia.',
    perguntas: [
      {
        id: 'p1',
        texto: 'Para qual momento é a maquiagem?',
        opcoes: [
          { label: 'Evento (casamento, festa, fotos)', valor: 0 },
          { label: 'Dia a dia ou trabalho', valor: 1 },
          { label: 'Aula / aprender a se maquiar', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Sua pele costuma reagir a produtos?',
        opcoes: [
          { label: 'Sim, tenho cuidados específicos', valor: 0 },
          { label: 'Às vezes', valor: 1 },
          { label: 'Não sei / nunca parei pra testar', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que é mais importante para você?',
        opcoes: [
          { label: 'Durabilidade e foto', valor: 0 },
          { label: 'Naturalidade', valor: 1 },
          { label: 'Preço e encaixe na agenda', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere seguir?',
        opcoes: [
          { label: 'WhatsApp com data e local', valor: 0 },
          { label: 'Orçamento antes de fechar', valor: 1 },
          { label: 'Só tirar dúvidas por enquanto', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'corporal',
    label: 'Corporal / contorno',
    tituloQuiz: 'Treino à risca e aquele ponto ainda te incomoda no espelho?',
    subtitulo: 'Deixe claro o foco. O próximo passo fica mais objetivo.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda hoje?',
        opcoes: [
          { label: 'Flacidez ou firmeza', valor: 0 },
          { label: 'Gordura localizada ou medidas', valor: 1 },
          { label: 'Celulite ou textura da pele', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já fez algum procedimento corporal antes?',
        opcoes: [
          { label: 'Sim, com alguma frequência', valor: 0 },
          { label: 'Já experimentei poucas vezes', valor: 1 },
          { label: 'Não, seria novo para mim', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera do próximo passo?',
        opcoes: [
          { label: 'Entender o que faz sentido para mim', valor: 0 },
          { label: 'Combinar protocolo e sessões', valor: 1 },
          { label: 'Saber valores e disponibilidade', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp com a profissional', valor: 0 },
          { label: 'Avaliação presencial antes', valor: 1 },
          { label: 'Receber informações e decidir depois', valor: 2 },
        ],
      },
    ],
  },
]

export const ESTETICA_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getEsteticaDemoClienteConfig(nicho: string | null | undefined): EsteticaDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isEsteticaDemoNicho(s: string): s is EsteticaDemoNicho {
  return NICHOS.some((n) => n.value === s)
}
