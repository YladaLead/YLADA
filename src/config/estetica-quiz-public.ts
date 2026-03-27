/**
 * Quiz profissional estética — entrada em /pt/estetica (com nicho) ou legado /pt/estetica/quiz → redirect.
 */

import { YLADA_QUIZ_POST_RESULT_COPY } from '@/config/ylada-quiz-result-post-copy'
import { ESTETICA_DEMO_CLIENTE_NICHOS } from '@/lib/estetica-demo-cliente-data'

export const ESTETICA_APRESENTACAO_HREF = '/pt/estetica/apresentacao'

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
/** Após o fluxo público: local + nicho → exemplo-cliente (?origem=matriz; URLs antigas ainda aceitas). */
export const ESTETICA_QUIZ_VER_PRATICA_HREF = '/pt/estetica/quiz/ver-pratica'
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
      { value: 'pouco', label: 'Muito pouco, quase sempre do zero' },
      { value: 'as_vezes', label: 'Depende: às vezes sim, às vezes não' },
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

/** Contexto curto para personalizar a pergunta “antes do contato” por nicho. */
const ESTETICA_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  pele: 'cuidados de pele e facial',
  cabelo: 'cabelo e tratamentos capilares',
  unhas: 'unhas e nail design',
  sobrancelha: 'sobrancelha e design',
  maquiagem: 'maquiagem',
  corporal: 'estética corporal',
}

export function getEsteticaQuizLabelForNicho(nicho: string): string {
  return ESTETICA_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Estética'
}

/** Perguntas iguais à base, com 1ª e 5ª ajustadas ao nicho (mais identificação). */
export function getEsteticaQuizQuestionsForNicho(nicho: string): EsteticaQuizQuestion[] {
  const label = getEsteticaQuizLabelForNicho(nicho)
  const ctx = ESTETICA_QUIZ_NICHO_CONTEXTO[nicho] ?? 'seus serviços'
  return ESTETICA_QUIZ_QUESTIONS.map((q) => {
    if (q.id === 'conversa_inicio') {
      return {
        ...q,
        title: `No seu foco em ${label}, como você sente que suas conversas começam?`,
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

/** Fechamento pós-quiz: pergunta + CTAs → cadastro (copy padrão matriz). */
export const ESTETICA_QUIZ_RESULT_COPY = { ...YLADA_QUIZ_POST_RESULT_COPY } as const
