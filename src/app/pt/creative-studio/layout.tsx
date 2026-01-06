import { ReactNode } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

interface CreativeStudioLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para Creative Studio
 * Requer autenticação, mas não necessariamente admin
 */
export default function CreativeStudioLayout({ children }: CreativeStudioLayoutProps) {
  return (
    <ProtectedRoute allowAdmin={true}>
      {children}
    </ProtectedRoute>
  )
}


