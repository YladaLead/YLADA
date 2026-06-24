/**
 * Código de indicação curto e estável (Spec_Loop_KFactor §5.1). Substitui o UUID
 * interno na URL. Alfabeto sem caracteres ambíguos (0/O/1/l/I) — fácil de ler/ditar.
 */

/** Crockford-ish minúsculo, sem 0/o/1/l/i — evita confusão visual ao compartilhar. */
const CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789'
const CODE_LENGTH = 7
const CODE_PATTERN = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`)

/**
 * Gera um código novo. Aceita um RNG injetável (default Math.random) para teste
 * determinístico. Colisão é tratada por unicidade no banco + retry no chamador.
 * @example generateReferralCode(() => 0) // 'aaaaaaa'
 */
export function generateReferralCode(random: () => number = Math.random): string {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    const idx = Math.floor(random() * CODE_ALPHABET.length)
    code += CODE_ALPHABET[Math.min(idx, CODE_ALPHABET.length - 1)]
  }
  return code
}

/** Valida o formato (não a existência). Usar antes de consultar o banco. */
export function isValidReferralCode(value: string | null | undefined): boolean {
  return typeof value === 'string' && CODE_PATTERN.test(value)
}
