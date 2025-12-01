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

    // Buscar formulário (apenas se estiver ativo)
    const { data: form, error } = await supabaseAdmin
      .from('custom_forms')
      .select('id, name, description, form_type, structure, is_active, user_id')
      .eq('id', formId)
      .eq('is_active', true)
      .single()

    if (error || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    // Buscar perfil do usuário para determinar a área
    let userArea = null
    if (form.user_id) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('perfil')
        .eq('user_id', form.user_id)
        .maybeSingle()
      
      if (profile?.perfil) {
        userArea = profile.perfil
      }
    }

    return NextResponse.json({
      success: true,
      data: { 
        form: {
          ...form,
          user_area: userArea
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

