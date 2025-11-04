import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Verificar status do preview de cada template
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
      .select('id, name, type, specialization')
      .eq('profession', 'wellness')
      .eq('language', 'pt')
      .eq('is_active', true)
      .order('type', { ascending: true })
      .order('name', { ascending: true })
    
    if (error) {
      if (error.message?.includes('profession') || error.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, type, specialization')
          .eq('language', 'pt')
          .eq('is_active', true)
          .order('type', { ascending: true })
          .order('name', { ascending: true })
        
        if (error2) throw error2
        templates = allTemplates?.filter((t: any) => 
          t.profession === 'wellness' || !t.profession
        ) || []
      } else {
        throw error
      }
    }

    // Templates com preview completo no Wellness (baseado no código)
    const templatesComPreviewCompleto = [
      // Calculadoras
      'água', 'agua', 'hidratação', 'hidratacao',
      'imc', 'índice de massa corporal',
      'calorias', 'caloria',
      // Quizzes - ainda não implementados
      // Planilhas - ainda não implementadas
    ]

    // Verificar status de cada template
    const statusTemplates = templates?.map((template: any) => {
      const nomeLower = template.name.toLowerCase()
      const tipo = template.type?.toLowerCase() || 'calculadora'
      
      let temPreviewCompleto = false
      let motivo = ''
      
      // Verificar calculadoras
      if (tipo.includes('calculadora') || tipo.includes('calculator')) {
        if (
          nomeLower.includes('água') || nomeLower.includes('agua') || 
          nomeLower.includes('hidratação') || nomeLower.includes('hidratacao')
        ) {
          temPreviewCompleto = true
          motivo = 'Calculadora de Água - Preview completo com 4 etapas'
        } else if (
          nomeLower.includes('imc') || 
          nomeLower.includes('índice de massa corporal')
        ) {
          temPreviewCompleto = true
          motivo = 'Calculadora IMC - Preview completo com 4 etapas'
        } else if (
          nomeLower.includes('calorias') || nomeLower.includes('caloria')
        ) {
          temPreviewCompleto = true
          motivo = 'Calculadora de Calorias - Preview completo com 4 etapas'
        } else {
          temPreviewCompleto = false
          motivo = 'Calculadora - Preview genérico (sem etapas específicas)'
        }
      }
      // Verificar quizzes
      else if (tipo.includes('quiz')) {
        temPreviewCompleto = false
        motivo = 'Quiz - Preview simples (sem navegação por etapas)'
      }
      // Verificar planilhas
      else if (tipo.includes('planilha') || tipo.includes('checklist') || tipo.includes('tabela')) {
        temPreviewCompleto = false
        motivo = 'Planilha - Preview simples (sem navegação por etapas)'
      }
      else {
        temPreviewCompleto = false
        motivo = 'Tipo não identificado - Preview genérico'
      }

      return {
        id: template.id,
        name: template.name,
        type: tipo,
        temPreviewCompleto,
        motivo
      }
    }) || []

    // Agrupar por status
    const comPreviewCompleto = statusTemplates.filter(t => t.temPreviewCompleto)
    const semPreviewCompleto = statusTemplates.filter(t => !t.temPreviewCompleto)

    // Agrupar por tipo
    const porTipo = {
      calculadoras: statusTemplates.filter(t => t.type.includes('calculadora') || t.type.includes('calculator')),
      quizzes: statusTemplates.filter(t => t.type.includes('quiz')),
      planilhas: statusTemplates.filter(t => t.type.includes('planilha') || t.type.includes('checklist') || t.type.includes('tabela'))
    }

    return NextResponse.json({
      success: true,
      total_templates: templates?.length || 0,
      resumo: {
        com_preview_completo: comPreviewCompleto.length,
        sem_preview_completo: semPreviewCompleto.length,
        percentual_completo: templates?.length ? ((comPreviewCompleto.length / templates.length) * 100).toFixed(1) : 0
      },
      por_tipo: {
        calculadoras: {
          total: porTipo.calculadoras.length,
          completo: porTipo.calculadoras.filter(t => t.temPreviewCompleto).length,
          incompleto: porTipo.calculadoras.filter(t => !t.temPreviewCompleto).length
        },
        quizzes: {
          total: porTipo.quizzes.length,
          completo: porTipo.quizzes.filter(t => t.temPreviewCompleto).length,
          incompleto: porTipo.quizzes.filter(t => !t.temPreviewCompleto).length
        },
        planilhas: {
          total: porTipo.planilhas.length,
          completo: porTipo.planilhas.filter(t => t.temPreviewCompleto).length,
          incompleto: porTipo.planilhas.filter(t => !t.temPreviewCompleto).length
        }
      },
      templates_com_preview_completo: comPreviewCompleto,
      templates_sem_preview_completo: semPreviewCompleto,
      todos_templates: statusTemplates
    })
  } catch (error: any) {
    console.error('Erro ao verificar status do preview:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar status' },
      { status: 500 }
    )
  }
}

