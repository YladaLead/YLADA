import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Rota para remover textos explicativos do template "perfil-intestino"
 * Uso: POST /api/debug/remover-texto-explicativo-perfil-intestino
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar template atual
    const { data: templateAtual, error: errorAtual } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, slug, description, objective')
      .eq('slug', 'perfil-intestino')
      .eq('profession', 'wellness')
      .maybeSingle()

    if (errorAtual) {
      return NextResponse.json(
        { 
          sucesso: false,
          erro: errorAtual.message
        },
        { status: 500 }
      )
    }

    if (!templateAtual) {
      return NextResponse.json(
        { 
          sucesso: false,
          erro: 'Template perfil-intestino não encontrado'
        },
        { status: 404 }
      )
    }

    // Verificar se tem texto explicativo
    const temTextoExplicativo = 
      (templateAtual.description && (
        templateAtual.description.toLowerCase().includes('identificar pessoas') ||
        templateAtual.description.toLowerCase().includes('direcionando') ||
        templateAtual.description.toLowerCase().includes('kit acelera')
      )) ||
      (templateAtual.objective && (
        templateAtual.objective.toLowerCase().includes('identificar pessoas') ||
        templateAtual.objective.toLowerCase().includes('direcionando') ||
        templateAtual.objective.toLowerCase().includes('kit acelera')
      ))

    if (!temTextoExplicativo) {
      return NextResponse.json({
        sucesso: true,
        mensagem: 'Template já está correto (sem textos explicativos)',
        template: templateAtual
      })
    }

    // Atualizar removendo textos explicativos
    const { data: templateAtualizado, error: errorUpdate } = await supabaseAdmin
      .from('templates_nutrition')
      .update({
        description: 'Identifique o tipo de funcionamento intestinal e saúde digestiva',
        objective: 'Identificar o tipo de funcionamento intestinal e saúde digestiva',
        updated_at: new Date().toISOString()
      })
      .eq('slug', 'perfil-intestino')
      .eq('profession', 'wellness')
      .select()
      .single()

    if (errorUpdate) {
      return NextResponse.json(
        { 
          sucesso: false,
          erro: errorUpdate.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: 'Textos explicativos removidos com sucesso!',
      antes: {
        description: templateAtual.description,
        objective: templateAtual.objective
      },
      depois: {
        description: templateAtualizado.description,
        objective: templateAtualizado.objective
      }
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json(
      { 
        sucesso: false,
        erro: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}




















