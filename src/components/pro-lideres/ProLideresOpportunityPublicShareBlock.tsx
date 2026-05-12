'use client'

import { useEffect, useState } from 'react'

type Props = {
  slug: string
  hasVideoUrl: boolean
}

function opportunityPath(slug: string) {
  return `/pro-lideres/o/${encodeURIComponent(slug)}/oportunidade`
}

export function ProLideresOpportunityPublicShareBlock({ slug, hasVideoUrl }: Props) {
  const [copied, setCopied] = useState<'link' | 'msg' | null>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(typeof window !== 'undefined' ? window.location.origin : '')
  }, [])

  const pathOnly = opportunityPath(slug)
  const absoluteUrl = origin ? `${origin}${pathOnly}` : pathOnly

  const fullMessage = `Olá!

Convido-te a ver esta apresentação sobre a oportunidade de negócio:

${absoluteUrl}

Qualquer dúvida, estou disponível.`

  async function copyText(text: string, kind: 'link' | 'msg') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setTimeout(() => setCopied(null), 2500)
    } catch {
      alert('Não foi possível copiar. Seleciona o texto manualmente.')
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50/50 p-4 sm:p-5">
      <p className="text-sm font-semibold text-gray-900">Partilha este endereço como a tua página da oportunidade</p>
      <p className="mt-1 text-xs text-gray-600">
        O contacto abre no WhatsApp que definiste neste perfil. O vídeo acima aparece nesta página quando o URL está
        preenchido e guardado.
      </p>
      {!hasVideoUrl ? (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Cola e guarda o URL do vídeo para a página mostrar a apresentação.
        </p>
      ) : null}
      <p className="mt-3 break-all font-mono text-xs text-gray-800 sm:text-sm">{absoluteUrl}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => copyText(absoluteUrl, 'link')}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          {copied === 'link' ? 'Link copiado' : 'Copiar link'}
        </button>
        <button
          type="button"
          onClick={() => copyText(fullMessage, 'msg')}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-sky-300 bg-white px-4 py-2.5 text-sm font-semibold text-sky-900 hover:bg-sky-50"
        >
          {copied === 'msg' ? 'Mensagem copiada' : 'Copiar mensagem (WhatsApp)'}
        </button>
        <a
          href={pathOnly}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Pré-visualizar
        </a>
      </div>
    </div>
  )
}
