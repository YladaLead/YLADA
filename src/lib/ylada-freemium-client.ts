/**
 * Eventos de conversão freemium (usuário logado): paywall e clique em upgrade.
 * POST /api/ylada/freemium-events
 */
import type { FreemiumConversionKind } from '@/config/freemium-limits'

export type FreemiumConversionEventType = 'freemium_paywall_view' | 'freemium_upgrade_cta_click'

export function trackFreemiumConversionEvent(
  eventType: FreemiumConversionEventType,
  payload: { surface: string; kind: FreemiumConversionKind }
): void {
  if (typeof window === 'undefined') return
  void fetch('/api/ylada/freemium-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      event_type: eventType,
      payload: {
        surface: payload.surface.slice(0, 120),
        kind: payload.kind,
      },
    }),
  }).catch(() => {})
}
