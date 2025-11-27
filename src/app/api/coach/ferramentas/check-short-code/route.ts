import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET: Verificar se um código curto personalizado está disponível para ferramentas Coach
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
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

    const normalizedCode = code.toLowerCase().trim()

    // Verificar em todas as tabelas que usam short_code
    const [toolCheck, quizCheck, portalCheck, formCheck] = await Promise.all([
      supabaseAdmin
        .from('coach_user_templates')
        .select('id')
        .ilike('short_code', normalizedCode)
        .then(result => {
          if (excludeId && result.data) {
            // Filtrar o ID atual se fornecido
            return {
              ...result,
              data: result.data.filter((item: any) => item.id !== excludeId)
            }
          }
          return result
        }),
      supabaseAdmin.from('quizzes').select('id').ilike('short_code', normalizedCode).limit(1),
      supabaseAdmin.from('wellness_portals').select('id').ilike('short_code', normalizedCode).limit(1),
      supabaseAdmin.from('custom_forms').select('id').ilike('short_code', normalizedCode).limit(1)
    ])

    // Verificar se algum resultado encontrou o código
    const found = 
      (toolCheck.data && toolCheck.data.length > 0) ||
      (quizCheck.data && quizCheck.data.length > 0) ||
      (portalCheck.data && portalCheck.data.length > 0) ||
      (formCheck.data && formCheck.data.length > 0)

    return NextResponse.json({
      available: !found,
      message: found 
        ? 'Este código já está em uso' 
        : 'Código disponível'
    })
  } catch (error: any) {
    console.error('Erro ao verificar código curto:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

