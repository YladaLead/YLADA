import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'
import type { CreateWellnessCursoMaterialDTO, UpdateWellnessCursoMaterialDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/modulos/[id]/materiais
 * Lista todos os materiais de um módulo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_materiais')
      .select('*')
      .eq('modulo_id', params.id)
      .order('ordem', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar materiais: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ materiais: data || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wellness/modulos/[id]/materiais
 * Cria um novo material (apenas admins)
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
        { error: 'Acesso negado. Apenas admins podem criar materiais.' },
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

    const body: CreateWellnessCursoMaterialDTO = await request.json()

    // Validações
    if (!body.titulo || !body.tipo || !body.arquivo_url) {
      return NextResponse.json(
        { error: 'Título, tipo e arquivo_url são obrigatórios' },
        { status: 400 }
      )
    }

    if (!['pdf', 'video'].includes(body.tipo)) {
      return NextResponse.json(
        { error: 'Tipo deve ser "pdf" ou "video"' },
        { status: 400 }
      )
    }

    // Criar material
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_materiais')
      .insert({
        modulo_id: params.id,
        tipo: body.tipo,
        titulo: body.titulo,
        descricao: body.descricao || null,
        arquivo_url: body.arquivo_url,
        duracao: body.duracao || null,
        ordem: body.ordem || 0,
        gratuito: body.gratuito !== undefined ? body.gratuito : false
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao criar material: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ material: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

