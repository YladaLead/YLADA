/** WhatsApp da Carol (atendimento humano). E.164 sem + (ex.: 5519996049800). */
export function getCarolWhatsAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_CAROL_WHATSAPP_E164 || '5519996049800'
  const digits = raw.replace(/\D/g, '')
  return `https://wa.me/${digits || '5519996049800'}`
}
