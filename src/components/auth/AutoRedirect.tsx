'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Componente que gerencia redirecionamento automático baseado em autenticação
 * 
 * Regras:
 * 1. Se usuário já está logado e acessa página pública (HOM, ferramentas públicas) → permanece lá
 * 2. Se usuário já está logado e acessa página de login → redireciona para home do perfil
 * 3. Se usuário já está logado e acessa página protegida → permite acesso
 * 4. Se usuário NÃO está logado e acessa página protegida → redireciona para login
 * 5. Se usuário NÃO está logado e acessa página pública → permite acesso
 * 6. Se usuário NÃO está logado e acessa página de login → permanece lá
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

    // Verificar se é página pública usando padrões de URL
    const isPublicPage = (() => {
      if (!pathname) return false
      
      // HOM gravada: /pt/wellness/[user-slug]/hom
      if (/^\/pt\/wellness\/[^/]+\/hom$/.test(pathname)) return true
      
      // Ferramentas públicas: /pt/[area]/[user-slug]/[tool-slug]
      if (/^\/pt\/(wellness|nutri|coach|c)\/[^/]+\/[^/]+$/.test(pathname)) return true
      
      // Portais públicos: /pt/[area]/[user-slug]/portal/[slug]
      if (/^\/pt\/(wellness|nutri|coach|c)\/[^/]+\/portal\/[^/]+$/.test(pathname)) return true
      
      // Apresentação pública
      if (pathname.includes('/system/recrutar/apresentacao')) return true
      if (pathname.includes('/system/recrutar/enviar-link')) return true
      
      // Formulários públicos: /f/[formId]
      if (/^\/f\/[^/]+$/.test(pathname)) return true
      
      // Links curtos: /p/[code]
      if (/^\/p\/[^/]+$/.test(pathname)) return true
      
      // Quizzes públicos: /pt/[area]/[user-slug]/quiz/[slug]
      if (/^\/pt\/(wellness|nutri|coach|c)\/[^/]+\/quiz\/[^/]+$/.test(pathname)) return true
      
      return false
    })()

    // Páginas de login
    const isLoginPage = pathname?.includes('/login')
    
    // Páginas de vendas/públicas que não precisam autenticação
    const isSalesPage = pathname?.includes('/system/recrutar') || 
                       pathname?.includes('/system/vender') ||
                       pathname?.includes('/pt/wellness/page') // Landing page pública

    // CASO 1: Usuário está logado
    if (isAuthenticated && user) {
      // Se está em página de login → redirecionar para home do perfil
      if (isLoginPage) {
        const perfil = userProfile?.perfil || 'wellness'
        let homePath = '/pt/wellness/home'
        
        if (perfil === 'nutri') {
          homePath = '/pt/nutri/home'
        } else if (perfil === 'coach') {
          homePath = '/pt/coach/home'
        } else if (perfil === 'nutra') {
          homePath = '/pt/nutra/home'
        }

        console.log('✅ AutoRedirect: Usuário logado em página de login, redirecionando para:', homePath)
        hasRedirectedRef.current = true
        
        redirectTimeoutRef.current = setTimeout(() => {
          router.replace(homePath)
        }, 300)
        
        return
      }

      // Se está em página pública ou de vendas → permitir acesso (não redirecionar)
      if (isPublicPage || isSalesPage) {
        console.log('✅ AutoRedirect: Usuário logado em página pública, permitindo acesso')
        return
      }

      // Se está em página protegida → permitir acesso (ProtectedRoute vai cuidar)
      return
    }

    // CASO 2: Usuário NÃO está logado
    if (!isAuthenticated || !user) {
      // Se está em página pública ou de vendas → permitir acesso
      if (isPublicPage || isSalesPage) {
        console.log('✅ AutoRedirect: Usuário não logado em página pública, permitindo acesso')
        return
      }

      // Se está em página de login → permitir acesso (permanecer lá)
      if (isLoginPage) {
        console.log('✅ AutoRedirect: Usuário não logado em página de login, permitindo acesso')
        return
      }

      // Se está em página protegida → ProtectedRoute vai redirecionar
      // Não fazer nada aqui, deixar ProtectedRoute cuidar
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
