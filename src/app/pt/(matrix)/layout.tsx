import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { validateProtectedAccess } from '@/lib/auth-server'

/**
 * Layout protegido da matriz (app em /pt/home, /pt/trilha, etc.).
 * Valida sessão; perfil ylada. Qualquer erro na validação redireciona para login (evita 500).
 */
export default async function MatrixLayout({ children }: { children: ReactNode }) {
  try {
    await validateProtectedAccess('ylada', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
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
