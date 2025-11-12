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
 * GET /api/wellness/modulos
 * Lista todos os módulos da biblioteca (sem curso associado)
 */
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('*')
      .is('curso_id', null)
      .order('created_at', { ascending: false })

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
 * POST /api/wellness/modulos
 * Cria um novo módulo na biblioteca (sem curso)
 */
export async function POST(request: NextRequest) {
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

    const body: CreateWellnessCursoModuloDTO & { areas?: string[] } = await request.json()

    // Validações
    if (!body.titulo) {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    // Validar áreas se fornecidas
    if (body.areas && (!Array.isArray(body.areas) || body.areas.length === 0)) {
      return NextResponse.json(
        { error: 'Selecione pelo menos uma área' },
        { status: 400 }
      )
    }

    // Criar módulo sem curso (biblioteca)
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .insert({
        curso_id: null, // Módulo na biblioteca
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

    // Salvar áreas do módulo (se fornecido)
    if (body.areas && Array.isArray(body.areas) && body.areas.length > 0) {
      const areasToInsert = body.areas.map((area: string) => ({
        modulo_id: data.id,
        area: area
      }))

      const { error: areasError } = await supabaseAdmin
        .from('curso_modulos_areas')
        .insert(areasToInsert)

      if (areasError) {
        console.error('Erro ao salvar áreas do módulo:', areasError)
        // Não falhar se áreas não salvarem, mas logar erro
      }
    }

    return NextResponse.json({ modulo: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

