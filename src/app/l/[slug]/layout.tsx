/**
 * Layout com metadata dinâmica para links YLADA (`/l/[slug]` e `/l/[slug]/[membro]`).
 * `og:image` usa o mesmo host do pedido (ex.: www.ylada.com) para a prévia no WhatsApp carregar a imagem.
 */
import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_OG_UNIFIED_SHARE_CARD_PATH } from '@/lib/ylada-og-fallback-logo'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'
import {
  buildEsteticaAestheticsOgDescriptionFallback,
  getProEsteticaPublicDynamicOgCardImageUrl,
  getProEsteticaPublicOpenGraphImageUrl,
} from '@/lib/pro-estetica/pro-estetica-public-link-og'
import { getProLideresPresetOpenGraphImageUrl } from '@/lib/pro-lideres/pro-lideres-preset-og-image'
import { getYladaOgImageUrl } from '@/lib/ylada-og-tema-imagem'
import { normalizeYladaPublicLinkPathSegment } from '@/lib/ylada-public-link-path-normalize'

function ogImageMime(url: string): 'image/jpeg' | 'image/png' | 'image/webp' {
  if (url.includes('.png')) return 'image/png'
  if (url.includes('.webp')) return 'image/webp'
  return 'image/jpeg'
}

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl = await resolveYladaOgBaseUrlForMetadata()
  const { slug: slugRaw } = await params
  const slug = slugRaw ? normalizeYladaPublicLinkPathSegment(slugRaw) : ''
  if (!slug) {
    return defaultMetadata('Link YLADA', baseUrl)
  }

  if (!supabaseAdmin) {
    return defaultMetadata('Link YLADA', baseUrl)
  }

  const { data: link, error } = await supabaseAdmin
    .from('ylada_links')
    .select('title, config_json, segment, template_id')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  if (error || !link) {
    return defaultMetadata('Link YLADA', baseUrl)
  }

  const config = (link.config_json as Record<string, unknown>) ?? {}
  const meta = (config.meta as Record<string, unknown>) ?? {}
  const page = (config.page as Record<string, unknown>) ?? {}

  const title =
    (page.title as string) ?? (config.title as string) ?? (link.title as string) ?? 'Link inteligente'
  const themeRaw =
    (meta.theme_raw as string) ?? (meta.theme as string) ?? (meta.theme_display as string) ?? ''
  const segment = (meta.segment_code as string) ?? (link.segment as string) ?? null
  const proLideresFluxoId =
    typeof meta.pro_lideres_fluxo_id === 'string' ? meta.pro_lideres_fluxo_id.trim() : ''
  const proLideresKindRaw =
    typeof meta.pro_lideres_kind === 'string' ? meta.pro_lideres_kind.trim().toLowerCase() : ''
  const proLideresKind = proLideresKindRaw === 'recruitment' || proLideresKindRaw === 'sales' ? proLideresKindRaw : null
  const isProLideresPreset = meta.pro_lideres_preset === true
  const diagnosisVerticalRaw =
    typeof meta.diagnosis_vertical === 'string' ? meta.diagnosis_vertical.trim().toLowerCase() : ''
  const proEsteticaVertical =
    diagnosisVerticalRaw === 'capilar' || diagnosisVerticalRaw === 'corporal' ? diagnosisVerticalRaw : null
  const linkTemplateId = typeof link.template_id === 'string' ? link.template_id.trim() : ''
  const segmentLower = (segment || '').toLowerCase().trim()
  const isAestheticsSegment = segmentLower === 'estetica' || segmentLower === 'aesthetics'

  const useProEsteticaDynamicOgCard =
    Boolean(proEsteticaVertical) && process.env.NEXT_PUBLIC_PRO_ESTETICA_DYNAMIC_OG_CARD !== 'false'

  const ogImageUrl =
    isProLideresPreset
      ? getProLideresPresetOpenGraphImageUrl(proLideresFluxoId, baseUrl, proLideresKind)
      : proEsteticaVertical && useProEsteticaDynamicOgCard
        ? getProEsteticaPublicDynamicOgCardImageUrl(baseUrl, slug)
        : proEsteticaVertical
          ? getProEsteticaPublicOpenGraphImageUrl(
              proEsteticaVertical,
              themeRaw || title,
              segment,
              baseUrl,
              linkTemplateId || null
            )
          : getYladaOgImageUrl(themeRaw || title, segment, baseUrl)
  const ogMime =
    proEsteticaVertical && useProEsteticaDynamicOgCard ? 'image/png' : ogImageMime(ogImageUrl)
  const pageUrl = `${baseUrl.replace(/\/$/, '')}/l/${slug}`
  const ogFromPage = typeof page.og_description === 'string' ? page.og_description.trim() : ''
  const esteticaOgFallback =
    isAestheticsSegment && !ogFromPage
      ? buildEsteticaAestheticsOgDescriptionFallback(title, themeRaw || null)
      : null
  const description =
    ogFromPage ||
    esteticaOgFallback ||
    (((page.subtitle as string | undefined) ??
      (config.description as string | undefined)) ??
      'Faça o quiz e descubra seu resultado personalizado.')

  return {
    title: `${title} | YLADA`,
    description,
    openGraph: {
      title: `${title} | YLADA`,
      description,
      url: pageUrl,
      siteName: 'YLADA',
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: ogMime,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | YLADA`,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

function defaultMetadata(title: string, base: string): Metadata {
  const defaultImage = `${base.replace(/\/$/, '')}${YLADA_OG_UNIFIED_SHARE_CARD_PATH}`
  return {
    title: `${title} | YLADA`,
    description: 'Link inteligente com quiz personalizado.',
    openGraph: {
      title: `${title} | YLADA`,
      description: 'Link inteligente com quiz personalizado.',
      url: base,
      siteName: 'YLADA',
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: 'YLADA',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | YLADA`,
      description: 'Link inteligente com quiz personalizado.',
      images: [defaultImage],
    },
  }
}

export default function PublicLinkSlugLayout({ children }: Props) {
  return <>{children}</>
}
