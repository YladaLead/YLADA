/**
 * LYA Function: criarFormulario
 * 
 * Permite que a LYA crie formulários personalizados via comando natural
 * 
 * EXEMPLOS DE USO:
 * - "LYA, cria uma anamnese básica pra mim"
 * - "LYA, cria um formulário de acompanhamento semanal"
 * - "LYA, preciso de um questionário sobre hábitos alimentares"
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface CriarFormularioRequest {
  user_id: string
  descricao_solicitada: string // Descrição em linguagem natural do que o usuário quer
}

export async function POST(request: NextRequest) {
  try {
    const body: CriarFormularioRequest = await request.json()
    const { user_id, descricao_solicitada } = body

    if (!user_id || !descricao_solicitada) {
      return NextResponse.json(
        { success: false, error: 'user_id e descricao_solicitada são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('🤖 [LYA] Criando formulário:', { user_id, descricao_solicitada })

    // Usar GPT para gerar estrutura do formulário baseado na descrição
    const prompt = `Você é uma assistente especializada em criar formulários para nutricionistas.

SOLICITAÇÃO DO USUÁRIO:
"${descricao_solicitada}"

Sua tarefa é criar um formulário completo e profissional baseado nesta solicitação.

TIPOS DE FORMULÁRIO DISPONÍVEIS:
- questionario: Questionários gerais
- anamnese: Anamneses nutricionais completas
- avaliacao: Avaliações e acompanhamentos
- consentimento: Termos e consentimentos
- outro: Outros tipos

TIPOS DE CAMPO DISPONÍVEIS:
- text: Texto curto
- textarea: Texto longo
- email: E-mail
- tel: Telefone
- date: Data
- time: Horário
- number: Número
- radio: Múltipla escolha (uma opção)
- checkbox: Múltipla escolha (várias opções)
- select: Lista suspensa
- yesno: Sim/Não

REGRAS:
1. Sempre inclua campos básicos: nome, email, telefone
2. Seja profissional e completo
3. Use placeholders explicativos
4. Marque campos importantes como required: true
5. Para radio, checkbox e select, forneça options relevantes
6. Crie entre 10-25 campos (dependendo da complexidade)

RETORNE APENAS UM JSON válido (sem markdown, sem explicações) com esta estrutura:
{
  "name": "Nome do Formulário",
  "description": "Descrição breve do formulário",
  "form_type": "anamnese|questionario|avaliacao|consentimento|outro",
  "fields": [
    {
      "id": "campo_id_snake_case",
      "type": "text|textarea|email|tel|date|time|number|radio|checkbox|select|yesno",
      "label": "Rótulo do Campo",
      "placeholder": "Texto de ajuda (opcional)",
      "required": true|false,
      "options": ["opção1", "opção2"] // Apenas para radio, checkbox, select
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é uma especialista em criar formulários para nutricionistas. Retorne APENAS JSON válido, sem markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const respostaGPT = completion.choices[0]?.message?.content || ''
    
    // Remover markdown code blocks se existirem
    const jsonLimpo = respostaGPT
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    console.log('📝 [LYA] Resposta GPT (primeiros 200 chars):', jsonLimpo.substring(0, 200))

    let formularioGerado
    try {
      formularioGerado = JSON.parse(jsonLimpo)
    } catch (parseError) {
      console.error('❌ [LYA] Erro ao parsear JSON:', parseError)
      console.error('❌ [LYA] JSON recebido:', jsonLimpo)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao interpretar resposta do GPT',
          details: process.env.NODE_ENV === 'development' ? jsonLimpo : undefined
        },
        { status: 500 }
      )
    }

    // Validar estrutura
    if (!formularioGerado.name || !formularioGerado.form_type || !Array.isArray(formularioGerado.fields)) {
      return NextResponse.json(
        { success: false, error: 'Estrutura de formulário inválida gerada pelo GPT' },
        { status: 500 }
      )
    }

    // Gerar slug
    const normalizeSlug = (value: string) => {
      return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') || 'formulario'
    }

    let slug = normalizeSlug(formularioGerado.name)

    // Verificar se slug já existe
    const { data: existingForm } = await supabaseAdmin
      .from('custom_forms')
      .select('id')
      .eq('slug', slug)
      .eq('user_id', user_id)
      .maybeSingle()

    if (existingForm) {
      // Adicionar timestamp ao slug
      slug = `${slug}-${Date.now()}`
    }

    // Criar formulário no banco
    const { data: newForm, error } = await supabaseAdmin
      .from('custom_forms')
      .insert({
        user_id: user_id,
        name: formularioGerado.name,
        description: formularioGerado.description || null,
        form_type: formularioGerado.form_type,
        structure: { fields: formularioGerado.fields },
        is_active: true,
        is_template: false,
        slug: slug
      })
      .select()
      .single()

    if (error) {
      console.error('❌ [LYA] Erro ao criar formulário:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar formulário no banco de dados' },
        { status: 500 }
      )
    }

    console.log('✅ [LYA] Formulário criado com sucesso:', newForm.id)

    return NextResponse.json({
      success: true,
      data: {
        form: newForm,
        message: `Formulário "${newForm.name}" criado com sucesso! Ele já está disponível na sua lista de formulários.`
      }
    })

  } catch (error: any) {
    console.error('❌ [LYA] Erro em criarFormulario:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro ao criar formulário',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}












