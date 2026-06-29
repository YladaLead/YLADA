/**
 * Casos (puro, sem I/O) do desafio da porta única.
 * Rodar: npx tsx src/lib/porta-unica/desafio.casos.ts
 */
import assert from 'node:assert'
import {
  DESAFIO_OPCOES,
  DESAFIO_TEXTO_MAX,
  isDesafioKey,
  montarResposta,
  respostaCompleta,
} from './desafio'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('4 opções, na ordem da régua', () => {
  assert.deepStrictEqual(
    DESAFIO_OPCOES.map((o) => o.key),
    ['atrair', 'vender', 'equipe', 'outro']
  )
})

caso('isDesafioKey aceita só as chaves válidas', () => {
  assert.strictEqual(isDesafioKey('atrair'), true)
  assert.strictEqual(isDesafioKey('outro'), true)
  assert.strictEqual(isDesafioKey('x'), false)
  assert.strictEqual(isDesafioKey(undefined), false)
})

caso('texto só conta no outro', () => {
  assert.deepStrictEqual(montarResposta('atrair', 'ignora isso'), { key: 'atrair', texto: null })
  assert.deepStrictEqual(montarResposta('outro', '  vender joias  '), { key: 'outro', texto: 'vender joias' })
})

caso('outro vazio vira texto null', () => {
  assert.deepStrictEqual(montarResposta('outro', '   '), { key: 'outro', texto: null })
})

caso('texto do outro é limitado', () => {
  const longo = 'a'.repeat(DESAFIO_TEXTO_MAX + 50)
  assert.strictEqual(montarResposta('outro', longo).texto?.length, DESAFIO_TEXTO_MAX)
})

caso('respostaCompleta: outro exige texto, demais bastam', () => {
  assert.strictEqual(respostaCompleta(null, ''), false)
  assert.strictEqual(respostaCompleta('vender', ''), true)
  assert.strictEqual(respostaCompleta('outro', ''), false)
  assert.strictEqual(respostaCompleta('outro', 'recrutar melhor'), true)
})

console.log(`\n${passou} casos verdes.`)
