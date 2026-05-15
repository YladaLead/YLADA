import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'
import { isPublicPage } from '@/lib/access-rules'

export const metadata: Metadata = {
  manifest: '/manifest-coach-bem-estar.json',
  icons: {
    icon: '/images/logo/wellness-quadrado.png',
    apple: '/images/logo/wellness-quadrado.png',
  },
  title: 'Coach de Bem-estar | YLADA',
  description:
    'Entenda seus clientes antes da primeira sessão. IA socrática que qualifica, educa e agenda — enquanto você cuida de quem já está com você.',
}

/**
 * Layout raiz Coach de Bem-estar: em rotas não públicas exige login + assinatura ativa.
 * Assinatura validada pelo escopo wellness (mesma base de planos).
 * Sem mensalidade em dia → redirect para /pt/coach-bem-estar/renovar.
 */
export default async function CoachBemEstarLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''

  // Sem pathname: deixar carregar para evitar loop de redirect (mobile/Safari via WhatsApp).
  const isPublic = !pathname || isPublicPage(pathname)
  if (!isPublic) {
    await validateProtectedAccess('coach-bem-estar', {
      requireSubscription: true,
      allowAdmin: true,
      allowSupport: true,
      excludeRoutesFromSubscription: [],
      currentPath: pathname,
    })
  }

  return <>{children}</>
}
