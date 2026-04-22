import {
  humanizeFollowupFrequency,
  humanizeTeamActivity,
  humanizeToolsUsed,
} from '@/lib/pro-lideres-leader-onboarding-fields'

export type OnboardingAnswerRow = { label: string; value: string }

function readString(ans: Record<string, unknown>, key: string): string {
  const v = ans[key]
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  return ''
}

function readTools(ans: Record<string, unknown>): string {
  const v = ans.tools_used
  if (!Array.isArray(v)) return ''
  const ids = v.filter((x): x is string => typeof x === 'string').map((s) => s.trim()).filter(Boolean)
  if (ids.length === 0) return ''
  return humanizeToolsUsed(ids)
}

/** Número tal como gravado (às vezes sem DDI); mostra E.164 legível, assumindo BR se faltar +55. */
function formatWhatsappForAdmin(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return ''
  let full = digits
  if (full.length >= 10 && full.length <= 11 && !full.startsWith('55')) {
    full = `55${full}`
  }
  return `+${full}`
}

/** Converte `questionnaire_answers` (JSON) em linhas legíveis para o admin. */
export function formatLeaderOnboardingAnswersForAdmin(
  answers: Record<string, unknown> | null | undefined
): OnboardingAnswerRow[] {
  if (!answers || typeof answers !== 'object') return []

  const rows: OnboardingAnswerRow[] = []
  const push = (label: string, value: string) => {
    const v = value.trim()
    if (v) rows.push({ label, value: v })
  }

  push('Nome para exibição', readString(answers, 'display_name'))
  push('Nome da equipe', readString(answers, 'team_name'))
  push('WhatsApp', formatWhatsappForAdmin(readString(answers, 'whatsapp')))

  const age = readString(answers, 'leader_age')
  if (age) push('Idade (anos)', age)
  const hf = readString(answers, 'herbalife_years')
  if (hf) push('Anos na Herbalife', hf)
  push('Antes da Herbalife', readString(answers, 'career_before_herbalife'))
  push('Total de pessoas na equipe', readString(answers, 'team_total_people'))
  push('Líderes na equipe', readString(answers, 'team_leaders_count'))
  push('Linhas distintas', readString(answers, 'team_distinct_lines'))

  const act = readString(answers, 'team_activity_level')
  if (act) push('Nível de atividade da equipe', humanizeTeamActivity(act))
  const fol = readString(answers, 'follow_up_frequency')
  if (fol) push('Frequência de acompanhamento', humanizeFollowupFrequency(fol))

  const tools = readTools(answers)
  if (tools) push('Ferramentas que usa', tools)

  push('Objetivo principal (30 dias)', readString(answers, 'primary_goal'))
  push('Como saberá que atingiu o objetivo', readString(answers, 'primary_goal_measure'))
  push('Maior desafio hoje', readString(answers, 'main_challenge'))

  push('Gargalo da equipe', readString(answers, 'team_bottleneck_line'))

  push('Notas / contexto extra', readString(answers, 'focus_notes'))

  return rows
}
