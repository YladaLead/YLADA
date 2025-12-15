'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireFeature from '@/components/auth/RequireFeature'
import ConditionalSidebar from '@/components/nutri/ConditionalSidebar'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'

export default function MetodoLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Jornada 30 Dias deve ser acessível para todos (parte do onboarding)
  const isJornada = pathname?.includes('/metodo/jornada')
  
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
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
    </ProtectedRoute>
  )
}

