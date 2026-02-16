/**
 * Áreas exibidas na página institucional (/pt).
 * status 'ready' = link direto; 'construction' = página "Em construção".
 */
export type AreaStatus = 'ready' | 'construction'

export interface InstitutionalArea {
  id: string
  path: string
  status: AreaStatus
  /** Chave em t.institutional.areas.list[id] */
  translationKey: 'nutri' | 'wellness' | 'ylada' | 'psi' | 'psicanalise' | 'odonto' | 'nutra' | 'coach'
}

export const INSTITUTIONAL_AREAS: InstitutionalArea[] = [
  { id: 'nutri', path: '/pt/nutri', status: 'ready', translationKey: 'nutri' },
  { id: 'wellness', path: '/pt/wellness', status: 'ready', translationKey: 'wellness' },
  { id: 'ylada', path: '/pt', status: 'ready', translationKey: 'ylada' },
  { id: 'psi', path: '/pt/psi', status: 'construction', translationKey: 'psi' },
  { id: 'psicanalise', path: '/pt/psicanalise', status: 'construction', translationKey: 'psicanalise' },
  { id: 'odonto', path: '/pt/odonto', status: 'construction', translationKey: 'odonto' },
  { id: 'nutra', path: '/pt/nutra', status: 'ready', translationKey: 'nutra' },
  { id: 'coach', path: '/pt/coach', status: 'construction', translationKey: 'coach' },
]
