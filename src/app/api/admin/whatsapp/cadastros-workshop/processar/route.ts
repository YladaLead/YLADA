import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { getFlowTemplate, applyTemplate } from '@/lib/whatsapp-flow-templates'

function digits(input: string): string {
  return String(input || '').replace(/\D/g, '')
}

function normalizePhone(raw: string): string {
  let d = digits(raw)
  // remover um possível "0" inicial
  if (d.startsWith('0')) d = d.slice(1)
  // se for BR sem DDI (10/11), adiciona 55
  if ((d.length === 10 || d.length === 11) && !d.startsWith('55')) d = `55${d}`
  return d
}

function buildIntroQuestion(name: string | null | undefined): string {
  const firstName = (name || '').trim().split(/\s+/)[0] || ''
  const hi = firstName ? `Oi, ${firstName} 😊` : 'Oi! 😊'
  return `${hi}\nSou a Carol, da YLADA Nutri.\n\nParabéns por ter se inscrito na aula prática.\n\nPara eu te direcionar melhor, você já começou a atender?\n\n1️⃣ ainda não comecei\n2️⃣ comecei, mas bem devagar\n3️⃣ já atendo com mais frequência\n\nMe responde só o número 🙂`
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

    // Buscar sessões futuras e montar 2 opções (próxima + manhã 9/10h quando existir)
    const { data: allSessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(8)

    const list = allSessions || []
    const hourBR = (startsAt: string) =>
      parseInt(new Date(startsAt).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }), 10)
    const isManha = (s: { starts_at: string }) => {
      const h = hourBR(s.starts_at)
      return h === 9 || h === 10
    }
    const first = list[0]
    const soonestManha = list.find(isManha)
    const second = soonestManha && soonestManha.id !== first?.id ? soonestManha : list[1]
    const picked = first && second ? [first, second] : first ? [first] : []
    const workshopSessions = picked.map((s: any) => ({
      id: s.id,
      title: s.title || 'Aula Prática ao Vivo',
      starts_at: s.starts_at,
      zoom_link: s.zoom_link,
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
    let skippedAlreadySent = 0
    let errors = 0
    const details: string[] = []

    // Processar cada cadastro
    for (const reg of registrations) {
      try {
        const phoneRaw = reg.telefone || reg.phone || ''
        const phone = normalizePhone(phoneRaw)
        if (!phone || digits(phone).length < 10) {
          errors++
          details.push(`❌ ${reg.nome || reg.name || 'Sem nome'}: Telefone inválido`)
          continue
        }

        const name = reg.nome || reg.name || 'Cliente'
        // const email = reg.email || reg.email_address || ''

        // Buscar ou criar conversa
        let conversationId: string | null = null
        
        // Preferir reaproveitar conversa existente (mesmo telefone) para não duplicar.
        // Se houver conversa em outra instância, migramos a conversa para a instância conectada atual.
        const { data: existingConv } = await supabaseAdmin
          .from('whatsapp_conversations')
          .select('id, context, instance_id')
          .eq('phone', phone)
          .eq('area', 'nutri')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (existingConv) {
          conversationId = existingConv.id
          if (existingConv.instance_id && existingConv.instance_id !== instance.id) {
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({ instance_id: instance.id })
              .eq('id', existingConv.id)
          }
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
                source: 'admin_cadastros_workshop'
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
        const newTags = [...new Set([...tags, 'veio_aula_pratica', 'primeiro_contato', 'manual_welcome_sent'])]

        // Verificar se já tem mensagem da Carol
        const { data: existingMessages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'bot')
          .eq('sender_name', 'Carol - Secretária')
          .limit(1)

        // Se não tem mensagem, enviar 1ª mensagem curta (diagnóstico 1/2/3)
        if (!existingMessages || existingMessages.length === 0) {
          const introTemplate = await getFlowTemplate('nutri', 'welcome_form_intro_question')
          const message = introTemplate
            ? applyTemplate(introTemplate, { nome: name })
            : buildIntroQuestion(name)

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
          skippedAlreadySent++
          details.push(`ℹ️ ${name}: Já recebeu mensagem (não reenviado)`)
        }

        // Atualizar tags e contexto
        await supabaseAdmin
          .from('whatsapp_conversations')
          .update({
            context: {
              ...context,
              tags: newTags,
              manual_welcome_sent_at: (context as any)?.manual_welcome_sent_at || new Date().toISOString(),
              manual_welcome_source: 'admin_cadastros_workshop',
              workshop_intro_stage: (context as any)?.workshop_intro_stage || 'qual_nivel',
            },
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
      skippedAlreadySent,
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
