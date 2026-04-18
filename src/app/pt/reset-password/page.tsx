'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'
import Link from 'next/link'

/**
 * Redefinição de senha via link (e-mail) — matriz YLADA, Pro Líderes, Pro Estética e segmentos
 * que não têm página dedicada em /pt/{area}/reset-password.
 */
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
    if (urlToken) setToken(urlToken)
    if (urlType) setType(urlType)

    const err = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    if (err) {
      if (err === 'otp_expired') {
        setError('O link de reset de senha expirou. Solicite um novo link.')
      } else {
        setError(errorDescription || 'Erro ao processar o link de reset.')
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

    if (!token) {
      setError('Token não encontrado. Use o link enviado por e-mail.')
      setLoading(false)
      return
    }

    try {
      let decodedToken = token
      try {
        if (token.includes('%')) decodedToken = decodeURIComponent(token)
      } catch {
        decodedToken = token
      }

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: decodedToken,
        type: (type as any) || 'recovery',
      })

      if (verifyError) {
        let errorMessage = 'Token inválido ou expirado. Solicite um novo link.'
        if (verifyError.message?.includes('expired') || verifyError.message?.includes('expirado')) {
          errorMessage = 'O link expirou. Solicite um novo link de recuperação.'
        } else if (verifyError.message?.includes('invalid') || verifyError.message?.includes('inválido')) {
          errorMessage = 'Link inválido. Solicite um novo link.'
        } else if (verifyError.message) {
          errorMessage = verifyError.message
        }
        setError(errorMessage)
        setLoading(false)
        return
      }

      if (!data?.session) {
        setError('Não foi possível validar o link. Solicite um novo.')
        setLoading(false)
        return
      }

      const userEmail = data.user?.email
      if (userEmail) {
        const { createClient: createSb } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        if (supabaseUrl && supabaseAnonKey) {
          const tempSupabase = createSb(supabaseUrl, supabaseAnonKey)
          const { data: testLogin, error: testError } = await tempSupabase.auth.signInWithPassword({
            email: userEmail,
            password,
          })
          if (!testError && testLogin?.session) {
            setError('A nova senha deve ser diferente da senha atual.')
            setLoading(false)
            return
          }
        }
      }

      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message || 'Erro ao atualizar senha.')
        setLoading(false)
        return
      }

      setSuccess(true)
      try {
        await fetch('/api/auth/post-password-reset-cleanup', {
          method: 'POST',
          credentials: 'include',
        })
      } catch {
        // não bloquear
      }

      setTimeout(() => {
        router.push('/pt/login?password_reset=success')
      }, 2000)
    } catch (fetchError: any) {
      if (fetchError?.name === 'AbortError') {
        setError('O processo demorou muito. Verifique a conexão e tente novamente.')
      } else {
        setError(fetchError?.message || 'Erro ao redefinir senha.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro.png"
              alt="YLADA"
              width={200}
              height={60}
              className="bg-transparent object-contain h-16 sm:h-20 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Redefinir senha</h1>
          <p className="text-sm sm:text-base text-gray-600">Digite sua nova senha</p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold">Senha redefinida com sucesso.</p>
              <p className="mt-2">A redirecionar para o login…</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Nova senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all duration-200 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? 'A redefinir…' : 'Redefinir senha'}
            </button>
          </form>
        )}

        <div className="mt-6 sm:mt-8 text-center">
          <Link href="/pt/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function MatrixResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-600">A carregar…</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
