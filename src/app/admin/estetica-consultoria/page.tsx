'use client'

import { Suspense } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import EsteticaConsultoriaAdminClient from '@/components/admin/EsteticaConsultoriaAdminClient'

export default function AdminEsteticaConsultoriaPage() {
  return (
    <AdminProtectedRoute>
      <Suspense fallback={<p className="p-8 text-sm text-gray-500">A carregar…</p>}>
        <EsteticaConsultoriaAdminClient />
      </Suspense>
    </AdminProtectedRoute>
  )
}
