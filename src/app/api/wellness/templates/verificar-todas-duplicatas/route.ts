import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Verificar TODAS as duplicatas (incluindo similares)
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Buscar todos os templates Wellness
    let { data: templates, error } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, type, specialization, description, created_at, is_active')
      .eq('profession', 'wellness')
      .eq('language', 'pt')
      .order('name', { ascending: true })
    
    if (error) {
      if (error.message?.includes('profession') || error.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, type, specialization, description, created_at, is_active')
          .eq('language', 'pt')
          .order('name', { ascending: true })
        
        if (error2) throw error2
        templates = allTemplates?.filter((t: any) => 
          t.profession === 'wellness' || !t.profession
        ) || []
      } else {
        throw error
      }
    }

    if (!templates || templates.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum template encontrado',
        total_templates: 0,
        duplicatas_exatas: [],
        duplicatas_similares: []
      })
    }

    // Normalizar nome (remover acentos, espaços, case)
    const normalizarNome = (nome: string) => {
      return nome
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '')
    }

    // Agrupar por nome normalizado
    const grupos = new Map<string, any[]>()
    
    templates.forEach((template: any) => {
      const nomeNormalizado = normalizarNome(template.name)
      if (!grupos.has(nomeNormalizado)) {
        grupos.set(nomeNormalizado, [])
      }
      grupos.get(nomeNormalizado)!.push(template)
    })

    // Identificar duplicatas exatas
    const duplicatasExatas: any[] = []
    const duplicatasSimilares: any[] = []

    grupos.forEach((templatesGrupo, nomeNormalizado) => {
      if (templatesGrupo.length > 1) {
        // Ordenar por data de criação
        templatesGrupo.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateA - dateB
        })

        const manter = templatesGrupo[0]
        const eliminar = templatesGrupo.slice(1)

        duplicatasExatas.push({
          nome_normalizado: nomeNormalizado,
          quantidade: templatesGrupo.length,
          manter: {
            id: manter.id,
            name: manter.name,
            created_at: manter.created_at,
            is_active: manter.is_active
          },
          eliminar: eliminar.map((t: any) => ({
            id: t.id,
            name: t.name,
            created_at: t.created_at,
            is_active: t.is_active
          }))
        })
      }
    })

    // Verificar nomes similares (que podem ser a mesma coisa escrita diferente)
    const nomesComuns = [
      { patterns: ['imc', 'indice', 'massa', 'corporal'], keywords: ['imc', 'índice', 'massa corporal'] },
      { patterns: ['calorias', 'caloria'], keywords: ['calorias', 'caloria'] },
      { patterns: ['agua', 'hidratacao', 'hidratação'], keywords: ['água', 'hidratação', 'hidratacao'] },
      { patterns: ['proteina', 'proteína'], keywords: ['proteína', 'proteina'] },
      { patterns: ['composicao', 'composição'], keywords: ['composição', 'composicao'] }
    ]

    // Agrupar por palavras-chave similares
    const gruposSimilares = new Map<string, any[]>()
    
    templates.forEach((template: any) => {
      const nomeLower = template.name.toLowerCase()
      
      nomesComuns.forEach(({ patterns, keywords }) => {
        const matchesPattern = patterns.some(pattern => 
          nomeLower.includes(pattern)
        )
        const matchesKeyword = keywords.some(keyword => 
          nomeLower.includes(keyword.toLowerCase())
        )
        
        if (matchesPattern || matchesKeyword) {
          const grupoKey = keywords[0]
          if (!gruposSimilares.has(grupoKey)) {
            gruposSimilares.set(grupoKey, [])
          }
          gruposSimilares.get(grupoKey)!.push(template)
        }
      })
    })

    gruposSimilares.forEach((templatesGrupo, grupoKey) => {
      if (templatesGrupo.length > 1) {
        // Remover duplicatas que já estão em duplicatasExatas
        const idsExatas = new Set(
          duplicatasExatas.flatMap(d => [d.manter.id, ...d.eliminar.map((e: any) => e.id)])
        )
        
        const grupoFiltrado = templatesGrupo.filter((t: any) => !idsExatas.has(t.id))
        
        if (grupoFiltrado.length > 1) {
          // Verificar se realmente são similares (não apenas coincidência)
          const nomesNormalizados = grupoFiltrado.map((t: any) => normalizarNome(t.name))
          const nomesUnicos = new Set(nomesNormalizados)
          
          if (nomesUnicos.size < grupoFiltrado.length) {
            // Há duplicatas mesmo entre os similares
            grupoFiltrado.sort((a, b) => {
              const dateA = new Date(a.created_at || 0).getTime()
              const dateB = new Date(b.created_at || 0).getTime()
              return dateA - dateB
            })

            duplicatasSimilares.push({
              grupo: grupoKey,
              quantidade: grupoFiltrado.length,
              templates: grupoFiltrado.map((t: any) => ({
                id: t.id,
                name: t.name,
                created_at: t.created_at,
                is_active: t.is_active
              }))
            })
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      total_templates: templates.length,
      total_duplicatas_exatas: duplicatasExatas.length,
      total_templates_duplicados: duplicatasExatas.reduce((sum, d) => sum + d.quantidade, 0),
      duplicatas_exatas: duplicatasExatas,
      duplicatas_similares: duplicatasSimilares,
      resumo: {
        total_para_eliminar: duplicatasExatas.reduce((sum, d) => sum + d.eliminar.length, 0),
        templates_unicos_apos_limpeza: templates.length - duplicatasExatas.reduce((sum, d) => sum + d.eliminar.length, 0)
      }
    })
  } catch (error: any) {
    console.error('Erro ao verificar duplicatas:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar duplicatas' },
      { status: 500 }
    )
  }
}


