import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    // Autenticação usando o padrão da API
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      console.error('❌ Supabase Admin não configurado')
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Buscar todas as reflexões da jornada do usuário
    const { data: reflexoes, error } = await supabaseAdmin
      .from('journey_checklist_notes')
      .select('day_number, item_index, nota, created_at, updated_at')
      .eq('user_id', user.id)
      .not('nota', 'is', null)
      .neq('nota', '')
      .order('day_number', { ascending: true })
      .order('item_index', { ascending: true })

    if (error) {
      console.error('Erro ao buscar reflexões:', error)
      // Retornar array vazio em vez de erro 500
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    console.log(`✅ Reflexões encontradas: ${reflexoes?.length || 0}`)

    return NextResponse.json({
      success: true,
      data: reflexoes || []
    })

  } catch (error) {
    console.error('Erro na API de reflexões:', error)
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}
