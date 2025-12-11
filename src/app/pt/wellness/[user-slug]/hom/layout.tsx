import { Metadata } from 'next'
import { getFullOGImageUrl } from '@/lib/og-image-map'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://ylada.app'

export async function generateMetadata({ params }: { params: Promise<{ 'user-slug': string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const userSlug = resolvedParams['user-slug']
  
  const pageUrl = `${baseUrl}/pt/wellness/${userSlug}/hom`
  // Usar imagem OG específica da HOM (PNG para melhor qualidade)
  const imageUrl = getFullOGImageUrl('hom', baseUrl, 'wellness')

  return {
    title: '🍹 Oportunidade: Bebidas Funcionais - HOM Gravada',
    description: 'Uma oportunidade de negócio que está transformando vidas. Assista à apresentação completa sobre o mercado de bebidas funcionais e descubra como começar.',
    openGraph: {
      title: '🍹 Oportunidade: Bebidas Funcionais',
      description: 'Uma oportunidade de negócio que está transformando vidas. Assista à apresentação completa sobre o mercado de bebidas funcionais.',
      url: pageUrl,
      siteName: 'WELLNESS - Your Leading Data System',
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Oportunidade: Bebidas Funcionais - HOM Gravada',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: '🍹 Oportunidade: Bebidas Funcionais',
      description: 'Uma oportunidade de negócio que está transformando vidas. Assista à apresentação completa.',
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
