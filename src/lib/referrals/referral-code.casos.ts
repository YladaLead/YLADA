/**
 * Casos: geração/validação do código de indicação. Puro, sem I/O.
 * Rodar: npx tsx src/lib/referrals/referral-code.casos.ts
 */
import { generateReferralCode, isValidReferralCode } from './referral-code'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

// RNG determinístico: random()=0 → primeira letra do alfabeto, 7x
assert(generateReferralCode(() => 0) === 'aaaaaaa', 'random 0 gera aaaaaaa')

// Comprimento e alfabeto válidos para qualquer random no [0,1)
{
  let i = 0
  const seq = () => {
    const vals = [0.1, 0.9, 0.5, 0.33, 0.0, 0.99, 0.7]
    return vals[i++ % vals.length]
  }
  const code = generateReferralCode(seq)
  assert(code.length === 7, 'código tem 7 caracteres')
  assert(isValidReferralCode(code), 'código gerado passa na validação')
}

// random próximo de 1 não estoura o índice
assert(isValidReferralCode(generateReferralCode(() => 0.999999)), 'random ~1 não estoura o alfabeto')

// Validação rejeita ambíguos e formatos errados
assert(!isValidReferralCode('a3f9k2'), 'código de 6 chars é inválido (esperado 7)')
assert(!isValidReferralCode('a3f9k20'), 'contém 0 ambíguo → inválido')
assert(!isValidReferralCode('A3F9K2X'), 'maiúsculas → inválido')
assert(!isValidReferralCode(''), 'vazio → inválido')
assert(!isValidReferralCode(null), 'null → inválido')

console.log('\nTodos os casos de referral-code passaram.')
