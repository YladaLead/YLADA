/** Resposta de botão/lista que a Carol enviou — sempre é a dona escolhendo, nunca bot da clínica */
export function isCarolInteractiveReply(text: string): boolean {
  const t = text.trim()
  return t.startsWith('[botão:') || t.startsWith('[lista:')
}

/** Converte respostas de botão/lista do WhatsApp em texto para a Carol */
export function parseInteractiveMessage(interactive: {
  type?: string
  button_reply?: { id?: string; title?: string }
  list_reply?: { id?: string; title?: string; description?: string }
}): string | null {
  if (interactive.type === 'button_reply' && interactive.button_reply) {
    const { id, title } = interactive.button_reply
    return title ? `[botão: ${title}]` : id ? `[botão id: ${id}]` : null
  }

  if (interactive.type === 'list_reply' && interactive.list_reply) {
    const { id, title, description } = interactive.list_reply
    const parts = [title, description].filter(Boolean)
    if (parts.length > 0) return `[lista: ${parts.join(', ')}]`
    return id ? `[lista id: ${id}]` : null
  }

  return null
}
