'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import { useAuth } from '@/contexts/AuthContext'
import { PROMO_BEM_ESTAR_BR, PROMO_BEM_ESTAR_SLUG } from '@/lib/promo-bem-estar'

type CheckResponse = {
  accountFound: boolean
  hasActiveWellnessSubscription: boolean
  canOfferProfileConversion: boolean
  currentPerfil: string | null
}

function isValidEmail(s: string) {
  const t = s.trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

export default function PromoBemEstarCheckoutClient() {
  const { user, loading: authLoading } = useAuth()
  const [planType, setPlanType] = useState<'monthly' | 'annual'>('annual')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [convertLoading, setConvertLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkLoading, setCheckLoading] = useState(false)
  const [checkResult, setCheckResult] = useState<CheckResponse | null>(null)

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => {
      setLoading(false)
      setError('Demorou demais. Confira a conexão e tente de novo.')
    }, 32000)
    return () => clearTimeout(t)
  }, [loading])

  const sessionEmail = (user?.email || '').trim().toLowerCase()
  const typedEmail = email.trim().toLowerCase()
  const sameEmailAsSession = Boolean(sessionEmail && typedEmail && sessionEmail === typedEmail)

  useEffect(() => {
    setCheckResult(null)
    if (!isValidEmail(typedEmail)) {
      setCheckLoading(false)
      return
    }

    setCheckLoading(true)
    const id = setTimeout(async () => {
      try {
        const r = await fetch('/api/promo/bem-estar/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: typedEmail }),
        })
        const j = (await r.json()) as CheckResponse & { error?: string }
        if (!r.ok) {
          setCheckResult(null)
          setError(j.error || 'Não foi possível verificar o e-mail.')
          return
        }
        setError(null)
        setCheckResult({
          accountFound: j.accountFound,
          hasActiveWellnessSubscription: j.hasActiveWellnessSubscription,
          canOfferProfileConversion: j.canOfferProfileConversion,
          currentPerfil: j.currentPerfil,
        })
      } catch {
        setCheckResult(null)
      } finally {
        setCheckLoading(false)
      }
    }, 550)

    return () => clearTimeout(id)
  }, [typedEmail])

  const handlePay = async () => {
    const userEmail = email.trim()
    if (!isValidEmail(userEmail)) {
      setError('Informe um e-mail válido.')
      return
    }

    if (checkResult?.hasActiveWellnessSubscription) {
      setError('Este e-mail já tem assinatura wellness ativa. Use a opção de atualizar perfil ou entre com outro e-mail para nova assinatura.')
      return
    }

    setLoading(true)
    setError(null)
    const controller = new AbortController()
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    try {
      timeoutId = setTimeout(() => controller.abort(), 30000)
      const response = await fetch('/api/wellness/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({
          planType,
          language: 'pt',
          email: userEmail.trim().toLowerCase(),
          countryCode: 'BR',
          paymentMethod: planType === 'annual' ? 'auto' : undefined,
          promoSlug: PROMO_BEM_ESTAR_SLUG,
        }),
      })

      if (timeoutId) clearTimeout(timeoutId)

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error || `Erro ${response.status}`)
      }

      const data = (await response.json()) as { url?: string }
      if (!data.url) throw new Error('Link de pagamento não retornado.')
      window.location.href = data.url
    } catch (err: unknown) {
      if (timeoutId) clearTimeout(timeoutId)
      if (err instanceof Error && err.name === 'AbortError') {
        setError('A requisição expirou. Tente novamente.')
      } else {
        setError(err instanceof Error ? err.message : 'Não foi possível abrir o pagamento.')
      }
      setLoading(false)
    }
  }

  const handleConvert = useCallback(async () => {
    if (!sameEmailAsSession || !isValidEmail(typedEmail)) {
      setError('Entre com o mesmo e-mail informado acima para confirmar.')
      return
    }

    setConvertLoading(true)
    setError(null)
    try {
      const r = await fetch('/api/promo/bem-estar/convert-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: typedEmail }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) {
        throw new Error((j as { error?: string }).error || `Erro ${r.status}`)
      }
      window.location.href = '/pt/coach-bem-estar/home'
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Não foi possível atualizar o perfil.')
    } finally {
      setConvertLoading(false)
    }
  }, [sameEmailAsSession, typedEmail])

  const showAlreadyCoach =
    checkResult?.hasActiveWellnessSubscription && checkResult.currentPerfil === 'coach-bem-estar'

  const showConvertOffer =
    checkResult?.canOfferProfileConversion === true && checkResult.hasActiveWellnessSubscription

  const showOtherPerfilWithWellness =
    checkResult?.hasActiveWellnessSubscription &&
    checkResult.currentPerfil != null &&
    checkResult.currentPerfil !== 'wellness' &&
    checkResult.currentPerfil !== 'coach-bem-estar'

  /** Botão sempre visível; só habilita quando e-mail ok, verificação terminou e não há bloqueio de assinatura. */
  const payDisabled =
    loading ||
    convertLoading ||
    !isValidEmail(typedEmail) ||
    checkLoading ||
    Boolean(checkResult?.hasActiveWellnessSubscription) ||
    showOtherPerfilWithWellness

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <Link href="/pt" aria-label="Início" className="shrink-0">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link
            href="/pt/wellness/login"
            className="text-xs font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-16 pt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <h1 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">Convite</h1>
          <p className="mt-1 text-center text-sm font-medium text-slate-700">Coach do bem-estar</p>

          <p className="mt-6 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">Plano</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPlanType('monthly')}
              className={`rounded-xl border px-3 py-4 text-left transition ${
                planType === 'monthly'
                  ? 'border-blue-700 bg-blue-50 ring-2 ring-blue-600/15'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-xs text-slate-500">Mensal</span>
              <p className="mt-1 text-lg font-bold text-slate-900">R$ {PROMO_BEM_ESTAR_BR.monthly}</p>
              <span className="text-xs text-slate-500">por mês</span>
            </button>
            <button
              type="button"
              onClick={() => setPlanType('annual')}
              className={`relative rounded-xl border px-3 py-4 text-left transition ${
                planType === 'annual'
                  ? 'border-blue-600 bg-blue-50/90 ring-2 ring-blue-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className="absolute right-2 top-2 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                Promo
              </span>
              <span className="text-xs text-slate-500">Anual</span>
              <p className="mt-1 text-lg font-bold text-slate-900">R$ {PROMO_BEM_ESTAR_BR.annualMonthlyLabel}/mês</p>
              <span className="text-xs text-slate-600">Total R$ {PROMO_BEM_ESTAR_BR.annualTotal}</span>
            </button>
          </div>

          <label className="mt-8 block">
            <span className="text-xs font-medium text-slate-600">
              E-mail <span className="text-red-600">*</span>
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
            {checkLoading && isValidEmail(typedEmail) && (
              <span className="mt-1 block text-[11px] text-slate-400">Verificando…</span>
            )}
          </label>

          {showConvertOffer && (
            <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 text-left text-sm text-slate-800">
              <p className="font-semibold text-slate-900">Assinatura wellness ativa</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
                Este e-mail já tem assinatura na área wellness. Coach do bem-estar usa a mesma assinatura — você pode
                apenas <strong className="font-semibold">atualizar o perfil</strong> para entrar pela área Coach do
                bem-estar, sem pagar de novo.
              </p>
              {!authLoading && sameEmailAsSession && (
                <button
                  type="button"
                  disabled={convertLoading}
                  onClick={handleConvert}
                  className="mt-3 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {convertLoading ? 'Atualizando…' : 'Sim, atualizar meu perfil para Coach do bem-estar'}
                </button>
              )}
              {!authLoading && !sameEmailAsSession && (
                <p className="mt-3 text-[12px] text-slate-600">
                  Para confirmar,{' '}
                  <Link href="/pt/wellness/login" className="font-medium text-blue-700 underline underline-offset-2">
                    entre com este e-mail
                  </Link>{' '}
                  e volte a esta página — o botão de confirmação aparece quando o e-mail for o mesmo da sessão.
                </p>
              )}
            </div>
          )}

          {showAlreadyCoach && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-700">
              <p>Você já está com perfil Coach do bem-estar e assinatura ativa.</p>
              <Link
                href="/pt/coach-bem-estar/home"
                className="mt-2 inline-block font-medium text-blue-700 underline underline-offset-2"
              >
                Ir para a área
              </Link>
            </div>
          )}

          {showOtherPerfilWithWellness && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-950">
              Este e-mail tem assinatura wellness ativa, mas o perfil da conta não é wellness. Fale com o suporte para
              alinhar o acesso ao Coach do bem-estar.
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
          )}

          <button
            type="button"
            disabled={payDisabled}
            onClick={handlePay}
            title={
              payDisabled && !isValidEmail(typedEmail)
                ? 'Informe um e-mail válido para pagar'
                : payDisabled && checkLoading
                  ? 'Aguarde a verificação do e-mail'
                  : payDisabled && checkResult?.hasActiveWellnessSubscription
                    ? 'Este e-mail já tem assinatura wellness ativa'
                    : payDisabled && showOtherPerfilWithWellness
                      ? 'Use o suporte para alinhar este acesso'
                      : undefined
            }
            className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Abrindo…' : 'Pagar'}
          </button>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-600">
            Depois do pagamento aprovado, entre com o <span className="font-medium text-slate-800">mesmo e-mail</span>.
            Se for o primeiro acesso, complete o cadastro em{' '}
            <Link href="/pt/wellness/login" className="font-medium text-blue-700 underline underline-offset-2">
              bem-estar
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
