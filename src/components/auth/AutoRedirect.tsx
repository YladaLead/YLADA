'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { isPublicPage, getAccessRule, getHomePath, getAreaFromPath } from '@/lib/access-rules'

/**
 * Componente que gerencia redirecionamento automático baseado em autenticação
 * 
 * VERSÃO SIMPLIFICADA - APENAS UX (não segurança)
 * 
 * Server-side já cuida de:
 * - Validar sessão
 * - Validar perfil
 * - Validar assinatura
 * - Redirecionar páginas protegidas
 * 
 * AutoRedirect apenas faz:
 * - Redirecionar de /login para /home quando logado (UX)
 * 
 * IMPORTANTE: Não redireciona páginas protegidas - server já faz isso
 */
export default function AutoRedirect() {
  const { user, userProfile, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirectedRef = useRef(false)
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Resetar flag quando pathname mudar (nova navegação)
    hasRedirectedRef.current = false
    
    // Limpar timeout anterior se existir
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = null
    }

    // Não fazer nada se ainda está carregando
    if (loading) {
      return
    }

    if (!pathname) {
      return
    }

    // 🚀 NOVA LÓGICA: Usar sistema de regras centralizado
    const accessRule = getAccessRule(pathname)
    const isPublic = accessRule.isPublic || isPublicPage(pathname)
    
    // Páginas de login
    const isLoginPage = pathname.includes('/login')

    // CASO 1: Usuário está logado
    if (isAuthenticated && user) {
      // APENAS UX: Se está em página de login → redirecionar para home do perfil
      // Server-side já validou tudo, então podemos confiar
      if (isLoginPage && !hasRedirectedRef.current) {
        const perfil = userProfile?.perfil || getAreaFromPath(pathname) || 'wellness'
        const homePath = getHomePath(perfil)

        console.log('✅ AutoRedirect (UX): Usuário logado em página de login, redirecionando para:', homePath)
        hasRedirectedRef.current = true
        router.replace(homePath)
        return
      }

      // Páginas públicas e protegidas → permitir acesso
      // Server-side já validou se tem acesso
      return
    }

    // CASO 2: Usuário NÃO está logado
    // Server-side já redirecionou páginas protegidas
    // AutoRedirect não precisa fazer nada aqui
    // Apenas permitir acesso a páginas públicas e login
    if (!isAuthenticated || !user) {
      // Páginas públicas ou login → permitir acesso
      if (isPublic || isLoginPage) {
        return
      }

      // Páginas protegidas → server já redirecionou, não fazer nada
      // (Este código não deve ser alcançado, mas mantido como fallback)
      return
    }

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [loading, isAuthenticated, user, userProfile, pathname, router])

  // Este componente não renderiza nada
  return null
}
