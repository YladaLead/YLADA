import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Eliminar templates duplicados no Wellness
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { confirmar } = body

    if (!confirmar || confirmar !== 'SIM_ELIMINAR_DUPLICATAS') {
      return NextResponse.json(
        { error: 'Confirmação necessária. Envie { "confirmar": "SIM_ELIMINAR_DUPLICATAS" }' },
        { status: 400 }
      )
    }

    // Buscar todos os templates Wellness
    const { data: templates, error: fetchError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, created_at')
      .eq('profession', 'wellness')
      .eq('language', 'pt')
      .eq('is_active', true)
    
    if (fetchError) {
      if (fetchError.message?.includes('profession') || fetchError.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, created_at')
          .eq('language', 'pt')
          .eq('is_active', true)
        
        if (error2) throw error2
        templates = allTemplates?.filter((t: any) => 
          t.profession === 'wellness' || !t.profession
        ) || []
      } else {
        throw fetchError
      }
    }

    // Agrupar por nome normalizado
    const grupos = new Map<string, any[]>()
    
    templates.forEach((template: any) => {
      const nomeNormalizado = template.name.toLowerCase().trim()
      if (!grupos.has(nomeNormalizado)) {
        grupos.set(nomeNormalizado, [])
      }
      grupos.get(nomeNormalizado)!.push(template)
    })

    // Identificar IDs para eliminar (manter o mais antigo de cada grupo)
    const idsParaEliminar: number[] = []

    grupos.forEach((templatesGrupo) => {
      if (templatesGrupo.length > 1) {
        // Ordenar por data de criação (mais antigo primeiro)
        templatesGrupo.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateA - dateB
        })

        // Manter o primeiro (mais antigo), eliminar os demais
        const eliminar = templatesGrupo.slice(1)
        eliminar.forEach((template: any) => {
          idsParaEliminar.push(template.id)
        })
      }
    })

    if (idsParaEliminar.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma duplicata encontrada',
        eliminados: 0
      })
    }

    // Desativar os templates duplicados (não deletar, apenas desativar)
    const { error: deleteError } = await supabaseAdmin
      .from('templates_nutrition')
      .update({ is_active: false })
      .in('id', idsParaEliminar)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({
      success: true,
      message: `${idsParaEliminar.length} duplicata(s) eliminada(s)`,
      eliminados: idsParaEliminar.length,
      ids_eliminados: idsParaEliminar
    })
  } catch (error: any) {
    console.error('Erro ao eliminar duplicatas:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao eliminar duplicatas' },
      { status: 500 }
    )
  }
}

