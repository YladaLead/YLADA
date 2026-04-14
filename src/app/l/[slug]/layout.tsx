/**
 * Layout com metadata dinâmica para links YLADA (/l/[slug]).
 * Define og:image por tema/segmento para prévia correta no WhatsApp.
 */
import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'
import { getYladaOgImageUrl } from '@/lib/ylada-og-tema-imagem'
import { getFullOGImageUrl } from '@/lib/og-image-map'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://ylada.app'

function ogImageMime(url: string): 'image/jpeg' | 'image/png' {
  return url.includes('.png') ? 'image/png' : 'image/jpeg'
}

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!slug) {
    return defaultMetadata('Link YLADA', baseUrl)
  }

  if (!supabaseAdmin) {
    return defaultMetadata('Link YLADA', baseUrl)
  }

  const { data: link, error } = await supabaseAdmin
    .from('ylada_links')
    .select('title, config_json, segment')
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
  const isProLideresPreset = meta.pro_lideres_preset === true

  const ogImageUrl =
    isProLideresPreset && proLideresFluxoId
      ? getFullOGImageUrl(proLideresFluxoId, baseUrl, 'wellness')
      : getYladaOgImageUrl(themeRaw || title, segment, baseUrl)
  const ogMime = ogImageMime(ogImageUrl)
  const pageUrl = `${baseUrl}/l/${slug}`
  const description =
    (page.subtitle as string) ??
    (config.description as string) ??
    'Faça o quiz e descubra seu resultado personalizado.'

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
  const defaultImage = `${base.replace(/\/$/, '')}${YLADA_OG_FALLBACK_LOGO_PATH}`
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
