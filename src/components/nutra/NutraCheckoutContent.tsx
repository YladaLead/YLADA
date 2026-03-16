'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { nutraCheckoutTranslations, type NutraLocale } from '@/lib/nutra-i18n'

interface NutraCheckoutContentProps {
  locale: NutraLocale
  basePath: string
}

export default function NutraCheckoutContent({ locale, basePath }: NutraCheckoutContentProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('annual')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canceled, setCanceled] = useState(false)
  const [email, setEmail] = useState('')

  const t = nutraCheckoutTranslations[locale]
  const apiLanguage = locale === 'pt' ? 'pt' : locale === 'es' ? 'es' : 'en'

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        if (loading) {
          setLoading(false)
          setError(t.errorTimeout)
        }
      }, 30000)
      return () => clearTimeout(timeout)
    }
  }, [loading, t.errorTimeout])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const plan = params.get('plan')
      const canceledParam = params.get('canceled')
      if (plan === 'annual') setPlanType('annual')
      else if (plan === 'monthly') setPlanType('monthly')
      if (canceledParam === 'true') setCanceled(true)
    }
  }, [])

  const handleCheckout = async () => {
    const userEmail = email || user?.email || ''
    if (!userEmail || !userEmail.includes('@')) {
      setError(t.errorEmail)
      return
    }

    setLoading(true)
    setError(null)
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | null = null

    try {
      timeoutId = setTimeout(() => controller.abort(), 30000)
      const response = await fetch('/api/nutra/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({
          planType,
          language: apiLanguage,
          email: userEmail,
          countryCode: 'BR',
        }),
      })

      if (timeoutId) clearTimeout(timeoutId)

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `Erro ${response.status}`)
      }

      const data = await response.json()
      if (!data.url) throw new Error('URL not returned')
      window.location.href = data.url
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        setError(t.errorTimeout)
      } else {
        setError(err.message || t.errorGeneric)
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href={basePath}>
            <Image
              src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
              alt="YLADA Nutra"
              width={280}
              height={84}
              className="bg-transparent object-contain h-12 sm:h-14 lg:h-16 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
          <button
            onClick={() => router.push(basePath)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            aria-label={t.back}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline font-medium">{t.back}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {canceled && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="text-sm">{t.canceledMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
          </div>

          <div className="mb-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlanType('monthly')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  planType === 'monthly' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-800">{t.monthlyPlan}</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">{t.monthlyPrice}<span className="text-base font-normal text-gray-600">{t.perMonth}</span></p>
                <p className="text-xs text-gray-600 mt-1">{t.monthlyDesc}</p>
              </button>
              <button
                type="button"
                onClick={() => setPlanType('annual')}
                className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                  planType === 'annual' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="absolute -top-2 right-3 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {t.recommended}
                </span>
                <h3 className="font-semibold text-gray-800">{t.annualPlan}</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">{t.annualPrice}</p>
                <p className="text-xs text-gray-600 mt-1">{t.totalAnnual}</p>
              </button>
            </div>
          </div>

          {(!user || authLoading) && (
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t.emailLabel} {user && t.emailLoggedIn}
              </label>
              <input
                id="email"
                type="email"
                value={email || user?.email || ''}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                {user ? t.emailNotePayment : t.emailNoteAccount}
              </p>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault()
              if (!loading && (email || user?.email)) handleCheckout()
            }}
            disabled={loading || (!user && !email)}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? t.processing : t.continueButton}
          </button>

          <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-1.5">✔ {t.cancelSimple}</li>
            <li className="flex items-center gap-1.5">✔ {t.paymentSecure}</li>
          </ul>
          <p className="mt-4 text-center text-xs text-gray-500">{t.paymentNote}</p>
        </div>
      </main>
    </div>
  )
}
