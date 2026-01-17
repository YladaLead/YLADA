import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

/**
 * API para montagem automática de vídeo
 * 
 * Recebe:
 * - script: Roteiro completo
 * - clips: Array de clips (imagens/vídeos)
 * - settings: Configurações (voz, transição, efeitos)
 * 
 * Retorna:
 * - videoUrl: URL do vídeo montado (ou preparado para renderização)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { script, clips, settings } = body

    if (!script || !clips || clips.length === 0) {
      return NextResponse.json(
        { error: 'Roteiro e clips são obrigatórios' },
        { status: 400 }
      )
    }

    // 1. Gerar narração do roteiro completo
    const fullScriptText = [
      script.hook,
      script.problem,
      script.solution,
      script.cta,
    ].filter(Boolean).join('. ')

    console.log('🎙️ Gerando narração...')
    const voiceResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: settings.voice || 'nova',
      input: fullScriptText,
      speed: settings.speed || 1.0,
    })

    const audioBuffer = Buffer.from(await voiceResponse.arrayBuffer())
    const audioBase64 = audioBuffer.toString('base64')
    const audioDataUrl = `data:audio/mpeg;base64,${audioBase64}`

    // 2. Criar legendas automáticas baseadas no roteiro
    const captions = []
    let currentTime = 0

    // Hook
    if (script.hook) {
      const hookDuration = 3 // 3 segundos
      captions.push({
        text: script.hook,
        startTime: currentTime,
        endTime: currentTime + hookDuration,
        style: 'hook',
        position: 'center',
        animation: 'fade-in',
      })
      currentTime += hookDuration
    }

    // Problema
    if (script.problem) {
      const problemDuration = 5
      captions.push({
        text: script.problem,
        startTime: currentTime,
        endTime: currentTime + problemDuration,
        style: 'dor',
        position: 'center',
        animation: 'slide-up',
      })
      currentTime += problemDuration
    }

    // Solução
    if (script.solution) {
      const solutionDuration = 7
      captions.push({
        text: script.solution,
        startTime: currentTime,
        endTime: currentTime + solutionDuration,
        style: 'solucao',
        position: 'center',
        animation: 'fade-in',
      })
      currentTime += solutionDuration
    }

    // CTA
    if (script.cta) {
      const ctaDuration = 3
      captions.push({
        text: script.cta,
        startTime: currentTime,
        endTime: currentTime + ctaDuration,
        style: 'cta',
        position: 'bottom',
        animation: 'zoom',
      })
    }

    // 3. Preparar dados para renderização
    // Por enquanto, retornamos os dados preparados
    // A renderização real será feita no cliente com Remotion ou similar

    return NextResponse.json({
      success: true,
      audioUrl: audioDataUrl,
      captions,
      clips: clips.map((clip: any, index: number) => ({
        ...clip,
        effect: settings.imageEffect || 'ken-burns',
        transition: settings.transition || 'fade',
        order: index,
      })),
      settings,
      duration: currentTime + 3, // Duração total estimada
      message: 'Vídeo preparado! Use o VideoExporter para renderizar.',
    })
  } catch (error: any) {
    console.error('Erro ao montar vídeo automático:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao montar vídeo' },
      { status: 500 }
    )
  }
}



