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

    // Verificar se o slug já existe (apenas para o mesmo usuário)
    // Slugs devem ser únicos globalmente, mas podemos verificar se é do próprio usuário
    let query = supabaseAdmin
      .from('wellness_portals')
      .select('id, user_id')
      .eq('slug', slug)
    
    // Se excludeId foi fornecido, excluir esse ID da verificação (útil para edição)
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data: existing, error } = await query.maybeSingle()

    if (error) {
      console.error('Erro ao verificar slug:', error)
      return NextResponse.json(
        { error: 'Erro ao verificar disponibilidade' },
        { status: 500 }
      )
    }

    // Se não existe, está disponível
    if (!existing) {
      return NextResponse.json({
        available: true,
        isOwn: false
      })
    }

    // Se existe e é do próprio usuário, permitir (para edição)
    if (existing.user_id === user.id) {
      return NextResponse.json({
        available: true,
        isOwn: true
      })
    }

    // Se existe e é de outro usuário, não está disponível
    return NextResponse.json({
      available: false,
      isOwn: false
    })
  } catch (error: any) {
    console.error('Erro ao verificar slug do portal:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}



