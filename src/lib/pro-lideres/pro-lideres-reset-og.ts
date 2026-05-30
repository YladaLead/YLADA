/**
 * Open Graph da landing Reset Metabólico — prévia no WhatsApp com logo.
 */
import type { Metadata } from 'next'
import {
  PRO_LIDERES_RESET_DEFAULT_HEADLINE,
  PRO_LIDERES_RESET_FRASE_SACOLA,
} from '@/lib/pro-lideres-reset-content'

const RESET_OG_IMAGE_PATH = '/images/pro-lideres/reset-metabolico-logo.png'

export function getProLideresResetOgImageAbsoluteUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '')
  return `${base}${RESET_OG_IMAGE_PATH}`
}

export function buildProLideresResetShareMetadata(
  baseUrl: string,
  pageUrl: string,
  headline = PRO_LIDERES_RESET_DEFAULT_HEADLINE
): Pick<Metadata, 'title' | 'description' | 'openGraph' | 'twitter'> {
  const absoluteImageUrl = getProLideresResetOgImageAbsoluteUrl(baseUrl)
  const title = `${headline} | YLADA Pro Líderes`
  const description = PRO_LIDERES_RESET_FRASE_SACOLA

  return {
    title,
    description,
    openGraph: {
      title: headline,
      description,
      url: pageUrl,
      siteName: 'Reset Metabólico',
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: absoluteImageUrl,
          width: 1024,
          height: 682,
          alt: headline,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: headline,
      description,
      images: [absoluteImageUrl],
    },
  }
}
