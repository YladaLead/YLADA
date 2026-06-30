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

const entrada = NOEL_LAB_CENARIOS.filter((c) => c.fase === 'entrada')
const diaADia = NOEL_LAB_CENARIOS.filter((c) => c.fase === 'dia-a-dia')

caso('há cenários nas duas fases e os ids são únicos', () => {
  assert.ok(entrada.length >= 4, 'poucos cenários de entrada')
  assert.ok(diaADia.length >= 3, 'poucos cenários de dia a dia')
  const ids = NOEL_LAB_CENARIOS.map((c) => c.id)
  assert.strictEqual(new Set(ids).size, ids.length, 'ids duplicados')
})

caso('entrada: desafio válido, ao menos 3 falas, e WhatsApp na última fala', () => {
  for (const c of entrada) {
    assert.ok(c.desafio && isDesafioKey(c.desafio.key), `desafio inválido em ${c.id}`)
    if (c.desafio!.key === 'outro') assert.ok((c.desafio!.texto ?? '').length > 0, `outro sem texto em ${c.id}`)
    assert.ok(c.turns.length >= 3, `poucas falas em ${c.id}`)
    assert.strictEqual(c.esperaLink, true, `entrada deveria esperar link em ${c.id}`)
    const ultima = c.turns[c.turns.length - 1]
    assert.ok(contarDigitos(ultima) >= 10, `última fala sem WhatsApp em ${c.id}: "${ultima}"`)
  }
})

caso('dia a dia: sem desafio (não conduz pra link) e não espera link', () => {
  for (const c of diaADia) {
    assert.strictEqual(c.desafio, null, `dia a dia não deve mandar desafio em ${c.id}`)
    assert.strictEqual(c.esperaLink, false, `dia a dia não espera link em ${c.id}`)
    assert.ok(c.turns.length >= 1, `sem fala em ${c.id}`)
  }
})

caso('nenhuma fala/label usa travessão de aparte (voz)', () => {
  for (const c of NOEL_LAB_CENARIOS) {
    for (const t of c.turns) assert.ok(!t.includes('—'), `travessão em ${c.id}: "${t}"`)
    assert.ok(!c.label.includes('—'), `travessão no label de ${c.id}`)
  }
})

caso('entrada cobre todas as personas do ICP', () => {
  const papeis = new Set(entrada.map((c) => c.papel))
  for (const p of [
    'lider-corporacao',
    'lider-rede',
    'liberal',
    'vendedor-produto',
    'vendedor-servico',
  ] as const) {
    assert.ok(papeis.has(p), `falta cenário da persona ${p}`)
  }
})

console.log(`\n${passou} casos verdes.`)
