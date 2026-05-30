'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

type MpNotice = 'ok' | 'pending' | 'fail' | null

function formatYmdPtBr(ymd: string | null | undefined): string {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}/.test(ymd)) return '—'
  const [y, m, d] = ymd.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

function ProLideresAssinaturaEquipeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mpNotice, setMpNotice] = useState<MpNotice>(null)
  const [accessOk, setAccessOk] = useState(false)
  const [isLeaderOwner, setIsLeaderOwner] = useState(true)
  const [isRenewal, setIsRenewal] = useState(false)
  const [lastPeriodEnd, setLastPeriodEnd] = useState<string | null>(null)
  const [monthlyAmountBrl, setMonthlyAmountBrl] = useState(750)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/subscription', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = (data as { error?: string }).error
        if (msg) setError(msg)
        setAccessOk(false)
        return
      }
      const ok = Boolean((data as { accessOk?: boolean }).accessOk)
      setAccessOk(ok)
      setIsRenewal(Boolean((data as { isRenewal?: boolean }).isRenewal))
      setLastPeriodEnd((data as { lastPeriodEnd?: string | null }).lastPeriodEnd ?? null)
      setMonthlyAmountBrl((data as { monthlyAmountBrl?: number }).monthlyAmountBrl ?? 750)
      const ownerId = (data as { ownerUserId?: string }).ownerUserId
      if (ownerId && user?.id) {
        setIsLeaderOwner(user.id === ownerId)
      } else {
        setIsLeaderOwner(true)
      }
      if (ok) {
        router.replace('/pro-lideres/painel')
      }
    } catch {
      setError('Erro de rede. Verifique a ligação e tente de novo.')
      setAccessOk(false)
    } finally {
      setLoading(false)
    }
  }, [router, user?.id])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const mp = searchParams.get('mp')
    if (mp !== 'ok' && mp !== 'pending' && mp !== 'fail') return

    setMpNotice(mp)
    const next = new URLSearchParams(searchParams.toString())
    next.delete('mp')
    const qs = next.toString()
    router.replace(`/pro-lideres/painel/assinatura-equipe${qs ? `?${qs}` : ''}`, { scroll: false })

    if (mp === 'ok' || mp === 'pending') {
      void load()
    }
  }, [searchParams, router, load])

  async function startCheckout() {
    setCheckoutLoading(true)
    setError(null)
    setMpNotice(null)
    try {
      const res = await fetch('/api/pro-lideres/subscription/checkout', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível abrir o pagamento. Tente de novo.')
        return
      }
      const url = (data as { checkoutUrl?: string }).checkoutUrl
      if (url) {
        window.location.href = url
      } else {
        setError('Não foi possível abrir o pagamento. Tente de novo.')
      }
    } catch {
      setError('Erro de rede. Verifique a ligação e tente de novo.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const mpNoticeCopy =
    mpNotice === 'ok'
      ? 'Pagamento recebido. A ativação dos convites entra em breve — se o painel ainda não abrir, aguarde um instante e atualize.'
      : mpNotice === 'pending'
        ? 'Pagamento pendente. Quando for confirmado, os convites da equipe ativam automaticamente.'
        : mpNotice === 'fail'
          ? 'O pagamento não foi concluído. Pode tentar de novo quando quiser.'
          : null

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12 md:py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-stretch gap-6 text-center sm:items-center sm:gap-8">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Ativar convites</h1>

        {mpNoticeCopy ? (
          <div
            className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm leading-relaxed sm:text-center ${
              mpNotice === 'fail'
                ? 'border-amber-200 bg-amber-50 text-amber-950'
                : 'border-emerald-200 bg-emerald-50 text-emerald-950'
            }`}
            role="status"
          >
            {mpNoticeCopy}
          </div>
        ) : null}

        {error ? (
          <div
            className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-left text-sm text-red-900 sm:text-center"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <p className="text-sm text-gray-500">A carregar…</p>
        ) : accessOk ? (
          <p className="text-sm text-gray-600">A redirecionar…</p>
        ) : !isLeaderOwner ? (
          <p className="w-full text-left text-sm leading-relaxed text-gray-600 sm:text-center">
            Seu acesso está bloqueado no momento. Há uma pendência de assinatura na YLADA para este espaço; quando
            estiver regularizada, você volta a entrar normalmente.
          </p>
        ) : (
          <div className="flex w-full flex-col items-stretch gap-6 sm:items-center">
            {isRenewal && lastPeriodEnd ? (
              <p className="w-full text-left text-sm leading-relaxed text-gray-600 sm:text-center">
                O último período da assinatura terminou em{' '}
                <strong className="tabular-nums text-gray-900">{formatYmdPtBr(lastPeriodEnd)}</strong>. Renove para
                voltar a convidar e liberar o acesso da equipe.
              </p>
            ) : (
              <p className="w-full text-left text-sm leading-relaxed text-gray-700 sm:text-center">
                Comece a convidar sua equipe e construa um{' '}
                <strong className="text-gray-900">crescimento organizado e previsível</strong> com clareza para orientar.
              </p>
            )}
            <p className="w-full text-left text-sm leading-relaxed text-gray-600 sm:text-center">
              Cobrança recorrente no cartão via Mercado Pago ·{' '}
              <strong className="text-gray-900">
                R$ {monthlyAmountBrl.toLocaleString('pt-BR')}/mês
              </strong>
              . Após a confirmação, os convites da equipe ativam automaticamente.
            </p>
            <button
              type="button"
              onClick={() => void startCheckout()}
              disabled={checkoutLoading}
              className="touch-manipulation inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 sm:max-w-[13.5rem]"
            >
              {checkoutLoading ? 'A abrir…' : isRenewal ? 'Renovar assinatura' : 'Ativar assinatura'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProLideresAssinaturaEquipePage() {
  return (
    <Suspense fallback={<p className="px-4 py-10 text-center text-sm text-gray-500">A carregar…</p>}>
      <ProLideresAssinaturaEquipeContent />
    </Suspense>
  )
}