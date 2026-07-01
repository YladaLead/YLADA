/**
 * Casos (puro, sem I/O) do BUG 5 — rótulo de exibição do arquétipo de perfil.
 * Rodar: npx tsx src/lib/ylada/profile-type-label.casos.ts
 */
import assert from 'node:assert'
import { displayProfileType } from './profile-type-label'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('acentua e capitaliza os arquétipos conhecidos', () => {
  assert.strictEqual(displayProfileType('analitico'), 'Analítico')
  assert.strictEqual(displayProfileType('consistente'), 'Consistente')
  assert.strictEqual(displayProfileType('ansioso'), 'Ansioso')
  assert.strictEqual(displayProfileType('8ou80'), '8 ou 80')
  assert.strictEqual(displayProfileType('improvisador'), 'Improvisador')
})

caso('código desconhecido cai num capitalize seguro (não quebra)', () => {
  assert.strictEqual(displayProfileType('exploratorio'), 'Exploratorio')
})

caso('vazio/nulo devolve string vazia', () => {
  assert.strictEqual(displayProfileType(''), '')
  assert.strictEqual(displayProfileType(undefined), '')
  assert.strictEqual(displayProfileType(null), '')
})

console.log(`\n${passou} casos verdes.`)
