'use client'

import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'

type ShareQrCodeProps = {
  url: string
  size?: number
  className?: string
}

export default function ShareQrCode({ url, size = 160, className = '' }: ShareQrCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>('')
  const sanitizedUrl = useMemo(() => url.trim(), [url])

  useEffect(() => {
    let active = true
    if (!sanitizedUrl) {
      setDataUrl('')
      return
    }

    QRCode.toDataURL(sanitizedUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: Math.max(size * 2, 320),
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    })
      .then((generated) => {
        if (active) setDataUrl(generated)
      })
      .catch(() => {
        if (active) setDataUrl('')
      })

    return () => {
      active = false
    }
  }, [sanitizedUrl, size])

  if (!sanitizedUrl) return null

  return (
    <div className={`w-full rounded-xl border border-sky-100 bg-sky-50/40 p-4 ${className}`}>
      <div className="mx-auto flex w-full max-w-[220px] flex-col items-center gap-3">
        <div className="rounded-lg bg-white p-2 shadow-sm">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="QR Code para compartilhamento do link"
              width={size}
              height={size}
              className="block rounded-sm"
            />
          ) : (
            <div
              className="animate-pulse rounded-sm bg-gray-100"
              style={{ width: size, height: size }}
              aria-hidden
            />
          )}
        </div>
        <p className="text-center text-xs text-gray-600 break-all">{sanitizedUrl}</p>
      </div>
    </div>
  )
}
