/**
 * NOEL WELLNESS - API Principal
 * 
 * Endpoint: POST /api/wellness/noel
 * 
 * Processa mensagens do usuário e retorna resposta do NOEL
 * 
 * PRIORIDADE:
 * 1. Tenta usar Agent Builder (se configurado)
 * 2. Fallback para sistema híbrido: Base de Conhecimento → IA
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { classifyIntention, type NoelModule } from '@/lib/noel-wellness/classifier'
import { searchKnowledgeBase, generateEmbedding, saveItemEmbedding } from '@/lib/noel-wellness/knowledge-search'
import { 
  analyzeQuery, 
  getConsultantProfile, 
  saveQueryAnalysis, 
  generatePersonalizedContext,
  generateProactiveSuggestions 
} from '@/lib/noel-wellness/history-analyzer'
import { NOEL_FEW_SHOTS } from '@/lib/noel-wellness/few-shots'
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
  userId: string
}

interface NoelResponse {
  response: string
  module: NoelModule
  source: 'knowledge_base' | 'ia_generated' | 'hybrid'
  knowledgeItemId?: string
  similarityScore?: number
  tokensUsed?: number
  modelUsed?: string
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
 * Constrói o system prompt baseado no módulo
 */
function buildSystemPrompt(module: NoelModule, knowledgeContext: string | null, consultantContext?: string): string {
  const basePrompt = `Você é NOEL, mentor oficial da área WELLNESS do YLADA.

Você opera em três modos:
1. NOEL MENTOR — estratégias personalizadas, metas, rotina, duplicação, vendas e motivação.
2. NOEL SUPORTE — instruções de uso do sistema YLADA WELLNESS.
3. NOEL TÉCNICO — explicações de fluxos, campanhas, scripts e bebidas funcionais.

Regras:
- Sempre consulte a Base de Conhecimento WELLNESS antes de gerar qualquer texto.
- Não invente informações médicas ou alegações de saúde.
- Seja ético, humano, inspirador e direcionado.
- Respeite o tempo, habilidades e objetivos do consultor.
- Ensine bebidas funcionais com foco em preparo, combinações e resultados permitidos.
- Ensine duplicação simples, prática e ética.
- Personalize tudo conforme o perfil do usuário.
- Economize tokens usando respostas prontas sempre que possível.
- Seja direto, objetivo e útil.

${knowledgeContext ? `\nContexto da Base de Conhecimento:\n${knowledgeContext}\n\nUse este contexto como base, mas personalize e expanda conforme necessário.` : ''}
${consultantContext ? `\n\nContexto do Consultor (use para personalizar):\n${consultantContext}\n\nAdapte sua resposta considerando o estágio da carreira, desafios identificados e histórico do consultor.` : ''}`

  switch (module) {
    case 'mentor':
      return `${basePrompt}

MODO ATIVO: NOEL MENTOR
- Foque em estratégia, planejamento e comportamento.
- Ajude com metas de PV, metas financeiras e metas de clientes.
- Ensine duplicação, convite, follow-up e vendas.
- Seja motivacional mas realista.
- Personalize baseado no perfil do consultor.

${NOEL_FEW_SHOTS}`

    case 'suporte':
      return `${basePrompt}

MODO ATIVO: NOEL SUPORTE
- Foque em instruções técnicas do sistema YLADA.
- Seja direto, objetivo e funcional.
- Explique passo a passo quando necessário.
- Se não souber algo técnico, seja honesto.`

    case 'tecnico':
      return `${basePrompt}

MODO ATIVO: NOEL TÉCNICO
- Foque em conteúdo operacional e técnico.
- Explique bebidas funcionais (preparo, combinações, benefícios permitidos).
- Traga informações sobre campanhas, scripts e fluxos.
- Use informações oficiais sempre que possível.`

    default:
      return basePrompt
  }
}

/**
 * POST /api/wellness/noel
 */
export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: NoelRequest = await request.json()
    const { message, conversationHistory = [] } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // ============================================
    // PRIORIDADE 1: Tentar usar Agent Builder
    // ============================================
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
      return NextResponse.json({
        response: agentBuilderResult.response,
        module: classification.module,
        source: 'agent_builder' as const,
      })
    }
    
    // ============================================
    // PRIORIDADE 2: Fallback para sistema híbrido
    // ============================================
    console.log('⚠️ Agent Builder não disponível, usando fallback híbrido')
    
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

    // 4. Buscar na base de conhecimento
    const knowledgeResult = await searchKnowledgeBase(message, module)
    const bestMatch = knowledgeResult.bestMatch
    const similarityScore = knowledgeResult.similarityScore

    let response: string
    let source: 'knowledge_base' | 'ia_generated' | 'hybrid'
    let knowledgeItemId: string | undefined
    let tokensUsed = 0
    let modelUsed: string | undefined

    // 5. Decidir estratégia baseado na similaridade
    if (similarityScore >= 0.80 && bestMatch) {
      // Alta similaridade → usar resposta exata
      response = bestMatch.content
      source = 'knowledge_base'
      knowledgeItemId = bestMatch.id
      console.log('✅ NOEL - Resposta da base de conhecimento (alta similaridade)')
    } else if (similarityScore >= 0.60 && bestMatch) {
      // Média similaridade → personalizar com IA
      // Adicionar contexto do consultor se disponível
      const contextWithProfile = personalizedContext 
        ? `${bestMatch.content}\n\nContexto do Consultor:\n${personalizedContext}`
        : bestMatch.content

      const aiResult = await generateAIResponse(
        message,
        module,
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
      // Baixa similaridade → gerar com IA
      const knowledgeContext = knowledgeResult.items.length > 0
        ? knowledgeResult.items.slice(0, 2).map(item => `- ${item.title}: ${item.content.substring(0, 200)}`).join('\n')
        : null

      // Adicionar contexto personalizado do perfil do consultor
      const fullContext = [
        knowledgeContext,
        personalizedContext ? `\n\nContexto do Consultor:\n${personalizedContext}` : null,
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
      console.log('✅ NOEL - Resposta gerada com IA')
    }

    // 6. Salvar query no log com análise
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

    // 7. Verificar se deve sugerir aprendizado
    if (source === 'ia_generated' && similarityScore < 0.40) {
      // Query nova que pode virar conhecimento
      try {
        await supabaseAdmin
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
          .then(({ data }) => {
            if (data && data.length > 0) {
              // Incrementar frequência se já existe
              supabaseAdmin.rpc('increment_learning_frequency', {
                suggestion_id: data[0].id,
              })
            }
          })
      } catch (learnError) {
        console.error('⚠️ Erro ao sugerir aprendizado (não crítico):', learnError)
      }
    }

    const result: NoelResponse = {
      response,
      module,
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

