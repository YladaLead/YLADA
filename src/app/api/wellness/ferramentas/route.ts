import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Listar ferramentas do usuário ou buscar por ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const toolId = searchParams.get('id')
    const profession = searchParams.get('profession') || 'wellness'

    if (toolId) {
      // Buscar ferramenta específica
      const { data, error } = await supabaseAdmin
        .from('user_templates')
        .select(`
          *,
          user_profiles!inner(user_slug),
          users!inner(name, email)
        `)
        .eq('id', toolId)
        .eq('profession', profession)
        .single()

      if (error) throw error

      return NextResponse.json({ tool: data })
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      )
    }

    // Listar ferramentas do usuário
    const { data, error } = await supabaseAdmin
      .from('user_templates')
      .select(`
        *,
        user_profiles!inner(user_slug),
        users!inner(name, email)
      `)
      .eq('user_id', userId)
      .eq('profession', profession)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ tools: data || [] })
  } catch (error: any) {
    console.error('Erro ao buscar ferramentas:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar ferramentas' },
      { status: 500 }
    )
  }
}

// POST - Criar nova ferramenta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      template_id,
      template_slug,
      title,
      description,
      slug,
      emoji,
      custom_colors,
      cta_type,
      whatsapp_number,
      external_url,
      cta_button_text,
      custom_whatsapp_message,
      profession = 'wellness'
    } = body

    // Validações
    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      )
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'slug é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o slug já existe
    const { data: existing } = await supabaseAdmin
      .from('user_templates')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Este nome de URL já está em uso. Escolha outro.' },
        { status: 409 }
      )
    }

    // Buscar conteúdo do template base se template_id fornecido
    let content = {}
    if (template_id) {
      const { data: template } = await supabaseAdmin
        .from('templates_nutrition')
        .select('content')
        .eq('id', template_id)
        .single()

      if (template) {
        content = template.content
      }
    }

    // Inserir nova ferramenta
    const { data, error } = await supabaseAdmin
      .from('user_templates')
      .insert({
        user_id,
        template_id: template_id || null,
        template_slug,
        slug,
        title,
        description,
        emoji,
        custom_colors: custom_colors || { principal: '#10B981', secundaria: '#059669' },
        cta_type: cta_type || 'whatsapp',
        whatsapp_number,
        external_url,
        cta_button_text: cta_button_text || 'Conversar com Especialista',
        custom_whatsapp_message,
        profession,
        content,
        status: 'active',
        views: 0,
        leads_count: 0
      })
      .select(`
        *,
        user_profiles!inner(user_slug),
        users!inner(name, email)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(
      { 
        tool: data,
        message: 'Ferramenta criada com sucesso!'
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erro ao criar ferramenta:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar ferramenta' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar ferramenta
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      user_id,
      title,
      description,
      slug,
      emoji,
      custom_colors,
      cta_type,
      whatsapp_number,
      external_url,
      cta_button_text,
      custom_whatsapp_message,
      status
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o slug mudou e se já existe
    if (slug) {
      const { data: existing } = await supabaseAdmin
        .from('user_templates')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Este nome de URL já está em uso. Escolha outro.' },
          { status: 409 }
        )
      }
    }

    // Preparar objeto de atualização
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (slug !== undefined) updateData.slug = slug
    if (emoji !== undefined) updateData.emoji = emoji
    if (custom_colors !== undefined) updateData.custom_colors = custom_colors
    if (cta_type !== undefined) updateData.cta_type = cta_type
    if (whatsapp_number !== undefined) updateData.whatsapp_number = whatsapp_number
    if (external_url !== undefined) updateData.external_url = external_url
    if (cta_button_text !== undefined) updateData.cta_button_text = cta_button_text
    if (custom_whatsapp_message !== undefined) updateData.custom_whatsapp_message = custom_whatsapp_message
    if (status !== undefined) updateData.status = status

    // Atualizar
    const { data, error } = await supabaseAdmin
      .from('user_templates')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user_id) // Segurança: só atualiza se for do usuário
      .select(`
        *,
        user_profiles!inner(user_slug),
        users!inner(name, email)
      `)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json(
        { error: 'Ferramenta não encontrada ou não pertence ao usuário' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      tool: data,
      message: 'Ferramenta atualizada com sucesso!'
    })
  } catch (error: any) {
    console.error('Erro ao atualizar ferramenta:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar ferramenta' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar ferramenta
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const user_id = searchParams.get('user_id')

    if (!id || !user_id) {
      return NextResponse.json(
        { error: 'id e user_id são obrigatórios' },
        { status: 400 }
      )
    }

    // Deletar (verificando se pertence ao usuário)
    const { error } = await supabaseAdmin
      .from('user_templates')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id)

    if (error) throw error

    return NextResponse.json({
      message: 'Ferramenta deletada com sucesso!'
    })
  } catch (error: any) {
    console.error('Erro ao deletar ferramenta:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar ferramenta' },
      { status: 500 }
    )
  }
}


