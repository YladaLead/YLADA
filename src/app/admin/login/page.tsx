'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'

const supabase = createClient()

function AdminLoginPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('faulaandre@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordResetSuccess, setShowPasswordResetSuccess] = useState(false)

  useEffect(() => {
    // Verificar se supabase está configurado
    if (!supabase) {
      console.warn('⚠️ AdminLogin: Supabase não está configurado. Verifique as variáveis de ambiente.')
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 AdminLogin: auth state', event, {
        hasSession: !!session,
        userId: session?.user?.id,
      })

      if (event === 'SIGNED_IN' && session?.access_token) {
        console.log('✅ AdminLogin: sessão confirmada via listener, redirecionando...')
        window.location.href = '/admin'
      }
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  // Verificar searchParams no cliente (após hidratação)
  useEffect(() => {
    // Verificar password_reset apenas no cliente
    if (searchParams?.get('password_reset') === 'success') {
      setShowPasswordResetSuccess(true)
    }
  }, [searchParams])

  // 🚀 OTIMIZAÇÃO: Remover limpeza de cache desnecessária (causava lentidão)
  // O cache é gerenciado automaticamente pelo AdminProtectedRoute

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Verificar se supabase está configurado
    if (!supabase) {
      // Supabase não configurado - apenas logar, não mostrar erro técnico na UI
      console.warn('⚠️ AdminLogin: Supabase não está configurado')
      setError('Erro de configuração. Entre em contato com o suporte.')
      setLoading(false)
      return
    }
    // Supabase configurado, continuar normalmente

    try {
      console.log('🔐 Tentando fazer login...')
      
      // Login direto no Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('❌ Erro no login:', signInError)
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (!data.session) {
        console.error('❌ Nenhuma sessão retornada')
        setError('Erro ao criar sessão')
        setLoading(false)
        return
      }

      console.log('✅ Login bem-sucedido! User ID:', data.session.user.id)
      console.log('🔄 Redirecionando IMEDIATAMENTE...')

      // Redirecionar IMEDIATAMENTE após login bem-sucedido
      // A verificação de admin será feita na página protegida
      window.location.href = '/admin'

    } catch (err: any) {
      console.error('❌ Erro geral:', err)
      setError(err.message || 'Erro ao fazer login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo/ylada/novo/ylada-horizontal-claro.png"
            alt="YLADA"
            width={200}
            height={70}
            className="h-16 w-auto"
          />
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h1>
          <p className="text-gray-600">Entre na sua conta de Administrador</p>
          {showPasswordResetSuccess && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✅ Senha redefinida com sucesso! Faça login com sua nova senha.
            </div>
          )}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="seu@email.com"
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <AdminLoginPage />
    </Suspense>
  )
}
