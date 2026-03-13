/**
 * Identifica o(s) perfil(is) estratégico(s) mais provável(eis) a partir da mensagem do profissional.
 * Usado para personalizar a orientação do Noel (biblioteca de perfis).
 *
 * Fluxo: pergunta → detectar perfil (top 2) → buscar estratégias filtradas por perfil → conversas → orientação personalizada.
 * Pesos por palavra-chave: match mais forte aumenta score (ex.: "agenda vazia" peso 3).
 */

import {
  NOEL_STRATEGIC_PROFILES,
  PROFILE_KEYWORDS_WEIGHTED,
  type NoelStrategicProfile,
} from '@/config/noel-strategic-profiles'

const MIN_SCORE = 1
const TOP_N_PROFILES = 2

/**
 * Retorna os top 2 perfis que melhor correspondem à mensagem (por palavras-chave com peso).
 * Retorna array vazio se nenhum perfil atingir o score mínimo.
 */
export function getStrategicProfilesForMessage(message: string): NoelStrategicProfile[] {
  const lower = message.toLowerCase().trim()
  if (!lower) return []

  const scored: Array<{ profile: NoelStrategicProfile; score: number }> = []

  for (const profile of NOEL_STRATEGIC_PROFILES) {
    const keywords = PROFILE_KEYWORDS_WEIGHTED[profile.profile_code]
    if (!keywords?.length) continue

    let score = 0
    for (const { keyword, weight } of keywords) {
      if (lower.includes(keyword.toLowerCase())) score += weight
    }

    if (score >= MIN_SCORE) {
      scored.push({ profile, score })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, TOP_N_PROFILES).map((s) => s.profile)
}

/**
 * Retorna o primeiro perfil (compatibilidade com chamadas que esperam 1 perfil).
 * @deprecated Preferir getStrategicProfilesForMessage e usar top 2 no prompt.
 */
export function getStrategicProfileForMessage(message: string): NoelStrategicProfile | null {
  const profiles = getStrategicProfilesForMessage(message)
  return profiles[0] ?? null
}

/**
 * Formata um ou mais perfis para injetar no prompt (bloco "Perfil estratégico identificado").
 */
export function formatStrategicProfileForPrompt(profileOrProfiles: NoelStrategicProfile | NoelStrategicProfile[]): string {
  const profiles = Array.isArray(profileOrProfiles) ? profileOrProfiles : [profileOrProfiles]
  if (profiles.length === 0) return ''

  return profiles
    .map((profile, i) => {
      const prefix = profiles.length > 1 ? `[Perfil ${i + 1}] ` : ''
      return [
        `${prefix}Perfil: ${profile.profile_title}`,
        `Descrição: ${profile.description}`,
        `Bloqueio principal: ${profile.main_blocker}`,
        `Foco estratégico: ${profile.strategic_focus}`,
        `Ação recomendada: ${profile.recommended_action}`,
      ].join('\n')
    })
    .join('\n\n')
}
