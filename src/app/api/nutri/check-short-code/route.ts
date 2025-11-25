import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET: Verificar se um código curto personalizado está disponível (verifica em todas as tabelas)
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const excludeId = searchParams.get('excludeId') // ID do item atual (para edição)
    const type = searchParams.get('type') // 'tool', 'quiz', 'portal' ou null (verifica todos)

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

    // Verificar em todas as tabelas ou apenas na especificada
    const checks: Promise<any>[] = []

    if (!type || type === 'tool') {
      let query = supabaseAdmin
        .from('user_templates')
        .select('id')
        .ilike('short_code', normalizedCode)
        .limit(1)
      
      if (excludeId && type === 'tool') {
        query = query.neq('id', excludeId)
      }
      checks.push(query)
    }

    if (!type || type === 'quiz') {
      let query = supabaseAdmin
        .from('quizzes')
        .select('id')
        .ilike('short_code', normalizedCode)
        .limit(1)
      
      if (excludeId && type === 'quiz') {
        query = query.neq('id', excludeId)
      }
      checks.push(query)
    }

    if (!type || type === 'portal') {
      let query = supabaseAdmin
        .from('wellness_portals')
        .select('id')
        .ilike('short_code', normalizedCode)
        .limit(1)
      
      if (excludeId && type === 'portal') {
        query = query.neq('id', excludeId)
      }
      checks.push(query)
    }

    if (!type || type === 'form') {
      let query = supabaseAdmin
        .from('custom_forms')
        .select('id')
        .ilike('short_code', normalizedCode)
        .limit(1)
      
      if (excludeId && type === 'form') {
        query = query.neq('id', excludeId)
      }
      checks.push(query)
    }

    const results = await Promise.all(checks)

    // Verificar se algum resultado encontrou o código
    const found = results.some(result => result.data && result.data.length > 0)

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



