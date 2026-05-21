'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

type MpNotice = 'ok' | 'pending' | 'fail' | null

function formatYmdPtBr(ymd: string | null | undefined): string {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}/.test(ymd)) return '—'
  const [y, m, d] = ymd.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

function ProEsteticaCapilarAssinaturaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mpNotice, setMpNotice] = useState<MpNotice>(null)
  const [accessOk, setAccessOk] = useState(false)
  const [accessValidUntil, setAccessValidUntil] = useState<string | null>(null)
  const [monthlyBrl, setMonthlyBrl] = useState<number | null>(null)
  const [annualTotalBrl, setAnnualTotalBrl] = useState<number | null>(null)
  const [annualMonthlyBrl, setAnnualMonthlyBrl] = useState<number | null>(null)
  const [checkoutPlan, setCheckoutPlan] = useState<'monthly' | 'annual' | null>(null)
  const [isOwner, setIsOwner] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-estetica-capilar/subscription', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = (data as { error?: string }).error
        if (msg) setError(msg)
        setAccessOk(false)
        return
      }
      const ok = Boolean((data as { accessOk?: boolean }).accessOk)
      setAccessOk(ok)
      setAccessValidUntil((data as { accessValidUntil?: string | null }).accessValidUntil ?? null)
      setMonthlyBrl((data as { monthlyAmountBrl?: number }).monthlyAmountBrl ?? null)
      setAnnualTotalBrl((data as { annualTotalBrl?: number }).annualTotalBrl ?? null)
      setAnnualMonthlyBrl((data as { annualMonthlyEquivalentBrl?: number }).annualMonthlyEquivalentBrl ?? null)
      const ownerId = (data as { ownerUserId?: string }).ownerUserId
      if (ownerId && user?.id) {
        setIsOwner(user.id === ownerId)
      }
      if (ok) {
        router.replace('/pro-estetica-capilar/painel')
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
    router.replace(`/pro-estetica-capilar/painel/assinatura${qs ? `?${qs}` : ''}`, { scroll: false })

    if (mp === 'ok' || mp === 'pending') {
      void load()
    }
  }, [searchParams, router, load])

  async function startCheckout(planType: 'monthly' | 'annual') {
    setCheckoutPlan(planType)
    setCheckoutLoading(true)
    setError(null)
    setMpNotice(null)
    try {
      const res = await fetch('/api/pro-estetica-capilar/subscription/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType }),
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
      setCheckoutPlan(null)
    }
  }

  function fmtBrl(n: number) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const mpNoticeCopy =
    mpNotice === 'ok'
      ? 'Pagamento recebido. O acesso ao painel ativa em breve — se não abrir sozinho, aguarde um instante e atualize.'
      : mpNotice === 'pending'
        ? 'Pagamento pendente. Quando for confirmado, o acesso renova automaticamente.'
        : mpNotice === 'fail'
          ? 'O pagamento não foi concluído. Pode tentar de novo quando quiser.'
          : null

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-stretch gap-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Assinatura Pro Estética Capilar</h1>

        {mpNoticeCopy ? (
          <div
            className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm leading-relaxed ${
              mpNotice === 'fail'
                ? 'border-amber-200 bg-amber-50 text-amber-950'
                : 'border-emerald-200 bg-emerald-50 text-emerald-950'
            }`}
            role="status"
          >
            {mpNoticeCopy}
          </div>
        ) : null}

        {accessValidUntil && !accessOk ? (
          <p className="text-sm text-gray-600 text-left">
            O último período de acesso terminou em{' '}
            <strong className="tabular-nums">{formatYmdPtBr(accessValidUntil)}</strong>. Renove para voltar ao
            painel.
          </p>
        ) : null}

        {loading ? (
          <p className="text-sm text-gray-500">A carregar…</p>
        ) : accessOk ? (
          <p className="text-sm text-emerald-800">Acesso ativo. A redirecionar para o painel…</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 text-left leading-relaxed">
              Cobrança no cartão via Mercado Pago. Após a confirmação, o acesso ao painel renova automaticamente
              (1 mês no mensal ou 12 meses no anual).
            </p>

            {!isOwner ? (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-left">
                Apenas a líder da clínica pode contratar ou renovar a assinatura.
              </p>
            ) : (
              <div className="flex w-full flex-col gap-3 text-left">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Para renovar ou contratar, acesse o site pelo navegador:
                </p>
                <a
                  href="https://ylada.com/renovar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white text-center hover:bg-sky-700"
                >
                  Renovar em ylada.com →
                </a>
              </div>
            )}
          </>
        )}

        {error ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-left" role="alert">
            {error}
          </p>
        ) : null}

        <Link
          href="/pro-estetica-capilar/assinatura"
          className="text-sm font-medium text-sky-700 underline hover:text-sky-900"
        >
          Abrir link de assinatura (se a sessão cair)
        </Link>
      </div>
    </div>
  )
}

export default function ProEsteticaCapilarAssinaturaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">A carregar…</div>}>
      <ProEsteticaCapilarAssinaturaContent />
    </Suspense>
  )
}
