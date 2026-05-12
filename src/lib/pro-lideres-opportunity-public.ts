import { getSupabaseAdmin } from '@/lib/supabase'
import { isProLideresRedeTenant } from '@/lib/pro-lideres-server'
import type { LeaderTenantRow } from '@/types/leader-tenant'

/**
 * Dados públicos do tenant para `/pro-lideres/o/[slug]/oportunidade`.
 * Só tenants da rede (vertical h-lider); outros verticals não expõem esta rota.
 */
export async function fetchProLideresOpportunityTenantBySlug(
  slug: string
): Promise<Pick<LeaderTenantRow, 'slug' | 'display_name' | 'whatsapp' | 'opportunity_video_url' | 'vertical_code'> | null> {
  const s = typeof slug === 'string' ? slug.trim() : ''
  if (!s || s.length > 200) return null

  const admin = getSupabaseAdmin()
  if (!admin) return null

  const { data, error } = await admin
    .from('leader_tenants')
    .select('slug, display_name, whatsapp, opportunity_video_url, vertical_code')
    .eq('slug', s)
    .maybeSingle()

  if (error || !data) return null
  const row = data as Pick<LeaderTenantRow, 'slug' | 'display_name' | 'whatsapp' | 'opportunity_video_url' | 'vertical_code'>
  if (!isProLideresRedeTenant(row)) return null
  return row
}
