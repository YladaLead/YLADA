export type CopyQrPngResult = 'clipboard' | 'download' | 'failed'

const DEFAULT_OPTS = {
  errorCorrectionLevel: 'H' as const,
  margin: 2,
  width: 512,
  color: { dark: '#111827', light: '#FFFFFF' },
}

/**
 * Tenta copiar o QR como PNG para a área de transferência; se não for possível,
 * dispara o download de um PNG (útil em Safari / contextos sem ClipboardItem).
 */
export async function copyQrPngToClipboardOrDownload(
  url: string,
  options?: { downloadFilename?: string; width?: number }
): Promise<CopyQrPngResult> {
  const trimmed = url.trim()
  if (!trimmed) return 'failed'

  const QRCodeLib = (await import('qrcode')).default
  const width = options?.width ?? DEFAULT_OPTS.width
  const filename = options?.downloadFilename ?? 'ylada-qr.png'
  const genOpts = { ...DEFAULT_OPTS, width }

  const dataUrl = await QRCodeLib.toDataURL(trimmed, genOpts).catch(() => '')
  if (!dataUrl) return 'failed'

  try {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      return 'clipboard'
    }
  } catch {
    /* tenta download */
  }

  try {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
    return 'download'
  } catch {
    return 'failed'
  }
}
