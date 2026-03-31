/**
 * Funil marketing: landing /pt → segmentos → /pt/cadastro → cadastro (user_created).
 * Envia para POST /api/ylada/funnel-events (público; user_created exige sessão).
 */

export type YladaFunnelEventType =
  | 'funnel_landing_pt_view'
  | 'funnel_landing_cta_segmentos'
  | 'funnel_segmentos_view'
  | 'funnel_hub_segmento_clicado'
  | 'funnel_entrada_nicho'
  | 'funnel_cadastro_view'
  | 'funnel_cadastro_area_selected'

const SESSION_ID_KEY = 'ylada_funnel_client_sid_v1'

function getClientSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem(SESSION_ID_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

function oncePerSession(storageKey: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (sessionStorage.getItem(storageKey)) return false
    sessionStorage.setItem(storageKey, '1')
    return true
  } catch {
    return true
  }
}

/** Dispara evento de funil. use `onceKey` + oncePerSession para não duplicar no mesmo browser tab session. */
export function trackYladaFunnelEvent(
  eventType: YladaFunnelEventType,
  payload?: Record<string, unknown>,
  options?: { oncePerSessionKey?: string }
): void {
  if (typeof window === 'undefined') return
  if (options?.oncePerSessionKey && !oncePerSession(options.oncePerSessionKey)) return

  const client_session_id = getClientSessionId()
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const search = typeof window !== 'undefined' ? window.location.search : ''

  void fetch('/api/ylada/funnel-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      event_type: eventType,
      payload: {
        path,
        search,
        ...payload,
      },
      client_session_id: client_session_id || undefined,
    }),
  }).catch(() => {})
}

/** Após signup com sessão ativa — exige cookies; dedupe no servidor. */
export function trackYladaFunnelUserCreated(perfil: string): void {
  if (typeof window === 'undefined') return
  const client_session_id = getClientSessionId()
  void fetch('/api/ylada/funnel-events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      event_type: 'user_created',
      payload: { perfil },
      ...(client_session_id ? { client_session_id } : {}),
    }),
  }).catch(() => {})
}
