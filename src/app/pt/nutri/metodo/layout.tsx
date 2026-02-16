'use client'

import { ReactNode, Suspense } from 'react'
import RequireFeature from '@/components/auth/RequireFeature'
import ConditionalSidebar from '@/components/nutri/ConditionalSidebar'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'

/**
 * Layout do Método YLADA. Toda a área exige assinatura (feature cursos ou completo).
 */
function MetodoLayoutContent({ children }: { children: ReactNode }) {
  return (
    <RequireFeature area="nutri" feature={['cursos', 'completo']}>
      <ConditionalSidebar />
      <div className="flex-1">
        {children}
      </div>
      <ConditionalWidget />
    </RequireFeature>
  )
}

/**
 * Layout do Método YLADA. Sem assinatura o usuário é redirecionado para a página de planos.
 */
export default function MetodoLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <MetodoLayoutContent>{children}</MetodoLayoutContent>
    </Suspense>
  )
}

