'use client'

import { useState } from 'react'

interface CancelRetentionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmCancel: () => void
  subscription: any
  daysSincePurchase: number
  withinGuarantee: boolean
}

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
  secondaryButton: string
}

const RETENTION_STRATEGY: Record<CancelReason, RetentionOffer> = {
  'no_time': {
    type: 'extend_trial',
    message: 'Isso é super comum 😊 Quer que a gente pause sua cobrança por mais 7 dias, sem custo, pra você testar com calma?',
    actionButton: 'Estender trial por 7 dias',
    secondaryButton: 'Cancelar agora'
  },
  'didnt_understand': {
    type: 'guided_tour',
    message: 'Talvez a gente não tenha te mostrado o melhor caminho ainda. Quer que a LYA te guie em 5 minutos agora?',
    actionButton: 'Quero ajuda agora',
    secondaryButton: 'Cancelar'
  },
  'no_value': {
    type: 'show_feature',
    message: 'Entendo. Em 90% dos casos, o valor aparece quando a pessoa usa as ferramentas. Quer testar criar uma ferramenta agora antes de sair?',
    actionButton: 'Me mostra agora',
    secondaryButton: 'Cancelar'
  },
  'forgot_trial': {
    type: 'extend_trial',
    message: 'Sem problemas 😊 Podemos te avisar e adiar a cobrança por mais 7 dias, se quiser.',
    actionButton: 'Adiar cobrança + estender trial',
    secondaryButton: 'Cancelar'
  },
  'too_expensive': {
    type: 'pause_subscription',
    message: 'Entendemos. Que tal pausar por 30 dias sem custo? Você pode retomar quando quiser.',
    actionButton: 'Pausar por 30 dias',
    secondaryButton: 'Cancelar'
  },
  'found_alternative': {
    type: null,
    message: 'Entendemos sua decisão. Tem certeza que quer cancelar?',
    actionButton: null,
    secondaryButton: 'Sim, cancelar'
  },
  'other': {
    type: null,
    message: 'Obrigado pelo feedback. Tem certeza que quer cancelar?',
    actionButton: null,
    secondaryButton: 'Sim, cancelar'
  }
}

export default function CancelRetentionModal({
  isOpen,
  onClose,
  onConfirmCancel,
  subscription,
  daysSincePurchase,
  withinGuarantee
}: CancelRetentionModalProps) {
  const [step, setStep] = useState<'reason' | 'offer' | 'confirming'>('reason')
  const [cancelReason, setCancelReason] = useState<CancelReason | null>(null)
  const [cancelReasonOther, setCancelReasonOther] = useState('')
  const [cancelAttemptId, setCancelAttemptId] = useState<string | null>(null)
  const [retentionOffer, setRetentionOffer] = useState<RetentionOffer | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  // Passo 1: Selecionar motivo
  const handleReasonSelect = async (reason: CancelReason) => {
    setCancelReason(reason)
    setError(null)

    try {
      setProcessing(true)
      
      // Registrar tentativa de cancelamento
      const response = await fetch('/api/nutri/subscription/cancel-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cancelReason: reason,
          cancelReasonOther: reason === 'other' ? cancelReasonOther : null,
          subscriptionId: subscription.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar')
      }

      setCancelAttemptId(data.cancelAttemptId)
      
      // Se tem oferta de retenção, mostrar
      if (data.retentionOffer) {
        setRetentionOffer(data.retentionOffer)
        setStep('offer')
      } else {
        // Sem oferta, ir direto para confirmação
        setStep('confirming')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar. Tente novamente.')
    } finally {
      setProcessing(false)
    }
  }

  // Passo 2: Aceitar oferta de retenção
  const handleAcceptRetention = async () => {
    if (!cancelAttemptId || !retentionOffer?.type) return

    try {
      setProcessing(true)
      setError(null)

      const response = await fetch('/api/nutri/subscription/accept-retention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cancelAttemptId,
          retentionType: retentionOffer.type
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar')
      }

      // Sucesso! Fechar modal e recarregar
      alert(data.message || 'Perfeito! Sua assinatura foi atualizada.')
      onClose()
      window.location.reload()
    } catch (err: any) {
      setError(err.message || 'Erro ao processar. Tente novamente.')
    } finally {
      setProcessing(false)
    }
  }

  // Passo 3: Confirmar cancelamento definitivo
  const handleConfirmCancel = async () => {
    if (!cancelAttemptId) {
      // Se não tem cancelAttemptId, criar agora
      if (!cancelReason) {
        setError('Por favor, selecione um motivo primeiro.')
        return
      }

      try {
        setProcessing(true)
        const response = await fetch('/api/nutri/subscription/cancel-attempt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            cancelReason,
            cancelReasonOther: cancelReason === 'other' ? cancelReasonOther : null,
            subscriptionId: subscription.id
          })
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Erro ao processar')
        setCancelAttemptId(data.cancelAttemptId)
      } catch (err: any) {
        setError(err.message || 'Erro ao processar')
        setProcessing(false)
        return
      }
    }

    try {
      setProcessing(true)
      setError(null)

      const response = await fetch('/api/nutri/subscription/confirm-cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cancelAttemptId,
          requestRefund: withinGuarantee,
          reason: cancelReason === 'other' ? cancelReasonOther : cancelReason
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cancelar')
      }

      // Sucesso!
      alert(data.message || 'Assinatura cancelada com sucesso.')
      onConfirmCancel()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar. Tente novamente.')
    } finally {
      setProcessing(false)
    }
  }

  const handleClose = () => {
    if (processing) return
    setStep('reason')
    setCancelReason(null)
    setCancelReasonOther('')
    setCancelAttemptId(null)
    setRetentionOffer(null)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {step === 'reason' && 'Antes de cancelar...'}
            {step === 'offer' && 'Que tal tentar isso?'}
            {step === 'confirming' && 'Confirmar cancelamento'}
          </h3>
          {!processing && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Fechar"
            >
              ×
            </button>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Step 1: Selecionar motivo */}
        {step === 'reason' && (
          <div className="space-y-4">
            <p className="text-gray-700 mb-4">
              Conta pra gente rapidinho: por que você está cancelando?
            </p>
            
            <div className="space-y-2">
              {(['no_time', 'didnt_understand', 'no_value', 'forgot_trial', 'too_expensive', 'found_alternative'] as CancelReason[]).map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReasonSelect(reason)}
                  disabled={processing}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reason === 'no_time' && 'Não tive tempo de usar'}
                  {reason === 'didnt_understand' && 'Não entendi como funciona'}
                  {reason === 'no_value' && 'Não vi valor ainda'}
                  {reason === 'forgot_trial' && 'Esqueci que o trial acabava'}
                  {reason === 'too_expensive' && 'Achei muito caro'}
                  {reason === 'found_alternative' && 'Encontrei uma alternativa'}
                </button>
              ))}
              
              <button
                onClick={() => {
                  setCancelReason('other')
                  setStep('offer')
                }}
                disabled={processing}
                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Outro motivo
              </button>
            </div>

            {processing && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Processando...</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Oferta de retenção */}
        {step === 'offer' && cancelReason && (
          <div className="space-y-4">
            <p className="text-gray-700 mb-4">
              {retentionOffer?.message || RETENTION_STRATEGY[cancelReason].message}
            </p>

            {cancelReason === 'other' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual o motivo? (opcional)
                </label>
                <textarea
                  value={cancelReasonOther}
                  onChange={(e) => setCancelReasonOther(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nos ajude a melhorar..."
                />
              </div>
            )}

            {withinGuarantee && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                  ✅ Você está dentro do prazo de garantia de 7 dias. 
                  {retentionOffer?.type === 'extend_trial' && ' Se cancelar depois, pode solicitar reembolso.'}
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              {retentionOffer?.actionButton && (
                <button
                  onClick={handleAcceptRetention}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processando...' : retentionOffer.actionButton}
                </button>
              )}
              
              <button
                onClick={() => setStep('confirming')}
                disabled={processing}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {retentionOffer?.secondaryButton || 'Cancelar agora'}
              </button>
            </div>

            {processing && (
              <div className="text-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirmação final */}
        {step === 'confirming' && (
          <div className="space-y-4">
            {withinGuarantee ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-semibold mb-2">
                    ✅ Você está dentro do prazo de garantia de 7 dias
                  </p>
                  <p className="text-sm text-green-700">
                    Ao cancelar, você receberá <strong>100% do valor pago</strong> de volta.
                    O reembolso será processado em até <strong>10 dias úteis</strong>.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 font-semibold mb-2">
                    ⚠️ Atenção
                  </p>
                  <p className="text-sm text-yellow-700">
                    Você perderá acesso imediatamente após o cancelamento.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-semibold mb-2">
                  ⚠️ Prazo de garantia expirado
                </p>
                <p className="text-sm text-yellow-700">
                  O prazo de 7 dias para reembolso já passou. Ao cancelar, você não receberá reembolso, mas manterá acesso até o final do período pago.
                </p>
              </div>
            )}

            {cancelReason === 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo do cancelamento (opcional)
                </label>
                <textarea
                  value={cancelReasonOther}
                  onChange={(e) => setCancelReasonOther(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nos ajude a melhorar..."
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(retentionOffer ? 'offer' : 'reason')}
                disabled={processing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

