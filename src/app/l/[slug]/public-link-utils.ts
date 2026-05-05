/**
 * Lógica compartilhada para páginas públicas de links (/l/[slug], /en/l/[slug], /es/l/[slug]).
 */
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { isYladaLinkHiddenFromPublicDueToFreemium } from '@/lib/ylada-freemium-public-link'
import { fetchWhatsappE164ForUserId } from '@/lib/ylada-public-link-whatsapp'
import { resolveProLideresMemberLinkAttribution } from '@/lib/pro-lideres-member-link-tokens-resolve'

export type PublicLinkPayload = {
  slug: string
  type: 'diagnostico' | 'calculator'
  title: string
  config: Record<string, unknown>
  ctaWhatsapp: string | null
  /** Dono do link (sessão igual = não contar view/start como visitante). */
  link_owner_user_id?: string | null
  /** Dono sem Pro com >1 link ativo: este não é o link “principal” (mais antigo) — visitante não usa o quiz. */
  accessBlockedDueToPlan?: boolean
  /**
   * URL /l/[slug]/[membro]: token canónico para telemetria (pl_m).
   * O segmento público pode ser `share_path_slug` legível; o cliente envia sempre o token.
   */
  proLideresAttributionToken?: string | null
}

export type PublicLinkFetchOptions = {
  /** Segundo segmento em /l/[slug]/[valor] — token ou share_path_slug Pro Líderes. */
  memberShareSegment?: string | null
}

export async function fetchPublicLinkPayload(
  slug: string,
  options?: PublicLinkFetchOptions
): Promise<PublicLinkPayload> {
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

  const configEarly = (link.config_json as Record<string, unknown>) ?? {}
  const metaEarly = (configEarly.meta as Record<string, unknown> | undefined) ?? {}
  const isProLideresPresetLink = metaEarly.pro_lideres_preset === true

  if (link.user_id && !isProLideresPresetLink) {
    const hidden = await isYladaLinkHiddenFromPublicDueToFreemium(link.user_id, link.id, link.status)
    if (hidden) {
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
        link_owner_user_id: link.user_id ?? null,
        accessBlockedDueToPlan: true,
        proLideresAttributionToken: null,
      }
    }
  }

  const memberSeg = options?.memberShareSegment?.trim()

  const config = (link.config_json as Record<string, unknown>) ?? {}
  const meta = config.meta as Record<string, unknown> | undefined
  /**
   * Links criados pelo Noel / generate (Etapa 6) trazem `meta.flow_id` + `meta.architecture`.
   * Se `meta` vier incompleta na BD mas o JSON tiver `page` + `form.fields` (formato unificado),
   * ainda assim é um quiz/diagnóstico — não usar `template_id` (ex.: calculadora de passos aleatória).
   */
  const formBlock = config.form as { fields?: unknown } | undefined
  const hasUnifiedPublicSurface =
    typeof config.page === 'object' &&
    config.page !== null &&
    typeof formBlock === 'object' &&
    formBlock !== null &&
    Array.isArray(formBlock.fields)
  const isFlowLike = !!(meta?.flow_id || meta?.architecture || hasUnifiedPublicSurface)

  /**
   * O tipo do template na BD deve prevalecer: calculadoras da biblioteca costumam vir só com
   * `fields` + `formula` (sem `meta.flow_id`). Se algum `meta.architecture` residual existir,
   * `isFlowLike` ficaria true e o link era tratado como diagnóstico — quebrando cálculo e resultado.
   */
  let type: 'diagnostico' | 'calculator' = 'diagnostico'
  if (link.template_id) {
    const { data: templateRow } = await supabaseAdmin
      .from('ylada_link_templates')
      .select('type')
      .eq('id', link.template_id)
      .maybeSingle()
    const tmplType = templateRow?.type
    if (tmplType === 'calculator') {
      type = 'calculator'
    } else if (tmplType === 'diagnostico') {
      type = 'diagnostico'
    } else if (!tmplType) {
      notFound()
    } else {
      notFound()
    }
  } else if (!isFlowLike) {
    notFound()
  }

  let ctaWhatsapp = link.cta_whatsapp ?? null
  if (!ctaWhatsapp && link.user_id) {
    ctaWhatsapp = await fetchWhatsappE164ForUserId(supabaseAdmin, link.user_id as string)
  }

  let proLideresAttributionToken: string | null = null
  if (memberSeg) {
    const row = await resolveProLideresMemberLinkAttribution(supabaseAdmin, link.id as string, memberSeg)
    if (!row) {
      notFound()
    }
    proLideresAttributionToken = row.token
    /** Sempre o número do membro (ou vazio) — nunca manter o WhatsApp do líder quando o link é atribuído a um membro. */
    ctaWhatsapp = await fetchWhatsappE164ForUserId(supabaseAdmin, row.member_user_id)
  }

  return {
    slug: link.slug,
    type,
    title:
      (config.page as Record<string, unknown>)?.title as string ??
      (config.title as string) ??
      link.title ??
      'Link',
    config,
    ctaWhatsapp,
    link_owner_user_id: link.user_id ?? null,
    proLideresAttributionToken,
  }
}
