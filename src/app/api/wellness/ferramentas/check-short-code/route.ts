import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET: Verificar se um código curto personalizado está disponível
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const excludeId = searchParams.get('excludeId') // ID da ferramenta atual (para edição)

    if (!code) {
      return NextResponse.json(
        { error: 'Código não fornecido' },
        { status: 400 }
      )
    }

    // Validar formato do código (3-10 caracteres, apenas letras, números e hífens)
    if (!/^[a-zA-Z0-9-]{3,10}$/.test(code)) {
      return NextResponse.json({
        available: false,
        error: 'Código deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens'
      })
    }

    // Verificar se já existe
    let query = supabaseAdmin
      .from('user_templates')
      .select('id')
      .eq('short_code', code)
      .limit(1)

    // Se estiver editando, excluir o ID atual da verificação
    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao verificar código curto:', error)
      return NextResponse.json(
        { error: 'Erro ao verificar código' },
        { status: 500 }
      )
    }

    const available = !data || data.length === 0

    return NextResponse.json({
      available,
      message: available 
        ? 'Código disponível' 
        : 'Este código já está em uso'
    })
  } catch (error: any) {
    console.error('Erro ao verificar código curto:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

