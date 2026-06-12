/** Reduz ruído no histórico enviado ao LLM (menos tokens, menos confusão). */
export function compactHistoryForPrompt(
  history: Array<{ role: string; content: string }>
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const out: Array<{ role: 'user' | 'assistant'; content: string }> = []

  for (const m of history) {
    const role = m.role === 'assistant' ? 'assistant' : 'user'
    let content = m.content

    if (content.includes('[SISTEMA: notify_andre:')) continue
    if (content.startsWith('[SISTEMA: Diagnóstico agendado')) continue

    if (content.startsWith('[TEMPLATE OUTBOUND:')) {
      out.push({ role: 'assistant', content: '[sistema: template pesquisa agenda enviado]' })
      continue
    }
    if (content.startsWith('[auto-resposta ignorada]')) {
      out.push({ role: 'user', content: '[sistema: bot automático da clínica — ignorado]' })
      continue
    }
    if (content.startsWith('[botões enviados')) {
      out.push({
        role: 'assistant',
        content: '[sistema: Carol ofereceu 3 opções de dor]',
      })
      continue
    }
    if (content.startsWith('[SISTEMA:')) continue
    if (content.startsWith('[ANDRE]')) continue

    out.push({ role, content })
  }

  return out
}
