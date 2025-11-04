'use client'

import { useState } from 'react'

interface QRCodeProps {
  url: string
  size?: number
  className?: string
}

export default function QRCode({ url, size = 200, className = '' }: QRCodeProps) {
  const [error, setError] = useState(false)

  // Usar API pública para gerar QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-400 text-sm">Erro ao gerar QR Code</span>
      </div>
    )
  }

  return (
    <div className={`inline-block ${className}`}>
      <img
        src={qrCodeUrl}
        alt="QR Code"
        className="rounded-lg border-2 border-gray-200"
        style={{ width: size, height: size }}
        onError={() => setError(true)}
      />
      <p className="text-xs text-gray-500 mt-2 text-center max-w-[200px] break-all">
        {url}
      </p>
    </div>
  )
}

