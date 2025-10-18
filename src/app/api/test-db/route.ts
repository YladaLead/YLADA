import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com Supabase
    const { data, error } = await supabaseAdmin
      .from('templates_base')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Erro ao conectar com Supabase:', error)
      return NextResponse.json({
        success: false,
        error: 'Erro de conexão com banco de dados',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase funcionando',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro no teste de conexão:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
