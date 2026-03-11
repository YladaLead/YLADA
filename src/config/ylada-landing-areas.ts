/**
 * Áreas do Método YLADA com landing pages públicas.
 * Todas tratadas igualmente — sem ênfase em nenhuma área específica.
 */
export interface YladaLandingArea {
  codigo: string
  label: string
  href: string
  descricao: string
}

export const YLADA_LANDING_AREAS: YladaLandingArea[] = [
  { codigo: 'nutri', label: 'Nutricionistas', href: '/pt/nutri', descricao: 'Para nutricionistas que querem atrair pacientes interessados.' },
  { codigo: 'wellness', label: 'Wellness', href: '/pt/wellness', descricao: 'Para times de bem-estar e recrutamento.' },
  { codigo: 'estetica', label: 'Estética', href: '/pt/estetica', descricao: 'Para profissionais de estética.' },
  { codigo: 'fitness', label: 'Fitness', href: '/pt/fitness', descricao: 'Para profissionais de fitness.' },
  { codigo: 'coach', label: 'Coach', href: '/pt/coach', descricao: 'Para coaches e mentores.' },
  { codigo: 'psi', label: 'Psicologia', href: '/pt/psi', descricao: 'Para psicólogos e psicanalistas.' },
  { codigo: 'med', label: 'Médicos', href: '/pt/med', descricao: 'Para médicos e clínicas.' },
  { codigo: 'odonto', label: 'Odontologia', href: '/pt/odonto', descricao: 'Para dentistas e clínicas odontológicas.' },
]
