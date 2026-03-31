'use client'

import { useState } from 'react'
import ShareQrCode from '@/components/shared/ShareQrCode'
import { copyTextToClipboard } from '@/lib/clipboard'

type DiagnosticoLinkQrPanelProps = {
  /** URL pública completa do link. */
  url: string
  className?: string
}

/**
 * Painel para compartilhar o diagnóstico só com QR + copiar link (sem imagens de rede social).
 */
export function DiagnosticoLinkQrPanel({ url, className = '' }: DiagnosticoLinkQrPanelProps) {
  const [copied, setCopied] = useState(false)

  const copiar = async () => {
    const ok = await copyTextToClipboard(url.trim())
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <p className="text-xs text-gray-600 leading-relaxed">
        Escaneie com a câmera do celular ou copie o link para enviar para outras pessoas.
      </p>
      <ShareQrCode url={url} size={176} />
      <button
        type="button"
        onClick={() => void copiar()}
        className="w-full rounded-xl border-2 border-sky-300 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 hover:bg-sky-100"
      >
        {copied ? '✓ Link copiado!' : 'Copiar link'}
      </button>
    </div>
  )
}
