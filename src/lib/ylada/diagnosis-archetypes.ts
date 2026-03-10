/**
 * Archetypes de diagnóstico — 5 tipos gerados por IA, entregues por regras.
 * @see docs/LINKS-INTELIGENTES-ARQUETIPOS-IA.md
 */
import type { DiagnosisDecisionOutput } from './diagnosis-types'
import type { RiskLevel } from './diagnosis-types'
import type { BlockerType } from './diagnosis-types'
import { fillSlots } from './diagnosis-templates'

export type ArchetypeCode =
  | 'leve'
  | 'moderado'
  | 'urgente'
  | 'bloqueio_pratico'
  | 'bloqueio_emocional'

/** Mapeia level (RISK) ou blocker (BLOCKER) para archetype. */
export function getArchetypeCode(
  level?: RiskLevel,
  blockerType?: BlockerType
): ArchetypeCode {
  if (level) {
    if (level === 'baixo') return 'leve'
    if (level === 'medio') return 'moderado'
    if (level === 'alto') return 'urgente'
  }
  if (blockerType) {
    if (blockerType === 'emocional' || blockerType === 'expectativa') return 'bloqueio_emocional'
    return 'bloqueio_pratico'
  }
  return 'moderado'
}

/** Preenche slots {THEME}, {NAME}, {BLOCKER} no conteúdo do archetype. */
export function fillArchetypeSlots(
  content: Record<string, unknown>,
  slots: { THEME?: string; NAME?: string }
): DiagnosisDecisionOutput {
  const theme = (slots.THEME ?? '').trim() || 'seu perfil'
  const name = (slots.NAME ?? '').trim() || 'quem te enviou'
  const filled = { ...slots, THEME: theme, NAME: name }

  const fill = (v: unknown): string => {
    if (typeof v !== 'string') return ''
    return fillSlots(v, filled)
  }

  const mainBlockerFilled = fill(content.main_blocker)
  const filledWithBlocker = { ...filled, BLOCKER: mainBlockerFilled }

  const fillWithBlocker = (v: unknown): string => {
    if (typeof v !== 'string') return ''
    return fillSlots(v, filledWithBlocker)
  }

  const actions = Array.isArray(content.specific_actions)
    ? content.specific_actions.map((a) => fill(a)).filter(Boolean)
    : undefined

  let whatsappPrefill = fillWithBlocker(content.whatsapp_prefill)
  // Sanitizar: IA às vezes gera "Oi aí" — no WhatsApp a pessoa fala COM o profissional, não "com quem te enviou"
  if (whatsappPrefill && /oi\s+aí\b/i.test(whatsappPrefill)) {
    whatsappPrefill = whatsappPrefill.replace(/oi\s+aí\b/gi, 'Oi')
  }
  // No WhatsApp: "Oi quem te enviou" não faz sentido — a pessoa já está falando com o profissional
  if (whatsappPrefill && /oi\s+quem te enviou\b/i.test(whatsappPrefill)) {
    whatsappPrefill = whatsappPrefill.replace(/oi\s+quem te enviou\b/gi, 'Oi')
  }

  return {
    profile_title: fill(content.profile_title),
    profile_summary: fill(content.profile_summary),
    main_blocker: fill(content.main_blocker),
    ...(content.causa_provavel && { causa_provavel: fill(content.causa_provavel) }),
    ...(content.preocupacoes && { preocupacoes: fill(content.preocupacoes) }),
    ...(content.espelho_comportamental && { espelho_comportamental: fill(content.espelho_comportamental) }),
    consequence: fill(content.consequence),
    growth_potential: fill(content.growth_potential),
    ...(actions?.length && { specific_actions: actions }),
    ...(content.dica_rapida && { dica_rapida: fill(content.dica_rapida) }),
    ...(content.frase_identificacao && { frase_identificacao: fill(content.frase_identificacao) }),
    cta_text: fill(content.cta_text),
    whatsapp_prefill: whatsappPrefill,
  }
}
