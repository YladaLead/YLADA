import { Metadata } from 'next'
import { getFullOGImageUrl } from '@/lib/og-image-map'

export const metadata: Metadata = {
  title: 'Wellness System - Sistema Completo para Distribuidores',
  description: 'Plataforma completa para recrutar, vender e gerenciar seu negócio de bebidas funcionais. Acesse fluxos de diagnóstico, scripts, treinamentos e ferramentas.',
  openGraph: {
    title: 'Wellness System - Sistema Completo para Distribuidores',
    description: 'Plataforma completa para recrutar, vender e gerenciar seu negócio de bebidas funcionais. Acesse fluxos de diagnóstico, scripts, treinamentos e ferramentas.',
    url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'}/pt/wellness/system`,
    siteName: 'WELLNESS - Your Leading Data System',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: getFullOGImageUrl('system', process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com', 'wellness'),
        width: 1200,
        height: 630,
        alt: 'Wellness System - Sistema Completo para Distribuidores',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wellness System - Sistema Completo para Distribuidores',
    description: 'Plataforma completa para recrutar, vender e gerenciar seu negócio de bebidas funcionais.',
    images: [getFullOGImageUrl('system', process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com', 'wellness')],
  },
}

export default function WellnessSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

