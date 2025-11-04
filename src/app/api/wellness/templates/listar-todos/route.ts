import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Listar TODOS os templates Wellness para verificação manual
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
      .select('id, name, type, specialization, description, created_at, is_active')
      .eq('profession', 'wellness')
      .eq('language', 'pt')
      .order('name', { ascending: true })
    
    if (error) {
      if (error.message?.includes('profession') || error.code === '42703') {
        const { data: allTemplates, error: error2 } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, type, specialization, description, created_at, is_active')
          .eq('language', 'pt')
          .order('name', { ascending: true })
        
        if (error2) throw error2
        templates = allTemplates?.filter((t: any) => 
          t.profession === 'wellness' || !t.profession
        ) || []
      } else {
        throw error
      }
    }

    // Agrupar por nome para identificar possíveis duplicatas visuais
    const grupos = new Map<string, any[]>()
    
    templates?.forEach((template: any) => {
      const nomeLower = template.name.toLowerCase().trim()
      if (!grupos.has(nomeLower)) {
        grupos.set(nomeLower, [])
      }
      grupos.get(nomeLower)!.push(template)
    })

    const possiveisDuplicatas: any[] = []
    grupos.forEach((templatesGrupo, nome) => {
      if (templatesGrupo.length > 1) {
        possiveisDuplicatas.push({
          nome: nome,
          quantidade: templatesGrupo.length,
          templates: templatesGrupo
        })
      }
    })

    return NextResponse.json({
      success: true,
      total_templates: templates?.length || 0,
      possiveis_duplicatas_por_nome: possiveisDuplicatas.length,
      todos_templates: templates?.map((t: any) => ({
        id: t.id,
        name: t.name,
        type: t.type,
        is_active: t.is_active,
        created_at: t.created_at
      })) || [],
      grupos_por_nome: Array.from(grupos.entries()).map(([nome, templates]) => ({
        nome: nome,
        quantidade: templates.length,
        templates: templates.map((t: any) => ({
          id: t.id,
          name: t.name,
          type: t.type
        }))
      })).filter(g => g.quantidade > 1)
    })
  } catch (error: any) {
    console.error('Erro ao listar templates:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao listar templates' },
      { status: 500 }
    )
  }
}


