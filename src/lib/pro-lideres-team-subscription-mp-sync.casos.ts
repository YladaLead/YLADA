/**
 * Casos: sync MP Pro Líderes equipe + banner do líder.
 * Rodar: npx tsx src/lib/pro-lideres-team-subscription-mp-sync.casos.ts
 */
import assert from 'node:assert'
import {
  parseMpPreapprovalIdFromStripeSubscriptionId,
  proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner,
} from './pro-lideres-team-subscription-mp-sync'

let passou = 0
function caso(nome: string, fn: () => void): void {
  fn()
  passou += 1
  console.log(`✓ ${nome}`)
}

caso('parse mp_sub_ prefix', () => {
  assert.strictEqual(
    parseMpPreapprovalIdFromStripeSubscriptionId('mp_sub_59a2cdfb5fe6425cb451e54cd6cbd216'),
    '59a2cdfb5fe6425cb451e54cd6cbd216'
  )
})

caso('parse inválido retorna null', () => {
  assert.strictEqual(parseMpPreapprovalIdFromStripeSubscriptionId('mp_123'), null)
  assert.strictEqual(parseMpPreapprovalIdFromStripeSubscriptionId(null), null)
})

caso('líder vê banner quando equipe bloqueada por base', () => {
  assert.strictEqual(
    proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner({
      isLeaderWorkspace: true,
      accessOk: false,
      blockReason: 'base_subscription',
      hasTeamSubscriptionHistory: true,
    }),
    true
  )
})

caso('draft sem assinatura anterior não mostra banner', () => {
  assert.strictEqual(
    proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner({
      isLeaderWorkspace: true,
      accessOk: false,
      blockReason: 'base_subscription',
      hasTeamSubscriptionHistory: false,
    }),
    false
  )
})

caso('líder não vê banner com acesso ok', () => {
  assert.strictEqual(
    proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner({
      isLeaderWorkspace: true,
      accessOk: true,
      blockReason: null,
      hasTeamSubscriptionHistory: true,
    }),
    false
  )
})

caso('membro não vê banner do líder', () => {
  assert.strictEqual(
    proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner({
      isLeaderWorkspace: false,
      accessOk: false,
      blockReason: 'base_subscription',
      hasTeamSubscriptionHistory: true,
    }),
    false
  )
})

caso('pacote +50 vencido usa outro banner', () => {
  assert.strictEqual(
    proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner({
      isLeaderWorkspace: true,
      accessOk: false,
      blockReason: 'invite_quota_pack_overdue',
      hasTeamSubscriptionHistory: true,
    }),
    false
  )
})

console.log(`\n${passou} casos verdes.`)
