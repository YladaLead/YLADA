import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/whatsapp/carol/chat
 * Chat direto com a Carol para consultar status e informações
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

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

    // Construir contexto para a Carol
    const systemContext = `
Você é a Carol, secretária da YLADA Nutri. Você está em um chat direto com o administrador do sistema.

DADOS DO SISTEMA (HOJE - ${hoje.toLocaleDateString('pt-BR')}):

📊 LEMBRETES:
- Lembretes enviados hoje: ${lembretesHoje?.length || 0}

📅 AGENDAMENTOS:
- Pessoas que agendaram hoje: ${agendamentosHojeFiltrados.length}
- Pessoas que ainda não escolheram horário: ${semHorarioFiltrados.length}

📚 SESSÕES DE HOJE:
- Total de sessões: ${sessoesHoje?.length || 0}
- Participantes confirmados: ${participantesHoje}

INSTRUÇÕES:
- Seja natural e conversacional
- Responda perguntas sobre status, lembretes, agendamentos
- Use os dados acima para responder perguntas específicas
- Se não souber algo, seja honesta
- Use emojis moderadamente
- Seja profissional mas amigável
`

    // Importar função de geração de resposta
    const { generateCarolResponse } = await import('@/lib/whatsapp-carol-ai')

    // Preparar histórico de conversa
    const history = (conversationHistory || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content,
    }))

    // Importar função de geração
    const { generateCarolResponse } = await import('@/lib/whatsapp-carol-ai')

    // Preparar histórico de conversa (apenas user/assistant)
    const historyForCarol = (history || []).map((msg: any) => ({
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
        leadName: 'Administrador',
        isFirstMessage: historyForCarol.length === 0,
      }
    )
    
    // Adicionar dados do sistema à resposta se a pergunta for sobre status
    let finalResponse = response

    // Adicionar contexto do sistema à resposta se necessário
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
