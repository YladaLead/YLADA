import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

async function validateOwnership(clientId: string, programId: string, userId: string) {
  if (!supabaseAdmin) {
    throw new Error('Configuração do servidor incompleta.')
  }

  const { data: program, error } = await supabaseAdmin
    .from('coach_programs')
    .select('*')
    .eq('id', programId)
    .eq('client_id', clientId)
    .eq('user_id', userId)
    .single()

  if (error || !program) {
    return null
  }

  return program
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; programId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { id: clientId, programId } = await params
    const program = await validateOwnership(clientId, programId, user.id)

    if (!program) {
      return NextResponse.json({ error: 'Programa não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: { program } })
  } catch (error: any) {
    console.error('Erro ao buscar programa:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; programId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta.' }, { status: 500 })
    }

    const { id: clientId, programId } = await params
    const existingProgram = await validateOwnership(clientId, programId, user.id)

    if (!existingProgram) {
      return NextResponse.json({ error: 'Programa não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const updateData: any = {}

    const updatableFields = [
      'name',
      'description',
      'program_type',
      'start_date',
      'end_date',
      'status',
      'content',
      'adherence_percentage',
      'notes'
    ]

    updatableFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar.' }, { status: 400 })
    }

    const { data: updatedProgram, error } = await supabaseAdmin
      .from('coach_programs')
      .update(updateData)
      .eq('id', programId)
      .eq('client_id', clientId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar programa:', error)
      return NextResponse.json({ error: 'Erro ao atualizar programa' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: { program: updatedProgram } })
  } catch (error: any) {
    console.error('Erro interno ao atualizar programa:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; programId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta.' }, { status: 500 })
    }

    const { id: clientId, programId } = await params
    const existingProgram = await validateOwnership(clientId, programId, user.id)

    if (!existingProgram) {
      return NextResponse.json({ error: 'Programa não encontrado' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('coach_programs')
      .delete()
      .eq('id', programId)
      .eq('client_id', clientId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Erro ao deletar programa:', error)
      return NextResponse.json({ error: 'Erro ao deletar programa' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro interno ao deletar programa:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


