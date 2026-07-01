/**
 * Casos (puro, sem I/O) da copy do hero da Porta 1.
 * Rodar: npx tsx src/lib/porta-unica/porta1-home-copy.casos.ts
 */
import assert from 'node:assert'
import { PORTA1_HERO } from './porta1-home-copy'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('todos os campos preenchidos', () => {
  for (const [campo, valor] of Object.entries(PORTA1_HERO)) {
    assert.ok(valor.trim().length > 0, `campo vazio: ${campo}`)
  }
})

caso('planta a categoria (o moat)', () => {
  assert.match(PORTA1_HERO.categoria, /Inteligência de Convicção/)
})

caso('mantém o gancho travado da porta', () => {
  assert.strictEqual(PORTA1_HERO.headline, 'Explique menos. Venda mais.')
})

caso('zero travessão de aparte (regra de voz)', () => {
  for (const valor of Object.values(PORTA1_HERO)) {
    assert.ok(!valor.includes('—'), `travessão em: ${valor}`)
  }
})

console.log(`\n${passou} casos verdes.`)
