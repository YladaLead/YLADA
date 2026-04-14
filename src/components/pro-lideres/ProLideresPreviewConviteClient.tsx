'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

/**
 * Pré-visualização estática do ecrã de convite + atalhos para testar pagamento (líder).
 * Não chama a API de validação de token.
 */
export function ProLideresPreviewConviteClient() {
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  async function testCheckout() {
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/pro-lideres/subscription/checkout', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCheckoutError((data as { error?: string }).error || 'Não foi possível abrir o link.')
        return
      }
      const url = (data as { checkoutUrl?: string }).checkoutUrl
      if (url) {
        window.location.href = url
      } else {
        setCheckoutError('Resposta sem URL.')
      }
    } catch {
      setCheckoutError('Erro de rede.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const mockExpires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

  return (
    <div className="min-h-[100dvh] bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm">
          <p className="font-semibold text-amber-950">Pré-visualização (teste)</p>
          <p className="mt-1 text-amber-900/90">
            Isto imita o ecrã que a equipe vê ao abrir o link de convite. Não usa token real.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <div className="mb-6 flex justify-center">
            <Image
              src={YLADA_OG_FALLBACK_LOGO_PATH}
              alt="YLADA"
              width={200}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>

          <div className="space-y-5">
            <h1 className="text-center text-xl font-bold text-gray-900">Convite para a equipe</h1>
            <p className="text-center text-sm text-gray-600">
              Espaço: <strong className="text-gray-900">Nome de exemplo (líder)</strong>
            </p>
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-center text-sm text-blue-900">
              Convite para <strong>exemplo@email.com</strong>
            </p>
            <p className="text-xs text-gray-500">Prazo: até {mockExpires}</p>
            <p className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs leading-relaxed text-gray-600">
              <strong className="text-gray-800">Onde fica a equipe:</strong> depois de entrar, o painel Pro Líderes abre
              em <span className="font-mono text-gray-800">/pro-lideres/painel</span>.
            </p>

            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 px-3 py-2 text-center text-xs text-gray-500">
              Formulário de registo / entrar — oculto na pré-visualização
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-900">Testar fluxo do líder (pagamento)</p>
          <p className="mt-1 text-xs text-gray-600">
            Com sessão de <strong>líder</strong>, podes testar a ativação e o link de pagamento.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="/pro-lideres/painel/assinatura-equipe"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Abrir página de ativação
            </Link>
            <button
              type="button"
              onClick={() => void testCheckout()}
              disabled={checkoutLoading}
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-blue-600 bg-white px-4 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
            >
              {checkoutLoading ? 'A abrir…' : 'Testar pagamento'}
            </button>
          </div>
          {checkoutError && (
            <p className="mt-2 text-xs text-red-700">{checkoutError}</p>
          )}
        </div>

        <p className="text-center text-xs text-gray-500">
          <Link href="/pro-lideres/painel/links" className="font-medium text-blue-600 hover:text-blue-800">
            ← Voltar a Convidar equipe
          </Link>
        </p>
      </div>
    </div>
  )
}
