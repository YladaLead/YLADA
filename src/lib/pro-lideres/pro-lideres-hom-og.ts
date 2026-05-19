/**
 * Open Graph da HOM pública Pro Líderes — mesma arte e copy da área Wellness.
 */
import type { Metadata } from 'next'
import { getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'

export function getProLideresHomOgImageAbsoluteUrl(baseUrl: string): string {
  const ogImageUrl = getFullOGImageUrl('hom', baseUrl, 'wellness')
  return ogImageUrl.startsWith('http')
    ? ogImageUrl
    : `${baseUrl.replace(/\/$/, '')}${ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`}`
}

export function buildProLideresHomShareMetadata(
  baseUrl: string,
  pageUrl: string
): Pick<Metadata, 'title' | 'description' | 'openGraph' | 'twitter'> {
  const ogMessages = getOGMessages('hom')
  const absoluteImageUrl = getProLideresHomOgImageAbsoluteUrl(baseUrl)
  const title = `${ogMessages.title} | YLADA Pro Líderes`

  return {
    title,
    description: ogMessages.description,
    openGraph: {
      title,
      description: ogMessages.description,
      url: pageUrl,
      siteName: 'YLADA Pro Líderes',
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: ogMessages.title,
          type: absoluteImageUrl.includes('.png') ? 'image/png' : 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: ogMessages.description,
      images: [absoluteImageUrl],
    },
  }
}
