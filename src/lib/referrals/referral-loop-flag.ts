/**
 * Flag do loop viral / k-factor (Fase A). Adição pura: com a flag OFF o selo
 * mantém o destino antigo, a página /criar existe mas não recebe tráfego do selo,
 * e as rotas de captura viram no-op. Liga/desliga sem deploy de código.
 *
 * NEXT_PUBLIC_ para ser legível no cliente (selo) E no servidor (rotas) com o
 * mesmo valor. Não é segredo — é só um interruptor de feature.
 *
 * @example isReferralLoopEnabled() // false enquanto NEXT_PUBLIC_LOOP_REFERRAL_ENABLED !== 'true'
 */
export function isReferralLoopEnabled(): boolean {
  return process.env.NEXT_PUBLIC_LOOP_REFERRAL_ENABLED === 'true'
}
