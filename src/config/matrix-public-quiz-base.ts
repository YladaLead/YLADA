/**
 * Perguntas base do quiz matriz (paridade Estética/Nutri) — personalização por nicho via
 * {@link personalizeMatrixPublicQuizForNicho}.
 */

import type { PublicFlowQuizQuestion } from '@/config/ylada-public-flow-types'

export const MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE: PublicFlowQuizQuestion[] = [
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
      { value: 'agenda', label: 'A pessoa agenda ou retorna rápido' },
      { value: 'duvida', label: 'Fica em dúvida' },
      { value: 'some', label: 'Some ou para de responder' },
    ],
  },
  {
    id: 'foco_tempo',
    title: 'Hoje você sente que seu tempo está mais focado em:',
    options: [
      { value: 'clientes', label: 'Atender quem já é paciente ou cliente' },
      { value: 'mensagens', label: 'Explicar e responder mensagens' },
      { value: 'converter', label: 'Tentar converter quem ainda não decidiu' },
    ],
  },
  {
    id: 'mudaria',
    title: 'Se você pudesse ajustar uma coisa hoje, seria:',
    options: [
      { value: 'prontos', label: 'Ter mais pessoas já prontas pra agendar' },
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

export function personalizeMatrixPublicQuizForNicho(
  _nichoLabel: string,
  contextoPorNicho: Record<string, string>,
  nicho: string
): PublicFlowQuizQuestion[] {
  const ctx = contextoPorNicho[nicho] ?? 'seus serviços'
  return MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE.map((q) => {
    if (q.id === 'conversa_inicio') {
      return {
        ...q,
        // Nicho já escolhido na etapa anterior — não repetir rótulo longo entre parênteses.
        title: 'Na sua área, como você sente que suas conversas começam?',
      }
    }
    if (q.id === 'antes_contato') {
      return {
        ...q,
        title: `Antes de falar com você sobre ${ctx}, quanto a pessoa costuma entender do que precisa?`,
      }
    }
    return q
  })
}
