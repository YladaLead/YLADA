import { NextResponse } from 'next/server'
import { testEnvironmentVariables, testSupabaseConnection, testOpenAIConfiguration } from '@/lib/test-config'

export async function GET() {
  try {
    console.log('🔍 Testando configuração da YLADA...')

    const results = {
      environment: testEnvironmentVariables(),
      supabase: await testSupabaseConnection(),
      openai: testOpenAIConfiguration(),
      timestamp: new Date().toISOString()
    }

    const allPassed = Object.values(results).every(result => 
      typeof result === 'boolean' ? result : true
    )

    return NextResponse.json({
      success: allPassed,
      results,
      message: allPassed 
        ? '✅ Todas as configurações estão OK!' 
        : '❌ Algumas configurações precisam ser ajustadas'
    })

  } catch (error) {
    console.error('Erro no teste de configuração:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      message: '❌ Erro ao testar configurações'
    }, { status: 500 })
  }
}
