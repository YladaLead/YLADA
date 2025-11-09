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
 * GET /api/wellness/cursos/[id]/modulos/[moduloId]
 * Busca um módulo específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; moduloId: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('*')
      .eq('id', params.moduloId)
      .eq('curso_id', params.id)
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
 * PUT /api/wellness/cursos/[id]/modulos/[moduloId]
 * Atualiza um módulo (apenas admins)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; moduloId: string } }
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
        { error: 'Acesso negado. Apenas admins podem atualizar módulos.' },
        { status: 403 }
      )
    }

    const body: UpdateWellnessCursoModuloDTO = await request.json()

    // Atualizar módulo
    const updateData: any = {}
    if (body.titulo !== undefined) updateData.titulo = body.titulo
    if (body.descricao !== undefined) updateData.descricao = body.descricao
    if (body.ordem !== undefined) updateData.ordem = body.ordem

    const { data, error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .update(updateData)
      .eq('id', params.moduloId)
      .eq('curso_id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar módulo: ${error.message}` },
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
 * DELETE /api/wellness/cursos/[id]/modulos/[moduloId]
 * Deleta um módulo (apenas admins)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; moduloId: string } }
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
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    if (user.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas admins podem deletar módulos.' },
        { status: 403 }
      )
    }

    // Deletar módulo (cascade vai deletar materiais)
    const { error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .delete()
      .eq('id', params.moduloId)
      .eq('curso_id', params.id)

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

