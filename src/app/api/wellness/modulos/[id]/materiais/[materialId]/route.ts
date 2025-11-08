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
 * PUT /api/wellness/modulos/[id]/materiais/[materialId]
 * Atualiza um material
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; materialId: string } }
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
        { error: 'Acesso negado. Apenas admins podem atualizar materiais.' },
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
      .eq('id', params.materialId)
      .eq('modulo_id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar material: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ material: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/wellness/modulos/[id]/materiais/[materialId]
 * Deleta um material
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; materialId: string } }
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
        { error: 'Acesso negado. Apenas admins podem deletar materiais.' },
        { status: 403 }
      )
    }

    const { error } = await supabaseAdmin
      .from('wellness_curso_materiais')
      .delete()
      .eq('id', params.materialId)
      .eq('modulo_id', params.id)

    if (error) {
      return NextResponse.json(
        { error: `Erro ao deletar material: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Material deletado com sucesso' })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

