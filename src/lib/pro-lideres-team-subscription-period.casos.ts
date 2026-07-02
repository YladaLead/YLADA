/**
 * Casos: período e margem da assinatura Pro Líderes equipe (MP recorrente).
 * Rodar: npx tsx src/lib/pro-lideres-team-subscription-period.casos.ts
 */
import assert from 'node:assert'
import {
  computeProLideresTeamPeriodEnd,
  extendProLideresTeamMonthlyPeriodEnd,
  isProLideresTeamSubscriptionEffectivelyActive,
  PRO_LIDERES_TEAM_MP_RENEWAL_GRACE_MS,
} from './pro-lideres-team-subscription-period'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

const mpSub = 'mp_sub_abc123'

caso('vigente quando period_end no futuro', () => {
  const future = new Date(Date.now() + 86400000).toISOString()
  assert.strictEqual(
    isProLideresTeamSubscriptionEffectivelyActive({
      status: 'active',
      current_period_end: future,
      stripe_subscription_id: mpSub,
    }),
    true
  )
})

caso('margem 48h após vencimento MP recorrente', () => {
  const expired = new Date(Date.now() - PRO_LIDERES_TEAM_MP_RENEWAL_GRACE_MS + 3600000).toISOString()
  assert.strictEqual(
    isProLideresTeamSubscriptionEffectivelyActive({
      status: 'active',
      current_period_end: expired,
      stripe_subscription_id: mpSub,
    }),
    true
  )
})

caso('fora da margem bloqueia', () => {
  const expired = new Date(Date.now() - PRO_LIDERES_TEAM_MP_RENEWAL_GRACE_MS - 3600000).toISOString()
  assert.strictEqual(
    isProLideresTeamSubscriptionEffectivelyActive({
      status: 'active',
      current_period_end: expired,
      stripe_subscription_id: mpSub,
    }),
    false
  )
})

caso('sem mp_sub_ não usa margem', () => {
  const expired = new Date(Date.now() - 3600000).toISOString()
  assert.strictEqual(
    isProLideresTeamSubscriptionEffectivelyActive({
      status: 'active',
      current_period_end: expired,
      stripe_subscription_id: 'manual_x',
    }),
    false
  )
})

caso('period_end mensal inclui buffer de 36h', () => {
  const now = new Date('2026-06-02T14:00:00.000Z')
  const end = computeProLideresTeamPeriodEnd({ planType: 'monthly', now })
  const expectedMin = new Date('2026-07-02T14:00:00.000Z')
  expectedMin.setHours(expectedMin.getHours() + 36)
  assert.ok(end.getTime() >= expectedMin.getTime())
})

caso('usa next_payment_date do MP quando informado', () => {
  const end = computeProLideresTeamPeriodEnd({
    planType: 'monthly',
    now: new Date('2026-07-02T10:00:00.000Z'),
    nextPaymentDateIso: '2026-08-02T09:04:35.000-04:00',
  })
  assert.ok(end > new Date('2026-08-02T12:00:00.000Z'))
})

caso('renovação mensal estende a partir do vencimento atual', () => {
  const end = extendProLideresTeamMonthlyPeriodEnd('2026-07-02T13:13:26.147Z', new Date('2026-07-02T14:00:00.000Z'))
  assert.ok(end > new Date('2026-08-02T13:13:26.147Z'))
})

console.log(`\n${passou} casos verdes.`)
