/**
 * Objetivos do link — Noel líder (UI + prompt V2).
 */

export type ProLideresLeaderLinkObjetivoId =
  | 'trazer_gente_nova'
  | 'cuidar_cliente'
  | 'reativar'
  | 'indicacoes'
  | 'outro'

export type ProLideresLeaderLinkObjetivoOption = {
  id: ProLideresLeaderLinkObjetivoId
  title: string
  hint: string
  /** Mensagem enviada ao clicar no chip (vazio = Outro). */
  sendMessage: string
}

export const PRO_LIDERES_LINK_OBJETIVO_OUTRO_LABEL = 'Outro — me conta o que você quer'

export const PRO_LIDERES_LEADER_LINK_OBJETIVO_OPTIONS: readonly ProLideresLeaderLinkObjetivoOption[] = [
  {
    id: 'trazer_gente_nova',
    title: 'Trazer gente nova',
    hint: 'Gerar contatos',
    sendMessage: 'Quero um link para trazer gente nova (gerar contatos).',
  },
  {
    id: 'cuidar_cliente',
    title: 'Cuidar de quem já é cliente',
    hint: 'Acompanhar e educar',
    sendMessage: 'Quero um link para cuidar de quem já é cliente (acompanhar / educar).',
  },
  {
    id: 'reativar',
    title: 'Reativar quem parou',
    hint: 'Quem esfriou ou sumiu',
    sendMessage: 'Quero um link para reativar quem parou ou esfriou.',
  },
  {
    id: 'indicacoes',
    title: 'Colher indicações',
    hint: 'Multiplicar pela indicação',
    sendMessage: 'Quero um link para colher indicações (multiplicar).',
  },
  {
    id: 'outro',
    title: 'Outro',
    hint: 'Me conta o que você quer',
    sendMessage: '',
  },
] as const

/** Texto mínimo (fallback) se o painel não mostrar botões. */
export function formatLinkObjetivosBulletFallback(): string {
  return PRO_LIDERES_LEADER_LINK_OBJETIVO_OPTIONS.filter((o) => o.id !== 'outro')
    .map((o) => `• **${o.title}** — ${o.hint}`)
    .concat([`• **${PRO_LIDERES_LINK_OBJETIVO_OUTRO_LABEL}** — descreva em uma frase`])
    .join('\n')
}

/** Noel pediu escolha de objetivo do link (mostrar chips na UI). */
export function leaderAssistantOffersLinkObjetivoChoices(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  if (/o que você quer que esse link faça/i.test(t)) return true
  const hasFour =
    /trazer gente nova/i.test(t) &&
    /cuidar de quem já é cliente/i.test(t) &&
    /reativar quem parou/i.test(t) &&
    /colher indicações/i.test(t)
  return hasFour
}

/** Esconde lista textual duplicada quando os chips aparecem. */
export function leaderLinkObjetivoAssistantDisplayText(text: string): string {
  if (!leaderAssistantOffersLinkObjetivoChoices(text)) return text
  const menuStart = text.search(/\n\s*(?:\*\*)?[1-5]\)\s*Trazer gente nova/i)
  if (menuStart > 0) return text.slice(0, menuStart).trim()
  const bulletStart = text.search(/\n\s*•\s*\*\*Trazer gente nova/i)
  if (bulletStart > 0) return text.slice(0, bulletStart).trim()
  return text.trim()
}

const INTERNAL_OBJECTIVE_TITLE_RE =
  /colhendo indica|colher indica|gerando contatos|qualificando leads|reativando clientes/i

/** Título do preview é copy pro lead, não objetivo interno do líder. */
export function leaderIndicacoesPreviewTitleIsReaderFacing(title: string): boolean {
  const t = title.trim()
  if (!t) return false
  return !INTERNAL_OBJECTIVE_TITLE_RE.test(t)
}
