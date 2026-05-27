/** Dados do pagador devolvidos pela API / webhook do Mercado Pago. */
export type MercadoPagoPayerSnapshot = {
  /** Login / conta MP no ato do pagamento (pode não ser quem passou o cartão). */
  email: string | null
  /** Nome payer MP ou, se vazio, titular do cartão. */
  name: string | null
  id: string | null
  cardholderName: string | null
  cardLastFour: string | null
}

type MpCardLike = {
  last_four_digits?: string | null
  last_four?: string | null
  cardholder?: { name?: string | null } | null
}

export type MercadoPagoPaymentPayerSource = {
  payer?: {
    email?: string | null
    first_name?: string | null
    last_name?: string | null
    id?: string | number | null
  } | null
  payer_email?: string | null
  card?: MpCardLike | null
}

function capitalizeWords(s: string): string {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Extrai dados do MP. O e-mail em `payer` costuma ser a conta logada no MP;
 * o titular do cartão (`card.cardholder.name`) indica quem pagou de facto.
 */
export function extractMercadoPagoPayerFromPayment(
  payment: MercadoPagoPaymentPayerSource
): MercadoPagoPayerSnapshot {
  const emailRaw = payment.payer?.email ?? payment.payer_email ?? ''
  const email = typeof emailRaw === 'string' && emailRaw.trim() ? emailRaw.trim().toLowerCase() : null

  const first = typeof payment.payer?.first_name === 'string' ? payment.payer.first_name.trim() : ''
  const last = typeof payment.payer?.last_name === 'string' ? payment.payer.last_name.trim() : ''
  const payerName = [first, last].filter(Boolean).join(' ').trim() || null

  const cardholderRaw =
    typeof payment.card?.cardholder?.name === 'string' ? payment.card.cardholder.name.trim() : ''
  const cardholderName = cardholderRaw ? capitalizeWords(cardholderRaw) : null

  const lastFourRaw = payment.card?.last_four_digits ?? payment.card?.last_four ?? ''
  const cardLastFour =
    typeof lastFourRaw === 'string' && /^\d{4}$/.test(lastFourRaw.trim())
      ? lastFourRaw.trim()
      : typeof lastFourRaw === 'number'
        ? String(lastFourRaw).padStart(4, '0').slice(-4)
        : null

  const name = payerName || cardholderName

  const id =
    payment.payer?.id !== undefined && payment.payer?.id !== null && payment.payer?.id !== ''
      ? String(payment.payer.id)
      : null

  return { email, name, id, cardholderName, cardLastFour }
}

/** Nome legível de quem pagou de facto (prioriza titular do cartão). */
export function formatMercadoPagoEffectivePayerLabel(snapshot: MercadoPagoPayerSnapshot): string {
  const parts: string[] = []
  if (snapshot.cardholderName) {
    parts.push(snapshot.cardholderName)
    if (snapshot.cardLastFour) parts[0] += ` (cartão •••• ${snapshot.cardLastFour})`
  } else if (snapshot.name) {
    parts.push(snapshot.name)
  }
  return parts.join('') || snapshot.email || '—'
}

/** Divide nome completo para first_name / last_name no checkout MP. */
export function splitDisplayNameForMercadoPagoPayer(
  fullName: string | undefined | null
): { firstName?: string; lastName?: string } {
  const n = (fullName ?? '').trim()
  if (!n) return {}
  const parts = n.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return { firstName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}
