export const PRO_ESTETICA_CAPILAR_BASE_PATH = '/pro-estetica-capilar/painel'

export type ProEsteticaCapilarMenuItem = {
  key: string
  label: string
  path: string
  icon: string
  hint?: string
  leaderOnly?: boolean
}

export const PRO_ESTETICA_CAPILAR_MENU_GROUPS: { label: string; items: ProEsteticaCapilarMenuItem[] }[] = [
  {
    label: 'Painel',
    items: [
      { key: 'visao', label: 'Inicio', path: '', icon: '✨', hint: 'Visao geral' },
      { key: 'noel', label: 'Noel', path: 'noel', icon: '💬', hint: 'Mentor estrategico' },
      { key: 'biblioteca', label: 'Biblioteca e links', path: 'biblioteca-links', icon: '🔗', hint: 'Ferramentas YLADA' },
      { key: 'resultados', label: 'Ritmo', path: 'resultados', icon: '📈', hint: 'Sua semana' },
      { key: 'scripts', label: 'Scripts', path: 'scripts', icon: '📝', hint: 'Roteiros de conversa' },
      { key: 'captar', label: 'Captar', path: 'captar', icon: '🎯' },
      { key: 'retencao', label: 'Retencao', path: 'retencao', icon: '🔁' },
      { key: 'acompanhar', label: 'Acompanhar', path: 'acompanhar', icon: '📅' },
    ],
  },
  {
    label: 'Conta',
    items: [{ key: 'configuracao', label: 'Perfil e dados', path: 'configuracao', icon: '⚙️', leaderOnly: true }],
  },
]

export function proEsteticaCapilarItemHref(path: string): string {
  if (!path) return PRO_ESTETICA_CAPILAR_BASE_PATH
  return `${PRO_ESTETICA_CAPILAR_BASE_PATH}/${path}`
}
