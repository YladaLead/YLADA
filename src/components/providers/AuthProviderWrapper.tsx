'use client'

import { AuthProvider } from '@/contexts/AuthContext'
import { useLastVisitedPage } from '@/hooks/useLastVisitedPage'
import AutoRedirect from '@/components/auth/AutoRedirect'

function NavigationTracker({ children }: { children: React.ReactNode }) {
  // Salvar última página visitada automaticamente
  useLastVisitedPage()
  return <>{children}</>
}

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AutoRedirect />
      <NavigationTracker>
        {/*
          Encadeamento de altura para PWA / iOS: o body tem safe-area + flex column;
          esta região ocupa o espaço útil para filhos usarem flex-1 / min-h-0 (ex.: quiz público).
        */}
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col">{children}</div>
      </NavigationTracker>
    </AuthProvider>
  )
}

