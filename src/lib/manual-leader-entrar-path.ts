/**
 * Path do ecrã de login após cadastro manual (admin) — conforme `leader_tenants.vertical_code`.
 */
export function manualLeaderEntrarPathForVerticalCode(segmentCode: string): string {
  const s = segmentCode.trim().toLowerCase()
  if (s === 'estetica-corporal') return '/pro-estetica-corporal/entrar'
  if (s === 'estetica-capilar') return '/pro-estetica-capilar/entrar'
  return '/pro-lideres/entrar'
}

export function manualLeaderHandoutTitleForVerticalCode(segmentCode: string): string {
  const s = segmentCode.trim().toLowerCase()
  if (s === 'estetica-corporal') return 'Pro Estética corporal'
  if (s === 'estetica-capilar') return 'Pro Terapia capilar'
  return 'Pro Líderes'
}
