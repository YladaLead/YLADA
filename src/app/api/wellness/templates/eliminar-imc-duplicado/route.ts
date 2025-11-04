import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Eliminar template IMC duplicado
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Buscar templates IMC
    const { data: templatesImc, error: fetchError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, created_at')
      .eq('profession', 'wellness')
      .eq('language', 'pt')
      .eq('is_active', true)
      .or('name.ilike.%IMC%,name.ilike.%índice de massa corporal%')
      .order('created_at', { ascending: true })
    
    if (fetchError) {
      // Se profession não existir
      if (fetchError.message?.includes('profession') || fetchError.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, created_at')
          .eq('language', 'pt')
          .eq('is_active', true)
          .or('name.ilike.%IMC%,name.ilike.%índice de massa corporal%')
          .order('created_at', { ascending: true })
        
        if (error2) throw error2
        
        const imcTemplates = allTemplates?.filter((t: any) => 
          (t.profession === 'wellness' || !t.profession) &&
          (t.name.toLowerCase().includes('imc') || 
           t.name.toLowerCase().includes('índice de massa corporal'))
        ) || []
        
        if (imcTemplates.length <= 1) {
          return NextResponse.json({
            success: true,
            message: 'Nenhuma duplicata de IMC encontrada',
            eliminados: 0
          })
        }

        // Manter o mais completo/antigo, eliminar os demais
        // Ordenar: preferir nome mais completo ("Calculadora de IMC" vs "Calculadora IMC")
        imcTemplates.sort((a, b) => {
          // Primeiro: preferir nome mais completo
          const aCompleto = a.name.toLowerCase().includes('de imc') || a.name.toLowerCase().includes('índice')
          const bCompleto = b.name.toLowerCase().includes('de imc') || b.name.toLowerCase().includes('índice')
          if (aCompleto && !bCompleto) return -1
          if (!aCompleto && bCompleto) return 1
          // Se ambos completos ou incompletos, manter o mais antigo
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateA - dateB
        })
        const manter = imcTemplates[0]
        const eliminar = imcTemplates.slice(1)
        
        const idsEliminar = eliminar.map((t: any) => t.id)

        const { error: deleteError } = await supabaseAdmin
          .from('templates_nutrition')
          .update({ is_active: false })
          .in('id', idsEliminar)

        if (deleteError) throw deleteError

        return NextResponse.json({
          success: true,
          message: `${eliminar.length} duplicata(s) de IMC eliminada(s)`,
          manter: {
            id: manter.id,
            name: manter.name
          },
          eliminados: eliminar.map((t: any) => ({
            id: t.id,
            name: t.name
          }))
        })
      }
      throw fetchError
    }

    if (!templatesImc || templatesImc.length <= 1) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma duplicata de IMC encontrada',
        eliminados: 0
      })
    }

    // Manter o mais completo/antigo, eliminar os demais
    // Ordenar: preferir nome mais completo ("Calculadora de IMC" vs "Calculadora IMC")
    templatesImc.sort((a, b) => {
      // Primeiro: preferir nome mais completo
      const aCompleto = a.name.toLowerCase().includes('de imc') || a.name.toLowerCase().includes('índice')
      const bCompleto = b.name.toLowerCase().includes('de imc') || b.name.toLowerCase().includes('índice')
      if (aCompleto && !bCompleto) return -1
      if (!aCompleto && bCompleto) return 1
      // Se ambos completos ou incompletos, manter o mais antigo
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateA - dateB
    })
    const manter = templatesImc[0]
    const eliminar = templatesImc.slice(1)
    
    const idsEliminar = eliminar.map((t: any) => t.id)

    const { error: deleteError } = await supabaseAdmin
      .from('templates_nutrition')
      .update({ is_active: false })
      .in('id', idsEliminar)

    if (deleteError) throw deleteError

    return NextResponse.json({
      success: true,
      message: `${eliminar.length} duplicata(s) de IMC eliminada(s)`,
      manter: {
        id: manter.id,
        name: manter.name
      },
      eliminados: eliminar.map((t: any) => ({
        id: t.id,
        name: t.name
      }))
    })
  } catch (error: any) {
    console.error('Erro ao eliminar IMC duplicado:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao eliminar duplicata' },
      { status: 500 }
    )
  }
}

