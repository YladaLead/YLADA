import type { SupabaseClient } from '@supabase/supabase-js'

export const PL_SCRIPT_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const MAX_SECTION_TITLE = 200
const MAX_SUBTITLE = 300
const MAX_ENTRY_TITLE = 200
const MAX_BODY = 20000
const MAX_HOW = 8000

export function clipSectionTitle(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim().slice(0, MAX_SECTION_TITLE)
  return s.length ? s : null
}

export function clipSubtitle(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim().slice(0, MAX_SUBTITLE)
  return s.length ? s : null
}

export function clipEntryTitle(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim().slice(0, MAX_ENTRY_TITLE)
  return s.length ? s : null
}

export function clipBody(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v).slice(0, MAX_BODY)
}

export function clipHowToUse(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim().slice(0, MAX_HOW)
  return s.length ? s : null
}

export async function resolveYladaLinkIdForOwner(
  admin: SupabaseClient,
  yladaLinkId: unknown,
  ownerUserId: string
): Promise<{ ok: true; id: string | null } | { ok: false; error: string }> {
  if (yladaLinkId === null || yladaLinkId === undefined || yladaLinkId === '') {
    return { ok: true, id: null }
  }
  const id = String(yladaLinkId).trim()
  if (!PL_SCRIPT_UUID_RE.test(id)) {
    return { ok: false, error: 'ID da ferramenta inválido.' }
  }
  const { data, error } = await admin.from('ylada_links').select('id').eq('id', id).eq('user_id', ownerUserId).maybeSingle()
  if (error || !data) {
    return { ok: false, error: 'Ferramenta não encontrada na tua conta YLADA.' }
  }
  return { ok: true, id }
}
