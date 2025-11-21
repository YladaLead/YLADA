import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = supabaseAdmin

    const { data: favoritos, error } = await supabase
      .from('coach_cursos_favoritos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar favoritos:', error)
      return NextResponse.json({ error: 'Erro ao buscar favoritos' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        favoritos: favoritos || []
      }
    })

  } catch (error: any) {
    console.error('Erro na API de favoritos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { item_type, item_id } = body

    if (!item_type || !item_id) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: item_type, item_id' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('coach_cursos_favoritos')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', item_type)
      .eq('item_id', item_id)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Já está nos favoritos',
        data: existing
      })
    }

    // Criar novo favorito
    const { data, error } = await supabase
      .from('coach_cursos_favoritos')
      .insert({
        user_id: user.id,
        item_type,
        item_id
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao adicionar favorito:', error)
      return NextResponse.json({ error: 'Erro ao adicionar favorito' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error: any) {
    console.error('Erro na API de favoritos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

