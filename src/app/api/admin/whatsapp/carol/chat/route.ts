import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getCarolAutomationDisabled } from '@/lib/carol-admin-settings'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/whatsapp/carol/chat
 * Chat direto com a Carol. Desligado quando isCarolAutomationDisabled (PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md).
 */
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult
  if (await getCarolAutomationDisabled()) {
    return NextResponse.json({ disabled: true, message: 'Automação temporariamente desligada' }, { status: 503 })
  }
  try {
    const body = await request.json()
    const { message, conversationHistory } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API Key não configurada' },
        { status: 500 }
      )
    }

    // Buscar dados do sistema para contexto
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const hojeISO = hoje.toISOString()
    const amanha = new Date(hoje)
    amanha.setDate(amanha.getDate() + 1)
    const amanhaISO = amanha.toISOString()

    // 1. Buscar lembretes enviados hoje
    const { data: lembretesHoje } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('id, created_at, conversation_id')
      .eq('sender_type', 'bot')
      .eq('sender_name', 'Carol - Secretária')
      .gte('created_at', hojeISO)
      .lt('created_at', amanhaISO)
      .ilike('message', '%lembrete%')

    // 2. Buscar agendamentos de hoje
    const { data: agendamentosHoje } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')
      .contains('context', { tags: ['agendou_aula'] })

    // Filtrar agendamentos de hoje
    const agendamentosHojeFiltrados = (agendamentosHoje || []).filter((conv: any) => {
      const context = conv.context || {}
      const scheduledDate = context.scheduled_date || context.workshop_session_id
      if (!scheduledDate) return false
      
      // Se é workshop_session_id, buscar a data da sessão
      if (typeof scheduledDate === 'string' && scheduledDate.length > 10) {
        // Provavelmente é um ID de sessão, vamos buscar
        return true // Simplificado por enquanto
      }
      
      const dataAgendamento = new Date(scheduledDate)
      return dataAgendamento.toDateString() === hoje.toDateString()
    })

    // 3. Buscar pessoas que ainda não escolheram horário
    const { data: semHorario } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')
      .contains('context', { tags: ['veio_aula_pratica'] })

    const semHorarioFiltrados = (semHorario || []).filter((conv: any) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      return (
        tags.includes('veio_aula_pratica') &&
        !tags.includes('agendou_aula') &&
        !tags.includes('participou_aula') &&
        !tags.includes('nao_participou_aula')
      )
    })

    // 4. Buscar sessões de hoje
    const { data: sessoesHoje } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link, is_active')
      .eq('area', 'nutri')
      .gte('starts_at', hojeISO)
      .lt('starts_at', amanhaISO)
      .order('starts_at', { ascending: true })

    // 5. Buscar participantes confirmados para sessões de hoje
    let participantesHoje = 0
    if (sessoesHoje && sessoesHoje.length > 0) {
      for (const sessao of sessoesHoje) {
        const { count } = await supabaseAdmin
          .from('whatsapp_conversations')
          .select('id', { count: 'exact', head: true })
          .eq('area', 'nutri')
          .eq('status', 'active')
          .contains('context', { workshop_session_id: sessao.id })
        
        participantesHoje += count || 0
      }
    }

    // Detectar comandos de ação antes de processar
    const messageLower = message.toLowerCase().trim()
    let actionExecuted = false
    let actionResult: string | null = null

    // Comando: Enviar remarketing para pessoa específica
    if (messageLower.includes('envie remarketing') || messageLower.includes('enviar remarketing') || 
        messageLower.includes('disparar remarketing') || messageLower.includes('remarketing para')) {
      try {
        // Extrair nome da pessoa da mensagem
        const nameMatch = message.match(/(?:para|pra|à|a)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s|$|,|\.)/i)
        const targetName = nameMatch ? nameMatch[1].trim() : null

        if (targetName) {
          // Buscar conversa pelo nome
          const { data: conversation } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('id, phone, name, context')
            .eq('area', 'nutri')
            .eq('status', 'active')
            .ilike('name', `%${targetName}%`)
            .limit(1)
            .maybeSingle()

          if (conversation) {
            const { sendRemarketingToNonParticipant } = await import('@/lib/whatsapp-carol-ai')
            const result = await sendRemarketingToNonParticipant(conversation.id)
            
            if (result.success) {
              actionExecuted = true
              actionResult = `✅ Remarketing enviado com sucesso para ${conversation.name || targetName}!`
            } else {
              actionExecuted = true
              actionResult = `⚠️ ${result.error || 'Erro ao enviar remarketing'}`
            }
          } else {
            actionExecuted = true
            actionResult = `❌ Não encontrei ninguém com o nome "${targetName}". Verifique se o nome está correto.`
          }
        } else {
          actionExecuted = true
          actionResult = `❌ Por favor, especifique o nome da pessoa. Exemplo: "envie remarketing para Maria Lins"`
        }
      } catch (error: any) {
        actionExecuted = true
        actionResult = `❌ Erro ao executar comando: ${error.message}`
      }
    }

    // Comando: Remover/desagendar pessoa do agendamento
    if (!actionExecuted && (messageLower.includes('remover') && (messageLower.includes('agendamento') || messageLower.includes('da aula') || messageLower.includes('do agendamento'))) ||
        messageLower.includes('desagendar') || messageLower.includes('tirar') && messageLower.includes('da lista')) {
      try {
        const nameMatch = message.match(/(?:remover|desagendar|tirar)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+do agendamento|\s+da aula|\s+da lista|$|,|\.)/i) ||
          message.match(/(?:remover|desagendar)\s+([A-Za-zÀ-ÿ\s]+)/i)
        const targetName = nameMatch ? nameMatch[1].trim() : null

        if (targetName) {
          const { data: byName } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('id, phone, name, customer_name, context')
            .eq('area', 'nutri')
            .eq('status', 'active')
            .ilike('name', `%${targetName}%`)
            .limit(1)
            .maybeSingle()

          let conv = byName
          if (!conv) {
            const { data: byCustomerName } = await supabaseAdmin
              .from('whatsapp_conversations')
              .select('id, phone, name, customer_name, context')
              .eq('area', 'nutri')
              .eq('status', 'active')
              .ilike('customer_name', `%${targetName}%`)
              .limit(1)
              .maybeSingle()
            conv = byCustomerName
          }
          if (conv) {
            const base = new URL(request.url).origin
            const res = await fetch(`${base}/api/admin/whatsapp/workshop/participants/remover`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Cookie: request.headers.get('cookie') || '',
              },
              body: JSON.stringify({ conversationId: conv.id }),
            })
            const data = await res.json().catch(() => ({}))
            if (res.ok && data.success) {
              actionExecuted = true
              actionResult = `✅ ${conv.name || targetName} foi desagendado(a). Não consta mais como confirmado(a) para a aula.`
            } else {
              actionExecuted = true
              actionResult = `⚠️ ${data.error || 'Erro ao remover agendamento'}`
            }
          } else {
            actionExecuted = true
            actionResult = `❌ Não encontrei ninguém com o nome "${targetName}". Verifique o nome ou use a agenda para remover manualmente.`
          }
        } else {
          actionExecuted = true
          actionResult = `❌ Por favor, informe o nome da pessoa. Ex.: "remover Maria do agendamento" ou "desagendar João"`
        }
      } catch (error: any) {
        actionExecuted = true
        actionResult = `❌ Erro ao desagendar: ${error.message}`
      }
    }

    // Comando: Disparar lembretes
    if (!actionExecuted && (messageLower.includes('disparar lembretes') || messageLower.includes('enviar lembretes') || 
        messageLower.includes('lembretes de hoje'))) {
      try {
        const { sendWorkshopReminders } = await import('@/lib/whatsapp-carol-ai')
        const result = await sendWorkshopReminders()
        
        actionExecuted = true
        actionResult = `✅ Lembretes processados!\n\n📊 Resultado:\n• Enviados: ${result.sent}\n• Erros: ${result.errors}\n• Ignorados: ${result.skipped || 0}`
      } catch (error: any) {
        actionExecuted = true
        actionResult = `❌ Erro ao disparar lembretes: ${error.message}`
      }
    }

    // Se executou uma ação, retornar resultado direto
    if (actionExecuted && actionResult) {
      return NextResponse.json({
        success: true,
        response: actionResult,
        actionExecuted: true,
      })
    }

    // Construir contexto para a Carol
    const systemContext = `
Você é a Carol, assistente da Ylada (plataforma de diagnóstico de negócios e qualificação de Leads). Você está em um chat direto com o administrador da plataforma.

Os números abaixo vêm da operação atual no WhatsApp (lembretes, agendamentos e sessões do dia).

DADOS DO SISTEMA (HOJE - ${hoje.toLocaleDateString('pt-BR')}):

📊 LEMBRETES:
- Lembretes enviados hoje: ${lembretesHoje?.length || 0}

📅 AGENDAMENTOS:
- Pessoas que agendaram hoje: ${agendamentosHojeFiltrados.length}
- Pessoas que ainda não escolheram horário: ${semHorarioFiltrados.length}

📚 SESSÕES DE HOJE:
- Total de sessões: ${sessoesHoje?.length || 0}
- Participantes confirmados: ${participantesHoje}

COMANDOS DISPONÍVEIS:
- "envie remarketing para [nome]" - Envia fluxo de remarketing para pessoa específica
- "remover [nome] do agendamento" / "desagendar [nome]" - Remove a pessoa da lista de confirmados da aula
- "disparar lembretes" - Dispara lembretes para participantes agendados
- "enviar lembretes de hoje" - Envia lembretes para sessões de hoje

INSTRUÇÕES:
- Seja natural e conversacional
- Responda perguntas sobre status, lembretes, agendamentos e sessões do dia
- Use os dados acima para responder perguntas específicas
- Se o administrador pedir para executar uma ação, confirme que executou
- Se não souber algo, seja honesta
- Use emojis moderadamente
- Seja profissional mas amigável
`

    // Importar função de geração de resposta
    const { generateCarolResponse } = await import('@/lib/whatsapp-carol-ai')

    // Preparar histórico de conversa (apenas user/assistant)
    const historyForCarol = (conversationHistory || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content,
    }))

    // Construir mensagem com contexto do sistema
    // Vamos adicionar o contexto do sistema como parte da mensagem inicial
    const messageWithContext = historyForCarol.length === 0 
      ? `${systemContext}\n\nPergunta do administrador: ${message}`
      : message

    // Gerar resposta da Carol
    const response = await generateCarolResponse(
      messageWithContext,
      historyForCarol,
      {
        tags: [],
        adminInternalChat: true,
        isFirstMessage: false,
      }
    )
    
    // Adicionar dados do sistema à resposta se a pergunta for sobre status
    let finalResponse = response

    // Se a pergunta é sobre lembretes, adicionar dados específicos
    if (message.toLowerCase().includes('lembrete') || message.toLowerCase().includes('enviou')) {
      finalResponse = `${response}\n\n📊 **Dados de hoje:**\n• Lembretes enviados: ${lembretesHoje?.length || 0}`
    }

    // Se a pergunta é sobre agendamentos
    if (message.toLowerCase().includes('agend') || message.toLowerCase().includes('escolheu')) {
      finalResponse = `${response}\n\n📅 **Status de hoje:**\n• Agendamentos: ${agendamentosHojeFiltrados.length}\n• Sem horário: ${semHorarioFiltrados.length}`
    }

    // Se a pergunta é sobre sessões
    if (message.toLowerCase().includes('sessão') || message.toLowerCase().includes('aula')) {
      finalResponse = `${response}\n\n📚 **Sessões de hoje:**\n• Total: ${sessoesHoje?.length || 0}\n• Participantes: ${participantesHoje}`
    }

    return NextResponse.json({
      success: true,
      response: finalResponse,
    })
  } catch (error: any) {
    console.error('[Carol Chat] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar pergunta' },
      { status: 500 }
    )
  }
}
