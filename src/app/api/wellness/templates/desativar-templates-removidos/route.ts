import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Desativar definitivamente templates removidos do Wellness
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

    if (!confirmar || confirmar !== 'SIM_DESATIVAR_TEMPLATES_REMOVIDOS') {
      return NextResponse.json(
        { error: 'Confirmação necessária. Envie { "confirmar": "SIM_DESATIVAR_TEMPLATES_REMOVIDOS" }' },
        { status: 400 }
      )
    }

    // Lista de templates a serem desativados
    const templatesParaDesativar = [
      'mini e-book educativo',
      'mini ebook educativo',
      'mini-book educativo',
      'minibook educativo',
      'ebook educativo',
      'e-book educativo',
      'planilha dieta emagrecimento',
      'dieta emagrecimento',
      'tabela comparativa',
      'tabela de substituições',
      'tabela de substituicoes'
    ]

    // Buscar todos os templates Wellness
    let templates: any[] = []
    let error: any = null

    try {
      const { data, error: err } = await supabaseAdmin
        .from('templates_nutrition')
        .select('id, name, type, is_active')
        .eq('profession', 'wellness')
        .eq('language', 'pt')
        .eq('is_active', true)
      
      if (err) throw err
      templates = data || []
    } catch (err: any) {
      // Se profession não existir, buscar sem essa coluna
      if (err.message?.includes('profession') || err.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, type, is_active')
          .eq('language', 'pt')
          .eq('is_active', true)
        
        if (error2) throw error2
        
        // Filtrar apenas wellness se profession não existir
        templates = allTemplates?.filter((t: any) => 
          t.profession === 'wellness' || !t.profession
        ) || []
      } else {
        throw err
      }
    }

    if (!templates || templates.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum template encontrado',
        desativados: 0,
        ids_desativados: []
      })
    }

    // Filtrar templates que correspondem aos nomes a serem desativados
    const templatesEncontrados = templates.filter((t: any) => {
      const nomeLower = (t.name || '').toLowerCase()
      return templatesParaDesativar.some(nome => nomeLower.includes(nome))
    })

    if (templatesEncontrados.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum template para desativar encontrado (já podem estar desativados)',
        desativados: 0,
        ids_desativados: []
      })
    }

    const idsParaDesativar = templatesEncontrados.map((t: any) => t.id)

    // Desativar os templates
    const { error: updateError } = await supabaseAdmin
      .from('templates_nutrition')
      .update({ is_active: false })
      .in('id', idsParaDesativar)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      message: `${templatesEncontrados.length} template(s) desativado(s) definitivamente`,
      desativados: templatesEncontrados.length,
      ids_desativados: idsParaDesativar,
      templates_desativados: templatesEncontrados.map((t: any) => ({
        id: t.id,
        name: t.name,
        type: t.type
      }))
    })
  } catch (error: any) {
    console.error('Erro ao desativar templates removidos:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao desativar templates' },
      { status: 500 }
    )
  }
}

