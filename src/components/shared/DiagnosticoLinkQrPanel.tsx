'use client'

import { useState } from 'react'
import ShareQrCode from '@/components/shared/ShareQrCode'
import { copyTextToClipboard } from '@/lib/clipboard'
import { copyQrPngToClipboardOrDownload } from '@/lib/ylada-qrcode-share'

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
  const [qrCopyHint, setQrCopyHint] = useState<string | null>(null)

  const copiar = async () => {
    const ok = await copyTextToClipboard(url.trim())
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copiarImagemQr = async () => {
    setQrCopyHint(null)
    const result = await copyQrPngToClipboardOrDownload(url, { downloadFilename: 'ylada-qrcode.png' })
    if (result === 'clipboard') {
      setQrCopyHint('Imagem do QR copiada — cole no WhatsApp, Stories ou e-mail.')
    } else if (result === 'download') {
      setQrCopyHint('Fizemos o download do PNG do QR (neste navegador não dá para copiar a imagem).')
    } else {
      setQrCopyHint('Não foi possível copiar nem baixar o QR. Tente outro navegador ou copie o link abaixo.')
    }
    if (result !== 'failed') {
      setTimeout(() => setQrCopyHint(null), 5000)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <p className="text-xs text-gray-600 leading-relaxed">
        Escaneie com a câmera do celular, copie a imagem do QR ou copie o link para enviar a outras pessoas.
      </p>
      <ShareQrCode url={url} size={176} />
      <button
        type="button"
        onClick={() => void copiarImagemQr()}
        className="w-full rounded-xl border-2 border-indigo-300 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-900 hover:bg-indigo-100"
      >
        Copiar imagem do QR
      </button>
      {qrCopyHint ? <p className="text-xs text-gray-600 leading-relaxed">{qrCopyHint}</p> : null}
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
