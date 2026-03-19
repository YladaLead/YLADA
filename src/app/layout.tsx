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
      { url: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png', sizes: '48x48', type: 'image/png' },
      { url: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png', sizes: '96x96', type: 'image/png' },
      { url: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png',
  },
  openGraph: {
    title: 'YLADA - Boas conversas começam com boas perguntas',
    description: 'Boas conversas começam com boas perguntas. Conecte-se através de links inteligentes.',
    url: 'https://www.ylada.com',
    siteName: 'YLADA',
    images: [
      {
        url: 'https://www.ylada.com/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png',
        width: 1080,
        height: 1080,
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
    images: ['https://www.ylada.com/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'],
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

// Viewport completo (com viewport-fit=cover para PWA) está no <head> abaixo
export const viewport = {
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
    <html lang="pt">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="YLADA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png" />
        {/* Forçar não usar cache */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className} style={{ margin: 0, minHeight: '100dvh', minHeight: '100vh', background: '#ffffff', padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)' }}>
        <FacebookPixel pixelId={pixelId} />
        <PWAInitializer />
        <AuthProviderWrapper>
          {children}
          <CookieConsentBanner />
        </AuthProviderWrapper>
      </body>
    </html>
  )
}