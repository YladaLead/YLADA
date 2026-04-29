import type { SupabaseClient } from '@supabase/supabase-js'

function normalizeBrWhatsappDigits(raw: string): string | null {
  let num = raw.trim().replace(/\D/g, '')
  if (num.length < 10) return null
  if (!num.startsWith('55') && num.length <= 11) {
    num = '55' + num
  }
  return num
}

/**
 * WhatsApp guardado em `leader_tenants` (ex.: perfil Pro Estética Corporal / Capilar),
 * onde o painel não replica o número para `user_profiles`.
 */
export async function fetchWhatsappE164FromLeaderTenants(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data: rows, error } = await supabase
    .from('leader_tenants')
    .select('whatsapp, vertical_code')
    .eq('owner_user_id', userId)

  if (error || !rows?.length) return null

  const verticalRank = (vc: string | null | undefined) => {
    const v = (vc ?? '').trim()
    if (v === 'estetica-corporal') return 3
    if (v === 'estetica-capilar') return 2
    return 1
  }

  const sorted = [...rows].sort(
    (a, b) => verticalRank(b.vertical_code as string) - verticalRank(a.vertical_code as string)
  )

  for (const row of sorted) {
    const wp = (row as { whatsapp?: string | null }).whatsapp
    if (typeof wp !== 'string' || wp.trim().length < 10) continue
    const n = normalizeBrWhatsappDigits(wp)
    if (n) return n
  }

  return null
}

/**
 * Resolve número E.164 (só dígitos, BR com 55) para CTA WhatsApp de um utilizador.
 */
export async function fetchWhatsappE164ForUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('whatsapp, country_code')
    .eq('user_id', userId)
    .maybeSingle()

  const wp = (profile as { whatsapp?: string | null; country_code?: string | null } | null)?.whatsapp
  const countryCode = (profile as { country_code?: string | null } | null)?.country_code || 'BR'

  if (typeof wp === 'string' && wp.trim().length >= 10) {
    let num = wp.trim().replace(/\D/g, '')
    if (countryCode === 'BR' && !num.startsWith('55')) {
      num = '55' + num
    }
    return num
  }

  const { data: noelProfile } = await supabase
    .from('ylada_noel_profile')
    .select('area_specific')
    .eq('user_id', userId)
    .maybeSingle()

  if (noelProfile?.area_specific) {
    const areaSpecific = noelProfile.area_specific as Record<string, unknown>
    const wpNoel = areaSpecific.whatsapp as string | undefined
    if (typeof wpNoel === 'string' && wpNoel.trim().length >= 10) {
      let num = wpNoel.trim().replace(/\D/g, '')
      const countryCodeNoel = (areaSpecific.country_code as string) || 'BR'
      if (countryCodeNoel === 'BR' && !num.startsWith('55')) {
        num = '55' + num
      }
      return num
    }
  }

  const fromTenant = await fetchWhatsappE164FromLeaderTenants(supabase, userId)
  if (fromTenant) return fromTenant

  return null
}
