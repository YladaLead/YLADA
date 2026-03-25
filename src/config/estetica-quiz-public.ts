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
  microHint: string
  title: string
  options: EsteticaQuizOption[]
}

export const ESTETICA_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=estetica'
export const ESTETICA_QUIZ_LOGIN_HREF = '/pt/estetica/login'

export const ESTETICA_QUIZ_QUESTIONS: EsteticaQuizQuestion[] = [
  {
    id: 'conversa_inicio',
    microHint: 'A primeira impressão costuma definir o resto da conversa.',
    title: 'Hoje, no seu atendimento… como você sente que suas conversas começam?',
    options: [
      { value: 'interesse', label: 'A pessoa já chega interessada' },
      { value: 'explica', label: 'Preciso explicar bastante antes' },
      { value: 'preco', label: 'Muitas começam com “quanto custa?”' },
    ],
  },
  {
    id: 'apos_primeira',
    microHint: 'Isso é mais comum do que parece — não é só com você.',
    title: 'E depois da primeira conversa, normalmente…',
    options: [
      { value: 'agenda', label: 'A pessoa agenda rápido' },
      { value: 'duvida', label: 'Fica em dúvida' },
      { value: 'some', label: 'Some ou some o contato' },
    ],
  },
  {
    id: 'foco_tempo',
    microHint: 'Onde vai o tempo mostra o gargalo real.',
    title: 'Hoje você sente que seu tempo está mais focado em:',
    options: [
      { value: 'clientes', label: 'Atender quem já é cliente' },
      { value: 'mensagens', label: 'Explicar e responder mensagens' },
      { value: 'converter', label: 'Tentar converter quem ainda não decidiu' },
    ],
  },
  {
    id: 'mudaria',
    microHint: 'Boa — isso ajuda a ver o que priorizar.',
    title: 'Se você pudesse ajustar uma coisa hoje, seria:',
    options: [
      { value: 'prontos', label: 'Ter mais clientes já prontos pra agendar' },
      { value: 'menos_explicar', label: 'Explicar menos no começo' },
      { value: 'conversa', label: 'Aproveitar melhor cada conversa' },
    ],
  },
  {
    id: 'antes_contato',
    microHint: 'Quem entende melhor o que precisa… compara menos só por preço.',
    title: 'Antes de falar com você, quanto a pessoa costuma entender do que precisa?',
    options: [
      { value: 'pouco', label: 'Muito pouco — quase sempre do zero' },
      { value: 'as_vezes', label: 'Depende — às vezes sim, às vezes não' },
      { value: 'claro', label: 'Já chega bem clara na maioria das vezes' },
    ],
  },
  {
    id: 'filtro',
    microHint: 'Essa é a pergunta que mais pesa na rotina.',
    title: 'Se você pudesse falar mais com quem tem chance real de agendar — e menos com curioso… faria diferença pra você hoje?',
    options: [
      { value: 'muita', label: 'Sim, faria muita diferença' },
      { value: 'alguma', label: 'Sim, em parte' },
      { value: 'ver', label: 'Preciso ver na prática' },
    ],
  },
]

export interface EsteticaQuizDiagnosis {
  headline: string
  bullets: string[]
  bridge: string
}

/**
 * Monta diagnóstico curto a partir das respostas (sem API — instantâneo).
 */
export function buildEsteticaQuizDiagnosis(answers: Record<string, string>): EsteticaQuizDiagnosis {
  const a = answers

  const bullets: string[] = []

  if (a.conversa_inicio === 'preco' || a.apos_primeira === 'some') {
    bullets.push('Você atrai interesse, mas parte das conversas some antes de virar agendamento.')
  }
  if (a.conversa_inicio === 'explica' || a.foco_tempo === 'mensagens' || a.foco_tempo === 'converter') {
    bullets.push('Você ainda conduz boa parte do começo da conversa manualmente — e isso cansa.')
  }
  if (a.apos_primeira === 'duvida' || a.antes_contato === 'pouco') {
    bullets.push('Quem não entende bem o que precisa tende a comparar preço ou ficar na dúvida.')
  }
  if (a.mudaria === 'menos_explicar' || a.mudaria === 'prontos') {
    bullets.push('O próximo passo lógico é fazer a pessoa chegar mais preparada — não você explicar mais.')
  }

  const unique = [...new Set(bullets)]
  const trimmed = unique.slice(0, 3)

  if (trimmed.length === 0) {
    trimmed.push(
      'Você reúne interesse, mas o primeiro contato ainda pesa muito na sua rotina.',
      'Guiar com perguntas antes da conversa costuma aumentar clareza e chance de agendamento.',
    )
  } else if (trimmed.length === 1) {
    trimmed.push(
      'Um fluxo curto antes do WhatsApp ou Instagram ajuda a pessoa a chegar mais decidida.',
    )
  }

  return {
    headline: 'Diagnóstico rápido do seu atendimento',
    bullets: trimmed.slice(0, 3),
    bridge:
      'O YLADA usa o mesmo princípio: perguntas certas antes da conversa, pra cliente chegar mais decidida e você gastar menos tempo com curioso. Vale ver por dentro em menos de um minuto.',
  }
}
