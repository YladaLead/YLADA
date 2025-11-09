import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'
import type { UpdateWellnessCursoDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/cursos/[id]
 * Busca um curso específico por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_cursos')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar curso: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
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
 * PUT /api/wellness/cursos/[id]
 * Atualiza um curso (apenas admins)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação e permissões de admin
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

    const body: UpdateWellnessCursoDTO = await request.json()

    // Se slug foi alterado, verificar se já existe
    if (body.slug) {
      const { data: cursoExistente } = await supabaseAdmin
        .from('wellness_cursos')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', params.id)
        .single()

      if (cursoExistente) {
        return NextResponse.json(
          { error: 'Já existe um curso com este slug' },
          { status: 400 }
        )
      }
    }

    // Atualizar curso
    const updateData: any = {}
    if (body.titulo !== undefined) updateData.titulo = body.titulo
    if (body.descricao !== undefined) updateData.descricao = body.descricao
    if (body.categoria !== undefined) updateData.categoria = body.categoria
    if (body.thumbnail_url !== undefined) updateData.thumbnail_url = body.thumbnail_url
    if (body.slug !== undefined) updateData.slug = body.slug
    if (body.ordem !== undefined) updateData.ordem = body.ordem
    if (body.ativo !== undefined) updateData.ativo = body.ativo

    const { data, error } = await supabaseAdmin
      .from('wellness_cursos')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar curso: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
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
 * DELETE /api/wellness/cursos/[id]
 * Deleta um curso (apenas admins)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação e permissões de admin
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

    // Deletar curso (cascade vai deletar módulos e materiais)
    const { error } = await supabaseAdmin
      .from('wellness_cursos')
      .delete()
      .eq('id', params.id)

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

