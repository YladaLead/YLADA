'use client'

import { useState, useEffect, memo } from 'react'

interface QRCodeProps {
  url: string
  size?: number
  className?: string
  /** Quando true, gera o QR no cliente (data URL). Use no Quadro parceria para o PDF não sair em branco. */
  useDataUrl?: boolean
  /** Para impressão: gera em resolução maior (ex: 4 = 4x pixels). Melhora escaneabilidade do QR no PDF impresso. */
  resolutionMultiplier?: number
}

// 🚀 OTIMIZAÇÃO: React.memo para evitar re-renders desnecessários
function QRCode({ url, size = 200, className = '', useDataUrl = false, resolutionMultiplier = 1 }: QRCodeProps) {
  const [error, setError] = useState(false)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const generateSize = Math.round(size * resolutionMultiplier)

  // Gerar QR como data URL no cliente (evita canvas tainted no html2pdf)
  useEffect(() => {
    if (!useDataUrl || !url) return
    let cancelled = false
    import('qrcode').then((QRCodeLib) => {
      QRCodeLib.toDataURL(url, { width: generateSize, margin: 1, errorCorrectionLevel: 'H' })
        .then((url) => {
          if (!cancelled) setDataUrl(url)
        })
        .catch(() => {
          if (!cancelled) setError(true)
        })
    }).catch(() => {
      if (!cancelled) setError(true)
    })
    return () => { cancelled = true }
  }, [url, generateSize, useDataUrl])

  const qrCodeUrl = !useDataUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`
    : dataUrl

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-400 text-sm">Erro ao gerar QR Code</span>
      </div>
    )
  }

  if (useDataUrl && !dataUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded animate-pulse ${className}`} style={{ width: size, height: size }} />
    )
  }

  return (
    <div className={`inline-block ${className}`}>
      <img
        src={qrCodeUrl!}
        alt="QR Code"
        className="rounded-lg border-2 border-gray-200"
        style={{ width: size, height: size }}
        onError={() => setError(true)}
      />
    </div>
  )
}

export default memo(QRCode)

