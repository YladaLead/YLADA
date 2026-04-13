const PRO_LIDERES_WHATSAPP_E164 = '5519996049800'

/** Mensagem pré-preenchida ao abrir o WhatsApp a partir do site Pro Líderes. */
const PRO_LIDERES_WHATSAPP_PREFILL =
  'Olá! Vim pelo site YLADA Pro Líderes e gostaria de mais informações.'

export function getProLideresWhatsappUrl(): string {
  return `https://wa.me/${PRO_LIDERES_WHATSAPP_E164}?text=${encodeURIComponent(PRO_LIDERES_WHATSAPP_PREFILL)}`
}

export const PRO_LIDERES_WHATSAPP_LABEL = '(19) 99604-9800'
