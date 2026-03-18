'use client'

import { useEffect, useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { useAuth } from '@/contexts/AuthContext'

export default function WellnessLoginPage() {
  const [redirectPath, setRedirectPath] = useState('/pt/wellness/home')
  const [startWithSignUp, setStartWithSignUp] = useState(false)
  const { loading: authLoading } = useAuth()

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

  // Evitar piscar: não mostrar o formulário enquanto a auth está carregando.
  // Se o usuário já estiver logado, o AutoRedirect redireciona; senão, mostramos o form.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin" aria-hidden />
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <LoginForm 
      perfil="wellness" 
      redirectPath={redirectPath}
      logoColor="verde"
      initialSignUpMode={startWithSignUp}
    />
  )
}

