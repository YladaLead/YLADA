/**
 * Rodar: npx tsx src/lib/pro-lideres-invite-quota-packs.casos.ts
 */
import assert from 'node:assert/strict'
import {
  billingDayFromIsoDate,
  buildProLideresInviteQuotaPackMpExternalReference,
  buildProLideresInviteQuotaPixMpExternalReference,
  computeInviteQuotaPackPeriodEnd,
  extendInviteQuotaPackPeriodEnd,
  parsePackIdFromInviteQuotaPackMpRef,
} from '@/lib/pro-lideres-invite-quota-packs'

const PACK_ID = 'b21e037a-24db-4f8f-b3eb-2d542a239265'

function testRefs() {
  const monthly = buildProLideresInviteQuotaPackMpExternalReference(PACK_ID)
  assert.equal(monthly, `plinv50_monthly_${PACK_ID}`)
  assert.equal(parsePackIdFromInviteQuotaPackMpRef(monthly), PACK_ID)

  const pix = buildProLideresInviteQuotaPixMpExternalReference(PACK_ID)
  assert.equal(parsePackIdFromInviteQuotaPackMpRef(pix), PACK_ID)
}

function testBillingDay() {
  assert.equal(billingDayFromIsoDate('2026-05-26T21:18:40.059Z'), 26)
}

function testPeriodEnd() {
  const from = new Date('2026-05-26T12:00:00.000Z')
  const end = computeInviteQuotaPackPeriodEnd(from, 26)
  assert.equal(end.getUTCDate(), 26)
  const extended = extendInviteQuotaPackPeriodEnd(end.toISOString(), 26)
  assert.ok(new Date(extended).getTime() > end.getTime())
}

function main() {
  testRefs()
  testBillingDay()
  testPeriodEnd()
  console.log('pro-lideres-invite-quota-packs.casos.ts — OK')
}

main()
