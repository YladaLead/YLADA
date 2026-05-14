'use client'

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import LegacyWhatsappWorkshopDisabled from '@/components/admin/LegacyWhatsappWorkshopDisabled'

export default function WhatsappHomLegacyPage() {
  return (
    <AdminProtectedRoute>
      <LegacyWhatsappWorkshopDisabled />
    </AdminProtectedRoute>
  )
}
