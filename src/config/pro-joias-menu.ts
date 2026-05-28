/**
 * Pro Joias — navegação do painel.
 * Rota base: /pro-joias/painel
 */
export const PRO_JOIAS_BASE_PATH = '/pro-joias/painel'
export const PRO_JOIAS_INICIO_PATH = PRO_JOIAS_BASE_PATH

export type ProJoiasMenuItem = {
  key: string
  label: string
  path: string
  icon: string
  hint?: string
  leaderOnly?: boolean
}

export const PRO_JOIAS_MENU_GROUPS: { label: string; items: ProJoiasMenuItem[] }[] = [
  {
    label: 'Painel',
    items: [
      { key: 'inicio', label: 'Início', path: '', icon: '✨', hint: 'Visão geral' },
      { key: 'scripts', label: 'Scripts', path: 'scripts', icon: '💬', hint: 'Abordagem e vendas' },
      { key: 'links', label: 'Links', path: 'links', icon: '🔗', hint: 'Diagnósticos e captura' },
      { key: 'leads', label: 'Leads', path: 'leads', icon: '🎯', hint: 'Clientes que responderam' },
      { key: 'equipe', label: 'Equipe', path: 'equipe', icon: '👥', hint: 'Distribuidoras da rede', leaderOnly: true },
      { key: 'catalogo', label: 'Catálogo', path: 'catalogo', icon: '💍', hint: 'Links e produtos' },
      { key: 'noel', label: 'Noel', path: 'noel', icon: '💡', hint: 'Tire dúvidas com IA' },
    ],
  },
  {
    label: 'Conta',
    items: [
      { key: 'configuracao', label: 'Configuração', path: 'configuracao', icon: '⚙️', hint: 'Sua rede', leaderOnly: true },
      { key: 'perfil', label: 'Perfil', path: 'perfil', icon: '👤', hint: 'Seus dados' },
    ],
  },
]

export function proJoiasItemHref(path: string): string {
  if (!path) return PRO_JOIAS_BASE_PATH
  return `${PRO_JOIAS_BASE_PATH}/${path}`
}
