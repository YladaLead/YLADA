/** Opções do onboarding do líder Pro Líderes — chaves estáveis para JSON + rótulos PT. */

export const LEADER_ONBOARDING_MAIN_CHALLENGE_OPTIONS = [
  { id: 'followup', label: 'Falta de acompanhamento' },
  { id: 'recruitment', label: 'Baixo recrutamento' },
  { id: 'sales', label: 'Pouca venda' },
  { id: 'motivation', label: 'Equipe desmotivada' },
  { id: 'contacts', label: 'Falta de novos contatos' },
  { id: 'other', label: 'Outro' },
] as const

export type LeaderOnboardingMainChallengeId = (typeof LEADER_ONBOARDING_MAIN_CHALLENGE_OPTIONS)[number]['id']

export const LEADER_ONBOARDING_TEAM_ACTIVITY_OPTIONS = [
  { id: 'very_active', label: 'Muito ativa (reuniões + vendas constantes)' },
  { id: 'medium', label: 'Média (alguns ativos, outros parados)' },
  { id: 'low', label: 'Baixa (maioria parada)' },
] as const

export type LeaderOnboardingTeamActivityId = (typeof LEADER_ONBOARDING_TEAM_ACTIVITY_OPTIONS)[number]['id']

export const LEADER_ONBOARDING_FOLLOWUP_FREQUENCY_OPTIONS = [
  { id: 'daily', label: 'Diário' },
  { id: '2_3_week', label: '2–3x por semana' },
  { id: 'weekly', label: '1x por semana' },
  { id: 'rare', label: 'Quase não acompanha' },
] as const

export type LeaderOnboardingFollowupFrequencyId =
  (typeof LEADER_ONBOARDING_FOLLOWUP_FREQUENCY_OPTIONS)[number]['id']

export const LEADER_ONBOARDING_BOTTLENECK_OPTIONS = [
  { id: 'discipline', label: 'Falta de disciplina' },
  { id: 'belief', label: 'Falta de crença' },
  { id: 'method', label: 'Falta de método' },
  { id: 'time', label: 'Falta de tempo' },
  { id: 'communication', label: 'Falta de habilidade de comunicação' },
  { id: 'other', label: 'Outro' },
] as const

export type LeaderOnboardingBottleneckId = (typeof LEADER_ONBOARDING_BOTTLENECK_OPTIONS)[number]['id']

export const LEADER_ONBOARDING_TOOL_OPTIONS = [
  { id: 'evs', label: 'Espaço Vida Saudável' },
  { id: 'functional_drinks', label: 'Bebidas funcionais' },
  { id: 'challenge_21', label: 'Desafio 21 dias' },
  { id: 'plan_90', label: 'Plano 90 dias' },
  { id: 'direct_sales', label: 'Vendas diretas' },
  { id: 'none_consistent', label: 'Não uso nenhuma com consistência' },
] as const

export type LeaderOnboardingToolId = (typeof LEADER_ONBOARDING_TOOL_OPTIONS)[number]['id']

const mainChallengeById = Object.fromEntries(
  LEADER_ONBOARDING_MAIN_CHALLENGE_OPTIONS.map((o) => [o.id, o.label])
) as Record<string, string>

const teamActivityById = Object.fromEntries(
  LEADER_ONBOARDING_TEAM_ACTIVITY_OPTIONS.map((o) => [o.id, o.label])
) as Record<string, string>

const followupById = Object.fromEntries(
  LEADER_ONBOARDING_FOLLOWUP_FREQUENCY_OPTIONS.map((o) => [o.id, o.label])
) as Record<string, string>

const bottleneckById = Object.fromEntries(
  LEADER_ONBOARDING_BOTTLENECK_OPTIONS.map((o) => [o.id, o.label])
) as Record<string, string>

const toolsById = Object.fromEntries(
  LEADER_ONBOARDING_TOOL_OPTIONS.map((o) => [o.id, o.label])
) as Record<string, string>

export function buildMainChallengeAnswerLine(preset: string, otherTrimmed: string): string {
  if (!preset) return ''
  if (preset === 'other') {
    const o = otherTrimmed
    return o ? `Outro: ${o}` : 'Outro'
  }
  return mainChallengeById[preset] ?? preset
}

export function buildTeamBottleneckLine(preset: string, otherTrimmed: string): string {
  if (!preset) return ''
  if (preset === 'other') {
    const o = otherTrimmed
    return o ? `Outro: ${o}` : 'Outro'
  }
  return bottleneckById[preset] ?? preset
}

export function humanizeTeamActivity(id: string): string {
  return teamActivityById[id] ?? id
}

export function humanizeFollowupFrequency(id: string): string {
  return followupById[id] ?? id
}

export function humanizeToolsUsed(ids: string[]): string {
  return ids.map((id) => toolsById[id] ?? id).join('; ')
}

export const LEADER_ONBOARDING_ALLOWED_TOOL_IDS = new Set<string>(
  LEADER_ONBOARDING_TOOL_OPTIONS.map((o) => o.id)
)

export const LEADER_ONBOARDING_ALLOWED_MAIN_CHALLENGE = new Set<string>(
  LEADER_ONBOARDING_MAIN_CHALLENGE_OPTIONS.map((o) => o.id)
)

export const LEADER_ONBOARDING_ALLOWED_TEAM_ACTIVITY = new Set<string>(
  LEADER_ONBOARDING_TEAM_ACTIVITY_OPTIONS.map((o) => o.id)
)

export const LEADER_ONBOARDING_ALLOWED_FOLLOWUP = new Set<string>(
  LEADER_ONBOARDING_FOLLOWUP_FREQUENCY_OPTIONS.map((o) => o.id)
)

export const LEADER_ONBOARDING_ALLOWED_BOTTLENECK = new Set<string>(
  LEADER_ONBOARDING_BOTTLENECK_OPTIONS.map((o) => o.id)
)
