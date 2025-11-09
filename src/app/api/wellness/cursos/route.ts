import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'
import type { CreateWellnessCursoDTO, UpdateWellnessCursoDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/cursos
 * Lista todos os cursos ativos (ou todos se for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoria = searchParams.get('categoria') as 'tutorial' | 'filosofia' | null
    const incluirInativos = searchParams.get('incluirInativos') === 'true'

    // Verificar se é admin (via header ou cookie)
    const authHeader = request.headers.get('authorization')
    let isAdmin = false

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseAdmin.auth.getUser(token)
      if (user?.user_metadata?.role === 'admin') {
        isAdmin = true
      }
    }

    let query = supabaseAdmin
      .from('wellness_cursos')
      .select('*')
      .order('ordem', { ascending: true })

    if (!incluirInativos || !isAdmin) {
      query = query.eq('ativo', true)
    }

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar cursos: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ cursos: data || [], total: data?.length || 0 })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wellness/cursos
 * Cria um novo curso (apenas admins)
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
        { error: 'Acesso negado. Apenas admins podem criar cursos.' },
        { status: 403 }
      )
    }

    const body: CreateWellnessCursoDTO & { modulos_ids?: string[] } = await request.json()

    // Validações
    if (!body.titulo || !body.slug || !body.categoria) {
      return NextResponse.json(
        { error: 'Título, slug e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se slug já existe
    const { data: cursoExistente } = await supabaseAdmin
      .from('wellness_cursos')
      .select('id')
      .eq('slug', body.slug)
      .single()

    if (cursoExistente) {
      return NextResponse.json(
        { error: 'Já existe um curso com este slug' },
        { status: 400 }
      )
    }

    // Criar curso
    const { data: curso, error } = await supabaseAdmin
      .from('wellness_cursos')
      .insert({
        titulo: body.titulo,
        descricao: body.descricao || null,
        categoria: body.categoria,
        thumbnail_url: body.thumbnail_url || null,
        slug: body.slug,
        ordem: body.ordem || 0,
        ativo: body.ativo !== undefined ? body.ativo : true
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: `Erro ao criar curso: ${error.message}` },
        { status: 500 }
      )
    }

    // Se há módulos para associar, associar agora
    if (body.modulos_ids && body.modulos_ids.length > 0) {
      // Verificar se os módulos existem e não estão associados a outro curso
      const { data: modulos, error: modulosError } = await supabaseAdmin
        .from('wellness_curso_modulos')
        .select('id')
        .in('id', body.modulos_ids)
        .is('curso_id', null) // Apenas módulos da biblioteca

      if (modulosError || !modulos || modulos.length !== body.modulos_ids.length) {
        return NextResponse.json(
          { error: 'Um ou mais módulos não foram encontrados ou já estão associados a um curso' },
          { status: 400 }
        )
      }

      // Associar módulos ao curso
      const { error: updateError } = await supabaseAdmin
        .from('wellness_curso_modulos')
        .update({ curso_id: curso.id })
        .in('id', body.modulos_ids)

      if (updateError) {
        // Se falhar, deletar o curso criado
        await supabaseAdmin.from('wellness_cursos').delete().eq('id', curso.id)
        return NextResponse.json(
          { error: `Erro ao associar módulos: ${updateError.message}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ curso }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

