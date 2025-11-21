import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function formatTemplates(templates: any[]) {
  return templates.map(template => {
    // Mapear type para categoria
    const categoryMap: { [key: string]: string } = {
      quiz: 'Quiz',
      calculadora: 'Calculadora',
      planilha: 'Planilha',
      checklist: 'Checklist',
      conteudo: 'Conteúdo',
      diagnostico: 'Diagnóstico',
      default: 'Outros'
    }

    // Garantir que content seja parseado corretamente
    let content = template.content
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content)
      } catch (e) {
        console.warn('Erro ao fazer parse do content:', e)
        content = null
      }
    }

    return {
      id: template.id,
      templateId: template.id, // UUID do banco
      nome: template.name,
      slug: template.slug || template.id,
      categoria: categoryMap[template.type] || categoryMap.default,
      type: template.type,
      descricao: template.description || '',
      objetivo: template.objective || '',
      icon: template.icon || '📋',
      content: content
    }
  })
}

// GET - Buscar templates Nutri disponíveis
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Buscar templates Nutri do banco
    // Filtrar apenas profession='coach' e language='pt' (português)
    let templates: any[] = []
    let error: any = null

    try {
      const { data, error: err } = await supabaseAdmin
        .from('coach_templates_nutrition')
        .select('id, name, slug, type, specialization, objective, title, description, content, profession, is_active')
        .eq('is_active', true) // Apenas ativos
        .eq('profession', 'coach') // Apenas templates Coach
        .eq('language', 'pt') // Apenas português
        .order('type', { ascending: true })
        .order('name', { ascending: true })
      
      if (err) throw err
      templates = data || []
    } catch (err: any) {
      // Se profession não existir, buscar sem essa coluna
      if (err.message?.includes('profession') || err.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('coach_templates_nutrition')
          .select('id, name, slug, type, specialization, objective, title, description, content')
          .eq('is_active', true)
          .eq('language', 'pt') // Apenas português
          .order('type', { ascending: true })
          .order('name', { ascending: true })
        
        if (error2) throw error2
        templates = allTemplates || []
      } else {
        throw err
      }
    }

    // Se profession existe, filtrar apenas coach
    if (templates.length > 0 && templates[0].profession !== undefined) {
      templates = templates.filter(t => t.profession === 'coach')
    }

    // Transformar para formato esperado pelo frontend
    const formattedTemplates = formatTemplates(templates)

    // Log para debug
    console.log(`
[API Coach Templates] 
- Templates encontrados: ${templates.length}
- Templates formatados: ${formattedTemplates.length}
- Filtro: profession='coach', language='pt', is_active=true
    `)

    return NextResponse.json({
      success: true,
      templates: formattedTemplates
    })
  } catch (error: any) {
    console.error('Erro ao buscar templates Coach:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar templates' },
      { status: 500 }
    )
  }
}

