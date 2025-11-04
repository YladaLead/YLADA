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

    // Normalizar e identificar o tipo corretamente
    let tipoNormalizado = 'calculadora' // default
    if (template.type) {
      const tipoLower = template.type.toLowerCase().trim()
      if (tipoLower === 'quiz' || tipoLower.includes('quiz')) {
        tipoNormalizado = 'quiz'
      } else if (tipoLower === 'planilha' || tipoLower.includes('planilha') || tipoLower.includes('checklist') || tipoLower.includes('tabela')) {
        tipoNormalizado = 'planilha'
      } else if (tipoLower === 'calculadora' || tipoLower.includes('calculadora') || tipoLower.includes('calculator')) {
        tipoNormalizado = 'calculadora'
      }
    }

    // Determinar categoria baseada no tipo
    const categoria = tipoNormalizado === 'calculadora' ? 'Calculadora' :
                      tipoNormalizado === 'quiz' ? 'Quiz' :
                      tipoNormalizado === 'planilha' ? 'Planilha' : 'Calculadora'

    // Log para debug
    console.log(`[Format Template] ${template.name}: type="${template.type}" → tipoNormalizado="${tipoNormalizado}"`)

    return {
      id: slug,
      nome: template.name,
      categoria,
      type: tipoNormalizado, // Sempre retornar tipo normalizado
      objetivo: template.objective || 'Avaliar',
      icon: tipoNormalizado === 'calculadora' ? '🧮' :
            tipoNormalizado === 'quiz' ? '🎯' :
            tipoNormalizado === 'planilha' ? '📊' : '📊',
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
    // Comportamento original: retornar todos os templates PT ativos (sem filtrar por profession)
    // Buscar todos os templates PT ativos, aceitando 'pt' e 'pt-PT'
    const { data: allTemplates, error: err } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, type, specialization, objective, title, description, content')
      .eq('is_active', true)
      .order('type', { ascending: true })
      .order('name', { ascending: true })
    
    if (err) throw err
    
    // Filtrar apenas PT (aceitar 'pt' ou 'pt-PT')
    const templates = (allTemplates || []).filter((t: any) => {
      const lang = (t.language || '').toLowerCase().trim()
      return lang === 'pt' || lang === 'pt-pt' || lang.startsWith('pt')
    })

    // Log tipos brutos do banco
    console.log(`[API Wellness Templates] Templates encontrados: ${templates.length}`)
    templates.forEach(t => {
      console.log(`  - ${t.name}: type="${t.type}"`)
    })

    // Transformar para formato esperado pelo frontend
    const formattedTemplates = formatTemplates(templates)

    // Log tipos formatados
    console.log(`[API Wellness Templates] Templates formatados: ${formattedTemplates.length}`)
    formattedTemplates.forEach(t => {
      console.log(`  - ${t.nome}: type="${t.type}", categoria="${t.categoria}"`)
    })

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

