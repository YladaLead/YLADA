import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Verificar templates duplicados no Wellness
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Buscar todos os templates Wellness (incluindo inativos para análise completa)
    const { data: templates, error } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, type, specialization, description, created_at, updated_at, is_active')
      .eq('profession', 'wellness')
      .eq('language', 'pt')
      .order('name', { ascending: true })
    
    if (error) {
      // Se profession não existir, buscar sem filtro
      if (error.message?.includes('profession') || error.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, type, specialization, description, created_at, updated_at, is_active')
          .eq('language', 'pt')
          .order('name', { ascending: true })
        
        if (error2) throw error2
        
        // Filtrar wellness manualmente se profession não existir
        const wellnessTemplates = allTemplates?.filter((t: any) => 
          t.profession === 'wellness' || !t.profession
        ) || []
        
        return analisarDuplicatas(wellnessTemplates)
      }
      throw error
    }

    return analisarDuplicatas(templates || [])
  } catch (error: any) {
    console.error('Erro ao verificar duplicatas:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar duplicatas' },
      { status: 500 }
    )
  }
}

function analisarDuplicatas(templates: any[]) {
  // Agrupar por nome normalizado (case-insensitive)
  const grupos = new Map<string, any[]>()
  
  templates.forEach(template => {
    const nomeNormalizado = template.name.toLowerCase().trim()
    if (!grupos.has(nomeNormalizado)) {
      grupos.set(nomeNormalizado, [])
    }
    grupos.get(nomeNormalizado)!.push(template)
  })

  // Identificar duplicatas
  const duplicatas: any[] = []
  const resumo: any[] = []

  grupos.forEach((templatesGrupo, nomeNormalizado) => {
    if (templatesGrupo.length > 1) {
      // Ordenar por data de criação (mais antigo primeiro)
      templatesGrupo.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateA - dateB
      })

      const manter = templatesGrupo[0] // Mais antigo
      const eliminar = templatesGrupo.slice(1) // Restantes

      resumo.push({
        nome: nomeNormalizado,
        quantidade: templatesGrupo.length,
        id_manter: manter.id,
        nome_manter: manter.name,
        ids_eliminar: eliminar.map((t: any) => t.id),
        nomes_eliminar: eliminar.map((t: any) => t.name)
      })

        // Detalhes completos
      templatesGrupo.forEach((template, index) => {
        duplicatas.push({
          id: template.id,
          name: template.name,
          type: template.type,
          specialization: template.specialization,
          description: template.description,
          created_at: template.created_at,
          updated_at: template.updated_at,
          is_active: template.is_active,
          acao: index === 0 ? 'MANTER (mais antigo)' : 'ELIMINAR',
          grupo: nomeNormalizado,
          total_duplicatas: templatesGrupo.length
        })
      })
    }
  })

  return NextResponse.json({
    success: true,
    total_duplicatas: resumo.length,
    resumo: resumo.sort((a, b) => b.quantidade - a.quantidade),
    detalhes: duplicatas.sort((a, b) => a.grupo.localeCompare(b.grupo))
  })
}

