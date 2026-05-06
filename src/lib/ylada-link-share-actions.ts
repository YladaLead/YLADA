/**
 * Ações partilhadas entre catálogo Pro Líderes e lista «Seus links» (matriz / hubs).
 * Gera PNG do QR e copia para a área de transferência, com fallback de download.
 */
export async function copyYladaLinkQrAsPng(url: string): Promise<boolean> {
  try {
    const QRCodeLib = (await import('qrcode')).default
    const dataUrl = await QRCodeLib.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: '#2563eb', light: '#ffffff' },
    })
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      return true
    }
  } catch {
    /* continua */
  }
  try {
    const QRCodeLib = (await import('qrcode')).default
    const dataUrl = await QRCodeLib.toDataURL(url, { width: 280, margin: 2 })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'ylada-qr.png'
    a.click()
    return true
  } catch {
    return false
  }
}
