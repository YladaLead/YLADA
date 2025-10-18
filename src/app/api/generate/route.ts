import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, category, type } = await request.json()

    // Buscar template similar no banco
    const { data: templates, error } = await supabaseAdmin
      .from('templates_base')
      .select('*')
      .eq('type', type || 'quiz')
      .eq('category', category || 'energia')
      .limit(1)

    if (error) {
      console.error('Erro ao buscar templates:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar templates' },
        { status: 500 }
      )
    }

    // Usar Assistant ID para gerar conteúdo personalizado
    let template
    try {
      const assistantId = process.env.OPENAI_ASSISTANT_ID
      
      if (assistantId && prompt) {
        // Criar thread e usar assistant
        const thread = await openai.beta.threads.create()
        
        await openai.beta.threads.messages.create(thread.id, {
          role: 'user',
          content: `Crie um ${type || 'quiz'} sobre ${category || 'energia'} baseado neste prompt: "${prompt}". Retorne apenas JSON válido com estrutura: {"title": "Título", "description": "Descrição", "questions": [{"question": "Pergunta", "options": ["Opção1", "Opção2", "Opção3", "Opção4"]}]}`
        })

        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: assistantId,
        })

        // Aguardar conclusão
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
        while (runStatus.status !== 'completed') {
          await new Promise(resolve => setTimeout(resolve, 1000))
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
        }

        // Obter resposta
        const messages = await openai.beta.threads.messages.list(thread.id)
        const lastMessage = messages.data[0]
        
        if (lastMessage?.content[0]?.type === 'text') {
          const responseText = lastMessage.content[0].text.value
          try {
            template = JSON.parse(responseText)
          } catch {
            // Se não conseguir fazer parse, usar template padrão
            template = templates?.[0]?.content || {
              title: 'Quiz Personalizado',
              description: 'Quiz criado especialmente para você',
              questions: [
                {
                  question: 'Como você se sente hoje?',
                  options: ['Ótimo', 'Bom', 'Regular', 'Ruim']
                }
              ]
            }
          }
        }
      } else {
        // Usar template encontrado ou padrão
        template = templates?.[0]?.content || {
          title: 'Quiz Personalizado',
          description: 'Quiz criado especialmente para você',
          questions: [
            {
              question: 'Como você se sente hoje?',
              options: ['Ótimo', 'Bom', 'Regular', 'Ruim']
            }
          ]
        }
      }
    } catch (aiError) {
      console.error('Erro ao usar Assistant:', aiError)
      // Fallback para template padrão
      template = templates?.[0]?.content || {
        title: 'Quiz Personalizado',
        description: 'Quiz criado especialmente para você',
        questions: [
          {
            question: 'Como você se sente hoje?',
            options: ['Ótimo', 'Bom', 'Regular', 'Ruim']
          }
        ]
      }
    }

    // Gerar slug único
    const slug = Math.random().toString(36).substr(2, 9)
    
    // Criar link no banco
    const { data: newLink, error: linkError } = await supabaseAdmin
      .from('generated_links')
      .insert({
        slug,
        title: template.title,
        description: template.description,
        content: template,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/link/${slug}`,
        status: 'active',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
      })
      .select()
      .single()

    if (linkError) {
      console.error('Erro ao criar link:', linkError)
      return NextResponse.json(
        { success: false, error: 'Erro ao criar link' },
        { status: 500 }
      )
    }

    // Atualizar contador de uso do template
    if (templates?.[0]) {
      await supabaseAdmin
        .from('templates_base')
        .update({ usage_count: templates[0].usage_count + 1 })
        .eq('id', templates[0].id)
    }

    // Salvar prompt da IA para aprendizado
    await supabaseAdmin
      .from('templates_ia')
      .insert({
        prompt,
        template_generated: template,
        success_rate: 0.00,
        usage_count: 0
      })

    return NextResponse.json({
      success: true,
      data: {
        slug: newLink.slug,
        template: {
          type: type || 'quiz',
          category: category || 'energia',
          ...template
        },
        url: newLink.url,
        createdAt: newLink.created_at
      }
    })

  } catch (error) {
    console.error('Erro ao gerar link:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
