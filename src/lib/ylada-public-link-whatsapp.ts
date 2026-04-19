import type { SupabaseClient } from '@supabase/supabase-js'

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

  return null
}
