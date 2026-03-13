/**
 * Persiste o diagnóstico da conversa quando o Noel responde.
 * Parte do sistema de 3 diagnósticos: profissional, cliente, conversa.
 */

import { supabaseAdmin } from '@/lib/supabase'
import type { StrategyRow } from './noel-library-context'
import { NOEL_STRATEGIC_PROFILES } from '@/config/noel-strategic-profiles'
import { NOEL_PROFESSIONAL_PROFILES } from '@/config/noel-professional-profiles'

const MAX_MESSAGE_LENGTH = 2000
const MAX_RESPONSE_LENGTH = 3000

export interface SaveConversationDiagnosisParams {
  userId: string
  segment: string
  userMessage: string
  assistantResponse: string
  situationCodes: string[]
  professionalProfileCodes: string[]
  objectiveCodes: string[]
  funnelStageCodes: string[]
  strategies: StrategyRow[]
}

/**
 * Deriva bloqueio legível dos códigos detectados ou da estratégia.
 */
function deriveBloqueio(
  situationCodes: string[],
  professionalProfileCodes: string[],
  strategies: StrategyRow[]
): string | null {
  const situationCode = situationCodes[0]
  if (situationCode) {
    const strategic = NOEL_STRATEGIC_PROFILES.find((p) => p.profile_code === situationCode)
    if (strategic?.main_blocker) return strategic.main_blocker
  }
  const profCode = professionalProfileCodes[0]
  if (profCode) {
    const prof = NOEL_PROFESSIONAL_PROFILES.find((p) => p.profile_code === profCode)
    if (prof) {
      const strategic = NOEL_STRATEGIC_PROFILES.find((p) => p.profile_code === prof.dominant_situation)
      if (strategic?.main_blocker) return strategic.main_blocker
    }
  }
  const s = strategies[0]
  if (s?.problem?.trim()) return s.problem.trim()
  if (s?.diagnostic_phrase?.trim()) return s.diagnostic_phrase.trim()
  return null
}

/**
 * Persiste o diagnóstico da conversa em ylada_noel_conversation_diagnosis.
 * Chamado após cada resposta do Noel quando há estratégia ou códigos detectados.
 */
export async function saveConversationDiagnosis(params: SaveConversationDiagnosisParams): Promise<void> {
  if (!supabaseAdmin) return

  const {
    userId,
    segment,
    userMessage,
    assistantResponse,
    situationCodes,
    professionalProfileCodes,
    objectiveCodes,
    funnelStageCodes,
    strategies,
  } = params

  const bloqueio = deriveBloqueio(situationCodes, professionalProfileCodes, strategies)
  const s = strategies[0]
  const estrategia = s?.explicacao?.trim() || s?.strategy?.trim() || null
  const exemplo = s?.example?.trim() || null

  const row = {
    user_id: userId,
    segment,
    user_message: userMessage.slice(0, MAX_MESSAGE_LENGTH),
    bloqueio,
    estrategia,
    exemplo,
    assistant_response: assistantResponse.slice(0, MAX_RESPONSE_LENGTH),
    situation_codes: situationCodes.length ? situationCodes : null,
    professional_profile_codes: professionalProfileCodes.length ? professionalProfileCodes : null,
    objective_codes: objectiveCodes.length ? objectiveCodes : null,
    funnel_stage_codes: funnelStageCodes.length ? funnelStageCodes : null,
  }

  const { error } = await supabaseAdmin
    .from('ylada_noel_conversation_diagnosis')
    .insert(row)

  if (error) console.warn('[Noel] saveConversationDiagnosis:', error)
}
