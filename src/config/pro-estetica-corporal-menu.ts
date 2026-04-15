/**
 * Pro Estética Corporal — navegação mínima.
 * Entrada: central de resolução (dores); Noel, links e ritmo esticam a mesma promessa.
 */
export const PRO_ESTETICA_CORPORAL_BASE_PATH = '/pro-estetica-corporal/painel'

/** Entrada do painel: o que resolver hoje (demo + uso diário). */
export const PRO_ESTETICA_CORPORAL_INICIO_PATH = PRO_ESTETICA_CORPORAL_BASE_PATH

export const PRO_ESTETICA_CORPORAL_NOEL_PATH = `${PRO_ESTETICA_CORPORAL_BASE_PATH}/noel`

export type ProEsteticaCorporalMenuItem = {
  key: string
  label: string
  path: string
  icon: string
  hint?: string
  leaderOnly?: boolean
}

export const PRO_ESTETICA_CORPORAL_MENU_GROUPS: { label: string; items: ProEsteticaCorporalMenuItem[] }[] = [
  {
    label: 'Painel',
    items: [
      { key: 'inicio', label: 'Início', path: '', icon: '✨', hint: 'O que resolver hoje' },
      { key: 'noel', label: 'Noel', path: 'noel', icon: '💬', hint: 'Pergunte o que precisa' },
      { key: 'links', label: 'Links', path: 'biblioteca-links', icon: '🔗', hint: 'Biblioteca e seus /l/' },
      { key: 'resultados', label: 'Ritmo', path: 'resultados', icon: '📈', hint: 'Sua semana' },
      { key: 'perfil', label: 'Perfil', path: 'perfil', icon: '👤', hint: 'Sua clínica' },
    ],
  },
]

export function proEsteticaCorporalItemHref(path: string): string {
  if (!path) return PRO_ESTETICA_CORPORAL_BASE_PATH
  return `${PRO_ESTETICA_CORPORAL_BASE_PATH}/${path}`
}
