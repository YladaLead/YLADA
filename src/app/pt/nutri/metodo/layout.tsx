'use client'

import { ReactNode } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireFeature from '@/components/auth/RequireFeature'
import ConditionalSidebar from '@/components/nutri/ConditionalSidebar'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'

export default function MetodoLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireFeature area="nutri" feature={['cursos', 'completo']}>
        {/* Sidebar não aparece no modo imersivo do Método */}
        <ConditionalSidebar />
        <div className="flex-1">
          {children}
        </div>
        <ConditionalWidget />
      </RequireFeature>
    </ProtectedRoute>
  )
}

