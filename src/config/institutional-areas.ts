/**
 * Áreas exibidas na grade em /pt (piloto).
 * status 'ready' = entrada minimal em path; 'construction' = /pt/solicitar-acesso?area=...
 * Cada área ready: /pt/{id} (minimal) e /pt/{id}/como-funciona (landing longa).
 */
export type AreaStatus = 'ready' | 'construction'

export interface InstitutionalArea {
  id: string
  path: string
  status: AreaStatus
  /** Chave em t.institutional.areas.list[id] */
  translationKey: 'nutri' | 'coach' | 'med' | 'estetica' | 'fitness' | 'perfumaria' | 'nutra' | 'profissional-liberal' | 'vendedores-geral' | 'psi' | 'psicanalise' | 'odonto'
}

/**
 * Áreas na ordem de exibição: profissionais de saúde, bem-estar, vendedores, em breve.
 * Paths ready: raiz do segmento (/pt/{id}), entrada para divulgação.
 * Coach é a única porta de entrada para coaches; a diferenciação (bem-estar, carreira, vida) ocorre no perfil.
 * Wellness (Herbalife) não aparece — funciona em paralelo, fora da divulgação oficial.
 */
export const INSTITUTIONAL_AREAS: InstitutionalArea[] = [
  // Profissionais de saúde
  { id: 'nutri', path: '/pt/nutri', status: 'ready', translationKey: 'nutri' },
  { id: 'psi', path: '/pt/psi', status: 'ready', translationKey: 'psi' },
  { id: 'psicanalise', path: '/pt/psicanalise', status: 'ready', translationKey: 'psicanalise' },
  { id: 'odonto', path: '/pt/odonto', status: 'ready', translationKey: 'odonto' },
  { id: 'med', path: '/pt/med', status: 'ready', translationKey: 'med' },
  // Bem-estar e estética
  { id: 'coach', path: '/pt/coach', status: 'ready', translationKey: 'coach' },
  { id: 'estetica', path: '/pt/estetica', status: 'ready', translationKey: 'estetica' },
  { id: 'fitness', path: '/pt/fitness', status: 'ready', translationKey: 'fitness' },
  // Vendedores
  { id: 'nutra', path: '/pt/nutra', status: 'ready', translationKey: 'nutra' },
  { id: 'perfumaria', path: '/pt/perfumaria', status: 'ready', translationKey: 'perfumaria' },
  // Em breve
  { id: 'profissional-liberal', path: '/pt/solicitar-acesso?area=profissional-liberal', status: 'construction', translationKey: 'profissional-liberal' },
  { id: 'vendedores-geral', path: '/pt/solicitar-acesso?area=vendedores-geral', status: 'construction', translationKey: 'vendedores-geral' },
]

/** Mapeamento área → path base (sem locale). Landings em /area, login em /area/login. */
const AREA_BASE_PATHS: Record<string, string> = {
  nutri: '/nutri',
  psi: '/psi',
  psicanalise: '/psicanalise',
  odonto: '/odonto',
  med: '/med',
  coach: '/coach',
  estetica: '/estetica',
  fitness: '/fitness',
  nutra: '/nutra',
  perfumaria: '/perfumaria',
  'profissional-liberal': '/solicitar-acesso?area=profissional-liberal',
  'vendedores-geral': '/solicitar-acesso?area=vendedores-geral',
}

/** Retorna path da área com locale (ex: getAreaPath('nutri', 'es') → '/es/nutri') */
export function getAreaPath(areaId: string, locale: string): string {
  const base = AREA_BASE_PATHS[areaId] ?? `/${areaId}`
  return `/${locale}${base}`
}
