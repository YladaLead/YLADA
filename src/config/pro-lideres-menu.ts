/**
 * Menu lateral do painel Pro Líderes — mesma filosofia visual de YLADA_MENU_GROUPS
 * (@/config/ylada-areas). Novas áreas do líder: acrescentar itens aqui.
 */
export const PRO_LIDERES_BASE_PATH = '/pro-lideres/painel'

/** Área só da equipa (convites): URL distinta do painel do líder. */
export const PRO_LIDERES_MEMBER_BASE_PATH = '/pro-lideres/membro'

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
        label: 'Meus links',
        path: 'catalogo',
        icon: '🛠️',
      },
      { key: 'scripts', label: 'Scripts', path: 'scripts', icon: '📝' },
      { key: 'tarefas', label: 'Tarefas diárias', path: 'tarefas', icon: '✅' },
      { key: 'equipe', label: 'Análise da equipe', path: 'equipe', icon: '👥', leaderOnly: true },
      { key: 'links', label: 'Convites equipe', path: 'links', icon: '🔗', leaderOnly: true },
      { key: 'tabuladores', label: 'Tabuladores', path: 'tabuladores', icon: '📋', leaderOnly: true },
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
  return proLideresItemHrefWithBase(PRO_LIDERES_BASE_PATH, path)
}

export function proLideresItemHrefWithBase(basePath: string, path: string): string {
  const base = basePath.replace(/\/$/, '')
  if (!path) return base
  return `${base}/${path}`
}

/** Converte `/pro-lideres/painel/...` → `/pro-lideres/membro/...` (mantém sufixo). */
export function mapProLideresPathToMemberArea(pathname: string): string {
  const normalized = (pathname || '').replace(/\/+$/, '') || '/'
  if (!normalized.startsWith(PRO_LIDERES_BASE_PATH)) return PRO_LIDERES_MEMBER_BASE_PATH
  const rest = normalized.slice(PRO_LIDERES_BASE_PATH.length)
  return `${PRO_LIDERES_MEMBER_BASE_PATH}${rest}` || PRO_LIDERES_MEMBER_BASE_PATH
}

/** Converte `/pro-lideres/membro/...` → `/pro-lideres/painel/...`. */
export function mapProLideresPathToLeaderArea(pathname: string): string {
  const normalized = (pathname || '').replace(/\/+$/, '') || '/'
  if (!normalized.startsWith(PRO_LIDERES_MEMBER_BASE_PATH)) return PRO_LIDERES_BASE_PATH
  const rest = normalized.slice(PRO_LIDERES_MEMBER_BASE_PATH.length)
  return `${PRO_LIDERES_BASE_PATH}${rest}` || PRO_LIDERES_BASE_PATH
}
