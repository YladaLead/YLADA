/**
 * POST /api/wellness/noel/responder
 * 
 * Fluxo principal do NOEL - Nova implementação
 * 
 * Algoritmo:
 * 1. Carregar contexto completo (consultor + diagnóstico + plano + progresso + scripts)
 * 2. Decidir estratégia (resposta pronta / ajuste personalizado / IA)
 * 3. Gerar resposta
 * 4. Salvar interação
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  loadNoelContext,
  decideResponseStrategy,
  generatePersonalizedResponse,
  detectTopicAndIntent,
} from '@/lib/noel-wellness/response-generator'
import type { NoelResponderRequest, NoelResponderResponse } from '@/types/wellness-noel'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: NoelResponderRequest = await request.json()
    const { consultor_id, mensagem, conversation_history = [] } = body

    if (!mensagem || mensagem.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // 1. Carregar contexto completo
    const context = await loadNoelContext(consultor_id)
    if (!context) {
      return NextResponse.json(
        { error: 'Consultor não encontrado ou contexto não disponível' },
        { status: 404 }
      )
    }

    // 2. Decidir estratégia de resposta
    const strategy = decideResponseStrategy(context, mensagem)

    // 3. Gerar resposta
    let resposta: string
    let usadoIA = false
    let scriptsUsados: string[] = []

    if (strategy.useReadyResponse && strategy.readyResponse) {
      // Resposta pronta + ajuste personalizado
      resposta = generatePersonalizedResponse(strategy.readyResponse, context)
      
      // Identificar scripts usados
      const scriptMatch = context.scriptsRelevantes.find(s => 
        s.conteudo.includes(strategy.readyResponse.substring(0, 50))
      )
      if (scriptMatch) {
        scriptsUsados = [scriptMatch.id]
      }
    } else if (strategy.usePersonalizedAdjustment && strategy.adjustmentContext) {
      // Ajuste personalizado baseado em contexto
      resposta = await gerarRespostaComContexto(
        mensagem,
        strategy.adjustmentContext,
        context,
        conversation_history
      )
      usadoIA = true
    } else {
      // Fallback: IA completa
      resposta = await gerarRespostaIA(mensagem, context, conversation_history)
      usadoIA = true
    }

    // 4. Detectar tópico e intenção
    const { topico, intencao } = detectTopicAndIntent(mensagem)

    // 5. Salvar interação
    try {
      await supabaseAdmin
        .from('ylada_wellness_interacoes')
        .insert({
          consultor_id: consultor_id,
          mensagem_usuario: mensagem,
          resposta_noel: resposta,
          diagnostico_usado: !!context.diagnostico,
          plano_usado: !!context.planoAtivo,
          progresso_usado: !!context.progressoHoje,
          scripts_usados: scriptsUsados,
          usado_ia: usadoIA,
          topico_detectado: topico,
          intencao_detectada: intencao,
        })
    } catch (logError) {
      console.error('⚠️ Erro ao salvar interação (não crítico):', logError)
    }

    const response: NoelResponderResponse = {
      resposta,
      diagnostico_usado: !!context.diagnostico,
      plano_usado: !!context.planoAtivo,
      progresso_usado: !!context.progressoHoje,
      scripts_usados: scriptsUsados,
      usado_ia: usadoIA,
      topico_detectado: topico,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('❌ Erro no NOEL responder:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar mensagem',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * Gera resposta usando contexto personalizado
 */
async function gerarRespostaComContexto(
  mensagem: string,
  contexto: string,
  context: any,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const systemPrompt = `Você é NOEL, mentor oficial da área WELLNESS do YLADA.

Você ajuda consultores Herbalife a crescerem no negócio através de:
- Estratégias personalizadas
- Scripts de vendas e recrutamento
- Orientação sobre produtos e bebidas
- Acompanhamento de progresso

Contexto do consultor:
${contexto}

Regras:
- Seja direto, motivacional e prático
- Use os scripts da base de conhecimento quando relevante
- Personalize tudo conforme o perfil do consultor
- Seja ético e humano
- Economize tokens sendo objetivo`

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-4),
    { role: 'user', content: mensagem },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta adequada.'
  } catch (error) {
    console.error('❌ Erro ao gerar resposta com contexto:', error)
    return 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.'
  }
}

/**
 * Gera resposta completa via IA (fallback)
 */
async function gerarRespostaIA(
  mensagem: string,
  context: any,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  const systemPrompt = `Você é NOEL, mentor oficial da área WELLNESS do YLADA.

Você ajuda consultores Herbalife a crescerem no negócio.

Informações do consultor:
- Nome: ${context.consultor.nome}
- Estágio: ${context.consultor.estagio_negocio}
- Tempo disponível: ${context.consultor.tempo_disponivel_diario || 'não informado'}

Seja direto, motivacional, prático e ético.`

  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-4),
    { role: 'user', content: mensagem },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta adequada.'
  } catch (error) {
    console.error('❌ Erro ao gerar resposta IA:', error)
    return 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.'
  }
}

