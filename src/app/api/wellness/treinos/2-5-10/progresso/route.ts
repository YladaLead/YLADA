/**
 * GET /api/wellness/treinos/2-5-10/progresso
 * Retorna o progresso do 2-5-10 para o usuário
 * 
 * POST /api/wellness/treinos/2-5-10/progresso
 * Salva ou atualiza o progresso do 2-5-10
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const dataParam = searchParams.get('data')
    const data = dataParam ? new Date(dataParam) : new Date()
    const dataStr = data.toISOString().split('T')[0] // YYYY-MM-DD

    // Buscar progresso do dia
    const { data: progresso, error } = await supabaseAdmin
      .from('wellness_progresso_2510')
      .select('*')
      .eq('user_id', user.id)
      .eq('data', dataStr)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar progresso:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar progresso' },
        { status: 500 }
      )
    }

    // Se não existe, retornar valores zerados
    if (!progresso) {
      return NextResponse.json({
        success: true,
        data: {
          data: dataStr,
          convites: 0,
          follow_ups: 0,
          contatos_novos: 0,
          completo: false
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: progresso
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar progresso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { data: dataParam, convites, follow_ups, contatos_novos } = body

    const data = dataParam ? new Date(dataParam) : new Date()
    const dataStr = data.toISOString().split('T')[0] // YYYY-MM-DD

    // Validar valores
    const convitesNum = Math.max(0, parseInt(convites) || 0)
    const followUpsNum = Math.max(0, parseInt(follow_ups) || 0)
    const contatosNovosNum = Math.max(0, parseInt(contatos_novos) || 0)

    // Verificar se completou (2 convites, 5 follow-ups, 10 contatos)
    const completo = convitesNum >= 2 && followUpsNum >= 5 && contatosNovosNum >= 10

    // Upsert (inserir ou atualizar)
    const { data: progresso, error } = await supabaseAdmin
      .from('wellness_progresso_2510')
      .upsert({
        user_id: user.id,
        data: dataStr,
        convites: convitesNum,
        follow_ups: followUpsNum,
        contatos_novos: contatosNovosNum,
        completo,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,data'
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar progresso:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar progresso' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: progresso
    })
  } catch (error: any) {
    console.error('❌ Erro ao salvar progresso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
