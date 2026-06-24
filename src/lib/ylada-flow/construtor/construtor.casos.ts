/**
 * Casos: Construtor permissionado (três portões).
 * Rodar: npx tsx src/lib/ylada-flow/construtor/construtor.casos.ts
 */
import type { YladaFlow } from '@/types/ylada-flow'
import { podeCriarFluxo, validarConstrucao, formulaIdsDisponiveis } from './'
import { FLUXOS_VENDAS } from '@/lib/ylada-flow/bibliotecas/vendas'
import { FLUXOS_CALCULADORAS } from '@/lib/ylada-flow/bibliotecas/calculadoras'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

const quizValido = FLUXOS_VENDAS[0] // passa a régua
const imc = FLUXOS_CALCULADORAS.find((f) => f.id === 'calc-imc')!

// --- Portão 1: permissão (matriz §6) ---
assert(podeCriarFluxo({ papel: 'liberal' }).pode, 'liberal pode criar')
assert(podeCriarFluxo({ papel: 'ylada' }).pode, 'Ylada pode criar')
assert(!podeCriarFluxo({ papel: 'distribuidor' }).pode, 'distribuidor NÃO pode criar')
assert(!podeCriarFluxo({ papel: 'empresa' }).pode, 'empresa cria via Ylada (não direto)')
assert(!podeCriarFluxo({ papel: 'lider' }).pode, 'líder sem liberação NÃO pode')
assert(podeCriarFluxo({ papel: 'lider', empresaLiberouLider: true }).pode, 'líder liberado pode')

// --- Construção válida (liberal + quiz que passa) ---
{
  const r = validarConstrucao(quizValido, { papel: 'liberal' })
  assert(r.ok === true, 'liberal + quiz que passa → ok')
  assert(r.precisaAfiar === false, 'quiz que passa não precisa afiar')
  assert(r.bloqueios.length === 0, 'sem bloqueios')
}

// --- Bloqueio por permissão ---
{
  const r = validarConstrucao(quizValido, { papel: 'distribuidor' })
  assert(r.ok === false, 'distribuidor → bloqueado')
  assert(r.bloqueios.some((b) => b.startsWith('permissão')), 'bloqueio é de permissão')
}

// --- Calculadora: fórmula válida da base passa; fórmula inventada bloqueia (§12.2) ---
{
  const ok = validarConstrucao(imc, { papel: 'liberal' })
  assert(ok.ok === true, 'IMC (formulaId da base) → ok')

  const f = JSON.parse(JSON.stringify(imc)) as YladaFlow
  f.calculadora!.formulaId = 'formula-que-nao-existe'
  const r = validarConstrucao(f, { papel: 'liberal' })
  assert(r.ok === false, 'calculadora com fórmula inventada → bloqueada')
  assert(r.bloqueios.some((b) => b.startsWith('fórmula')), 'bloqueio é de fórmula (§12.2)')
}

// --- Qualidade: rascunho que a régua reprova não entra ---
{
  const f = JSON.parse(JSON.stringify(quizValido)) as YladaFlow
  f.perguntas[0].papel = {} // tira o papel → régua reprova
  const r = validarConstrucao(f, { papel: 'liberal' })
  assert(r.ok === false, 'rascunho que reprova → bloqueado')
  assert(r.bloqueios.some((b) => b.startsWith('qualidade')), 'bloqueio é de qualidade (régua)')
}

// --- A base de fórmulas é a fonte (nunca inventar) ---
assert(formulaIdsDisponiveis().includes('imc-oms-v1'), 'base de fórmulas exposta (imc-oms-v1)')

console.log('\n✅ Construtor permissionado — casos verdes.')
