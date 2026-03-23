import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'
import { validateProtectedAccess, isNutriPublicPath } from '@/lib/auth-server'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'

// Mesma imagem OG do layout raiz (marca YLADA), para prévia no WhatsApp/redes não usar capa de vídeo
const ogImageUrl = `${baseUrl}/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png`
const nutriPageUrl = `${baseUrl}/pt/nutri`

// Título e descrição para a prévia do link (WhatsApp, redes) — vídeo para assistir, foco em atrair pacientes certos
const ogTitle = 'Links que atraem os pacientes certos | YLADA Nutri'
const ogDescription = 'Assista: como usar links que atraem os pacientes certos e preencher a agenda. Sistema para nutricionistas.'

export const metadata: Metadata = {
  manifest: '/manifest-nutri.json',
  icons: {
    icon: '/images/logo/nutri-quadrado.png',
    apple: '/images/logo/nutri-quadrado.png',
  },
  title: 'YLADA Nutri - Você precisa se tornar uma Nutri-Empresária',
  description: 'O sistema que guia nutricionistas a construir uma carreira organizada, lucrativa e segura — sem depender de indicação, sorte ou tentativa e erro.',
  alternates: {
    canonical: nutriPageUrl,
  },
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    url: nutriPageUrl,
    siteName: 'YLADA Nutri',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: ogImageUrl,
        width: 1080,
        height: 1080,
        alt: 'YLADA - Boas conversas começam com boas perguntas',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: ogTitle,
    description: ogDescription,
    images: [ogImageUrl],
  },
  // Sobrescrever metadados do layout raiz
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Layout raiz Nutri: em rotas não públicas exige login + assinatura ativa.
 * Sem mensalidade em dia → redirect para /pt/nutri/checkout.
 */
export default async function NutriLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  // Sem pathname (header não setado) deixamos carregar para não bloquear (evita loop de redirect no mobile/Safari).
  const isPublic = !pathname || isNutriPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('nutri', {
      requireSubscription: true,
      allowAdmin: true,
      allowSupport: true,
      excludeRoutesFromSubscription: [],
      currentPath: pathname,
    })
  }
  return (
    <>
      {children}
      <ConditionalWidget />
    </>
  )
}

