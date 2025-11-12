'use client'

import { createContext, useContext } from 'react'
import { useAuth as useAuthHook } from '@/hooks/useAuth'

// Tipo do retorno do useAuth
type AuthContextType = ReturnType<typeof useAuthHook>

// Criar contexto
const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Provider que disponibiliza uma única instância do useAuth
 * para toda a aplicação, evitando múltiplas instâncias e race conditions
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

/**
 * Hook para acessar o contexto de autenticação
 * Substitui a chamada direta de useAuth() para garantir que todos
 * os componentes usem a mesma instância
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

