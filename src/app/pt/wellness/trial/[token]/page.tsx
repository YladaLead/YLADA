'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function TrialInvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteData, setInviteData] = useState<{
    email: string
    nome_completo?: string
    whatsapp?: string
  } | null>(null)
  const [step, setStep] = useState<'validate' | 'create-account' | 'success'>('validate')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [creating, setCreating] = useState(false)

  // Validar token ao carregar
  useEffect(() => {
    if (!token) {
      setError('Token inválido')
      setLoading(false)
      return
    }

    const validateToken = async () => {
      try {
        const response = await fetch('/api/wellness/trial/validate-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setInviteData({
            email: data.email,
            nome_completo: data.nome_completo,
            whatsapp: data.whatsapp,
          })
          setStep('create-account')
        } else {
          setError(data.error || 'Token inválido ou expirado')
        }
      } catch (err: any) {
        setError('Erro ao validar link. Tente novamente.')
        console.error('Erro ao validar token:', err)
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [token])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      setCreating(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Senhas não coincidem')
      setCreating(false)
      return
    }

    try {
      const response = await fetch('/api/wellness/trial/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          confirm_password: confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStep('success')
        
        // Se tiver login_url, redirecionar automaticamente
        if (data.login_url) {
          setTimeout(() => {
            window.location.href = data.login_url
          }, 2000)
        } else {
          // Fallback: redirecionar para login
          setTimeout(() => {
            router.push('/pt/wellness/login')
          }, 3000)
        }
      } else {
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (err: any) {
      setError('Erro ao criar conta. Tente novamente.')
      console.error('Erro ao criar conta:', err)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando link...</p>
        </div>
      </div>
    )
  }

  if (error && step === 'validate') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Link Inválido</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/pt/wellness/login')}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Ir para Login
          </button>
        </div>
      </div>
    )
  }

  if (step === 'create-account' && inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Bem-vindo ao YLADA Wellness!
            </h1>
            <p className="text-gray-600">
              Você foi convidado para testar gratuitamente por 3 dias
            </p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={inviteData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {inviteData.nome_completo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={inviteData.nome_completo}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crie sua senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirme sua senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Digite a senha novamente"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Criando conta...' : 'Criar conta e começar trial'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Ao criar a conta, você concorda com nossos termos de uso.
              Seu trial de 3 dias começa imediatamente após a criação.
            </p>
          </form>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Conta criada com sucesso!
          </h1>
          <p className="text-gray-600 mb-6">
            Seu trial de 3 dias foi ativado. Redirecionando...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return null
}
