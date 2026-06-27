/**
 * Open Graph (prévia de WhatsApp/redes) das páginas "vídeo compartilhável" Pro Líderes.
 * Recebe título, descrição e imagem por página — cada link tem a própria prévia.
 */
import type { Metadata } from 'next'

export function buildProLideresVideoShareMetadata(
  baseUrl: string,
  pageUrl: string,
  opts: { title: string; description: string; imagePath: string }
): Pick<Metadata, 'title' | 'description' | 'openGraph' | 'twitter'> {
  const clean = baseUrl.replace(/\/$/, '')
  const image = opts.imagePath.startsWith('http')
    ? opts.imagePath
    : `${clean}${opts.imagePath.startsWith('/') ? opts.imagePath : `/${opts.imagePath}`}`

  return {
    title: opts.title,
    description: opts.description,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: pageUrl,
      siteName: 'YLADA Pro Líderes',
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: image,
          width: 1660,
          height: 1080,
          alt: opts.title,
          type: image.toLowerCase().includes('.png') ? 'image/png' : 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  }
}
