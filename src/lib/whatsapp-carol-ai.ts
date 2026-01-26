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
 * Verifica se está em horário permitido para enviar mensagens automáticas
 * Regras:
 * - Segunda a sexta: 8h00 às 19h00 (horário de Brasília)
 * - Sábado: até 13h00
 * - Domingo: não enviar (exceto lembretes específicos)
 */
export function isAllowedTimeToSendMessage(): { allowed: boolean; reason?: string; nextAllowedTime?: Date } {
  const now = new Date()
  
  // Converter para horário de Brasília
  const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
  const hour = brasiliaTime.getHours()
  const dayOfWeek = brasiliaTime.getDay() // 0 = domingo, 1 = segunda, ..., 6 = sábado
  
  // Domingo: não permitir (exceto lembretes específicos)
  if (dayOfWeek === 0) {
    const nextMonday = new Date(brasiliaTime)
    nextMonday.setDate(brasiliaTime.getDate() + 1) // Próxima segunda
    nextMonday.setHours(8, 0, 0, 0) // 8h00
    return { 
      allowed: false, 
      reason: 'Domingo - mensagens automáticas não são enviadas',
      nextAllowedTime: nextMonday
    }
  }
  
  // Sábado: até 13h00
  if (dayOfWeek === 6) {
    if (hour < 8) {
      const saturday8am = new Date(brasiliaTime)
      saturday8am.setHours(8, 0, 0, 0)
      return { 
        allowed: false, 
        reason: 'Antes das 8h00 - aguarde até 8h00',
        nextAllowedTime: saturday8am
      }
    }
    if (hour >= 13) {
      const nextMonday = new Date(brasiliaTime)
      nextMonday.setDate(brasiliaTime.getDate() + 2) // Próxima segunda (pula domingo)
      nextMonday.setHours(8, 0, 0, 0) // 8h00
      return { 
        allowed: false, 
        reason: 'Sábado após 13h00 - aguarde até segunda-feira 8h00',
        nextAllowedTime: nextMonday
      }
    }
    return { allowed: true }
  }
  
  // Segunda a sexta: 8h00 às 19h00
  if (hour < 8) {
    const today8am = new Date(brasiliaTime)
    today8am.setHours(8, 0, 0, 0)
    return { 
      allowed: false, 
      reason: 'Antes das 8h00 - aguarde até 8h00',
      nextAllowedTime: today8am
    }
  }
  
  if (hour >= 19) {
    const tomorrow8am = new Date(brasiliaTime)
    tomorrow8am.setDate(brasiliaTime.getDate() + 1)
    tomorrow8am.setHours(8, 0, 0, 0)
    
    // Se for sexta após 19h, próxima segunda
    if (dayOfWeek === 5) {
      tomorrow8am.setDate(brasiliaTime.getDate() + 3) // Pula sábado e domingo
    }
    
    return { 
      allowed: false, 
      reason: 'Após 19h00 - aguarde até próximo horário permitido',
      nextAllowedTime: tomorrow8am
    }
  }
  
  return { allowed: true }
}

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

IMPORTANTE - SUGERIR SESSÕES ALTERNATIVAS:
- Se a pessoa mencionar preferência por "noite", "tarde" ou "manhã" e as opções mostradas não corresponderem, você DEVE sugerir a sessão que melhor se encaixa
- Exemplo: Se pessoa diz "prefiro à noite" e você mostrou apenas opções de manhã/tarde, sugira a sessão noturna (quarta 20h se existir)
- Se a pessoa mencionar preferência de período e não houver correspondência nas opções mostradas, busque nas próximas sessões disponíveis e sugira a melhor opção
- Seja proativa: "Vi que você prefere à noite! Temos uma opção perfeita: quarta-feira às 20h. Quer que eu te envie o link?"

PRIMEIRA MENSAGEM (IMPORTANTE):
- Se é a primeira mensagem da pessoa, você DEVE enviar TUDO em UMA ÚNICA mensagem:
  1. Primeira linha: "Oi, tudo bem? 😊" (SE o nome da pessoa estiver disponível, use: "Oi [NOME], tudo bem? 😊")
  
  2. Segunda linha: "Seja muito bem-vinda!" (NÃO repita o nome aqui - use apenas "Seja muito bem-vinda!")
  
  3. Terceira linha: "Eu sou a Carol, da equipe Ylada Nutri."
  
  **CRUCIAL: Essas três primeiras frases devem estar em LINHAS SEPARADAS, uma em cada linha. NÃO junte tudo em uma linha só!**
  
  4. Deixar uma LINHA EM BRANCO
  
  5. Agradecer e explicar sobre a aula focando na DOR e no BENEFÍCIO:
     "Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.
     
     Essa aula é 100% prática e foi criada para ajudar nutricionistas que estão com agenda ociosa a organizar, atrair e preencher atendimentos de forma mais leve e estratégica."
  
  6. Deixar uma LINHA EM BRANCO
  
  7. Depois apresentar as opções: "As próximas aulas ao vivo vão acontecer nos seguintes dias e horários:"
  
  8. JÁ apresentar as duas próximas opções de aula (usando o formato fornecido - apenas dias e horários, SEM links)
  
  9. Perguntar de forma natural: "Qual desses horários funciona melhor pra você? 😊" (SEM botões, apenas texto)
  
  10. NÃO esperar a pessoa perguntar sobre horários - você já apresenta!
  
  11. Use linguagem próxima, humanizada e acolhedora, como se estivesse conversando pessoalmente
  
  12. **CRUCIAL: Se você souber o nome da pessoa (fornecido no contexto), SEMPRE use o nome dela na saudação inicial!**
  
  13. **MUITO IMPORTANTE: TUDO isso deve estar em UMA ÚNICA mensagem. NUNCA divida em múltiplas mensagens. Mantenha tudo unificado.**

QUANDO FAZER REMARKETING:
- Pessoa agendou mas não participou
- PRIMEIRO pergunte se ainda tem interesse, FOCANDO NA DOR: "Você ainda tem interesse em aprender como encher sua agenda?" ou "Você quer saber como ter mais clientes?"
- NÃO mencione "programa" - foque na dor e no benefício específico (encher agenda, ter mais clientes)
- Seja empática: "Vi que você não conseguiu participar da aula anterior. Tudo bem, acontece! 😊"
- Se a pessoa responder positivamente, ENTÃO ofereça novas opções de data/hora
- Seja persistente mas respeitosa
- IMPORTANTE: Não envie as datas imediatamente. Primeiro confirme o interesse focando na dor dela!

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
- **CRUCIAL: SEMPRE envie TUDO em UMA ÚNICA mensagem. NUNCA divida sua resposta em múltiplas mensagens.**
- **IMPORTANTE: Mantenha a mensagem unificada e coesa. Não separe informações que deveriam estar juntas.**

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
- Lembre o motivo pelo qual ela veio até aqui

QUANDO PRECISAR DE ATENDIMENTO HUMANO:
- Se a pessoa pedir explicitamente para falar com alguém: "quero falar com alguém", "preciso de atendimento", "quero falar com suporte"
- Se a pessoa tiver problemas técnicos complexos que você não consegue resolver
- Se a pessoa tiver questões sobre pagamento, reembolso ou problemas financeiros que você não consegue resolver
- Se a pessoa estiver insatisfeita ou reclamando de forma que exija intervenção humana
- Se a pessoa pedir para cancelar ou desistir e você já tentou trabalhar a objeção sem sucesso
- Se a situação for muito complexa ou específica que você não tem informações suficientes

Quando detectar necessidade de atendimento humano, você DEVE:
1. Ser empática e acolhedora
2. Informar que vai direcionar para o atendimento humano
3. Garantir que a pessoa será atendida
4. NÃO tente resolver sozinha se realmente precisa de humano

IMPORTANTE: Se você detectar necessidade de atendimento humano, inclua na sua resposta uma indicação clara, mas continue sendo acolhedora.`

/**
 * Gera resposta da Carol usando OpenAI
 * Exportada para uso em testes e simulações
 */
export async function generateCarolResponse(
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
    // 🆕 Nome da pessoa (MUITO IMPORTANTE - sempre incluir se disponível)
    if (context.leadName) {
      contextText += `\n⚠️ NOME DA PESSOA: ${context.leadName}\n`
      contextText += `IMPORTANTE: Você DEVE usar o nome "${context.leadName}" na saudação inicial!\n`
      contextText += `Exemplo: "Oi ${context.leadName}, tudo bem? 😊" ou "Seja muito bem-vinda, ${context.leadName}!"\n`
    }
    
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
      // Nota: Usar 🗓️ em vez de 📅 pois o emoji 📅 mostra data atual do sistema
      formattedSessionsText = '🗓️ *Opções de Aula Disponíveis:*\n\n'
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
        contextText += `Você DEVE seguir EXATAMENTE esta estrutura:\n\n`
        if (context.leadName) {
          contextText += `1. Primeira linha: "Oi ${context.leadName}, tudo bem? 😊" (USE O NOME DA PESSOA!)\n`
          contextText += `2. Segunda linha: "Seja muito bem-vinda!" (NÃO repita o nome aqui - use apenas "Seja muito bem-vinda!")\n`
        } else {
          contextText += `1. Primeira linha: "Oi, tudo bem? 😊"\n`
          contextText += `2. Segunda linha: "Seja muito bem-vinda!"\n`
        }
        contextText += `3. Terceira linha: "Eu sou a Carol, da equipe Ylada Nutri."\n\n`
        contextText += `IMPORTANTE: Essas três primeiras frases devem estar em LINHAS SEPARADAS, uma em cada linha, sem juntar tudo em uma linha só!\n\n`
        contextText += `4. Agradecer e explicar sobre a aula focando na DOR e no BENEFÍCIO:\n`
        contextText += `"Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.\n\n`
        contextText += `Essa aula é 100% prática e foi criada para ajudar nutricionistas que estão com agenda ociosa a organizar, atrair e preencher atendimentos de forma mais leve e estratégica."\n\n`
        contextText += `5. Depois apresentar: "As próximas aulas ao vivo vão acontecer nos seguintes dias e horários:"\n\n`
        contextText += `6. JÁ apresentar as duas próximas opções usando EXATAMENTE este formato (SEM links, apenas dias e horários):\n\n${formattedSessionsText}\n\n`
        contextText += `7. Perguntar de forma natural: "Qual desses horários funciona melhor pra você? 😊" (SEM botões, apenas texto)\n\n`
        contextText += `IMPORTANTE:\n`
        contextText += `- Use linguagem próxima, humanizada e acolhedora, como se estivesse conversando pessoalmente\n`
        contextText += `- NÃO espere a pessoa perguntar sobre horários - você já apresenta as opções na primeira mensagem!\n`
        contextText += `- NUNCA inclua links do Zoom nas opções. Apenas mostre dias e horários.\n`
        contextText += `- Foque na DOR (agenda ociosa) e no BENEFÍCIO (organizar, atrair e preencher atendimentos)\n`
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
 * Detecta se a conversa precisa de atendimento humano
 */
function detectNeedsHumanSupport(
  carolResponse: string,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): { detected: boolean; reason: string } {
  const responseLower = carolResponse.toLowerCase()
  const messageLower = userMessage.toLowerCase()
  
  // Palavras-chave na mensagem do usuário que indicam necessidade de humano
  const userKeywords = [
    'quero falar com alguém',
    'quero falar com uma pessoa',
    'preciso de atendimento',
    'quero atendimento humano',
    'quero falar com suporte',
    'quero cancelar',
    'quero desistir',
    'quero reembolso',
    'quero meu dinheiro de volta',
    'estou insatisfeita',
    'estou insatisfeito',
    'não estou satisfeita',
    'não estou satisfeito',
    'reclamação',
    'reclamar',
    'problema com pagamento',
    'erro no pagamento',
    'não recebi',
    'não funcionou',
    'não consigo acessar',
    'problema técnico',
  ]
  
  // Palavras-chave na resposta da Carol que indicam que ela detectou necessidade de humano
  const carolKeywords = [
    'vou direcionar',
    'direcionar para',
    'atendimento humano',
    'atendimento pessoal',
    'vou transferir',
    'transferir para',
    'não consigo ajudar',
    'precisa de ajuda',
    'vou encaminhar',
    'encaminhar para',
    'suporte técnico',
    'equipe de suporte',
  ]
  
  // Verificar mensagem do usuário
  const userNeedsHuman = userKeywords.some(keyword => messageLower.includes(keyword))
  
  // Verificar resposta da Carol
  const carolDetected = carolKeywords.some(keyword => responseLower.includes(keyword))
  
  if (userNeedsHuman) {
    // Identificar motivo específico
    if (messageLower.includes('cancelar') || messageLower.includes('desistir')) {
      return { detected: true, reason: 'Cliente quer cancelar/desistir' }
    }
    if (messageLower.includes('reembolso') || messageLower.includes('dinheiro de volta')) {
      return { detected: true, reason: 'Solicitação de reembolso' }
    }
    if (messageLower.includes('pagamento') || messageLower.includes('paguei')) {
      return { detected: true, reason: 'Problema com pagamento' }
    }
    if (messageLower.includes('insatisfeit') || messageLower.includes('reclama')) {
      return { detected: true, reason: 'Cliente insatisfeito/reclamação' }
    }
    if (messageLower.includes('técnico') || messageLower.includes('não funciona')) {
      return { detected: true, reason: 'Problema técnico' }
    }
    return { detected: true, reason: 'Cliente pediu atendimento humano' }
  }
  
  if (carolDetected) {
    return { detected: true, reason: 'Carol detectou necessidade de atendimento humano' }
  }
  
  // Verificar se há muitas mensagens sem progresso (possível frustração)
  const recentUserMessages = conversationHistory
    .filter(m => m.role === 'user')
    .slice(-3)
    .map(m => m.content.toLowerCase())
  
  const hasRepeatedQuestions = recentUserMessages.length >= 2 && 
    recentUserMessages.some(msg => 
      msg.includes('?') && recentUserMessages.filter(m => m.includes('?')).length >= 2
    )
  
  if (hasRepeatedQuestions && conversationHistory.length > 6) {
    return { detected: true, reason: 'Múltiplas perguntas sem resolução - possível frustração' }
  }
  
  return { detected: false, reason: '' }
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
          const { weekday, date, time } = formatSessionDateTime(workshopSessions[optionIndex].starts_at)
          console.log('[Carol AI] ✅ Sessão detectada por número/ordem:', {
            optionIndex: optionIndex + 1,
            sessionId: workshopSessions[optionIndex].id,
            weekday,
            date,
            time,
            starts_at: workshopSessions[optionIndex].starts_at,
            message: messageLower
          })
          selectedSession = {
            id: workshopSessions[optionIndex].id,
            title: workshopSessions[optionIndex].title,
            starts_at: workshopSessions[optionIndex].starts_at,
            zoom_link: workshopSessions[optionIndex].zoom_link
          }
        } else {
          console.log('[Carol AI] ⚠️ Índice de opção inválido:', {
            optionIndex,
            sessionsCount: workshopSessions.length,
            message: messageLower
          })
        }
      }
      
      // Detectar por dia/horário: "segunda às 10:00", "26/01 às 10:00", "segunda s 10hs", etc
      if (!selectedSession) {
        // Extrair números de horário da mensagem (ex: "10", "15", "9", "20")
        const hourMatches = messageLower.match(/\b(\d{1,2})\s*(?:h|hs|horas|:)/g)
        const hoursInMessage: number[] = []
        if (hourMatches) {
          hourMatches.forEach(match => {
            const hour = parseInt(match.replace(/\D/g, ''))
            if (hour >= 0 && hour <= 23) {
              hoursInMessage.push(hour)
            }
          })
        }
        
        // Se não encontrou padrão "10h", tentar números soltos que podem ser horários
        if (hoursInMessage.length === 0) {
          const numberMatches = messageLower.match(/\b([0-9]|1[0-9]|2[0-3])\b/g)
          if (numberMatches) {
            numberMatches.forEach(match => {
              const hour = parseInt(match)
              if (hour >= 0 && hour <= 23) {
                hoursInMessage.push(hour)
              }
            })
          }
        }

        console.log('[Carol AI] 🔍 Detecção de horário:', {
          message: messageLower,
          hoursInMessage,
          sessions: workshopSessions.map(s => {
            const { weekday, date, time } = formatSessionDateTime(s.starts_at)
            const hour = parseInt(time.split(':')[0])
            return { weekday, time, hour, starts_at: s.starts_at }
          })
        })

        for (const sessionItem of workshopSessions) {
          const { weekday, date, time } = formatSessionDateTime(sessionItem.starts_at)
          const weekdayLower = weekday.toLowerCase()
          const sessionHour = parseInt(time.split(':')[0]) // Extrair apenas a hora (ex: "10:00" -> 10)
          
          // Verificar se mensagem contém dia da semana ou data
          const hasDayMatch = 
            messageLower.includes(weekdayLower.substring(0, 5)) || // "segunda", "terça", etc
            messageLower.includes(date.replace(/\//g, '')) || // "26012026"
            messageLower.includes(date.split('/')[0]) // "26"
          
          // Verificar se menciona horário de várias formas
          const hasTimeMatch = 
            messageLower.includes(time.replace(':', '')) || // "10:00" -> "1000"
            messageLower.includes(time) || // "10:00"
            messageLower.includes(`${sessionHour}h`) || // "10h"
            messageLower.includes(`${sessionHour}hs`) || // "10hs"
            messageLower.includes(`${sessionHour} horas`) || // "10 horas"
            hoursInMessage.includes(sessionHour) // Número extraído corresponde ao horário
          
          if (hasDayMatch && hasTimeMatch) {
            console.log('[Carol AI] ✅ Sessão detectada por dia/horário:', {
              sessionId: sessionItem.id,
              weekday,
              time,
              hour: sessionHour,
              message: messageLower
            })
            selectedSession = {
              id: sessionItem.id,
              title: sessionItem.title,
              starts_at: sessionItem.starts_at,
              zoom_link: sessionItem.zoom_link
            }
            break
          }
          
          // Se não encontrou dia mas encontrou horário exato, usar mesmo assim
          // (útil quando pessoa só diz "10h" ou "15h")
          if (!selectedSession && hasTimeMatch && hoursInMessage.length === 1) {
            console.log('[Carol AI] ✅ Sessão detectada apenas por horário:', {
              sessionId: sessionItem.id,
              time,
              hour: sessionHour,
              message: messageLower
            })
            selectedSession = {
              id: sessionItem.id,
              title: sessionItem.title,
              starts_at: sessionItem.starts_at,
              zoom_link: sessionItem.zoom_link
            }
            break
          }
        }
        
        // 🆕 Detectar preferência por período do dia (noite, tarde, manhã) e sugerir sessão apropriada
        if (!selectedSession) {
          const messageLower = message.toLowerCase()
          const prefersNight = messageLower.includes('noite') || 
                              messageLower.includes('noturno') || 
                              messageLower.includes('à noite') ||
                              messageLower.includes('a noite') ||
                              messageLower.includes('noitinha')
          const prefersAfternoon = messageLower.includes('tarde') || 
                                  messageLower.includes('à tarde') ||
                                  messageLower.includes('a tarde')
          const prefersMorning = messageLower.includes('manhã') || 
                                messageLower.includes('manha') ||
                                messageLower.includes('de manhã') ||
                                messageLower.includes('de manha')
          
          if (prefersNight || prefersAfternoon || prefersMorning) {
            // Buscar sessões que correspondam ao período preferido
            for (const sessionItem of workshopSessions) {
              const { weekday, date, time } = formatSessionDateTime(sessionItem.starts_at)
              const sessionHour = parseInt(time.split(':')[0])
              
              // Noite: 18h-23h
              if (prefersNight && sessionHour >= 18 && sessionHour <= 23) {
                console.log('[Carol AI] ✅ Sessão noturna detectada por preferência:', {
                  sessionId: sessionItem.id,
                  weekday,
                  time,
                  hour: sessionHour,
                  message: messageLower
                })
                selectedSession = {
                  id: sessionItem.id,
                  title: sessionItem.title,
                  starts_at: sessionItem.starts_at,
                  zoom_link: sessionItem.zoom_link
                }
                break
              }
              
              // Tarde: 12h-17h
              if (prefersAfternoon && sessionHour >= 12 && sessionHour < 18) {
                console.log('[Carol AI] ✅ Sessão da tarde detectada por preferência:', {
                  sessionId: sessionItem.id,
                  weekday,
                  time,
                  hour: sessionHour,
                  message: messageLower
                })
                selectedSession = {
                  id: sessionItem.id,
                  title: sessionItem.title,
                  starts_at: sessionItem.starts_at,
                  zoom_link: sessionItem.zoom_link
                }
                break
              }
              
              // Manhã: 6h-11h
              if (prefersMorning && sessionHour >= 6 && sessionHour < 12) {
                console.log('[Carol AI] ✅ Sessão da manhã detectada por preferência:', {
                  sessionId: sessionItem.id,
                  weekday,
                  time,
                  hour: sessionHour,
                  message: messageLower
                })
                selectedSession = {
                  id: sessionItem.id,
                  title: sessionItem.title,
                  starts_at: sessionItem.starts_at,
                  zoom_link: sessionItem.zoom_link
                }
                break
              }
            }
            
            // Se não encontrou nas opções já mostradas, buscar TODAS as sessões futuras para encontrar a melhor correspondência
            if (!selectedSession) {
              const now = new Date()
              const minDate = new Date(now.getTime() + 5 * 60 * 1000)
              
              const { data: allSessions } = await supabaseAdmin
                .from('whatsapp_workshop_sessions')
                .select('id, title, starts_at, zoom_link')
                .eq('area', area)
                .eq('is_active', true)
                .gte('starts_at', minDate.toISOString())
                .order('starts_at', { ascending: true })
                .limit(10) // Buscar mais sessões para encontrar correspondência
              
              if (allSessions && allSessions.length > 0) {
                for (const sessionItem of allSessions) {
                  const { weekday, date, time } = formatSessionDateTime(sessionItem.starts_at)
                  const sessionHour = parseInt(time.split(':')[0])
                  
                  // Noite: 18h-23h (prioridade para 20h se existir)
                  if (prefersNight && sessionHour >= 18 && sessionHour <= 23) {
                    // Priorizar 20h se existir
                    if (sessionHour === 20) {
                      console.log('[Carol AI] ✅ Sessão noturna (20h) encontrada:', {
                        sessionId: sessionItem.id,
                        weekday,
                        time
                      })
                      selectedSession = {
                        id: sessionItem.id,
                        title: sessionItem.title,
                        starts_at: sessionItem.starts_at,
                        zoom_link: sessionItem.zoom_link
                      }
                      break
                    } else if (!selectedSession) {
                      // Se não encontrou 20h ainda, guardar esta como opção
                      selectedSession = {
                        id: sessionItem.id,
                        title: sessionItem.title,
                        starts_at: sessionItem.starts_at,
                        zoom_link: sessionItem.zoom_link
                      }
                    }
                  }
                  
                  // Tarde: 12h-17h
                  if (prefersAfternoon && sessionHour >= 12 && sessionHour < 18 && !selectedSession) {
                    selectedSession = {
                      id: sessionItem.id,
                      title: sessionItem.title,
                      starts_at: sessionItem.starts_at,
                      zoom_link: sessionItem.zoom_link
                    }
                    break
                  }
                  
                  // Manhã: 6h-11h
                  if (prefersMorning && sessionHour >= 6 && sessionHour < 12 && !selectedSession) {
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
        }
      }
    }

    // Se detectou escolha, enviar imagem + link e retornar
    if (selectedSession) {
      // 🛡️ Verificar se já agendou para evitar duplicação
      const hasScheduled = tags.includes('agendou_aula') || tags.includes('recebeu_link_workshop') || context.workshop_session_id
      
      if (hasScheduled) {
        console.log('[Carol AI] ⚠️ Pessoa já agendou, evitando envio duplicado:', {
          sessionId: selectedSession.id,
          existingTags: tags,
          existingSessionId: context.workshop_session_id
        })
        // Não enviar mensagem de confirmação novamente, apenas continuar com resposta normal
        // (não retornar aqui, deixar continuar o fluxo normal de resposta)
        selectedSession = null // Resetar para não processar como novo agendamento
      } else {
        console.log('[Carol AI] ✅ Escolha detectada:', {
          sessionId: selectedSession.id,
          startsAt: selectedSession.starts_at,
          message
        })
      }
      
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
      } else if (!hasScheduled) {
        // Só enviar mensagem de confirmação se ainda não agendou
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
        
        // 2. Enviar mensagem com link (mais entusiasmada e criando expectativa)
        // Nota: Não usar emoji 📅 pois ele mostra a data atual do sistema, não a data da aula
        const linkMessage = `✅ *Perfeito! Você vai adorar essa aula!* 🎉\n\n🗓️ ${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n🔗 ${selectedSession.zoom_link}\n\n💡 *Dica importante:* A sala do Zoom será aberta 10 minutos antes do horário da aula. Chegue com antecedência para garantir sua vaga! 😊\n\nQualquer dúvida, é só me chamar! 💚`
        
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
          // Usar timezone de Brasília para cálculo correto
          const sessionDate = new Date(selectedSession.starts_at)
          const now = new Date()
          const nowBrasilia = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
          const sessionBrasilia = new Date(sessionDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
          const timeDiff = sessionBrasilia.getTime() - nowBrasilia.getTime()
          const hoursDiff = timeDiff / (1000 * 60 * 60)
          
          // Buscar nome do cadastro para usar no lembrete
          let leadNameForReminder = conversation.name || 'querido(a)'
          try {
            const phoneClean = phone.replace(/\D/g, '')
            
            // Tentar buscar de workshop_inscricoes primeiro
            const { data: workshopReg } = await supabaseAdmin
              .from('workshop_inscricoes')
              .select('nome')
              .ilike('telefone', `%${phoneClean.slice(-8)}%`)
              .limit(1)
              .maybeSingle()
            
            if (workshopReg?.nome) {
              leadNameForReminder = workshopReg.nome
            } else {
              // Fallback para contact_submissions
              const { data: contactReg } = await supabaseAdmin
                .from('contact_submissions')
                .select('name, nome')
                .or(`phone.ilike.%${phoneClean.slice(-8)}%,telefone.ilike.%${phoneClean.slice(-8)}%`)
                .limit(1)
                .maybeSingle()
              
              if (contactReg?.name || contactReg?.nome) {
                leadNameForReminder = contactReg.name || contactReg.nome || leadNameForReminder
              }
            }
          } catch (error: any) {
            console.warn('[Carol] Erro ao buscar nome do cadastro para lembrete:', error.message)
          }
          
          // Se está entre 12h e 13h antes, já enviar lembrete de 12h
          // Se está entre 2h e 2h30 antes, já enviar lembrete de 2h
          let reminderToSend: string | null = null
          if (hoursDiff >= 12 && hoursDiff < 13) {
            // Lembrete de 12h (recomendação computador)
            const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
            reminderToSend = `Olá ${leadNameForReminder}! 

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
            reminderToSend = `Olá ${leadNameForReminder}! 

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
          
          // 🆕 Enviar notificação para telefone de notificação sobre o agendamento
          try {
            const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
            if (notificationPhone) {
              const conversation = await supabaseAdmin
                .from('whatsapp_conversations')
                .select('name, phone')
                .eq('id', conversationId)
                .single()
              
              if (conversation.data) {
                const { weekday, date, time } = formatSessionDateTime(selectedSession.starts_at)
                const notificationMessage = `🎉 *NOVO AGENDAMENTO DE AULA!*\n\n👤 *Nome:* ${conversation.data.name || 'Sem nome'}\n📱 *Telefone:* ${conversation.data.phone}\n🗓️ *Data/Hora:* ${weekday}, ${date} às ${time}\n🔗 *Link Zoom:* ${selectedSession.zoom_link}\n\n✅ A pessoa já recebeu o link da aula!`
                
                // Buscar instância Z-API para enviar notificação
                const { data: notificationInstance } = await supabaseAdmin
                  .from('z_api_instances')
                  .select('instance_id, token')
                  .eq('status', 'connected')
                  .limit(1)
                  .maybeSingle()
                
                if (notificationInstance) {
                  const notificationClient = createZApiClient({
                    instanceId: notificationInstance.instance_id,
                    token: notificationInstance.token,
                  })
                  
                  await notificationClient.sendTextMessage({
                    phone: notificationPhone,
                    message: notificationMessage,
                  })
                  
                  console.log('[Carol AI] ✅ Notificação de agendamento enviada para', notificationPhone)
                } else {
                  console.warn('[Carol AI] ⚠️ Instância Z-API não encontrada para enviar notificação')
                }
              }
            }
          } catch (notifError: any) {
            console.warn('[Carol AI] ⚠️ Erro ao enviar notificação de agendamento:', notifError.message)
          }
          
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

    // 6. Buscar nome do cadastro (prioridade sobre nome do WhatsApp)
    let registrationName: string | null = null
    try {
      // Buscar telefone da conversa
      const { data: convWithPhone } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('phone')
        .eq('id', conversationId)
        .single()
      
      if (convWithPhone?.phone) {
        const phoneClean = convWithPhone.phone.replace(/\D/g, '')
        
        // Tentar buscar de workshop_inscricoes primeiro
        const { data: workshopReg } = await supabaseAdmin
          .from('workshop_inscricoes')
          .select('nome')
          .ilike('telefone', `%${phoneClean.slice(-8)}%`) // Buscar pelos últimos 8 dígitos
          .limit(1)
          .maybeSingle()
        
        if (workshopReg?.nome) {
          registrationName = workshopReg.nome
        } else {
          // Fallback para contact_submissions
          const { data: contactReg } = await supabaseAdmin
            .from('contact_submissions')
            .select('name, nome')
            .or(`phone.ilike.%${phoneClean.slice(-8)}%,telefone.ilike.%${phoneClean.slice(-8)}%`)
            .limit(1)
            .maybeSingle()
          
          if (contactReg?.name || contactReg?.nome) {
            registrationName = contactReg.name || contactReg.nome || null
          }
        }
        
        // Atualizar lead_name no context se encontrou nome do cadastro
        if (registrationName && registrationName !== (context as any)?.lead_name) {
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                lead_name: registrationName
              }
            })
            .eq('id', conversationId)
          
          // Atualizar context local
          context.lead_name = registrationName
        }
      }
    } catch (error: any) {
      console.warn('[Carol AI] Erro ao buscar nome do cadastro:', error.message)
    }

    // 7. Gerar resposta da Carol
    console.log('[Carol AI] 💭 Gerando resposta com contexto:', {
      tags,
      hasSessions: workshopSessions.length > 0,
      leadName: registrationName || (context as any)?.lead_name || conversation.name,
      hasScheduled,
      participated,
      isFirstMessage
    })

    // 🆕 Priorizar nome do cadastro sobre nome do WhatsApp
    const leadName = registrationName || (context as any)?.lead_name || conversation.name || undefined
    
    const carolResponse = await generateCarolResponse(message, conversationHistory, {
      tags,
      workshopSessions,
      leadName: leadName, // 🆕 Sempre passar o nome se disponível
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

    // 10. Detectar se precisa de atendimento humano e enviar notificação
    const needsHumanSupport = detectNeedsHumanSupport(carolResponse, message, conversationHistory)
    if (needsHumanSupport.detected) {
      try {
        const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
        if (notificationPhone) {
          const { data: convData } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('name, phone, context')
            .eq('id', conversationId)
            .single()
          
          if (convData) {
            const tags = Array.isArray(convData.context?.tags) ? convData.context.tags : []
            const notificationMessage = `🚨 *ATENDIMENTO HUMANO NECESSÁRIO*\n\n👤 *Nome:* ${convData.name || 'Sem nome'}\n📱 *Telefone:* ${convData.phone}\n\n📝 *Última mensagem da pessoa:*\n"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"\n\n🤖 *Resposta da Carol:*\n"${carolResponse.substring(0, 200)}${carolResponse.length > 200 ? '...' : ''}"\n\n🔍 *Motivo:* ${needsHumanSupport.reason}\n\n🏷️ *Tags:* ${tags.length > 0 ? tags.join(', ') : 'Nenhuma'}\n\n⚠️ *Ação necessária:* Entrar na conversa e atender pessoalmente`
            
            // Buscar instância Z-API para enviar notificação
            const { data: notificationInstance } = await supabaseAdmin
              .from('z_api_instances')
              .select('instance_id, token')
              .eq('status', 'connected')
              .limit(1)
              .maybeSingle()
            
            if (notificationInstance) {
              const notificationClient = createZApiClient({
                instanceId: notificationInstance.instance_id,
                token: notificationInstance.token,
              })
              
              await notificationClient.sendTextMessage({
                phone: notificationPhone,
                message: notificationMessage,
              })
              
              console.log('[Carol AI] ✅ Notificação de atendimento humano enviada para', notificationPhone)
              
              // Adicionar tag de atendimento manual
              const newTags = [...new Set([...tags, 'atendimento_manual', 'precisa_atendimento_humano'])]
              await supabaseAdmin
                .from('whatsapp_conversations')
                .update({
                  context: {
                    ...convData.context,
                    tags: newTags,
                    needs_human_support: true,
                    needs_human_support_at: new Date().toISOString(),
                    needs_human_support_reason: needsHumanSupport.reason,
                  },
                })
                .eq('id', conversationId)
            } else {
              console.warn('[Carol AI] ⚠️ Instância Z-API não encontrada para enviar notificação de atendimento humano')
            }
          }
        }
      } catch (notificationError: any) {
        console.error('[Carol AI] ❌ Erro ao enviar notificação de atendimento humano:', notificationError)
        // Não falhar o processamento se a notificação falhar
      }
    }

    // 11. Atualizar última mensagem da conversa
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
    // 0. Verificar se está em horário permitido
    const timeCheck = isAllowedTimeToSendMessage()
    if (!timeCheck.allowed) {
      console.log('[Carol] ⏰ Disparo de boas-vindas fora do horário:', {
        reason: timeCheck.reason,
        nextAllowedTime: timeCheck.nextAllowedTime?.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      })
      return { sent: 0, errors: 0 }
    }

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
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', 'nutri')
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
      }
    }

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
            optionsText += `\n🗓️ **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
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

        // Delay entre mensagens para não sobrecarregar o WhatsApp
        // Intervalo de 2-3 segundos é mais seguro para evitar bloqueios
        await new Promise(resolve => setTimeout(resolve, 2500))
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
 * Envia mensagem de remarketing para uma pessoa específica que não participou
 * Disparado automaticamente quando admin marca como "não participou"
 */
export async function sendRemarketingToNonParticipant(conversationId: string): Promise<{
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

    // Verificar se realmente não participou
    if (!tags.includes('nao_participou_aula')) {
      return { success: false, error: 'Pessoa não está marcada como não participou' }
    }

    // Verificar se já recebeu remarketing recentemente (evitar spam)
    if (context.last_remarketing_at) {
      const lastRemarketing = new Date(context.last_remarketing_at)
      const now = new Date()
      const hoursSinceLastRemarketing = (now.getTime() - lastRemarketing.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceLastRemarketing < 2) {
        return { success: false, error: 'Remarketing já foi enviado recentemente' }
      }
    }

    // Buscar instância Z-API
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', area)
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
      }
    }

    if (!instance) {
      return { success: false, error: 'Instância Z-API não encontrada' }
    }

    // Buscar próximas 2 sessões disponíveis
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    // Formatar opções de horários
    let optionsText = ''
    if (sessions && sessions.length > 0) {
      sessions.forEach((session, index) => {
        const date = new Date(session.starts_at)
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
        const dateStr = date.toLocaleDateString('pt-BR')
        const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        optionsText += `\n🗓️ **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
      })
    } else {
      optionsText = '\n📅 Em breve teremos novas datas disponíveis! Fique de olho! 😊\n'
    }

    const leadName = conversation.name || 'querido(a)'
    const remarketingMessage = `Olá ${leadName}! 👋

Vi que você não conseguiu participar da aula anterior. Tudo bem, acontece! 😊

Que tal tentarmos novamente? Aqui estão novas opções de dias e horários:

${optionsText}Se alguma dessas opções funcionar para você, é só me avisar! 

Qualquer dúvida, estou aqui! 💚

Carol - Secretária YLADA Nutri`

    const client = createZApiClient(instance.instance_id, instance.token)
    const result = await client.sendTextMessage({
      phone: conversation.phone,
      message: remarketingMessage,
    })

    if (result.success) {
      // Salvar mensagem
      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversation.id,
        instance_id: instance.id,
        z_api_message_id: result.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message: remarketingMessage,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })

      // Atualizar contexto
      const newTags = [...new Set([...tags, 'recebeu_segundo_link'])]
      context.last_remarketing_at = new Date().toISOString()
      context.tags = newTags

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
    console.error('[Carol] Erro ao enviar remarketing:', error)
    return { success: false, error: error.message }
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
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', 'nutri')
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
      }
    }

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
            optionsText += `\n🗓️ **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
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
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', area)
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
      }
    }

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

        // Calcular diferença de tempo usando timezone de Brasília
        const sessionDate = new Date(session.starts_at)
        const nowBrasilia = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        const sessionBrasilia = new Date(sessionDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        const timeDiff = sessionBrasilia.getTime() - nowBrasilia.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        const minutesDiff = timeDiff / (1000 * 60)

        const { weekday, date, time } = formatSessionDateTime(session.starts_at)
        const client = createZApiClient(instance.instance_id, instance.token)

        // Buscar nome do cadastro (priorizar sobre nome do WhatsApp)
        let leadName = conv.name || 'querido(a)'
        try {
          const phoneClean = conv.phone.replace(/\D/g, '')
          
          // Tentar buscar de workshop_inscricoes primeiro
          const { data: workshopReg } = await supabaseAdmin
            .from('workshop_inscricoes')
            .select('nome')
            .ilike('telefone', `%${phoneClean.slice(-8)}%`)
            .limit(1)
            .maybeSingle()
          
          if (workshopReg?.nome) {
            leadName = workshopReg.nome
          } else {
            // Fallback para contact_submissions
            const { data: contactReg } = await supabaseAdmin
              .from('contact_submissions')
              .select('name, nome')
              .or(`phone.ilike.%${phoneClean.slice(-8)}%,telefone.ilike.%${phoneClean.slice(-8)}%`)
              .limit(1)
              .maybeSingle()
            
            if (contactReg?.name || contactReg?.nome) {
              leadName = contactReg.name || contactReg.nome || leadName
            }
          }
        } catch (error: any) {
          console.warn('[Carol] Erro ao buscar nome do cadastro em lembretes:', error.message)
        }

        // Verificar qual notificação enviar baseado no tempo restante
        let message: string | null = null
        let shouldSend = false
        const notificationKey = `pre_class_${sessionId}`
        
        // Se a sessão já aconteceu, não enviar
        if (hoursDiff < 0) {
          continue
        }

        // 24 horas antes (entre 24h e 25h) OU se passou mas ainda não enviou e sessão é amanhã/hoje
        if (!context[notificationKey]?.sent_24h && 
            ((hoursDiff >= 24 && hoursDiff < 25) || (hoursDiff >= 12 && hoursDiff < 24))) {
          message = `Olá ${leadName}! 👋

Lembrete: Sua aula é amanhã!

🗓️ ${weekday}, ${date}
🕒 ${time} (horário de Brasília)

🔗 ${session.zoom_link}

Nos vemos lá! 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }
        // 12 horas antes (entre 12h e 13h) OU se passou mas ainda não enviou e sessão é hoje
        else if (!context[notificationKey]?.sent_12h && 
                 ((hoursDiff >= 12 && hoursDiff < 13) || (hoursDiff >= 2 && hoursDiff < 12))) {
          message = `Olá ${leadName}! 

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
        // 2 horas antes (entre 2h e 2h30) OU se passou mas ainda não enviou e sessão é hoje
        else if (!context[notificationKey]?.sent_2h && 
                 ((hoursDiff >= 2 && hoursDiff < 2.5) || (hoursDiff >= 0.5 && hoursDiff < 2))) {
          message = `Olá ${leadName}! 

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
    // Verificar se está em horário permitido
    const timeCheck = isAllowedTimeToSendMessage()
    if (!timeCheck.allowed) {
      console.log('[Carol] ⏰ Disparo de pós-aula fora do horário:', {
        reason: timeCheck.reason,
        nextAllowedTime: timeCheck.nextAllowedTime?.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      })
      return { sent: 0, errors: 0 }
    }

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

🗓️ *Opções Disponíveis:*
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

          // Delay entre mensagens para não sobrecarregar o WhatsApp
          // Intervalo de 2-3 segundos é mais seguro para evitar bloqueios
          await new Promise(resolve => setTimeout(resolve, 2500))
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
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', area)
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
        console.log('[Carol] ⚠️ Instância encontrada mas status não é "connected":', instanceByArea)
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
        console.log('[Carol] ⚠️ Usando instância fallback (não é da área nutri):', instanceFallback)
      }
    }

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
        
        // Buscar nome do cadastro (priorizar sobre nome do WhatsApp)
        let leadName = conv.name || 'querido(a)'
        let registrationName: string | null = null
        
        try {
          const phoneClean = conv.phone.replace(/\D/g, '')
          
          // Tentar buscar de workshop_inscricoes primeiro
          const { data: workshopReg } = await supabaseAdmin
            .from('workshop_inscricoes')
            .select('nome')
            .ilike('telefone', `%${phoneClean.slice(-8)}%`) // Buscar pelos últimos 8 dígitos
            .limit(1)
            .maybeSingle()
          
          if (workshopReg?.nome) {
            registrationName = workshopReg.nome
          } else {
            // Fallback para contact_submissions
            const { data: contactReg } = await supabaseAdmin
              .from('contact_submissions')
              .select('name, nome')
              .or(`phone.ilike.%${phoneClean.slice(-8)}%,telefone.ilike.%${phoneClean.slice(-8)}%`)
              .limit(1)
              .maybeSingle()
            
            if (contactReg?.name || contactReg?.nome) {
              registrationName = contactReg.name || contactReg.nome || null
            }
          }
          
          // Priorizar nome do cadastro sobre nome do WhatsApp
          if (registrationName) {
            leadName = registrationName
            // Atualizar lead_name no context se encontrou nome do cadastro
            if (registrationName !== (context as any)?.lead_name) {
              context.lead_name = registrationName
            }
          }
        } catch (error: any) {
          console.warn('[Carol] Erro ao buscar nome do cadastro no remarketing:', error.message)
          // Continuar com o nome do WhatsApp se houver erro
        }
        
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

        // Primeira mensagem de follow-up (após 3 horas - caso não tenha respondido)
        if (hoursSinceClass >= 3 && hoursSinceClass < 4 && !context[notificationKey]?.sent_3h) {
          message = `Oi ${leadName}! 

Ficou alguma dúvida? 

Você não quer começar? Vamos começar?

O que está passando pela sua cabeça? 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_3h = true
        }
        // Segunda mensagem de fechamento (após 12 horas da aula)
        else if (hoursSinceClass >= 12 && hoursSinceClass < 13 && !context[notificationKey]?.sent_12h) {
          message = `Olá ${leadName}! 💚

Lembro do motivo que te trouxe até aqui... 🌟

Você tinha um sonho, um objetivo. Algo que te moveu a buscar essa mudança.

Pensa comigo: quanto custa NÃO mudar? Quanto custa continuar adiando esse sonho?

O investimento é de apenas R$ 197 por mês. Menos de R$ 7 por dia.

Pensa no que você vai ganhar: um estado de espírito completamente diferente, a transformação que você busca, a realização desse sonho que te moveu até aqui.

E você pode começar pelo menos com o mensal para se certificar de que é isso mesmo que você quer. Sem compromisso de longo prazo.

Qual é a sua maior dúvida ou objeção para começar agora? 😊

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_12h = true
        }
        // Segunda mensagem (após 24 horas)
        else if (hoursSinceClass >= 24 && hoursSinceClass < 25 && !context[notificationKey]?.sent_24h) {
          message = `Olá ${leadName}! 

Passou um dia desde a aula... 

E eu fico pensando: será que você já começou a aplicar o que aprendeu? 

Ou será que ainda está esperando o "momento perfeito"? 

Sabe, o momento perfeito não existe. O momento certo é AGORA. 

Você veio até aqui porque tinha um sonho. Pensa: quanto custa NÃO realizar esse sonho? Quanto custa continuar adiando?

O investimento é de apenas R$ 197 por mês. Menos de R$ 7 por dia para transformar sua vida.

Pensa no estado de espírito que você vai adquirir, na transformação que você busca, na realização desse sonho.

E você pode começar pelo menos com o mensal para se certificar. Sem pressão, sem compromisso de longo prazo.

O que está te impedindo de começar agora? É o investimento, o tempo, ou alguma dúvida específica? 💚

Carol - Secretária YLADA Nutri`
          shouldSend = true
          if (!context[notificationKey]) context[notificationKey] = {}
          context[notificationKey].sent_24h = true
        }
        // Terceira mensagem (após 48 horas - última)
        else if (hoursSinceClass >= 48 && hoursSinceClass < 49 && !context[notificationKey]?.sent_48h) {
          message = `Olá ${leadName}! 

Esta é minha última mensagem sobre isso... 

Mas antes, quero te lembrar: você veio até aqui por um motivo. 

Você tinha um sonho, um objetivo. Algo que te moveu. 

Pensa: quanto custa NÃO mudar? Quanto custa continuar adiando esse sonho que te trouxe até aqui?

O investimento é de apenas R$ 197 por mês. Menos de R$ 7 por dia.

Pensa no que você vai ganhar: um estado de espírito completamente diferente, a transformação que você busca, a realização desse sonho.

E você pode começar pelo menos com o mensal para se certificar. Sem compromisso, sem pressão.

Não deixe que esse momento passe. Não deixe que a vida te distraia do que realmente importa. 

Você merece ver esse sonho se tornar realidade.

Qual é a sua maior objeção? Investimento, tempo, ou outra coisa? 

O que está te travando exatamente? O momento é AGORA. Vamos conversar? 💚

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

            // Atualizar contexto (incluindo lead_name se foi encontrado)
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context: {
                  ...context,
                  ...(registrationName && registrationName !== (context as any)?.lead_name ? { lead_name: registrationName } : {})
                },
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
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('area', area)
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
        console.log('[Carol] ⚠️ Instância encontrada mas status não é "connected":', instanceByArea)
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: instanceFallback } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (instanceFallback) {
        instance = instanceFallback
        console.log('[Carol] ⚠️ Usando instância fallback (não é da área nutri):', instanceFallback)
      }
    }

    if (!instance) {
      return { success: false, error: 'Instância Z-API não encontrada. Verifique se há uma instância Z-API conectada para a área nutri' }
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    
    // Buscar nome do cadastro (priorizar sobre nome do WhatsApp)
    let leadName = conversation.name || 'querido(a)'
    let registrationName: string | null = null
    
    try {
      const phoneClean = conversation.phone.replace(/\D/g, '')
      
      // Tentar buscar de workshop_inscricoes primeiro
      const { data: workshopReg } = await supabaseAdmin
        .from('workshop_inscricoes')
        .select('nome')
        .ilike('telefone', `%${phoneClean.slice(-8)}%`) // Buscar pelos últimos 8 dígitos
        .limit(1)
        .maybeSingle()
      
      if (workshopReg?.nome) {
        registrationName = workshopReg.nome
      } else {
        // Fallback para contact_submissions
        const { data: contactReg } = await supabaseAdmin
          .from('contact_submissions')
          .select('name, nome')
          .or(`phone.ilike.%${phoneClean.slice(-8)}%,telefone.ilike.%${phoneClean.slice(-8)}%`)
          .limit(1)
          .maybeSingle()
        
        if (contactReg?.name || contactReg?.nome) {
          registrationName = contactReg.name || contactReg.nome || null
        }
      }
      
      // Priorizar nome do cadastro sobre nome do WhatsApp
      if (registrationName) {
        leadName = registrationName
        // Atualizar lead_name no context se encontrou nome do cadastro
        if (registrationName !== (context as any)?.lead_name) {
          context.lead_name = registrationName
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                lead_name: registrationName
              }
            })
            .eq('id', conversationId)
        }
      }
    } catch (error: any) {
      console.warn('[Carol] Erro ao buscar nome do cadastro:', error.message)
      // Continuar com o nome do WhatsApp se houver erro
    }

    // Link de cadastro (configurável via variável de ambiente ou banco)
    // Aponta para página de vendas na seção de oferta (#oferta)
    // A pessoa vê toda a argumentação e depois escolhe o plano no checkout
    const registrationUrl = process.env.NUTRI_REGISTRATION_URL || 'https://www.ylada.com/pt/nutri#oferta'

    // Mensagem imediata após participar da aula
    const message = `Olá ${leadName}! 💚

Excelente! Parabéns por ter participado! 🎉

Espero que tenha gostado e tenho certeza que isso realmente pode fazer diferença na sua vida.

Agora me conta: o que você mais gostou? E como você prefere começar?

Você prefere começar com o plano mensal para validar e verificar, ou você já está determinado a mudar sua vida e prefere o plano anual?

🔗 ${registrationUrl}

O que você acha? 😊

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
 * Envia lembretes de reunião para participantes agendados
 * Regras:
 * - Padrão: 12h antes da reunião
 * - Exceção: Segunda às 10h → lembrete no domingo às 17h
 * - Respeita horário permitido (8h-19h seg-sex, até 13h sábado)
 */
export async function sendWorkshopReminders(): Promise<{
  sent: number
  errors: number
  skipped: number
}> {
  try {
    const now = new Date()
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
      console.log('[Carol Reminders] ⚠️ Instância Z-API não encontrada')
      return { sent: 0, errors: 0, skipped: 0 }
    }

    // Buscar todas as sessões ativas futuras
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })

    if (!sessions || sessions.length === 0) {
      return { sent: 0, errors: 0, skipped: 0 }
    }

    // Buscar todas as conversas com sessões agendadas
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', area)
      .eq('status', 'active')

    if (!conversations || conversations.length === 0) {
      return { sent: 0, errors: 0, skipped: 0 }
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    let sent = 0
    let errors = 0
    let skipped = 0

    // Processar cada sessão
    for (const session of sessions) {
      const sessionDate = new Date(session.starts_at)
      const sessionTime = sessionDate.getTime()
      const nowTime = now.getTime()
      
      // Formatar data/hora da sessão
      const { weekday, date, time } = formatSessionDateTime(session.starts_at)
      
      // Converter para horário de Brasília para verificar dia/hora
      const brasiliaDate = new Date(sessionDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
      const isMonday10am = brasiliaDate.getDay() === 1 && brasiliaDate.getHours() === 10
      
      // Calcular quando enviar lembrete
      let reminderTime: Date | null = null
      
      if (isMonday10am) {
        // Exceção: Segunda 10h → lembrete domingo 17h (horário de Brasília)
        const reminderDate = new Date(sessionDate)
        reminderDate.setDate(sessionDate.getDate() - 1) // Domingo
        reminderDate.setHours(17, 0, 0, 0) // 17h00
        // Ajustar para timezone de Brasília
        const reminderBrasilia = new Date(reminderDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
        reminderTime = reminderBrasilia
      } else {
        // Padrão: 12h antes da reunião
        reminderTime = new Date(sessionTime - 12 * 60 * 60 * 1000)
      }

      // Verificar se já passou o horário do lembrete
      if (nowTime < reminderTime.getTime()) {
        continue // Ainda não é hora de enviar
      }

      // Verificar se a sessão já aconteceu (se sim, não enviar lembrete)
      if (nowTime >= sessionTime) {
        continue // Sessão já aconteceu, não enviar lembrete
      }

      // Verificar se está dentro da janela de envio (até 2h após o horário do lembrete)
      // MAS se a sessão é hoje e ainda não aconteceu, permitir enviar mesmo se passou a janela
      const reminderWindowEnd = reminderTime.getTime() + 2 * 60 * 60 * 1000
      const isToday = nowBrasilia.toDateString() === brasiliaDate.toDateString()
      const isWithinWindow = nowTime <= reminderWindowEnd
      
      if (!isWithinWindow && !isToday) {
        continue // Janela de envio já passou E não é hoje
      }
      
      // Se é hoje e ainda não aconteceu, permitir enviar mesmo se passou a janela do lembrete
      if (isToday && nowTime < sessionTime) {
        console.log(`[Carol Reminders] ⚠️ Janela passou mas sessão é hoje - permitindo envio: ${date} ${time}`)
      }

      // Verificar se está em horário permitido (mas permitir domingo para lembretes especiais)
      const timeCheck = isAllowedTimeToSendMessage()
      const nowBrasilia = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
      const isSunday = nowBrasilia.getDay() === 0
      
      if (!timeCheck.allowed) {
        // Se for domingo e for lembrete de segunda 10h, permitir
        if (!isSunday || !isMonday10am) {
          skipped++
          continue
        }
      }

      // Buscar participantes desta sessão
      const participants = conversations.filter((conv: any) => {
        const context = conv.context || {}
        return context.workshop_session_id === session.id
      })

      if (participants.length === 0) {
        continue
      }

      // Enviar lembrete para cada participante
      for (const participant of participants) {
        try {
          const context = participant.context || {}
          const reminderKey = `reminder_${session.id}`
          
          // Verificar se já enviou lembrete para esta sessão
          if (context[reminderKey]?.sent) {
            continue
          }

          // Formatar mensagem de lembrete
          const leadName = participant.name || 'Olá'
          const reminderMessage = `${leadName}! 👋

Lembrete: Sua aula está agendada para:

🗓️ ${weekday}, ${date}
🕒 ${time} (horário de Brasília)

Aqui está o link da sua aula:
${session.zoom_link}

Nos vemos em breve! 😊

Carol - Secretária YLADA Nutri`

          // Enviar mensagem
          const result = await client.sendTextMessage({
            phone: participant.phone,
            message: reminderMessage
          })

          if (result.success) {
            // Salvar mensagem
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: participant.id,
              instance_id: instance.id,
              z_api_message_id: result.id || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message: reminderMessage,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true
            })

            // Marcar como enviado
            context[reminderKey] = {
              sent: true,
              sent_at: new Date().toISOString()
            }

            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({ context })
              .eq('id', participant.id)

            sent++
            console.log(`[Carol Reminders] ✅ Lembrete enviado para ${participant.phone} - Sessão: ${date} ${time}`)
          } else {
            errors++
            console.error(`[Carol Reminders] ❌ Erro ao enviar para ${participant.phone}:`, result.error)
          }

          // Delay entre mensagens para não sobrecarregar o WhatsApp
          // Intervalo de 2-3 segundos é mais seguro para evitar bloqueios
          await new Promise(resolve => setTimeout(resolve, 2500))
        } catch (err: any) {
          errors++
          console.error(`[Carol Reminders] ❌ Erro ao processar participante:`, err)
        }
      }
    }

    return { sent, errors, skipped }
  } catch (error: any) {
    console.error('[Carol Reminders] ❌ Erro geral:', error)
    return { sent: 0, errors: 1, skipped: 0 }
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
