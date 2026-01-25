import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { generateCarolResponse, formatSessionDateTime } from '@/lib/whatsapp-carol-ai'

/**
 * POST /api/admin/whatsapp/carol/processar-especificos
 * Processa pessoas específicas para fechamento (quem participou) ou remarketing (quem não participou)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { telefones, tipo } = body // tipo: 'fechamento' ou 'remarketing'

    if (!telefones || !Array.isArray(telefones) || telefones.length === 0) {
      return NextResponse.json(
        { error: 'Lista de telefones é obrigatória' },
        { status: 400 }
      )
    }

    if (!tipo || !['fechamento', 'remarketing'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo deve ser "fechamento" ou "remarketing"' },
        { status: 400 }
      )
    }

    const area = 'nutri'

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada' },
        { status: 500 }
      )
    }

    // Buscar próximas sessões para remarketing
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    const client = createZApiClient({
      instanceId: instance.instance_id,
      token: instance.token,
    })

    const results: Array<{ phone: string; name: string; success: boolean; error?: string }> = []

    // Processar cada telefone
    for (const phone of telefones) {
      try {
        // Limpar telefone (remover caracteres não numéricos)
        const phoneClean = phone.replace(/\D/g, '')

        // Buscar conversa
        const { data: conversation } = await supabaseAdmin
          .from('whatsapp_conversations')
          .select('id, phone, name, context')
          .eq('area', area)
          .eq('status', 'active')
          .or(`phone.eq.${phoneClean},phone.like.%${phoneClean.slice(-8)}%`)
          .limit(1)
          .maybeSingle()

        if (!conversation) {
          results.push({
            phone: phoneClean,
            name: 'Não encontrado',
            success: false,
            error: 'Conversa não encontrada',
          })
          continue
        }

        const context = conversation.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []

        // Buscar histórico de mensagens
        const { data: messages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('message, sender_type, created_at')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })
          .limit(20)

        const conversationHistory = (messages || []).map((msg: any) => ({
          role: msg.sender_type === 'bot' ? 'assistant' : 'user',
          content: msg.message,
        }))

        let messageToSend = ''

        if (tipo === 'fechamento') {
          // Mensagem de fechamento para quem participou
          messageToSend = await generateCarolResponse(
            'Quero saber mais sobre o programa completo',
            conversationHistory,
            {
              tags: [...tags, 'participou_aula'],
              leadName: conversation.name || undefined,
              participated: true,
              isFirstMessage: false,
            }
          )
        } else {
          // Mensagem de remarketing para quem não participou
          // Primeiro pergunta se ainda tem interesse, focando na DOR (encher agenda), SEM enviar datas ainda
          messageToSend = await generateCarolResponse(
            'Você ainda tem interesse em aprender como encher sua agenda? Quer saber como ter mais clientes?',
            conversationHistory,
            {
              tags: [...tags, 'nao_participou_aula'],
              leadName: conversation.name || undefined,
              hasScheduled: false,
              participated: false,
              isFirstMessage: false,
            }
          )
          
          // Se a mensagem não menciona interesse ou pergunta, adicionar contexto focado na dor
          if (!messageToSend.toLowerCase().includes('interesse') && !messageToSend.toLowerCase().includes('?')) {
            messageToSend = `Olá ${conversation.name || 'querido(a)'}! 👋

Vi que você não conseguiu participar da aula anterior. Tudo bem, acontece! 😊

Você ainda tem interesse em aprender como encher sua agenda? Você realmente quer saber como ter mais clientes?

Se sim, me avise que eu passo as datas das próximas aulas disponíveis! 💚

Carol - Secretária YLADA Nutri`
          }
        }

        // Enviar mensagem
        const result = await client.sendTextMessage({
          phone: conversation.phone,
          message: messageToSend,
        })

        if (result.success) {
          // Salvar mensagem
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conversation.id,
            instance_id: instance.id,
            z_api_message_id: result.id || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: messageToSend,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true,
          })

          // Atualizar contexto
          const newTags = tipo === 'fechamento'
            ? [...new Set([...tags, 'participou_aula', 'fechamento_enviado'])]
            : [...new Set([...tags, 'nao_participou_aula', 'remarketing_enviado'])]

          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                tags: newTags,
                [`${tipo}_sent_at`]: new Date().toISOString(),
              },
              last_message_at: new Date().toISOString(),
              last_message_from: 'bot',
            })
            .eq('id', conversation.id)

          results.push({
            phone: conversation.phone,
            name: conversation.name || 'Sem nome',
            success: true,
          })
        } else {
          results.push({
            phone: conversation.phone,
            name: conversation.name || 'Sem nome',
            success: false,
            error: result.error || 'Erro ao enviar mensagem',
          })
        }

        // Delay entre mensagens
        await new Promise(resolve => setTimeout(resolve, 2500))
      } catch (error: any) {
        results.push({
          phone: phone,
          name: 'Erro',
          success: false,
          error: error.message || 'Erro desconhecido',
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      processed: results.length,
      sent: successCount,
      errors: errorCount,
      results,
    })
  } catch (error: any) {
    console.error('[Processar Específicos] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar' },
      { status: 500 }
    )
  }
}
