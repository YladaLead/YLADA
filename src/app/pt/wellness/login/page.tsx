'use client'

import { useEffect, useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export default function WellnessLoginPage() {
  const [redirectPath, setRedirectPath] = useState('/pt/wellness/dashboard')

  useEffect(() => {
    // Ler parâmetro redirect da URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      if (redirect) {
        setRedirectPath(decodeURIComponent(redirect))
        console.log('🔄 Redirecionamento após login:', redirect)
      }
    }
  }, [])

  return (
    <LoginForm 
      perfil="wellness" 
      redirectPath={redirectPath}
      logoColor="verde"
    />
  )
}

