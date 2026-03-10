'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { LinksPageContent } from '@/app/pt/(matrix)/links/page'

export default function NutraLinksPage() {
  return (
    <ProtectedRoute perfil="nutra" allowAdmin>
      <LinksPageContent areaCodigo="nutra" areaLabel="Nutra" />
    </ProtectedRoute>
  )
}
