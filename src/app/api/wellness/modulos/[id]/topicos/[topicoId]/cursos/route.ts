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
 * GET /api/wellness/modulos/[id]/topicos/[topicoId]/cursos
 * Lista todos os cursos (materiais) de um tópico
 * Suporta filtro por área via query param ?area=wellness
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; topicoId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const areaFiltro = searchParams.get('area')

    let query = supabaseAdmin
      .from('wellness_curso_materiais')
      .select('*')
      .eq('topico_id', params.topicoId)

    // Se tem filtro de área, buscar apenas materiais dessa área
    if (areaFiltro && areaFiltro !== 'todos') {
      // Buscar IDs de materiais que pertencem à área
      const { data: materiaisAreas } = await supabaseAdmin
        .from('curso_materiais_areas')
        .select('material_id')
        .eq('area', areaFiltro)

      if (materiaisAreas && materiaisAreas.length > 0) {
        const materialIds = materiaisAreas.map((m: any) => m.material_id)
        query = query.in('id', materialIds)
      } else {
        // Se não há materiais nessa área, retornar array vazio
        return NextResponse.json({ cursos: [] })
      }
    }

    const { data, error } = await query.order('ordem', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar cursos: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ cursos: data || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wellness/modulos/[id]/topicos/[topicoId]/cursos
 * Cria um novo curso (material) (apenas admins)
 */
export async function POST(
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
        { error: 'Acesso negado. Apenas admins podem criar cursos.' },
        { status: 403 }
      )
    }

    // Verificar se tópico existe
    const { data: topico } = await supabaseAdmin
      .from('wellness_modulo_topicos')
      .select('id, modulo_id')
      .eq('id', params.topicoId)
      .eq('modulo_id', params.id)
      .single()

    if (!topico) {
      return NextResponse.json(
        { error: 'Tópico não encontrado' },
        { status: 404 }
      )
    }

    const body: CreateWellnessCursoMaterialDTO & { areas?: string[] } = await request.json()

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

    // Buscar áreas do módulo (material herda áreas do módulo)
    let areasDoModulo: string[] = []
    if (body.areas && Array.isArray(body.areas) && body.areas.length > 0) {
      // Se áreas foram fornecidas, usar elas
      areasDoModulo = body.areas
    } else {
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
    if (areasDoModulo.length === 0) {
      return NextResponse.json(
        { error: 'É necessário que o módulo tenha pelo menos uma área cadastrada para criar o material.' },
        { status: 400 }
      )
    }

    // Criar curso (material)
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_materiais')
      .insert({
        topico_id: params.topicoId,
        modulo_id: topico.modulo_id, // Manter para compatibilidade
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
        { error: `Erro ao criar curso: ${error.message}` },
        { status: 500 }
      )
    }

    // Salvar áreas do material (herdadas do módulo ou fornecidas)
    // IMPORTANTE: Sempre salvar áreas, pois já validamos que há pelo menos uma
    const areasToInsert = areasDoModulo.map((area: string) => ({
      material_id: data.id,
      area: area
    }))

    const { error: areasError } = await supabaseAdmin
      .from('curso_materiais_areas')
      .insert(areasToInsert)

    if (areasError) {
      console.error('Erro ao salvar áreas do material:', areasError)
      // Se falhar ao salvar áreas, deletar o material criado para manter consistência
      await supabaseAdmin
        .from('wellness_curso_materiais')
        .delete()
        .eq('id', data.id)
      
      return NextResponse.json(
        { error: `Erro ao salvar áreas do material: ${areasError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ curso: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

