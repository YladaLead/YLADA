import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET - Buscar formulário público por user_slug e slug
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userSlug = searchParams.get('user_slug')
    const slug = searchParams.get('slug')
    const isPreview = searchParams.get('preview') === 'true'

    console.log('🔍 Buscando formulário por slug:', {
      userSlug,
      slug,
      isPreview
    })

    if (!userSlug || !slug) {
      return NextResponse.json(
        { error: 'user_slug e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar user_id pelo user_slug
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('user_slug', userSlug)
      .maybeSingle()

    console.log('👤 Perfil encontrado:', {
      hasProfile: !!userProfile,
      userId: userProfile?.user_id,
      error: profileError?.message
    })

    if (profileError || !userProfile) {
      console.error('❌ Erro ao buscar perfil:', profileError)
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    // Primeiro, tentar buscar formulário do usuário por user_id e slug
    let query = supabaseAdmin
      .from('custom_forms')
      .select('*')
      .eq('user_id', userProfile.user_id)
      .eq('slug', slug)

    if (!isPreview) {
      query = query.eq('is_active', true)
    }

    let { data: form, error } = await query.maybeSingle()

    console.log('📋 Formulário do usuário encontrado:', {
      found: !!form,
      formId: form?.id,
      formName: form?.name,
      isTemplate: form?.is_template,
      isActive: form?.is_active,
      error: error?.message
    })

    // Se não encontrou formulário do usuário, tentar buscar template público
    if (!form && !error) {
      console.log('🔍 Buscando template público com slug:', slug)
      
      let templateQuery = supabaseAdmin
        .from('custom_forms')
        .select('*')
        .eq('slug', slug)
        .eq('is_template', true)

      if (!isPreview) {
        templateQuery = templateQuery.eq('is_active', true)
      }

      const { data: template, error: templateError } = await templateQuery.maybeSingle()

      console.log('📋 Template encontrado:', {
        found: !!template,
        templateId: template?.id,
        templateName: template?.name,
        isActive: template?.is_active,
        error: templateError?.message
      })

      if (template) {
        form = template
        error = null
      } else if (templateError) {
        error = templateError
      }
    }

    if (error || !form) {
      console.error('❌ Formulário não encontrado:', {
        userSlug,
        slug,
        error: error?.message
      })
      
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    console.log('✅ Formulário encontrado e retornado:', {
      id: form.id,
      name: form.name,
      slug: form.slug,
      isTemplate: form.is_template
    })

    return NextResponse.json({
      success: true,
      data: { form }
    })

  } catch (error: any) {
    console.error('Erro ao buscar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

