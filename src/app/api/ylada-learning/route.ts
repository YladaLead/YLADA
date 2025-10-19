import { NextRequest, NextResponse } from 'next/server'
import { yladaLearning } from '@/lib/ylada-learning'

// Buscar insights de performance e relatórios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const profession = searchParams.get('profession')

    if (action === 'insights') {
      // Retornar insights de performance
      const insights = await yladaLearning.getPerformanceInsights()
      return NextResponse.json(insights)
    }

    if (action === 'report') {
      // Gerar relatório completo
      const report = await yladaLearning.generateLearningReport()
      return NextResponse.json(report)
    }

    if (action === 'patterns' && profession) {
      // Analisar padrões por profissão
      const patterns = await yladaLearning.analyzePatternsByProfession(profession)
      return NextResponse.json(patterns)
    }

    return NextResponse.json({ error: 'Ação não especificada' }, { status: 400 })

  } catch (error) {
    console.error('Erro na API de aprendizado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Salvar feedback e dados de aprendizado
export async function POST(request: NextRequest) {
  try {
    const { 
      userInput,
      userProfile,
      assistantResponse,
      userFeedback,
      successMetrics,
      templateId
    } = await request.json()

    if (templateId && userFeedback) {
      // Aprender com feedback específico de template
      await yladaLearning.learnFromFeedback(
        templateId,
        userFeedback,
        successMetrics
      )
      
      return NextResponse.json({ message: 'Feedback processado com sucesso' })
    }

    if (userInput && userProfile && assistantResponse) {
      // Salvar dados de aprendizado gerais
      await yladaLearning.saveLearningData(
        userInput,
        userProfile,
        assistantResponse,
        userFeedback || 'neutral',
        successMetrics || {}
      )
      
      return NextResponse.json({ message: 'Dados de aprendizado salvos' })
    }

    return NextResponse.json(
      { error: 'Dados obrigatórios não fornecidos' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro ao salvar dados de aprendizado:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
