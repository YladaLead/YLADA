/**
 * Casos (puro, sem I/O) da devolutiva reativa pré-cadastro.
 * Rodar: npx tsx src/lib/porta-unica/devolutiva-reativa.casos.ts
 */
import assert from 'node:assert'
import { DESAFIO_OPCOES, type DesafioKey } from './desafio'
import { devolutivaReativaPara } from './devolutiva-reativa'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('toda chave do desafio tem devolutiva não vazia', () => {
  for (const { key } of DESAFIO_OPCOES) {
    const texto = devolutivaReativaPara(key)
    assert.strictEqual(typeof texto, 'string')
    assert.ok(texto.trim().length > 0, `vazia para ${key}`)
  }
})

caso('copy travada r91 — enxuta (atrair/vender/equipe/outro)', () => {
  assert.match(devolutivaReativaPara('atrair'), /Atrair mais gente quase nunca é aparecer mais\./)
  assert.match(devolutivaReativaPara('vender'), /Vender mais não é empurrar mais\./)
  assert.match(devolutivaReativaPara('equipe'), /Equipe que ouve muito e age pouco/)
  assert.match(devolutivaReativaPara('outro'), /Você já deu o primeiro passo/)
})

caso('fecha sempre no convite colaborativo "Vamos começar?" (r90)', () => {
  for (const { key } of DESAFIO_OPCOES) {
    assert.match(devolutivaReativaPara(key as DesafioKey), /Vamos começar\?$/)
  }
})

caso('r90 não usa "cadastra que eu te mostro" (sem cara de gate)', () => {
  for (const { key } of DESAFIO_OPCOES) {
    const texto = devolutivaReativaPara(key)
    assert.ok(!/cria sua conta/i.test(texto), `gate-phrase em ${key}`)
    assert.ok(!/te mostro/i.test(texto), `"te mostro" (promessa unilateral) em ${key}`)
  }
})

caso('zero travessão de aparte (regra de voz, AGENTS/GUIA_DE_VOZ)', () => {
  for (const { key } of DESAFIO_OPCOES) {
    assert.ok(!devolutivaReativaPara(key).includes('—'), `travessão em ${key}`)
  }
})

console.log(`\n${passou} casos verdes.`)
