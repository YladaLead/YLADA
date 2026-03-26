/**
 * Quiz público /pt/estetica/quiz — perguntas guiadas + diagnóstico + CTA cadastro.
 * Copy alinhada à entrada socrática e às dores de esteticista.
 */

export interface EsteticaQuizOption {
  value: string
  label: string
}

export interface EsteticaQuizQuestion {
  id: string
  title: string
  options: EsteticaQuizOption[]
}

export const ESTETICA_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=estetica'
export const ESTETICA_QUIZ_LOGIN_HREF = '/pt/estetica/login'

export const ESTETICA_QUIZ_QUESTIONS: EsteticaQuizQuestion[] = [
  {
    id: 'conversa_inicio',
    title: 'Hoje, no seu atendimento… como você sente que suas conversas começam?',
    options: [
      { value: 'interesse', label: 'A pessoa já chega interessada' },
      { value: 'explica', label: 'Preciso explicar bastante antes' },
      { value: 'preco', label: 'Muitas começam com “quanto custa?”' },
    ],
  },
  {
    id: 'apos_primeira',
    title: 'E depois da primeira conversa, normalmente…',
    options: [
      { value: 'agenda', label: 'A pessoa agenda rápido' },
      { value: 'duvida', label: 'Fica em dúvida' },
      { value: 'some', label: 'Some ou some o contato' },
    ],
  },
  {
    id: 'foco_tempo',
    title: 'Hoje você sente que seu tempo está mais focado em:',
    options: [
      { value: 'clientes', label: 'Atender quem já é cliente' },
      { value: 'mensagens', label: 'Explicar e responder mensagens' },
      { value: 'converter', label: 'Tentar converter quem ainda não decidiu' },
    ],
  },
  {
    id: 'mudaria',
    title: 'Se você pudesse ajustar uma coisa hoje, seria:',
    options: [
      { value: 'prontos', label: 'Ter mais clientes já prontos pra agendar' },
      { value: 'menos_explicar', label: 'Explicar menos no começo' },
      { value: 'conversa', label: 'Aproveitar melhor cada conversa' },
    ],
  },
  {
    id: 'antes_contato',
    title: 'Antes de falar com você, quanto a pessoa costuma entender do que precisa?',
    options: [
      { value: 'pouco', label: 'Muito pouco — quase sempre do zero' },
      { value: 'as_vezes', label: 'Depende — às vezes sim, às vezes não' },
      { value: 'claro', label: 'Já chega bem clara na maioria das vezes' },
    ],
  },
  {
    id: 'filtro',
    title: 'Hoje isso está limitando seus agendamentos?',
    options: [
      { value: 'muita', label: 'Sim, está limitando bastante' },
      { value: 'alguma', label: 'Sim, em parte' },
      { value: 'ver', label: 'Preciso enxergar melhor na prática' },
    ],
  },
]

/** Fechamento pós-quiz: curto, direto, foco no cadastro. */
export const ESTETICA_QUIZ_RESULT_COPY = {
  headline: 'Você poderia estar agendando muito mais',
  subLines: ['Pare de tentar convencer.', 'Faça sua cliente chegar pronta pra fechar.'] as const,
  ctaPrimary: 'Começar agora',
  ctaGratuito: 'Gratuito',
} as const
