/** Deteção do MODELO VISUAL do Noel Pro Líderes (rascunho) ainda sem `### Quiz e link (oficial)`. */

function stripAccentsForQuizDraft(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '')
}

/**
 * True quando o texto segue o rascunho (título ou gancho + perguntas + CTA) e ainda não há bloco oficial de link.
 * Usado no chat (botões «gerar link») e no pipeline `interpret` (aprovação curta).
 */
export function assistantContentIsProLideresQuizDraftNoOfficialLink(content: string): boolean {
  const raw = (content || '').trim()
  if (!raw) return false
  const flat = stripAccentsForQuizDraft(raw).toLowerCase()

  const temCabecaFluxo =
    flat.includes('### titulo do fluxo') ||
    flat.includes('### texto na primeira tela') ||
    flat.includes('### texto na primeira') ||
    /\bt[ií]tulo\s+do\s+fluxo\b/.test(flat) ||
    /\btexto\s+na\s+primeira\s+tela\b/.test(flat)

  const temPerguntas =
    flat.includes('### pergunta 1') ||
    /\#\#\#\s*pergunta\s*\d/.test(flat) ||
    (flat.includes('### pergunta') && /[a-d]\)\s+/.test(flat)) ||
    (/\bpergunta\s+1\b/.test(flat) && /[a-d]\)\s+/.test(flat))

  const temCta =
    flat.includes('### cta whatsapp') ||
    /\#\#\#\s*cta\b/.test(flat) ||
    flat.includes('cta whatsapp')

  const jaLinkOficial =
    flat.includes('### quiz e link (oficial)') ||
    flat.includes('[link gerado') ||
    flat.includes('link gerado agora')

  return temCabecaFluxo && temPerguntas && temCta && !jaLinkOficial
}
