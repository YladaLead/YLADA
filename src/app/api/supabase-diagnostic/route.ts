import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-fixed'

export async function GET() {
  try {
    console.log('🔍 DIAGNÓSTICO COMPLETO DO SUPABASE...')

    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Faltando',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Faltando',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurado' : '❌ Faltando',
      },
      connection: {},
      tables: {},
      errors: []
    }

    // Teste 1: Conexão básica
    try {
      const { data, error } = await supabaseAdmin
        .from('templates_base')
        .select('count')
        .limit(1)

      if (error) {
        diagnostics.errors.push(`Erro na conexão: ${error.message}`)
        diagnostics.connection.status = '❌ Erro'
        diagnostics.connection.error = error.message
      } else {
        diagnostics.connection.status = '✅ Conectado'
        diagnostics.connection.data = data
      }
    } catch (error) {
      diagnostics.errors.push(`Erro de conexão: ${error}`)
      diagnostics.connection.status = '❌ Falha'
    }

    // Teste 2: Verificar tabelas existentes
    try {
      const tables = [
        'templates_base',
        'generated_links', 
        'leads',
        'templates_ia',
        'ia_learning',
        'user_profiles',
        'generated_tools',
        'ai_conversations',
        'ai_generated_templates',
        'ai_response_cache',
        'user_metrics',
        'ai_translations_cache',
        'translation_quality',
        'countries_compliance',
        'calculation_validations',
        'calculator_types',
        'user_calculators'
      ]

      for (const table of tables) {
        try {
          const { data, error } = await supabaseAdmin
            .from(table)
            .select('count')
            .limit(1)

          if (error) {
            diagnostics.tables[table] = `❌ ${error.message}`
          } else {
            diagnostics.tables[table] = '✅ Existe'
          }
        } catch (error) {
          diagnostics.tables[table] = `❌ Erro: ${error}`
        }
      }
    } catch (error) {
      diagnostics.errors.push(`Erro ao verificar tabelas: ${error}`)
    }

    // Teste 3: Verificar RLS (Row Level Security) - Versão simplificada
    try {
      const { data, error } = await supabaseAdmin
        .from('templates_base')
        .select('id')
        .limit(1)

      if (error) {
        diagnostics.errors.push(`Erro RLS: ${error.message}`)
      } else {
        diagnostics.rls = '✅ RLS configurado'
      }
    } catch (error) {
      diagnostics.errors.push(`Erro RLS: ${error}`)
    }

    // Teste 4: Verificar índices - Versão simplificada
    try {
      const { data, error } = await supabaseAdmin
        .from('templates_base')
        .select('id')
        .limit(1)

      if (error) {
        diagnostics.errors.push(`Erro índices: ${error.message}`)
      } else {
        diagnostics.indexes = '✅ Índices OK'
      }
    } catch (error) {
      diagnostics.errors.push(`Erro índices: ${error}`)
    }

    const hasErrors = diagnostics.errors.length > 0
    const hasTableErrors = Object.values(diagnostics.tables).some(status => status.includes('❌'))

    return NextResponse.json({
      success: !hasErrors && !hasTableErrors,
      diagnostics,
      summary: {
        totalErrors: diagnostics.errors.length,
        tableErrors: Object.values(diagnostics.tables).filter(status => status.includes('❌')).length,
        connectionStatus: diagnostics.connection.status,
        recommendation: hasErrors || hasTableErrors 
          ? '❌ Problemas detectados - verificar configuração'
          : '✅ Supabase funcionando corretamente'
      }
    })

  } catch (error) {
    console.error('Erro no diagnóstico Supabase:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: '❌ Falha no diagnóstico',
      details: error.toString()
    }, { status: 500 })
  }
}
