/**
 * Perfis da matriz YLADA (/pt), excluindo Wellness (Herbalife).
 * Usado em admin: free implícito, relatórios e filtros de bloco YLADA.
 */
export const PERFIS_MATRIZ_YLADA = [
  'nutri',
  'coach',
  'nutra',
  'med',
  'psi',
  'psicanalise',
  'odonto',
  'estetica',
  'fitness',
  'joias',
  'perfumaria',
  'ylada',
  'seller',
] as const

export type PerfilMatrizYlada = (typeof PERFIS_MATRIZ_YLADA)[number]

export function isPerfilMatrizYlada(perfil: string | null | undefined): boolean {
  if (!perfil) return false
  return (PERFIS_MATRIZ_YLADA as readonly string[]).includes(perfil)
}
