/**
 * Carol - IA de Atendimento WhatsApp
 * 
 * Sistema completo de automação com OpenAI para:
 * - Recepção automática
 * - Atendimento de quem chamou
 * - Disparo para quem não chamou
 * - Remarketing para quem agendou mas não participou
 */

import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const WHATSAPP_NUMBER = '5519997230912' // Número principal

/**
 * System Prompt da Carol
 */
const CAROL_SYSTEM_PROMPT = `Você é a Carol, secretária da YLADA Nutri. Você é profissional, acolhedora e eficiente.

SEU PAPEL:
- Recepcionar pessoas que se inscreveram na Aula Prática ao Vivo
- Enviar opções de dias e horários disponíveis
- Responder dúvidas sobre a aula
- Ajudar com reagendamentos
- Fazer remarketing para quem agendou mas não participou
- Trabalhar vendas e fechamento após a aula
- Lidar com objeções de forma empática e estratégica
- Provocar que a pessoa manifeste suas dúvidas e objeções

REGRAS IMPORTANTES:
1. Sempre seja acolhedora e profissional
2. Use emojis moderadamente (1-2 por mensagem)
3. Seja direta e objetiva
4. NUNCA repita informações que já foram ditas na conversa - LEIA O HISTÓRICO PRIMEIRO
5. Se a pessoa já sabe sobre a aula, NÃO explique novamente - apenas responda a pergunta específica
6. Seja natural e conversacional
7. Quando enviar opções de aula, use EXATAMENTE o formato fornecido no contexto
8. Para reagendamentos, seja flexível e ajude a encontrar melhor data

CONTEXTO DA AULA:
- Nome: "Aula Prática ao Vivo de Como Encher a Agenda"
- Duração: aproximadamente 45 minutos
- Formato: Online (Zoom)
- Objetivo: Ensinar estratégias práticas para encher a agenda

QUANDO ENVIAR OPÇÕES DE AULA:
- SEMPRE na primeira mensagem da pessoa (já apresente as duas próximas opções)
- Quando pessoa pergunta sobre dias/horários
- Quando pessoa quer agendar
- Quando pessoa pede para reagendar
- Use EXATAMENTE o formato das opções fornecidas no contexto (não invente horários)
- NUNCA inclua links do Zoom nas opções iniciais
- Apenas mostre dias e horários
- Quando a pessoa escolher uma opção, você enviará o link específico

PRIMEIRA MENSAGEM (IMPORTANTE):
- Se é a primeira mensagem da pessoa, você DEVE:
  1. Dar boas-vindas
  2. Explicar que a aula tem 45 minutos
  3. JÁ apresentar as duas próximas opções de aula (usando o formato fornecido)
  4. Perguntar "Qual você prefere?" (SEM botões, apenas texto)
  5. NÃO esperar a pessoa perguntar sobre horários - você já apresenta!

QUANDO FAZER REMARKETING:
- Pessoa agendou mas não participou
- Seja empática: "Vi que você não conseguiu participar da aula anterior..."
- Ofereça novas opções de data/hora
- Seja persistente mas respeitosa

IMPORTANTE - NÃO REPETIR:
- SEMPRE leia o histórico completo antes de responder
- Se você JÁ explicou o que é a aula, NÃO explique novamente
- Se você JÁ enviou opções, NÃO envie novamente a menos que a pessoa peça
- Se a pessoa faz uma pergunta simples, responda APENAS a pergunta, sem repetir contexto
- Continue a conversa naturalmente, como se fosse uma conversa real

FORMATO DE RESPOSTAS:
- Curta (máximo 3-4 linhas quando não enviar opções)
- Clara e direta
- Acolhedora
- SEM repetir informações já ditas
- Quando enviar opções, use o formato exato fornecido no contexto

TRABALHANDO VENDAS E OBJEÇÕES:
- Sempre trabalhe o emocional: lembre o motivo, o sonho, o objetivo
- Provocar que a pessoa fale: "O que você acha?", "O que te preocupa?", "O que está te impedindo?"
- Quando detectar objeção (preço, tempo, dúvida), trabalhe de forma empática
- Não seja agressiva, mas seja persistente e estratégica
- Use perguntas abertas para entender melhor a objeção
- Trabalhe cada objeção de forma específica e personalizada
- Sempre ofereça soluções, não apenas responda objeções

OBJEÇÕES COMUNS E COMO TRABALHAR:

1. **PREÇO / VALOR:**
   - "Entendo sua preocupação com o investimento. Vamos pensar juntas: quanto você está perdendo por NÃO ter uma agenda cheia? Quanto você ganharia se tivesse 10 clientes a mais por mês? O investimento se paga rapidamente quando você aplica o que aprende."
   - "Sei que parece um investimento agora, mas pense no retorno. Quantas consultas você precisa fazer para recuperar esse valor? Provavelmente apenas algumas. E depois disso, é só lucro."
   - "Que tal pensarmos de outra forma? Quanto você investiria em uma consultoria que te ensina a encher sua agenda? Esse é exatamente o que você está recebendo, mas por uma fração do preço."

2. **TEMPO:**
   - "Sei que tempo é precioso. Por isso criamos algo prático e eficiente. Você não precisa dedicar horas e horas. São estratégias que você aplica no seu dia a dia, enquanto trabalha."
   - "Entendo sua preocupação com tempo. Mas pense: quanto tempo você gasta tentando conseguir clientes sem resultado? Com essas estratégias, você vai economizar tempo e ter mais resultados."

3. **DÚVIDA / INCERTEZA:**
   - "Que bom que você está pensando! Isso mostra que você leva a sério. O que especificamente te deixa em dúvida? Posso ajudar a esclarecer."
   - "É normal ter dúvidas. Muitas pessoas que estão aqui hoje também tinham. O que te ajudaria a ter mais certeza?"

4. **"VOU PENSAR" / "PRECISO CONVERSAR":**
   - "Claro! O que você precisa pensar? Posso ajudar a esclarecer qualquer dúvida."
   - "Entendo. Com quem você precisa conversar? Posso preparar informações para você compartilhar."
   - "Que bom que você quer pensar! Mas me diga: o que especificamente você precisa pensar? Às vezes, quando a gente coloca em palavras, fica mais claro."

5. **"NÃO TENHO DINHEIRO AGORA":**
   - "Entendo. Que tal começarmos de forma mais acessível? Temos opções que podem se encaixar melhor no seu momento."
   - "Sei que dinheiro pode ser uma preocupação. Mas pense: quanto você está perdendo por não ter clientes? Às vezes, o que falta é justamente o que vai te ajudar a ter mais."

6. **"JÁ TENHO MUITAS COISAS":**
   - "Entendo que você já tem muitas coisas para fazer. Por isso criamos algo prático e direto. Você não precisa mudar tudo, apenas aplicar estratégias específicas."
   - "Sei que pode parecer mais uma coisa na sua lista. Mas essa é diferente: é algo que vai te ajudar a organizar tudo e ter mais resultados."

IMPORTANTE AO TRABALHAR OBJEÇÕES:
- SEMPRE provoque que a pessoa fale mais: "O que especificamente?", "Me conta mais sobre isso"
- NUNCA aceite um "não" sem entender o motivo real
- Trabalhe o emocional: lembre o sonho, o motivo, o objetivo
- Ofereça soluções, não apenas responda objeções
- Seja empática mas persistente

IMPORTANTE:
- SEMPRE provoque que a pessoa manifeste objeções
- NUNCA aceite um "não" sem entender o motivo real
- Trabalhe o emocional SEMPRE, não apenas o racional
- Lembre o motivo pelo qual ela veio até aqui`

/**
 * Gera resposta da Carol usando OpenAI
 */
async function generateCarolResponse(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  context?: {
    tags?: string[]
    workshopSessions?: Array<{ id?: string; title: string; starts_at: string; zoom_link: string }>
    leadName?: string
    hasScheduled?: boolean
    scheduledDate?: string
    participated?: boolean
    isFirstMessage?: boolean
  }
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return 'Olá! Sou a Carol, secretária da YLADA Nutri. Como posso te ajudar? 😊'
  }

  // Função para formatar data/hora corretamente (timezone de São Paulo)
  // Exportada para uso em outras funções
  function formatSessionDateTime(startsAt: string): { weekday: string; date: string; time: string } {
    const date = new Date(startsAt)
    // Usar timezone de São Paulo
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

  // Construir contexto adicional
  let contextText = ''
  let formattedSessionsText = ''
  let shouldSendOptions = false
  
  if (context) {
    if (context.tags && context.tags.length > 0) {
      contextText += `\nTags da conversa: ${context.tags.join(', ')}\n`
    }
    if (context.hasScheduled) {
      contextText += `\nEsta pessoa já agendou para: ${context.scheduledDate || 'data não especificada'}\n`
    }
    if (context.participated === false) {
      contextText += `\n⚠️ IMPORTANTE: Esta pessoa agendou mas NÃO participou da aula. Faça remarketing oferecendo novas opções.\n`
    }
    if (context.workshopSessions && context.workshopSessions.length > 0) {
      // Formatar opções de forma bonita - APENAS dias/horários (SEM links)
      formattedSessionsText = '📅 *Opções de Aula Disponíveis:*\n\n'
      context.workshopSessions.forEach((session, index) => {
        const { weekday, date, time } = formatSessionDateTime(session.starts_at)
        formattedSessionsText += `*Opção ${index + 1}:*\n`
        formattedSessionsText += `${weekday}, ${date}\n`
        formattedSessionsText += `🕒 ${time} (horário de Brasília)\n\n`
      })
      formattedSessionsText += `💬 *Qual você prefere?*\n`
      
      // 🆕 Se for primeira mensagem, instruir para já apresentar opções com explicação
      if (context.isFirstMessage) {
        contextText += `\n⚠️ ATENÇÃO: Esta é a PRIMEIRA MENSAGEM da pessoa!\n\n`
        contextText += `Você DEVE:\n`
        contextText += `1. Dar boas-vindas acolhedora\n`
        contextText += `2. Explicar que a aula tem 45 minutos e é online via Zoom\n`
        contextText += `3. JÁ apresentar as duas próximas opções usando EXATAMENTE este formato:\n\n${formattedSessionsText}\n\n`
        contextText += `4. Perguntar "Qual você prefere?" (SEM botões, apenas texto)\n\n`
        contextText += `NÃO espere a pessoa perguntar sobre horários - você já apresenta as opções na primeira mensagem!\n`
        contextText += `NUNCA inclua links do Zoom nas opções. Apenas mostre dias e horários.\n`
        shouldSendOptions = true
      } else {
        contextText += `\nIMPORTANTE: Quando a pessoa perguntar sobre horários, dias, agendamento ou quiser agendar, você DEVE usar EXATAMENTE este formato de opções (SEM links, SEM URLs, apenas dias e horários):\n\n${formattedSessionsText}\n\nNUNCA inclua links do Zoom nas opções. Apenas mostre dias e horários. Quando a pessoa escolher uma opção, você enviará o link específico com a imagem.\n`
        
        // Verificar se a mensagem do usuário pede opções
        const messageLower = message.toLowerCase()
        shouldSendOptions = messageLower.includes('horário') || 
                           messageLower.includes('horario') ||
                           messageLower.includes('dia') ||
                           messageLower.includes('agendar') ||
                           messageLower.includes('opção') ||
                           messageLower.includes('opcao') ||
                           messageLower.includes('disponível') ||
                           messageLower.includes('disponivel') ||
                           messageLower.includes('quando') ||
                           messageLower.includes('quais')
      }
    }
  }

    // Incluir histórico completo (últimas 15 mensagens para melhor contexto)
    // Aumentado de 10 para 15 para Carol ter mais contexto da conversa
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: CAROL_SYSTEM_PROMPT + contextText,
      },
      ...conversationHistory.slice(-15), // Últimas 15 mensagens para melhor contexto
      {
        role: 'user',
        content: message,
      },
    ]
    
    console.log('[Carol AI] 📜 Histórico enviado para OpenAI:', {
      totalHistory: conversationHistory.length,
      usingLast: Math.min(15, conversationHistory.length),
      messages: messages.map(m => ({ 
        role: m.role, 
        contentLength: typeof m.content === 'string' ? m.content.length : 0,
        preview: typeof m.content === 'string' ? m.content.substring(0, 80) : ''
      }))
    })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Modelo mais barato e rápido
      messages,
      temperature: 0.6, // Reduzido para respostas mais consistentes
      max_tokens: 400, // Aumentado para permitir formatação melhor
    })

    let response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Pode repetir?'
    
    // Se deve enviar opções, FORÇAR o formato correto (sem links)
    if (shouldSendOptions && formattedSessionsText) {
      // Remover TODOS os links que a IA possa ter adicionado
      response = response.replace(/\[Link do Zoom\]\([^)]+\)/gi, '')
      response = response.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links mas mantém texto
      response = response.replace(/https?:\/\/[^\s\)]+/g, '') // Remove URLs
      response = response.replace(/zoom\.us[^\s\)]*/gi, '') // Remove referências ao Zoom
      
      // Verificar se a resposta menciona opções ou horários
      const mentionsOptions = response.toLowerCase().includes('opção') || 
                              response.toLowerCase().includes('horário') ||
                              response.toLowerCase().includes('disponível')
      
      if (mentionsOptions) {
        // Se menciona opções mas não tem o formato correto, substituir completamente
        const hasCorrectFormat = response.includes('Opção 1:') && 
                                 !response.includes('http') &&
                                 !response.includes('zoom')
        
        if (!hasCorrectFormat) {
          // Extrair apenas a saudação inicial (até primeira quebra de linha ou ponto)
          const lines = response.split('\n')
          let greeting = lines[0] || 'Olá! 😊'
          
          // Limpar saudação de links
          greeting = greeting.replace(/\[Link do Zoom\]\([^)]+\)/gi, '')
          greeting = greeting.replace(/https?:\/\/[^\s]+/g, '')
          greeting = greeting.trim()
          
          // Se a saudação está vazia ou muito curta, usar padrão
          if (greeting.length < 5) {
            greeting = 'Olá! 😊 Que ótimo que você se inscreveu!'
          }
          
          // Criar resposta com saudação + opções formatadas (SEM links)
          response = `${greeting}\n\n${formattedSessionsText.trim()}`
        } else {
          // Se já tem formato correto, apenas garantir que não tem links
          response = response.replace(/\[Link do Zoom\]\([^)]+\)/gi, '')
          response = response.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          response = response.replace(/https?:\/\/[^\s\)]+/g, '')
          response = response.replace(/zoom\.us[^\s\)]*/gi, '')
        }
      }
    }
    
    return response
  } catch (error: any) {
    console.error('[Carol AI] Erro ao gerar resposta:', error)
    return 'Olá! Sou a Carol, secretária da YLADA Nutri. Como posso te ajudar? 😊'
  }
}

/**
 * Envia mensagem via WhatsApp usando Z-API
 */
async function sendWhatsAppMessage(
  phone: string,
  message: string,
  instanceId: string,
  token: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const client = createZApiClient(instanceId, token)
    const result = await client.sendTextMessage({ phone, message })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return { success: true, messageId: result.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Processa mensagem recebida e responde automaticamente com Carol
 */
export async function processIncomingMessageWithCarol(
  conversationId: string,
  phone: string,
  message: string,
  area: string = 'nutri',
  instanceId: string
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    console.log('[Carol AI] 🚀 Iniciando processamento:', {
      conversationId,
      phone,
      messagePreview: message?.substring(0, 50),
      area,
      instanceId,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY
    })

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      console.error('[Carol AI] ❌ OPENAI_API_KEY não configurada')
      return { success: false, error: 'OpenAI API Key não configurada' }
    }

    // 1. Buscar contexto da conversa
    // Usar maybeSingle() para evitar erro se não encontrar (pode ser problema de timing)
    let conversation: any = null
    let retries = 0
    const maxRetries = 3
    
    while (!conversation && retries < maxRetries) {
      if (retries > 0) {
        // Aguardar um pouco antes de tentar novamente (problema de timing)
        await new Promise(resolve => setTimeout(resolve, 300 * retries))
      }
      
      const { data: conv, error: convError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('context, name')
        .eq('id', conversationId)
        .maybeSingle()

      if (convError) {
        console.error('[Carol AI] ❌ Erro ao buscar conversa:', convError)
        if (retries === maxRetries - 1) {
          return { success: false, error: `Erro ao buscar conversa: ${convError.message}` }
        }
        retries++
        continue
      }

      if (conv) {
        conversation = conv
        break
      }
      
      retries++
      if (retries < maxRetries) {
        console.log(`[Carol AI] ⏳ Conversa não encontrada, tentando novamente (${retries}/${maxRetries})...`)
      }
    }

    if (!conversation) {
      console.error('[Carol AI] ❌ Conversa não encontrada após', maxRetries, 'tentativas:', conversationId)
      return { success: false, error: 'Conversa não encontrada' }
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []
    const workshopSessionId = context.workshop_session_id

    // 2. Buscar sessões de workshop disponíveis (com ID para poder buscar depois)
    let workshopSessions: Array<{ id: string; title: string; starts_at: string; zoom_link: string }> = []
    if (workshopSessionId) {
      const { data: session } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .eq('id', workshopSessionId)
        .single()
      if (session) {
        workshopSessions.push(session)
      }
    } else {
      // Buscar próximas 2 sessões (apenas futuras, com buffer de 5 minutos)
      // Usar horário atual em UTC para comparar com o banco
      const now = new Date()
      // Adicionar buffer de 5 minutos para evitar sessões que acabaram de passar
      const bufferMinutes = 5
      const minDate = new Date(now.getTime() + bufferMinutes * 60 * 1000)
      
      console.log('[Carol AI] 🔍 Buscando sessões futuras:', {
        now: now.toISOString(),
        minDate: minDate.toISOString(),
        area
      })
      
      const { data: sessions } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .eq('area', area)
        .eq('is_active', true)
        .gte('starts_at', minDate.toISOString())
        .order('starts_at', { ascending: true })
        .limit(2)
      
      workshopSessions = sessions || []
      
      console.log('[Carol AI] 📅 Sessões encontradas:', {
        count: workshopSessions.length,
        sessions: workshopSessions.map(s => ({
          id: s.id,
          title: s.title,
          starts_at: s.starts_at,
          zoom_link: s.zoom_link?.substring(0, 50) + '...'
        }))
      })
    }

    // 3. Verificar histórico para detectar primeira mensagem
    const { data: messageHistory } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('id, sender_type, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    
    const customerMessages = messageHistory?.filter(m => m.sender_type === 'customer') || []
    const isFirstMessage = customerMessages.length === 1 // Primeira mensagem do cliente
    
    // 4. Verificar se participou ou não
    const participated = tags.includes('participou_aula')
    const hasScheduled = tags.includes('recebeu_link_workshop') || workshopSessionId
    const scheduledDate = context.scheduled_date || null

    // 5. Verificar se a pessoa está escolhendo uma opção de aula
    // Detectar escolha: "1", "opção 1", "primeira", "segunda às 10:00", etc
    let selectedSession: { id: string; title: string; starts_at: string; zoom_link: string } | null = null
    
    if (workshopSessions.length > 0) {
      const messageLower = message.toLowerCase().trim()
      
      // Detectar por número: "1", "opção 1", "primeira", "segundo", "prefiro a primeira", etc
      const numberMatch = messageLower.match(/(?:opção|opcao|op|escolho|prefiro|quero)\s*(?:a\s*)?(\d+)|^(\d+)$|(primeira|segunda|terceira|quarta|quinta)|(?:prefiro|escolho|quero)\s*(?:a\s*)?(primeira|segunda|terceira|quarta|quinta)/)
      
      if (numberMatch) {
        let optionIndex = -1
        if (numberMatch[1]) {
          optionIndex = parseInt(numberMatch[1]) - 1
        } else if (numberMatch[2]) {
          optionIndex = parseInt(numberMatch[2]) - 1
        } else if (numberMatch[3]) {
          const words: Record<string, number> = {
            'primeira': 0,
            'segunda': 1,
            'terceira': 2,
            'quarta': 3,
            'quinta': 4
          }
          optionIndex = words[numberMatch[3]] || -1
        } else if (numberMatch[4]) {
          const words: Record<string, number> = {
            'primeira': 0,
            'segunda': 1,
            'terceira': 2,
            'quarta': 3,
            'quinta': 4
          }
          optionIndex = words[numberMatch[4]] || -1
        }
        
        if (optionIndex >= 0 && optionIndex < workshopSessions.length) {
          // Usar sessão já encontrada (já tem ID)
          selectedSession = {
            id: workshopSessions[optionIndex].id,
            title: workshopSessions[optionIndex].title,
            starts_at: workshopSessions[optionIndex].starts_at,
            zoom_link: workshopSessions[optionIndex].zoom_link
          }
        }
      }
      
      // Detectar por dia/horário: "segunda às 10:00", "26/01 às 10:00", etc
      if (!selectedSession) {
        for (const sessionItem of workshopSessions) {
          const { weekday, date, time } = formatSessionDateTime(sessionItem.starts_at)
          const weekdayLower = weekday.toLowerCase()
          
          // Verificar se mensagem contém dia da semana ou data
          if (
            messageLower.includes(weekdayLower.substring(0, 5)) || // "segunda", "terça", etc
            messageLower.includes(date.replace(/\//g, '')) || // "26012026"
            messageLower.includes(date.split('/')[0]) // "26"
          ) {
            // Verificar se também menciona horário
            if (messageLower.includes(time.replace(':', '')) || messageLower.includes(time)) {
              // Usar sessão já encontrada (já tem ID)
              selectedSession = {
                id: sessionItem.id,
                title: sessionItem.title,
                starts_at: sessionItem.starts_at,
                zoom_link: sessionItem.zoom_link
              }
              break
            }
          }
        }
      }
    }

    // Se detectou escolha, enviar imagem + link e retornar
    if (selectedSession) {
      console.log('[Carol AI] ✅ Escolha detectada:', {
        sessionId: selectedSession.id,
        startsAt: selectedSession.starts_at,
        message
      })
      
      // Buscar instância Z-API
      const isUUID = instanceId.includes('-') && instanceId.length === 36
      const { data: instance } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token, status')
        .eq(isUUID ? 'id' : 'instance_id', instanceId)
        .single()
      
      if (!instance) {
        console.error('[Carol AI] ❌ Instância não encontrada para enviar imagem')
        // Continuar com resposta normal
      } else {
        // Buscar configurações do workshop (flyer)
        const { data: settings } = await supabaseAdmin
          .from('whatsapp_workshop_settings')
          .select('flyer_url, flyer_caption')
          .eq('area', area)
          .maybeSingle()
        
        const flyerUrl = settings?.flyer_url
        const flyerCaption = settings?.flyer_caption || ''
        
        const client = createZApiClient(instance.instance_id, instance.token)
        const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
        
        // 1. Enviar imagem do flyer (se configurado)
        if (flyerUrl) {
          const caption = flyerCaption?.trim() 
            ? flyerCaption 
            : `${selectedSession.title}\n${weekday}, ${date} • ${time}`
          
          const imageResult = await client.sendImageMessage({
            phone,
            image: flyerUrl,
            caption,
          })
          
          if (imageResult.success) {
            // Salvar mensagem da imagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conversationId,
              instance_id: instance.id,
              z_api_message_id: imageResult.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message: caption,
              message_type: 'image',
              media_url: flyerUrl,
              status: 'sent',
              is_bot_response: true,
            })
          }
        }
        
        // 2. Enviar mensagem com link
        const linkMessage = `✅ *Perfeito! Aqui está o link da sua aula:*\n\n📅 ${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n🔗 ${selectedSession.zoom_link}\n\n✅ Se precisar reagendar, responda REAGENDAR.\n\nQualquer dúvida, estou aqui! 💚`
        
        const textResult = await client.sendTextMessage({
          phone,
          message: linkMessage,
        })
        
        if (textResult.success) {
          // Salvar mensagem do link
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conversationId,
            instance_id: instance.id,
            z_api_message_id: textResult.id || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: linkMessage,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true,
          })
          
          // Atualizar contexto da conversa
          const prevContext = context
          const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
          const newTags = [...new Set([...prevTags, 'recebeu_link_workshop', 'agendou_aula'])]
          
          // 🆕 Verificar tempo restante e enviar lembrete apropriado
          const sessionDate = new Date(selectedSession.starts_at)
          const now = new Date()
          const timeDiff = sessionDate.getTime() - now.getTime()
          const hoursDiff = timeDiff / (1000 * 60 * 60)
          
          // Se está entre 12h e 13h antes, já enviar lembrete de 12h
          // Se está entre 2h e 2h30 antes, já enviar lembrete de 2h
          let reminderToSend: string | null = null
          if (hoursDiff >= 12 && hoursDiff < 13) {
            // Lembrete de 12h (recomendação computador)
            const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
            reminderToSend = `Olá! 

Sua aula é hoje às ${time}! 

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 ${selectedSession.zoom_link}

Carol - Secretária YLADA Nutri`
          } else if (hoursDiff >= 2 && hoursDiff < 2.5) {
            // Lembrete de 2h (aviso Zoom)
            const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
            reminderToSend = `Olá! 

Sua aula começa em 2 horas! ⏰

⚠️ *Aviso importante:*

A sala do Zoom será aberta 10 minutos antes do horário da aula.

⏰ Após o início da aula, não será permitido entrar, ok?

Isso porque os 10 primeiros minutos são essenciais:
é nesse momento que identificamos os principais desafios das participantes para que a aula seja realmente prática e personalizada.

🔗 ${selectedSession.zoom_link}

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri`
          }
          
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...prevContext,
                tags: newTags,
                workshop_session_id: selectedSession.id,
                scheduled_date: selectedSession.starts_at,
              },
              last_message_at: new Date().toISOString(),
              last_message_from: 'bot',
            })
            .eq('id', conversationId)
          
          // 🆕 Enviar lembrete imediatamente se necessário
          if (reminderToSend) {
            setTimeout(async () => {
              try {
                const reminderResult = await client.sendTextMessage({
                  phone,
                  message: reminderToSend!,
                })
                
                if (reminderResult.success) {
                  await supabaseAdmin.from('whatsapp_messages').insert({
                    conversation_id: conversationId,
                    instance_id: instance.id,
                    z_api_message_id: reminderResult.id || null,
                    sender_type: 'bot',
                    sender_name: 'Carol - Secretária',
                    message: reminderToSend!,
                    message_type: 'text',
                    status: 'sent',
                    is_bot_response: true,
                  })
                  
                  // Marcar que já enviou esse lembrete
                  const notificationKey = `pre_class_${selectedSession.id}`
                  const updatedContext = {
                    ...prevContext,
                    tags: newTags,
                    workshop_session_id: selectedSession.id,
                    scheduled_date: selectedSession.starts_at,
                    [notificationKey]: hoursDiff >= 12 ? { sent_12h: true } : { sent_2h: true },
                  }
                  
                  await supabaseAdmin
                    .from('whatsapp_conversations')
                    .update({ context: updatedContext })
                    .eq('id', conversationId)
                }
              } catch (error: any) {
                console.error('[Carol] Erro ao enviar lembrete imediato:', error)
              }
            }, 2000) // Aguardar 2 segundos antes de enviar
          }
          
          return { success: true, response: linkMessage }
        }
      }
    }

    // 5. Buscar histórico de mensagens (aumentado para 30 para melhor contexto)
    const { data: messages } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('sender_type, message, created_at')
      .eq('conversation_id', conversationId)
      .eq('status', 'active') // Apenas mensagens não deletadas
      .order('created_at', { ascending: true })
      .limit(30) // Aumentado de 20 para 30 mensagens

    const conversationHistory = (messages || [])
      .filter(m => m.sender_type === 'customer' || m.sender_type === 'bot' || m.sender_type === 'agent')
      .filter(m => m.message && m.message.trim().length > 0) // Apenas mensagens com conteúdo
      .map(m => ({
        role: m.sender_type === 'customer' ? 'user' as const : 'assistant' as const,
        content: m.message || '',
      }))
    
    console.log('[Carol AI] 📚 Histórico carregado:', {
      totalMessages: messages?.length || 0,
      filteredHistory: conversationHistory.length,
      lastMessages: conversationHistory.slice(-5).map(m => ({
        role: m.role,
        preview: m.content.substring(0, 50)
      }))
    })

    // 6. Gerar resposta da Carol
    console.log('[Carol AI] 💭 Gerando resposta com contexto:', {
      tags,
      hasSessions: workshopSessions.length > 0,
      leadName: conversation.name,
      hasScheduled,
      participated,
      isFirstMessage
    })

    const carolResponse = await generateCarolResponse(message, conversationHistory, {
      tags,
      workshopSessions,
      leadName: conversation.name || undefined,
      hasScheduled,
      scheduledDate,
      participated: participated ? true : (tags.includes('nao_participou_aula') ? false : undefined),
      isFirstMessage, // 🆕 Passar flag de primeira mensagem
    })

    console.log('[Carol AI] ✅ Resposta gerada:', {
      responsePreview: carolResponse?.substring(0, 100),
      length: carolResponse?.length
    })

    // 7. Buscar instância Z-API
    // IMPORTANTE: instanceId pode ser instance_id (string) ou id (UUID)
    // Se for UUID (36 caracteres com hífens), buscar por id
    // Se for instance_id (32 caracteres sem hífens), buscar por instance_id
    const isUUID = instanceId.includes('-') && instanceId.length === 36
    console.log('[Carol AI] 🔍 Buscando instância Z-API:', { 
      instanceId, 
      isUUID,
      length: instanceId.length 
    })
    
    const { data: instance, error: instanceError } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token, status')
      .eq(isUUID ? 'id' : 'instance_id', instanceId)
      .single()

    if (instanceError) {
      console.error('[Carol AI] ❌ Erro ao buscar instância:', {
        error: instanceError,
        code: instanceError.code,
        message: instanceError.message,
        instanceId,
        isUUID,
        searchField: isUUID ? 'id' : 'instance_id'
      })
      
      // Tentar buscar todas as instâncias para debug
      const { data: allInstances } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, name, status, area')
        .limit(10)
      console.log('[Carol AI] 🔍 Todas as instâncias no banco:', allInstances)
      
      return { success: false, error: `Erro ao buscar instância: ${instanceError.message}` }
    }

    if (!instance) {
      console.error('[Carol AI] ❌ Instância Z-API não encontrada:', { 
        instanceId,
        isUUID,
        searchField: isUUID ? 'id' : 'instance_id',
        length: instanceId.length
      })
      
      // Tentar buscar todas as instâncias para debug
      const { data: allInstances } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, name, status, area')
        .limit(10)
      console.log('[Carol AI] 🔍 Todas as instâncias no banco (para debug):', allInstances)
      
      return { success: false, error: `Instância Z-API não encontrada. InstanceId buscado: ${instanceId}` }
    }

    console.log('[Carol AI] ✅ Instância encontrada:', {
      id: instance.id,
      instance_id: instance.instance_id,
      hasToken: !!instance.token,
      tokenLength: instance.token?.length,
      status: instance.status
    })

    // 8. Enviar resposta
    console.log('[Carol AI] 📤 Enviando resposta via Z-API:', {
      phone,
      messageLength: carolResponse?.length,
      instance_id: instance.instance_id
    })
    
    const sendResult = await sendWhatsAppMessage(
      phone,
      carolResponse,
      instance.instance_id,
      instance.token
    )

    console.log('[Carol AI] 📤 Resultado do envio:', {
      success: sendResult.success,
      error: sendResult.error,
      messageId: sendResult.messageId
    })

    if (!sendResult.success) {
      console.error('[Carol AI] ❌ Erro ao enviar mensagem:', sendResult.error)
      return { success: false, error: sendResult.error || 'Erro ao enviar mensagem via Z-API' }
    }

    // 9. Salvar mensagem no banco
    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversationId,
      instance_id: instanceId,
      z_api_message_id: sendResult.messageId || null,
      sender_type: 'bot',
      sender_name: 'Carol - Secretária',
      message: carolResponse,
      message_type: 'text',
      status: 'sent',
      is_bot_response: true,
    })

    // 10. Atualizar última mensagem da conversa
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_from: 'bot',
      })
      .eq('id', conversationId)

    return { success: true, response: carolResponse }
  } catch (error: any) {
    console.error('[Carol AI] Erro ao processar mensagem:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Dispara mensagem de boas-vindas para quem preencheu mas não chamou
 */
export async function sendWelcomeToNonContactedLeads(): Promise<{
  sent: number
  errors: number
}> {
  try {
    // 1. Buscar leads que preencheram workshop mas não têm conversa ativa
    // Buscar de workshop_inscricoes OU de leads com source = workshop_agenda_instavel_landing_page
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    // Tentar buscar de workshop_inscricoes primeiro
    let workshopLeads: Array<{ nome: string; email: string; telefone: string; created_at: string }> = []
    
    const { data: inscricoes } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('nome, email, telefone, created_at')
      .eq('status', 'inscrito')
      .gte('created_at', seteDiasAtras)
      .order('created_at', { ascending: false })
    
    if (inscricoes && inscricoes.length > 0) {
      workshopLeads = inscricoes.map((i: any) => ({
        nome: i.nome,
        email: i.email || '',
        telefone: i.telefone,
        created_at: i.created_at,
      }))
    } else {
      // Fallback: buscar de leads com source workshop
      const { data: leads } = await supabaseAdmin
        .from('leads')
        .select('nome, email, telefone, created_at')
        .or('source.eq.workshop_agenda_instavel_landing_page,source.ilike.%workshop%')
        .gte('created_at', seteDiasAtras)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (leads) {
        workshopLeads = leads
          .filter((l: any) => l.telefone)
          .map((l: any) => ({
            nome: l.nome || '',
            email: l.email || '',
            telefone: l.telefone,
            created_at: l.created_at,
          }))
      }
    }

    if (!workshopLeads || workshopLeads.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // 2. Verificar quais não têm conversa ativa no WhatsApp
    const leadsToContact: Array<{ nome: string; telefone: string }> = []
    
    for (const lead of workshopLeads) {
      if (!lead.telefone) continue

      const phoneClean = lead.telefone.replace(/\D/g, '')
      if (phoneClean.length < 10) continue

      // Verificar se tem conversa com mensagens do cliente
      const { data: conversation } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('id')
        .eq('phone', phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`)
        .eq('area', 'nutri')
        .maybeSingle()

      if (!conversation) {
        // Não tem conversa, precisa receber boas-vindas
        leadsToContact.push({
          nome: lead.nome,
          telefone: phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`,
        })
      } else {
        // Verificar se cliente já enviou mensagem
        const { data: customerMessage } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id')
          .eq('conversation_id', conversation.id)
          .eq('sender_type', 'customer')
          .limit(1)
          .maybeSingle()

        if (!customerMessage) {
          // Tem conversa mas cliente nunca enviou mensagem
          leadsToContact.push({
            nome: lead.nome,
            telefone: phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`,
          })
        }
      }
    }

    // 3. Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: leadsToContact.length }
    }

    // 4. Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    // 5. Enviar mensagem para cada lead
    let sent = 0
    let errors = 0

    for (const lead of leadsToContact) {
      try {
        // Formatar opções de aula
        let optionsText = ''
        if (sessions && sessions.length > 0) {
          sessions.forEach((session, index) => {
            const date = new Date(session.starts_at)
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
            const dateStr = date.toLocaleDateString('pt-BR')
            const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            optionsText += `\n📅 **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
          })
        }

        const welcomeMessage = `Olá ${lead.nome}, seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Aqui estão as duas próximas opções de aula:

${optionsText}✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, é só me chamar! 💚

Carol - Secretária YLADA Nutri`

        const sendResult = await sendWhatsAppMessage(
          lead.telefone,
          welcomeMessage,
          instance.instance_id,
          instance.token
        )

        if (sendResult.success) {
          // Criar ou atualizar conversa
          const { data: existingConv } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('id')
            .eq('phone', lead.telefone)
            .eq('instance_id', instance.id)
            .maybeSingle()

          let conversationId: string | null = null

          if (existingConv) {
            conversationId = existingConv.id
            // Atualizar tags
            const prevContext = (existingConv.context || {}) as any
            const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
            const newTags = [...new Set([...prevTags, 'veio_aula_pratica', 'recebeu_link_workshop', 'primeiro_contato'])]

            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context: {
                  ...prevContext,
                  tags: newTags,
                  source: 'welcome_automation',
                },
              })
              .eq('id', conversationId)
          } else {
            const { data: newConv } = await supabaseAdmin
              .from('whatsapp_conversations')
              .insert({
                phone: lead.telefone,
                instance_id: instance.id,
                area: 'nutri',
                name: lead.nome,
                context: {
                  tags: ['veio_aula_pratica', 'recebeu_link_workshop', 'primeiro_contato'],
                  source: 'welcome_automation',
                },
              })
              .select('id')
              .single()

            conversationId = newConv?.id || null
          }

          // Salvar mensagem
          if (conversationId) {
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conversationId,
              instance_id: instance.id,
              z_api_message_id: sendResult.messageId || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message: welcomeMessage,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })
          }

          sent++
        } else {
          errors++
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar para ${lead.telefone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar leads não contactados:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Dispara remarketing para quem agendou mas não participou
 */
export async function sendRemarketingToNonParticipants(): Promise<{
  sent: number
  errors: number
}> {
  try {
    // 1. Buscar conversas com tag "nao_participou_aula" ou "adiou_aula"
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')

    if (!conversations) {
      return { sent: 0, errors: 0 }
    }

    // 2. Filtrar quem não participou
    const nonParticipants = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      return (
        tags.includes('nao_participou_aula') ||
        tags.includes('adiou_aula')
      ) && !tags.includes('participou_aula')
    })

    if (nonParticipants.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // 3. Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: nonParticipants.length }
    }

    // 4. Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    // 5. Enviar mensagem de remarketing
    let sent = 0
    let errors = 0

    for (const conv of nonParticipants) {
      try {
        // Formatar opções
        let optionsText = ''
        if (sessions && sessions.length > 0) {
          sessions.forEach((session, index) => {
            const date = new Date(session.starts_at)
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
            const dateStr = date.toLocaleDateString('pt-BR')
            const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            optionsText += `\n📅 **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
          })
        }

        const remarketingMessage = `Olá ${conv.name || 'querido(a)'}! 👋

Vi que você não conseguiu participar da aula anterior. Tudo bem, acontece! 😊

Que tal tentarmos novamente? Aqui estão novas opções de dias e horários:

${optionsText}Se alguma dessas opções funcionar para você, é só me avisar! 

Qualquer dúvida, estou aqui! 💚

Carol - Secretária YLADA Nutri`

        const sendResult = await sendWhatsAppMessage(
          conv.phone,
          remarketingMessage,
          instance.instance_id,
          instance.token
        )

        if (sendResult.success) {
          // Atualizar tag
          const context = conv.context || {}
          const tags = Array.isArray(context.tags) ? context.tags : []
          const newTags = [...new Set([...tags, 'recebeu_segundo_link'])]

          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                tags: newTags,
                last_remarketing_at: new Date().toISOString(),
              },
            })
            .eq('id', conv.id)

          // Salvar mensagem
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conv.id,
            instance_id: instance.id,
            z_api_message_id: sendResult.messageId || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: remarketingMessage,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true,
          })

          sent++
        } else {
          errors++
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar remarketing para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar remarketing:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Função auxiliar para formatar data/hora (exportada)
 */
export function formatSessionDateTime(startsAt: string): { weekday: string; date: string; time: string } {
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
 * Envia notificações pré-aula para quem agendou
 * - 24h antes: Lembrete
 * - 12h antes: Recomendação computador
 * - 2h antes: Aviso Zoom
 * - 30min antes: Sala aberta
 */
export async function sendPreClassNotifications(): Promise<{
  sent: number
  errors: number
}> {
  try {
    const now = new Date()
    const area = 'nutri'
    
    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: 0 }
    }

    // Buscar conversas com sessão agendada
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', area)
      .eq('status', 'active')
      .not('context->workshop_session_id', 'is', null)

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0 }
    }

    let sent = 0
    let errors = 0

    for (const conv of conversations) {
      try {
        const context = conv.context || {}
        const sessionId = context.workshop_session_id
        if (!sessionId) continue

        // Buscar sessão
        const { data: session } = await supabaseAdmin
          .from('whatsapp_workshop_sessions')
          .select('id, title, starts_at, zoom_link')
          .eq('id', sessionId)
          .single()

        if (!session) continue

        const sessionDate = new Date(session.starts_at)
        const timeDiff = sessionDate.getTime() - now.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        const minutesDiff = timeDiff / (1000 * 60)

        const { weekday, date, time } = formatSessionDateTime(session.starts_at)
        const client = createZApiClient(instance.instance_id, instance.token)

        // Verificar qual notificação enviar baseado no tempo restante
        let message: string | null = null
        let shouldSend = false
        const notificationKey = `pre_class_${sessionId}`

        // 24 horas antes (entre 24h e 25h)
        if (hoursDiff >= 24 && hoursDiff < 25 && !context[notificationKey]?.sent_24h) {
          message = `Olá! 👋

Lembrete: Sua aula é amanhã!

📅 ${weekday}, ${date}
🕒 ${time} (horário de Brasília)

🔗 ${session.zoom_link}

Nos vemos lá! 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }
        // 12 horas antes (entre 12h e 13h)
        else if (hoursDiff >= 12 && hoursDiff < 13 && !context[notificationKey]?.sent_12h) {
          message = `Olá! 

Sua aula é hoje às ${time}! 

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 ${session.zoom_link}

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_12h = true
        }
        // 2 horas antes (entre 2h e 2h30)
        else if (hoursDiff >= 2 && hoursDiff < 2.5 && !context[notificationKey]?.sent_2h) {
          message = `Olá! 

Sua aula começa em 2 horas! ⏰

⚠️ *Aviso importante:*

A sala do Zoom será aberta 10 minutos antes do horário da aula.

⏰ Após o início da aula, não será permitido entrar, ok?

Isso porque os 10 primeiros minutos são essenciais:
é nesse momento que identificamos os principais desafios das participantes para que a aula seja realmente prática e personalizada.

🔗 ${session.zoom_link}

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_2h = true
        }
        // 10 minutos antes (entre 10min e 12min)
        else if (minutesDiff >= 10 && minutesDiff < 12 && !context[notificationKey]?.sent_10min) {
          message = `Olá! 

A sala do Zoom já está aberta! 🎉

Você pode entrar agora:

🔗 ${session.zoom_link}

Nos vemos em 10 minutos! 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_10min = true
        }

        if (shouldSend && message) {
          const result = await client.sendTextMessage({
            phone: conv.phone,
            message,
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conv.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })

            // Atualizar contexto
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context,
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', conv.id)

            sent++
          } else {
            errors++
          }
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar notificação pré-aula para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar notificações pré-aula:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Envia notificações pós-aula para quem participou
 * - 15min depois: Como foi?
 * - 2h depois: Como está se sentindo?
 * - 24h depois: Como está aplicando?
 */
export async function sendPostClassNotifications(): Promise<{
  sent: number
  errors: number
}> {
  try {
    const now = new Date()
    const area = 'nutri'

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: 0 }
    }

    // Buscar conversas que participaram da aula
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', area)
      .eq('status', 'active')

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // Filtrar quem participou
    const participants = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      return tags.includes('participou_aula')
    })

    if (participants.length === 0) {
      return { sent: 0, errors: 0 }
    }

    let sent = 0
    let errors = 0

    for (const conv of participants) {
      try {
        const context = conv.context || {}
        const sessionId = context.workshop_session_id
        if (!sessionId) continue

        // Buscar sessão
        const { data: session } = await supabaseAdmin
          .from('whatsapp_workshop_sessions')
          .select('id, title, starts_at, zoom_link')
          .eq('id', sessionId)
          .single()

        if (!session) continue

        const sessionDate = new Date(session.starts_at)
        const sessionEndDate = new Date(sessionDate.getTime() + 45 * 60 * 1000) // 45 minutos depois
        const timeDiff = now.getTime() - sessionEndDate.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        const minutesDiff = timeDiff / (1000 * 60)

        const client = createZApiClient(instance.instance_id, instance.token)
        const notificationKey = `post_class_${sessionId}`

        let message: string | null = null
        let shouldSend = false

        // 15 minutos depois (entre 15min e 20min)
        if (minutesDiff >= 15 && minutesDiff < 20 && !context[notificationKey]?.sent_15min) {
          message = `Olá! 

Espero que tenha gostado da aula! 😊

Como foi sua experiência? Tem alguma dúvida?

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_15min = true
        }
        // 2 horas depois (entre 2h e 2h30)
        else if (hoursDiff >= 2 && hoursDiff < 2.5 && !context[notificationKey]?.sent_2h) {
          message = `Olá! 

Como está se sentindo após a aula? 

Se tiver alguma dúvida sobre o que foi apresentado, estou aqui para ajudar! 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_2h = true
        }
        // 24 horas depois (entre 24h e 25h)
        else if (hoursDiff >= 24 && hoursDiff < 25 && !context[notificationKey]?.sent_24h) {
          message = `Olá! 

Passou um dia desde a aula. Como está sendo aplicar o que aprendeu?

Se precisar de ajuda ou tiver dúvidas, estou aqui! 💚

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }

        if (shouldSend && message) {
          const result = await client.sendTextMessage({
            phone: conv.phone,
            message,
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conv.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })

            // Atualizar contexto
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context,
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', conv.id)

            sent++
          } else {
            errors++
          }
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar notificação pós-aula para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar notificações pós-aula:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Envia notificações para quem não respondeu após boas-vindas
 * - 24h depois: Notificação 1
 * - 48h depois: Notificação 2
 * - 72h depois: Notificação 3 (última)
 */
export async function sendFollowUpToNonResponders(): Promise<{
  sent: number
  errors: number
}> {
  try {
    const now = new Date()
    const area = 'nutri'

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: 0 }
    }

    // Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    // Buscar conversas que receberam boas-vindas mas não responderam
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, created_at')
      .eq('area', area)
      .eq('status', 'active')

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0 }
    }

    let sent = 0
    let errors = 0

    for (const conv of conversations) {
      try {
        const context = conv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        
        // Verificar se recebeu boas-vindas mas não agendou
        const receivedWelcome = tags.includes('recebeu_link_workshop') || tags.includes('veio_aula_pratica')
        const hasScheduled = tags.includes('agendou_aula') || context.workshop_session_id
        
        if (!receivedWelcome || hasScheduled) continue

        // Verificar se cliente já enviou mensagem
        const { data: customerMessage } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id, created_at')
          .eq('conversation_id', conv.id)
          .eq('sender_type', 'customer')
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle()

        // Se cliente já enviou mensagem, não enviar follow-up
        if (customerMessage) continue

        // Calcular tempo desde criação da conversa
        const convDate = new Date(conv.created_at)
        const timeDiff = now.getTime() - convDate.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        const client = createZApiClient(instance.instance_id, instance.token)
        const notificationKey = 'follow_up_welcome'

        let message: string | null = null
        let shouldSend = false

        // 24 horas depois
        if (hoursDiff >= 24 && hoursDiff < 25 && !context[notificationKey]?.sent_24h) {
          message = `Olá! 👋

Vi que você ainda não escolheu um horário para a aula. 

Ainda está disponível? Se precisar de ajuda, é só me chamar! 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }
        // 48 horas depois
        else if (hoursDiff >= 48 && hoursDiff < 49 && !context[notificationKey]?.sent_48h) {
          // Formatar opções
          let optionsText = ''
          if (sessions && sessions.length > 0) {
            sessions.forEach((session, index) => {
              const { weekday, date, time } = formatSessionDateTime(session.starts_at)
              optionsText += `\n*Opção ${index + 1}:*\n${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n`
            })
          }

          message = `Olá! 

Ainda estou aqui caso queira agendar a aula. 

Se alguma dessas opções funcionar, é só me avisar:

📅 *Opções Disponíveis:*
${optionsText}Qualquer dúvida, estou à disposição! 💚

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_48h = true
        }
        // 72 horas depois (última)
        else if (hoursDiff >= 72 && hoursDiff < 73 && !context[notificationKey]?.sent_72h) {
          message = `Olá! 

Esta é minha última mensagem sobre a aula. Se ainda tiver interesse, me avise! 

Caso contrário, tudo bem também. 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_72h = true
          // Adicionar tag
          const newTags = [...new Set([...tags, 'sem_resposta'])]
          context.tags = newTags
        }

        if (shouldSend && message) {
          const result = await client.sendTextMessage({
            phone: conv.phone,
            message,
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conv.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })

            // Atualizar contexto
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context,
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', conv.id)

            sent++
          } else {
            errors++
          }
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar follow-up para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar follow-up:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Processo de fechamento/vendas pós-aula
 * Ativado quando admin adiciona tag "participou_aula"
 * Trabalha o emocional e lembra o motivo
 */
export async function sendSalesFollowUpAfterClass(): Promise<{
  sent: number
  errors: number
}> {
  try {
    const now = new Date()
    const area = 'nutri'

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: 0 }
    }

    // Buscar conversas que participaram mas ainda não receberam follow-up de vendas
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', area)
      .eq('status', 'active')

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // Filtrar quem participou mas não recebeu follow-up de vendas
    const participants = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      const hasParticipated = tags.includes('participou_aula')
      const hasReceivedSalesFollowUp = context.sales_follow_up_sent === true
      const isClient = tags.includes('cliente_nutri')
      
      return hasParticipated && !hasReceivedSalesFollowUp && !isClient
    })

    if (participants.length === 0) {
      return { sent: 0, errors: 0 }
    }

    let sent = 0
    let errors = 0

    for (const conv of participants) {
      try {
        const context = conv.context || {}
        const sessionId = context.workshop_session_id
        const leadName = conv.name || 'querido(a)'
        
        // Buscar sessão para saber quando foi
        let sessionDate: Date | null = null
        if (sessionId) {
          const { data: session } = await supabaseAdmin
            .from('whatsapp_workshop_sessions')
            .select('starts_at')
            .eq('id', sessionId)
            .single()
          
          if (session) {
            sessionDate = new Date(session.starts_at)
          }
        }

        const client = createZApiClient(instance.instance_id, instance.token)
        const notificationKey = 'sales_follow_up'

        // Calcular tempo desde a aula (se tiver data)
        let hoursSinceClass = 0
        if (sessionDate) {
          const sessionEndDate = new Date(sessionDate.getTime() + 45 * 60 * 1000) // 45 minutos depois
          const timeDiff = now.getTime() - sessionEndDate.getTime()
          hoursSinceClass = timeDiff / (1000 * 60 * 60)
        }

        let message: string | null = null
        let shouldSend = false

        // Primeira mensagem de fechamento (após 3 horas da aula)
        if (hoursSinceClass >= 3 && hoursSinceClass < 4 && !context[notificationKey]?.sent_3h) {
          message = `Olá ${leadName}! 💚

Espero que a aula tenha sido transformadora para você! 

Lembro que você veio porque tinha um sonho, um objetivo... algo que te moveu a buscar essa mudança. 🌟

Agora que você já viu o caminho, que tal darmos o próximo passo juntas?

Estou aqui para te ajudar a transformar esse sonho em realidade. 

Quer conversar sobre como podemos fazer isso acontecer? 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_3h = true
        }
        // Segunda mensagem (após 6 horas)
        else if (hoursSinceClass >= 6 && hoursSinceClass < 7 && !context[notificationKey]?.sent_6h) {
          message = `Olá ${leadName}! 

Pensando em você aqui... 💭

Sabe, muitas vezes a gente sabe o que precisa fazer, mas falta aquele empurrãozinho, aquele apoio para realmente começar.

Você não precisa fazer isso sozinha. 

Estou aqui para te apoiar em cada passo dessa jornada. 

Que tal conversarmos sobre como podemos fazer isso acontecer? 💚

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_6h = true
        }
        // Terceira mensagem (após 12 horas)
        else if (hoursSinceClass >= 12 && hoursSinceClass < 13 && !context[notificationKey]?.sent_12h) {
          message = `Olá ${leadName}! 

Lembro do motivo que te trouxe até aqui... 🌟

Você tinha um objetivo, um sonho. Algo que te moveu a buscar essa mudança.

Não deixe que esse momento passe. Não deixe que a rotina te distraia do que realmente importa.

Você merece ver esse sonho se tornar realidade. 

Estou aqui para te ajudar. Vamos conversar? 💚

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_12h = true
        }
        // Quarta mensagem (após 24 horas)
        else if (hoursSinceClass >= 24 && hoursSinceClass < 25 && !context[notificationKey]?.sent_24h) {
          message = `Olá ${leadName}! 

Passou um dia desde a aula... 

E eu fico pensando: será que você já começou a aplicar o que aprendeu? 

Ou será que ainda está esperando o "momento perfeito"? 

Sabe, o momento perfeito não existe. O momento certo é AGORA. 

Você já deu o primeiro passo ao participar da aula. 

Agora é hora de dar o segundo passo e transformar isso em realidade. 

Estou aqui para te ajudar. Vamos conversar? 💚

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }
        // Quinta mensagem (após 48 horas - última)
        else if (hoursSinceClass >= 48 && hoursSinceClass < 49 && !context[notificationKey]?.sent_48h) {
          message = `Olá ${leadName}! 

Esta é minha última mensagem sobre isso... 

Mas antes, quero te lembrar: você veio até aqui por um motivo. 

Você tinha um sonho, um objetivo. Algo que te moveu. 

Não deixe que esse momento passe. Não deixe que a vida te distraia do que realmente importa. 

Você merece ver esse sonho se tornar realidade. 

Se ainda quiser conversar sobre como podemos fazer isso acontecer, estou aqui. 

Mas não deixe passar mais tempo. O momento é AGORA. 💚

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_48h = true
          context.sales_follow_up_sent = true
        }

        if (shouldSend && message) {
          const result = await client.sendTextMessage({
            phone: conv.phone,
            message,
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conv.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })

            // Atualizar contexto
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context,
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', conv.id)

            sent++
          } else {
            errors++
          }
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar follow-up de vendas para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar follow-up de vendas:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Envia link de cadastro imediatamente após pessoa participar da aula
 * Ativado quando admin adiciona tag "participou_aula"
 * Inclui argumentação e provoca manifestação de interesse/objeções
 */
export async function sendRegistrationLinkAfterClass(conversationId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const area = 'nutri'

    // Buscar conversa
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('id', conversationId)
      .eq('area', area)
      .single()

    if (!conversation) {
      return { success: false, error: 'Conversa não encontrada' }
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    // Verificar se já participou
    if (!tags.includes('participou_aula')) {
      return { success: false, error: 'Pessoa ainda não participou da aula' }
    }

    // Verificar se já recebeu link de cadastro
    if (context.registration_link_sent === true) {
      return { success: false, error: 'Link de cadastro já foi enviado' }
    }

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { success: false, error: 'Instância Z-API não encontrada' }
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    const leadName = conversation.name || 'querido(a)'

    // Link de cadastro (configurável via variável de ambiente ou banco)
    const registrationUrl = process.env.NUTRI_REGISTRATION_URL || 'https://ylada.com/pt/nutri/cadastro'

    // Mensagem com link de cadastro e argumentação
    const message = `Olá ${leadName}! 🎉

Que alegria ter você aqui! Espero que a aula tenha sido transformadora para você! 💚

Agora que você já viu o caminho, que tal darmos o próximo passo juntas?

Temos programas incríveis que vão te ajudar a transformar seu sonho em realidade:

🌟 *Qual você prefere começar?*

🔗 *Acesse aqui para ver os programas e fazer seu cadastro:*
${registrationUrl}

O que você acha? Já quer começar ou tem alguma dúvida? 

Estou aqui para te ajudar em cada passo! 😊

Carol - Secretária YLADA Nutri`

    const result = await client.sendTextMessage({
      phone: conversation.phone,
      message,
    })

    if (result.success) {
      // Salvar mensagem
      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversation.id,
        instance_id: instance.id,
        z_api_message_id: result.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })

      // Atualizar contexto
      context.registration_link_sent = true
      context.registration_link_sent_at = new Date().toISOString()

      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context,
          last_message_at: new Date().toISOString(),
          last_message_from: 'bot',
        })
        .eq('id', conversation.id)

      return { success: true }
    } else {
      return { success: false, error: 'Erro ao enviar mensagem' }
    }
  } catch (error: any) {
    console.error('[Carol] Erro ao enviar link de cadastro:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Direciona pessoa para suporte após pagamento confirmado
 * Envia mensagem com link para WhatsApp do suporte: 5519996049800
 */
export async function redirectToSupportAfterPayment(
  conversationId: string,
  paymentInfo?: { amount?: number; plan?: string }
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const area = 'nutri'
    const supportPhone = '5519996049800'

    // Buscar conversa
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('id', conversationId)
      .eq('area', area)
      .single()

    if (!conversation) {
      return { success: false, error: 'Conversa não encontrada' }
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    // Verificar se já foi direcionado
    if (context.redirected_to_support === true) {
      return { success: false, error: 'Já foi direcionado para suporte' }
    }

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { success: false, error: 'Instância Z-API não encontrada' }
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    const leadName = conversation.name || 'querido(a)'

    // Criar link do WhatsApp do suporte
    const supportWhatsAppLink = `https://wa.me/${supportPhone.replace(/\D/g, '')}`

    // Mensagem de direcionamento para suporte
    const message = `Olá ${leadName}! 🎉

Parabéns! Seu pagamento foi confirmado! 🎉

Agora você vai receber todo o suporte e orientação que precisa para começar sua jornada!

📱 *Entre em contato com nosso suporte:*
${supportWhatsAppLink}

Ou envie uma mensagem para: ${supportPhone}

Lá você vai receber:
✅ Materiais de suporte e orientação
✅ Acompanhamento personalizado
✅ Tudo que precisa para começar

Estamos aqui para te apoiar em cada passo! 💚

Carol - Secretária YLADA Nutri`

    const result = await client.sendTextMessage({
      phone: conversation.phone,
      message,
    })

    if (result.success) {
      // Salvar mensagem
      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversation.id,
        instance_id: instance.id,
        z_api_message_id: result.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })

      // Atualizar contexto e tags
      context.redirected_to_support = true
      context.redirected_to_support_at = new Date().toISOString()
      context.payment_confirmed = true
      context.payment_info = paymentInfo || {}

      const newTags = [...new Set([...tags, 'pagamento_confirmado', 'direcionado_suporte'])]

      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context,
          tags: newTags,
          last_message_at: new Date().toISOString(),
          last_message_from: 'bot',
        })
        .eq('id', conversation.id)

      return { success: true }
    } else {
      return { success: false, error: 'Erro ao enviar mensagem' }
    }
  } catch (error: any) {
    console.error('[Carol] Erro ao direcionar para suporte:', error)
    return { success: false, error: error.message }
  }
}
