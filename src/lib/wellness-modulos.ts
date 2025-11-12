/**
 * Biblioteca de funções para gerenciar módulos wellness (área do usuário)
 */

import { createClient } from '@/lib/supabase-client'
import type { WellnessCursoModulo, WellnessModuloTopico, WellnessCursoMaterial } from '@/types/wellness-cursos'

/**
 * Buscar módulo completo com tópicos e materiais
 */
export async function getModuloCompleto(moduloId: string, userId?: string) {
  const supabase = createClient()
  
  // Buscar módulo
  const { data: modulo, error: moduloError } = await supabase
    .from('wellness_curso_modulos')
    .select('*')
    .eq('id', moduloId)
    .single()

  if (moduloError || !modulo) {
    throw new Error(`Erro ao buscar módulo: ${moduloError?.message || 'Módulo não encontrado'}`)
  }

  // Buscar tópicos
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
}

/**
 * Buscar todos os módulos da biblioteca com tópicos e materiais
 */
export async function getModulosBiblioteca() {
  const supabase = createClient()
  
  // Buscar módulos da biblioteca (curso_id = null)
  const { data: modulos, error: modulosError } = await supabase
    .from('wellness_curso_modulos')
    .select('*')
    .is('curso_id', null)
    .order('ordem', { ascending: true })

  if (modulosError) {
    throw new Error(`Erro ao buscar módulos: ${modulosError.message}`)
  }

  // Para cada módulo, buscar tópicos e materiais
  const modulosCompletos = await Promise.all(
    (modulos || []).map(async (modulo) => {
      // Buscar tópicos
      const { data: topicos, error: topicosError } = await supabase
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

      // Buscar materiais para cada tópico - filtrar apenas os da área wellness
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
              return {
                ...topico,
                cursos: []
              }
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

  return modulosCompletos
}


