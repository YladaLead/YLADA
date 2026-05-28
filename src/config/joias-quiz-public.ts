/**
 * Quiz Joias & bijuterias — /pt/joias.
 * Linha de produto (URL `linha`): joia fina, semijoia, bijuteria.
 * Foco comercial (URL `nicho`): marca própria, loja online, equipe, iniciando.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { snippetJoiasLinhaParaQuiz } from '@/config/joias-linha-produto'
import { JOIAS_DEMO_CLIENTE_NICHOS } from '@/lib/joias-demo-cliente-data'
import type { PublicFlowQuizQuestion } from '@/config/ylada-public-flow-types'

export const JOIAS_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=joias'
export const JOIAS_QUIZ_VER_PRATICA_HREF = '/pt/joias/quiz/ver-pratica'
export const JOIAS_QUIZ_LOGIN_HREF = '/pt/joias/login'

const JOIAS_QUIZ_FOCO_CONTEXTO: Record<string, string> = {
  marca_propria: 'marca própria e posicionamento',
  loja_online: 'loja online e vitrine digital',
  equipe_revenda: 'equipe e revendedoras',
  iniciando: 'quem está começando no ramo',
}

export function getJoiasQuizLabelForNicho(nicho: string): string {
  return JOIAS_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Joias e bijuterias'
}

function mergeQuizContextSnippet(linhaProduto: string | null | undefined, foco: string): string {
  const focoPart = JOIAS_QUIZ_FOCO_CONTEXTO[foco] ?? 'joias e bijuterias'
  if (linhaProduto && (linhaProduto === 'joia_fina' || linhaProduto === 'semijoia' || linhaProduto === 'bijuteria')) {
    return `${snippetJoiasLinhaParaQuiz(linhaProduto)} — ${focoPart}`
  }
  return focoPart
}

/**
 * Sobrescreve as perguntas genéricas com vocabulário correto para joias/bijuterias.
 * "agendamentos" → "vendas", "atendimento" → "conversa de venda".
 */
function adaptQuestionsForJoias(
  questions: PublicFlowQuizQuestion[]
): PublicFlowQuizQuestion[] {
  return questions.map((q) => {
    if (q.id === 'filtro') {
      return {
        ...q,
        title: 'Hoje isso está limitando suas vendas?',
      }
    }
    if (q.id === 'foco_tempo') {
      return {
        ...q,
        title: 'Hoje você sente que seu tempo está mais focado em:',
        options: [
          { value: 'clientes', label: 'Atender quem já compra de você' },
          { value: 'mensagens', label: 'Explicar e responder mensagens' },
          { value: 'converter', label: 'Tentar converter quem ainda não decidiu comprar' },
        ],
      }
    }
    if (q.id === 'mudaria') {
      return {
        ...q,
        title: 'Se você pudesse ajustar uma coisa hoje, seria:',
        options: [
          { value: 'prontos', label: 'Ter mais pessoas já prontas pra comprar' },
          { value: 'menos_explicar', label: 'Explicar menos sobre os produtos no começo' },
          { value: 'conversa', label: 'Aproveitar melhor cada conversa de venda' },
        ],
      }
    }
    if (q.id === 'antes_contato') {
      return {
        ...q,
        title: 'Antes de falar com você, quanto a cliente costuma saber o que quer comprar?',
        options: [
          { value: 'pouco', label: 'Muito pouco, quase sempre do zero' },
          { value: 'as_vezes', label: 'Depende: às vezes sim, às vezes não' },
          { value: 'claro', label: 'Já chega bem direcionada na maioria das vezes' },
        ],
      }
    }
    if (q.id === 'conversa_inicio') {
      return {
        ...q,
        title: 'Nas suas vendas, como você sente que as conversas costumam começar?',
        options: [
          { value: 'interesse', label: 'A cliente já chega interessada em algo específico' },
          { value: 'explica', label: 'Preciso explicar bastante sobre os produtos antes' },
          { value: 'preco', label: 'Muitas começam com "quanto custa?"' },
        ],
      }
    }
    if (q.id === 'apos_primeira') {
      return {
        ...q,
        title: 'E depois do primeiro contato, normalmente…',
        options: [
          { value: 'agenda', label: 'A cliente compra ou retorna rápido pra fechar' },
          { value: 'duvida', label: 'Fica em dúvida ou pede pra pensar' },
          { value: 'some', label: 'Some ou para de responder' },
        ],
      }
    }
    return q
  })
}

export function getJoiasQuizQuestionsForNicho(foco: string, linhaProduto?: string | null) {
  const label = getJoiasQuizLabelForNicho(foco)
  const merged = mergeQuizContextSnippet(linhaProduto ?? null, foco)
  const ctxMap: Record<string, string> = { [foco]: merged }
  const base = personalizeMatrixPublicQuizForNicho(label, ctxMap, foco)
  return adaptQuestionsForJoias(base)
}

export const JOIAS_QUIZ_QUESTIONS = adaptQuestionsForJoias(MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE)

/** Copy pós-quiz específico para joias — vocabulário de vendas, não de agendamentos. */
export const JOIAS_QUIZ_RESULT_COPY = {
  question: 'Você gostaria de ter mais vendas com clientes que já chegam qualificadas?',
  ctaSim: 'Sim',
  ctaSimCerteza: 'Sim, quero isso',
} as const
