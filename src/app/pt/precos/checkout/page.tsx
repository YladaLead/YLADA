'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { useAuth } from '@/contexts/AuthContext'

export default function PrecosCheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('annual')
  const [planLocked, setPlanLocked] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.email) return
    setEmail((prev) => prev.trim() || user.email || '')
  }, [user?.email])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const plan = params.get('plan')
    if (plan === 'monthly' || plan === 'annual') {
      setPlanType(plan)
      setPlanLocked(true)
    }
  }, [])

  const handleCheckout = async () => {
    const userEmail = email.trim() || user?.email?.trim() || ''
    if (!userEmail || !userEmail.includes('@')) {
      setError('Informe um e-mail válido para continuar.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/nutri/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          planType,
          productType: planType === 'annual' ? 'platform_annual' : 'platform_monthly',
          language: 'pt',
          email: userEmail,
          countryCode: 'BR',
          paymentMethod: planType === 'annual' ? 'auto' : undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.error || 'Erro ao criar checkout')
      }

      const data = await response.json()
      if (!data?.url) throw new Error('URL de pagamento não retornada')
      window.location.href = data.url
    } catch (e: any) {
      setError(e?.message || 'Erro ao processar checkout.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt/precos" aria-label="Voltar para preços">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <button
            type="button"
            onClick={() => router.push('/pt/precos')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Você está a um passo de ativar o Pro.
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1 mb-6">
            Escolha como quer começar.
          </p>

          {planLocked ? (
            <div className="max-w-xl mx-auto">
              <div className="p-4 rounded-xl border-2 border-blue-600 bg-blue-50 text-left relative">
                {planType === 'annual' && (
                  <span className="absolute -top-2 right-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    MAIS ESCOLHIDO
                  </span>
                )}
                <h3 className="font-semibold text-gray-800">
                  {planType === 'annual' ? 'Plano Pro Anual' : 'Plano Pro Mensal'}
                </h3>
                {planType === 'annual' ? (
                  <>
                    <p className="text-2xl font-bold text-blue-600 mt-1">12x de R$ 150</p>
                    <p className="text-xs text-gray-600 mt-0.5">Total: R$ 1.800/ano</p>
                  </>
                ) : (
                  <p className="text-2xl font-bold text-blue-600 mt-1">R$ 300/mês</p>
                )}
              </div>
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setPlanLocked(false)}
                  className="text-sm text-blue-700 hover:text-blue-800 underline font-medium"
                >
                  Quero escolher outro plano
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => setPlanType('monthly')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  planType === 'monthly' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <h3 className="font-semibold text-gray-800">Plano Pro Mensal</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">R$ 300/mês</p>
              </button>
              <button
                type="button"
                onClick={() => setPlanType('annual')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  planType === 'annual' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <span className="absolute -top-2 right-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  MAIS ESCOLHIDO
                </span>
                <h3 className="font-semibold text-gray-800">Plano Pro Anual</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">12x de R$ 150</p>
                <p className="text-xs text-gray-600 mt-0.5">Total: R$ 1.800/ano</p>
              </button>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
            <h2 className="text-sm sm:text-base font-bold text-emerald-900 mb-3">
              O que muda quando você ativa o Pro
            </h2>
            <ul className="space-y-1.5 text-sm text-emerald-900/90">
              <li>✓ Mais conversas iniciadas no WhatsApp</li>
              <li>✓ Mais diagnósticos ativos ao mesmo tempo</li>
              <li>✓ Mais clareza com o Noel sem limite</li>
            </ul>
            <p className="mt-3 text-sm sm:text-base font-semibold text-emerald-800">
              Você vai ativar previsibilidade no seu crescimento.
            </p>
            <Link
              href="/pt/consultoria"
              className="inline-block mt-3 text-sm font-semibold text-emerald-800 underline hover:text-emerald-900"
            >
              Quero apoio humano com consultoria especializada
            </Link>
          </div>

          <div className="mt-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Seu e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Processando...' : 'Assinar Pro'}
          </button>
        </div>
      </main>
    </div>
  )
}

