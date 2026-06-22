/**
 * Casos: fórmula hidratacao-35ml-kg-v1.
 * Rodar: npx tsx src/lib/ylada-flow/bibliotecas/formulas/hidratacao.casos.ts
 */
import { hidratacao35mlKgV1 } from './index'

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error('FAIL:', msg)
    process.exit(1)
  }
  console.log('OK:', msg)
}

// 70 kg · atividade idx 2 (+500) · clima idx 1 (+300) → 3250 ml = 13 copos
{
  const r = hidratacao35mlKgV1({ peso_kg: 70, atividade_idx: 2, clima_idx: 1 })
  assert(r.valor === 3250, '70 kg / atividade 2 / clima 1 → 3250 ml')
  assert(r.copos === 13, '70 kg / atividade 2 / clima 1 → 13 copos')
}

// 20 kg · sedentário · ameno → clamp no mínimo 1500 ml
{
  const r = hidratacao35mlKgV1({ peso_kg: 20, atividade_idx: 0, clima_idx: 0 })
  assert(r.valor === 1500, '20 kg sedentário ameno → clamp 1500 ml')
  assert(r.copos === 6, '1500 ml → 6 copos')
}

console.log('\nTodos os casos de hidratação passaram.')
