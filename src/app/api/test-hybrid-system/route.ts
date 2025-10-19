import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificar variáveis de ambiente
    const envCheck = {
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      OPENAI_ASSISTANT_CHAT_ID: !!process.env.OPENAI_ASSISTANT_CHAT_ID,
      OPENAI_ASSISTANT_CREATOR_ID: !!process.env.OPENAI_ASSISTANT_CREATOR_ID,
      OPENAI_ASSISTANT_EXPERT_ID: !!process.env.OPENAI_ASSISTANT_EXPERT_ID,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }

    // Verificar se todas as variáveis estão configuradas
    const missingVars = Object.entries(envCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Variáveis de ambiente faltando',
        missing: missingVars,
        envCheck
      }, { status: 500 })
    }

    // Testar conexão com OpenAI
    try {
      const OpenAI = require('openai')
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      // Testar se consegue listar assistentes
      const assistants = await openai.beta.assistants.list({ limit: 5 })
      
      return NextResponse.json({
        status: 'success',
        message: 'Sistema híbrido funcionando',
        envCheck,
        assistants: {
          total: assistants.data.length,
          ids: assistants.data.map(a => a.id)
        },
        hybridSystem: {
          chatAssistant: process.env.OPENAI_ASSISTANT_CHAT_ID,
          creatorAssistant: process.env.OPENAI_ASSISTANT_CREATOR_ID,
          expertAssistant: process.env.OPENAI_ASSISTANT_EXPERT_ID
        }
      })
    } catch (openaiError) {
      return NextResponse.json({
        status: 'error',
        message: 'Erro na conexão com OpenAI',
        error: openaiError.message,
        envCheck
      }, { status: 500 })
    }

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Erro interno',
      error: error.message
    }, { status: 500 })
  }
}

