/**
 * Casos: fórmulas IMC, proteína, calorias.
 * Rodar: npx tsx src/lib/ylada-flow/bibliotecas/formulas/calculadoras.casos.ts
 */
import { caloriasMifflinV1, imcOmsV1, proteinaGkgV1 } from './calculadoras'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

// Proteína: 90 kg · perder (idx 1) → 162 g (1,8 g/kg)
{
  const r = proteinaGkgV1({ peso_kg: 90, objetivo_idx: 1 })
  assert(r.valor === 162, '90 kg perder → 162 g')
  assert(r.meta?.objetivo === 'perder', 'objetivo perder')
}

// Proteína: ganhar 100 kg → 200 g (2,0 g/kg)
{
  const r = proteinaGkgV1({ peso_kg: 100, objetivo_idx: 2 })
  assert(r.valor === 200, '100 kg ganhar → 200 g')
}

// IMC: 70 kg · 170 cm → ~24,2 normal
{
  const r = imcOmsV1({ peso_kg: 70, altura_cm: 170, sexo_idx: 0 })
  assert(r.valor === 24.2, '70 kg 170 cm → IMC 24,2')
  assert(r.meta?.classificacao_key === 'normal', 'faixa normal')
}

// Calorias: mulher 30a 65kg 165cm sedentário manter
{
  const r = caloriasMifflinV1({
    idade: 30,
    sexo_idx: 0,
    peso_kg: 65,
    altura_cm: 165,
    atividade_idx: 0,
    objetivo_idx: 1,
  })
  assert(r.valor >= 1200 && r.valor <= 5000, 'calorias manter em faixa plausível')
  assert(r.meta?.objetivo === 'manter', 'objetivo manter')
}

console.log('\nTodos os casos de calculadoras passaram.')
