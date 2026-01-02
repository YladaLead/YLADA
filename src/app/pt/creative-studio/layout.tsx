import { ReactNode } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface CreativeStudioLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para Creative Studio
 * Apenas administradores podem acessar
 */
export default function CreativeStudioLayout({ children }: CreativeStudioLayoutProps) {
  return (
    <AdminProtectedRoute>
      {children}
    </AdminProtectedRoute>
  )
}


