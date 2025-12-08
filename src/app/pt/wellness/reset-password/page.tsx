'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'
import Link from 'next/link'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)

  useEffect(() => {
    const urlToken = searchParams.get('token')
    const urlType = searchParams.get('type')
    
    if (urlToken) {
      setToken(urlToken)
    }
    
    if (urlType) {
      setType(urlType)
    }

    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      if (error === 'otp_expired') {
        setError('O link de reset de senha expirou. Por favor, solicite um novo link de reset.')
      } else {
        setError(errorDescription || 'Erro ao processar link de reset de senha.')
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      if (token) {
        console.log('🔄 Processando reset de senha com token...', { hasToken: !!token, type })
        
        // Criar AbortController para timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos

        try {
          // Tentar verificar o token
          // O token pode vir como hash direto ou precisar ser processado
          console.log('🔍 Verificando token:', { 
            tokenLength: token.length, 
            tokenStart: token.substring(0, 20) + '...',
            type: type || 'recovery'
          })
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: (type as any) || 'recovery',
          })

          clearTimeout(timeoutId)

          if (verifyError) {
            console.error('❌ Erro ao verificar token:', verifyError)
            setError(verifyError.message || 'Token inválido ou expirado. Solicite um novo link de reset.')
            setLoading(false)
            return
          }

          if (!data.session) {
            console.error('❌ Sessão não criada após verificação do token')
            setError('Erro ao processar token. Solicite um novo link de reset.')
            setLoading(false)
            return
          }

          console.log('✅ Token verificado, atualizando senha...')

          // Atualizar senha
          const { error: updateError } = await supabase.auth.updateUser({
            password: password
          })

          if (updateError) {
            console.error('❌ Erro ao atualizar senha:', updateError)
            setError(updateError.message || 'Erro ao atualizar senha. Tente novamente.')
            setLoading(false)
            return
          }

          console.log('✅ Senha atualizada com sucesso!')
          setSuccess(true)
          
          // Limpar senha provisória no perfil (se existir)
          try {
            await fetch('/api/wellness/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ temporary_password_expires_at: null })
            })
          } catch (e) {
            // Não crítico, apenas logar
            console.warn('⚠️ Não foi possível limpar senha provisória:', e)
          }
          
          setTimeout(() => {
            router.push('/pt/wellness/login?password_reset=success')
          }, 2000)
        } catch (fetchError: any) {
          clearTimeout(timeoutId)
          if (fetchError.name === 'AbortError') {
            setError('O processo demorou muito. Verifique sua conexão e tente novamente.')
          } else {
            throw fetchError
          }
          setLoading(false)
        }
      } else {
        setError('Token não encontrado. Por favor, use o link enviado por email.')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('❌ Erro ao resetar senha:', err)
      setError(err.message || 'Erro ao resetar senha. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src="/images/logo/wellness-horizontal.png"
              alt="WELLNESS - Your Leading Data System"
              width={572}
              height={150}
              className="bg-transparent object-contain h-16 sm:h-20 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Redefinir Senha
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Digite sua nova senha
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold">✓ Senha redefinida com sucesso!</p>
              <p className="mt-2">Redirecionando para o login...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 placeholder-gray-400"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all duration-200 bg-green-600 hover:bg-green-700 active:bg-green-800 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </form>
        )}

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/pt/wellness/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

