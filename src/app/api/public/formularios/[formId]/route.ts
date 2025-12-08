import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET - Buscar formulário público (sem autenticação)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { formId } = await params

    // Buscar formulário - permitir preview mesmo se não estiver ativo
    // Verificar se há um parâmetro de preview na query string
    const { searchParams } = new URL(request.url)
    const isPreview = searchParams.get('preview') === 'true'

    console.log('🔍 Buscando formulário:', { formId, isPreview })

    let query = supabaseAdmin
      .from('custom_forms')
      .select('id, name, description, form_type, structure, is_active, user_id, slug, short_code')
      .eq('id', formId)

    // Se for preview, não filtrar por is_active
    if (!isPreview) {
      query = query.eq('is_active', true)
    }

    const { data: form, error } = await query.single()

    console.log('📥 Resultado da query:', { 
      found: !!form, 
      error: error?.message,
      formId: form?.id,
      formName: form?.name,
      isActive: form?.is_active
    })

    if (error) {
      console.error('❌ Erro ao buscar formulário:', error)
      return NextResponse.json(
        { error: `Erro ao buscar formulário: ${error.message}` },
        { status: 404 }
      )
    }

    if (!form) {
      console.error('❌ Formulário não encontrado')
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    // Buscar perfil do usuário para determinar a área e user_slug
    let userArea = null
    let userSlug = null
    if (form.user_id) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('perfil, user_slug')
        .eq('user_id', form.user_id)
        .maybeSingle()
      
      if (profile) {
        userArea = profile.perfil
        userSlug = profile.user_slug
      }
    }

    return NextResponse.json({
      success: true,
      data: { 
        form: {
          ...form,
          user_area: userArea,
          user_slug: userSlug
        }
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar formulário público:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

