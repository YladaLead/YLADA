import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GLIVA - Seu Guia de Suplementos',
  description: 'App educativo sobre suplementos, vitaminas e nutrição',
  keywords: 'suplementos, vitaminas, nutrição, saúde, educação',
  authors: [{ name: 'GLIVA Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3B82F6',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
        <meta name="apple-mobile-web-app-title" content="GLIVA" />
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