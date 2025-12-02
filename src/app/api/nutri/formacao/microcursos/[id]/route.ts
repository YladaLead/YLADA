import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await requireApiAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const microcursoId = params.id

    const { data: microcurso, error } = await supabaseAdmin
      .from('microcourses')
      .select('*')
      .eq('id', microcursoId)
      .eq('is_active', true)
      .single()

    if (error || !microcurso) {
      return NextResponse.json({ error: 'Microcurso não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: microcurso
    })
  } catch (error: any) {
    console.error('Erro na API de microcurso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

