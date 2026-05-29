'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { readProLideresAtivacaoPaymentSession } from '@/lib/pro-lideres-membro-ativacao'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

function publicOrigin(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`.replace(/\/$/, '')
  }
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.replace(/\/$/, '') ||
    'https://www.ylada.com'
  )
}

export function ProLideresMembroComoAcessarClient({
  email,
  nextPath,
}: {
  email: string
  nextPath: string
}) {
  const [copied, setCopied] = useState(false)
  const [payment, setPayment] = useState<{ cardUrl: string | null; pixUrl: string | null }>({
    cardUrl: null,
    pixUrl: null,
  })
  const origin = publicOrigin()

  useEffect(() => {
    const stash = readProLideresAtivacaoPaymentSession()
    if (!stash) return
    const cardUrl =
      typeof stash.cardUrl === 'string' && stash.cardUrl.trim() ? stash.cardUrl.trim() : null
    const pixUrl = typeof stash.pixUrl === 'string' && stash.pixUrl.trim() ? stash.pixUrl.trim() : null
    if (cardUrl || pixUrl) setPayment({ cardUrl, pixUrl })
  }, [])
  const loginPath = '/pro-lideres/entrar'
  const fullLoginUrl = `${origin}${loginPath}?next=${encodeURIComponent(nextPath)}&email=${encodeURIComponent(email)}`

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullLoginUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [fullLoginUrl])

  return (
    <div className="flex min-h-[100svh] min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
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

        <h1 className="text-center text-xl font-bold text-gray-900">Conta criada</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-gray-700">
          Guarde este acesso no celular: use sempre o <strong className="text-gray-900">mesmo e-mail</strong> e a{' '}
          <strong className="text-gray-900">mesma senha</strong> que acabou de criar.
        </p>

        {payment.cardUrl || payment.pixUrl ? (
          <div className="mt-6 space-y-3">
            <p className="text-center text-sm font-semibold text-gray-900">Pagamento da equipe</p>
            <p className="text-center text-xs text-gray-600">
              Você já pode pagar agora. Depois use o botão abaixo para entrar e concluir a ativação.
            </p>
            {payment.pixUrl ? (
              <a
                href={payment.pixUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Pix
              </a>
            ) : null}
            {payment.cardUrl ? (
              <a
                href={payment.cardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Cartão ou Mercado Pago
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Link para entrar</p>
          <p className="mt-1 break-all font-mono text-xs text-gray-900">{fullLoginUrl}</p>
          <button
            type="button"
            onClick={() => void copyLink()}
            className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
          >
            {copied ? 'Copiado!' : 'Copiar link'}
          </button>
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-4 text-sm text-blue-950">
          <p className="font-semibold text-blue-900">Atalho na tela inicial (estilo app)</p>
          <p className="text-left text-blue-900/95">
            <span className="font-semibold text-blue-950">iPhone (Safari):</span> toque em{' '}
            <span className="whitespace-nowrap font-medium">Compartilhar</span> →{' '}
            <span className="font-medium">Adicionar à Tela de Início</span>.
          </p>
          <p className="text-left text-blue-900/95">
            <span className="font-semibold text-blue-950">Android (Chrome):</span> menu ⋮ →{' '}
            <span className="font-medium">Instalar app</span> ou <span className="font-medium">Adicionar à página inicial</span>{' '}
            (o nome pode variar conforme o aparelho).
          </p>
        </div>

        <Link
          href={fullLoginUrl}
          className="mt-8 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Entrar agora
        </Link>

        <p className="mt-4 text-center text-xs text-gray-500">
          Depois de entrar, você segue para o pagamento e a ativação no Pro Líderes.
        </p>
      </div>
    </div>
  )
}
