/**
 * Quiz Vendedores — /pt/seller.
 * Imparcial para quem vende (loja, serviço, digital, etc.). Sem vínculo a marca ou rede específica.
 * Jornada Wellness: menu Wellness no app.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
import { YLADA_QUIZ_POST_RESULT_COPY } from '@/config/ylada-quiz-result-post-copy'
import { SELLER_DEMO_CLIENTE_NICHOS } from '@/lib/seller-demo-cliente-data'

export const SELLER_QUIZ_CADASTRO_HREF = '/pt/cadastro?area=seller'
export const SELLER_QUIZ_VER_PRATICA_HREF = '/pt/seller/quiz/ver-pratica'
export const SELLER_QUIZ_LOGIN_HREF = '/pt/seller/login'

const SELLER_QUIZ_NICHO_CONTEXTO: Record<string, string> = {
  catalogo_revenda: 'portfólio amplo ou várias opções de venda',
  produto_direto: 'marca própria ou oferta enxuta',
  servico: 'serviço ou consulta',
  digital: 'ofertas digitais, assinatura ou infoproduto',
}

export function getSellerQuizLabelForNicho(nicho: string): string {
  return SELLER_DEMO_CLIENTE_NICHOS.find((n) => n.value === nicho)?.label ?? 'Seu negócio'
}

export function getSellerQuizQuestionsForNicho(nicho: string) {
  const label = getSellerQuizLabelForNicho(nicho)
  return personalizeMatrixPublicQuizForNicho(label, SELLER_QUIZ_NICHO_CONTEXTO, nicho)
}

export const SELLER_QUIZ_QUESTIONS = MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE

export const SELLER_QUIZ_RESULT_COPY = { ...YLADA_QUIZ_POST_RESULT_COPY } as const
