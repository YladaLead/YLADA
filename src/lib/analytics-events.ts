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
  | 'odonto_landing_escolha_inicial'
  | 'odonto_demo_local'
  | 'odonto_demo_inicio'
  | 'odonto_demo_nicho'
  | 'odonto_demo_cliente_concluiu'
  | 'nutra_landing_escolha_inicial'
  | 'nutra_demo_local'
  | 'nutra_demo_inicio'
  | 'nutra_demo_nicho'
  | 'nutra_demo_cliente_concluiu'
  | 'psi_landing_escolha_inicial'
  | 'psi_demo_local'
  | 'psi_demo_inicio'
  | 'psi_demo_nicho'
  | 'psi_demo_cliente_concluiu'
  | 'med_landing_escolha_inicial'
  | 'med_demo_local'
  | 'med_demo_inicio'
  | 'med_demo_nicho'
  | 'med_demo_cliente_concluiu'
  | 'psicanalise_landing_escolha_inicial'
  | 'psicanalise_demo_local'
  | 'psicanalise_demo_inicio'
  | 'psicanalise_demo_nicho'
  | 'psicanalise_demo_cliente_concluiu'
  | 'perfumaria_landing_escolha_inicial'
  | 'perfumaria_demo_local'
  | 'perfumaria_demo_inicio'
  | 'perfumaria_demo_nicho'
  | 'perfumaria_demo_cliente_concluiu'
  | 'coach_landing_escolha_inicial'
  | 'coach_demo_local'
  | 'coach_demo_inicio'
  | 'coach_demo_nicho'
  | 'coach_demo_cliente_concluiu'
  | 'fitness_landing_escolha_inicial'
  | 'fitness_demo_local'
  | 'fitness_demo_inicio'
  | 'fitness_demo_nicho'
  | 'fitness_demo_cliente_concluiu'

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
