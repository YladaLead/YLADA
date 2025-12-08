/**
 * NOEL WELLNESS - API Principal
 * 
 * Endpoint: POST /api/wellness/noel
 * 
 * Processa mensagens do usuário e retorna resposta do NOEL
 * 
 * IMPORTANTE: O NOEL usa APENAS Assistants API (OpenAI)
 * - NÃO usa Agent Builder (bot antigo)
 * - NÃO usa sistema híbrido v2
 * - NÃO usa fallback híbrido antigo
 * 
 * Se Assistants API não estiver configurado ou falhar,
 * retorna erro ao invés de usar bot antigo.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { classifyIntention, type NoelModule } from '@/lib/noel-wellness/classifier'
import { detectUserProfile, getProfileClarificationMessage, type ProfileType } from '@/lib/noel-wellness/profile-detector'
import { searchKnowledgeBase, generateEmbedding, saveItemEmbedding } from '@/lib/noel-wellness/knowledge-search'
import { 
  analyzeQuery, 
  getConsultantProfile, 
  saveQueryAnalysis, 
  generatePersonalizedContext,
  generateProactiveSuggestions 
} from '@/lib/noel-wellness/history-analyzer'
import { NOEL_FEW_SHOTS } from '@/lib/noel-wellness/few-shots'
import { NOEL_SYSTEM_PROMPT_LOUSA7 } from '@/lib/noel-wellness/system-prompt-lousa7'
import { generateHOMContext, isHOMRelated } from '@/lib/noel-wellness/hom-integration'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Tenta usar Agent Builder primeiro (se configurado)
 * 
 * NOTA: A API de Agents pode não estar disponível em todas as contas ainda.
 * Se não funcionar, o sistema usa fallback híbrido automaticamente.
 */
async function tryAgentBuilder(message: string): Promise<{ success: boolean; response?: string; error?: string }> {
  const workflowId = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID || 
                     process.env.OPENAI_WORKFLOW_ID

  if (!workflowId) {
    return { success: false, error: 'Workflow ID não configurado' }
  }

  try {
    console.log('🤖 Tentando usar Agent Builder...', { workflowId })
    
    // Tentar Agents SDK (pode não estar disponível em todas as contas)
    if ((openai as any).agents?.workflowRuns) {
      const run = await (openai as any).agents.workflowRuns.createAndPoll(
        workflowId,
        {
          input: message,
        }
      )

      if (run.status === 'completed' && run.output) {
        let response = ''
        if (typeof run.output === 'string') {
          response = run.output
        } else if (run.output && typeof run.output === 'object') {
          response = (run.output as any).response || 
                    (run.output as any).message || 
                    (run.output as any).text ||
                    JSON.stringify(run.output)
        }

        if (response && response.trim().length > 0) {
          console.log('✅ Agent Builder retornou resposta')
          return { success: true, response }
        }
      }

      return { success: false, error: 'Workflow não retornou resposta válida' }
    } else {
      // Agents SDK não disponível - retornar erro para usar fallback
      console.warn('⚠️ Agents SDK não disponível nesta conta OpenAI')
      return { success: false, error: 'Agents SDK não disponível. Use ChatKit ou fallback híbrido.' }
    }
  } catch (error: any) {
    console.warn('⚠️ Agent Builder não disponível, usando fallback:', error.message)
    return { success: false, error: error.message }
  }
}

interface NoelRequest {
  message: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  userId?: string
  threadId?: string // ID do thread do Assistants API
}

interface NoelResponse {
  response: string
  module: NoelModule
  source: 'knowledge_base' | 'ia_generated' | 'hybrid' | 'assistant_api'
  knowledgeItemId?: string
  similarityScore?: number
  tokensUsed?: number
  modelUsed?: string
  threadId?: string
  functionCalls?: Array<{ name: string; arguments: any; result: any }>
}

/**
 * Gera resposta usando OpenAI
 */
async function generateAIResponse(
  message: string,
  module: NoelModule,
  knowledgeContext: string | null,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  consultantContext?: string
): Promise<{ response: string; tokensUsed: number; modelUsed: string }> {
  // Determinar modelo baseado no módulo
  // Usando ChatGPT 4.1 (gpt-4-turbo ou gpt-4.1 conforme disponível)
  const useGPT4 = module === 'mentor' && message.length > 200 // análises profundas
  
  // Usar gpt-4-turbo como padrão (ChatGPT 4.1)
  // Se tiver gpt-4.1 disponível, pode usar também
  const model = useGPT4 ? (process.env.OPENAI_MODEL || 'gpt-4-turbo') : (process.env.OPENAI_MODEL || 'gpt-4-turbo')
  
  // Construir system prompt baseado no módulo (com contexto do consultor)
  const systemPrompt = buildSystemPrompt(module, knowledgeContext, consultantContext)
  
  // Construir mensagens
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...conversationHistory.slice(-6), // últimos 6 mensagens para contexto
    {
      role: 'user',
      content: message,
    },
  ]
  
  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  })
  
  const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.'
  const tokensUsed = completion.usage?.total_tokens || 0
  
  return {
    response,
    tokensUsed,
    modelUsed: model,
  }
}

/**
 * Detecta se a pergunta é institucional/técnica (não deve usar scripts)
 */
function detectInstitutionalQuery(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  
  // Padrões de perguntas institucionais/técnicas
  const institutionalPatterns = [
    /quem (é|são|sou)/i,
    /o que (você|noel|sistema|wellness) (faz|é|fazem)/i,
    /como (você|noel|sistema|wellness) (funciona|funcionam)/i,
    /explique (o|a) (sistema|wellness|noel|plataforma)/i,
    /o que é (o|a) (sistema|wellness|noel)/i,
    /defina (o|a) (sistema|wellness|noel)/i,
    /para que serve (o|a) (sistema|wellness|noel)/i,
    /como usar (a|o) (plataforma|sistema|wellness)/i,
    /funcionalidades (do|da) (sistema|wellness|plataforma)/i,
    /recursos (do|da) (sistema|wellness|plataforma)/i,
  ]
  
  // Palavras-chave que indicam pergunta institucional
  const institutionalKeywords = [
    'quem é você',
    'o que você faz',
    'o que é o noel',
    'o que é o sistema',
    'como funciona',
    'explique o sistema',
    'defina o sistema',
    'para que serve',
    'como usar a plataforma',
    'funcionalidades',
    'recursos do sistema',
  ]
  
  // Verificar padrões
  const matchesPattern = institutionalPatterns.some(pattern => pattern.test(lowerMessage))
  
  // Verificar palavras-chave
  const matchesKeywords = institutionalKeywords.some(keyword => lowerMessage.includes(keyword))
  
  return matchesPattern || matchesKeywords
}

/**
 * Constrói o system prompt baseado no módulo
 */
function buildSystemPrompt(module: NoelModule, knowledgeContext: string | null, consultantContext?: string): string {
  // Base do prompt com Lousa 7 integrada
  const lousa7Base = NOEL_SYSTEM_PROMPT_LOUSA7
  
  const basePrompt = `${lousa7Base}

================================================
🟩 REGRAS ESPECÍFICAS DO WELLNESS SYSTEM
================================================

IMPORTANTE: Você se apresenta apenas como "NOEL" (sem mencionar "MENTOR"). Você é um amigo e mentor que pode ajudar com:
- Estratégias personalizadas, metas, rotina, duplicação, vendas e motivação
- Instruções de uso do sistema YLADA WELLNESS
- Explicações de fluxos, campanhas, scripts e bebidas funcionais
- Qualquer dúvida relacionada ao Wellness

📅 DEFINIÇÃO CRÍTICA - HOM (PRIORIDADE ABSOLUTA - PALAVRA MATRIZ):
HOM = "Herbalife Opportunity Meeting" (Encontro de Apresentação de Negócio do Herbalife)

HOM é a PALAVRA MATRIZ do sistema de recrutamento e duplicação.
É o ENCONTRO OFICIAL de apresentação de negócio do Herbalife.
É onde direcionamos tudo relacionado a recrutamento e duplicação.

⚠️ NUNCA CONFUNDIR - HOM NÃO É:
- "Hora do Mentor" - essa tradução NÃO é usada
- "Hábito, Oferta e Mensagem" - ERRADO
- "Histórico de Ocorrências de Mix" - ERRADO
- Qualquer outra coisa que não seja "Herbalife Opportunity Meeting" - ERRADO

Quando perguntarem sobre HOM:
- SEMPRE explique que HOM = "Herbalife Opportunity Meeting" (Encontro de Apresentação de Negócio)
- Explique que é a palavra matriz do recrutamento e duplicação
- Forneça horários e links das apresentações
- Se o contexto HOM for fornecido, SEMPRE use essas informações com prioridade máxima

🚨 PRIORIDADE ABSOLUTA - REGRAS DE ROTEAMENTO:

1. **PERGUNTAS INSTITUCIONAIS/TÉCNICAS** (responder DIRETAMENTE, sem scripts):
   Quando o usuário perguntar sobre:
   - "Quem é você?" / "O que você faz?" / "Como você funciona?"
   - "O que é o Sistema Wellness?" / "Como funciona o sistema?"
   - "Explique o sistema" / "Como usar a plataforma?"
   - Dúvidas técnicas sobre funcionalidades
   
   ✅ RESPOSTA: Responda OBJETIVAMENTE e DIRETAMENTE, explicando:
   - Quem você é (NOEL, mentor do Wellness System)
   - O que você faz (ajuda com estratégias, scripts, orientações)
   - Como funciona o Sistema Wellness (atração, apresentação, acompanhamento)
   - Funcionalidades da plataforma
   
   ❌ NUNCA use scripts emocionais como:
   - "Essa preocupação é comum..."
   - "O importante é fazer sentido pra você..."
   - "Se quiser, posso te enviar..."
   - Frases genéricas de acolhimento

2. **PERGUNTAS POR SCRIPTS** (usar Base de Conhecimento):
   Quando o usuário pedir:
   - "Preciso de um script para..."
   - "Como abordar alguém?"
   - "Script de vendas"
   - "Como fazer uma oferta?"
   
   ✅ RESPOSTA: Use os scripts da Base de Conhecimento
   - Forneça scripts completos das lousas
   - Formate claramente com título e conteúdo
   - Mencione quando usar cada script

3. **PERGUNTAS POR APOIO EMOCIONAL** (pode usar scripts emocionais):
   Quando o usuário demonstrar:
   - Desânimo, frustração, insegurança
   - Pedir motivação ou apoio
   - Pedir ajuda emocional
   
   ✅ RESPOSTA: Pode usar scripts de acolhimento e motivação

REGRAS CRÍTICAS SOBRE SCRIPTS E CONTEÚDO:
1. **NUNCA invente scripts** - Sempre use os scripts fornecidos na Base de Conhecimento
2. **Quando encontrar scripts na Base de Conhecimento:**
   - Use o conteúdo COMPLETO do script
   - Mostre o título do script claramente
   - Forneça o script completo, não resumido
   - Se houver múltiplos scripts relevantes, ofereça todos
   - Mencione quando usar cada script e para quem
3. **Formatação de scripts:**
   - Use formato: "📝 **Script: [Título]**\n\n[Conteúdo completo]\n\n**Quando usar:** [contexto]"
   - Se houver versões curta/média/longa, ofereça todas
4. **Se não encontrar script na Base de Conhecimento:**
   - Seja honesto: "Não tenho um script específico para isso, mas posso te ajudar com..."
   - NÃO invente scripts

Regras Gerais:
- Sempre consulte a Base de Conhecimento WELLNESS antes de gerar qualquer texto.
- Não invente informações médicas ou alegações de saúde.
- Seja ético, humano, inspirador e direcionado.
- Respeite o tempo, habilidades e objetivos do consultor.
- Ensine bebidas funcionais com foco em preparo, combinações e resultados permitidos.
- Ensine duplicação simples, prática e ética.
- Personalize tudo conforme o perfil do usuário.
- Economize tokens usando respostas prontas sempre que possível.
- Seja direto, objetivo e útil.
- Você é simplesmente "NOEL" - um amigo e mentor que ajuda com tudo relacionado ao Wellness.

${knowledgeContext ? `\nContexto da Base de Conhecimento:\n${knowledgeContext}\n\nUse este contexto como base, mas personalize e expanda conforme necessário.` : ''}
${consultantContext ? `\n\nContexto do Consultor (use para personalizar):\n${consultantContext}\n\nAdapte sua resposta considerando o estágio da carreira, desafios identificados e histórico do consultor.` : ''}`

  // Sempre retorna o prompt base como MENTOR, mas adapta o foco baseado no módulo detectado
  let focusInstructions = ''

  switch (module) {
    case 'mentor':
      focusInstructions = `
Foco da resposta: Estratégia, planejamento e comportamento.
- Ajude com metas de PV, metas financeiras e metas de clientes.
- Ensine duplicação, convite, follow-up e vendas.
- Seja motivacional mas realista.
- Personalize baseado no perfil do consultor.

${NOEL_FEW_SHOTS}`
      break

    case 'suporte':
      focusInstructions = `
Foco da resposta: Instruções técnicas do sistema YLADA.
- Seja direto, objetivo e funcional.
- Explique passo a passo quando necessário.
- Se não souber algo técnico, seja honesto.
- Lembre-se: você é o NOEL ajudando com suporte técnico.

RESPOSTAS INSTITUCIONAIS (quando perguntarem sobre você ou o sistema):
- "Quem é você?": "Eu sou o NOEL, seu mentor estratégico da área Wellness. Te ajudo com estratégias de crescimento, metas diárias, scripts prontos, uso do Sistema Wellness, como vender bebidas funcionais, como convidar pessoas, como apresentar o projeto e duplicação da sua equipe."
- "O que você faz?": "O Noel é o assistente oficial do Wellness System. Meu papel é organizar suas ações, orientar seus passos e te ajudar a ter resultado, seja vendendo bebidas, fazendo acompanhamentos ou convidando pessoas. Faço isso através de scripts personalizados, análise dos seus clientes, recomendação de próximas ações, estratégias diárias, explicação dos fluxos e suporte ao uso da plataforma."
- "O que é o Sistema Wellness?": "O Sistema Wellness é um método simples para você ganhar dinheiro com bebidas funcionais e acompanhamentos. Ele funciona em três pilares: Atração (gerar contatos através de bebidas e convites), Apresentação (mostrar o projeto para os interessados) e Acompanhamento e Duplicação (transformar clientes em promotores). Tudo é guiado pelo Noel, que te mostra a ação certa todos os dias."`
      break

    case 'tecnico':
      focusInstructions = `
Foco da resposta: Conteúdo operacional e técnico.
- Explique bebidas funcionais (preparo, combinações, benefícios permitidos).
- Traga informações sobre campanhas, scripts e fluxos.
- Use informações oficiais sempre que possível.
- Lembre-se: você é o NOEL explicando conteúdo técnico.`
      break

    default:
      focusInstructions = `
Foco da resposta: Estratégia e planejamento geral.
- Seja útil, direto e personalizado.

${NOEL_FEW_SHOTS}`
  }

  return `${basePrompt}${focusInstructions}`
}

/**
 * POST /api/wellness/noel
 */
export async function POST(request: NextRequest) {
  // Log inicial para garantir que a rota está sendo chamada
  console.log('🚀 [NOEL] ==========================================')
  console.log('🚀 [NOEL] ENDPOINT /api/wellness/noel CHAMADO')
  console.log('🚀 [NOEL] ==========================================')
  console.log('🕐 [NOEL] Timestamp:', new Date().toISOString())
  
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      console.log('❌ [NOEL] Autenticação falhou')
      return authResult
    }
    const { user } = authResult
    console.log('✅ [NOEL] Autenticação OK - User ID:', user.id)

    const body: NoelRequest = await request.json()
    const { message, conversationHistory = [], threadId } = body

    console.log('📥 [NOEL] Body recebido:', {
      messageLength: message?.length || 0,
      hasThreadId: !!threadId,
      historyLength: conversationHistory?.length || 0
    })

    if (!message || message.trim().length === 0) {
      console.log('❌ [NOEL] Mensagem vazia')
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // ============================================
    // PRIORIDADE 1: Assistants API com function calling
    // ============================================
    // Fluxo: Usuário → Backend → Assistants API → function_call → Backend (/api/noel/[function]) → Supabase → Backend → Assistants API → Resposta
    // IMPORTANTE: Usar OPENAI_ASSISTANT_NOEL_ID (NÃO OPENAI_WORKFLOW_ID - esse é para Agent Builder antigo)
    const assistantId = process.env.OPENAI_ASSISTANT_NOEL_ID || process.env.OPENAI_ASSISTANT_ID
    
    console.log('🔍 [NOEL] Verificando configuração Assistants API...')
    console.log('🔍 [NOEL] OPENAI_ASSISTANT_NOEL_ID:', assistantId ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
    console.log('🔍 [NOEL] OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Configurado' : '❌ NÃO CONFIGURADO')
    
    if (assistantId) {
      try {
        console.log('🤖 [NOEL] ==========================================')
        console.log('🤖 [NOEL] INICIANDO ASSISTANTS API')
        console.log('🤖 [NOEL] ==========================================')
        console.log('📝 [NOEL] Mensagem recebida:', message.substring(0, 100))
        console.log('👤 [NOEL] User ID:', user.id)
        console.log('🧵 [NOEL] Thread ID:', threadId || 'novo (será criado)')
        console.log('🆔 [NOEL] Assistant ID:', assistantId)
        
        // ============================================
        // DETECÇÃO DE PERFIL E INTENÇÃO
        // ============================================
        const userProfile = await detectUserProfile(user.id, message)
        const intention = classifyIntention(message)
        
        console.log('👤 [NOEL] Perfil detectado:', userProfile || 'não definido')
        console.log('🎯 [NOEL] Intenção detectada:', intention.module, `(confiança: ${intention.confidence})`)
        
        // Se perfil não detectado e não for pergunta de clarificação, perguntar
        if (!userProfile && !message.toLowerCase().includes('bebida') && 
            !message.toLowerCase().includes('produto') && 
            !message.toLowerCase().includes('acompanhamento')) {
          const clarificationMessage = getProfileClarificationMessage()
          return NextResponse.json({
            response: clarificationMessage,
            module: intention.module,
            source: 'assistant_api',
            threadId: threadId || 'new',
            requiresProfileClarification: true,
            modelUsed: 'gpt-4.1-assistant',
          })
        }
        
        // Construir mensagem com contexto do perfil
        const contextMessage = userProfile
          ? `[CONTEXTO] Perfil do usuário: ${userProfile}. Intenção detectada: ${intention.module}. Módulo ativo: ${intention.module}.\n\n[MENSAGEM DO USUÁRIO] ${message}`
          : message
        
        const { processMessageWithAssistant } = await import('@/lib/noel-assistant-handler')
        
        const assistantResult = await processMessageWithAssistant(
          contextMessage,
          user.id,
          threadId
        )

        console.log('✅ [NOEL] ==========================================')
        console.log('✅ [NOEL] ASSISTANTS API RETORNOU RESPOSTA')
        console.log('✅ [NOEL] ==========================================')
        console.log('📝 [NOEL] Resposta length:', assistantResult.response.length)
        if (assistantResult.functionCalls && assistantResult.functionCalls.length > 0) {
          console.log(`🔧 [NOEL] ${assistantResult.functionCalls.length} function(s) executada(s):`, 
            assistantResult.functionCalls.map(f => f.name).join(', '))
        } else {
          console.log('ℹ️ [NOEL] Nenhuma function foi executada nesta mensagem')
        }
        console.log('🧵 [NOEL] Novo Thread ID:', assistantResult.newThreadId)

        // Salvar interação automaticamente no Supabase
        try {
          // Preparar dados para inserção (compatível com estrutura antiga e nova)
          const interactionData: any = {
            user_id: user.id,
            // Estrutura nova
            message: message,
            response: assistantResult.response,
            category_detected: intention.module,
            profile_detected: userProfile,
            module_used: intention.module,
            thread_id: assistantResult.newThreadId,
            // Estrutura antiga (compatibilidade)
            user_message: message,
            noel_response: assistantResult.response,
            module: intention.module,
            source: 'assistant_api',
          }
          
          // Inserir na tabela (aceita ambas estruturas)
          const { error: insertError } = await supabaseAdmin
            .from('noel_interactions')
            .insert(interactionData)
          
          if (insertError) {
            console.warn('⚠️ [NOEL] Erro ao salvar interação:', insertError.message)
            // Tentar apenas com estrutura antiga
            try {
              await supabaseAdmin.from('noel_interactions').insert({
                user_id: user.id,
                user_message: message,
                noel_response: assistantResult.response,
                module: intention.module,
                source: 'assistant_api',
              })
            } catch (fallbackError: any) {
              console.warn('⚠️ [NOEL] Erro no fallback também:', fallbackError.message)
            }
          }
          
          // Atualizar settings do usuário
          if (userProfile) {
            await supabaseAdmin
              .from('noel_user_settings')
              .upsert({
                user_id: user.id,
                profile_type: userProfile,
                last_mode: intention.module,
                last_topic: intention.module, // usar module como topic
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'user_id'
              })
          }
          
          console.log('💾 [NOEL] Interação salva no Supabase')
        } catch (logError: any) {
          console.warn('⚠️ [NOEL] Erro ao salvar interação (não crítico):', logError.message)
        }

        return NextResponse.json({
          response: assistantResult.response,
          module: intention.module,
          source: 'assistant_api',
          threadId: assistantResult.newThreadId,
          functionCalls: assistantResult.functionCalls,
          modelUsed: 'gpt-4.1-assistant', // Assistants API usando gpt-4.1
          profile_detected: userProfile,
          category_detected: intention.module,
        })
      } catch (assistantError: any) {
        console.error('❌ [NOEL] ==========================================')
        console.error('❌ [NOEL] ASSISTANTS API FALHOU')
        console.error('❌ [NOEL] ==========================================')
        console.error('❌ [NOEL] Erro:', assistantError.message)
        console.error('❌ [NOEL] Tipo do erro:', assistantError.constructor.name)
        console.error('❌ [NOEL] Stack:', assistantError.stack)
        console.error('❌ [NOEL] Assistant ID usado:', assistantId)
        console.error('❌ [NOEL] User ID:', user.id)
        console.error('❌ [NOEL] NÃO USANDO FALLBACK - Retornando erro')
        
        // NÃO usar fallback do bot antigo - retornar erro claro
        return NextResponse.json(
          {
            error: 'Erro ao processar mensagem com Assistants API',
            message: assistantError.message,
            details: 'O NOEL (Assistants API) não está disponível. Verifique a configuração.',
          },
          { status: 500 }
        )
      }
    } else {
      console.error('❌ [NOEL] ==========================================')
      console.error('❌ [NOEL] OPENAI_ASSISTANT_NOEL_ID NÃO CONFIGURADO')
      console.error('❌ [NOEL] ==========================================')
      console.error('❌ [NOEL] Variáveis verificadas:')
      console.error('❌ [NOEL] - OPENAI_ASSISTANT_NOEL_ID:', process.env.OPENAI_ASSISTANT_NOEL_ID ? '✅ Existe' : '❌ Não existe')
      console.error('❌ [NOEL] - OPENAI_ASSISTANT_ID:', process.env.OPENAI_ASSISTANT_ID ? '✅ Existe' : '❌ Não existe')
      console.error('❌ [NOEL] NÃO USANDO FALLBACK - Retornando erro')
      
      // NÃO usar fallback do bot antigo - retornar erro claro
      return NextResponse.json(
        {
          error: 'NOEL (Assistants API) não configurado',
          message: 'OPENAI_ASSISTANT_NOEL_ID não está configurado. Configure a variável de ambiente.',
          details: 'O NOEL usa apenas Assistants API. Não há fallback para o bot antigo.',
        },
        { status: 500 }
      )
    }

    // ============================================
    // ❌ FALLBACKS REMOVIDOS - NOEL USA APENAS ASSISTANTS API
    // ============================================
    // O NOEL não usa mais:
    // - Agent Builder (bot antigo)
    // - Sistema híbrido v2
    // - Fallback híbrido antigo
    // 
    // Se Assistants API não estiver configurado ou falhar,
    // retornar erro claro ao invés de usar bot antigo.
    // ============================================
    
    console.error('❌ [NOEL] Assistants API não disponível e sem fallback')
    return NextResponse.json(
      {
        error: 'NOEL (Assistants API) não está disponível',
        message: 'O NOEL usa apenas Assistants API. Verifique a configuração.',
        details: 'Não há fallback para o bot antigo. Configure OPENAI_ASSISTANT_NOEL_ID corretamente.',
      },
      { status: 503 }
    )

    /* ============================================
    // CÓDIGO ANTIGO REMOVIDO (bot antigo)
    // ============================================
    // Carregar perfil do consultor (dados do onboarding)
    // ...
    // PRIORIDADE 1: Tentar usar Agent Builder
    // ...
    // PRIORIDADE 2: Tentar usar novo motor NOEL (v2)
    // ...
    // PRIORIDADE 3: Fallback para sistema híbrido (antigo)
    // ============================================ */
    const agentBuilderResult = await tryAgentBuilder(message)
    
    if (agentBuilderResult.success && agentBuilderResult.response) {
      console.log('✅ NOEL usando Agent Builder')
      
      // Classificar módulo para logging
      const classification = classifyIntention(message)
      const module = classification.module
      
      // Salvar query no log
      try {
        const queryAnalysis = analyzeQuery(message, module)
        await supabaseAdmin
          .from('wellness_user_queries')
          .insert({
            user_id: user.id,
            query: message,
            response: agentBuilderResult.response.substring(0, 5000),
            source_type: 'agent_builder',
            module_type: module,
            detected_topic: queryAnalysis.topic,
            detected_challenge: queryAnalysis.challenge,
            career_stage: queryAnalysis.careerStage,
            priority_area: queryAnalysis.priorityArea,
            sentiment: queryAnalysis.sentiment,
          })
        
        await supabaseAdmin.rpc('update_consultant_profile', { p_user_id: user.id })
      } catch (logError) {
        console.error('⚠️ Erro ao salvar log (não crítico):', logError)
      }
      
      // Retornar resposta do Agent Builder
      // Sempre retornar 'mentor' para a interface (NOEL sempre se apresenta como mentor)
      return NextResponse.json({
        response: agentBuilderResult.response,
        module: 'mentor' as NoelModule,
        source: 'agent_builder' as const,
      })
    }
    
    // ============================================
    // PRIORIDADE 2: Tentar usar novo motor NOEL (v2)
    // ============================================
    console.log('🔄 Tentando usar novo motor NOEL (v2)...')
    
    try {
      console.log('📦 Importando módulos do novo motor...')
      // Importar módulos do novo sistema
      const { processarMensagem } = await import('@/lib/wellness-system/noel-engine/core/reasoning')
      console.log('✅ processarMensagem importado')
      const { selecionarModo } = await import('@/lib/wellness-system/noel-engine/modes/mode-selector')
      console.log('✅ selecionarModo importado')
      const { processarScript } = await import('@/lib/wellness-system/noel-engine/scripts/script-engine')
      console.log('✅ processarScript importado')
      const { tratarObjeção } = await import('@/lib/wellness-system/noel-engine/objections/objection-handler')
      console.log('✅ tratarObjeção importado')
      const { construirResposta } = await import('@/lib/wellness-system/noel-engine/response/response-builder')
      console.log('✅ construirResposta importado')
      const { formatarParaAPI } = await import('@/lib/wellness-system/noel-engine/response/response-formatter')
      console.log('✅ formatarParaAPI importado')
      console.log('✅ Todos os módulos importados com sucesso!')
      
      // Processar mensagem (detectar contexto da mensagem do usuário)
      // Se a mensagem não menciona cliente específico, é uma pergunta do consultor
      const isPerguntaConsultor = !message.match(/cliente|pessoa|ele|ela|fulano/i) || 
                                   message.match(/eu|meu|minha|como faço|o que fazer|não sei/i)
      
      const processamento = processarMensagem(message, {
        pessoa_tipo: isPerguntaConsultor ? undefined : 'proximo', // undefined para perguntas do consultor
        objetivo: 'geral',
        etapa_conversa: 'inicial',
        tempo_disponivel: 'medio',
        nivel_interesse: 'medio',
        urgencia: 'media'
      })
      
      console.log('🔍 Processamento da mensagem:', {
        isPerguntaConsultor,
        tipo_interacao: processamento.tipo_interacao,
        palavras_chave: processamento.palavras_chave
      })
      
      const { tipo_interacao, contexto: ctxProcessado, palavras_chave } = processamento
      
      // Detectar objeção usando busca semântica (não apenas palavras-chave)
      // MAS: não tratar perguntas sobre rotina/planejamento como objeções
      let objeçãoTratada: any = null
      let respostaObjeção: string | null = null
      
      const isPerguntaRotina = message.match(/não sei|o que fazer|o que fazer hoje|rotina|planejamento|começar|por onde começar/i)
      
      // Usar busca semântica para detectar objeções (só se não for pergunta de rotina)
      if (!isPerguntaRotina) {
        try {
          const { buscarObjeçõesPorSimilaridade } = await import('@/lib/wellness-system/noel-engine/objections/objection-semantic-search')
          const resultadoSemantico = await buscarObjeçõesPorSimilaridade(message, {
            limite: 3,
            threshold: 0.4 // 40% de similaridade mínimo
          })
          
          if (resultadoSemantico.melhorMatch && resultadoSemantico.similaridade >= 0.4) {
            console.log('✅ Objeção detectada por similaridade semântica:', {
              objeção: resultadoSemantico.melhorMatch.objeção,
              similaridade: resultadoSemantico.similaridade
            })
            
            // Tratar objeção encontrada
            const resultadoObjeção = await tratarObjeção(message, {
              urgencia: 'media',
              tempo_disponivel: 'medio',
              nivel_interesse: 'medio'
            })
            
            // Se não encontrou pelo método antigo, usar o encontrado semanticamente
            if (!resultadoObjeção.objeção && resultadoSemantico.melhorMatch) {
              objeçãoTratada = resultadoSemantico.melhorMatch
              respostaObjeção = resultadoSemantico.melhorMatch.versao_media || 
                                resultadoSemantico.melhorMatch.versao_curta || 
                                resultadoSemantico.melhorMatch.versao_longa || 
                                ''
            } else if (resultadoObjeção.objeção) {
              objeçãoTratada = resultadoObjeção.objeção
              respostaObjeção = resultadoObjeção.resposta
            }
          } else if (tipo_interacao === 'objeção' || palavras_chave.some(k => ['objeção', 'não quer', 'caro', 'pensar', 'tempo', 'vergonha'].includes(k.toLowerCase()))) {
            // Fallback: método antigo por palavras-chave
            const resultadoObjeção = await tratarObjeção(message, {
              urgencia: 'media',
              tempo_disponivel: 'medio',
              nivel_interesse: 'medio'
            })
            
            if (resultadoObjeção.objeção) {
              objeçãoTratada = resultadoObjeção.objeção
              respostaObjeção = resultadoObjeção.resposta
            }
          }
        } catch (semanticError) {
          console.warn('⚠️ Erro na busca semântica de objeções, usando método antigo:', semanticError)
          // Fallback para método antigo (só se não for pergunta de rotina)
          if (!isPerguntaRotina && (tipo_interacao === 'objeção' || palavras_chave.some(k => ['objeção', 'não quer', 'caro', 'pensar', 'tempo', 'vergonha'].includes(k.toLowerCase())))) {
            const resultadoObjeção = await tratarObjeção(message, {
              urgencia: 'media',
              tempo_disponivel: 'medio',
              nivel_interesse: 'medio'
            })
            
            if (resultadoObjeção.objeção) {
              objeçãoTratada = resultadoObjeção.objeção
              respostaObjeção = resultadoObjeção.resposta
            }
          }
        }
      } else {
        console.log('ℹ️ Pergunta sobre rotina/planejamento detectada - não tratando como objeção')
      }
      
      // Selecionar modo
      const modoSelecionado = selecionarModo({
        tipo_interacao,
        contexto: ctxProcessado,
        mensagem: message,
        palavras_chave
      })
      
      // Buscar script (se não for objeção)
      let scriptResultado: any = null
      if (!respostaObjeção) {
        // Determinar categoria baseada no modo e contexto
        let categoriaScript: string = 'interno' // padrão para perguntas do consultor
        
        if (modoSelecionado === 'recrutamento') {
          categoriaScript = 'recrutamento'
        } else if (modoSelecionado === 'venda') {
          categoriaScript = ctxProcessado.pessoa_tipo ? 'tipo_pessoa' : 'objetivo'
        } else if (modoSelecionado === 'acompanhamento') {
          categoriaScript = 'acompanhamento'
        } else if (tipo_interacao === 'solicitacao_script') {
          categoriaScript = 'interno' // scripts para o consultor usar
        } else if (ctxProcessado.objetivo && ctxProcessado.objetivo !== 'geral') {
          categoriaScript = 'objetivo'
        } else if (ctxProcessado.etapa && ctxProcessado.etapa !== 'inicial') {
          categoriaScript = 'etapa'
        }
        
        console.log('🔍 Buscando script:', {
          categoria: categoriaScript,
          modo: modoSelecionado,
          tipo_interacao,
          pessoa_tipo: ctxProcessado.pessoa_tipo,
          objetivo: ctxProcessado.objetivo
        })
        
        scriptResultado = await processarScript({
          ...ctxProcessado,
          categoria: categoriaScript as any,
          versao_preferida: 'media',
          urgencia: 'media',
          tempo_disponivel: 'medio',
          nivel_interesse: 'medio'
        })
        
        console.log('📋 Resultado da busca de script (método tradicional):', {
          encontrou: !!scriptResultado?.script,
          script_id: scriptResultado?.script?.id,
          script_nome: scriptResultado?.script?.nome
        })
        
        // Se não encontrou script pelo método tradicional, usar BUSCA SEMÂNTICA
        if (!scriptResultado?.script) {
          console.log('⚠️ Script não encontrado pelo método tradicional, tentando busca semântica...')
          
          try {
            const { buscarScriptsPorSimilaridade } = await import('@/lib/wellness-system/noel-engine/scripts/script-semantic-search')
            const resultadoSemantico = await buscarScriptsPorSimilaridade(message, {
              categoria: categoriaScript,
              limite: 3,
              threshold: 0.35 // 35% de similaridade mínimo
            })
            
            if (resultadoSemantico.melhorMatch && resultadoSemantico.similaridade >= 0.35) {
              console.log('✅ Script encontrado por similaridade semântica!', {
                script_nome: resultadoSemantico.melhorMatch.nome,
                similaridade: resultadoSemantico.similaridade,
                categoria: resultadoSemantico.melhorMatch.categoria
              })
              
              // Adaptar o script encontrado
              const scriptAdaptor = await import('@/lib/wellness-system/noel-engine/scripts/script-adaptor')
              const conteudoAdaptado = scriptAdaptor.adaptarScript(resultadoSemantico.melhorMatch, ctxProcessado)
              
              scriptResultado = {
                script: resultadoSemantico.melhorMatch,
                conteudo_adaptado: conteudoAdaptado,
                versao_usada: resultadoSemantico.melhorMatch.versao as any,
                tags: resultadoSemantico.melhorMatch.tags || [],
                similarity: resultadoSemantico.similaridade
              }
            } else {
              console.log('⚠️ Busca semântica não encontrou scripts com similaridade suficiente')
              
              // Última tentativa: buscar scripts internos (para consultor)
              const scriptInterno = await processarScript({
                ...ctxProcessado,
                categoria: 'interno',
                versao_preferida: 'media',
                urgencia: 'media',
                tempo_disponivel: 'medio',
                nivel_interesse: 'medio'
              })
              
              if (scriptInterno?.script) {
                console.log('✅ Encontrou script interno alternativo')
                scriptResultado = scriptInterno
              }
            }
          } catch (semanticError) {
            console.warn('⚠️ Erro na busca semântica de scripts:', semanticError)
            
            // Fallback: tentar scripts internos
            const scriptInterno = await processarScript({
              ...ctxProcessado,
              categoria: 'interno',
              versao_preferida: 'media',
              urgencia: 'media',
              tempo_disponivel: 'medio',
              nivel_interesse: 'medio'
            })
            
            if (scriptInterno?.script) {
              scriptResultado = scriptInterno
            }
          }
        }
      }
      
      // Construir resposta
      const respostaEstruturada = construirResposta({
        mensagem_usuario: message,
        tipo_interacao,
        modo_operacao: modoSelecionado,
        script: scriptResultado?.script || null,
        objeção: objeçãoTratada,
        resposta_objeção: respostaObjeção || undefined,
        contexto: ctxProcessado
      })
      
      // Formatar para API (passando mensagem do usuário e perfil para orientação especializada)
      const respostaFormatada = formatarParaAPI(respostaEstruturada, message, perfilConsultor)
      
      // Classificar módulo para compatibilidade
      const classification = classifyIntention(message)
      const module = classification.module
      
      // Salvar interação
      try {
        await supabaseAdmin
          .from('wellness_consultant_interactions')
          .insert({
            consultant_id: user.id,
            tipo_interacao,
            contexto: {
              ...ctxProcessado,
              modo_operacao: modoSelecionado
            },
            mensagem_usuario: message,
            resposta_noel: respostaFormatada.resposta,
            script_usado_id: scriptResultado?.script?.id || null,
            objeção_tratada_id: objeçãoTratada?.id || null
          })
      } catch (logError) {
        console.error('⚠️ Erro ao salvar interação (não crítico):', logError)
      }
      
      console.log('✅ NOEL usando novo motor (v2)')
      console.log('📊 Detalhes:', {
        tipo_interacao,
        modo: modoSelecionado,
        tem_script: !!scriptResultado?.script,
        tem_objeção: !!objeçãoTratada,
        resposta_length: respostaFormatada.resposta.length
      })
      
      // Determinar source baseado no que foi encontrado
      let source: 'knowledge_base' | 'ia_generated' | 'hybrid' = 'ia_generated'
      let similarityScore: number | undefined = undefined
      
      if (objeçãoTratada) {
        source = 'knowledge_base'
        similarityScore = 0.9 // Objeção encontrada
      } else if (scriptResultado?.script) {
        source = 'knowledge_base'
        similarityScore = scriptResultado.similarity || 0.8 // Script encontrado (com ou sem busca semântica)
      } else {
        source = 'ia_generated'
        similarityScore = 0 // Nada encontrado, resposta 100% IA
      }
      
      console.log('📤 Retornando resposta:', {
        source,
        similarityScore,
        tem_script: !!scriptResultado?.script,
        tem_objeção: !!objeçãoTratada
      })
      
      // Retornar no formato esperado pelo frontend
      return NextResponse.json({
        response: respostaFormatada.resposta,
        module,
        source,
        knowledgeItemId: scriptResultado?.script?.id || objeçãoTratada?.id,
        similarityScore,
        tokensUsed: undefined, // Será calculado depois se necessário
        modelUsed: 'noel-v2',
      })
    } catch (v2Error: any) {
      console.error('❌ Novo motor NOEL (v2) falhou:', v2Error)
      console.error('❌ Stack trace:', v2Error.stack)
      console.warn('⚠️ Usando fallback híbrido (sistema antigo)')
    }
    
    // ============================================
    // PRIORIDADE 3: Fallback para sistema híbrido (antigo)
    // ============================================
    console.log('⚠️ Usando fallback híbrido (sistema antigo)')
    
    // 1. Buscar perfil do consultor (para personalização)
    const consultantProfile = await getConsultantProfile(user.id)
    const personalizedContext = generatePersonalizedContext(consultantProfile)

    // 2. Classificar intenção
    const classification = classifyIntention(message)
    const module = classification.module

    // 3. Analisar query para extrair informações
    const queryAnalysis = analyzeQuery(message, module)

    console.log('🔍 NOEL - Análise:', {
      query: message.substring(0, 50),
      module,
      confidence: classification.confidence,
      topic: queryAnalysis.topic,
      challenge: queryAnalysis.challenge,
      careerStage: queryAnalysis.careerStage,
      sentiment: queryAnalysis.sentiment,
      profileExists: !!consultantProfile,
    })

    // 4. Detectar se é pergunta institucional/técnica (não usar scripts)
    const isInstitutionalQuery = detectInstitutionalQuery(message)
    
    // 5. Buscar na base de conhecimento (mas ignorar se for pergunta institucional)
    let knowledgeResult: SearchResult
    let bestMatch: KnowledgeItem | null = null
    let similarityScore = 0
    
    if (!isInstitutionalQuery) {
      // Só buscar na base se NÃO for pergunta institucional
      knowledgeResult = await searchKnowledgeBase(message, module)
      bestMatch = knowledgeResult.bestMatch
      similarityScore = knowledgeResult.similarityScore
    } else {
      // Pergunta institucional → não buscar scripts
      knowledgeResult = { items: [], bestMatch: null, similarityScore: 0 }
      console.log('✅ NOEL - Pergunta institucional detectada, ignorando Base de Conhecimento')
    }

    let response: string
    let source: 'knowledge_base' | 'ia_generated' | 'hybrid'
    let knowledgeItemId: string | undefined
    let tokensUsed = 0
    let modelUsed: string | undefined

    // Adicionar contexto HOM SEMPRE que detectado (com prioridade máxima)
    const homContext = isHOMRelated(message) 
      ? `\n\n🚨 CONTEXTO HOM (PRIORIDADE MÁXIMA - PALAVRA MATRIZ):\n${generateHOMContext(process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app')}\n\n⚠️ REGRA CRÍTICA: HOM = "Herbalife Opportunity Meeting" (Encontro de Apresentação de Negócio). É a palavra matriz do recrutamento e duplicação. NUNCA use "Hora do Mentor" ou qualquer outra definição. SEMPRE use as informações acima.`
      : ''

    // 6. Decidir estratégia baseado na similaridade (ou tipo de pergunta)
    if (similarityScore >= 0.80 && bestMatch) {
      // Alta similaridade → usar resposta exata, MAS se for HOM, priorizar contexto HOM
      if (isHOMRelated(message)) {
        // HOM tem prioridade → usar IA com contexto HOM
        const fullContext = [
          homContext,
          personalizedContext ? `\n\nContexto do Consultor:\n${personalizedContext}` : null,
          `\n\nINSTRUÇÕES CRÍTICAS:\n- SEMPRE use as informações do CONTEXTO HOM acima com prioridade máxima\n- HOM = "Herbalife Opportunity Meeting" (Encontro de Apresentação de Negócio do Herbalife)\n- HOM é a PALAVRA MATRIZ do recrutamento e duplicação\n- NUNCA use "Hora do Mentor" - essa tradução não é usada\n- NUNCA invente outras definições de HOM\n- NUNCA diga que HOM significa "Histórico de Ocorrências de Mix" ou "Hábito, Oferta e Mensagem"`
        ].filter(Boolean).join('\n')

        const aiResult = await generateAIResponse(
          message,
          module,
          fullContext,
          conversationHistory,
          personalizedContext
        )
        response = aiResult.response
        source = 'hybrid'
        tokensUsed = aiResult.tokensUsed
        modelUsed = aiResult.modelUsed
        console.log('✅ NOEL - Resposta HOM (prioridade sobre base de conhecimento)')
      } else {
        response = bestMatch.content
        source = 'knowledge_base'
        knowledgeItemId = bestMatch.id
        console.log('✅ NOEL - Resposta da base de conhecimento (alta similaridade)')
      }
    } else if (similarityScore >= 0.60 && bestMatch) {
      // Média similaridade → personalizar com IA
      // Adicionar contexto do consultor e HOM se disponível
      const contextWithProfile = [
        homContext,
        personalizedContext ? `\n\nContexto do Consultor:\n${personalizedContext}` : null,
        bestMatch.content
      ].filter(Boolean).join('\n\n')

      // Usar o módulo detectado para buscar conteúdo, mas sempre apresentar como mentor
      const aiResult = await generateAIResponse(
        message,
        module, // Usa o módulo detectado para buscar conteúdo correto
        contextWithProfile,
        conversationHistory,
        personalizedContext
      )
      response = aiResult.response
      source = 'hybrid'
      knowledgeItemId = bestMatch.id
      tokensUsed = aiResult.tokensUsed
      modelUsed = aiResult.modelUsed
      console.log('✅ NOEL - Resposta híbrida (base + IA)')
    } else {
      // Baixa similaridade → mas ainda usar conteúdo encontrado se houver
      if (knowledgeResult.items.length > 0 && bestMatch) {
        // Mesmo com similaridade baixa, se encontrou algo, usar como base
        const knowledgeContext = knowledgeResult.items.slice(0, 3).map(item => 
          `**${item.title}** (${item.category}):\n${item.content}`
        ).join('\n\n---\n\n')

        const fullContext = [
          homContext, // HOM sempre primeiro (prioridade)
          `Base de Conhecimento encontrada:\n${knowledgeContext}`,
          personalizedContext ? `\n\nContexto do Consultor:\n${personalizedContext}` : null,
          `\n\nINSTRUÇÕES IMPORTANTES:\n- Se houver CONTEXTO HOM acima, SEMPRE use essas informações com prioridade máxima\n- Use o conteúdo da Base de Conhecimento como base adicional\n- NÃO invente scripts, use os scripts fornecidos\n- Se houver múltiplos scripts, ofereça todos\n- Formate os scripts claramente com título e conteúdo completo\n- Mencione quando usar cada script e para quem`
        ].filter(Boolean).join('\n')

        const aiResult = await generateAIResponse(
          message,
          module,
          fullContext,
          conversationHistory,
          personalizedContext
        )
        response = aiResult.response
        source = 'hybrid' // Mudar para hybrid mesmo com baixa similaridade se encontrou conteúdo
        knowledgeItemId = bestMatch.id
        tokensUsed = aiResult.tokensUsed
        modelUsed = aiResult.modelUsed
        console.log('✅ NOEL - Resposta híbrida (baixa similaridade mas usando conteúdo encontrado)')
      } else {
        // Nenhum conteúdo encontrado → gerar com IA
        const fullContext = [
          homContext, // HOM sempre primeiro (prioridade)
          personalizedContext ? `\n\nContexto do Consultor:\n${personalizedContext}` : null,
          `\n\nINSTRUÇÕES CRÍTICAS:\n- Se houver CONTEXTO HOM acima, SEMPRE use essas informações com prioridade máxima\n- HOM = "Herbalife Opportunity Meeting" (Encontro de Apresentação de Negócio do Herbalife)\n- HOM é a PALAVRA MATRIZ do recrutamento e duplicação\n- NUNCA use "Hora do Mentor" - essa tradução não é usada\n- NUNCA invente outras definições de HOM`
        ].filter(Boolean).join('\n') || null

        const aiResult = await generateAIResponse(
          message,
          module,
          fullContext,
          conversationHistory,
          personalizedContext
        )
        response = aiResult.response
        source = 'ia_generated'
        tokensUsed = aiResult.tokensUsed
        modelUsed = aiResult.modelUsed
        console.log('✅ NOEL - Resposta gerada com IA (nenhum conteúdo encontrado)')
      }
    }

    // 7. Salvar query no log com análise
    try {
      const { data: savedQuery } = await supabaseAdmin
        .from('wellness_user_queries')
        .insert({
          user_id: user.id,
          query: message,
          response: response.substring(0, 5000), // limitar tamanho
          source_type: source,
          module_type: module,
          knowledge_item_id: knowledgeItemId,
          similarity_score: similarityScore,
          tokens_used: tokensUsed,
          model_used: modelUsed,
          detected_topic: queryAnalysis.topic,
          detected_challenge: queryAnalysis.challenge,
          career_stage: queryAnalysis.careerStage,
          priority_area: queryAnalysis.priorityArea,
          sentiment: queryAnalysis.sentiment,
        })
        .select()
        .single()

      // Salvar análise detalhada (já está no insert acima, mas garantindo)
      if (savedQuery) {
        await saveQueryAnalysis(user.id, message, queryAnalysis, module)
      }

      // Atualizar perfil do consultor (trigger automático)
      await supabaseAdmin.rpc('update_consultant_profile', { p_user_id: user.id })
    } catch (logError) {
      console.error('⚠️ Erro ao salvar log (não crítico):', logError)
    }

    // 8. Verificar se deve sugerir aprendizado
    if (source === 'ia_generated' && similarityScore < 0.40) {
      // Query nova que pode virar conhecimento
      try {
        const { data: suggestionData, error: learnError } = await supabaseAdmin
          .from('wellness_learning_suggestions')
          .upsert({
            query: message,
            suggested_response: response.substring(0, 2000),
            suggested_category: module,
            frequency: 1,
            last_seen_at: new Date().toISOString(),
          }, {
            onConflict: 'query',
            ignoreDuplicates: false,
          })
          .select()
          .single()

        if (learnError) {
          throw learnError
        }

        if (suggestionData) {
          // Incrementar frequência se já existe
          const { data: updatedFrequency, error: incrementError } = await supabaseAdmin.rpc('increment_learning_frequency', {
            suggestion_id: suggestionData.id,
          })

          // Buscar sugestão atualizada para obter a frequência
          const { data: updatedSuggestion } = await supabaseAdmin
            .from('wellness_learning_suggestions')
            .select('frequency')
            .eq('id', suggestionData.id)
            .single()

          // Notificar admin se frequência >= 3
          if (updatedSuggestion && updatedSuggestion.frequency >= 3) {
            try {
              const { notifyAdminNewLearningSuggestion } = await import('@/lib/wellness-learning-notifications')
              await notifyAdminNewLearningSuggestion({
                suggestionId: suggestionData.id,
                query: message,
                suggestedResponse: response.substring(0, 2000),
                frequency: updatedSuggestion.frequency,
                suggestedCategory: module,
                createdAt: suggestionData.created_at || new Date().toISOString(),
              })
            } catch (notifyError) {
              console.error('⚠️ Erro ao notificar admin (não crítico):', notifyError)
            }
          }
        }
      } catch (learnError) {
        console.error('⚠️ Erro ao sugerir aprendizado (não crítico):', learnError)
      }
    }

    const result: NoelResponse = {
      response,
      module: 'mentor', // Sempre retorna 'mentor' para a interface (NOEL sempre se apresenta como mentor)
      source,
      knowledgeItemId,
      similarityScore,
      tokensUsed: tokensUsed > 0 ? tokensUsed : undefined,
      modelUsed,
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ Erro no NOEL:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar mensagem',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

