import { ReactNode } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { validateProtectedAccess } from '@/lib/auth-server'

/**
 * Layout protegido da matriz (app em /pt/home, /pt/trilha, etc.).
 * Valida sessão; perfil ylada. Em /pt/onboarding permite qualquer perfil (evita loop para usuárias antigas).
 */
export default async function MatrixLayout({ children }: { children: ReactNode }) {
  try {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
    await validateProtectedAccess('ylada', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
      allowAnyPerfilForPaths: ['onboarding'],
    })
    return <>{children}</>
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error && String((error as { digest?: string }).digest).startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('[matrix layout] Erro na validação, redirecionando para login:', error)
    redirect('/pt/login')
  }
}
