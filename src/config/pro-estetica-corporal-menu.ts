/**
 * Menu lateral — Pro Estética Corporal (profissional solo; sem equipe MMN).
 * Rotas antigas /painel/links e /painel/equipe redirecionam: foco consultoria, não convites MLM.
 */
export const PRO_ESTETICA_CORPORAL_BASE_PATH = '/pro-estetica-corporal/painel'

export type ProEsteticaCorporalMenuItem = {
  key: string
  label: string
  path: string
  icon: string
  leaderOnly?: boolean
}

export const PRO_ESTETICA_CORPORAL_MENU_GROUPS: { label: string; items: ProEsteticaCorporalMenuItem[] }[] = [
  {
    label: 'Principal',
    items: [
      { key: 'visao', label: 'Visão geral', path: '', icon: '📊' },
      { key: 'noel', label: 'Noel (mentor)', path: 'noel', icon: '💬' },
    ],
  },
  {
    label: 'Jornada do cliente',
    items: [
      { key: 'captar', label: 'Captar', path: 'captar', icon: '🎯' },
      { key: 'reter', label: 'Retenção', path: 'retencao', icon: '🔁' },
      { key: 'acompanhar', label: 'Acompanhar', path: 'acompanhar', icon: '📅' },
      { key: 'biblioteca-links', label: 'Biblioteca e links', path: 'biblioteca-links', icon: '📚' },
    ],
  },
  {
    label: 'Para ti',
    items: [{ key: 'scripts', label: 'Scripts', path: 'scripts', icon: '📝' }],
  },
  {
    label: 'Conta',
    items: [
      { key: 'configuracao', label: 'Perfil e dados', path: 'configuracao', icon: '⚙️', leaderOnly: true },
    ],
  },
]

export function proEsteticaCorporalItemHref(path: string): string {
  if (!path) return PRO_ESTETICA_CORPORAL_BASE_PATH
  return `${PRO_ESTETICA_CORPORAL_BASE_PATH}/${path}`
}
