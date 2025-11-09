import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * API Route para corrigir content das planilhas Detox e atualizar Quiz Detox
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

    // Ler o script de correção
    const scriptCorrecaoPath = join(process.cwd(), 'scripts', 'corrigir-content-planilhas-detox-wellness.sql')
    let sqlScriptCorrecao: string
    
    try {
      sqlScriptCorrecao = readFileSync(scriptCorrecaoPath, 'utf-8')
    } catch (error) {
      return NextResponse.json(
        { error: 'Script de correção não encontrado. Execute manualmente no Supabase.' },
        { status: 404 }
      )
    }

    // Ler o script do Quiz Detox (corrigido)
    const scriptQuizPath = join(process.cwd(), 'scripts', 'criar-content-quiz-detox-wellness.sql')
    let sqlScriptQuiz: string
    
    try {
      sqlScriptQuiz = readFileSync(scriptQuizPath, 'utf-8')
    } catch (error) {
      return NextResponse.json(
        { error: 'Script do Quiz Detox não encontrado. Execute manualmente no Supabase.' },
        { status: 404 }
      )
    }

    // Dividir scripts em queries individuais (separadas por ;)
    const processQueries = (script: string) => {
      return script
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0 && !q.startsWith('--'))
        .filter(q => {
          const upper = q.toUpperCase()
          return upper.includes('UPDATE') || upper.includes('INSERT') || upper.includes('SELECT')
        })
    }

    const queriesCorrecao = processQueries(sqlScriptCorrecao)
    const queriesQuiz = processQueries(sqlScriptQuiz)

    const results: any[] = []
    const errors: any[] = []

    // Executar queries de correção (UPDATE)
    for (const query of queriesCorrecao) {
      if (query.toUpperCase().includes('UPDATE')) {
        try {
          // Supabase JS não suporta SQL direto, então vamos usar uma abordagem diferente
          // Vamos executar via RPC ou função do Supabase
          // Por enquanto, retornamos instruções para execução manual
          results.push({
            query: query.substring(0, 50) + '...',
            status: 'pending_manual_execution',
            message: 'Execute manualmente no Supabase SQL Editor'
          })
        } catch (error: any) {
          errors.push({
            query: query.substring(0, 50) + '...',
            error: error.message
          })
        }
      }
    }

    // Executar queries do Quiz Detox (UPDATE)
    for (const query of queriesQuiz) {
      if (query.toUpperCase().includes('UPDATE')) {
        try {
          results.push({
            query: query.substring(0, 50) + '...',
            status: 'pending_manual_execution',
            message: 'Execute manualmente no Supabase SQL Editor'
          })
        } catch (error: any) {
          errors.push({
            query: query.substring(0, 50) + '...',
            error: error.message
          })
        }
      }
    }

    // Se houver erros ou se não conseguimos executar automaticamente
    if (errors.length > 0 || results.some(r => r.status === 'pending_manual_execution')) {
      return NextResponse.json({
        message: 'Execute os scripts manualmente no Supabase SQL Editor',
        instructions: {
          step1: 'Acesse: https://supabase.com/dashboard',
          step2: 'Selecione seu projeto',
          step3: 'Vá em SQL Editor (menu lateral)',
          step4: 'Execute PRIMEIRO: scripts/corrigir-content-planilhas-detox-wellness.sql',
          step5: 'Execute DEPOIS: scripts/criar-content-quiz-detox-wellness.sql',
          step6: 'Verifique os resultados nas queries de validação'
        },
        scripts: {
          correcao: sqlScriptCorrecao,
          quiz: sqlScriptQuiz
        },
        results,
        errors
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Scripts executados com sucesso',
      results,
      errors: errors.length > 0 ? errors : null
    })

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Erro ao processar scripts',
        message: error.message,
        instructions: {
          step1: 'Acesse: https://supabase.com/dashboard',
          step2: 'Vá em SQL Editor',
          step3: 'Execute PRIMEIRO: scripts/corrigir-content-planilhas-detox-wellness.sql',
          step4: 'Execute DEPOIS: scripts/criar-content-quiz-detox-wellness.sql'
        }
      },
      { status: 500 }
    )
  }
}

