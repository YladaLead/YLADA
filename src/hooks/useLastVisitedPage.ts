'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const LAST_VISITED_KEY = 'ylada_last_visited_page'
const LAST_VISITED_TIMESTAMP_KEY = 'ylada_last_visited_timestamp'

/**
 * Hook para salvar e recuperar a última página visitada
 * Útil para redirecionar usuários após login ou quando reabrem o app
 */
export function useLastVisitedPage() {
  const pathname = usePathname()

  // Salvar página atual sempre que mudar (exceto login/logout)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // 🚨 NÃO salvar páginas de login, logout, callback, checkout ou outras páginas que não devem ser salvas
    // IMPORTANTE: /checkout nunca deve ser salvo para evitar redirecionamento indesejado após login
    const excludedPaths = ['/login', '/logout', '/auth/callback', '/acesso', '/checkout', '/404', '/not-found']
    if (excludedPaths.some(path => pathname.includes(path))) {
      // Se for checkout, também limpar qualquer entrada anterior no localStorage
      if (pathname.includes('/checkout')) {
        try {
          const lastPage = localStorage.getItem(LAST_VISITED_KEY)
          if (lastPage && lastPage.includes('/checkout')) {
            console.log('🧹 Limpando /checkout do localStorage (página checkout detectada)')
            localStorage.removeItem(LAST_VISITED_KEY)
            localStorage.removeItem(LAST_VISITED_TIMESTAMP_KEY)
          }
        } catch (e) {
          console.warn('⚠️ Erro ao limpar localStorage:', e)
        }
      }
      return
    }

    // Validar que é uma rota válida antes de salvar
    // Aceitar rotas com prefixo de idioma (/pt/, /en/, /es/) ou rotas administrativas (/admin)
    const isValidRoute = pathname && 
      pathname.startsWith('/') && 
      (
        pathname.startsWith('/pt/') || 
        pathname.startsWith('/en/') || 
        pathname.startsWith('/es/') ||
        pathname.startsWith('/admin')
      ) &&
      pathname.length > 3 // Garantir que não é apenas "/pt" ou "/e"
    
    if (!isValidRoute) {
      // Não logar warning para rotas que não precisam ser salvas (evita spam no console)
      return
    }

    // Salvar página e timestamp
    try {
      localStorage.setItem(LAST_VISITED_KEY, pathname)
      localStorage.setItem(LAST_VISITED_TIMESTAMP_KEY, Date.now().toString())
      console.log('💾 Página salva:', pathname)
    } catch (e) {
      console.warn('⚠️ Erro ao salvar última página:', e)
    }
  }, [pathname])

  return {
    getLastVisitedPage: () => {
      if (typeof window === 'undefined') return null
      
      try {
        const lastPage = localStorage.getItem(LAST_VISITED_KEY)
        const timestamp = localStorage.getItem(LAST_VISITED_TIMESTAMP_KEY)
        
        // Se a última visita foi há mais de 7 dias, ignorar
        if (timestamp) {
          const age = Date.now() - parseInt(timestamp, 10)
          const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 dias
          if (age > maxAge) {
            localStorage.removeItem(LAST_VISITED_KEY)
            localStorage.removeItem(LAST_VISITED_TIMESTAMP_KEY)
            return null
          }
        }
        
        // Validar que a rota salva ainda é válida
        if (lastPage) {
          const excludedPaths = ['/checkout', '/login', '/logout', '/auth/callback', '/404', '/not-found', '/acesso']
          const hasExcludedPath = excludedPaths.some(path => lastPage.includes(path))
          const isValidRoute = lastPage.startsWith('/') && 
            (
              lastPage.startsWith('/pt/') || 
              lastPage.startsWith('/en/') || 
              lastPage.startsWith('/es/') ||
              lastPage.startsWith('/admin')
            ) &&
            lastPage.length > 3 &&
            !hasExcludedPath
          
          if (!isValidRoute || hasExcludedPath) {
            // Limpar rota inválida ou excluída do localStorage
            localStorage.removeItem(LAST_VISITED_KEY)
            localStorage.removeItem(LAST_VISITED_TIMESTAMP_KEY)
            return null
          }
        }
        
        return lastPage
      } catch (e) {
        return null
      }
    },
    clearLastVisitedPage: () => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(LAST_VISITED_KEY)
      localStorage.removeItem(LAST_VISITED_TIMESTAMP_KEY)
    }
  }
}
