'use client'

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import ProLideresConsultoriaAdminClient from '@/components/admin/ProLideresConsultoriaAdminClient'

export default function AdminProLideresConsultoriaPage() {
  return (
    <AdminProtectedRoute>
      <ProLideresConsultoriaAdminClient />
    </AdminProtectedRoute>
  )
}
