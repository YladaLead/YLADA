'use client'

import { useCallback, useEffect, useState } from 'react'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'

type OverduePack = {
  id: string
  status: string
  slots: number
  amountBrl: number
  billingDay: number
}

async function openCheckout(res: Response): Promise<string | null> {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data as { error?: string }).error
    throw new Error(msg || 'Não foi possível abrir o pagamento.')
  }
  return (data as { checkoutUrl?: string }).checkoutUrl ?? null
}

/**
 * Aviso urgente no topo do painel quando um pacote +50 está em atraso (bloqueia o espaço inteiro).
 */
export function ProLideresInviteQuotaPackOverdueBanner() {
  const { isLeaderWorkspace, devStubPanel, operationLabel } = useProLideresPainel()
  const [overduePacks, setOverduePacks] = useState<OverduePack[]>([])
  const [payLoadingId, setPayLoadingId] = useState<string | null>(null)
  const [cardLoadingId, setCardLoadingId] = useState<string | null>(null)
  const [payError, setPayError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/pro-lideres/subscription', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      const reason = (data as { blockReason?: string | null }).blockReason
      const packs = ((data as { inviteQuotaPacks?: OverduePack[] }).inviteQuotaPacks ?? []).filter(
        (p) => p.status === 'past_due'
      )
      const show = reason === 'invite_quota_pack_overdue' && packs.length > 0
      setOverduePacks(show ? packs : [])
      setVisible(show)
    } catch {
      setVisible(false)
      setOverduePacks([])
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function payPix(packId: string) {
    setPayLoadingId(packId)
    setPayError(null)
    try {
      const res = await fetch(`/api/pro-lideres/invites/quota-pack/${packId}/pay-pix`, {
        method: 'POST',
        credentials: 'include',
      })
      const url = await openCheckout(res)
      if (url) window.location.href = url
      else setPayError('Resposta inválida do servidor.')
    } catch (e: unknown) {
      setPayError(e instanceof Error ? e.message : 'Erro ao abrir pagamento.')
    } finally {
      setPayLoadingId(null)
    }
  }

  async function payCard(packId: string) {
    setCardLoadingId(packId)
    setPayError(null)
    try {
      const res = await fetch('/api/pro-lideres/invites/quota-topup/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      })
      const url = await openCheckout(res)
      if (url) window.location.href = url
      else setPayError('Resposta inválida do servidor.')
    } catch (e: unknown) {
      setPayError(e instanceof Error ? e.message : 'Erro ao abrir assinatura.')
    } finally {
      setCardLoadingId(null)
    }
  }

  if (devStubPanel || !visible || overduePacks.length === 0) return null

  const leaderLabel = operationLabel?.trim() || 'da equipe'

  return (
    <div
      className="border-b-2 border-red-400 bg-red-600 px-3 py-3 text-white shadow-md sm:px-5 sm:py-4"
      role="alert"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-red-100">Urgente — pagamento em atraso</p>
      <p className="mt-1 text-sm font-semibold leading-snug sm:text-base">
        {isLeaderWorkspace
          ? 'Um pacote de convites venceu. O painel inteiro fica bloqueado até você regularizar.'
          : `O plano ${leaderLabel} está com pagamento em atraso. O painel fica bloqueado até o líder regularizar.`}
      </p>

      <ul className="mt-3 space-y-2">
        {overduePacks.map((pack) => (
          <li
            key={pack.id}
            className="rounded-lg border border-red-400/60 bg-red-700/40 px-3 py-2.5 text-sm text-red-50"
          >
            <span className="font-medium">
              +{pack.slots} convites · vence dia <strong className="text-white">{pack.billingDay}</strong> · R${' '}
              {pack.amountBrl.toLocaleString('pt-BR')}/mês
            </span>
            {isLeaderWorkspace ? (
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  disabled={payLoadingId === pack.id || cardLoadingId === pack.id}
                  onClick={() => void payPix(pack.id)}
                  className="min-h-[44px] rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-60"
                >
                  {payLoadingId === pack.id ? 'A abrir…' : 'Pagar agora (PIX ou cartão)'}
                </button>
                <button
                  type="button"
                  disabled={payLoadingId === pack.id || cardLoadingId === pack.id}
                  onClick={() => void payCard(pack.id)}
                  className="min-h-[44px] rounded-xl border border-white/80 bg-transparent px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
                >
                  {cardLoadingId === pack.id ? 'A abrir…' : 'Assinar cartão (renovação automática)'}
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-red-100">
                Fale com o líder da equipa para regularizar o pagamento. Até lá, as ferramentas ficam indisponíveis.
              </p>
            )}
          </li>
        ))}
      </ul>

      {payError ? <p className="mt-2 text-xs font-medium text-red-100">{payError}</p> : null}
    </div>
  )
}
