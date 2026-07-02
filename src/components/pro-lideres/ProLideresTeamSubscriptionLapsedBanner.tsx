'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner } from '@/lib/pro-lideres-team-subscription-lapsed-banner'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'

/**
 * Aviso no painel do líder quando a assinatura equipe venceu e a equipe está bloqueada.
 * O líder ainda navega no painel (draft), mas precisa saber que os membros não acessam.
 */
export function ProLideresTeamSubscriptionLapsedBanner() {
  const { isLeaderWorkspace, devStubPanel } = useProLideresPainel()
  const [visible, setVisible] = useState(false)

  const load = useCallback(async () => {
    if (!isLeaderWorkspace) {
      setVisible(false)
      return
    }
    try {
      const res = await fetch('/api/pro-lideres/subscription', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      const accessOk = Boolean((data as { accessOk?: boolean }).accessOk)
      const blockReason = (data as { blockReason?: string | null }).blockReason ?? null
      const hasTeamSubscriptionHistory = Boolean((data as { isRenewal?: boolean }).isRenewal)
      setVisible(
        proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner({
          isLeaderWorkspace: true,
          accessOk,
          blockReason,
          hasTeamSubscriptionHistory,
        })
      )
    } catch {
      setVisible(false)
    }
  }, [isLeaderWorkspace])

  useEffect(() => {
    void load()
  }, [load])

  if (devStubPanel || !visible) return null

  return (
    <div
      className="border-b-2 border-amber-400 bg-amber-50 px-3 py-3 text-amber-950 shadow-sm sm:px-5 sm:py-4"
      role="alert"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-amber-800">Assinatura da equipe vencida</p>
      <p className="mt-1 text-sm font-semibold leading-snug sm:text-base">
        A mensalidade Pro Líderes (R$ 750) deste espaço está em atraso ou aguardando confirmação. Sua equipe não
        consegue usar catálogo, tarefas diárias nem links — mesmo que os membros tenham pago a mensalidade deles.
      </p>
      <Link
        href="/pro-lideres/painel/assinatura-equipe"
        className="mt-3 inline-flex min-h-[44px] items-center rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
      >
        Regularizar assinatura da equipe
      </Link>
    </div>
  )
}
