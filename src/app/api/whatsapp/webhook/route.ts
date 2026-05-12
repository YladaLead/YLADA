import { NextRequest, NextResponse } from 'next/server'
import { processMessage } from '@/lib/carol/processor'

// Verificação do webhook pelo Meta
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('[Carol Webhook] Verificação OK')
    return new NextResponse(challenge, { status: 200 })
  }

  console.warn('[Carol Webhook] Verificação falhou — token inválido')
  return new NextResponse('Forbidden', { status: 403 })
}

// Recebe mensagens do WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const messages = change.value.messages || []
            const statuses = change.value.statuses || []

            // Ignora atualizações de status (entregue, lido, etc)
            if (statuses.length > 0 && messages.length === 0) {
              continue
            }

            for (const message of messages) {
              if (message.type === 'text') {
                console.log(`[Carol] Mensagem recebida de ${message.from}: ${message.text.body}`)
                await processMessage({
                  from: message.from,
                  text: message.text.body,
                  messageId: message.id,
                  timestamp: message.timestamp,
                })
              }
            }
          }
        }
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('[Carol Webhook] Erro ao processar mensagem:', error)
    // Sempre retorna 200 pro Meta (senão ele fica tentando reenviar)
    return new NextResponse('OK', { status: 200 })
  }
}
