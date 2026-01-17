import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * API Route para gerar narração de voz usando OpenAI TTS
 * 
 * POST /api/creative-studio/generate-voice
 * 
 * Body:
 * {
 *   text: string,           // Texto para narrar
 *   voice?: string,          // 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' (default: 'alloy')
 *   model?: string,          // 'tts-1' | 'tts-1-hd' (default: 'tts-1')
 *   speed?: number          // 0.25 a 4.0 (default: 1.0)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { 
      text, 
      voice = 'alloy',  // Voz padrão: alloy (neutra, profissional)
      model = 'tts-1',  // Modelo padrão: tts-1 (mais rápido e barato)
      speed = 1.0       // Velocidade padrão: 1.0 (normal)
    } = body

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      )
    }

    // Validar voz
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
    if (!validVoices.includes(voice)) {
      return NextResponse.json(
        { error: `Voz inválida. Use uma das: ${validVoices.join(', ')}` },
        { status: 400 }
      )
    }

    // Validar modelo
    const validModels = ['tts-1', 'tts-1-hd']
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: `Modelo inválido. Use: ${validModels.join(' ou ')}` },
        { status: 400 }
      )
    }

    // Validar velocidade
    if (speed < 0.25 || speed > 4.0) {
      return NextResponse.json(
        { error: 'Velocidade deve estar entre 0.25 e 4.0' },
        { status: 400 }
      )
    }

    // Gerar áudio usando OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: model as 'tts-1' | 'tts-1-hd',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      speed: speed,
    })

    // Converter resposta para buffer
    const buffer = Buffer.from(await mp3.arrayBuffer())

    // Retornar áudio como base64 para facilitar uso no frontend
    const base64Audio = buffer.toString('base64')
    const dataUrl = `data:audio/mpeg;base64,${base64Audio}`

    // Calcular duração aproximada (assumindo ~150 palavras por minuto)
    const wordCount = text.split(/\s+/).length
    const estimatedDuration = (wordCount / 150) * 60 // em segundos

    return NextResponse.json({
      audio: dataUrl,
      audioBuffer: base64Audio, // Para uso direto
      duration: estimatedDuration,
      text: text,
      voice: voice,
      model: model,
      speed: speed,
      size: buffer.length,
      format: 'mp3',
    })
  } catch (error: any) {
    console.error('Erro ao gerar voz:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao gerar narração de voz',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

