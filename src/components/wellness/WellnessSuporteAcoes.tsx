'use client'

import { useState } from 'react'

type ActionType = 'access-link' | 'reset-password' | null

interface WellnessSuporteAcoesProps {
  onActionComplete?: (action: string, success: boolean) => void
}

export default function WellnessSuporteAcoes({ onActionComplete }: WellnessSuporteAcoesProps) {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null)
  const [email, setEmail] = useState('')
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<'email' | 'verify' | 'processing' | 'success'>('email')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleStartAction = (action: ActionType) => {
    setSelectedAction(action)
    setStep('email')
    setEmail('')
    setVerificationId(null)
    setVerificationCode('')
    setError(null)
    setMessage(null)
  }

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      setError('Por favor, informe um e-mail válido')
      return
    }

    if (!selectedAction) return

    setError(null)
    setStep('processing')

    try {
      const response = await fetch('/api/wellness/suporte/verificar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: selectedAction }),
      })

      const data = await response.json()

      if (data.success && data.verificationId) {
        setVerificationId(data.verificationId)
        setMessage(data.message || 'Código enviado!')
        setStep('verify')
      } else {
        setError(data.error || 'Erro ao enviar código. Verifique se o e-mail está correto.')
        setStep('email')
      }
    } catch (err: any) {
      setError('Erro ao enviar código. Tente novamente.')
      setStep('email')
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Por favor, informe o código de 6 dígitos')
      return
    }

    if (!verificationId) return

    setError(null)
    setStep('processing')

    try {
      const response = await fetch('/api/wellness/suporte/verificar-email/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, code: verificationCode }),
      })

      const data = await response.json()

      if (data.success && data.email) {
        // Executar ação após verificação
        await executeAction(data.email)
      } else {
        setError(data.error || 'Código inválido ou expirado')
        setStep('verify')
      }
    } catch (err: any) {
      setError('Erro ao validar código. Tente novamente.')
      setStep('verify')
    }
  }

  const executeAction = async (verifiedEmail: string) => {
    if (!selectedAction) return

    try {
      if (selectedAction === 'access-link') {
        // Gerar link de acesso
        const response = await fetch('/api/email/send-access-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: verifiedEmail }),
        })

        const data = await response.json()
        if (data.success) {
          setMessage('Link de acesso enviado para seu e-mail!')
          setStep('success')
          onActionComplete?.('access-link', true)
        } else {
          throw new Error(data.error || 'Erro ao gerar link')
        }
      } else if (selectedAction === 'reset-password') {
        // Recuperar senha
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: verifiedEmail, area: 'wellness' }),
        })

        const data = await response.json()
        if (data.success) {
          setMessage('Link para redefinir senha enviado para seu e-mail!')
          setStep('success')
          onActionComplete?.('reset-password', true)
        } else {
          throw new Error(data.error || 'Erro ao recuperar senha')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar ação')
      setStep('verify')
    }
  }

  const handleReset = () => {
    setSelectedAction(null)
    setStep('email')
    setEmail('')
    setVerificationId(null)
    setVerificationCode('')
    setError(null)
    setMessage(null)
  }

  if (selectedAction) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {selectedAction === 'access-link' ? '🔗 Gerar Link de Acesso' : '🔐 Recuperar Senha'}
          </h3>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 'email' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              {selectedAction === 'access-link'
                ? 'Informe seu e-mail para receber um link de acesso direto ao sistema.'
                : 'Informe seu e-mail para receber um link de recuperação de senha.'}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu e-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={step === 'processing'}
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <button
              onClick={handleSendCode}
              disabled={step === 'processing' || !email}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {step === 'processing' ? 'Enviando...' : 'Enviar Código de Verificação'}
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Enviamos um código de 6 dígitos para <strong>{email}</strong>. 
              Digite o código abaixo:
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Verificação
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-2xl font-mono tracking-widest"
                disabled={step === 'processing'}
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600">{message}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('email')}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleVerifyCode}
                disabled={step === 'processing' || verificationCode.length !== 6}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {step === 'processing' ? 'Processando...' : 'Verificar e Continuar'}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">✅</div>
            <h4 className="text-xl font-bold text-gray-900">Sucesso!</h4>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={handleReset}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Fazer Nova Solicitação
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Gerar Link de Acesso */}
      <button
        onClick={() => handleStartAction('access-link')}
        className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-500 p-8 text-center transition-all transform hover:scale-105"
      >
        <div className="text-5xl mb-4">🔗</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Gerar Link de Acesso</h3>
        <p className="text-gray-600 text-sm">
          Receba um link direto para acessar sua conta sem senha
        </p>
      </button>

      {/* Recuperar Senha */}
      <button
        onClick={() => handleStartAction('reset-password')}
        className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-500 p-8 text-center transition-all transform hover:scale-105"
      >
        <div className="text-5xl mb-4">🔐</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Recuperar Senha</h3>
        <p className="text-gray-600 text-sm">
          Redefina sua senha de forma segura
        </p>
      </button>
    </div>
  )
}
