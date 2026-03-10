'use client'

import { useEffect, useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'

/**
 * Login para Coaches de bem-estar.
 * Usa perfil coach-bem-estar; redireciona para /pt/coach-bem-estar/home (área interna própria).
 */
export default function CoachBemEstarLoginPage() {
  const [redirectPath, setRedirectPath] = useState('/pt/coach-bem-estar/home')
  const [startWithSignUp, setStartWithSignUp] = useState(false)

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

  return (
    <LoginForm
      perfil="coach-bem-estar"
      redirectPath={redirectPath}
      logoColor="verde"
      initialSignUpMode={startWithSignUp}
    />
  )
}
