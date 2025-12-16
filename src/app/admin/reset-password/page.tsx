'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'

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
    // Pegar token e type da URL
    const urlToken = searchParams.get('token')
    const urlType = searchParams.get('type')
    
    if (urlToken) {
      setToken(urlToken)
    }
    
    if (urlType) {
      setType(urlType)
    }

    // Se não tem token, verificar se veio com erro
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

    // Validações
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
      // Se tem token na URL, usar verifyOtp para resetar senha
      if (token) {
        console.log('🔄 Processando reset de senha com token...', { hasToken: !!token, type })
        
        // Decodificar token se estiver codificado na URL
        let decodedToken = token
        try {
          if (token.includes('%')) {
            decodedToken = decodeURIComponent(token)
            console.log('✅ Token decodificado da URL')
          }
        } catch (decodeErr) {
          console.warn('⚠️ Não foi possível decodificar token, usando original:', decodeErr)
          decodedToken = token
        }
        
        // Verificar o token e definir nova senha
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: decodedToken,
          type: (type as any) || 'recovery',
        })

        if (verifyError) {
          console.error('❌ Erro ao verificar token:', {
            message: verifyError.message,
            status: verifyError.status,
            name: verifyError.name
          })
          
          let errorMessage = 'Token inválido ou expirado. Solicite um novo link de reset.'
          if (verifyError.message?.includes('expired') || verifyError.message?.includes('expirado')) {
            errorMessage = 'O link de recuperação expirou. Por favor, solicite um novo link de reset de senha.'
          } else if (verifyError.message?.includes('invalid') || verifyError.message?.includes('inválido')) {
            errorMessage = 'Link de recuperação inválido. Por favor, solicite um novo link de reset de senha.'
          } else if (verifyError.message) {
            errorMessage = verifyError.message
          }
          
          setError(errorMessage)
          setLoading(false)
          return
        }

        // Se verificou com sucesso, atualizar senha
        if (!data || !data.session) {
          console.error('❌ Sessão não criada após verificação do token')
          setError('Erro ao processar token. Por favor, solicite um novo link de reset de senha.')
          setLoading(false)
          return
        }

        if (data.session) {
          const { error: updateError } = await supabase.auth.updateUser({
            password: password
          })

          if (updateError) {
            console.error('❌ Erro ao atualizar senha:', updateError)
            setError(updateError.message || 'Erro ao atualizar senha')
            setLoading(false)
            return
          }

          console.log('✅ Senha atualizada com sucesso!')
          setSuccess(true)
          
          // Redirecionar para login após 2 segundos
          setTimeout(() => {
            router.push('/admin/login?password_reset=success')
          }, 2000)
        }
      } else {
        // Se não tem token, tentar usar o código da URL (fallback)
        const code = searchParams.get('code')
        if (code) {
          console.log('🔄 Processando reset de senha com code...')
          
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError || !data.session) {
            console.error('❌ Erro ao trocar código por sessão:', exchangeError)
            setError('Código inválido ou expirado. Solicite um novo link de reset.')
            setLoading(false)
            return
          }

          // Atualizar senha
          const { error: updateError } = await supabase.auth.updateUser({
            password: password
          })

          if (updateError) {
            console.error('❌ Erro ao atualizar senha:', updateError)
            setError(updateError.message || 'Erro ao atualizar senha')
            setLoading(false)
            return
          }

          console.log('✅ Senha atualizada com sucesso!')
          setSuccess(true)
          
          setTimeout(() => {
            router.push('/admin/login?password_reset=success')
          }, 2000)
        } else {
          setError('Token ou código não encontrado na URL. Por favor, use o link completo do email.')
          setLoading(false)
        }
      }
    } catch (err: any) {
      console.error('❌ Erro geral:', err)
      setError(err.message || 'Erro ao processar reset de senha')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
            alt="YLADA"
            width={200}
            height={70}
            className="h-16 w-auto"
          />
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Redefinir Senha</h1>
          <p className="text-gray-600">Digite sua nova senha abaixo</p>
        </div>

        {/* Formulário */}
        {success ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-3xl">✓</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Senha Redefinida!</h2>
              <p className="text-gray-600">Sua senha foi atualizada com sucesso. Redirecionando para o login...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nova Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                  placeholder="Digite a senha novamente"
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

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>

            {/* Link para solicitar novo reset */}
            {error && error.includes('expirado') && (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Precisa de um novo link?
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/admin/login')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Voltar para o login
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

