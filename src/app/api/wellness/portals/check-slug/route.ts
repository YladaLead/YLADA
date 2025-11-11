import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// GET - Verificar disponibilidade de slug para portal
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const excludeId = searchParams.get('excludeId')

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug é obrigatório' },
        { status: 400 }
      )
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Verificar se o slug já existe PARA ESTE USUÁRIO (slugs podem ser repetidos entre usuários diferentes)
    let query = supabaseAdmin
      .from('wellness_portals')
      .select('id, slug')
      .eq('slug', slug)
      .eq('user_id', user.id) // ✅ Verificar apenas para o usuário atual
    
    // Se excludeId foi fornecido, excluir esse ID da verificação (útil para edição)
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query.maybeSingle()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (é o que queremos)
      console.error('Erro ao verificar slug:', error)
      return NextResponse.json(
        { error: 'Erro ao verificar disponibilidade' },
        { status: 500 }
      )
    }

    const available = !data

    return NextResponse.json({
      slug,
      available,
      message: available 
        ? 'URL disponível!' 
        : 'Esta URL já está em uso por você. Escolha outra.'
    })
  } catch (error: any) {
    console.error('Erro ao verificar slug do portal:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}



