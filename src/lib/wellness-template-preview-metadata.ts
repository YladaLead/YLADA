import type { Metadata } from 'next'
import { getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'

export function resolveWellnessAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.ylada.com')
  ).replace(/\/$/, '')
}

/**
 * Metadados OG para pré-visualização de links em /pt/wellness/templates/{segmento}.
 * Evita herdar o layout raiz ("Fale com 10 vezes mais pessoas" + wellness-hero).
 */
export function buildWellnessTemplatePreviewMetadata(
  templatePathSegment: string,
  pathname?: string
): Metadata {
  const baseUrl = resolveWellnessAppBaseUrl()
  const canonical = normalizeTemplateSlug(templatePathSegment)
  const ogMessages = getOGMessages(canonical)
  const ogImageUrl = getFullOGImageUrl(canonical, baseUrl, 'wellness')
  const absoluteImageUrl = ogImageUrl.startsWith('http')
    ? ogImageUrl
    : `${baseUrl}${ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`}`

  const pagePath =
    pathname?.match(/\/pt\/wellness\/templates\/[^/?#]+/i)?.[0] ||
    `/pt/wellness/templates/${templatePathSegment}`
  const pageUrl = `${baseUrl}${pagePath}`

  let title = ogMessages.title || 'Ferramenta de Bem-Estar'
  if (title.includes('WELLNESS')) {
    title = title.replace(/\s*-\s*WELLNESS\s*/gi, '').trim()
  }
  const description =
    ogMessages.description ||
    'Acesse ferramentas personalizadas para melhorar seu bem-estar e qualidade de vida.'

  return {
    title: `${title} - WELLNESS`,
    description,
    openGraph: {
      title: `${title} - WELLNESS`,
      description,
      url: pageUrl,
      siteName: 'WELLNESS - Your Leading Data System',
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type:
            absoluteImageUrl.includes('.jpg') || absoluteImageUrl.includes('.jpeg')
              ? 'image/jpeg'
              : 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - WELLNESS`,
      description,
      images: [absoluteImageUrl],
    },
  }
}
