/**
 * Casos (puro, sem I/O) da decisão de destino pós-cadastro (costura Fase 2).
 * Rodar: npx tsx src/lib/porta-unica/destino-pos-cadastro.casos.ts
 */
import assert from 'node:assert'
import {
  DESTINO_LEGADO_ONBOARDING,
  NOEL_DIRETO_DESTINO,
  noelDiretoAtivo,
  redirectPathPosCadastro,
} from './destino-pos-cadastro'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('Noel direto exige flag ON E desafio', () => {
  assert.strictEqual(noelDiretoAtivo(true, true), true)
  assert.strictEqual(noelDiretoAtivo(true, false), false)
  assert.strictEqual(noelDiretoAtivo(false, true), false)
  assert.strictEqual(noelDiretoAtivo(false, false), false)
})

caso('flag OFF = byte-idêntico (sempre o onboarding legado)', () => {
  assert.strictEqual(redirectPathPosCadastro(false, true), DESTINO_LEGADO_ONBOARDING)
  assert.strictEqual(redirectPathPosCadastro(false, false), DESTINO_LEGADO_ONBOARDING)
})

caso('flag ON + desafio → cai no Noel direto', () => {
  assert.strictEqual(redirectPathPosCadastro(true, true), NOEL_DIRETO_DESTINO)
})

caso('flag ON sem desafio → segue o legado', () => {
  assert.strictEqual(redirectPathPosCadastro(true, false), DESTINO_LEGADO_ONBOARDING)
})

console.log(`\n${passou} casos verdes.`)
