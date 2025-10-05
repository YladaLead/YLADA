import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YLADA - Your Lead Advanced Data Assistant',
  description: 'Ferramentas avançadas de geração de leads para profissionais de bem-estar e qualidade de vida',
  keywords: 'leads, bem-estar, qualidade de vida, herbalife, distribuidores, profissionais, marketing',
  authors: [{ name: 'YLADA Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10B981',
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
        <meta name="apple-mobile-web-app-title" content="YLADA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10B981" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}