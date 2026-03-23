/**
 * Lógica compartilhada para páginas públicas de links (/l/[slug], /en/l/[slug], /es/l/[slug]).
 */
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { isYladaLinkHiddenFromPublicDueToFreemium } from '@/lib/ylada-freemium-public-link'

export type PublicLinkPayload = {
  slug: string
  type: 'diagnostico' | 'calculator'
  title: string
  config: Record<string, unknown>
  ctaWhatsapp: string | null
  /** Dono sem Pro com >1 link ativo: este não é o link “principal” (mais antigo) — visitante não usa o quiz. */
  accessBlockedDueToPlan?: boolean
}

export async function fetchPublicLinkPayload(slug: string): Promise<PublicLinkPayload> {
  if (!supabaseAdmin) {
    console.error('[public-link] Supabase admin não disponível')
    notFound()
  }

  const { data: link, error } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, title, config_json, cta_whatsapp, status, template_id, user_id')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  if (error || !link) notFound()

  if (link.user_id) {
    const hidden = await isYladaLinkHiddenFromPublicDueToFreemium(link.user_id, link.id, link.status)
    if (hidden) {
      const configEarly = (link.config_json as Record<string, unknown>) ?? {}
      const pageTitle =
        (configEarly.page as Record<string, unknown> | undefined)?.title ??
        (configEarly.title as string) ??
        link.title ??
        'Link'
      return {
        slug: link.slug,
        type: 'diagnostico',
        title: typeof pageTitle === 'string' ? pageTitle : 'Link',
        config: {},
        ctaWhatsapp: null,
        accessBlockedDueToPlan: true,
      }
    }
  }

  const config = (link.config_json as Record<string, unknown>) ?? {}
  const meta = config.meta as Record<string, unknown> | undefined
  const isFlowLink = !!(meta?.flow_id || meta?.architecture)

  let type: 'diagnostico' | 'calculator' = 'diagnostico'
  if (!isFlowLink) {
    const { data: template } = await supabaseAdmin
      .from('ylada_link_templates')
      .select('type')
      .eq('id', link.template_id)
      .maybeSingle()
    const t = template?.type
    if (!t || !['diagnostico', 'calculator'].includes(t)) notFound()
    type = t as 'diagnostico' | 'calculator'
  }

  // Se o link não tem cta_whatsapp, buscar do perfil do usuário
  let ctaWhatsapp = link.cta_whatsapp ?? null
  if (!ctaWhatsapp && link.user_id) {
    // Buscar WhatsApp do perfil
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('whatsapp, country_code')
      .eq('user_id', link.user_id)
      .maybeSingle()
    
    const wp = (profile as { whatsapp?: string | null; country_code?: string | null } | null)?.whatsapp
    const countryCode = (profile as { country_code?: string | null } | null)?.country_code || 'BR'
    
    if (typeof wp === 'string' && wp.trim().length >= 10) {
      let num = wp.trim().replace(/\D/g, '')
      // Adicionar código do país se não tiver (BR = 55)
      if (countryCode === 'BR' && !num.startsWith('55')) {
        num = '55' + num
      }
      ctaWhatsapp = num
      console.log('[public-link-utils] WhatsApp encontrado no perfil:', { whatsapp: wp, formatado: ctaWhatsapp })
    } else {
      // Tentar buscar em ylada_noel_profile
      const { data: noelProfile } = await supabaseAdmin
        .from('ylada_noel_profile')
        .select('area_specific')
        .eq('user_id', link.user_id)
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
          ctaWhatsapp = num
          console.log('[public-link-utils] WhatsApp encontrado no perfil Noel:', { whatsapp: wpNoel, formatado: ctaWhatsapp })
        }
      }
    }
  }

  return {
    slug: link.slug,
    type,
    title: (config.page as Record<string, unknown>)?.title as string ?? (config.title as string) ?? link.title ?? 'Link',
    config,
    ctaWhatsapp,
  }
}
