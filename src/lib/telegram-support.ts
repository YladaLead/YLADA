/**
 * Alertas de suporte via Telegram Bot API.
 * Configure TELEGRAM_BOT_TOKEN e TELEGRAM_SUPPORT_CHAT_ID (seu chat com o bot).
 */

export function isTelegramSupportConfigured(): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_SUPPORT_CHAT_ID?.trim()
  )
}

export async function sendTelegramSupportMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_SUPPORT_CHAT_ID?.trim()
  if (!token || !chatId) {
    return false
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`
  const body = {
    chat_id: chatId,
    text: text.slice(0, 4000),
    disable_web_page_preview: false,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    console.error('[Telegram Support] Falha ao enviar:', res.status, errText)
    return false
  }

  return true
}
