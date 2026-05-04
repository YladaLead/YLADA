import type { ProLideresTenantRole } from '@/types/leader-tenant'

/** Cookie: líder vê UI como a equipe (Path=/ para todas as rotas do painel). */
export const PRO_LIDERES_TEAM_PREVIEW_COOKIE = 'ylada_pl_team_preview' as const

export type ProLideresCookieStoreLike = {
  get(name: string): { value: string } | undefined
}

/**
 * Servidor: cookie de pré-visualização só conta para quem **realmente** pode gerir como líder
 * (dono ou co-líder confirmado em `leader_tenant_members`), nunca para membro convidado.
 */
export function proLideresTeamViewPreviewFromCaps(
  canManageAsLeader: boolean,
  cookieStore: ProLideresCookieStoreLike
): boolean {
  if (!canManageAsLeader) return false
  return cookieStore.get(PRO_LIDERES_TEAM_PREVIEW_COOKIE)?.value === '1'
}

/** @deprecated Preferir `proLideresTeamViewPreviewFromCaps` com capacidade vinda da BD. */
export function proLideresTeamViewPreviewFromCookies(
  role: ProLideresTenantRole,
  cookieStore: ProLideresCookieStoreLike
): boolean {
  return proLideresTeamViewPreviewFromCaps(role === 'leader', cookieStore)
}

/** Cliente: ativar ou desativar o modo “ver como equipe” e persistir para o próximo SSR. */
export function setProLideresTeamViewPreviewCookie(enabled: boolean): void {
  if (typeof document === 'undefined') return
  const name = PRO_LIDERES_TEAM_PREVIEW_COOKIE
  const maxAge = 7 * 24 * 60 * 60
  if (enabled) {
    document.cookie = `${name}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`
  } else {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
  }
}
