import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Iniciando diagnóstico completo do sistema...')
    
    // 1. Verificar variáveis de ambiente
    const envVars = {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Configurado' : '❌ Faltando',
      OPENAI_ASSISTANT_CHAT_ID: process.env.OPENAI_ASSISTANT_CHAT_ID ? '✅ Configurado' : '❌ Faltando',
      OPENAI_ASSISTANT_CREATOR_ID: process.env.OPENAI_ASSISTANT_CREATOR_ID ? '✅ Configurado' : '❌ Faltando',
      OPENAI_ASSISTANT_EXPERT_ID: process.env.OPENAI_ASSISTANT_EXPERT_ID ? '✅ Configurado' : '❌ Faltando',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Faltando',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Faltando',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurado' : '❌ Faltando'
    }

    console.log('📋 Variáveis de ambiente:', envVars)

    // 2. Testar OpenAI
    let openaiTest = { status: 'pending', error: null, assistants: [] }
    try {
      const OpenAI = require('openai')
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      console.log('🤖 Testando conexão com OpenAI...')
      const assistants = await openai.beta.assistants.list({ limit: 10 })
      
      openaiTest = {
        status: 'success',
        error: null,
        assistants: assistants.data.map(a => ({
          id: a.id,
          name: a.name,
          model: a.model
        }))
      }
      
      console.log('✅ OpenAI conectado com sucesso!')
    } catch (error) {
      openaiTest = {
        status: 'error',
        error: error.message,
        assistants: []
      }
      console.error('❌ Erro no OpenAI:', error.message)
    }

    // 3. Testar Supabase
    let supabaseTest = { status: 'pending', error: null }
    try {
      console.log('🗄️ Testando conexão com Supabase...')
      const { createClient } = require('@supabase/supabase-js')
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      // Testar conexão básica
      const { data, error } = await supabase.from('assistant_metrics').select('count').limit(1)
      
      if (error) {
        throw error
      }

      supabaseTest = {
        status: 'success',
        error: null
      }
      
      console.log('✅ Supabase conectado com sucesso!')
    } catch (error) {
      supabaseTest = {
        status: 'error',
        error: error.message
      }
      console.error('❌ Erro no Supabase:', error.message)
    }

    // 4. Verificar se os Assistant IDs existem
    let assistantValidation = { status: 'pending', details: {} }
    if (openaiTest.status === 'success') {
      const chatId = process.env.OPENAI_ASSISTANT_CHAT_ID
      const creatorId = process.env.OPENAI_ASSISTANT_CREATOR_ID
      const expertId = process.env.OPENAI_ASSISTANT_EXPERT_ID

      const foundAssistants = openaiTest.assistants.filter(a => 
        a.id === chatId || a.id === creatorId || a.id === expertId
      )

      assistantValidation = {
        status: foundAssistants.length === 3 ? 'success' : 'error',
        details: {
          chat: openaiTest.assistants.find(a => a.id === chatId) ? '✅ Encontrado' : '❌ Não encontrado',
          creator: openaiTest.assistants.find(a => a.id === creatorId) ? '✅ Encontrado' : '❌ Não encontrado',
          expert: openaiTest.assistants.find(a => a.id === expertId) ? '✅ Encontrado' : '❌ Não encontrado'
        }
      }
    }

    // 5. Resumo do diagnóstico
    const summary = {
      environment: Object.values(envVars).every(v => v.includes('✅')) ? '✅ OK' : '❌ Problemas',
      openai: openaiTest.status,
      supabase: supabaseTest.status,
      assistants: assistantValidation.status,
      overall: 'pending'
    }

    // Determinar status geral
    if (summary.environment === '✅ OK' && 
        openaiTest.status === 'success' && 
        supabaseTest.status === 'success' && 
        assistantValidation.status === 'success') {
      summary.overall = '✅ Sistema funcionando perfeitamente'
    } else {
      summary.overall = '❌ Problemas detectados'
    }

    console.log('📊 Resumo do diagnóstico:', summary)

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      summary,
      environment: envVars,
      openai: openaiTest,
      supabase: supabaseTest,
      assistants: assistantValidation,
      recommendations: generateRecommendations(summary, openaiTest, supabaseTest, assistantValidation)
    })

  } catch (error) {
    console.error('💥 Erro crítico no diagnóstico:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Erro crítico no diagnóstico',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

function generateRecommendations(summary, openaiTest, supabaseTest, assistantValidation) {
  const recommendations = []

  if (summary.environment !== '✅ OK') {
    recommendations.push('🔧 Configure todas as variáveis de ambiente necessárias')
  }

  if (openaiTest.status !== 'success') {
    recommendations.push('🤖 Verifique a API Key do OpenAI e a conexão com a internet')
  }

  if (supabaseTest.status !== 'success') {
    recommendations.push('🗄️ Verifique as credenciais do Supabase e execute o schema de métricas')
  }

  if (assistantValidation.status !== 'success') {
    recommendations.push('🎯 Verifique se os Assistant IDs estão corretos no OpenAI Platform')
  }

  if (recommendations.length === 0) {
    recommendations.push('🎉 Sistema funcionando perfeitamente! Pode testar o chat.')
  }

  return recommendations
}












