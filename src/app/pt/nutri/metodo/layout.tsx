'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import RequireFeature from '@/components/auth/RequireFeature'
import ConditionalSidebar from '@/components/nutri/ConditionalSidebar'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'

/**
 * Layout do Método YLADA
 * 
 * Nota: ProtectedRoute foi removido - autenticação é feita pelo layout (protected)
 * RequireFeature mantido para validação de features específicas
 */
export default function MetodoLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Jornada 30 Dias deve ser acessível para todos (parte do onboarding)
  const isJornada = pathname?.includes('/metodo/jornada')
  
  return (
    <>
      {isJornada ? (
        // Jornada: acesso livre (sem RequireFeature)
        <>
          <ConditionalSidebar />
          <div className="flex-1">
            {children}
          </div>
          <ConditionalWidget />
        </>
      ) : (
        // Outras páginas do Método: requerem feature "cursos" ou "completo"
        <RequireFeature area="nutri" feature={['cursos', 'completo']}>
          <ConditionalSidebar />
          <div className="flex-1">
            {children}
          </div>
          <ConditionalWidget />
        </RequireFeature>
      )}
    </>
  )
}

