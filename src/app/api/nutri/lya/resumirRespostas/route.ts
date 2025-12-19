/**
 * LYA Function: resumirRespostas
 * 
 * Permite que a LYA resuma respostas de formulários de forma inteligente
 * 
 * EXEMPLOS DE USO:
 * - "LYA, resume a anamnese dessa cliente pra mim"
 * - "LYA, o que essa cliente respondeu no formulário?"
 * - "LYA, me dá um resumo dos pontos principais da anamnese"
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ResumirRespostasRequest {
  user_id: string
  response_id?: string // ID específico de uma resposta
  form_id?: string // Ou ID do formulário (para resumir última resposta)
  client_id?: string // Ou ID do cliente (para resumir última resposta dele)
}

export async function POST(request: NextRequest) {
  try {
    const body: ResumirRespostasRequest = await request.json()
    const { user_id, response_id, form_id, client_id } = body

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'user_id é obrigatório' },
        { status: 400 }
      )
    }

    if (!response_id && !form_id && !client_id) {
      return NextResponse.json(
        { success: false, error: 'É necessário fornecer response_id, form_id ou client_id' },
        { status: 400 }
      )
    }

    console.log('🤖 [LYA] Resumindo respostas:', { user_id, response_id, form_id, client_id })

    // Buscar resposta(s) e formulário
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
          description,
          form_type,
          structure
        ),
        clients (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('user_id', user_id)

    if (response_id) {
      query = query.eq('id', response_id)
    } else if (form_id) {
      query = query.eq('form_id', form_id).order('created_at', { ascending: false }).limit(1)
    } else if (client_id) {
      query = query.eq('client_id', client_id).order('created_at', { ascending: false }).limit(1)
    }

    const { data: responses, error } = await query

    if (error || !responses || responses.length === 0) {
      console.error('❌ [LYA] Erro ao buscar respostas:', error)
      return NextResponse.json(
        { success: false, error: 'Nenhuma resposta encontrada' },
        { status: 404 }
      )
    }

    const response = responses[0]
    const formulario = response.custom_forms as any
    const cliente = response.clients as any
    const respostas = response.responses
    const estrutura = formulario.structure

    console.log('📋 [LYA] Formulário encontrado:', formulario.name)
    console.log('👤 [LYA] Cliente:', cliente?.name || 'Sem cliente vinculado')

    // Construir texto com as respostas formatadas
    let textoRespostas = `FORMULÁRIO: ${formulario.name}\n`
    textoRespostas += `TIPO: ${formulario.form_type}\n`
    if (formulario.description) {
      textoRespostas += `DESCRIÇÃO: ${formulario.description}\n`
    }
    textoRespostas += `DATA DO PREENCHIMENTO: ${new Date(response.created_at).toLocaleDateString('pt-BR')}\n\n`
    
    if (cliente) {
      textoRespostas += `CLIENTE: ${cliente.name}\n`
      if (cliente.email) textoRespostas += `E-MAIL: ${cliente.email}\n`
      if (cliente.phone) textoRespostas += `TELEFONE: ${cliente.phone}\n`
      textoRespostas += `\n`
    }

    textoRespostas += `RESPOSTAS:\n\n`

    estrutura.fields.forEach((field: any) => {
      const resposta = respostas[field.id]
      
      if (resposta !== null && resposta !== undefined && resposta !== '') {
        textoRespostas += `${field.label}:\n`
        
        if (Array.isArray(resposta)) {
          textoRespostas += `- ${resposta.join(', ')}\n\n`
        } else if (typeof resposta === 'boolean' || field.type === 'yesno') {
          textoRespostas += `- ${resposta === true || resposta === 'true' || resposta === 'sim' ? 'Sim' : 'Não'}\n\n`
        } else {
          textoRespostas += `- ${resposta}\n\n`
        }
      }
    })

    console.log('📝 [LYA] Texto de respostas preparado (tamanho):', textoRespostas.length)

    // Usar GPT para gerar resumo inteligente
    const prompt = `Você é LYA, mentora estratégica para nutricionistas. Você recebeu as respostas de um formulário preenchido por um cliente.

⚠️ IMPORTANTE - LIMITES DA SUA FUNÇÃO:
- Você vai fazer APENAS um RESUMO DESCRITIVO das informações
- VOCÊ NÃO VAI fazer análise clínica, diagnóstico ou interpretação médica
- VOCÊ NÃO VAI sugerir condutas, protocolos ou prescrições
- VOCÊ NÃO VAI interpretar sintomas ou fazer correlações clínicas
- Seu papel é ORGANIZAR informações para a nutricionista DECIDIR

Sua tarefa é criar um RESUMO PROFISSIONAL E ÚTIL para a nutricionista, destacando:
1. Dados principais do cliente (idade, peso, altura, objetivo)
2. Objetivo declarado pelo cliente
3. Informações de saúde reportadas (doenças, alergias, medicamentos - SEM INTERPRETAR)
4. Hábitos reportados (alimentação, exercícios, água - SEM JULGAR)
5. Restrições e preferências alimentares
6. Observações relevantes do cliente

FORMATO DO RESUMO:
- Use linguagem profissional mas acessível
- Seja objetiva e DESCRITIVA (não interpretativa)
- Destaque informações críticas com **negrito**
- Use bullets (•) para listar itens
- Não faça correlações clínicas ou diagnósticas
- Não sugira condutas ou protocolos
- Apenas ORGANIZE as informações para a nutricionista analisar

EXEMPLO DO QUE FAZER:
✅ "Cliente relata comer por ansiedade à noite"
✅ "Histórico familiar: diabetes tipo 2"
✅ "Objetivo declarado: emagrecimento"

EXEMPLO DO QUE NÃO FAZER:
❌ "Apresenta sinais de resistência à insulina"
❌ "Sugiro protocolo low carb"
❌ "Indica necessidade de suplementação"

DADOS DO FORMULÁRIO:
${textoRespostas}

GERE UM RESUMO DESCRITIVO E PROFISSIONAL (SEM ANÁLISE CLÍNICA):`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é LYA, mentora estratégica para nutricionistas. Crie resumos profissionais e úteis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const resumo = completion.choices[0]?.message?.content || 'Não foi possível gerar resumo.'

    console.log('✅ [LYA] Resumo gerado com sucesso (tamanho):', resumo.length)

    return NextResponse.json({
      success: true,
      data: {
        resumo,
        form_name: formulario.name,
        client_name: cliente?.name || 'Sem cliente vinculado',
        response_date: response.created_at,
        response_id: response.id
      }
    })

  } catch (error: any) {
    console.error('❌ [LYA] Erro em resumirRespostas:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro ao resumir respostas',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

