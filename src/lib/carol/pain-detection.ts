export type PainHypothesis = 'a' | 'b' | 'c'

export function detectPainFromText(
  text: string
): { hipotese: PainHypothesis; label: string } | null {
  const t = text.toLowerCase()
  const button = text.match(/\[botão:\s*(.+?)\]/i)
  const source = (button?.[1] || text).toLowerCase()

  if (
    /agenda.*oscil|oscil.*agenda|semanas? cheias?.*vazias?|buracos? na agenda|dor_agenda/.test(
      source
    )
  ) {
    return { hipotese: 'a', label: 'Agenda oscila' }
  }
  if (
    /sozinha|sozinho|faço tudo|faco tudo|cansa|burnout|acúmulo|acumulo|dor_burnout/.test(
      source
    )
  ) {
    return { hipotese: 'b', label: 'Faz tudo sozinha / cansaço' }
  }
  if (
    /lucro|faturamento|não cresce|nao cresce|não sobra|nao sobra|dinheiro|dor_faturamento/.test(
      source
    )
  ) {
    return { hipotese: 'c', label: 'Lucro / faturamento não cresce' }
  }

  if (button && /oscil/i.test(t)) return { hipotese: 'a', label: button[1].trim() }
  if (button && /sozinha|cansa/i.test(t)) return { hipotese: 'b', label: button[1].trim() }
  if (button && /lucro|cresce/i.test(t)) return { hipotese: 'c', label: button[1].trim() }

  return null
}

/** Resposta instantânea após clique no botão — sem OpenAI (mais rápido e consistente). */
export function getDeterministicPainReply(
  hipotese: PainHypothesis,
  nomeNegocio?: string | null
): string {
  switch (hipotese) {
    case 'a':
      return nomeNegocio
        ? `Entendi! Na ${nomeNegocio}, a agenda oscila todo mês ou tem épocas que pioram mais?`
        : 'Me conta — é todo mês que oscila ou tem épocas piores?'
    case 'b':
      return 'Quanto tempo você já tá nesse ritmo fazendo tudo sozinha?'
    case 'c':
      return 'Sua agenda costuma estar cheia quando isso acontece, ou oscila também?'
  }
}

export function isPainButtonMessage(text: string): boolean {
  return /\[botão:/i.test(text)
}
