'use client'

import { Suspense } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import EsteticaConsultoriaFunilBoard from '@/components/admin/EsteticaConsultoriaFunilBoard'

export default function AdminEsteticaConsultoriaFunilPage() {
  return (
    <AdminProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-[1920px]">
          <Suspense fallback={<p className="text-sm text-gray-500">A carregar…</p>}>
            <EsteticaConsultoriaFunilBoard />
          </Suspense>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
