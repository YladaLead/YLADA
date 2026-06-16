/**
 * Redirects 308 síncronos de URLs legadas → `/[perfil]/[fluxo]` ou `/l/[slug]`.
 * @see blueprint-plataforma/Chat4_Motor_Catalogo_Permissoes.md §3.3
 */
import { PERFIL_FLUXO_RESERVED_FIRST_SEGMENTS } from '@/lib/ylada-flow/perfil-fluxo-path'

const WELLNESS_APP_SEGMENTS = new Set([
  'dashboard',
  'home',
  'system',
  'ferramentas',
  'cursos',
  'portals',
  'modulos',
  'treinos',
  'links',
  'configuracao',
  'tutoriais',
  'plano',
  'comunidade',
  'suporte',
  'conta',
  'biblioteca',
  'fluxos',
  'perfil',
  'evolucao',
  'clientes',
  'workshop',
  'noel',
  'filosofia-lada',
  'quizzes',
  'acesso',
  'bem-vindo',
  'trial',
  'pagamento-sucesso',
  'reset-password',
  'recuperar-senha',
  'recuperar-acesso',
  'testar-email',
  'templates',
  'portal',
  'login',
  'checkout',
  'assinar',
  'renovar',
  'ferramenta',
  'hom',
  'formulario',
  'quiz',
])

const AREA_PREFIXES = ['wellness', 'nutri', 'coach', 'coach-bem-estar', 'c'] as const

function perfilFluxoTarget(perfil: string, fluxo: string): string {
  return `/${perfil.toLowerCase()}/${fluxo.toLowerCase()}`
}

function isValidPerfilSegment(seg: string): boolean {
  const s = seg.toLowerCase()
  if (!s || s.includes('.')) return false
  if (PERFIL_FLUXO_RESERVED_FIRST_SEGMENTS.has(s)) return false
  if (WELLNESS_APP_SEGMENTS.has(s)) return false
  return true
}

/**
 * Calcula destino 308 para pathname legado, ou null se não aplicável.
 * Só transformações síncronas (sem lookup em BD).
 */
export function resolveLegacyPublicUrlRedirect(pathname: string): string | null {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname

  const linkLegacy = normalized.match(/^\/link\/([^/]+)$/i)
  if (linkLegacy?.[1]) {
    return `/l/${linkLegacy[1].toLowerCase()}`
  }

  for (const area of AREA_PREFIXES) {
    const toolMatch = normalized.match(new RegExp(`^/pt/${area}/([^/]+)/([^/]+)$`, 'i'))
    if (toolMatch) {
      const [, userSlug, toolSlug] = toolMatch
      if (isValidPerfilSegment(userSlug) && isValidPerfilSegment(toolSlug)) {
        return perfilFluxoTarget(userSlug, toolSlug)
      }
    }

    const quizMatch = normalized.match(new RegExp(`^/pt/${area}/([^/]+)/quiz/([^/]+)$`, 'i'))
    if (quizMatch) {
      const [, userSlug, quizSlug] = quizMatch
      if (isValidPerfilSegment(userSlug) && isValidPerfilSegment(quizSlug)) {
        return perfilFluxoTarget(userSlug, quizSlug)
      }
    }

    const formularioMatch = normalized.match(
      new RegExp(`^/pt/${area}/([^/]+)/formulario/([^/]+)$`, 'i')
    )
    if (formularioMatch) {
      const [, userSlug, formSlug] = formularioMatch
      if (isValidPerfilSegment(userSlug) && isValidPerfilSegment(formSlug)) {
        return perfilFluxoTarget(userSlug, formSlug)
      }
    }

    const portalWithUser = normalized.match(new RegExp(`^/pt/${area}/([^/]+)/portal/([^/]+)$`, 'i'))
    if (portalWithUser) {
      const [, userSlug, portalSlug] = portalWithUser
      if (isValidPerfilSegment(userSlug) && isValidPerfilSegment(portalSlug)) {
        return perfilFluxoTarget(userSlug, portalSlug)
      }
    }

    const fluxosMatch = normalized.match(
      new RegExp(`^/pt/${area}/([^/]+)/fluxos/(?:cliente|recrutamento)/([^/]+)$`, 'i')
    )
    if (fluxosMatch) {
      const [, userSlug, fluxoId] = fluxosMatch
      if (isValidPerfilSegment(userSlug) && isValidPerfilSegment(fluxoId)) {
        return perfilFluxoTarget(userSlug, fluxoId)
      }
    }
  }

  const wellnessPortalOnly = normalized.match(/^\/pt\/wellness\/portal\/([^/]+)$/i)
  if (wellnessPortalOnly?.[1] && isValidPerfilSegment(wellnessPortalOnly[1])) {
    // Sem user_slug na URL — mantém legado até resolver dono em BD (Chat 5).
    return null
  }

  return null
}
