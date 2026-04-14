'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

function ProLideresAssinaturaEquipeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessOk, setAccessOk] = useState(false)
  const [periodEnd, setPeriodEnd] = useState<string | null>(null)
  const [isLeaderOwner, setIsLeaderOwner] = useState(true)

  const mp = searchParams.get('mp')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/subscription', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível carregar a assinatura.')
        setAccessOk(false)
        return
      }
      const ok = Boolean((data as { accessOk?: boolean }).accessOk)
      setAccessOk(ok)
      const ownerId = (data as { ownerUserId?: string }).ownerUserId
      if (ownerId && user?.id) {
        setIsLeaderOwner(user.id === ownerId)
      } else {
        setIsLeaderOwner(true)
      }
      const sub = (data as { subscription?: { currentPeriodEnd?: string } | null }).subscription
      setPeriodEnd(sub?.currentPeriodEnd ?? null)
      if (ok) {
        router.replace('/pro-lideres/painel')
      }
    } catch {
      setError('Erro de rede.')
      setAccessOk(false)
    } finally {
      setLoading(false)
    }
  }, [router, user?.id])

  useEffect(() => {
    void load()
  }, [load])

  async function startCheckout() {
    setCheckoutLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/subscription/checkout', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível iniciar o pagamento.')
        return
      }
      const url = (data as { checkoutUrl?: string }).checkoutUrl
      if (url) {
        window.location.href = url
      } else {
        setError('Resposta sem URL de checkout.')
      }
    } catch {
      setError('Erro de rede.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-gray-900">Assinatura da equipe</h1>
        <p className="text-sm text-gray-600">
          O acesso ao Pro Líderes para ti e para a tua equipe depende de uma assinatura mensal de{' '}
          <strong className="text-gray-800">R$ 750</strong> no Mercado Pago (cartão em débito recorrente). Se o
          pagamento falhar, o acesso é suspenso de imediato para todos.
        </p>
        <p className="text-sm text-gray-600">
          Inclui até <strong className="text-gray-800">50 convites ativos</strong> em simultâneo (convites pendentes
          válidos). O parcelamento no checkout é suportado pelo Mercado Pago; os juros são pagos por ti.
        </p>
      </div>

      {mp === 'ok' && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950">
          Pagamento autorizado ou em processamento. Se o painel não abrir sozinho, atualiza a página ou espera alguns
          segundos pela confirmação do Mercado Pago.
        </div>
      )}
      {mp === 'fail' && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-950">
          Não foi possível concluir no Mercado Pago. Podes tentar de novo abaixo.
        </div>
      )}
      {mp === 'pending' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Pagamento pendente. Quando o Mercado Pago confirmar, o acesso será liberado automaticamente.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">A carregar…</p>
      ) : accessOk ? (
        <p className="text-sm text-gray-600">A redirecionar para o painel…</p>
      ) : !isLeaderOwner ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Assinatura do líder inativa</p>
          <p className="mt-1 text-amber-900/90">
            O acesso da equipe depende do plano pago pelo líder. Entra em contacto com a pessoa responsável para
            regularizar o Mercado Pago.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={checkoutLoading}
            className="inline-flex w-full min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {checkoutLoading ? 'A abrir Mercado Pago…' : 'Assinar e cadastrar cartão (R$ 750 / mês)'}
          </button>
          {periodEnd && (
            <p className="text-xs text-gray-500">
              Último período registado até: {new Date(periodEnd).toLocaleString('pt-BR')}
            </p>
          )}
          <p className="text-center text-sm">
            <Link href="/pro-lideres/painel/perfil" className="font-medium text-blue-600 hover:text-blue-800">
              Perfil
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default function ProLideresAssinaturaEquipePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-lg px-4 py-10 text-sm text-gray-500">A carregar…</div>}>
      <ProLideresAssinaturaEquipeContent />
    </Suspense>
  )
}
