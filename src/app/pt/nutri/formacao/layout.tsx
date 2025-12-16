'use client'

import { ReactNode } from 'react'
import RequireFeature from '@/components/auth/RequireFeature'

/**
 * Layout de Formação
 * 
 * Nota: ProtectedRoute foi removido - autenticação é feita pelo layout (protected)
 * RequireFeature mantido para validação de features específicas
 */
export default function FormacaoLayout({ children }: { children: ReactNode }) {
  return (
    <RequireFeature area="nutri" feature={['cursos', 'completo']}>
      {children}
    </RequireFeature>
  )
}

