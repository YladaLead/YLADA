'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { isPublicPage, getAccessRule, getHomePath, getAreaFromPath } from '@/lib/access-rules'

/**
 * Componente que gerencia redirecionamento automático baseado em autenticação
 * 
 * NOVA LÓGICA CENTRALIZADA:
 * 1. Se usuário já está logado e acessa página pública → permanece lá
 * 2. Se usuário já está logado e acessa página de login → redireciona para home do perfil
 * 3. Se usuário já está logado e acessa página protegida → permite acesso (RequireSubscription cuida da assinatura)
 * 4. Se usuário NÃO está logado e acessa página protegida → redireciona para login
 * 5. Se usuário NÃO está logado e acessa página pública → permite acesso
 * 6. Se usuário NÃO está logado e acessa página de login → permanece lá
 * 
 * IMPORTANTE: Mantém usuários logados quando voltam à plataforma (sessão persiste)
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
      // Se está em página de login → redirecionar para home do perfil
      if (isLoginPage) {
        const perfil = userProfile?.perfil || getAreaFromPath(pathname) || 'wellness'
        const homePath = getHomePath(perfil)

        console.log('✅ AutoRedirect: Usuário logado em página de login, redirecionando para:', homePath)
        hasRedirectedRef.current = true
        
        // 🚀 OTIMIZAÇÃO: Redirecionar imediatamente (sem delay)
        router.replace(homePath)
        
        return
      }

      // Se está em página pública → permitir acesso (não redirecionar)
      // Usuário logado pode acessar páginas públicas normalmente
      if (isPublic) {
        console.log('✅ AutoRedirect: Usuário logado em página pública, permitindo acesso')
        return
      }

      // Se está em página protegida → permitir acesso
      // RequireSubscription vai verificar assinatura e redirecionar se necessário
      console.log('✅ AutoRedirect: Usuário logado em página protegida, permitindo acesso (RequireSubscription vai verificar assinatura)')
      return
    }

    // CASO 2: Usuário NÃO está logado
    if (!isAuthenticated || !user) {
      // Se está em página pública → permitir acesso
      if (isPublic) {
        console.log('✅ AutoRedirect: Usuário não logado em página pública, permitindo acesso')
        return
      }

      // Se está em página de login → permitir acesso (permanecer lá)
      if (isLoginPage) {
        console.log('✅ AutoRedirect: Usuário não logado em página de login, permitindo acesso')
        return
      }

      // Se está em página protegida → redirecionar para login
      if (accessRule.requiresAuth && !hasRedirectedRef.current) {
        const loginPath = accessRule.redirectIfNotAuth || `/pt/${getAreaFromPath(pathname) || 'wellness'}/login`
        console.log('🔄 AutoRedirect: Usuário não logado em página protegida, redirecionando para:', loginPath)
        hasRedirectedRef.current = true
        
        // 🚀 OTIMIZAÇÃO: Redirecionar imediatamente (sem delay)
        router.replace(loginPath)
        
        return
      }
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
