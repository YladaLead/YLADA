/**
 * Casos: bypass de draft do dono vs bloqueio por pacote vencido.
 * Rodar: npx tsx src/lib/pro-lideres-subscription-access.casos.ts
 */
import assert from 'node:assert'
import { ownerUnpaidDraftPodePassar } from './pro-lideres-subscription-access'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('dono com draft passa sem assinatura base', () => {
  assert.strictEqual(ownerUnpaidDraftPodePassar(true, true, 'base_subscription'), true)
})

caso('pacote +50 vencido NÃO passa nem pro dono (bloqueio total)', () => {
  assert.strictEqual(ownerUnpaidDraftPodePassar(true, true, 'invite_quota_pack_overdue'), false)
})

caso('membro nunca usa draft do dono', () => {
  assert.strictEqual(ownerUnpaidDraftPodePassar(true, false, 'base_subscription'), false)
})

console.log(`\n${passou} casos verdes.`)
