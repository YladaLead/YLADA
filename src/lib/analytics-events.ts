/**
 * Estrutura para eventos de analytics/tracking.
 * Preparado para integração futura (GA4, Mixpanel, PostHog, etc.).
 *
 * Uso sugerido:
 *   import { trackEvent } from '@/lib/analytics-events'
 *   trackEvent('perfil_completo', { area: 'estetica', profession: 'estetica' })
 *
 * Por enquanto, os eventos são apenas logados em dev.
 * Implementar o envio real quando o provedor de analytics for definido.
 */

export type AnalyticsEventName =
  | 'onboarding_iniciado'
  | 'onboarding_concluido'
  | 'perfil_completo'
  | 'perfil_step_avancado'
  | 'noel_sugestao_clicada'
  | 'link_criado'
  | 'diagnostico_gerado'
  | 'estetica_landing_escolha_inicial'
  | 'estetica_demo_local'
  | 'estetica_demo_inicio'
  | 'estetica_demo_nicho'
  | 'estetica_demo_cliente_concluiu'
  | 'nutri_landing_escolha_inicial'
  | 'nutri_demo_local'
  | 'nutri_demo_inicio'
  | 'nutri_demo_nicho'
  | 'nutri_demo_cliente_concluiu'

export interface AnalyticsEventPayload {
  area?: string
  profession?: string
  step?: string
  [key: string]: unknown
}

let _tracker: ((name: AnalyticsEventName, payload?: AnalyticsEventPayload) => void) | null = null

/**
 * Define a função que será chamada ao disparar eventos.
 * Ex.: trackEvent = (name, payload) => gtag('event', name, payload)
 */
export function setAnalyticsTracker(
  fn: (name: AnalyticsEventName, payload?: AnalyticsEventPayload) => void
): void {
  _tracker = fn
}

/**
 * Dispara um evento de analytics.
 * Se nenhum tracker foi configurado, em dev faz log no console.
 */
export function trackEvent(name: AnalyticsEventName, payload?: AnalyticsEventPayload): void {
  if (_tracker) {
    _tracker(name, payload)
    return
  }
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, payload ?? {})
  }
}
