import type { ProLideresTenantRole } from '@/types/leader-tenant'

/** Cookie: líder vê UI como a equipa (Path=/ para todas as rotas do painel). */
export const PRO_LIDERES_TEAM_PREVIEW_COOKIE = 'ylada_pl_team_preview' as const

type CookieStoreLike = {
  get(name: string): { value: string } | undefined
}

/** Servidor: true só se conta é líder e o cookie de pré-visualização está ativo. */
export function proLideresTeamViewPreviewFromCookies(
  role: ProLideresTenantRole,
  cookieStore: CookieStoreLike
): boolean {
  if (role !== 'leader') return false
  return cookieStore.get(PRO_LIDERES_TEAM_PREVIEW_COOKIE)?.value === '1'
}

/** Cliente: ativar ou desativar o modo “ver como equipa” e persistir para o próximo SSR. */
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
