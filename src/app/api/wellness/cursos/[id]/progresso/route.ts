import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { UpdateWellnessCursoProgressoDTO } from '@/types/wellness-cursos'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/cursos/[id]/progresso
 * Busca progresso do usuário no curso
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
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

    // Buscar progresso do usuário
    const { data, error } = await supabaseAdmin
      .from('wellness_curso_progresso')
      .select('*')
      .eq('user_id', user.id)
      .eq('curso_id', params.id)

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar progresso: ${error.message}` },
        { status: 500 }
      )
    }

    // Calcular estatísticas
    const materiaisConcluidos = data?.filter(p => p.concluido && p.material_id).length || 0
    
    // Buscar total de materiais do curso
    const { data: cursoCompleto } = await supabaseAdmin
      .from('wellness_cursos')
      .select(`
        id,
        wellness_curso_modulos (
          id,
          wellness_curso_materiais (id)
        )
      `)
      .eq('id', params.id)
      .single()

    let totalMateriais = 0
    if (cursoCompleto?.wellness_curso_modulos) {
      cursoCompleto.wellness_curso_modulos.forEach((modulo: any) => {
        if (modulo.wellness_curso_materiais) {
          totalMateriais += modulo.wellness_curso_materiais.length
        }
      })
    }

    const porcentagem = totalMateriais > 0 
      ? Math.round((materiaisConcluidos / totalMateriais) * 100) 
      : 0

    return NextResponse.json({
      progresso: data || [],
      estatisticas: {
        total_materiais: totalMateriais,
        materiais_concluidos: materiaisConcluidos,
        porcentagem
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wellness/cursos/[id]/progresso
 * Atualiza progresso de um material
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
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

    const body = await request.json()
    const { modulo_id, material_id, ...dados } = body

    if (!modulo_id || !material_id) {
      return NextResponse.json(
        { error: 'modulo_id e material_id são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe progresso
    const { data: progressoExistente } = await supabaseAdmin
      .from('wellness_curso_progresso')
      .select('*')
      .eq('user_id', user.id)
      .eq('material_id', material_id)
      .single()

    if (progressoExistente) {
      // Atualizar
      const { data, error } = await supabaseAdmin
        .from('wellness_curso_progresso')
        .update({
          ...dados,
          ultimo_acesso: new Date().toISOString()
        })
        .eq('id', progressoExistente.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: `Erro ao atualizar progresso: ${error.message}` },
          { status: 500 }
        )
      }

      return NextResponse.json({ progresso: data })
    } else {
      // Criar novo
      const { data, error } = await supabaseAdmin
        .from('wellness_curso_progresso')
        .insert({
          user_id: user.id,
          curso_id: params.id,
          modulo_id,
          material_id,
          ...dados,
          ultimo_acesso: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: `Erro ao criar progresso: ${error.message}` },
          { status: 500 }
        )
      }

      return NextResponse.json({ progresso: data }, { status: 201 })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

