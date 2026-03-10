'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LeadsPageContent from '@/components/ylada/LeadsPageContent'

export default function NutraLeadsPage() {
  return (
    <ProtectedRoute perfil="nutra" allowAdmin>
      <LeadsPageContent areaCodigo="nutra" areaLabel="Nutra" />
    </ProtectedRoute>
  )
}
