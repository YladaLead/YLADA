'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'

/**
 * /entrar — Entrada central do app (usado como start_url no app store).
 *
 * Fluxo:
 *  1. Usuário novo → vê landing de venda → clica "Quero experimentar"
 *     → redireciona para ylada.com (browser externo, não IAP)
 *  2. Usuário existente → clica "Já tenho conta" → digita email
 *     → backend detecta a área → redireciona para o login correto
 */
export default function EntrarPage() {
  const router = useRouter()
  const [step, setStep] = useState<'landing' | 'email' | 'loading' | 'notfound'>('landing')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  async function handleDetectArea() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed.includes('@')) {
      setError('Digite um e-mail válido.')
      return
    }

    setError('')
    setStep('loading')

    try {
      const res = await fetch(`/api/auth/detect-area?email=${encodeURIComponent(trimmed)}`)
      const data = await res.json()

      if (data.found && data.loginUrl) {
        router.push(data.loginUrl)
      } else {
        setStep('notfound')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setStep('email')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="px-5 py-4 border-b border-gray-100">
        <YLADALogo size="sm" responsive className="bg-transparent" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">

        {/* ── STEP: LANDING ── */}
        {step === 'landing' && (
          <div className="w-full max-w-sm text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Diagnostique seu negócio em 15 minutos
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                Perguntas que revelam o problema antes de qualquer solução.
                A venda acontece como consequência.
              </p>
            </div>

            <div className="space-y-3">
              {/* Botão principal → abre browser externo (nunca IAP) */}
              <a
                href="https://ylada.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm text-center hover:bg-blue-700 transition-colors"
              >
                Quero experimentar →
              </a>

              {/* Já tem conta */}
              <button
                onClick={() => setStep('email')}
                className="block w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm text-center hover:bg-gray-50 transition-colors"
              >
                Já tenho conta
              </button>
            </div>

            {/* Prova social rápida */}
            <p className="text-xs text-gray-400">
              Usado por profissionais de saúde, estética, coaches e líderes comerciais
            </p>
          </div>
        )}

        {/* ── STEP: EMAIL ── */}
        {(step === 'email' || step === 'loading') && (
          <div className="w-full max-w-sm space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-gray-900">Qual é o seu e-mail?</h2>
              <p className="text-sm text-gray-500">
                Vamos identificar sua área automaticamente
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDetectArea()}
                placeholder="seuemail@exemplo.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={step === 'loading'}
              />

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}

              <button
                onClick={handleDetectArea}
                disabled={step === 'loading'}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm disabled:opacity-60 hover:bg-blue-700 transition-colors"
              >
                {step === 'loading' ? 'Identificando sua área…' : 'Continuar →'}
              </button>

              <button
                onClick={() => { setStep('landing'); setError('') }}
                className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Voltar
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: NOT FOUND ── */}
        {step === 'notfound' && (
          <div className="w-full max-w-sm text-center space-y-5">
            <div className="text-4xl">🤔</div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">E-mail não encontrado</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Não encontramos uma conta com <strong className="text-gray-700">{email}</strong>.
                Verifique o e-mail ou crie uma conta em ylada.com.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => { setStep('email'); setError('') }}
                className="block w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Tentar outro e-mail
              </button>
              <a
                href="https://ylada.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm text-center hover:bg-blue-700 transition-colors"
              >
                Criar conta em ylada.com →
              </a>
            </div>
          </div>
        )}

      </main>

      {/* Footer — Privacy policy link required by Apple App Store guideline 5.1.1 */}
      <footer className="text-center pb-8 space-y-1">
        <p className="text-xs text-gray-300">YLADA · ylada.com</p>
        <div className="flex items-center justify-center gap-3">
          <a href="/privacidade" className="text-xs text-gray-400 underline hover:text-gray-500 transition-colors">
            Política de Privacidade
          </a>
          <span className="text-xs text-gray-300">·</span>
          <a href="/termos" className="text-xs text-gray-400 underline hover:text-gray-500 transition-colors">
            Termos de Uso
          </a>
        </div>
      </footer>

    </div>
  )
}
