'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

function ProLideresAssinaturaEquipeContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessOk, setAccessOk] = useState(false)
  const [isLeaderOwner, setIsLeaderOwner] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/subscription', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Tenta atualizar a página.')
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
        setError((data as { error?: string }).error || 'Tenta de novo.')
        return
      }
      const url = (data as { checkoutUrl?: string }).checkoutUrl
      if (url) {
        window.location.href = url
      } else {
        setError('Tenta de novo.')
      }
    } catch {
      setError('Erro de rede.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 md:py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Ativar convites</h1>

        {error && (
          <div className="w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-sm text-amber-950 sm:text-center">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">A carregar…</p>
        ) : accessOk ? (
          <p className="text-sm text-gray-600">A redirecionar…</p>
        ) : !isLeaderOwner ? (
          <p className="w-full max-w-sm text-sm leading-relaxed text-gray-600">
            Seu acesso está bloqueado no momento. Há uma pendência de assinatura na YLADA para este espaço; quando estiver
            regularizada, você volta a entrar normalmente. Pode atualizar a página daqui a pouco.
          </p>
        ) : (
          <div className="flex w-full flex-col items-center space-y-6">
            <p className="w-full text-sm leading-relaxed text-gray-700">
              Comece a convidar sua equipe e construa um{' '}
              <strong className="text-gray-900">crescimento organizado e previsível</strong> com clareza para orientar.
            </p>
            <button
              type="button"
              onClick={() => void startCheckout()}
              disabled={checkoutLoading}
              className="inline-flex min-h-[48px] w-full max-w-[13.5rem] items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {checkoutLoading ? 'A abrir…' : 'Ativar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProLideresAssinaturaEquipeContent
