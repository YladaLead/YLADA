/** CTA típico de anúncio Meta (Click to WhatsApp). */
export function isMetaAdLeadMessage(text: string): boolean {
  const t = String(text || '').toLowerCase()
  const patterns = [
    'tenho interesse',
    'queria mais inform',
    'quero mais inform',
    'gostaria de mais inform',
    'mais informações',
    'mais informacoes',
    'quero saber mais',
    'gostaria de saber',
    'vi o anúncio',
    'vi o anuncio',
    'vi seu anúncio',
    'vi seu anuncio',
    'cliquei no anúncio',
    'cliquei no anuncio',
    'vim pelo anúncio',
    'vim pelo anuncio',
    'vim do anúncio',
    'vim do anuncio',
    'quero informações',
    'quero informacoes',
    'minha agenda oscila',
    'agenda oscila todo',
    'faço tudo sozinha',
    'faz tudo sozinha',
    'cansa demais',
    'trabalho muito e não sobra',
    'trabalho muito e nao sobra',
    'não sobra dinheiro',
    'nao sobra dinheiro',
    'meu faturamento não cresce',
    'meu faturamento nao cresce',
    'faturamento não cresce',
    'faturamento nao cresce',
  ]
  return patterns.some((p) => t.includes(p))
}

export function conversationHasAdLeadIntent(
  history: Array<{ role: string; content: string }>
): boolean {
  return history
    .filter((m) => m.role === 'user' && !m.content.startsWith('[auto-resposta ignorada]'))
    .some((m) => isMetaAdLeadMessage(m.content))
}
