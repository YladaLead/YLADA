import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'
import type { UpdateWellnessCursoModuloDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/modulos/[id]
 * Busca um módulo específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar módulo: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Módulo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ modulo: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/wellness/modulos/[id]
 * Atualiza um módulo
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
        { error: 'Acesso negado. Apenas admins podem atualizar módulos.' },
        { status: 403 }
      )
    }

    const body: UpdateWellnessCursoModuloDTO & { areas?: string[] } = await request.json()

    const updateData: any = {}
    if (body.titulo !== undefined) updateData.titulo = body.titulo
    if (body.descricao !== undefined) updateData.descricao = body.descricao
    if (body.ordem !== undefined) updateData.ordem = body.ordem

    // Verificar se há algo para atualizar
    if (Object.keys(updateData).length === 0 && body.areas === undefined) {
      return NextResponse.json(
        { error: 'Nenhum dado fornecido para atualização' },
        { status: 400 }
      )
    }

    // Atualizar módulo (se houver dados para atualizar)
    let data = null
    if (Object.keys(updateData).length > 0) {
      const { data: updatedData, error } = await supabaseAdmin
        .from('wellness_curso_modulos')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .maybeSingle() // Usar maybeSingle() em vez de single() para evitar erro se não encontrar

      if (error) {
        return NextResponse.json(
          { error: `Erro ao atualizar módulo: ${error.message}` },
          { status: 500 }
        )
      }

      if (!updatedData) {
        return NextResponse.json(
          { error: 'Módulo não encontrado' },
          { status: 404 }
        )
      }

      data = updatedData
    } else {
      // Se não há dados para atualizar, buscar o módulo atual
      const { data: currentData, error } = await supabaseAdmin
        .from('wellness_curso_modulos')
        .select('*')
        .eq('id', params.id)
        .maybeSingle()

      if (error) {
        return NextResponse.json(
          { error: `Erro ao buscar módulo: ${error.message}` },
          { status: 500 }
        )
      }

      if (!currentData) {
        return NextResponse.json(
          { error: 'Módulo não encontrado' },
          { status: 404 }
        )
      }

      data = currentData
    }

    // Atualizar áreas do módulo (se fornecido)
    if (body.areas !== undefined) {
      // Deletar áreas existentes
      const { error: deleteError } = await supabaseAdmin
        .from('curso_modulos_areas')
        .delete()
        .eq('modulo_id', params.id)

      if (deleteError) {
        console.error('Erro ao deletar áreas antigas:', deleteError)
        return NextResponse.json(
          { error: `Erro ao atualizar áreas do módulo: ${deleteError.message}` },
          { status: 500 }
        )
      }

      // Inserir novas áreas
      if (Array.isArray(body.areas) && body.areas.length > 0) {
        const areasToInsert = body.areas.map((area: string) => ({
          modulo_id: params.id,
          area: area
        }))

        const { error: areasError } = await supabaseAdmin
          .from('curso_modulos_areas')
          .insert(areasToInsert)

        if (areasError) {
          console.error('Erro ao inserir novas áreas:', areasError)
          return NextResponse.json(
            { error: `Erro ao salvar áreas do módulo: ${areasError.message}` },
            { status: 500 }
          )
        }
      }
    }

    // Garantir que temos os dados do módulo para retornar
    if (!data) {
      // Se não temos dados ainda, buscar novamente
      const { data: finalData, error: fetchError } = await supabaseAdmin
        .from('wellness_curso_modulos')
        .select('*')
        .eq('id', params.id)
        .maybeSingle()

      if (fetchError || !finalData) {
        return NextResponse.json(
          { error: 'Erro ao buscar dados atualizados do módulo' },
          { status: 500 }
        )
      }

      data = finalData
    }

    return NextResponse.json({ modulo: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/wellness/modulos/[id]
 * Deleta um módulo (apenas se não estiver associado a curso)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
        { error: 'Acesso negado. Apenas admins podem deletar módulos.' },
        { status: 403 }
      )
    }

    // Verificar se módulo está associado a algum curso
    const { data: modulo } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('curso_id')
      .eq('id', params.id)
      .single()

    if (modulo?.curso_id) {
      return NextResponse.json(
        { error: 'Não é possível deletar módulo associado a um curso. Remova a associação primeiro.' },
        { status: 400 }
      )
    }

    // Deletar módulo (cascade vai deletar materiais)
    const { error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json(
        { error: `Erro ao deletar módulo: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Módulo deletado com sucesso' })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

