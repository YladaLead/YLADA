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
      // APENAS UX: Se está em página de login → verificar assinatura antes de redirecionar
      // Se não tiver assinatura, permitir que o usuário permaneça na página de login
      if (isLoginPage && !hasRedirectedRef.current) {
        const perfil = userProfile?.perfil || getAreaFromPath(pathname) || 'wellness'
        
        // 🚨 CORREÇÃO: Adicionar timeout para não bloquear página de login
        // Se verificação demorar mais de 3 segundos, permitir acesso à página
        const checkSubscription = async () => {
          const timeoutId = setTimeout(() => {
            console.log('⏱️ AutoRedirect: Timeout na verificação de assinatura, permitindo acesso à página de login')
            hasRedirectedRef.current = true // Marcar como processado para não tentar novamente
          }, 3000) // 3 segundos de timeout
          
          try {
            const area = perfil === 'nutri' ? 'nutri' : 
                        perfil === 'coach' ? 'coach' : 
                        perfil === 'nutra' ? 'nutra' : 'wellness'
            
            const response = await fetch(`/api/${area}/subscription/check`, {
              credentials: 'include',
              signal: AbortSignal.timeout(2500) // Timeout de 2.5s na requisição
            })
            
            clearTimeout(timeoutId) // Limpar timeout se requisição completar
            
            if (response.ok) {
              const data = await response.json()
              const hasSubscription = data.hasActiveSubscription || data.bypassed
              
              // 🚨 CORREÇÃO: Para área Nutri, verificar diagnóstico antes de redirecionar
              if (hasSubscription) {
                let redirectPath = getHomePath(perfil)
                
                // Se for área Nutri, verificar diagnóstico
                if (perfil === 'nutri' && userProfile) {
                  if (!userProfile.diagnostico_completo) {
                    redirectPath = '/pt/nutri/onboarding'
                    console.log('ℹ️ AutoRedirect: Usuário Nutri sem diagnóstico, redirecionando para onboarding')
                  } else {
                    redirectPath = '/pt/nutri/home'
                    console.log('✅ AutoRedirect: Usuário Nutri com diagnóstico, redirecionando para home')
                  }
                }
                
                console.log('✅ AutoRedirect (UX): Usuário logado com assinatura em página de login, redirecionando para:', redirectPath)
                hasRedirectedRef.current = true
                router.replace(redirectPath)
              } else {
                // Se não tiver assinatura, permitir que usuário permaneça na página de login
                console.log('ℹ️ AutoRedirect: Usuário logado sem assinatura, permitindo acesso à página de login')
                hasRedirectedRef.current = true // Marcar como processado
              }
            } else {
              // Em caso de erro, não redirecionar (permitir acesso à página de login)
              console.log('ℹ️ AutoRedirect: Erro ao verificar assinatura, permitindo acesso à página de login')
              hasRedirectedRef.current = true // Marcar como processado
            }
          } catch (error: any) {
            clearTimeout(timeoutId) // Limpar timeout em caso de erro
            // Em caso de erro ou timeout, não redirecionar (permitir acesso à página de login)
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
              console.log('⏱️ AutoRedirect: Timeout na verificação de assinatura, permitindo acesso à página de login')
            } else {
              console.log('ℹ️ AutoRedirect: Erro ao verificar assinatura, permitindo acesso à página de login:', error.message)
            }
            hasRedirectedRef.current = true // Marcar como processado
          }
        }
        
        // Verificar assinatura de forma assíncrona
        checkSubscription()
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
