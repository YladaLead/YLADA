'use client'

import { useEffect } from 'react'
import AuthPage from '../page'

export default function RegisterPage() {
  useEffect(() => {
    // Forçar modo registro
    const authPage = document.querySelector('[data-auth-mode]') as HTMLElement
    if (authPage) {
      authPage.setAttribute('data-auth-mode', 'register')
    }
  }, [])

  return <AuthPage />
}
