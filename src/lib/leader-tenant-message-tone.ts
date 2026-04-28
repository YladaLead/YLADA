import { isEsteticaMessageToneId } from '@/config/estetica-message-tone'

const NOTES_MAX = 400

export type MessageTonePatchResult =
  | { ok: true; patch: Record<string, string | null>; empty: boolean }
  | { ok: false; error: string }

/**
 * Extrai `message_tone` e `message_tone_notes` do body do PATCH (Pro Estética corporal).
 * `empty` true = nenhum dos dois campos veio no body (não alterar colunas).
 */
export function parseMessageTonePatchBody(body: Record<string, unknown>): MessageTonePatchResult {
  const hasTone = 'message_tone' in body
  const hasNotes = 'message_tone_notes' in body
  if (!hasTone && !hasNotes) {
    return { ok: true, patch: {}, empty: true }
  }

  const patch: Record<string, string | null> = {}

  if (hasTone) {
    const v = body.message_tone
    if (v === null || v === undefined || v === '') {
      patch.message_tone = null
    } else if (isEsteticaMessageToneId(v)) {
      patch.message_tone = v
    } else {
      return { ok: false, error: 'Tom inválido.' }
    }
  }

  if (hasNotes) {
    const raw = body.message_tone_notes
    if (raw === null || raw === undefined) {
      patch.message_tone_notes = null
    } else {
      const s = String(raw).trim()
      patch.message_tone_notes = s ? s.slice(0, NOTES_MAX) : null
    }
  }

  return { ok: true, patch, empty: false }
}
