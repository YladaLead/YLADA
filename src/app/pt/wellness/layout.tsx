import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { getFullOGImageUrl } from '@/lib/og-image-map'
import { validateProtectedAccess, isWellnessPublicPath } from '@/lib/auth-server'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'

// URL absoluta da imagem COM logo para WhatsApp (versão otimizada para OG)
const ogImageUrl = `${baseUrl}/images/wellness-hero-com-logo.png`

export const metadata: Metadata = {
  manifest: '/manifest-wellness.json',
  icons: {
    icon: '/images/logo/wellness-quadrado.png',
    apple: '/images/logo/wellness-quadrado.png',
  },
  title: 'Fale com 10 vezes mais pessoas de forma simples, eficiente e eficaz - WELLNESS',
  description: 'Fale com 10 vezes mais pessoas de forma simples, eficiente e eficaz. Com os links inteligentes e o NOEL, você para de adivinhar e começa a agir com clareza.',
  openGraph: {
    title: 'Fale com 10 vezes mais pessoas de forma simples, eficiente e eficaz - WELLNESS',
    description: 'Fale com 10 vezes mais pessoas de forma simples, eficiente e eficaz. Com os links inteligentes e o NOEL, você para de adivinhar e começa a agir com clareza.',
    url: `${baseUrl}/pt/wellness`,
    siteName: 'WELLNESS - Your Leading Data System',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Fale com 10 vezes mais pessoas de forma simples, eficiente e eficaz - WELLNESS',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fale com 10 vezes mais pessoas de forma simples, eficiente e eficaz - WELLNESS',
    description: 'Fale com 10 vezes mais pessoas de forma simples, eficiente e eficaz. Com os links inteligentes e o NOEL, você para de adivinhar e começa a agir com clareza.',
    images: [ogImageUrl],
  },
}

/**
 * Layout raiz Wellness: em rotas não públicas exige login + assinatura ativa.
 * Sem mensalidade em dia → redirect para /pt/wellness/checkout.
 */
export default async function WellnessLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''

  // Exigir login + assinatura em qualquer rota wellness que não seja explicitamente pública.
  // Sem pathname (header não setado) tratamos como protegida por segurança.
  const isPublic = pathname ? isWellnessPublicPath(pathname) : false
  if (!isPublic) {
    await validateProtectedAccess('wellness', {
      requireSubscription: true,
      allowAdmin: true,
      allowSupport: true,
      excludeRoutesFromSubscription: [],
      currentPath: pathname,
    })
  }

  return <>{children}</>
}

