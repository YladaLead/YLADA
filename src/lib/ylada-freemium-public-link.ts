import { supabaseAdmin } from '@/lib/supabase'
import { hasYladaProPlan } from '@/lib/subscription-helpers'

/**
 * Dono sem Pro com mais de um link `active`: só o mais antigo (`created_at`) permanece público.
 * Os demais não geram quiz/resultado para visitantes — estimula reativar o Pro.
 */
export async function isYladaLinkHiddenFromPublicDueToFreemium(
  ownerUserId: string | null | undefined,
  linkId: string,
  linkStatus: string
): Promise<boolean> {
  if (!ownerUserId || !supabaseAdmin) return false
  if (linkStatus !== 'active') return false

  const isPro = await hasYladaProPlan(ownerUserId)
  if (isPro) return false

  const { data: actives, error } = await supabaseAdmin
    .from('ylada_links')
    .select('id')
    .eq('user_id', ownerUserId)
    .eq('status', 'active')
    .order('created_at', { ascending: true })

  if (error || !actives?.length) return false
  if (actives.length <= 1) return false

  const allowedId = actives[0].id as string
  return linkId !== allowedId
}
