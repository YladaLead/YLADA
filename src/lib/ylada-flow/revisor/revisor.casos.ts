/**
 * Casos + RELATÓRIO do revisor em escala.
 * Rodar: npx tsx src/lib/ylada-flow/revisor/revisor.casos.ts
 *
 * Imprime o "por quê" de cada morno (a foto pra calibrar a régua viva) e prova a forma.
 */
import { revisarFluxos, partesQueFalharam, montarPromptAfiar } from './revisor'
import { BIBLIOTECA_YLADA } from '@/lib/ylada-flow/recomendador'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

const rel = revisarFluxos(BIBLIOTECA_YLADA)

// --- RELATÓRIO (o porquê de cada morno/reprova) ---
console.log('\n=== REVISÃO DA BIBLIOTECA ===')
console.log(`total: ${rel.total} | passa: ${rel.contagem.passa} | morno: ${rel.contagem.morno} | reprova: ${rel.contagem.reprova}`)
console.log('\n--- motivos por fluxo problemático ---')
for (const l of [...rel.reprovados, ...rel.mornos]) {
  console.log(`\n• ${l.fluxoId} [${l.veredito}]`)
  for (const p of partesQueFalharam(l)) {
    if (p.motivos.length) console.log(`   ${p.parte}: ${p.motivos.join(' ')}`)
  }
}

// --- exemplo do prompt de afiar (NÃO chama LLM) ---
if (rel.mornos.length > 0) {
  const exemplo = rel.mornos[0]
  const fluxo = BIBLIOTECA_YLADA.find((f) => f.id === exemplo.fluxoId)!
  console.log('\n--- exemplo: prompt pra afiar (', exemplo.fluxoId, ') ---')
  console.log(montarPromptAfiar(fluxo, exemplo).slice(0, 600) + '…')
}

// --- asserts de forma ---
console.log('\n=== ASSERTS ===')
assert(rel.total === BIBLIOTECA_YLADA.length, 'revisou todos os fluxos da biblioteca')
assert(
  rel.contagem.passa + rel.contagem.morno + rel.contagem.reprova === rel.total,
  'contagem fecha com o total'
)
assert(rel.migraveis.every((l) => l.veredito === 'passa'), 'migráveis = só os que passam')
assert(
  rel.mornos.every((l) => partesQueFalharam(l).length > 0),
  'todo morno tem ao menos uma parte com motivo'
)
// o prompt de afiar é vazio quando não há nada a afiar, e não-vazio quando há.
{
  const passou = rel.laudos.find((l) => l.veredito === 'passa')
  if (passou) {
    const f = BIBLIOTECA_YLADA.find((x) => x.id === passou.fluxoId)!
    assert(montarPromptAfiar(f, passou) === '', 'fluxo que passa → prompt de afiar vazio')
  }
}

console.log('\n✅ Revisor em escala — casos verdes.')
