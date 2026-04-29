/**
 * Menu lateral do painel Pro Líderes — mesma filosofia visual de YLADA_MENU_GROUPS
 * (@/config/ylada-areas). Novas áreas do líder: acrescentar itens aqui.
 */
export const PRO_LIDERES_BASE_PATH = '/pro-lideres/painel'

export type ProLideresMenuItem = {
  key: string
  label: string
  path: string
  icon: string
  /** Texto pequeno por baixo do rótulo (ex.: Noel → Mentor). */
  subtitle?: string
  /** Só o dono do tenant (líder) vê; equipe usa ambiente reduzido. */
  leaderOnly?: boolean
}

export const PRO_LIDERES_MENU_GROUPS: { label: string; items: ProLideresMenuItem[] }[] = [
  {
    label: 'Principal',
    items: [
      { key: 'visao', label: 'Visão geral', path: '', icon: '📊' },
      { key: 'noel', label: 'Noel', path: 'noel', icon: '💬', leaderOnly: true },
      {
        key: 'catalogo',
        label: 'Catálogo de ferramentas',
        path: 'catalogo',
        icon: '🛠️',
      },
      { key: 'scripts', label: 'Scripts', path: 'scripts', icon: '📝' },
      { key: 'tarefas', label: 'Tarefas diárias', path: 'tarefas', icon: '✅' },
      { key: 'equipe', label: 'Análise da equipe', path: 'equipe', icon: '👥', leaderOnly: true },
      { key: 'links', label: 'Convites equipe', path: 'links', icon: '🔗', leaderOnly: true },
      {
        key: 'pre-diagnostico',
        label: 'Pré-diagnóstico',
        path: 'pre-diagnostico',
        icon: '📋',
        leaderOnly: true,
      },
      {
        key: 'cobranca-equipe',
        label: 'Cobrança da equipe',
        path: 'cobranca-equipe',
        icon: '🧾',
        leaderOnly: true,
      },
      {
        key: 'configuracao',
        label: 'Configurações',
        path: 'configuracao',
        icon: '⚙️',
        leaderOnly: true,
      },
    ],
  },
]

export function proLideresItemHref(path: string): string {
  if (!path) return PRO_LIDERES_BASE_PATH
  return `${PRO_LIDERES_BASE_PATH}/${path}`
}
