/**
 * Rodar: npx tsx src/lib/mercado-pago-subscriptions.casos.ts
 */
import assert from 'node:assert/strict'
import {
  MERCADO_PAGO_PREAPPROVAL_REASON_MAX,
  truncateMercadoPagoPreapprovalReason,
} from '@/lib/mercado-pago-subscriptions'

function testKeepsShortReason() {
  const reason = 'YLADA Noel membro Pro Líderes (mensal)'
  assert.equal(truncateMercadoPagoPreapprovalReason(reason), reason)
}

function testTruncatesLongReason() {
  const long =
    'YLADA — Noel membro Pro Líderes (mensal, R$ 40.00) — Equipe Alexandre'
  const truncated = truncateMercadoPagoPreapprovalReason(long)
  assert.equal(truncated.length, MERCADO_PAGO_PREAPPROVAL_REASON_MAX)
  assert.equal(truncated, long.trim().slice(0, MERCADO_PAGO_PREAPPROVAL_REASON_MAX))
}

function testTrimsWhitespace() {
  assert.equal(truncateMercadoPagoPreapprovalReason('  curto  '), 'curto')
}

function main() {
  testKeepsShortReason()
  testTruncatesLongReason()
  testTrimsWhitespace()
  console.log('mercado-pago-subscriptions.casos: ok')
}

main()
