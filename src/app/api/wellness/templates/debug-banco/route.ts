import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    // Buscar TODOS os templates sem filtro
    const { data: allTemplates, error: err } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, type, language, is_active, profession')
      .order('name', { ascending: true })
    
    if (err) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 500 })
    }

    // Agrupar por language
    const porLanguage: any = {}
    allTemplates?.forEach(t => {
      const lang = t.language || 'sem-language'
      if (!porLanguage[lang]) {
        porLanguage[lang] = []
      }
      porLanguage[lang].push({
        id: t.id,
        name: t.name,
        type: t.type,
        is_active: t.is_active,
        profession: t.profession
      })
    })

    return NextResponse.json({
      success: true,
      total: allTemplates?.length || 0,
      por_language: porLanguage,
      todos: allTemplates
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

