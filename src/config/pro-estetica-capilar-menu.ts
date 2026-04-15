export const PRO_ESTETICA_CAPILAR_BASE_PATH = '/pro-estetica-capilar/painel'

export type ProEsteticaCapilarMenuItem = {
  key: string
  label: string
  path: string
  icon: string
  leaderOnly?: boolean
}

export const PRO_ESTETICA_CAPILAR_MENU_GROUPS: { label: string; items: ProEsteticaCapilarMenuItem[] }[] = [
  {
    label: 'Principal',
    items: [
      { key: 'visao', label: 'Visao geral', path: '', icon: '📊' },
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
