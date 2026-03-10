'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import BibliotecaPageContent from '@/components/ylada/BibliotecaPageContent'

export default function NutraBibliotecaPage() {
  return (
    <ProtectedRoute perfil="nutra" allowAdmin>
      <BibliotecaPageContent areaCodigo="nutra" areaLabel="Nutra" />
    </ProtectedRoute>
  )
}
