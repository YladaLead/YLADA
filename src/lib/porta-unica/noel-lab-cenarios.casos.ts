/**
 * Casos (puro) dos cenários do laboratório da condução.
 * Rodar: npx tsx src/lib/porta-unica/noel-lab-cenarios.casos.ts
 */
import assert from 'node:assert'
import { isDesafioKey } from './desafio'
import { NOEL_LAB_CENARIOS } from './noel-lab-cenarios'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

function contarDigitos(s: string): number {
  return (s.match(/\d/g) ?? []).length
}

caso('há cenários e os ids são únicos', () => {
  assert.ok(NOEL_LAB_CENARIOS.length >= 4)
  const ids = NOEL_LAB_CENARIOS.map((c) => c.id)
  assert.strictEqual(new Set(ids).size, ids.length, 'ids duplicados')
})

caso('todo cenário tem desafio válido e ao menos 3 falas', () => {
  for (const c of NOEL_LAB_CENARIOS) {
    assert.ok(isDesafioKey(c.desafio.key), `desafio inválido em ${c.id}`)
    if (c.desafio.key === 'outro') assert.ok((c.desafio.texto ?? '').length > 0, `outro sem texto em ${c.id}`)
    assert.ok(c.turns.length >= 3, `poucas falas em ${c.id}`)
  }
})

caso('a última fala de cada cenário traz um WhatsApp (dispara a geração)', () => {
  for (const c of NOEL_LAB_CENARIOS) {
    const ultima = c.turns[c.turns.length - 1]
    assert.ok(contarDigitos(ultima) >= 10, `última fala sem WhatsApp em ${c.id}: "${ultima}"`)
  }
})

caso('nenhuma fala usa travessão de aparte (voz)', () => {
  for (const c of NOEL_LAB_CENARIOS) {
    for (const t of c.turns) {
      assert.ok(!t.includes('—'), `travessão em ${c.id}: "${t}"`)
    }
    assert.ok(!c.label.includes('—'), `travessão no label de ${c.id}`)
  }
})

caso('cobre líder e liberal', () => {
  const papeis = new Set(NOEL_LAB_CENARIOS.map((c) => c.papel))
  assert.ok(papeis.has('lider'), 'falta cenário de líder')
  assert.ok(papeis.has('liberal'), 'falta cenário liberal')
})

console.log(`\n${passou} casos verdes.`)
