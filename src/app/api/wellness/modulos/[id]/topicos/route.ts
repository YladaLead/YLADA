import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'
import type { CreateWellnessModuloTopicoDTO, UpdateWellnessModuloTopicoDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/modulos/[id]/topicos
 * Lista todos os tópicos de um módulo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_modulo_topicos')
      .select('*')
      .eq('modulo_id', params.id)
      .order('ordem', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar tópicos: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ topicos: data || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wellness/modulos/[id]/topicos
 * Cria um novo tópico (apenas admins)
 */
export async function POST(
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
        { error: 'Acesso negado. Apenas admins podem criar tópicos.' },
        { status: 403 }
      )
    }

    // Verificar se módulo existe
    const { data: modulo } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('id')
      .eq('id', params.id)
      .single()

    if (!modulo) {
      return NextResponse.json(
        { error: 'Módulo não encontrado' },
        { status: 404 }
      )
    }

    const body: CreateWellnessModuloTopicoDTO = await request.json()

    // Validações
    if (!body.titulo) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    // Criar tópico
    const { data, error } = await supabaseAdmin
      .from('wellness_modulo_topicos')
      .insert({
        modulo_id: params.id,
        titulo: body.titulo,
        descricao: body.descricao || null,
        ordem: body.ordem || 0
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao criar tópico: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ topico: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

