'use client'

import { useEffect, useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export default function WellnessLoginPage() {
  const [redirectPath, setRedirectPath] = useState('/pt/wellness/dashboard')
  const [startWithSignUp, setStartWithSignUp] = useState(false)

  useEffect(() => {
    // Ler parâmetros da URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      const signup = params.get('signup') // Novo parâmetro para iniciar em modo cadastro
      
      if (redirect) {
        setRedirectPath(decodeURIComponent(redirect))
        console.log('🔄 Redirecionamento após login:', redirect)
      }
      
      // Se vier do checkout, iniciar em modo cadastro (mais provável ser novo usuário)
      if (redirect?.includes('/checkout') || signup === 'true') {
        setStartWithSignUp(true)
        console.log('📝 Iniciando em modo cadastro (vindo do checkout)')
      }
    }
  }, [])

  return (
    <LoginForm 
      perfil="wellness" 
      redirectPath={redirectPath}
      logoColor="verde"
      initialSignUpMode={startWithSignUp}
    />
  )
}

