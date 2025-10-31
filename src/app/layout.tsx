import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YLADA - Transforme suas ideias em links inteligentes',
  description: 'Transforme suas ideias em links inteligentes em 60 segundos com IA',
  keywords: 'leads, IA, inteligência artificial, geração de leads, marketing, ylada',
  authors: [{ name: 'YLADA Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
    apple: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
  },
  openGraph: {
    title: 'YLADA - Transforme suas ideias em links inteligentes',
    description: 'Transforme suas ideias em links inteligentes em 60 segundos com IA',
    url: 'https://www.ylada.com',
    siteName: 'YLADA',
    images: [
      {
        url: 'https://www.ylada.com/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png',
        width: 1080,
        height: 1080,
        alt: 'YLADA - Transforme suas ideias em links inteligentes',
        type: 'image/png',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YLADA - Transforme suas ideias em links inteligentes',
    description: 'Transforme suas ideias em links inteligentes em 60 segundos com IA',
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YLADA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}