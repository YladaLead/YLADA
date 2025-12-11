import { Metadata } from 'next'
import { getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://ylada.app'

export async function generateMetadata({ params }: { params: Promise<{ 'user-slug': string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const userSlug = resolvedParams['user-slug']
  
  const pageUrl = `${baseUrl}/pt/wellness/${userSlug}/hom`
  
  // Obter mensagens OG específicas da HOM (igual às outras ferramentas)
  const ogMessages = getOGMessages('hom')
  
  // Usar imagem OG específica da HOM (PNG para melhor qualidade)
  const imageUrl = getFullOGImageUrl('hom', baseUrl, 'wellness')

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
          url: imageUrl,
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
      images: [imageUrl],
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
