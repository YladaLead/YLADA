import type { Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProviderWrapper } from '@/components/providers/AuthProviderWrapper'
import CookieConsentBanner from '@/components/legal/CookieConsentBanner'
import PWAInitializer from '@/components/pwa/PWAInitializer'
import FacebookPixel from '@/components/analytics/FacebookPixel'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YLADA - Boas conversas começam com boas perguntas',
  description: 'Boas conversas começam com boas perguntas. Conecte-se através de links inteligentes.',
  keywords: 'leads, IA, inteligência artificial, geração de leads, marketing, ylada',
  authors: [{ name: 'YLADA Team' }],
  manifest: '/manifest.json',
  // Ícones em múltiplos tamanhos (Google recomenda 48x48 e 96x96 para resultados de busca)
  icons: {
    icon: [
      { url: '/images/logo/ylada/novo/ylada-icon-512.png', sizes: '48x48', type: 'image/png' },
      { url: '/images/logo/ylada/novo/ylada-icon-512.png', sizes: '96x96', type: 'image/png' },
      { url: '/images/logo/ylada/novo/ylada-icon-512.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/images/logo/ylada/novo/ylada-icon-512.png',
  },
  openGraph: {
    title: 'YLADA - Boas conversas começam com boas perguntas',
    description: 'Boas conversas começam com boas perguntas. Conecte-se através de links inteligentes.',
    url: 'https://www.ylada.com/pt',
    siteName: 'YLADA',
    images: [
      {
        // OG image 1200×630 com fundo sólido — obrigatório para WhatsApp/Facebook/LinkedIn
        url: 'https://www.ylada.com/images/logo/ylada/novo/ylada-og-1200x630.png',
        width: 1200,
        height: 630,
        alt: 'YLADA - Boas conversas começam com boas perguntas',
        type: 'image/png',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YLADA - Boas conversas começam com boas perguntas',
    description: 'Boas conversas começam com boas perguntas. Conecte-se através de links inteligentes.',
    images: ['https://www.ylada.com/images/logo/ylada/novo/ylada-og-1200x630.png'],
    creator: '@ylada',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

/** PWA / iOS: viewport-fit=cover + theme; meta viewport duplicado removido (Next injeta a partir daqui). */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Pixel ID do Facebook - usar variável de ambiente ou valor padrão
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '881640870918286' // YLADA NUTRI
  
  return (
    <html lang="pt" className="h-full">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="YLADA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/images/logo/ylada/novo/ylada-icon-512.png" />
        {/* Forçar não usar cache */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${inter.className} flex min-h-[100dvh] flex-col bg-white`}
        style={{
          margin: 0,
          padding:
            'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
        }}
      >
        <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col">
          <FacebookPixel pixelId={pixelId} />
          <PWAInitializer />
          <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </div>
        <CookieConsentBanner />
      </body>
    </html>
  )
}