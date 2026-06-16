/**
 * Resolve `/f/[formId]` → `/[perfil]/[fluxo]` quando o formulário tem user_slug + slug.
 */
import { supabaseAdmin } from '@/lib/supabase'
import { normalizeSlug } from '@/lib/slug-utils'

export async function resolveFormPublicUrl(formId: string): Promise<string | null> {
  const id = formId?.trim()
  if (!id || !supabaseAdmin) return null

  const { data: form } = await supabaseAdmin
    .from('custom_forms')
    .select('slug, user_id, is_active')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle()

  if (!form?.user_id || !form.slug) return null

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('user_slug')
    .eq('user_id', form.user_id)
    .maybeSingle()

  const userSlug = typeof profile?.user_slug === 'string' ? profile.user_slug.trim() : ''
  const formSlug = typeof form.slug === 'string' ? form.slug.trim() : ''
  if (!userSlug || !formSlug) return null

  return `/${normalizeSlug(userSlug)}/${normalizeSlug(formSlug)}`
}
