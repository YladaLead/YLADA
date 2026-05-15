'use client'

import { useEffect, useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Entrada pública da área Coach de bem-estar (URL /pt/coach-bem-estar/*),
 * sem redirecionar para /pt/wellness — mesmo stack backend, segmento próprio na barra de endereço.
 */
export default function CoachBemEstarLoginPage() {
  const [redirectPath, setRedirectPath] = useState('/pt/coach-bem-estar/home')
  const [startWithSignUp, setStartWithSignUp] = useState(false)
  const { loading: authLoading } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      const signup = params.get('signup')
      if (redirect) {
        setRedirectPath(decodeURIComponent(redirect))
      }
      if (redirect?.includes('/checkout') || signup === 'true') {
        setStartWithSignUp(true)
      }
    }
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <LoginForm
      perfil="coach-bem-estar"
      redirectPath={redirectPath}
      logoColor="azul-claro"
      initialSignUpMode={startWithSignUp}
    />
  )
}
