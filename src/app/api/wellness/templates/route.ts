import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Função auxiliar para formatar templates
function formatTemplates(templates: any[]) {
  return templates.map(template => {
    // Gerar slug do nome
    const slug = template.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Determinar categoria baseada no tipo
    const categoria = template.type === 'calculadora' ? 'Calculadora' :
                      template.type === 'quiz' ? 'Quiz' :
                      template.type === 'planilha' ? 'Planilha' : 'Calculadora'

    return {
      id: slug,
      nome: template.name,
      categoria,
      objetivo: template.objective || 'Avaliar',
      icon: template.type === 'calculadora' ? '🧮' :
            template.type === 'quiz' ? '🎯' :
            template.type === 'planilha' ? '📊' : '📊',
      descricao: template.description || template.title || '',
      slug,
      templateId: template.id,
      specialization: template.specialization,
      content: template.content
    }
  })
}

// GET - Buscar templates Wellness disponíveis
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Buscar templates Wellness do banco
    // Filtrar apenas profession='wellness' e language='pt' (português)
    let templates: any[] = []
    let error: any = null

    try {
      const { data, error: err } = await supabaseAdmin
        .from('templates_nutrition')
        .select('id, name, type, specialization, objective, title, description, content, profession')
        .eq('is_active', true)
        .eq('profession', 'wellness') // Apenas templates Wellness
        .eq('language', 'pt') // Apenas português
        .order('type', { ascending: true })
        .order('name', { ascending: true })
      
      if (err) throw err
      templates = data || []
    } catch (err: any) {
      // Se profession não existir, buscar sem essa coluna
      if (err.message?.includes('profession') || err.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, type, specialization, objective, title, description, content')
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

    // Se profession existe, filtrar apenas wellness
    if (templates.length > 0 && templates[0].profession !== undefined) {
      templates = templates.filter(t => t.profession === 'wellness')
    }

    // Transformar para formato esperado pelo frontend
    const formattedTemplates = formatTemplates(templates)

    // Log para debug
    console.log(`[API Wellness Templates] Templates encontrados: ${templates.length}`)
    console.log(`[API Wellness Templates] Templates formatados: ${formattedTemplates.length}`)

    return NextResponse.json({
      success: true,
      templates: formattedTemplates
    })
  } catch (error: any) {
    console.error('Erro ao buscar templates Wellness:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar templates' },
      { status: 500 }
    )
  }
}

