/**
 * Tom das mensagens (preset) guardado em `leader_tenants.message_tone` — formulário perfil Pro Estética Corporal + Noel.
 */
export const ESTETICA_MESSAGE_TONE_OPTIONS = [
  {
    id: 'profissional' as const,
    label: 'Profissional e clara',
    hint: 'Clara para clientes sem ser fria.',
  },
  {
    id: 'acolhedor' as const,
    label: 'Próxima e acolhedora',
    hint: 'Quente, convite e confiança.',
  },
  {
    id: 'direto' as const,
    label: 'Direta ao ponto',
    hint: 'Frases curtas, pouca enrolação.',
  },
  {
    id: 'sofisticado' as const,
    label: 'Sofisticada / premium',
    hint: 'Vocabulário mais selecionado, sem ser arrogante.',
  },
] as const

export type EsteticaMessageToneId = (typeof ESTETICA_MESSAGE_TONE_OPTIONS)[number]['id']

const TONE_IDS_SET = new Set<string>(ESTETICA_MESSAGE_TONE_OPTIONS.map((o) => o.id))

export function isEsteticaMessageToneId(value: unknown): value is EsteticaMessageToneId {
  return typeof value === 'string' && TONE_IDS_SET.has(value)
}

/** Instrução curta para o system prompt (Noel). */
export function instructionForEsteticaMessageTone(id: EsteticaMessageToneId | null): string {
  switch (id) {
    case 'profissional':
      return 'Tom **profissional e claro**: educada, confiável e acessível, sem gírias fortes nem excesso de emojis.'
    case 'acolhedor':
      return 'Tom **próximo e acolhedor**: parece conversa gentil entre profissionais, humano sem ser informal demais.'
    case 'direto':
      return 'Tom **direto**: frases objetivas e curtas nos scripts; ir ao ponto sem ser seco nem ríspido.'
    case 'sofisticado':
      return 'Tom **sofisticado**: vocabulário cuidadoso e premium, discreto, sem slang nem tom de pressa.'
    default:
      return ''
  }
}
