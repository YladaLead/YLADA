'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

type CancelReason =
  | 'no_time'
  | 'didnt_understand'
  | 'no_value'
  | 'forgot_trial'
  | 'too_expensive'
  | 'found_alternative'
  | 'other'

type RetentionOffer = {
  type: 'extend_trial' | 'guided_tour' | 'show_feature' | 'pause_subscription' | null
  message: string
  actionButton: string | null
}

interface YladaCancelRetentionModalProps {
  isOpen: boolean
  onClose: () => void
  onCanceled: () => void
  subscription: { id: string }
  /** Ex.: `/pt/nutri` — links Noel, diagnósticos */
  pathPrefix: string
}

type Step = 'reason' | 'other_detail' | 'offer' | 'stay_free' | 'confirming'

const API_BASE = '/api/ylada/subscription'

export default function YladaCancelRetentionModal({
  isOpen,
  onClose,
  onCanceled,
  subscription,
  pathPrefix,
}: YladaCancelRetentionModalProps) {
  const authenticatedFetch = useAuthenticatedFetch()
  const [step, setStep] = useState<Step>('reason')
  const [cancelReason, setCancelReason] = useState<CancelReason | null>(null)
  const [cancelReasonOther, setCancelReasonOther] = useState('')
  const [cancelAttemptId, setCancelAttemptId] = useState<string | null>(null)
  const [retentionOffer, setRetentionOffer] = useState<RetentionOffer | null>(null)
  const [withinGuarantee, setWithinGuarantee] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setStep('reason')
    setCancelReason(null)
    setCancelReasonOther('')
    setCancelAttemptId(null)
    setRetentionOffer(null)
    setWithinGuarantee(false)
    setError(null)
    setProcessing(false)
  }, [isOpen])

  if (!isOpen) return null

  const resetAndClose = () => {
    setStep('reason')
    setCancelReason(null)
    setCancelReasonOther('')
    setCancelAttemptId(null)
    setRetentionOffer(null)
    setError(null)
    onClose()
  }

  const postCancelAttempt = async (reason: CancelReason, otherText: string | null) => {
    const res = await authenticatedFetch(`${API_BASE}/cancel-attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cancelReason: reason,
        cancelReasonOther: reason === 'other' ? otherText : null,
        subscriptionId: subscription.id,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erro ao processar')
    setCancelAttemptId(data.cancelAttemptId)
    setWithinGuarantee(!!data.withinGuarantee)
    if (data.retentionOffer) {
      setRetentionOffer(data.retentionOffer as RetentionOffer)
      setStep('offer')
    } else {
      setRetentionOffer(null)
      setStep('stay_free')
    }
  }

  const handleReasonSelect = async (reason: CancelReason) => {
    if (reason === 'other') {
      setCancelReason('other')
      setStep('other_detail')
      return
    }
    setCancelReason(reason)
    setError(null)
    try {
      setProcessing(true)
      await postCancelAttempt(reason, null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao processar')
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmitOtherDetail = async () => {
    setError(null)
    try {
      setProcessing(true)
      await postCancelAttempt('other', cancelReasonOther.trim() || null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao processar')
    } finally {
      setProcessing(false)
    }
  }

  const handleAcceptRetention = async () => {
    if (!cancelAttemptId || !retentionOffer?.type) return
    try {
      setProcessing(true)
      setError(null)
      const res = await authenticatedFetch(`${API_BASE}/accept-retention`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancelAttemptId,
          retentionType: retentionOffer.type,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao processar')

      resetAndClose()

      if (retentionOffer.type === 'guided_tour') {
        window.location.href = `${pathPrefix}/home?noel=tour`
      } else if (retentionOffer.type === 'show_feature') {
        window.location.href = `${pathPrefix}/links`
      } else {
        window.alert(data.message || 'Assinatura atualizada.')
        window.location.reload()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao processar')
    } finally {
      setProcessing(false)
    }
  }

  const handleConfirmCancel = async () => {
    if (!cancelAttemptId) {
      setError('Sessão de cancelamento inválida. Feche e abra de novo.')
      return
    }
    try {
      setProcessing(true)
      setError(null)
      const res = await authenticatedFetch(`${API_BASE}/confirm-cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cancelAttemptId,
          requestRefund: withinGuarantee,
          reason: cancelReason === 'other' ? cancelReasonOther || 'other' : cancelReason,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao cancelar')

      const verifyRes = await authenticatedFetch('/api/ylada/subscription')
      const verifyData = await verifyRes.json()
      const paidGone =
        !verifyData.subscription ||
        verifyData.subscription?.plan_type === 'free' ||
        verifyData.subscription?.status === 'canceled'

      if (paidGone || data.canceled) {
        window.alert(data.message || 'Assinatura cancelada.')
        onCanceled()
        resetAndClose()
      } else {
        window.alert(data.message || 'Cancelamento registrado.')
        onCanceled()
        resetAndClose()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar')
    } finally {
      setProcessing(false)
    }
  }

  const handleClose = () => {
    if (processing) return
    resetAndClose()
  }

  const title =
    step === 'reason'
      ? 'Antes de cancelar…'
      : step === 'other_detail'
        ? 'Qual o motivo?'
        : step === 'offer'
          ? 'Que tal tentar isso?'
          : step === 'stay_free'
            ? 'Você pode continuar com a gente'
            : 'Confirmar cancelamento'

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
            {step === 'reason' && (
              <p className="text-sm text-gray-500">Ajuda a gente a melhorar — escolha uma opção</p>
            )}
          </div>
          {!processing && (
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              aria-label="Fechar"
            >
              ×
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        {step === 'reason' && (
          <div className="space-y-3">
            <p className="text-gray-700 text-sm mb-4">Por que você quer cancelar o plano pago?</p>
            {(
              [
                'no_time',
                'didnt_understand',
                'no_value',
                'forgot_trial',
                'too_expensive',
                'found_alternative',
              ] as CancelReason[]
            ).map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => handleReasonSelect(reason)}
                disabled={processing}
                className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-sky-50 hover:border-sky-300 transition-colors disabled:opacity-50"
              >
                <span className="text-gray-800 font-medium text-sm">
                  {reason === 'no_time' && 'Não tive tempo de usar'}
                  {reason === 'didnt_understand' && 'Não entendi como funciona'}
                  {reason === 'no_value' && 'Ainda não vi o resultado que esperava'}
                  {reason === 'forgot_trial' && 'Não lembrei que o período de teste acabava'}
                  {reason === 'too_expensive' && 'Está pesado no orçamento agora'}
                  {reason === 'found_alternative' && 'Vou usar outra solução'}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleReasonSelect('other')}
              disabled={processing}
              className="w-full text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <span className="text-gray-800 font-medium text-sm">Outro motivo</span>
            </button>
            {processing && (
              <p className="text-center text-sm text-gray-500 py-2">Processando…</p>
            )}
          </div>
        )}

        {step === 'other_detail' && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Conte em poucas palavras (opcional)</label>
            <textarea
              value={cancelReasonOther}
              onChange={(e) => setCancelReasonOther(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="O que poderíamos ter feito melhor?"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('reason')}
                disabled={processing}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSubmitOtherDetail}
                disabled={processing}
                className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 'offer' && cancelReason && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl p-4 border border-sky-100">
              <p className="text-gray-800 text-sm leading-relaxed">
                {retentionOffer?.message}
              </p>
            </div>

            {withinGuarantee && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                Você está dentro do prazo de garantia de 7 dias para reembolso, se aplicável ao seu pagamento.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {retentionOffer?.actionButton && (
                <button
                  type="button"
                  onClick={handleAcceptRetention}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 disabled:opacity-50"
                >
                  {processing ? 'Processando…' : retentionOffer.actionButton}
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep('stay_free')}
                disabled={processing}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50"
              >
                Seguir com o cancelamento do Pro
              </button>
            </div>
          </div>
        )}

        {step === 'stay_free' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-sky-200 bg-sky-50/90 p-4 text-sm text-gray-900 leading-relaxed">
              <p className="font-semibold text-gray-900 mb-2">O que mais importa é você continuar usando</p>
              <p className="mb-2">
                Se você <strong>cancelar a cobrança do plano pago</strong>, quando o período já pago acabar sua conta
                passa para o <strong>gratuito</strong>: você segue na YLADA com <strong>um diagnóstico ativo</strong>,
                limites mensais de conversas no WhatsApp e análises com o Noel — dá para manter o hábito de divulgar e
                acompanhar respostas sem pagar assinatura.
              </p>
              <p className="mb-2">
                Quem responde e compartilha seu link gera <strong>indicação</strong> e reforça sua autoridade; por isso
                muita gente fica só no gratuito e evolui com calma. O Pro volta a ficar disponível se um dia fizer
                sentido.
              </p>
              <p className="text-gray-700">
                Nada de pressão: escolha se prefere <strong>só parar a cobrança</strong> e seguir no free, ou{' '}
                <strong>fechar aqui</strong> e continuar no pago até o fim do ciclo.
              </p>
            </div>
            <Link
              href={`${pathPrefix}/links`}
              className="block text-center text-sm font-semibold text-sky-700 hover:text-sky-900 underline"
              onClick={handleClose}
            >
              Abrir meus links e diagnósticos
            </Link>
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700"
              >
                Vou continuar no gratuito e usando
              </button>
              <button
                type="button"
                onClick={() => setStep('confirming')}
                className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50"
              >
                Parar a cobrança do Pro (cancelar assinatura)
              </button>
            </div>
          </div>
        )}

        {step === 'confirming' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Você mantém acesso até o fim do período já pago. Depois disso, não haverá nova cobrança do plano pago.
              Se sua assinatura foi feita pelo <strong>Mercado Pago</strong>, a renovação também é interrompida lá
              (além de atualizarmos no sistema).
            </p>
            {withinGuarantee ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                Você está na garantia de 7 dias: ao confirmar, pode haver reembolso conforme a forma de pagamento.
                Detalhes aparecem na mensagem de confirmação.
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                Fora da garantia de 7 dias, não há reembolso automático; o acesso segue até o fim do ciclo atual.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('stay_free')}
                disabled={processing}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={processing}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Processando…' : 'Confirmar cancelamento do Pro'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
