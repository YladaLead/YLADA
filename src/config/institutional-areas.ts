/**
 * Áreas exibidas na página institucional (/pt).
 * status 'ready' = link direto; 'construction' = página "Em construção" com formulário de solicitação.
 * Paths: ready → login; construction → /pt/solicitar-acesso?area=...
 */
export type AreaStatus = 'ready' | 'construction'

export interface InstitutionalArea {
  id: string
  path: string
  status: AreaStatus
  /** Chave em t.institutional.areas.list[id] */
  translationKey: 'nutri' | 'coach-bem-estar' | 'med' | 'estetica' | 'fitness' | 'perfumaria' | 'nutra' | 'profissional-liberal' | 'vendedores-geral' | 'psi' | 'psicanalise' | 'odonto'
}

/**
 * Áreas na ordem de exibição: profissionais de saúde, bem-estar, vendedores, em breve.
 * Áreas com landing: path aponta para a landing. Sem landing: path aponta para login.
 * Wellness (Herbalife) não aparece — funciona em paralelo, fora da divulgação oficial.
 */
export const INSTITUTIONAL_AREAS: InstitutionalArea[] = [
  // Profissionais de saúde
  { id: 'nutri', path: '/pt/nutri', status: 'ready', translationKey: 'nutri' },
  { id: 'psi', path: '/pt/psi', status: 'ready', translationKey: 'psi' },
  { id: 'psicanalise', path: '/pt/psicanalise/login', status: 'ready', translationKey: 'psicanalise' },
  { id: 'odonto', path: '/pt/odonto/login', status: 'ready', translationKey: 'odonto' },
  { id: 'med', path: '/pt/med/login', status: 'ready', translationKey: 'med' },
  // Bem-estar e estética
  { id: 'coach-bem-estar', path: '/pt/coach-bem-estar', status: 'ready', translationKey: 'coach-bem-estar' },
  { id: 'estetica', path: '/pt/estetica/login', status: 'ready', translationKey: 'estetica' },
  { id: 'fitness', path: '/pt/fitness/login', status: 'ready', translationKey: 'fitness' },
  // Vendedores
  { id: 'nutra', path: '/pt/nutra', status: 'ready', translationKey: 'nutra' },
  { id: 'perfumaria', path: '/pt/perfumaria/login', status: 'ready', translationKey: 'perfumaria' },
  // Em breve
  { id: 'profissional-liberal', path: '/pt/solicitar-acesso?area=profissional-liberal', status: 'construction', translationKey: 'profissional-liberal' },
  { id: 'vendedores-geral', path: '/pt/solicitar-acesso?area=vendedores-geral', status: 'construction', translationKey: 'vendedores-geral' },
]

/** Mapeamento área → path base (sem locale). Landings em /area, login em /area/login. */
const AREA_BASE_PATHS: Record<string, string> = {
  nutri: '/nutri',
  psi: '/psi',
  psicanalise: '/psicanalise/login',
  odonto: '/odonto',
  med: '/med',
  'coach-bem-estar': '/coach-bem-estar',
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
