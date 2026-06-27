/**
 * Open Graph das páginas "vídeo compartilhável" Pro Líderes (HOM Herbalife, Início Rápido).
 * Reaproveita a arte/mensagens da HOM (chave 'hom').
 */
import type { Metadata } from 'next'
import { getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'

export function buildProLideresVideoShareMetadata(
  baseUrl: string,
  pageUrl: string,
  ogKey: string,
  pageTitle: string
): Pick<Metadata, 'title' | 'description' | 'openGraph' | 'twitter'> {
  const ogMessages = getOGMessages(ogKey)
  const ogImageUrl = getFullOGImageUrl(ogKey, baseUrl, 'wellness')
  const absoluteImageUrl = ogImageUrl.startsWith('http')
    ? ogImageUrl
    : `${baseUrl.replace(/\/$/, '')}${ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`}`
  const title = `${pageTitle} | YLADA Pro Líderes`

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
          alt: pageTitle,
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
