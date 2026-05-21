import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import {
  ingestInboundMessage,
  generateCarolReply,
  processMessage,
  type CarolInboundPayload,
  type IngestInboundResult,
} from '@/lib/carol/processor'
import { sendWhatsAppMessage } from '@/lib/carol/sender'
import { transcribeWhatsAppAudio } from '@/lib/carol/transcriber'
import { parseInteractiveMessage } from '@/lib/carol/parse-interactive'

/** Carol demora ~15s + OpenAI — precisa de background confiável na Vercel */
export const maxDuration = 60

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

function scheduleCarolReply(ingest: Extract<IngestInboundResult, { status: 'saved' }>): void {
  waitUntil(
    generateCarolReply(ingest).catch((err) => {
      console.error(`[Carol Webhook] Erro no processamento de ${ingest.payload.from}:`, err)
    })
  )
}

async function handleTextInbound(payload: CarolInboundPayload): Promise<void> {
  const ingest = await ingestInboundMessage(payload)
  if (ingest.status !== 'saved') return
  scheduleCarolReply(ingest)
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

    if (body.object !== 'whatsapp_business_account') {
      return new NextResponse('OK', { status: 200 })
    }

    let messageCount = 0

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'messages') continue

        const messages = change.value?.messages ?? []
        const statuses = change.value?.statuses ?? []

        if (statuses.length > 0 && messages.length === 0) {
          continue
        }

        for (const message of messages) {
          messageCount++
          const from = message.from
          const base = {
            from,
            messageId: message.id,
            timestamp: message.timestamp,
          }

          if (message.type === 'text') {
            console.log(`[Carol Webhook] Texto de ${from}: ${message.text.body}`)
            await handleTextInbound({
              ...base,
              text: message.text.body,
            })

          } else if (message.type === 'sticker') {
            console.log(`[Carol Webhook] Figurinha de ${from}`)
            await handleTextInbound({
              ...base,
              text: '[a pessoa enviou uma figurinha]',
            })

          } else if (message.type === 'audio') {
            console.log(`[Carol Webhook] Áudio de ${from}`)
            waitUntil(
              (async () => {
                try {
                  const transcribed = await transcribeWhatsAppAudio(message.audio.id)
                  await processMessage({ ...base, text: transcribed })
                } catch (transcribeError) {
                  console.error(`[Carol] Erro ao transcrever áudio de ${from}:`, transcribeError)
                  await sendWhatsAppMessage(
                    from,
                    'Recebi seu áudio, mas tive dificuldade de processar 😊\nPode digitar o que queria me dizer?'
                  )
                }
              })()
            )

          } else if (message.type === 'interactive' && message.interactive?.type === 'nfm_reply') {
            const responseJson = message.interactive.nfm_reply?.response_json || '{}'
            const flowSummary = parseFlowResponse(responseJson)
            await handleTextInbound({
              ...base,
              text: flowSummary,
              isFlowResponse: true,
            })

          } else if (
            message.type === 'interactive' &&
            (message.interactive?.type === 'button_reply' ||
              message.interactive?.type === 'list_reply')
          ) {
            const parsed = parseInteractiveMessage(message.interactive)
            if (parsed) {
              await handleTextInbound({ ...base, text: parsed })
            }

          } else if (['image', 'video', 'document'].includes(message.type)) {
            waitUntil(
              sendWhatsAppMessage(
                from,
                'Recebi! Mas ainda não consigo visualizar arquivos por aqui 😊\nPode me descrever o que queria mostrar?'
              ).catch((err) => console.error(`[Carol] Erro ao responder arquivo de ${from}:`, err))
            )

          } else {
            console.log(`[Carol Webhook] Tipo não tratado (${message.type}) de ${from}`)
          }
        }
      }
    }

    if (messageCount > 0) {
      console.log(`[Carol Webhook] POST OK — ${messageCount} mensagem(ns) recebida(s)`)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('[Carol Webhook] Erro ao processar mensagem:', error)
    return new NextResponse('OK', { status: 200 })
  }
}
