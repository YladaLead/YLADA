import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * API Route para executar o script de migração de templates Nutri
 * 
 * ⚠️ IMPORTANTE: Esta rota executa SQL diretamente no banco
 * Use apenas em desenvolvimento ou com autenticação adequada
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin não configurado' },
        { status: 500 }
      )
    }

    // Ler o script SQL
    const scriptPath = join(process.cwd(), 'scripts', 'migrar-templates-nutri-EFICIENTE.sql')
    let sqlScript: string
    
    try {
      sqlScript = readFileSync(scriptPath, 'utf-8')
    } catch (error) {
      return NextResponse.json(
        { error: 'Script SQL não encontrado. Execute manualmente no Supabase.' },
        { status: 404 }
      )
    }

    // Dividir o script em queries individuais (separadas por ;)
    // Remover queries de SELECT que são apenas para verificação
    const queries = sqlScript
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'))
      .filter(q => {
        // Manter apenas INSERT e queries essenciais
        const upper = q.toUpperCase()
        return upper.includes('INSERT') || 
               upper.includes('WITH') ||
               upper.includes('UPDATE') ||
               upper.includes('DELETE')
      })

    // Executar cada query
    const results: any[] = []
    const errors: any[] = []

    for (const query of queries) {
      try {
        // Executar via RPC ou query direta
        // Nota: Supabase JS não suporta execução direta de SQL arbitrário
        // Precisamos usar uma abordagem diferente
        
        // Por enquanto, retornar instruções para execução manual
        return NextResponse.json({
          success: false,
          message: 'Execução automática não disponível. Use o guia passo a passo.',
          instructions: {
            step1: 'Acesse: https://supabase.com/dashboard',
            step2: 'Vá em SQL Editor',
            step3: 'Copie o conteúdo de: scripts/migrar-templates-nutri-EFICIENTE.sql',
            step4: 'Cole e execute no SQL Editor',
            step5: 'Verifique os resultados nas queries de validação'
          },
          script_path: scriptPath
        })
      } catch (error: any) {
        errors.push({
          query: query.substring(0, 100),
          error: error.message
        })
      }
    }

    // Verificar estado após execução
    const { data: countData, error: countError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('profession', { count: 'exact', head: true })
      .eq('language', 'pt')

    return NextResponse.json({
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'Script executado com sucesso!' 
        : 'Alguns erros ocorreram',
      errors: errors.length > 0 ? errors : undefined,
      results,
      count: countData
    })
  } catch (error: any) {
    console.error('Erro ao executar script de migração:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao executar script',
        message: 'Execute o script manualmente no Supabase SQL Editor',
        instructions: {
          step1: 'Acesse: https://supabase.com/dashboard',
          step2: 'Vá em SQL Editor',
          step3: 'Copie o conteúdo de: scripts/migrar-templates-nutri-EFICIENTE.sql',
          step4: 'Cole e execute no SQL Editor'
        }
      },
      { status: 500 }
    )
  }
}

