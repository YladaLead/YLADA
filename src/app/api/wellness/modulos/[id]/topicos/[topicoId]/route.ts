import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'
import type { UpdateWellnessModuloTopicoDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/modulos/[id]/topicos/[topicoId]
 * Busca um tópico específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; topicoId: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_modulo_topicos')
      .select('*')
      .eq('id', params.topicoId)
      .eq('modulo_id', params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar tópico: ${error.message}` },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Tópico não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ topico: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/wellness/modulos/[id]/topicos/[topicoId]
 * Atualiza um tópico
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; topicoId: string } }
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
        { error: 'Acesso negado. Apenas admins podem atualizar tópicos.' },
        { status: 403 }
      )
    }

    const body: UpdateWellnessModuloTopicoDTO = await request.json()

    const updateData: any = {}
    if (body.titulo !== undefined) updateData.titulo = body.titulo
    if (body.descricao !== undefined) updateData.descricao = body.descricao
    if (body.ordem !== undefined) updateData.ordem = body.ordem

    const { data, error } = await supabaseAdmin
      .from('wellness_modulo_topicos')
      .update(updateData)
      .eq('id', params.topicoId)
      .eq('modulo_id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar tópico: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ topico: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/wellness/modulos/[id]/topicos/[topicoId]
 * Deleta um tópico (cascade vai deletar cursos/materiais)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; topicoId: string } }
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
        { error: 'Acesso negado. Apenas admins podem deletar tópicos.' },
        { status: 403 }
      )
    }

    // Deletar tópico (cascade vai deletar cursos/materiais)
    const { error } = await supabaseAdmin
      .from('wellness_modulo_topicos')
      .delete()
      .eq('id', params.topicoId)
      .eq('modulo_id', params.id)

    if (error) {
      return NextResponse.json(
        { error: `Erro ao deletar tópico: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Tópico deletado com sucesso' })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

