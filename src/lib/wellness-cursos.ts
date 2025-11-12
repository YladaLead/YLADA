/**
 * Biblioteca de funções para gerenciar cursos wellness
 */

import { createClient } from '@/lib/supabase-client'
import type {
  WellnessCurso,
  WellnessCursoCompleto,
  WellnessCursoModulo,
  WellnessCursoMaterial,
  WellnessCursoProgresso,
  CreateWellnessCursoDTO,
  UpdateWellnessCursoDTO,
  CreateWellnessCursoModuloDTO,
  UpdateWellnessCursoModuloDTO,
  CreateWellnessCursoMaterialDTO,
  UpdateWellnessCursoMaterialDTO,
  UpdateWellnessCursoProgressoDTO
} from '@/types/wellness-cursos'

/**
 * Buscar todos os cursos ativos
 */
export async function getCursosAtivos(categoria?: 'tutorial' | 'filosofia') {
  const supabase = createClient()
  let query = supabase
    .from('wellness_cursos')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true })

  if (categoria) {
    query = query.eq('categoria', categoria)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Erro ao buscar cursos: ${error.message}`)
  }

  return data as WellnessCurso[]
}

/**
 * Buscar curso por slug com todos os módulos e materiais
 */
export async function getCursoCompleto(slug: string, userId?: string): Promise<WellnessCursoCompleto | null> {
  const supabase = createClient()
  // Buscar curso
  const { data: curso, error: cursoError } = await supabase
    .from('wellness_cursos')
    .select('*')
    .eq('slug', slug)
    .eq('ativo', true)
    .single()

  if (cursoError || !curso) {
    return null
  }

  // Buscar módulos vinculados ao curso
  const { data: modulos, error: modulosError } = await supabase
    .from('wellness_curso_modulos')
    .select('*')
    .eq('curso_id', curso.id)
    .order('ordem', { ascending: true })

  if (modulosError) {
    throw new Error(`Erro ao buscar módulos: ${modulosError.message}`)
  }

  // Buscar tópicos e materiais para cada módulo
  const modulosComTopicos = await Promise.all(
    (modulos || []).map(async (modulo) => {
      // Buscar tópicos do módulo
      const { data: topicos, error: topicosError } = await supabase
        .from('wellness_modulo_topicos')
        .select('*')
        .eq('modulo_id', modulo.id)
        .order('ordem', { ascending: true })

      if (topicosError) {
        throw new Error(`Erro ao buscar tópicos: ${topicosError.message}`)
      }

      // Buscar materiais (cursos) para cada tópico - filtrar apenas os da área wellness
      const topicosComMateriais = await Promise.all(
        (topicos || []).map(async (topico) => {
          // Primeiro buscar IDs de materiais da área wellness
          const { data: materiaisAreas } = await supabase
            .from('curso_materiais_areas')
            .select('material_id')
            .eq('area', 'wellness')

          let materiais: any[] = []
          
          if (materiaisAreas && materiaisAreas.length > 0) {
            const materialIds = materiaisAreas.map((m: any) => m.material_id)
            
            // Buscar apenas materiais que pertencem à área wellness
            const { data: materiaisData, error: materiaisError } = await supabase
              .from('wellness_curso_materiais')
              .select('*')
              .eq('topico_id', topico.id)
              .in('id', materialIds)
              .order('ordem', { ascending: true })

            if (materiaisError) {
              throw new Error(`Erro ao buscar materiais: ${materiaisError.message}`)
            }

            materiais = materiaisData || []
          }

          return {
            ...topico,
            cursos: materiais
          }
        })
      )

      return {
        ...modulo,
        topicos: topicosComMateriais
      }
    })
  )

  // Buscar progresso se userId fornecido
  let progresso = undefined
  if (userId) {
    const { data: progressoData } = await supabase
      .from('wellness_curso_progresso')
      .select('*')
      .eq('user_id', userId)
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

  return {
    ...curso,
    modulos: modulosComTopicos,
    progresso
  } as WellnessCursoCompleto
}

/**
 * Calcular progresso de um curso para um usuário
 */
export async function calcularProgressoCurso(cursoId: string, userId: string) {
  const supabase = createClient()
  // Buscar curso primeiro para obter slug
  const { data: curso } = await supabase
    .from('wellness_cursos')
    .select('slug')
    .eq('id', cursoId)
    .single()
  
  if (!curso) {
    return null
  }
  
  // Buscar todos os materiais do curso
  const cursoCompleto = await getCursoCompleto(curso.slug, userId)
  
  if (!cursoCompleto) {
    return null
  }

  const totalMateriais = cursoCompleto.modulos.reduce((acc, modulo) => {
    return acc + modulo.topicos.reduce((accTopico, topico) => {
      return accTopico + (topico.cursos?.length || 0)
    }, 0)
  }, 0)

  // Buscar progresso
  const { data: progressoData } = await supabase
    .from('wellness_curso_progresso')
    .select('*')
    .eq('user_id', userId)
    .eq('curso_id', cursoId)

  const materiaisConcluidos = progressoData?.filter(p => p.concluido && p.material_id).length || 0
  const porcentagem = totalMateriais > 0 ? Math.round((materiaisConcluidos / totalMateriais) * 100) : 0

  // Progresso por módulo
  const progressoPorModulo = cursoCompleto.modulos.map(modulo => {
    const materiaisModulo = modulo.topicos.reduce((acc, topico) => {
      return acc + (topico.cursos?.length || 0)
    }, 0)
    
    const concluidosModulo = progressoData?.filter(
      p => p.modulo_id === modulo.id && p.concluido && p.material_id
    ).length || 0
    
    const porcentagemModulo = materiaisModulo > 0 ? Math.round((concluidosModulo / materiaisModulo) * 100) : 0

    return {
      modulo_id: modulo.id,
      total_materiais: materiaisModulo,
      materiais_concluidos: concluidosModulo,
      porcentagem: porcentagemModulo
    }
  })

  return {
    curso_id: cursoId,
    total_materiais: totalMateriais,
    materiais_concluidos: materiaisConcluidos,
    porcentagem,
    modulos: progressoPorModulo
  }
}

/**
 * Atualizar progresso de um material
 */
export async function atualizarProgressoMaterial(
  userId: string,
  cursoId: string,
  moduloId: string,
  materialId: string,
  dados: UpdateWellnessCursoProgressoDTO
) {
  const supabase = createClient()
  // Verificar se já existe progresso
  const { data: progressoExistente } = await supabase
    .from('wellness_curso_progresso')
    .select('*')
    .eq('user_id', userId)
    .eq('material_id', materialId)
    .single()

  if (progressoExistente) {
    // Atualizar
    const { data, error } = await supabase
      .from('wellness_curso_progresso')
      .update({
        ...dados,
        ultimo_acesso: new Date().toISOString()
      })
      .eq('id', progressoExistente.id)
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao atualizar progresso: ${error.message}`)
    }

    return data as WellnessCursoProgresso
  } else {
    // Criar novo
    const { data, error } = await supabase
      .from('wellness_curso_progresso')
      .insert({
        user_id: userId,
        curso_id: cursoId,
        modulo_id: moduloId,
        material_id: materialId,
        ...dados,
        ultimo_acesso: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Erro ao criar progresso: ${error.message}`)
    }

    return data as WellnessCursoProgresso
  }
}

/**
 * Verificar se material está concluído
 */
export async function verificarMaterialConcluido(userId: string, materialId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('wellness_curso_progresso')
    .select('concluido')
    .eq('user_id', userId)
    .eq('material_id', materialId)
    .single()

  return data?.concluido || false
}

