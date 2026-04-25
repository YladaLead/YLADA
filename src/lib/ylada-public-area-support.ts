/**
 * Link WhatsApp para quem não encontra a área nas listas públicas (hub, landings).
 * Número: NEXT_PUBLIC_YLADA_PUBLIC_AREA_WHATSAPP (E.164, só dígitos) ou fallback alinhado ao suporte institucional.
 */

const DEFAULT_WHATSAPP_E164 = '5519996049800'

const PREFILL_BY_LOCALE: Record<string, string> = {
  pt: 'Olá! Não encontrei minha área na lista da YLADA. Gostaria de solicitar análise da minha área.',
  en: "Hello! I didn't find my area on the YLADA list. I'd like to request an analysis of my area.",
  es: '¡Hola! No encontré mi área en la lista de YLADA. Me gustaría solicitar un análisis de mi área.',
}

export function getYladaPublicAreaAnalysisWhatsAppPrefill(locale?: string): string {
  const key = (locale || 'pt').split('-')[0].toLowerCase()
  return PREFILL_BY_LOCALE[key] ?? PREFILL_BY_LOCALE.pt
}

export function getYladaPublicAreaAnalysisWhatsAppUrl(locale?: string): string {
  const raw = process.env.NEXT_PUBLIC_YLADA_PUBLIC_AREA_WHATSAPP?.trim() || DEFAULT_WHATSAPP_E164
  const num = raw.replace(/\D/g, '') || DEFAULT_WHATSAPP_E164
  return `https://wa.me/${num}?text=${encodeURIComponent(getYladaPublicAreaAnalysisWhatsAppPrefill(locale))}`
}

export const YLADA_PUBLIC_AREA_SUPPORT_LABELS: Record<string, string> = {
  pt: 'Não encontrou sua área? Solicite análise pelo WhatsApp',
  en: "Don't see your area? Request an analysis via WhatsApp",
  es: '¿No encuentra su área? Solicite un análisis por WhatsApp',
}

export function getYladaPublicAreaSupportLinkLabel(locale?: string): string {
  const key = (locale || 'pt').split('-')[0].toLowerCase()
  return YLADA_PUBLIC_AREA_SUPPORT_LABELS[key] ?? YLADA_PUBLIC_AREA_SUPPORT_LABELS.pt
}
