/**
 * Casos (puro, sem I/O) do reconhecimento pós-cadastro do desafio.
 * Rodar: npx tsx src/lib/porta-unica/reconhecimento-desafio.casos.ts
 */
import assert from 'node:assert'
import {
  RECONHECIMENTO_SEM_DESAFIO,
  reconhecimentoDoDesafio,
} from './reconhecimento-desafio'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('sem desafio → acolhe e segue', () => {
  assert.strictEqual(reconhecimentoDoDesafio(null), RECONHECIMENTO_SEM_DESAFIO)
})

caso('chaves fechadas reconhecem em 2ª pessoa', () => {
  assert.match(reconhecimentoDoDesafio({ key: 'atrair', texto: null }), /atrair mais gente/)
  assert.match(reconhecimentoDoDesafio({ key: 'vender', texto: null }), /vender mais/)
  assert.match(reconhecimentoDoDesafio({ key: 'equipe', texto: null }), /equipe mais produtiva/)
})

caso('outro com texto devolve as palavras da pessoa', () => {
  assert.strictEqual(
    reconhecimentoDoDesafio({ key: 'outro', texto: 'recrutar melhor' }),
    'Você me disse: “recrutar melhor”.'
  )
})

caso('outro sem texto cai na base', () => {
  assert.match(reconhecimentoDoDesafio({ key: 'outro', texto: null }), /quer melhorar/)
})

console.log(`\n${passou} casos verdes.`)
