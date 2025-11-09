import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // 1. Contagem geral
    const { data: wellnessCount } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, is_active', { count: 'exact', head: false })
      .eq('profession', 'wellness')
      .eq('language', 'pt')

    const { data: nutriCount } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, is_active', { count: 'exact', head: false })
      .eq('profession', 'nutri')
      .eq('language', 'pt')

    const wellnessAtivos = wellnessCount?.filter(t => t.is_active).length || 0
    const wellnessInativos = (wellnessCount?.length || 0) - wellnessAtivos
    const nutriAtivos = nutriCount?.filter(t => t.is_active).length || 0
    const nutriInativos = (nutriCount?.length || 0) - nutriAtivos

    // 2. Buscar todos os templates Wellness
    const { data: wellnessTemplates } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, type, specialization, is_active, slug, created_at')
      .eq('profession', 'wellness')
      .eq('language', 'pt')
      .order('type', { ascending: true })
      .order('name', { ascending: true })

    // 3. Buscar todos os templates Nutri
    const { data: nutriTemplates } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, type, specialization, is_active, slug, created_at')
      .eq('profession', 'nutri')
      .eq('language', 'pt')
      .order('type', { ascending: true })
      .order('name', { ascending: true })

    // 4. Identificar templates que faltam na Nutri
    const templatesFaltando = wellnessTemplates?.filter(w => {
      const nomeNormalizado = w.name?.toLowerCase().trim()
      return !nutriTemplates?.some(n => 
        n.name?.toLowerCase().trim() === nomeNormalizado &&
        n.type === w.type
      )
    }) || []

    // 5. Identificar templates que existem apenas na Nutri
    const templatesApenasNutri = nutriTemplates?.filter(n => {
      const nomeNormalizado = n.name?.toLowerCase().trim()
      return !wellnessTemplates?.some(w => 
        w.name?.toLowerCase().trim() === nomeNormalizado &&
        w.type === n.type
      )
    }) || []

    // 6. Agrupar por tipo
    const wellnessPorTipo = wellnessTemplates?.reduce((acc: any, t) => {
      if (!acc[t.type]) {
        acc[t.type] = { total: 0, ativos: 0 }
      }
      acc[t.type].total++
      if (t.is_active) acc[t.type].ativos++
      return acc
    }, {}) || {}

    const nutriPorTipo = nutriTemplates?.reduce((acc: any, t) => {
      if (!acc[t.type]) {
        acc[t.type] = { total: 0, ativos: 0 }
      }
      acc[t.type].total++
      if (t.is_active) acc[t.type].ativos++
      return acc
    }, {}) || {}

    // 7. Templates que existem em ambas mas com status diferente
    const templatesComStatusDiferente = wellnessTemplates?.filter(w => {
      const nomeNormalizado = w.name?.toLowerCase().trim()
      const nutri = nutriTemplates?.find(n => 
        n.name?.toLowerCase().trim() === nomeNormalizado &&
        n.type === w.type
      )
      return nutri && nutri.is_active !== w.is_active
    }).map(w => {
      const nomeNormalizado = w.name?.toLowerCase().trim()
      const nutri = nutriTemplates?.find(n => 
        n.name?.toLowerCase().trim() === nomeNormalizado &&
        n.type === w.type
      )
      return {
        nome: w.name,
        tipo: w.type,
        ativo_wellness: w.is_active,
        ativo_nutri: nutri?.is_active
      }
    }) || []

    return NextResponse.json({
      success: true,
      resumo: {
        wellness: {
          total: wellnessCount?.length || 0,
          ativos: wellnessAtivos,
          inativos: wellnessInativos
        },
        nutri: {
          total: nutriCount?.length || 0,
          ativos: nutriAtivos,
          inativos: nutriInativos
        },
        diferenca: {
          faltando_na_nutri: templatesFaltando.length,
          apenas_na_nutri: templatesApenasNutri.length
        }
      },
      templates_faltando_na_nutri: templatesFaltando.map(t => ({
        nome: t.name,
        tipo: t.type,
        especializacao: t.specialization,
        ativo_wellness: t.is_active,
        slug: t.slug,
        criado_em: t.created_at
      })),
      templates_apenas_na_nutri: templatesApenasNutri.map(t => ({
        nome: t.name,
        tipo: t.type,
        especializacao: t.specialization,
        ativo_nutri: t.is_active,
        slug: t.slug,
        criado_em: t.created_at
      })),
      por_tipo: {
        wellness: wellnessPorTipo,
        nutri: nutriPorTipo
      },
      status_diferente: templatesComStatusDiferente,
      todos_wellness: wellnessTemplates?.map(t => ({
        nome: t.name,
        tipo: t.type,
        ativo: t.is_active,
        slug: t.slug
      })) || [],
      todos_nutri: nutriTemplates?.map(t => ({
        nome: t.name,
        tipo: t.type,
        ativo: t.is_active,
        slug: t.slug
      })) || []
    })
  } catch (error: any) {
    console.error('Erro ao comparar templates:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao comparar templates',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

