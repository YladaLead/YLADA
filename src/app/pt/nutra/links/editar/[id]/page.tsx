'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import EditarLinkPage from '@/app/pt/(matrix)/links/editar/[id]/page'

export default function NutraEditarLinkPage(props: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute perfil="nutra" allowAdmin>
      <EditarLinkPage params={props.params} />
    </ProtectedRoute>
  )
}
