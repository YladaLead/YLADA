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
    
    // 🚨 CORREÇÃO CRÍTICA: NÃO fazer nada em páginas protegidas
    // O server-side já cuida de redirecionamento e validação
    // AutoRedirect só deve atuar em páginas públicas (como /login)
    if (!isPublic && !isLoginPage) {
      // Página protegida - deixar server-side fazer o trabalho
      return
    }

    // CASO 1: Usuário está logado
    if (isAuthenticated && user) {
      // 🚨 CORREÇÃO CRÍTICA: NÃO redirecionar de /login se acabou de fazer login
      // Deixar o server-side fazer a validação primeiro para evitar loops
      // O AutoRedirect só deve redirecionar após um delay para garantir que o server validou
      if (isLoginPage && !hasRedirectedRef.current) {
        const perfil = userProfile?.perfil || getAreaFromPath(pathname) || 'wellness'
        
        // 🚨 NOVA LÓGICA: Aguardar um pouco antes de redirecionar para dar tempo do server validar
        // Isso evita race condition entre client e server
        const checkSubscription = async () => {
          // Aguardar 1 segundo para dar tempo do server validar a sessão
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Se já redirecionou ou não está mais na página de login, não fazer nada
          if (hasRedirectedRef.current || !pathname.includes('/login')) {
            return
          }
          
          const timeoutId = setTimeout(() => {
            console.log('⏱️ AutoRedirect: Timeout na verificação de assinatura, permitindo acesso à página de login')
            hasRedirectedRef.current = true
          }, 2000) // Timeout total de 2s após o delay inicial
          
          try {
            const area = perfil === 'nutri' ? 'nutri' : 
                        perfil === 'coach' ? 'coach' : 
                        perfil === 'nutra' ? 'nutra' : 'wellness'
            
            const response = await fetch(`/api/${area}/subscription/check`, {
              credentials: 'include',
              signal: AbortSignal.timeout(1500) // Timeout de 1.5s na requisição
            })
            
            clearTimeout(timeoutId)
            
            // Se já redirecionou ou não está mais na página de login, não fazer nada
            if (hasRedirectedRef.current || !pathname.includes('/login')) {
              return
            }
            
            if (response.ok) {
              const data = await response.json()
              const hasSubscription = data.hasActiveSubscription || data.bypassed
              
              if (hasSubscription) {
                let redirectPath = getHomePath(perfil)
                
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
                console.log('ℹ️ AutoRedirect: Usuário logado sem assinatura, permitindo acesso à página de login')
                hasRedirectedRef.current = true
              }
            } else {
              console.log('ℹ️ AutoRedirect: Erro ao verificar assinatura, permitindo acesso à página de login')
              hasRedirectedRef.current = true
            }
          } catch (error: any) {
            clearTimeout(timeoutId)
            if (error.name === 'TimeoutError' || error.name === 'AbortError') {
              console.log('⏱️ AutoRedirect: Timeout na verificação de assinatura, permitindo acesso à página de login')
            } else {
              console.log('ℹ️ AutoRedirect: Erro ao verificar assinatura, permitindo acesso à página de login:', error.message)
            }
            hasRedirectedRef.current = true
          }
        }
        
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
