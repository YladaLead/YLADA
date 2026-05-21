export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  variables: string[] = []
): Promise<void> {
  const phoneId = process.env.WHATSAPP_PHONE_ID
  const token = process.env.WHATSAPP_TOKEN

  if (!phoneId || !token) {
    throw new Error('[Carol] WHATSAPP_PHONE_ID ou WHATSAPP_TOKEN não configurados')
  }

  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`

  const components =
    variables.length > 0
      ? [
          {
            type: 'body',
            parameters: variables.map((v) => ({ type: 'text', text: v })),
          },
        ]
      : []

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'pt_BR' },
        components,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('[Carol] Erro ao enviar template WhatsApp:', error)
    throw new Error(`Falha ao enviar template: ${JSON.stringify(error)}`)
  }

  const result = await response.json()
  console.log(`[Carol] Template "${templateName}" enviado para ${to}:`, result.messages?.[0]?.id)
}

export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const phoneId = process.env.WHATSAPP_PHONE_ID
  const token = process.env.WHATSAPP_TOKEN

  if (!phoneId || !token) {
    throw new Error('[Carol] WHATSAPP_PHONE_ID ou WHATSAPP_TOKEN não configurados')
  }

  const url = `https://graph.facebook.com/v21.0/${phoneId}/messages`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('[Carol] Erro ao enviar mensagem WhatsApp:', error)
    throw new Error(`Falha ao enviar mensagem: ${JSON.stringify(error)}`)
  }

  const result = await response.json()
  console.log(`[Carol] Mensagem enviada para ${to}:`, result.messages?.[0]?.id)
}
