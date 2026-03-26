/**
 * Cliente do mentor Noel na matriz com segmento `nutri` — mesmo endpoint e pilha de IA
 * que med, coach, estética, etc. (`POST /api/ylada/noel`).
 */

export type NoelConversationTurn = { role: 'user' | 'assistant'; content: string }

export async function fetchNutriMatrixNoel(
  fetchImpl: (url: string, options?: RequestInit) => Promise<Response>,
  message: string,
  conversationHistory: NoelConversationTurn[]
): Promise<{ response: Response; data: Record<string, unknown> }> {
  const res = await fetchImpl('/api/ylada/noel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversationHistory,
      area: 'nutri',
      segment: 'nutri',
      supportUi: 'matrix',
    }),
  })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  return { response: res, data }
}

export function matrixNoelLimitMessageFromResponse(
  response: Response,
  data: Record<string, unknown>
): string | null {
  if (response.status !== 403) return null
  if (data?.limit_reached && typeof data.message === 'string') return data.message
  return null
}
