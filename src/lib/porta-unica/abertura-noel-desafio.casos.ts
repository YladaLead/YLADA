/**
 * Casos (puro, sem I/O) do toque "b": abertura do Noel + bloco do prompt.
 * Rodar: npx tsx src/lib/porta-unica/abertura-noel-desafio.casos.ts
 */
import assert from 'node:assert'
import { DESAFIO_OPCOES, type DesafioResposta } from './desafio'
import {
  aberturaNoelDoDesafio,
  construirBlocoDesafioParaPrompt,
  normalizarDesafioRecebido,
} from './abertura-noel-desafio'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('toda chave tem abertura não vazia', () => {
  for (const { key } of DESAFIO_OPCOES) {
    const texto = aberturaNoelDoDesafio({ key, texto: null })
    assert.ok(texto.trim().length > 0, `vazia para ${key}`)
  }
})

caso('abertura reconhece sem re-perguntar o desafio (atrair/vender/equipe)', () => {
  assert.match(aberturaNoelDoDesafio({ key: 'atrair', texto: null }), /quer atrair mais gente/i)
  assert.match(aberturaNoelDoDesafio({ key: 'vender', texto: null }), /quer vender mais/i)
  assert.match(aberturaNoelDoDesafio({ key: 'equipe', texto: null }), /equipe mais produtiva/i)
})

caso('outro costura o texto da pessoa', () => {
  const r: DesafioResposta = { key: 'outro', texto: 'minha agenda vive vazia' }
  assert.match(aberturaNoelDoDesafio(r), /minha agenda vive vazia/)
})

caso('outro sem texto cai no acolhimento genérico', () => {
  assert.match(aberturaNoelDoDesafio({ key: 'outro', texto: null }), /algo pra melhorar/i)
})

caso('resposta nula/ inválida devolve vazio (chamador não injeta nada)', () => {
  assert.strictEqual(aberturaNoelDoDesafio(null), '')
  assert.strictEqual(construirBlocoDesafioParaPrompt(null), '')
  // chave inválida vinda do body do request
  assert.strictEqual(aberturaNoelDoDesafio({ key: 'xpto' as never, texto: null }), '')
})

caso('bloco do prompt manda conduzir e proíbe re-perguntar', () => {
  for (const { key } of DESAFIO_OPCOES) {
    const bloco = construirBlocoDesafioParaPrompt({ key, texto: key === 'outro' ? 'x' : null })
    assert.match(bloco, /DESAFIO DECLARADO/)
    assert.match(bloco, /NÃO re-pergunte/)
    assert.match(bloco, /diagnóstico do dono/i)
  }
})

caso('normalizarDesafioRecebido limpa o body cru', () => {
  assert.deepStrictEqual(normalizarDesafioRecebido({ key: 'atrair', texto: null }), { key: 'atrair', texto: null })
  assert.deepStrictEqual(normalizarDesafioRecebido({ key: 'outro', texto: 'x' }), { key: 'outro', texto: 'x' })
  assert.strictEqual(normalizarDesafioRecebido({ key: 'invalida', texto: 'x' }), null)
  assert.strictEqual(normalizarDesafioRecebido(null), null)
  assert.strictEqual(normalizarDesafioRecebido('atrair'), null)
  assert.strictEqual(normalizarDesafioRecebido({ texto: 'sem key' }), null)
})

caso('zero travessão de aparte na abertura (voz; o bloco do prompt é scaffolding interno)', () => {
  for (const { key } of DESAFIO_OPCOES) {
    assert.ok(!aberturaNoelDoDesafio({ key, texto: 'x' }).includes('—'), `travessão em ${key}`)
  }
})

console.log(`\n${passou} casos verdes.`)
