import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Salvar ou atualizar estado da usuária
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { perfil, preferencias, restricoes } = body

    const { data, error } = await supabaseAdmin
      .from('ai_state_user')
      .upsert({
        user_id: user.id,
        perfil: perfil || {},
        preferencias: preferencias || {},
        restricoes: restricoes || {},
        ultima_atualizacao: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar estado da usuária:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar estado da usuária' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      state: data
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar estado:', error)
    return NextResponse.json(
      { error: 'Erro ao processar estado', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Buscar estado da usuária
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    console.log('🔍 [GET /api/nutri/ai/state] Buscando estado para user_id:', user.id)

    const { data, error } = await supabaseAdmin
      .from('ai_state_user')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      // PGRST116 = "no rows found" - não é erro, é esperado se não existe ainda
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [GET /api/nutri/ai/state] Estado não encontrado (primeira vez)')
        return NextResponse.json({
          state: null
        })
      }
      
      console.error('❌ Erro ao buscar estado:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar estado', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ [GET /api/nutri/ai/state] Estado encontrado:', data ? 'sim' : 'não')
    
    return NextResponse.json({
      state: data || null
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar estado:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estado', details: error.message },
      { status: 500 }
    )
  }
}

