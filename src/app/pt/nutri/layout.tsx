import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'
import { validateProtectedAccess, isNutriPublicPath } from '@/lib/auth-server'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'

// URL absoluta da imagem OG para a landing page do nutri
// IMPORTANTE: A imagem default.jpg deve conter o logo Nutri (nutri-horizontal.PNG)
// Dimensões recomendadas: 1200x630px (mínimo: 200x200px para Facebook)
const ogImageUrl = `${baseUrl}/images/og/nutri/default.jpg`
const nutriPageUrl = `${baseUrl}/pt/nutri`

export const metadata: Metadata = {
  manifest: '/manifest-nutri.json',
  icons: {
    icon: '/images/logo/nutri-quadrado.png',
    apple: '/images/logo/nutri-quadrado.png',
  },
  // Título e descrição específicos para nutricionistas
  title: 'YLADA Nutri - Você precisa se tornar uma Nutri-Empresária',
  description: 'O sistema que guia nutricionistas a construir uma carreira organizada, lucrativa e segura — sem depender de indicação, sorte ou tentativa e erro.',
  // URL canônica correta para a página Nutri
  alternates: {
    canonical: nutriPageUrl,
  },
  // Metadados Open Graph específicos para nutricionistas
  // IMPORTANTE: Define explicitamente todos os campos para garantir sobrescrita completa do layout raiz
  openGraph: {
    title: 'YLADA Nutri - Você precisa se tornar uma Nutri-Empresária',
    description: 'O sistema que guia nutricionistas a construir uma carreira organizada, lucrativa e segura — sem depender de indicação, sorte ou tentativa e erro.',
    // URL correta - aponta para /pt/nutri, não para a raiz
    url: nutriPageUrl,
    siteName: 'NUTRI - Your Leading Data System',
    type: 'website',
    locale: 'pt_BR',
    // Array de imagens - DEVE usar a imagem OG do Nutri, não o logo genérico
    // URL CORRETA: /images/og/nutri/default.jpg (com logo Nutri)
    // NÃO usar: /images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png
    images: [
      {
        url: ogImageUrl, // https://www.ylada.com/images/og/nutri/default.jpg
        width: 1200,
        height: 630,
        alt: 'YLADA Nutri - Sistema para Nutri-Empresárias',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YLADA Nutri - Você precisa se tornar uma Nutri-Empresária',
    description: 'O sistema que guia nutricionistas a construir uma carreira organizada, lucrativa e segura — sem depender de indicação, sorte ou tentativa e erro.',
    // Usar a imagem OG do Nutri, não o logo genérico
    images: [ogImageUrl], // /images/og/nutri/default.jpg com logo Nutri
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
  const isPublic = pathname ? isNutriPublicPath(pathname) : false
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

