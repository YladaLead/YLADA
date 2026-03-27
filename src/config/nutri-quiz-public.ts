/**
 * Quiz profissional Nutri (matriz YLADA) — entrada em /pt/nutri com nicho, alinhado ao padrão Estética.
 * Quiz de carreira: /pt/nutri/quiz/legacy (/pt/nutri/quiz redireciona para /pt/nutri).
 */

import { YLADA_QUIZ_POST_RESULT_COPY } from '@/config/ylada-quiz-result-post-copy'
import { NUTRI_DEMO_CLIENTE_NICHOS } from '@/lib/nutri-demo-cliente-data'

export interface NutriQuizOption {
  value: string
  label: string
}

export interface NutriQuizQuestion {
  id: string
  title: string
  options: NutriQuizOption[]
}

export const NUTRI_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=nutri'
export const NUTRI_QUIZ_VER_PRATICA_HREF = '/pt/nutri/quiz/ver-pratica'
export const NUTRI_QUIZ_LOGIN_HREF = '/pt/nutri/login'

export const NUTRI_QUIZ_QUESTIONS: NutriQuizQuestion[] = [
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
      { value: 'some', label: 'Some ou some o contato' },
    ],
  },
  {
    id: 'foco_tempo',
    title: 'Hoje você sente que seu tempo está mais focado em:',
    options: [
      { value: 'clientes', label: 'Atender quem já é paciente' },
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

const NUTRI_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  emagrecimento: 'emagrecimento e composição',
  ganho_massa: 'ganho de massa e performance',
  reeducacao: 'reeducação alimentar',
  esporte: 'nutrição esportiva',
  gestante: 'gestação e nutrição materno-infantil',
  clinico: 'nutrição clínica',
}

export function getNutriQuizLabelForNicho(nicho: string): string {
  return NUTRI_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Nutrição'
}

export function getNutriQuizQuestionsForNicho(nicho: string): NutriQuizQuestion[] {
  const label = getNutriQuizLabelForNicho(nicho)
  const ctx = NUTRI_QUIZ_NICHO_CONTEXTO[nicho] ?? 'seus serviços'
  return NUTRI_QUIZ_QUESTIONS.map((q) => {
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

export const NUTRI_QUIZ_RESULT_COPY = { ...YLADA_QUIZ_POST_RESULT_COPY } as const
