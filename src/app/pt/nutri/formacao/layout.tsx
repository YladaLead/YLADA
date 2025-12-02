'use client'

import { ReactNode } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireFeature from '@/components/auth/RequireFeature'

export default function FormacaoLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireFeature area="nutri" feature={['cursos', 'completo']}>
        {children}
      </RequireFeature>
    </ProtectedRoute>
  )
}

