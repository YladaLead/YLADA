'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import NoelChat from '@/components/ylada/NoelChat'
import { ProLideresNoelMembroAdesaoPitch } from '@/components/pro-lideres/pro-lideres-noel-membro-adesao-copy'

export type ProLideresNoelMembroClientVariant =
  | 'member'
  | 'leader_included'
  /** Líder em «Ver como equipe» em /membro/noel-membro — mesma tela do membro; botão Aderir desativado. */
  | 'leader_preview_member_noel'

export default function ProLideresNoelMembroClient({
  variant = 'member',
  initialHasSubscription,
  initialNoelMemberLapsed = false,
  initialCanChat,
  monthlyAmountBrl,
}: {
  variant?: ProLideresNoelMembroClientVariant
  initialHasSubscription: boolean
  /** Já teve Noel membro; período venceu (add-on à parte do plano da equipe). */
  initialNoelMemberLapsed?: boolean
  initialCanChat: boolean
  monthlyAmountBrl: number
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const mpReturnPath =
    variant === 'leader_included' ? '/pro-lideres/painel/noel-membro' : '/pro-lideres/membro/noel-membro'

  useEffect(() => {
    const mp = sp.get('mp')
    if (mp === 'ok' || mp === 'pending') {
      router.replace(mpReturnPath)
      router.refresh()
    }
  }, [sp, router, mpReturnPath])

  const startCheckout = useCallback(async () => {
    setErr(null)
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/pro-lideres/membro/noel-subscription/checkout', {
        method: 'POST',
        credentials: 'include',
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; checkoutUrl?: string }
      if (!res.ok) {
        setErr(data.error || 'Não foi possível abrir a adesão. Tente de novo.')
        return
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } finally {
      setCheckoutLoading(false)
    }
  }, [])

  const chatUnlocked = initialCanChat && (initialHasSubscription || variant === 'leader_included')

  if (initialHasSubscription && !initialCanChat && variant === 'member') {
    return (
      <div className="mx-auto max-w-lg space-y-3 py-4 text-sm text-gray-700">
        <h1 className="text-xl font-bold text-gray-900">Noel</h1>
        <p className="font-medium text-gray-800">Seu Noel membro já está pago — falta só o acesso da equipe voltar.</p>
        <p>
          Quando o plano Pro Líderes da operação normalizar, você volta ao chat na hora. Enquanto isso, fale com o
          líder.
        </p>
      </div>
    )
  }

  if (chatUnlocked) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {variant === 'leader_included' ? (
          <p className="text-xs leading-relaxed text-gray-700 rounded-lg border border-sky-100 bg-sky-50/90 px-3 py-2">
            <strong>Incluído no seu plano:</strong> este Noel da equipe vem na mensalidade Pro Líderes — sem taxa extra
            na YLADA. Membros que quiserem o add-on contratam à parte, na própria conta.
          </p>
        ) : null}
        <NoelChat
          area="pro_lideres_member"
          className="flex min-h-[min(70vh,560px)] flex-1 flex-col"
          chatApiPath="/api/pro-lideres/membro/noel"
          skipYladaContextualWelcome
          skipWelcomeMessage
          showChatHeaderTitle
          showHeaderEmoji={false}
          headerTitle="Noel"
          headerTagline="Estou aqui para ajudar, pergunte apenas o que precisar para desenvolver você."
          hideInputHint
          sendButtonLabel="Enviar"
          locale="pt"
        />
      </div>
    )
  }

  if (variant === 'leader_included') {
    return null
  }

  const brlMensal =
    Number.isFinite(monthlyAmountBrl) && monthlyAmountBrl % 1 === 0
      ? Math.round(monthlyAmountBrl).toString()
      : monthlyAmountBrl.toFixed(2)

  const previewMembroComoLider = variant === 'leader_preview_member_noel'

  if (variant === 'member' || previewMembroComoLider) {
    const lapsed = initialNoelMemberLapsed && !previewMembroComoLider
    const ctaLabel = lapsed ? 'Renovar Noel' : 'Aderir'

    return (
      <div className="mx-auto max-w-lg space-y-5 py-4">
        {previewMembroComoLider ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs leading-relaxed text-amber-950">
            <strong>Pré-visualização</strong> — abaixo é <strong>exatamente</strong> o que o membro vê. O botão
            «Aderir» só conclui com conta de membro (convite demo ou convite real).
          </p>
        ) : null}
        <h1 className="text-xl font-bold text-gray-900">Noel</h1>
        {lapsed ? (
          <p className="text-sm leading-relaxed text-gray-600">
            Seu Noel venceu. Renove no Mercado Pago para voltar ao chat — plano à parte da assinatura da equipe (R${' '}
            {brlMensal}/mês).
          </p>
        ) : (
          <ProLideresNoelMembroAdesaoPitch brlMensal={brlMensal} />
        )}
        {!previewMembroComoLider && err ? <p className="text-sm text-red-600">{err}</p> : null}
        {!previewMembroComoLider && sp.get('mp') === 'fail' ? (
          <p className="text-sm text-amber-800">Tente de novo.</p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            if (previewMembroComoLider) return
            void startCheckout()
          }}
          disabled={previewMembroComoLider || checkoutLoading}
          className={`touch-manipulation w-full rounded-lg px-4 py-3.5 text-sm font-bold shadow-sm ${
            previewMembroComoLider
              ? 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-500'
              : lapsed
                ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 disabled:opacity-60'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60'
          }`}
        >
          {checkoutLoading ? 'Um instante…' : ctaLabel}
        </button>
      </div>
    )
  }

  return null
}
