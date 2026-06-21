/**
 * Flag do checkout web no app Android (TWA).
 *
 * Modelo B2B só-login: por padrão o app Android NÃO vende nada dentro (false →
 * comportamento "A": tela neutra). Quando ligado (true → comportamento "B"), a
 * tela de compra mostra um botão "Assinar no site" que abre o checkout web em
 * um navegador EXTERNO (fora do app), sem passar pelo Google Play Billing.
 *
 * Como o app carrega o site ao vivo, virar este flag é só um deploy — sem build
 * novo nem nova revisão da Play Store do comportamento web.
 *
 * ⚠️ NÃO ligar (true) antes de confirmar os requisitos do programa de billing
 * externo do Google (inscrição + regras por região, BR). Lançar em produção
 * com FALSE; ligar só depois de aprovado + política conferida.
 */
export const ANDROID_WEB_CHECKOUT_ENABLED = false

/** Página de planos/checkout no site (aberta em navegador externo no Android). */
export function getAndroidWebCheckoutUrl(): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.ylada.com').replace(/\/$/, '')
  return `${base}/pt/precos`
}
