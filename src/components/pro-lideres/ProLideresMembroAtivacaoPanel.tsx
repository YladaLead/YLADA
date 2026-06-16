'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import { ProLideresMembroPaymentLinksCard } from '@/components/pro-lideres/ProLideresMembroPaymentLinksCard'
import {
  clearProLideresAtivacaoPaymentSession,
  readProLideresAtivacaoPaymentSession,
} from '@/lib/pro-lideres-membro-ativacao'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

function parseUrl(raw: unknown): string | null {
  return typeof raw === 'string' && raw.trim() ? raw.trim() : null
}

export function ProLideresMembroAtivacaoPanel({
  spaceLabel,
  cardUrl: serverCardUrl,
  pixUrl: serverPixUrl,
}: {
  spaceLabel: string
  cardUrl: string | null
  pixUrl: string | null
}) {
  const [cardUrl, setCardUrl] = useState(serverCardUrl)
  const [pixUrl, setPixUrl] = useState(serverPixUrl)
  const [label, setLabel] = useState(spaceLabel)

  useEffect(() => {
    setCardUrl(serverCardUrl)
    setPixUrl(serverPixUrl)
    setLabel(spaceLabel)
  }, [serverCardUrl, serverPixUrl, spaceLabel])

  useEffect(() => {
    if (serverCardUrl || serverPixUrl) return
    const stash = readProLideresAtivacaoPaymentSession()
    if (!stash) return
    const stashCard = parseUrl(stash.cardUrl)
    const stashPix = parseUrl(stash.pixUrl)
    if (stashCard) setCardUrl(stashCard)
    if (stashPix) setPixUrl(stashPix)
    if (stash.spaceName?.trim()) setLabel(stash.spaceName.trim())
    if (stashCard || stashPix) clearProLideresAtivacaoPaymentSession()
  }, [serverCardUrl, serverPixUrl])

  const hasPayment = Boolean(cardUrl || pixUrl)

  const spaceDisplay = useMemo(() => label || 'seu espaço Pro Líderes', [label])

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
        <h1 className="text-center text-xl font-bold text-gray-900">Próximo passo: pagamento</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-gray-700">
          Seu cadastro em <strong className="text-gray-900">{spaceDisplay}</strong> foi recebido. Para liberar o acesso ao
          painel, conclua o pagamento com a sua equipe (Pix ou cartão/Mercado Pago), conforme as opções abaixo.
        </p>

        {hasPayment ? (
          <div className="mt-6">
            <ProLideresMembroPaymentLinksCard cardUrl={cardUrl} pixUrl={pixUrl} />
          </div>
        ) : (
          <div className="mt-6">
            <ProLideresMembroPaymentLinksCard cardUrl={null} pixUrl={null} />
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">Você pode fechar esta página e voltar quando quiser.</p>

        <p className="mt-8 text-center text-xs text-gray-500">
          <Link href="/pro-lideres/entrar" className="font-medium text-blue-600 underline hover:text-blue-800">
            Sair e entrar com outra conta
          </Link>
        </p>
      </div>
    </div>
  )
}
