'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  configureRevenueCat,
  getCurrentOffering,
  purchasePackage,
  restorePurchases,
} from '@/lib/iap/revenuecat-client'

/**
 * Paywall NATIVO do app iOS (In-App Purchase via RevenueCat / StoreKit).
 *
 * Substitui qualquer página de compra/checkout dentro do app iOS. Como a venda
 * agora acontece pelo IAP da Apple, esta tela PODE mostrar preço e botão de
 * assinar — é exatamente o que a Apple exige (guideline 3.1.1). O site segue
 * vendendo por Mercado Pago; aqui é só o iOS.
 *
 * Pós-compra: o entitlement "pro" fica ativo na hora no cliente; o webhook do
 * RevenueCat grava a linha em `subscriptions` (área 'ylada') logo em seguida,
 * destravando os gates do servidor.
 */
export default function NativeAppPaywall({ homeHref = '/pt' }: { homeHref?: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState<any[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Configura o SDK (logado no user.id quando houver) e busca a oferta atual.
  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      setError(null)
      const ok = await configureRevenueCat(user?.id)
      if (!ok) {
        if (active) {
          setError('Não foi possível carregar os planos agora. Tente novamente em instantes.')
          setLoading(false)
        }
        return
      }
      const offering = await getCurrentOffering()
      if (!active) return
      const pkgs = Array.isArray(offering?.availablePackages) ? offering.availablePackages : []
      setPackages(pkgs)
      if (pkgs.length === 0) {
        setError('Nenhum plano disponível no momento.')
      }
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [user?.id])

  const handleBuy = useCallback(
    async (pkg: any) => {
      setError(null)
      setMessage(null)
      setBusyId(pkg?.identifier || pkg?.product?.identifier || 'pkg')
      const result = await purchasePackage(pkg)
      setBusyId(null)
      if (result.cancelled) return
      if (result.ok) {
        setMessage('Assinatura ativada! Aproveite o YLADA Pro.')
        setTimeout(() => router.push(homeHref), 1200)
        return
      }
      setError(result.error || 'Não foi possível concluir a compra.')
    },
    [homeHref, router],
  )

  const handleRestore = useCallback(async () => {
    setError(null)
    setMessage(null)
    setRestoring(true)
    const ok = await restorePurchases()
    setRestoring(false)
    if (ok) {
      setMessage('Compra restaurada! Acesso liberado.')
      setTimeout(() => router.push(homeHref), 1200)
    } else {
      setError('Nenhuma assinatura ativa encontrada para restaurar.')
    }
  }, [homeHref, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-7 max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">YLADA Pro</h1>
          <p className="text-gray-600 text-sm">
            Links ilimitados, Noel e todas as ferramentas. Assine direto pelo app.
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500 text-sm">Carregando planos…</div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg) => {
              const product = pkg?.product || {}
              const title: string = pkg?.identifier === '$rc_annual' || /annual|anual|year/i.test(product?.identifier || '')
                ? 'Plano anual'
                : 'Plano mensal'
              const price: string = product?.priceString || ''
              const id = pkg?.identifier || product?.identifier || title
              const isBusy = busyId === id
              return (
                <button
                  key={id}
                  type="button"
                  disabled={isBusy || !!busyId}
                  onClick={() => handleBuy(pkg)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 border-2 border-sky-600 rounded-xl text-left hover:bg-sky-50 transition-colors disabled:opacity-60"
                >
                  <span>
                    <span className="block font-semibold text-gray-900">{title}</span>
                    {product?.description ? (
                      <span className="block text-xs text-gray-500">{product.description}</span>
                    ) : null}
                  </span>
                  <span className="font-bold text-sky-700 whitespace-nowrap">
                    {isBusy ? '…' : price}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {message ? (
          <p className="mt-4 text-sm text-green-700 text-center">{message}</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600 text-center">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleRestore}
            disabled={restoring}
            className="text-sm font-medium text-sky-700 hover:text-sky-900 disabled:opacity-60"
          >
            {restoring ? 'Restaurando…' : 'Restaurar compra'}
          </button>
          <button
            type="button"
            onClick={() => router.push(homeHref)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Agora não
          </button>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-gray-400 text-center">
          A assinatura renova automaticamente até ser cancelada. Você pode gerenciar ou cancelar
          a qualquer momento nos Ajustes da App Store.
        </p>
      </div>
    </div>
  )
}
