import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Função auxiliar para formatar templates
function formatTemplates(templates: any[]) {
  return templates.map(template => {
    // ✅ Usar slug do banco se existir, senão gerar do nome (fallback)
    const slug = template.slug || template.name
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

    // Mapeamento de ícones específicos por slug
    const iconMap: Record<string, string> = {
      'calc-hidratacao': '💧',
      'calculadora-agua': '💧',
      'agua': '💧',
      'hidratacao': '💧',
      'calc-imc': '📊',
      'calculadora-imc': '📊',
      'imc': '📊',
      'calc-proteina': '🥩',
      'calculadora-proteina': '🥩',
      'proteina': '🥩',
      'calc-calorias': '🔥',
      'calculadora-calorias': '🔥',
      'calorias': '🔥',
      'quiz-ganhos': '💰',
      'quiz-potencial': '📈',
      'quiz-proposito': '🎯',
      'quiz-bem-estar': '✨',
      'quiz-interativo': '🎮',
      'quiz-detox': '🌿',
      'quiz-energetico': '⚡',
      'guia-hidratacao': '💧',
      'checklist-alimentar': '✅',
      'checklist-detox': '🌿',
      'desafio-7-dias': '🏃',
      'desafio-21-dias': '🎯'
    }
    
    // Usar ícone do banco se existir, senão usar mapeamento, senão usar fallback por tipo
    const icon = template.icon || 
                 iconMap[slug] || 
                 (template.type === 'calculadora' ? '🧮' :
                  template.type === 'quiz' ? '🎯' :
                  template.type === 'planilha' ? '📊' : '📋')

    return {
      id: slug,
      nome: template.name,
      type: template.type, // IMPORTANTE: Incluir o type do banco
      categoria,
      objetivo: template.objective || 'Avaliar',
      icon,
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
    // Tratamento robusto de erros para não quebrar a página
    let templates: any[] = []

    try {
      // Buscar apenas colunas básicas que sempre existem
      const { data, error: err } = await supabaseAdmin
        .from('templates_nutrition')
        .select('id, name, slug, type, specialization, objective, title, description, content, is_active')
        .eq('is_active', true)
        .order('type', { ascending: true })
        .order('name', { ascending: true })
      
      if (err) {
        console.error('[API Wellness Templates] Erro na query:', err)
        // Retornar array vazio em caso de erro, não quebrar a página
        templates = []
      } else {
        templates = data || []
      }
    } catch (err: any) {
      console.error('[API Wellness Templates] Erro ao buscar templates:', err)
      // Retornar array vazio em caso de erro, não quebrar a página
      templates = []
    }

    // ✅ FILTRAR: Excluir template "Seu corpo está pedindo Detox?" das opções de vendas
    // (incompleto no Wellness - sem template dedicado e diagnóstico específico)
    const templatesFiltrados = templates.filter(template => {
      const nomeLower = (template.name || '').toLowerCase()
      const slugLower = (template.slug || '').toLowerCase()
      
      // Excluir se contiver "pedindo detox" ou "quiz-pedindo-detox"
      const isPedindoDetox = nomeLower.includes('pedindo detox') || 
                             nomeLower.includes('pedindo-detox') ||
                             slugLower.includes('quiz-pedindo-detox') ||
                             slugLower.includes('seu-corpo-esta-pedindo-detox') ||
                             slugLower.includes('pedindo-detox')
      
      return !isPedindoDetox
    })

    // Transformar para formato esperado pelo frontend
    const formattedTemplates = formatTemplates(templatesFiltrados)

    // Log para debug
    console.log(`[API Wellness Templates] Templates encontrados: ${templates.length}`)
    console.log(`[API Wellness Templates] Templates após filtro: ${templatesFiltrados.length}`)
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

