import { NextRequest, NextResponse } from 'next/server'
import { processMessage } from '@/lib/carol/processor'
import { sendWhatsAppMessage } from '@/lib/carol/sender'
import { transcribeWhatsAppAudio } from '@/lib/carol/transcriber'

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
              const from = message.from

              if (message.type === 'text') {
                console.log(`[Carol] Texto recebido de ${from}: ${message.text.body}`)
                await processMessage({
                  from,
                  text: message.text.body,
                  messageId: message.id,
                  timestamp: message.timestamp,
                })

              } else if (message.type === 'sticker') {
                console.log(`[Carol] Figurinha recebida de ${from}`)
                await processMessage({
                  from,
                  text: '[a pessoa enviou uma figurinha]',
                  messageId: message.id,
                  timestamp: message.timestamp,
                })

              } else if (message.type === 'audio') {
                console.log(`[Carol] Áudio recebido de ${from} — transcrevendo com Whisper...`)
                try {
                  const mediaId = message.audio.id
                  const transcribed = await transcribeWhatsAppAudio(mediaId)
                  console.log(`[Carol] Áudio transcrito de ${from}: ${transcribed}`)
                  await processMessage({
                    from,
                    text: transcribed,
                    messageId: message.id,
                    timestamp: message.timestamp,
                  })
                } catch (transcribeError) {
                  console.error(`[Carol] Erro ao transcrever áudio de ${from}:`, transcribeError)
                  await sendWhatsAppMessage(
                    from,
                    'Recebi seu áudio, mas tive dificuldade de processar 😊\nPode digitar o que queria me dizer?'
                  )
                }

              } else if (['image', 'video', 'document'].includes(message.type)) {
                console.log(`[Carol] Arquivo (${message.type}) recebido de ${from}`)
                await sendWhatsAppMessage(
                  from,
                  'Recebi! Mas ainda não consigo visualizar arquivos por aqui 😊\nPode me descrever o que queria mostrar?'
                )

              } else {
                console.log(`[Carol] Tipo não tratado (${message.type}) de ${from} — ignorando`)
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
