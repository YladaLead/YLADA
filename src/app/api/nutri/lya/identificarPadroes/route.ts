/**
 * LYA Function: identificarPadroes
 * 
 * Permite que a LYA identifique padrões nas respostas de formulários
 * 
 * EXEMPLOS DE USO:
 * - "LYA, identifica padrões nas anamneses dos meus clientes"
 * - "LYA, o que meus clientes têm em comum?"
 * - "LYA, quais são os problemas mais relatados?"
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface IdentificarPadroesRequest {
  user_id: string
  form_id?: string // Analisar respostas de um formulário específico
  form_type?: string // Ou analisar por tipo (ex: 'anamnese')
  period_days?: number // Período em dias (padrão: 30)
  limit?: number // Limite de respostas para analisar (padrão: 50)
}

export async function POST(request: NextRequest) {
  try {
    const body: IdentificarPadroesRequest = await request.json()
    const { user_id, form_id, form_type, period_days = 30, limit = 50 } = body

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'user_id é obrigatório' },
        { status: 400 }
      )
    }

    console.log('🤖 [LYA] Identificando padrões:', { user_id, form_id, form_type, period_days, limit })

    // Calcular data de início do período
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period_days)

    // Buscar respostas do período
    let query = supabaseAdmin
      .from('form_responses')
      .select(`
        id,
        responses,
        created_at,
        form_id,
        client_id,
        custom_forms!inner (
          id,
          name,
          form_type,
          structure
        ),
        clients (
          id,
          name
        )
      `)
      .eq('user_id', user_id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    if (form_id) {
      query = query.eq('form_id', form_id)
    } else if (form_type) {
      // Filtrar por tipo de formulário através do join
      query = query.eq('custom_forms.form_type', form_type)
    }

    const { data: responses, error } = await query

    if (error) {
      console.error('❌ [LYA] Erro ao buscar respostas:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar respostas' },
        { status: 500 }
      )
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          padroes: 'Não há respostas suficientes no período selecionado para identificar padrões.',
          total_responses: 0,
          period_days
        }
      })
    }

    console.log(`📊 [LYA] ${responses.length} respostas encontradas para análise`)

    // Preparar dados para análise
    const dadosParaAnalise: any[] = []

    responses.forEach((response: any) => {
      const formulario = response.custom_forms
      const cliente = response.clients
      const respostas = response.responses
      const estrutura = formulario.structure

      const dadosResposta: any = {
        form_name: formulario.name,
        form_type: formulario.form_type,
        client_name: cliente?.name || 'Anônimo',
        date: new Date(response.created_at).toLocaleDateString('pt-BR'),
        responses: {}
      }

      // Extrair respostas relevantes
      estrutura.fields.forEach((field: any) => {
        const resposta = respostas[field.id]
        
        if (resposta !== null && resposta !== undefined && resposta !== '') {
          dadosResposta.responses[field.label] = Array.isArray(resposta) 
            ? resposta.join(', ')
            : String(resposta)
        }
      })

      dadosParaAnalise.push(dadosResposta)
    })

    // Limitar tamanho do texto para não exceder limites da API
    const textoResumido = JSON.stringify(dadosParaAnalise, null, 2).substring(0, 8000)

    console.log('📝 [LYA] Dados preparados para análise (tamanho):', textoResumido.length)

    // Usar GPT para identificar padrões
    const prompt = `Você é LYA, mentora estratégica para nutricionistas. Você recebeu ${responses.length} respostas de formulários dos últimos ${period_days} dias.

⚠️ IMPORTANTE - LIMITES DA SUA FUNÇÃO:
- Você vai identificar PADRÕES DESCRITIVOS (o que se repete)
- VOCÊ NÃO VAI fazer diagnósticos ou correlações clínicas
- VOCÊ NÃO VAI sugerir protocolos, prescrições ou condutas técnicas
- VOCÊ NÃO VAI interpretar sintomas de forma médica
- Seu papel é mostrar O QUE os clientes RELATAM, não o que isso SIGNIFICA clinicamente

Sua tarefa é IDENTIFICAR PADRÕES DESCRITIVOS para a nutricionista, como:

1. **Queixas/Situações Mais Relatadas**: O que os clientes mencionam com frequência?
2. **Objetivos Mais Comuns**: Quais metas os clientes declaram?
3. **Hábitos Reportados**: Que comportamentos alimentares se repetem?
4. **Estilo de Vida**: Padrões de exercício, sono, hidratação relatados
5. **Restrições Declaradas**: Alergias, intolerâncias mencionadas
6. **Perfil do Público**: Características demográficas e contextuais

DADOS DAS RESPOSTAS:
\`\`\`
${textoResumido}
\`\`\`

FORMATO DA RESPOSTA:
- Use **negrito** para destacar padrões importantes
- Use estatísticas descritivas (ex: "X clientes relataram...")
- Seja específica e DESCRITIVA (não interpretativa)
- Foque em PADRÕES OBSERVADOS, não em diagnósticos
- Sugira insights ESTRATÉGICOS (não clínicos) sobre o público

EXEMPLO DO QUE FAZER:
✅ "12 clientes (67%) relataram comer por ansiedade"
✅ "15 clientes (83%) mencionaram baixa hidratação"
✅ "Perfil: mulheres 25-40 anos, objetivo emagrecimento"

EXEMPLO DO QUE NÃO FAZER:
❌ "Esses sintomas indicam resistência à insulina"
❌ "Sugiro protocolo anti-inflamatório"
❌ "Diagnóstico de compulsão alimentar em 67%"

GERE UMA ANÁLISE DE PADRÕES DESCRITIVOS (SEM DIAGNÓSTICO):`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é LYA, mentora estratégica para nutricionistas. Identifique padrões e gere insights valiosos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    const padroes = completion.choices[0]?.message?.content || 'Não foi possível identificar padrões.'

    console.log('✅ [LYA] Padrões identificados com sucesso (tamanho):', padroes.length)

    // Estatísticas básicas
    const estatisticas = {
      total_responses: responses.length,
      period_days,
      unique_forms: new Set(responses.map((r: any) => r.form_id)).size,
      unique_clients: new Set(responses.map((r: any) => r.client_id).filter(Boolean)).size,
      date_range: {
        start: startDate.toLocaleDateString('pt-BR'),
        end: new Date().toLocaleDateString('pt-BR')
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        padroes,
        estatisticas
      }
    })

  } catch (error: any) {
    console.error('❌ [LYA] Erro em identificarPadroes:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro ao identificar padrões',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}


