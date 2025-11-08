import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'
import type { UpdateWellnessCursoMaterialDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * PUT /api/wellness/modulos/[id]/topicos/[topicoId]/cursos/[cursoId]
 * Atualiza um curso (material)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; topicoId: string; cursoId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const adminCheck = await verificarAdmin(token)

    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: 401 }
      )
    }

    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas admins podem atualizar cursos.' },
        { status: 403 }
      )
    }

    const body: UpdateWellnessCursoMaterialDTO = await request.json()

    const updateData: any = {}
    if (body.titulo !== undefined) updateData.titulo = body.titulo
    if (body.descricao !== undefined) updateData.descricao = body.descricao
    if (body.arquivo_url !== undefined) updateData.arquivo_url = body.arquivo_url
    if (body.duracao !== undefined) updateData.duracao = body.duracao
    if (body.ordem !== undefined) updateData.ordem = body.ordem
    if (body.gratuito !== undefined) updateData.gratuito = body.gratuito

    const { data, error } = await supabaseAdmin
      .from('wellness_curso_materiais')
      .update(updateData)
      .eq('id', params.cursoId)
      .eq('topico_id', params.topicoId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar curso: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ curso: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/wellness/modulos/[id]/topicos/[topicoId]/cursos/[cursoId]
 * Deleta um curso (material)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; topicoId: string; cursoId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const adminCheck = await verificarAdmin(token)

    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: 401 }
      )
    }

    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas admins podem deletar cursos.' },
        { status: 403 }
      )
    }

    const { error } = await supabaseAdmin
      .from('wellness_curso_materiais')
      .delete()
      .eq('id', params.cursoId)
      .eq('topico_id', params.topicoId)

    if (error) {
      return NextResponse.json(
        { error: `Erro ao deletar curso: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Curso deletado com sucesso' })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

