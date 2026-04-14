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
  /** Só o dono do tenant (líder) vê; equipe usa ambiente reduzido. */
  leaderOnly?: boolean
}

export const PRO_LIDERES_MENU_GROUPS: { label: string; items: ProLideresMenuItem[] }[] = [
  {
    label: 'Principal',
    items: [
      { key: 'visao', label: 'Visão geral', path: '', icon: '📊' },
      { key: 'links', label: 'Links & convites', path: 'links', icon: '🔗', leaderOnly: true },
      /** Lista de pessoas do espaço: só o líder (membro foca em catálogo + scripts). */
      { key: 'equipe', label: 'Equipe', path: 'equipe', icon: '👥', leaderOnly: true },
      /** Mentor IA: só o líder; a equipa usa scripts e materiais partilhados. */
      { key: 'noel', label: 'Noel (mentor)', path: 'noel', icon: '💬', leaderOnly: true },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      {
        key: 'catalogo',
        label: 'Catálogo de ferramentas',
        path: 'catalogo',
        icon: '🛠️',
      },
      { key: 'scripts', label: 'Scripts', path: 'scripts', icon: '📝' },
    ],
  },
  {
    label: 'Conta',
    items: [
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
