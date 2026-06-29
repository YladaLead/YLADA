/**
 * Casos (puro, sem DB) da curadoria da página `/[perfil]`.
 * Rodar: npx tsx src/lib/ylada-flow/perfil-curadoria.casos.ts
 */
import assert from 'node:assert'
import {
  curarFluxos,
  extrairMetaCuradoria,
  LIMITE_FALLBACK_FLUXOS,
  type FluxoCandidato,
} from './perfil-curadoria'

function candidato(over: Partial<FluxoCandidato>): FluxoCandidato {
  return {
    slug: 'x',
    titulo: 'X',
    subtitulo: null,
    destaque: false,
    ordem: null,
    criadoEm: '2026-01-01T00:00:00.000Z',
    ...over,
  }
}

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

// extrairMetaCuradoria — tolerante a forma
caso('meta ausente → destaque false, ordem null', () => {
  assert.deepStrictEqual(extrairMetaCuradoria(undefined), { destaque: false, ordem: null })
  assert.deepStrictEqual(extrairMetaCuradoria({}), { destaque: false, ordem: null })
  assert.deepStrictEqual(extrairMetaCuradoria({ meta: 'nope' }), { destaque: false, ordem: null })
})

caso('meta lê destaque + ordem', () => {
  const r = extrairMetaCuradoria({ meta: { perfil_destaque: true, perfil_ordem: 2 } })
  assert.deepStrictEqual(r, { destaque: true, ordem: 2 })
})

caso('ordem não-numérica vira null', () => {
  const r = extrairMetaCuradoria({ meta: { perfil_destaque: true, perfil_ordem: 'a' } })
  assert.deepStrictEqual(r, { destaque: true, ordem: null })
})

// curarFluxos — marcados ganham e respeitam a ordem
caso('marcados ordenam por perfil_ordem', () => {
  const out = curarFluxos([
    candidato({ slug: 'b', destaque: true, ordem: 2 }),
    candidato({ slug: 'a', destaque: true, ordem: 1 }),
    candidato({ slug: 'z', destaque: false, ordem: null }),
  ])
  assert.deepStrictEqual(out.map((f) => f.slug), ['a', 'b'])
})

caso('marcado sem ordem vai pro fim', () => {
  const out = curarFluxos([
    candidato({ slug: 'semordem', destaque: true, ordem: null, criadoEm: '2026-01-01T00:00:00Z' }),
    candidato({ slug: 'primeiro', destaque: true, ordem: 1 }),
  ])
  assert.deepStrictEqual(out.map((f) => f.slug), ['primeiro', 'semordem'])
})

// curarFluxos — fallback quando ninguém marcado
caso('sem marcados → fallback recentes, limitado', () => {
  const muitos = Array.from({ length: 10 }, (_, i) =>
    candidato({ slug: `f${i}`, criadoEm: `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00Z` })
  )
  const out = curarFluxos(muitos)
  assert.strictEqual(out.length, LIMITE_FALLBACK_FLUXOS)
  assert.strictEqual(out[0].slug, 'f9', 'o mais recente vem primeiro')
})

caso('lista vazia → vazio', () => {
  assert.deepStrictEqual(curarFluxos([]), [])
})

console.log(`\n${passou} casos verdes.`)
