'use client'

import { Suspense } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { WellnessLinksUnificadosContent } from '@/components/wellness/WellnessLinksUnificadosContent'

export default function LinksUnificadosPage() {
  return (
    <ProtectedRoute perfisPermitidos={['wellness', 'coach-bem-estar']} allowAdmin={true}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <p className="text-sm text-gray-500">Carregando…</p>
          </div>
        }
      >
        <WellnessLinksUnificadosContent />
      </Suspense>
    </ProtectedRoute>
  )
}
