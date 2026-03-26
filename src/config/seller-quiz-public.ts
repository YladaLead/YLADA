/**
 * Quiz Vendedores — /pt/seller.
 * Imparcial para quem vende (loja, serviço, digital, etc.). Sem vínculo a marca ou rede específica.
 * Jornada Wellness: menu Wellness no app.
 */

import {
  MATRIX_PUBLIC_QUIZ_QUESTIONS_BASE,
  personalizeMatrixPublicQuizForNicho,
} from '@/config/matrix-public-quiz-base'
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

export const SELLER_QUIZ_RESULT_COPY = {
  headline: 'Menos ida e volta: contato mais preparado antes do Zap',
  subLines: [
    'Serve vendedores de qualquer ramo — o fluxo se adapta ao cenário que você escolheu',
    'Menos repetir o básico na primeira mensagem',
    'Na sequência você vê um exemplo na prática',
  ] as const,
  ctaPrimary: 'Ver na prática agora',
  ctaMicro:
    'Depois: seu canal e o fluxo como o cliente veria. Wellness tem entrada própria no app; aqui é funil imparcial de vendedor.',
} as const
