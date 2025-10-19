import { NextRequest, NextResponse } from 'next/server'
import { yladaCache } from '@/lib/ylada-cache'

// Buscar templates populares por profissão
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession')
    const action = searchParams.get('action')

    if (action === 'stats') {
      // Retornar estatísticas do cache
      const stats = await yladaCache.getCacheStats()
      return NextResponse.json(stats)
    }

    if (action === 'clean') {
      // Limpar cache antigo
      await yladaCache.cleanOldCache()
      return NextResponse.json({ message: 'Cache limpo com sucesso' })
    }

    if (profession) {
      // Buscar templates populares por profissão
      const templates = await yladaCache.getPopularTemplatesByProfession(profession)
      return NextResponse.json(templates)
    }

    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })

  } catch (error) {
    console.error('Erro na API de cache:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Salvar template gerado
export async function POST(request: NextRequest) {
  try {
    const { 
      profession, 
      specialization, 
      objective, 
      toolType, 
      templateContent,
      successRate 
    } = await request.json()

    if (!profession || !specialization || !objective || !toolType || !templateContent) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    await yladaCache.saveGeneratedTemplate(
      profession,
      specialization,
      objective,
      toolType,
      templateContent,
      successRate
    )

    return NextResponse.json({ message: 'Template salvo com sucesso' })

  } catch (error) {
    console.error('Erro ao salvar template:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Atualizar taxa de sucesso do template
export async function PUT(request: NextRequest) {
  try {
    const { templateId, isSuccessful } = await request.json()

    if (!templateId || typeof isSuccessful !== 'boolean') {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    await yladaCache.updateTemplateSuccessRate(templateId, isSuccessful)

    return NextResponse.json({ message: 'Taxa de sucesso atualizada' })

  } catch (error) {
    console.error('Erro ao atualizar taxa de sucesso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
