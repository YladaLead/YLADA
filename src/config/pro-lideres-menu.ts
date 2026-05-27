/**
 * Menu lateral do painel Pro Líderes — mesma filosofia visual de YLADA_MENU_GROUPS
 * (@/config/ylada-areas). Novas áreas do líder: acrescentar itens aqui.
 */
export const PRO_LIDERES_BASE_PATH = '/pro-lideres/painel'

/** Área só da equipe (convites): URL distinta do painel do líder. */
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
  /** Só quando o líder disponibilizou o Noel para a equipe e o membro está no escopo. */
  requireNoelMemberNav?: boolean
}

export const PRO_LIDERES_MENU_GROUPS: { label: string; items: ProLideresMenuItem[] }[] = [
  {
    label: 'Meu trabalho',
    items: [
      { key: 'visao', label: 'Visão geral', path: '', icon: '📊' },
      { key: 'catalogo', label: 'Meus links', path: 'catalogo', icon: '🛠️' },
      {
        key: 'y-scripts',
        label: 'Abordagens',
        path: 'y-scripts',
        icon: '📲',
        subtitle: 'Scripts prontos p/ WhatsApp',
      },
      { key: 'tarefas', label: 'Tarefas diárias', path: 'tarefas', icon: '✅' },
      { key: 'noel', label: 'Noel líder', path: 'noel', icon: '💬', leaderOnly: true },
    ],
  },
  {
    label: 'Minha equipe',
    items: [
      { key: 'equipe', label: 'Análise da equipe', path: 'equipe', icon: '👥', leaderOnly: true },
      {
        key: 'links',
        label: 'Adicionar à equipe',
        path: 'links',
        icon: '🔗',
        leaderOnly: true,
        subtitle: 'Gerenciar acessos',
      },
      {
        key: 'scripts',
        label: 'Scripts da equipe',
        path: 'scripts',
        icon: '📝',
        leaderOnly: true,
        subtitle: 'Criar e editar',
      },
      { key: 'tabuladores', label: 'Tabuladores', path: 'tabuladores', icon: '📋', leaderOnly: true },
      {
        key: 'cobranca-equipe',
        label: 'Cobranças',
        path: 'cobranca-equipe',
        icon: '🧾',
        leaderOnly: true,
      },
    ],
  },
  {
    label: 'Configurações',
    items: [
      {
        key: 'noel-membro',
        label: 'Noel para equipe',
        path: 'noel-membro',
        icon: '💬',
        subtitle: 'Visão do membro',
        requireNoelMemberNav: true,
      },
      {
        key: 'configuracao',
        label: 'Configurar Noel equipe',
        path: 'configuracao',
        icon: '⚙️',
        leaderOnly: true,
      },
    ],
  },
  {
    /** Sem label — fica solto no final, sempre visível */
    label: '',
    items: [
      { key: 'como-usar', label: 'Como usar', path: 'como-usar', icon: '📖' },
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
