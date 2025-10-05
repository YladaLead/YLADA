import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, priority, professionalId } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do lead é obrigatório' },
        { status: 400 }
      )
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (professionalId) updateData.professionalId = professionalId

    const { data: lead, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        professional:professionals(*),
        notes:lead_notes(*)
      `)
      .single()

    if (error) {
      console.error('Erro ao atualizar lead:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      lead
    })

  } catch (error) {
    console.error('Erro ao atualizar lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do lead é obrigatório' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir lead:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lead excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao excluir lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
