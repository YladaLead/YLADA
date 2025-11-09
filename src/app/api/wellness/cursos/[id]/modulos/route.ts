import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'
import type { CreateWellnessCursoModuloDTO, UpdateWellnessCursoModuloDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/cursos/[id]/modulos
 * Lista todos os módulos de um curso
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('*')
      .eq('curso_id', params.id)
      .order('ordem', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar módulos: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ modulos: data || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wellness/cursos/[id]/modulos
 * Cria um novo módulo (apenas admins)
 */
export async function POST(
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
        { error: 'Acesso negado. Apenas admins podem criar módulos.' },
        { status: 403 }
      )
    }

    // Verificar se curso existe
    const { data: curso } = await supabaseAdmin
      .from('wellness_cursos')
      .select('id')
      .eq('id', params.id)
      .single()

    if (!curso) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }

    const body: CreateWellnessCursoModuloDTO = await request.json()

    // Validações
    if (!body.titulo) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    // Criar módulo
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .insert({
        curso_id: params.id,
        titulo: body.titulo,
        descricao: body.descricao || null,
        ordem: body.ordem || 0
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao criar módulo: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ modulo: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

