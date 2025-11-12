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

    const body: UpdateWellnessCursoMaterialDTO & { areas?: string[] } = await request.json()

    // Buscar módulo do tópico para herdar áreas
    const { data: topico } = await supabaseAdmin
      .from('wellness_modulo_topicos')
      .select('modulo_id')
      .eq('id', params.topicoId)
      .single()

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

    // Atualizar áreas do material (herdadas do módulo ou fornecidas)
    let areasDoModulo: string[] = []
    if (body.areas !== undefined && Array.isArray(body.areas) && body.areas.length > 0) {
      // Se áreas foram fornecidas, usar elas
      areasDoModulo = body.areas
    } else if (topico?.modulo_id) {
      // Se não foram fornecidas, buscar do módulo
      const { data: modulosAreas, error: modulosAreasError } = await supabaseAdmin
        .from('curso_modulos_areas')
        .select('area')
        .eq('modulo_id', topico.modulo_id)

      if (modulosAreasError) {
        console.error('Erro ao buscar áreas do módulo:', modulosAreasError)
        return NextResponse.json(
          { error: `Erro ao buscar áreas do módulo: ${modulosAreasError.message}` },
          { status: 500 }
        )
      }

      if (modulosAreas && modulosAreas.length > 0) {
        areasDoModulo = modulosAreas.map((item: any) => item.area)
      } else {
        // Se o módulo não tem áreas, retornar erro
        return NextResponse.json(
          { error: 'O módulo não possui áreas cadastradas. Por favor, edite o módulo e selecione pelo menos uma área.' },
          { status: 400 }
        )
      }
    }

    // Validar que há pelo menos uma área
    if (areasDoModulo.length === 0 && body.areas === undefined) {
      return NextResponse.json(
        { error: 'É necessário que o módulo tenha pelo menos uma área cadastrada.' },
        { status: 400 }
      )
    }

    // Atualizar áreas do material (sempre atualizar para garantir consistência)
    if (areasDoModulo.length > 0 || body.areas !== undefined) {
      // Deletar áreas antigas
      await supabaseAdmin
        .from('curso_materiais_areas')
        .delete()
        .eq('material_id', params.cursoId)

      // Inserir novas áreas (do módulo ou fornecidas)
      if (areasDoModulo.length > 0) {
        const areasToInsert = areasDoModulo.map((area: string) => ({
          material_id: params.cursoId,
          area: area
        }))

        const { error: areasError } = await supabaseAdmin
          .from('curso_materiais_areas')
          .insert(areasToInsert)

        if (areasError) {
          console.error('Erro ao atualizar áreas do material:', areasError)
          return NextResponse.json(
            { error: `Erro ao atualizar áreas do material: ${areasError.message}` },
            { status: 500 }
          )
        }
      }
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

