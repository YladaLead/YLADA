import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * GET /api/wellness/cursos/slug/[slug]
 * Busca curso completo por slug (com módulos e materiais)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Buscar curso
    const { data: curso, error: cursoError } = await supabaseAdmin
      .from('wellness_cursos')
      .select('*')
      .eq('slug', params.slug)
      .eq('ativo', true)
      .single()

    if (cursoError || !curso) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      )
    }

    // Buscar módulos vinculados ao curso OU módulos da biblioteca (curso_id = null)
    // Por enquanto, vamos buscar apenas módulos vinculados ao curso
    const { data: modulos, error: modulosError } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('*')
      .eq('curso_id', curso.id)
      .order('ordem', { ascending: true })

    if (modulosError) {
      return NextResponse.json(
        { error: `Erro ao buscar módulos: ${modulosError.message}` },
        { status: 500 }
      )
    }

    // Buscar tópicos e materiais para cada módulo
    const modulosComTopicos = await Promise.all(
      (modulos || []).map(async (modulo) => {
        // Buscar tópicos do módulo
        const { data: topicos, error: topicosError } = await supabaseAdmin
          .from('wellness_modulo_topicos')
          .select('*')
          .eq('modulo_id', modulo.id)
          .order('ordem', { ascending: true })

        if (topicosError) {
          return {
            ...modulo,
            topicos: []
          }
        }

        // Buscar materiais (cursos) para cada tópico
        const topicosComMateriais = await Promise.all(
          (topicos || []).map(async (topico) => {
            const { data: materiais, error: materiaisError } = await supabaseAdmin
              .from('wellness_curso_materiais')
              .select('*')
              .eq('topico_id', topico.id)
              .order('ordem', { ascending: true })

            if (materiaisError) {
              return {
                ...topico,
                cursos: []
              }
            }

            return {
              ...topico,
              cursos: materiais || []
            }
          })
        )

        return {
          ...modulo,
          topicos: topicosComMateriais
        }
      })
    )

    // Buscar progresso se usuário autenticado
    const authHeader = request.headers.get('authorization')
    let progresso = undefined

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabaseAdmin.auth.getUser(token)

      if (user) {
        const { data: progressoData } = await supabaseAdmin
          .from('wellness_curso_progresso')
          .select('*')
          .eq('user_id', user.id)
          .eq('curso_id', curso.id)

        if (progressoData) {
          // Calcular total de materiais (cursos) em todos os tópicos
          const totalMateriais = modulosComTopicos.reduce((acc, modulo) => {
            return acc + modulo.topicos.reduce((accTopico, topico) => {
              return accTopico + (topico.cursos?.length || 0)
            }, 0)
          }, 0)
          
          const materiaisConcluidos = progressoData.filter(p => p.concluido && p.material_id).length
          const porcentagem = totalMateriais > 0 ? Math.round((materiaisConcluidos / totalMateriais) * 100) : 0

          progresso = {
            total_materiais: totalMateriais,
            materiais_concluidos: materiaisConcluidos,
            porcentagem
          }
        }
      }
    }

    return NextResponse.json({
      curso: {
        ...curso,
        modulos: modulosComTopicos,
        progresso
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

