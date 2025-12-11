import { Metadata } from 'next'
import { getFullOGImageUrl, getOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'

function resolveAppBaseUrl() {
  const directUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

  if (directUrl) {
    return directUrl
  }

  // Desenvolvimento local
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  return 'https://www.ylada.com'
}

export async function generateMetadata({ params }: { params: Promise<{ 'user-slug': string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const userSlug = resolvedParams['user-slug']
  
  const baseUrl = resolveAppBaseUrl()
  const pageUrl = `${baseUrl}/pt/wellness/${userSlug}/hom`
  
  // Obter mensagens OG específicas da HOM (igual às outras ferramentas)
  const ogMessages = getOGMessages('hom')
  
  // Obter imagem OG específica da HOM (PNG para melhor qualidade)
  const ogImageUrl = getFullOGImageUrl('hom', baseUrl, 'wellness')
  
  // Garantir que a URL seja absoluta (igual às outras ferramentas)
  const absoluteImageUrl = ogImageUrl.startsWith('http') 
    ? ogImageUrl 
    : `${baseUrl}${ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`}`

  return {
    title: `${ogMessages.title} - WELLNESS`,
    description: ogMessages.description,
    openGraph: {
      title: `${ogMessages.title} - WELLNESS`,
      description: ogMessages.description,
      url: pageUrl,
      siteName: 'WELLNESS - Your Leading Data System',
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: ogMessages.title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ogMessages.title} - WELLNESS`,
      description: ogMessages.description,
      images: [absoluteImageUrl],
    },
  }
}

export default function HOMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
