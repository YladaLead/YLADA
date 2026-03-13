/**
 * Identifica o perfil do profissional a partir da mensagem e das situações já detectadas.
 * Fluxo: Mensagem → SITUAÇÃO (strategic-profile-matcher) → PERFIL do profissional (este matcher) → biblioteca.
 *
 * O perfil do profissional orienta estratégia e próximo movimento, não só a situação atual.
 */

import {
  NOEL_PROFESSIONAL_PROFILES,
  SITUATION_TO_PROFESSIONAL_PROFILE,
  PROFESSIONAL_PROFILE_KEYWORDS,
  type NoelProfessionalProfile,
} from '@/config/noel-professional-profiles'

const TOP_N_PROFILES = 2

/**
 * Retorna os perfis do profissional que melhor correspondem à mensagem e às situações detectadas.
 * Prioridade: 1) keywords na mensagem; 2) mapeamento situação → perfil.
 */
export function getProfessionalProfilesForMessage(
  message: string,
  situationCodes: string[]
): NoelProfessionalProfile[] {
  const lower = message.toLowerCase().trim()

  // 1) Tentar match por keywords na mensagem
  const keywordMatches: NoelProfessionalProfile[] = []
  for (const [profileCode, keywords] of Object.entries(PROFESSIONAL_PROFILE_KEYWORDS)) {
    const hasMatch = keywords.some((kw) => lower.includes(kw.toLowerCase()))
    if (hasMatch) {
      const profile = NOEL_PROFESSIONAL_PROFILES.find((p) => p.profile_code === profileCode)
      if (profile) keywordMatches.push(profile)
    }
  }
  if (keywordMatches.length > 0) {
    return keywordMatches.slice(0, TOP_N_PROFILES)
  }

  // 2) Derivar da situação (top 1 ou 2 situações)
  const derived: NoelProfessionalProfile[] = []
  const seen = new Set<string>()
  for (const sitCode of situationCodes.slice(0, 2)) {
    const profCode = SITUATION_TO_PROFESSIONAL_PROFILE[sitCode]
    if (profCode && !seen.has(profCode)) {
      const profile = NOEL_PROFESSIONAL_PROFILES.find((p) => p.profile_code === profCode)
      if (profile) {
        derived.push(profile)
        seen.add(profCode)
      }
    }
  }
  if (derived.length > 0) {
    return derived.slice(0, TOP_N_PROFILES)
  }

  return []
}

/**
 * Retorna o primeiro perfil do profissional (compatibilidade).
 */
export function getProfessionalProfileForMessage(
  message: string,
  situationCodes: string[]
): NoelProfessionalProfile | null {
  const profiles = getProfessionalProfilesForMessage(message, situationCodes)
  return profiles[0] ?? null
}

/**
 * Formata um ou mais perfis do profissional para injetar no prompt.
 */
export function formatProfessionalProfileForPrompt(
  profileOrProfiles: NoelProfessionalProfile | NoelProfessionalProfile[]
): string {
  const profiles = Array.isArray(profileOrProfiles) ? profileOrProfiles : [profileOrProfiles]
  if (profiles.length === 0) return ''

  return profiles
    .map((profile, i) => {
      const prefix = profiles.length > 1 ? `[Perfil ${i + 1}] ` : ''
      return [
        `${prefix}Perfil: ${profile.profile_title}`,
        `Descrição: ${profile.description}`,
        `Próximo movimento recomendado: ${profile.next_move}`,
      ].join('\n')
    })
    .join('\n\n')
}
