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
  | 'estetica_quiz_step'
  | 'estetica_quiz_concluiu'
  | 'estetica_quiz_ver_pratica'
  | 'estetica_entrada_nicho'
  | 'estetica_cadastro_promo_view'
  | 'estetica_cadastro_promo_cta'
  | 'nutri_landing_escolha_inicial'
  | 'nutri_demo_local'
  | 'nutri_demo_inicio'
  | 'nutri_demo_nicho'
  | 'nutri_demo_cliente_concluiu'
  | 'nutri_entrada_nicho'
  | 'nutri_quiz_step'
  | 'nutri_quiz_concluiu'
  | 'nutri_quiz_ver_pratica'
  | 'nutri_cadastro_promo_cta'
  | 'odonto_cadastro_promo_cta'
  | 'odonto_landing_escolha_inicial'
  | 'odonto_demo_local'
  | 'odonto_demo_inicio'
  | 'odonto_demo_nicho'
  | 'odonto_demo_cliente_concluiu'
  | 'odonto_entrada_nicho'
  | 'odonto_quiz_step'
  | 'odonto_quiz_concluiu'
  | 'odonto_quiz_ver_pratica'
  | 'nutra_cadastro_promo_cta'
  | 'nutra_landing_escolha_inicial'
  | 'nutra_demo_local'
  | 'nutra_demo_inicio'
  | 'nutra_demo_nicho'
  | 'nutra_demo_cliente_concluiu'
  | 'nutra_entrada_nicho'
  | 'nutra_quiz_step'
  | 'nutra_quiz_concluiu'
  | 'nutra_quiz_ver_pratica'
  | 'psi_cadastro_promo_cta'
  | 'psi_landing_escolha_inicial'
  | 'psi_demo_local'
  | 'psi_demo_inicio'
  | 'psi_demo_nicho'
  | 'psi_demo_cliente_concluiu'
  | 'psi_entrada_nicho'
  | 'psi_quiz_step'
  | 'psi_quiz_concluiu'
  | 'psi_quiz_ver_pratica'
  | 'med_cadastro_promo_cta'
  | 'med_landing_escolha_inicial'
  | 'med_demo_local'
  | 'med_demo_inicio'
  | 'med_demo_nicho'
  | 'med_demo_cliente_concluiu'
  | 'med_entrada_nicho'
  | 'med_quiz_step'
  | 'med_quiz_concluiu'
  | 'med_quiz_ver_pratica'
  | 'psicanalise_cadastro_promo_cta'
  | 'psicanalise_landing_escolha_inicial'
  | 'psicanalise_demo_local'
  | 'psicanalise_demo_inicio'
  | 'psicanalise_demo_nicho'
  | 'psicanalise_demo_cliente_concluiu'
  | 'psicanalise_entrada_nicho'
  | 'psicanalise_quiz_step'
  | 'psicanalise_quiz_concluiu'
  | 'psicanalise_quiz_ver_pratica'
  | 'perfumaria_cadastro_promo_cta'
  | 'perfumaria_landing_escolha_inicial'
  | 'perfumaria_demo_local'
  | 'perfumaria_demo_inicio'
  | 'perfumaria_demo_nicho'
  | 'perfumaria_demo_cliente_concluiu'
  | 'perfumaria_entrada_nicho'
  | 'perfumaria_quiz_step'
  | 'perfumaria_quiz_concluiu'
  | 'perfumaria_quiz_ver_pratica'
  | 'coach_cadastro_promo_cta'
  | 'coach_landing_escolha_inicial'
  | 'coach_demo_local'
  | 'coach_demo_inicio'
  | 'coach_demo_nicho'
  | 'coach_demo_cliente_concluiu'
  | 'coach_entrada_nicho'
  | 'coach_quiz_step'
  | 'coach_quiz_concluiu'
  | 'coach_quiz_ver_pratica'
  | 'fitness_cadastro_promo_cta'
  | 'fitness_landing_escolha_inicial'
  | 'fitness_demo_local'
  | 'fitness_demo_inicio'
  | 'fitness_demo_nicho'
  | 'fitness_demo_cliente_concluiu'
  | 'fitness_entrada_nicho'
  | 'fitness_quiz_step'
  | 'fitness_quiz_concluiu'
  | 'fitness_quiz_ver_pratica'
  | 'joias_cadastro_promo_cta'
  | 'joias_landing_escolha_inicial'
  | 'joias_demo_local'
  | 'joias_demo_inicio'
  | 'joias_demo_nicho'
  | 'joias_demo_cliente_concluiu'
  | 'joias_entrada_nicho'
  | 'joias_entrada_linha'
  | 'joias_quiz_step'
  | 'joias_quiz_concluiu'
  | 'joias_quiz_ver_pratica'
  | 'seller_cadastro_promo_cta'
  | 'seller_landing_escolha_inicial'
  | 'seller_demo_local'
  | 'seller_demo_inicio'
  | 'seller_demo_nicho'
  | 'seller_demo_cliente_concluiu'
  | 'seller_entrada_nicho'
  | 'seller_quiz_step'
  | 'seller_quiz_concluiu'
  | 'seller_quiz_ver_pratica'
  | 'ylada_pos_onboarding_view'
  | 'ylada_pos_onboarding_noel_cta'
  | 'ylada_pos_onboarding_links_cta'
  | 'ylada_home_activation_compact_view'
  | 'ylada_home_activation_compact_cta'
  | 'ylada_home_activation_compact_dismiss'
  | 'ylada_activation_journey_view'
  | 'ylada_activation_journey_cta'
  | 'ylada_activation_journey_dismiss'
  | 'ylada_noel_home_expand'
  | 'ylada_noel_home_como_usar'
  | 'ylada_nina_support_whatsapp'
  | 'ylada_matrix_entrada_nicho'

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
