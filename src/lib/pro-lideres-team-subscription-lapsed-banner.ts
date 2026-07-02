/** Líder vê aviso só quando já houve assinatura equipe e ela venceu (não no draft inicial). */
export function proLideresLeaderShouldSeeTeamSubscriptionLapsedBanner(input: {
  isLeaderWorkspace: boolean
  accessOk: boolean
  blockReason: string | null | undefined
  /** true quando existe linha em `subscriptions` (área equipe) — renovação ou vencida. */
  hasTeamSubscriptionHistory: boolean
}): boolean {
  if (!input.isLeaderWorkspace || input.accessOk) return false
  if (!input.hasTeamSubscriptionHistory) return false
  return (input.blockReason ?? 'base_subscription') === 'base_subscription'
}
