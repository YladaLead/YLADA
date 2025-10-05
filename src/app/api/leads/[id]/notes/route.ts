import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { leadId, content, author } = body

    if (!leadId || !content || !author) {
      return NextResponse.json(
        { error: 'LeadId, conteúdo e autor são obrigatórios' },
        { status: 400 }
      )
    }

    const { data: note, error } = await supabase
      .from('lead_notes')
      .insert({
        leadId,
        content,
        author
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar anotação:', error)
      return NextResponse.json(
        { error: 'Erro ao criar anotação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      note
    })

  } catch (error) {
    console.error('Erro ao criar anotação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')

    if (!leadId) {
      return NextResponse.json(
        { error: 'LeadId é obrigatório' },
        { status: 400 }
      )
    }

    const { data: notes, error } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('leadId', leadId)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Erro ao buscar anotações:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar anotações' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notes: notes || []
    })

  } catch (error) {
    console.error('Erro ao buscar anotações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
