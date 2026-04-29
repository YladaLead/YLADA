import { PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH } from '@/lib/pro-lideres-pre-diagnostico'

/**
 * Imagem de apoio ao envio do pré-diagnóstico (pasta `public/pro-lideres/`).
 * O protocolo `wa.me` não aceita anexos; em telemóveis usamos Web Share com ficheiro.
 */
export const PRO_LIDERES_PRE_DIAGNOSTICO_SHARE_IMAGE_PATH = PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH

export function buildPreDiagnosticoWhatsAppShareText(formUrl: string): string {
  const u = formUrl.trim()
  return [
    'Olá! Segue o convite do pré-diagnóstico estratégico YLADA Pro Líderes (liderança em campo — confidencial).',
    '',
    'Quando puder, responda com calma para alinharmos a conversa:',
    u,
  ].join('\n')
}

export type SharePreDiagnosticoResult = 'native_share' | 'wa_text_only'

/**
 * Tenta partilhar imagem + texto (ex.: WhatsApp com anexo no telemóvel).
 * Se o browser não suportar `files`, abre `wa.me` só com texto e URL da imagem para referência.
 */
export async function sharePreDiagnosticoWithOptionalImage(
  formUrl: string
): Promise<SharePreDiagnosticoResult> {
  const text = buildPreDiagnosticoWhatsAppShareText(formUrl)
  if (typeof window === 'undefined') return 'wa_text_only'

  const imageAbs = `${window.location.origin}${PRO_LIDERES_PRE_DIAGNOSTICO_SHARE_IMAGE_PATH}`

  let file: File | null = null
  try {
    const res = await fetch(PRO_LIDERES_PRE_DIAGNOSTICO_SHARE_IMAGE_PATH)
    if (!res.ok) throw new Error('imagem indisponível')
    const blob = await res.blob()
    const mime =
      blob.type && blob.type !== 'application/octet-stream' ? blob.type : 'image/png'
    file = new File([blob], 'pre-diagnostico-ylada-pro-lideres.png', { type: mime })
  } catch {
    file = null
  }

  if (file && typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        text,
        title: 'Pré-diagnóstico YLADA Pro Líderes',
      })
      return 'native_share'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return 'native_share'
      }
    }
  }

  const textWithImageHint = `${text}\n\n📎 Imagem YLADA (pode guardar e anexar): ${imageAbs}`
  window.open(`https://wa.me/?text=${encodeURIComponent(textWithImageHint)}`, '_blank', 'noopener,noreferrer')
  return 'wa_text_only'
}
