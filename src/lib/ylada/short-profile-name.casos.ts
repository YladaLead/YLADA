/**
 * Casos (puro, sem I/O) do BUG 2 — nome de perfil frase-longa × rótulo curto.
 * Rodar: npx tsx src/lib/ylada/short-profile-name.casos.ts
 */
import assert from 'node:assert'
import { isSentenceLikeProfileName, isUsableShortContext } from './short-profile-name'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('rótulos curtos de saúde/liberais NÃO são frase', () => {
  for (const r of ['Perda de peso', 'Direito de família', 'Saúde bucal', 'Cosméticos e beleza']) {
    assert.strictEqual(isSentenceLikeProfileName(r), false, `não devia ser frase: ${r}`)
  }
})

caso('frase longa de negócio (cortada) É frase', () => {
  assert.strictEqual(
    isSentenceLikeProfileName('A falta de treinamentos e de técnicas de venda eficazes está dificultando a sua'),
    true
  )
  assert.strictEqual(
    isSentenceLikeProfileName('A dificuldade em gerenciar o tempo e a falta de um processo estruturado podem'),
    true
  )
})

caso('vazio não é frase (deixa outros gates decidirem)', () => {
  assert.strictEqual(isSentenceLikeProfileName(''), false)
  assert.strictEqual(isSentenceLikeProfileName('   '), false)
})

caso('contexto curto serve de fallback; frase/vazio não servem', () => {
  assert.strictEqual(isUsableShortContext('Produtividade em vendas'), true)
  assert.strictEqual(isUsableShortContext('Perda de peso e emagrecimento'), true)
  assert.strictEqual(isUsableShortContext(''), false)
  assert.strictEqual(isUsableShortContext('abc'), false) // curto demais
  assert.strictEqual(
    isUsableShortContext('Perfil comportamental, atração de clientes e redes sociais'),
    false // é frase longa: não troca uma frase por outra
  )
})

console.log(`\n${passou} casos verdes.`)
