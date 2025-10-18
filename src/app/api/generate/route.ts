import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Usar template encontrado ou padrão
    let template = templates?.[0]?.content || {
      title: 'Quiz Personalizado',
      description: 'Quiz criado especialmente para você',
      questions: [
        {
          question: 'Como você se sente hoje?',
          options: ['Ótimo', 'Bom', 'Regular', 'Ruim']
        }
      ]
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
