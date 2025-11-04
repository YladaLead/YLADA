import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Corrigir IMC duplicado (ativar o correto, desativar o incorreto)
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // IDs conhecidos dos templates IMC
    const idCorreto = '39b79fb9-a115-4a17-ab12-17fb6c83a8d1' // Calculadora de IMC (nome completo)
    const idIncorreto = '4db486d1-a525-4ff6-833d-f09ace962518' // Calculadora IMC (nome incompleto)

    // Reativar o correto
    const { error: errorAtivar } = await supabaseAdmin
      .from('templates_nutrition')
      .update({ is_active: true })
      .eq('id', idCorreto)
    
    if (errorAtivar) {
      console.error('Erro ao reativar IMC correto:', errorAtivar)
    }

    // Desativar o incorreto
    const { error: errorDesativar } = await supabaseAdmin
      .from('templates_nutrition')
      .update({ is_active: false })
      .eq('id', idIncorreto)
    
    if (errorDesativar) {
      console.error('Erro ao desativar IMC incorreto:', errorDesativar)
    }

    if (errorAtivar || errorDesativar) {
      throw new Error('Erro ao corrigir templates IMC')
    }

    return NextResponse.json({
      success: true,
      message: 'IMC duplicado corrigido com sucesso',
      ativado: {
        id: idCorreto,
        name: 'Calculadora de IMC'
      },
      desativado: {
        id: idIncorreto,
        name: 'Calculadora IMC'
      }
    })
  } catch (error: any) {
    console.error('Erro ao corrigir IMC:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao corrigir IMC' },
      { status: 500 }
    )
  }
}


