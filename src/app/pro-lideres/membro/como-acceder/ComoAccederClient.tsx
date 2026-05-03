'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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

export function ProLideresMembroComoAccederClient({
  email,
  nextPath,
}: {
  email: string
  nextPath: string
}) {
  const [copied, setCopied] = useState(false)
  const origin = publicOrigin()
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
    <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
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
          Guarda este acesso no telemóvel: assim entras sempre com o <strong className="text-gray-900">mesmo e-mail</strong> e a{' '}
          <strong className="text-gray-900">mesma palavra-passe</strong> que acabaste de definir.
        </p>

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

        <div className="mt-6 space-y-4 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-4 text-sm text-blue-950">
          <p className="font-semibold text-blue-900">Pôr no ecrã principal (como uma app)</p>
          <div className="space-y-3 text-left text-blue-900/95">
            <p>
              <span className="font-semibold text-blue-950">iPhone (Safari):</span> toca no botão{' '}
              <span className="whitespace-nowrap font-medium">Partilhar</span> (quadrado com seta) → desce até{' '}
              <span className="font-medium">Adicionar ao ecrã principal</span>.
            </p>
            <p>
              <span className="font-semibold text-blue-950">Android (Chrome):</span> toca nos{' '}
              <span className="font-medium">três pontos</span> ⋮ → <span className="font-medium">Instalar app</span> ou{' '}
              <span className="font-medium">Adicionar à página inicial</span> (o nome pode mudar um pouco consoante o telemóvel).
            </p>
          </div>
        </div>

        <Link
          href={fullLoginUrl}
          className="mt-8 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Entrar agora
        </Link>

        <p className="mt-4 text-center text-xs text-gray-500">
          Depois de entrares, segues para os próximos passos no Pro Líderes.
        </p>
      </div>
    </div>
  )
}
