'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { useLastVisitedPage } from '@/hooks/useLastVisitedPage'

function NavigationTracker({ children }: { children: React.ReactNode }) {
  // Salvar última página visitada automaticamente
  useLastVisitedPage()
  return <>{children}</>
}

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavigationTracker>
        {children}
      </NavigationTracker>
    </AuthProvider>
  )
}

