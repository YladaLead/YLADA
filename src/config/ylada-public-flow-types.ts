/**
 * Tipos compartilhados do funil público (quiz → resultado → prévia → cadastro).
 * Fase 1: consumido por YladaPublicEntryFlow; primeira instância = Estética.
 */

import type { AnalyticsEventName } from '@/lib/analytics-events'

export interface PublicFlowQuizOption {
  value: string
  label: string
}

export interface PublicFlowQuizQuestion {
  id: string
  title: string
  options: PublicFlowQuizOption[]
}

export interface PublicFlowNichoOption {
  value: string
  label: string
}

/** Passo opcional antes do “nicho” comercial (ex.: Joias — linha de produto). */
export interface PublicFlowProdutoLinhaStep {
  queryKey: string
  options: PublicFlowNichoOption[]
  pickerTitle: string
  isValidLinha: (v: string | null) => v is string
  /** Analytics ao escolher a linha (declarar em analytics-events). */
  entradaLinha: AnalyticsEventName
}

export interface PublicFlowResultCopy {
  question: string
  ctaSim: string
  ctaSimCerteza: string
  /** Texto opcional abaixo dos botões */
  ctaMicro?: string
}

/** Eventos de analytics do fluxo de quiz por área (nomes já declarados em analytics-events). */
export interface PublicFlowQuizAnalytics {
  entradaNicho: AnalyticsEventName
  /** Só Joias: escolha joia fina / semijoia / bijuteria */
  entradaLinha?: AnalyticsEventName
  quizStep: AnalyticsEventName
  quizConcluiu: AnalyticsEventName
  /** CTA pós-quiz (ir para cadastro) — reutiliza evento de promo cadastro por área */
  cadastroPromoCta: AnalyticsEventName
}

/**
 * Configuração estática + funções para um funil público de uma área da matriz.
 */
export interface PublicFlowConfig {
  areaCodigo: string
  /** Prefixo sem barra final, ex. /pt/estetica */
  pathPrefix: string
  sessionStorageKey: string
  /** Redirect quando já autenticado no fluxo público */
  homePath: string
  logoHref: string
  /** Link “Apresentação” no header quando entradaComNicho */
  apresentacaoHref?: string
  loginHref: string
  /** Base da URL “ver na prática” (query de nicho acrescentada quando aplicável) */
  verPraticaHrefBase: string
  nichoQueryKey: string
  nichos: PublicFlowNichoOption[]
  nichoPickerTitle: string
  /** Joias: primeiro escolhe linha de produto; depois o “nicho” = foco comercial. */
  produtoLinhaStep?: PublicFlowProdutoLinhaStep
  resultCopy: PublicFlowResultCopy
  analytics: PublicFlowQuizAnalytics
  /** Classes extras no container raiz (ex.: estetica-touch, 100svh) */
  rootExtraClassName?: string
  /** Classes extras no main (ex.: estetica-safe-main-bottom) */
  mainExtraClassName?: string
  isValidNicho: (v: string | null) => v is string
  resolveQuestions: (
    entradaComNicho: boolean,
    nicho: string | null,
    produtoLinha?: string | null
  ) => PublicFlowQuizQuestion[]
}
