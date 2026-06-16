/**
 * Helpers para a rota pública `/[perfil]/[fluxo]` (camada fina sobre `/l/[slug]`).
 * @see blueprint-plataforma/Chat4_Motor_Catalogo_Permissoes.md §3.1–3.2
 */

/** Primeiro segmento reservado — não tratar como handle de perfil. */
export const PERFIL_FLUXO_RESERVED_FIRST_SEGMENTS = new Set([
  'pt',
  'en',
  'es',
  'suporte',
  'privacidade',
  'termos',
  'migrado',
  'uso-wellness-v1',
  'p',
  'l',
  'f',
  'm',
  'link',
  'templates-environment',
  'template',
  'calculadora-imc',
  'promo',
  'admin',
  'pro-lideres',
  'pro-estetica',
  'pro-estetica-corporal',
  'pro-estetica-capilar',
  'pro-joias',
  'cursos',
  'create',
  'api',
  'auth',
  '_next',
  'videos',
  'images',
  'logos',
  'conviccao',
  'conviccao-gera-performance',
  'conviction',
  'us',
  'parceiros',
])

const PERFIL_FLUXO_PATH_RE = /^\/([a-z0-9][a-z0-9-]*)\/([a-z0-9][a-z0-9-]*)\/?$/i

export type PerfilFluxoPathParts = {
  perfil: string
  fluxo: string
}

/** True se o pathname parece `/[perfil]/[fluxo]` público (sem prefixo de idioma). */
export function isPerfilFluxoPublicPath(pathname: string): boolean {
  return parsePerfilFluxoPath(pathname) !== null
}

export function parsePerfilFluxoPath(pathname: string): PerfilFluxoPathParts | null {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.replace(/\/+$/, '') : pathname
  const m = normalized.match(PERFIL_FLUXO_PATH_RE)
  if (!m) return null
  const perfil = m[1].toLowerCase()
  const fluxo = m[2].toLowerCase()
  if (perfil.includes('.') || fluxo.includes('.')) return null
  if (PERFIL_FLUXO_RESERVED_FIRST_SEGMENTS.has(perfil)) return null
  return { perfil, fluxo }
}
