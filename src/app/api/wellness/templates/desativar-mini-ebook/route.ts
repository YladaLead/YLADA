import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Desativar definitivamente o Mini E-book Educativo
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

    if (!confirmar || confirmar !== 'SIM_DESATIVAR_MINI_EBOOK') {
      return NextResponse.json(
        { error: 'Confirmação necessária. Envie { "confirmar": "SIM_DESATIVAR_MINI_EBOOK" }' },
        { status: 400 }
      )
    }

    // Buscar o template Mini E-book Educativo
    const { data: templates, error: fetchError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, type, is_active')
      .eq('profession', 'wellness')
      .eq('language', 'pt')
      .or('name.ilike.%mini e-book educativo%,name.ilike.%mini ebook educativo%,name.ilike.%mini-book educativo%,name.ilike.%minibook educativo%,name.ilike.%ebook educativo%,name.ilike.%e-book educativo%')
    
    if (fetchError) {
      // Se profession não existir, buscar sem essa coluna
      if (fetchError.message?.includes('profession') || fetchError.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, type, is_active')
          .eq('language', 'pt')
          .or('name.ilike.%mini e-book educativo%,name.ilike.%mini ebook educativo%,name.ilike.%mini-book educativo%,name.ilike.%minibook educativo%,name.ilike.%ebook educativo%,name.ilike.%e-book educativo%')
        
        if (error2) throw error2
        
        // Filtrar apenas wellness se profession não existir
        templates = allTemplates?.filter((t: any) => 
          t.profession === 'wellness' || !t.profession
        ) || []
      } else {
        throw fetchError
      }
    }

    if (!templates || templates.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Mini E-book Educativo não encontrado (já pode estar desativado)',
        desativados: 0,
        ids_desativados: []
      })
    }

    // Normalizar nomes para garantir que encontramos todos
    const templatesEncontrados = templates.filter((t: any) => {
      const nomeLower = (t.name || '').toLowerCase()
      return nomeLower.includes('mini e-book') ||
             nomeLower.includes('mini ebook') ||
             nomeLower.includes('mini-book') ||
             nomeLower.includes('minibook') ||
             nomeLower.includes('ebook educativo') ||
             nomeLower.includes('e-book educativo')
    })

    if (templatesEncontrados.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Mini E-book Educativo não encontrado',
        desativados: 0,
        ids_desativados: []
      })
    }

    const idsParaDesativar = templatesEncontrados.map((t: any) => t.id)

    // Desativar os templates (não deletar, apenas desativar)
    const { error: updateError } = await supabaseAdmin
      .from('templates_nutrition')
      .update({ is_active: false })
      .in('id', idsParaDesativar)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      message: `${templatesEncontrados.length} template(s) Mini E-book Educativo desativado(s) definitivamente`,
      desativados: templatesEncontrados.length,
      ids_desativados: idsParaDesativar,
      templates_desativados: templatesEncontrados.map((t: any) => ({
        id: t.id,
        name: t.name,
        type: t.type
      }))
    })
  } catch (error: any) {
    console.error('Erro ao desativar Mini E-book Educativo:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao desativar template' },
      { status: 500 }
    )
  }
}

