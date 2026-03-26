/**
 * Perguntas de exemplo no lugar de quem busca psicanálise (visão do psicanalista).
 * Tom reflexivo sobre o processo. Não é avaliação clínica nem indicação de técnica.
 */

export type PsicanaliseDemoNicho =
  | 'inicio_processo'
  | 'inquietacao_sofrimento'
  | 'relacoes_vinculos'
  | 'luto_mudanca'
  | 'trabalho_sentido'
  | 'duvidas_formato'

export interface PsicanaliseDemoPerguntaCliente {
  id: string
  texto: string
  opcoes: { label: string; valor: number }[]
}

export interface PsicanaliseDemoNichoClienteConfig {
  value: PsicanaliseDemoNicho
  label: string
  tituloQuiz: string
  subtitulo: string
  perguntas: PsicanaliseDemoPerguntaCliente[]
}

const NICHOS: PsicanaliseDemoNichoClienteConfig[] = [
  {
    value: 'inicio_processo',
    label: 'Primeiro contato com a análise',
    tituloQuiz: 'Psicanálise parece mistério e você quer saber se é pra você?',
    subtitulo: 'Expectativas honestas antes do primeiro contato. Não substitui sessão.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que você já sabe (ou acha que sabe) sobre psicanálise?',
        opcoes: [
          { label: 'Pouco, quero entender sem julgamento', valor: 0 },
          { label: 'Tenho ideias de filmes ou livros', valor: 1 },
          { label: 'Já li algo, mas quero experiência real', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'O que você busca neste momento?',
        opcoes: [
          { label: 'Um espaço regular pra falar com profundidade', valor: 0 },
          { label: 'Entender sintomas ou padrões que se repetem', valor: 1 },
          { label: 'Ainda estou descobrindo', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'Como você imagina a frequência ideal pra você?',
        opcoes: [
          { label: 'Algumas vezes por semana', valor: 0 },
          { label: 'Uma vez por semana', valor: 1 },
          { label: 'Quero conversar sobre isso com o profissional', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere dar o próximo passo?',
        opcoes: [
          { label: 'WhatsApp ou mensagem', valor: 0 },
          { label: 'Receber informações e pensar', valor: 1 },
          { label: 'Agendar conversa exploratória', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'inquietacao_sofrimento',
    label: 'Inquietação ou sofrimento persistente',
    tituloQuiz: 'Sofrimento que você explica com “é stress” há tempo demais?',
    subtitulo: 'Nomear o que incomoda sem rótulo pronto. Não é diagnóstico.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais ocupa sua cabeça ultimamente?',
        opcoes: [
          { label: 'Ansiedade ou pensamento acelerado', valor: 0 },
          { label: 'Tristeza ou sensação de vazio', valor: 1 },
          { label: 'Culpa, vergonha ou autocrítica forte', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Isso interfere no sono, trabalho ou relações?',
        opcoes: [
          { label: 'Sim, de forma importante', valor: 0 },
          { label: 'Às vezes', valor: 1 },
          { label: 'Quero explorar com calma', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera de um processo analítico?',
        opcoes: [
          { label: 'Entender o que se repete na minha vida', valor: 0 },
          { label: 'Suportar melhor o que sinto', valor: 1 },
          { label: 'Ainda não sei dizer', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo ideal?',
        opcoes: [
          { label: 'Conversar no WhatsApp', valor: 0 },
          { label: 'Tirar dúvidas sobre método e valores', valor: 1 },
          { label: 'Agendar primeira sessão', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'relacoes_vinculos',
    label: 'Relações e vínculos',
    tituloQuiz: 'Mesmo padrão afetivo repetindo e você notou o fio condutor?',
    subtitulo: 'Contexto afetivo em claro. Não é aconselhamento de casal.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais pesa nas suas relações hoje?',
        opcoes: [
          { label: 'Padrões que se repetem com parceiros ou amigos', valor: 0 },
          { label: 'Solidão mesmo perto de alguém', valor: 1 },
          { label: 'Família de origem ainda muito presente', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já tentou outras formas de apoio?',
        opcoes: [
          { label: 'Sim, quero algo mais contínuo', valor: 0 },
          { label: 'Não, seria o começo', valor: 1 },
          { label: 'Quero combinar com orientação do analista', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que seria diferente se isso melhorasse?',
        opcoes: [
          { label: 'Mais liberdade pra escolher vínculos', valor: 0 },
          { label: 'Menos reatividade e sofrimento', valor: 1 },
          { label: 'Quero descobrir no processo', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Material e depois conversa', valor: 1 },
          { label: 'Agendar', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'luto_mudanca',
    label: 'Luto, perda ou mudança de fase',
    tituloQuiz: 'Luto ou ruptura e a dor não cabe no discurso dos outros?',
    subtitulo: 'Dar lugar ao que mudou. Não substitui rede de apoio urgente.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que está em jogo na sua vida agora?',
        opcoes: [
          { label: 'Perda de alguém ou de um projeto', valor: 0 },
          { label: 'Mudança de cidade, trabalho ou papel social', valor: 1 },
          { label: 'Fim de ciclo que ainda estou assimilando', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Como você tem nomeado o que sente?',
        opcoes: [
          { label: 'Dificuldade de falar com quem me conhece', valor: 0 },
          { label: 'Oscilo entre tristeza e anestesia', valor: 1 },
          { label: 'Preciso de espaço sem pressa de “passar”', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera da análise neste momento?',
        opcoes: [
          { label: 'Lugar pra falar sem ser julgado', valor: 0 },
          { label: 'Entender o que a perda ativou em mim', valor: 1 },
          { label: 'Reorganizar sentido e rotina', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Próximo passo?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Receber orientação por escrito', valor: 1 },
          { label: 'Agendar sessão', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'trabalho_sentido',
    label: 'Trabalho, criatividade ou sentido',
    tituloQuiz: 'Trabalho ocupa a cabeça e o sentido não aparece?',
    subtitulo: 'Vida profissional e desejo com profundidade. Não é coaching.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te incomoda hoje em relação ao trabalho ou estudo?',
        opcoes: [
          { label: 'Esgotamento ou falta de sentido', valor: 0 },
          { label: 'Medo de fracasso ou de ser exposto', valor: 1 },
          { label: 'Dúvida entre caminhos', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Isso aparece há quanto tempo?',
        opcoes: [
          { label: 'Semanas ou poucos meses', valor: 0 },
          { label: 'Anos, com altos e baixos', valor: 1 },
          { label: 'É recente mas intenso', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que você espera trazer para o setting?',
        opcoes: [
          { label: 'Fala livre sobre medo e desejo', valor: 0 },
          { label: 'Entender bloqueios antigos', valor: 1 },
          { label: 'Ainda estou formulando', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere seguir?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Conversa exploratória', valor: 1 },
          { label: 'Receber valores e formato', valor: 2 },
        ],
      },
    ],
  },
  {
    value: 'duvidas_formato',
    label: 'Dúvidas sobre formato (online, frequência, valores)',
    tituloQuiz: 'Frequência, divã, investimento — dúvidas que travam o primeiro sim?',
    subtitulo: 'Organize expectativas; o acordo fino fica com o profissional.',
    perguntas: [
      {
        id: 'p1',
        texto: 'O que mais te trava pra começar?',
        opcoes: [
          { label: 'Não sei se prefiro presencial ou online', valor: 0 },
          { label: 'Valores e frequência', valor: 1 },
          { label: 'Medo de não saber o que falar no divã', valor: 2 },
        ],
      },
      {
        id: 'p2',
        texto: 'Você já fez terapia ou análise antes?',
        opcoes: [
          { label: 'Nunca', valor: 0 },
          { label: 'Outra abordagem, quero psicanálise agora', valor: 1 },
          { label: 'Já fiz análise, quero retomar', valor: 2 },
        ],
      },
      {
        id: 'p3',
        texto: 'O que seria um bom primeiro passo?',
        opcoes: [
          { label: 'Tirar dúvidas objetivas no Zap', valor: 0 },
          { label: 'Uma sessão experimental ou conversa', valor: 1 },
          { label: 'Receber contrato ou orientações por escrito', valor: 2 },
        ],
      },
      {
        id: 'p4',
        texto: 'Como prefere continuar?',
        opcoes: [
          { label: 'WhatsApp', valor: 0 },
          { label: 'Agendar', valor: 1 },
          { label: 'E-mail ou formulário', valor: 2 },
        ],
      },
    ],
  },
]

export const PSICANALISE_DEMO_CLIENTE_NICHOS = NICHOS.map(({ value, label }) => ({ value, label }))

export function getPsicanaliseDemoClienteConfig(
  nicho: string | null | undefined
): PsicanaliseDemoNichoClienteConfig | null {
  if (!nicho) return null
  return NICHOS.find((n) => n.value === nicho) ?? null
}

export function isPsicanaliseDemoNicho(s: string): s is PsicanaliseDemoNicho {
  return NICHOS.some((n) => n.value === s)
}
