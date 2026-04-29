export const PRO_ESTETICA_CAPILAR_BASE_PATH = '/pro-estetica-capilar/painel'

/** Entrada do painel (home). */
export const PRO_ESTETICA_CAPILAR_INICIO_PATH = PRO_ESTETICA_CAPILAR_BASE_PATH

export const PRO_ESTETICA_CAPILAR_NOEL_PATH = `${PRO_ESTETICA_CAPILAR_BASE_PATH}/noel`

export type ProEsteticaCapilarMenuItem = {
  key: string
  label: string
  path: string
  icon: string
  hint?: string
  leaderOnly?: boolean
}

/**
 * Navegação lateral — mesma estrutura que Pro Estética Corporal (`PRO_ESTETICA_CORPORAL_MENU_GROUPS`).
 * Rotas extra (Ritmo, Scripts, etc.) continuam acessíveis por URL e pelos atalhos na home.
 */
export const PRO_ESTETICA_CAPILAR_MENU_GROUPS: { label: string; items: ProEsteticaCapilarMenuItem[] }[] = [
  {
    label: 'Painel',
    items: [
      { key: 'inicio', label: 'Início', path: '', icon: '✨', hint: 'O que resolver hoje' },
      { key: 'noel', label: 'Noel', path: 'noel', icon: '💬', hint: 'Pergunte o que precisa' },
      { key: 'links', label: 'Links', path: 'biblioteca-links', icon: '🔗', hint: 'Biblioteca e os teus links' },
      {
        key: 'links-analise',
        label: 'Análise',
        path: 'links-analise',
        icon: '📊',
        hint: 'Cliques, diagnósticos e WhatsApp',
      },
      { key: 'perfil', label: 'Perfil', path: 'perfil', icon: '👤', hint: 'Sua clínica' },
    ],
  },
]

export function proEsteticaCapilarItemHref(path: string): string {
  if (!path) return PRO_ESTETICA_CAPILAR_BASE_PATH
  return `${PRO_ESTETICA_CAPILAR_BASE_PATH}/${path}`
}
