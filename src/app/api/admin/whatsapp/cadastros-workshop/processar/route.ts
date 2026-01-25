import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { generateCarolResponse } from '@/lib/whatsapp-carol-ai'

// Função auxiliar para formatar data/hora
function formatSessionDateTime(startsAt: string): { weekday: string; date: string; time: string } {
  const date = new Date(startsAt)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  
  const formatter = new Intl.DateTimeFormat('pt-BR', options)
  const parts = formatter.formatToParts(date)
  
  const weekday = parts.find(p => p.type === 'weekday')?.value || ''
  const day = parts.find(p => p.type === 'day')?.value || ''
  const month = parts.find(p => p.type === 'month')?.value || ''
  const year = parts.find(p => p.type === 'year')?.value || ''
  const hour = parts.find(p => p.type === 'hour')?.value || ''
  const minute = parts.find(p => p.type === 'minute')?.value || ''
  
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    date: `${day}/${month}/${year}`,
    time: `${hour}:${minute}`
  }
}

/**
 * POST /api/admin/whatsapp/cadastros-workshop/processar
 * Processa cadastros selecionados: cria/atualiza conversas e envia mensagens da Carol
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { registrationIds } = body

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de cadastros são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada' },
        { status: 500 }
      )
    }

    const client = createZApiClient(instance.instance_id, instance.token)

    // Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    const workshopSessions = (sessions || []).map(s => ({
      id: s.id,
      title: s.title || 'Aula Prática ao Vivo',
      starts_at: s.starts_at,
      zoom_link: s.zoom_link
    }))

    // Buscar cadastros
    let registrations: any[] = []
    
    // Tentar workshop_inscricoes
    const { data: workshopRegs } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('*')
      .in('id', registrationIds)

    if (workshopRegs && workshopRegs.length > 0) {
      registrations = workshopRegs
    } else {
      // Fallback para contact_submissions
      const { data: contactRegs } = await supabaseAdmin
        .from('contact_submissions')
        .select('*')
        .in('id', registrationIds)

      if (contactRegs) {
        registrations = contactRegs
      }
    }

    let processed = 0
    let conversationsCreated = 0
    let messagesSent = 0
    let errors = 0
    const details: string[] = []

    // Processar cada cadastro
    for (const reg of registrations) {
      try {
        const phone = (reg.telefone || reg.phone || '').replace(/\D/g, '')
        if (!phone || phone.length < 10) {
          errors++
          details.push(`❌ ${reg.nome || reg.name || 'Sem nome'}: Telefone inválido`)
          continue
        }

        const name = reg.nome || reg.name || 'Cliente'
        const email = reg.email || reg.email_address || ''

        // Buscar ou criar conversa
        let conversationId: string | null = null
        
        const { data: existingConv } = await supabaseAdmin
          .from('whatsapp_conversations')
          .select('id, context')
          .eq('phone', phone)
          .eq('area', 'nutri')
          .eq('instance_id', instance.id)
          .maybeSingle()

        if (existingConv) {
          conversationId = existingConv.id
        } else {
          // Criar nova conversa
          const { data: newConv, error: createError } = await supabaseAdmin
            .from('whatsapp_conversations')
            .insert({
              instance_id: instance.id,
              phone,
              name,
              area: 'nutri',
              status: 'active',
              context: {
                tags: ['veio_aula_pratica', 'primeiro_contato'],
                source: 'workshop_registration'
              }
            })
            .select('id')
            .single()

          if (createError || !newConv) {
            errors++
            details.push(`❌ ${name}: Erro ao criar conversa - ${createError?.message || 'Erro desconhecido'}`)
            continue
          }

          conversationId = newConv.id
          conversationsCreated++
        }

        // Buscar contexto atual
        const { data: conv } = await supabaseAdmin
          .from('whatsapp_conversations')
          .select('context')
          .eq('id', conversationId)
          .single()

        const context = conv?.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        
        // Adicionar tags se não existirem
        const newTags = [...new Set([...tags, 'veio_aula_pratica', 'primeiro_contato'])]

        // Verificar se já tem mensagem da Carol
        const { data: existingMessages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'bot')
          .eq('sender_name', 'Carol - Secretária')
          .limit(1)

        // Se não tem mensagem, enviar boas-vindas
        if (!existingMessages || existingMessages.length === 0) {
          const message = await generateCarolResponse(
            'Olá, quero agendar uma aula',
            [],
            {
              tags: newTags,
              workshopSessions,
              leadName: name,
              isFirstMessage: true
            }
          )

          const result = await client.sendTextMessage({
            phone,
            message
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conversationId,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true
            })

            messagesSent++
            details.push(`✅ ${name}: Mensagem enviada`)
          } else {
            errors++
            details.push(`❌ ${name}: Erro ao enviar mensagem - ${result.error}`)
          }
        } else {
          details.push(`ℹ️ ${name}: Já tem mensagem da Carol`)
        }

        // Atualizar tags e contexto
        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            context: { ...context, tags: newTags },
            last_message_at: new Date().toISOString(),
            last_message_from: 'bot'
          })
          .eq('id', conversationId)

        processed++

        // Delay entre processamentos
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error: any) {
        errors++
        details.push(`❌ ${reg.nome || reg.name || 'Desconhecido'}: ${error.message}`)
        console.error(`[Processar Cadastros] Erro ao processar ${reg.id}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      conversationsCreated,
      messagesSent,
      errors,
      details: details.slice(0, 100).join('\n')
    })

  } catch (error: any) {
    console.error('[Processar Cadastros] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar cadastros' },
      { status: 500 }
    )
  }
}
