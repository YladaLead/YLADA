'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { isPublicPage, getAccessRule, getAppHomePathForPerfil, getAreaFromPath } from '@/lib/access-rules'

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
  const subscriptionCheckStartedRef = useRef(false)
  const prevPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    // Resetar flags apenas quando pathname mudar (evita múltiplas execuções do check)
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      hasRedirectedRef.current = false
      subscriptionCheckStartedRef.current = false
    }
    
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

    // Pro Líderes / Pro Estética: nunca aplicar redirecionamentos pensados para /pt/login aqui
    if (
      pathname.startsWith('/pro-lideres') ||
      pathname.startsWith('/pro-estetica-corporal') ||
      pathname.startsWith('/pro-estetica-capilar')
    ) {
      return
    }

    // 🚀 NOVA LÓGICA: Usar sistema de regras centralizado
    const accessRule = getAccessRule(pathname)
    const isPublic = accessRule.isPublic || isPublicPage(pathname)
    
    // Páginas de login e cadastro
    const isLoginPage = pathname.includes('/login') || pathname === '/pt/cadastro'
    const isYladaEntry = pathname === '/pt/login' || pathname?.endsWith('/cadastro')
    
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
        // 🚨 Todos entram pela YLADA: em /pt/login ou /pt/cadastro, sempre redirecionar para YLADA
        if (isYladaEntry) {
          const checkYladaProfile = async () => {
            await new Promise(resolve => setTimeout(resolve, 500))
            if (hasRedirectedRef.current) return
            try {
              const res = await fetch('/api/ylada/profile?segment=ylada', { credentials: 'include', signal: AbortSignal.timeout(2000) })
              if (hasRedirectedRef.current) return
              let redirectPath = '/pt/onboarding'
              if (res.ok) {
                const data = await res.json()
                const p = data?.data?.profile
                const as = (p?.area_specific || {}) as Record<string, unknown>
                const temNome = as?.nome && String(as.nome).trim().length >= 2
                const temWhatsapp = as?.whatsapp && String(as.whatsapp).replace(/\D/g, '').length >= 10
                const temPerfilEmpresarial = p?.profile_type && p?.profession
                if (temNome && temWhatsapp && temPerfilEmpresarial) redirectPath = '/pt/home'
                // Sempre ir para o board; perfil empresarial pode ser preenchido pelo menu (evita loop perfil-empresarial ↔ login)
                else if (temNome && temWhatsapp) redirectPath = '/pt/home'
                // Usuárias da área Nutri (e outras áreas) que ainda não têm perfil ylada: ir direto para o board para evitar tela piscando/loop
                else if (!p && userProfile?.perfil && userProfile.perfil !== 'ylada') {
                  redirectPath = '/pt/home'
                }
              }
              console.log('✅ AutoRedirect (YLADA): redirecionando para', redirectPath)
              hasRedirectedRef.current = true
              router.replace(redirectPath)
            } catch {
              if (hasRedirectedRef.current) return
              // Em caso de erro/timeout: se tem perfil de área (nutri, coach, etc.), ir para board em vez de onboarding
              if (userProfile?.perfil && userProfile.perfil !== 'ylada') {
                hasRedirectedRef.current = true
                router.replace('/pt/home')
                return
              }
              hasRedirectedRef.current = true
              router.replace('/pt/onboarding')
            }
          }
          checkYladaProfile()
          return
        }

        const perfil = userProfile?.perfil || getAreaFromPath(pathname) || 'wellness'
        
        // Evitar múltiplas chamadas simultâneas (evita conflito com vários usuários e piscar)
        if (subscriptionCheckStartedRef.current) return
        subscriptionCheckStartedRef.current = true

        // Para outras páginas de login (wellness, nutri, etc.), manter lógica anterior
        const checkSubscription = async () => {
          await new Promise(resolve => setTimeout(resolve, 450))
          if (hasRedirectedRef.current || !pathname.includes('/login')) return
          
          const timeoutId = setTimeout(() => {
            hasRedirectedRef.current = true
          }, 3000)
          
          try {
            const area = perfil === 'nutri' ? 'nutri' : 
                        perfil === 'coach' ? 'coach' : 
                        perfil === 'nutra' ? 'nutra' : 'wellness'
            
            const response = await fetch(`/api/${area}/subscription/check`, {
              credentials: 'include',
              signal: AbortSignal.timeout(5000)
            })
            
            clearTimeout(timeoutId)
            if (hasRedirectedRef.current || !pathname.includes('/login')) return
            
            if (response.ok) {
              const data = await response.json()
              const hasSubscription = data.hasActiveSubscription || data.bypassed
              
              if (hasSubscription) {
                const redirectPath = getAppHomePathForPerfil(perfil)
                console.log('✅ AutoRedirect (UX): redirecionando para:', redirectPath)
                hasRedirectedRef.current = true
                router.replace(redirectPath)
              } else {
                hasRedirectedRef.current = true
              }
            } else {
              hasRedirectedRef.current = true
            }
          } catch {
            clearTimeout(timeoutId)
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
