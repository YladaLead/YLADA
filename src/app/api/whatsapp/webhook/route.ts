import { NextRequest, NextResponse, unstable_after as after } from 'next/server'
import { processMessage } from '@/lib/carol/processor'
import { sendWhatsAppMessage } from '@/lib/carol/sender'
import { transcribeWhatsAppAudio } from '@/lib/carol/transcriber'
import { parseInteractiveMessage } from '@/lib/carol/parse-interactive'

// Interpreta as respostas do WhatsApp Flow e retorna texto legível para a Carol
function parseFlowResponse(responseJson: string): string {
  try {
    const data = JSON.parse(responseJson)

    // Mapeia IDs internos para texto legível
    const labels: Record<string, string> = {
      // Q1 — resultado vs esforço
      raramente: 'Raramente',
      as_vezes: 'Às vezes',
      sempre: 'Sempre',
      // Q2 — principal desafio
      agenda_oscila: 'Agenda oscila entre cheia e vazia',
      faz_tudo_sozinha: 'Faz tudo sozinha e não consegue crescer',
      cobra_bem: 'Cobra bem mas no fim do mês não sobra nada',
      crescendo: 'Está crescendo mas quer acelerar',
      // Q3 — tempo no problema
      mais_2anos: 'Mais de 2 anos',
      seis_a_2anos: 'Entre 6 meses e 2 anos',
      menos_6meses: 'Menos de 6 meses',
      // Q4 — clareza de direção
      nao_sei: 'Não tem ideia por onde começar',
      tem_ideias: 'Tem ideias mas não sabe executar',
      sabe_mas_nao: 'Sabe o que precisa mudar mas não consegue colocar em prática',
      tem_plano: 'Tem um plano claro e está executando',
    }

    const fmt = (v: string) => labels[v] || v

    const lines: string[] = ['[FLOW_DIAGNÓSTICO_COMPLETO]']
    if (data.resultado_esforco)
      lines.push(`Resultado reflete esforço: ${fmt(data.resultado_esforco)}`)
    if (data.desafio_principal)
      lines.push(`Principal desafio: ${fmt(data.desafio_principal)}`)
    if (data.tempo_problema)
      lines.push(`Tempo enfrentando o problema: ${fmt(data.tempo_problema)}`)
    if (data.clareza_direcao)
      lines.push(`Clareza de direção: ${fmt(data.clareza_direcao)}`)

    return lines.join('\n')
  } catch {
    return '[FLOW_DIAGNÓSTICO_COMPLETO]\nDados recebidos mas não foi possível interpretar.'
  }
}

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
      // Retorna 200 imediatamente pro Meta — processamento acontece em background
      // Isso evita timeout do Meta (20s) e permite delay humano de 15s na resposta
      after(async () => {
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

                } else if (message.type === 'interactive' && message.interactive?.type === 'nfm_reply') {
                  // Resposta de WhatsApp Flow (diagnóstico de 4 perguntas)
                  console.log(`[Carol] Flow completado por ${from}`)
                  const responseJson = message.interactive.nfm_reply?.response_json || '{}'
                  const flowSummary = parseFlowResponse(responseJson)
                  console.log(`[Carol] Flow data de ${from}:`, flowSummary)
                  await processMessage({
                    from,
                    text: flowSummary,
                    messageId: message.id,
                    timestamp: message.timestamp,
                    isFlowResponse: true,
                  })

                } else if (
                  message.type === 'interactive' &&
                  (message.interactive?.type === 'button_reply' ||
                    message.interactive?.type === 'list_reply')
                ) {
                  const parsed = parseInteractiveMessage(message.interactive)
                  if (parsed) {
                    console.log(`[Carol] Interativo (${message.interactive.type}) de ${from}: ${parsed}`)
                    await processMessage({
                      from,
                      text: parsed,
                      messageId: message.id,
                      timestamp: message.timestamp,
                    })
                  } else {
                    console.log(`[Carol] Interativo vazio de ${from} — ignorando`)
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
      })
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('[Carol Webhook] Erro ao processar mensagem:', error)
    // Sempre retorna 200 pro Meta (senão ele fica tentando reenviar)
    return new NextResponse('OK', { status: 200 })
  }
}
