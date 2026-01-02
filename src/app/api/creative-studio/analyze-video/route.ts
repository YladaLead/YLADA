import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const formData = await request.formData()
    const videoFile = formData.get('video') as File

    if (!videoFile) {
      return NextResponse.json(
        { error: 'Vídeo não fornecido' },
        { status: 400 }
      )
    }

    // Validar tamanho (máx 500MB - vamos extrair áudio depois)
    const maxSize = 500 * 1024 * 1024
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo: 500MB' },
        { status: 400 }
      )
    }

    // Processar arquivo: se for vídeo grande, vamos tentar usar diretamente
    // Whisper pode processar alguns formatos de vídeo, mas funciona melhor com áudio
    let fileForWhisper: File
    
    try {
      const arrayBuffer = await videoFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Criar File a partir do buffer
      // Se for vídeo, tentar usar diretamente (Whisper pode processar MP4, MOV, etc)
      fileForWhisper = new File([buffer], videoFile.name, { 
        type: videoFile.type || (videoFile.name.endsWith('.mp4') ? 'video/mp4' : 'audio/mpeg')
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Erro ao processar arquivo. Tente novamente.' },
        { status: 400 }
      )
    }

    // Transcrição com Whisper
    // Whisper aceita vídeo (extrai áudio automaticamente), mas tem limite de 25MB
    // Se o arquivo for maior, vamos tentar mesmo assim (pode funcionar)
    let transcriptionResponse
    try {
      transcriptionResponse = await openai.audio.transcriptions.create({
        file: fileForWhisper,
        model: 'whisper-1',
        language: 'pt',
        response_format: 'verbose_json',
      })
    } catch (whisperError: any) {
      console.error('Erro Whisper:', whisperError)
      
      // Se o arquivo for muito grande para Whisper, sugerir reduzir ou extrair áudio
      if (videoFile.size > 25 * 1024 * 1024) {
        return NextResponse.json(
          { 
            error: 'Arquivo muito grande para análise direta. Por favor, extraia o áudio do vídeo primeiro (o áudio será menor que 25MB) ou reduza o vídeo.',
            suggestion: 'Use ferramentas como FFmpeg ou conversores online para extrair apenas o áudio do vídeo.'
          },
          { status: 400 }
        )
      }
      
      // Outros erros
      if (whisperError.message?.includes('format') || whisperError.message?.includes('audio')) {
        return NextResponse.json(
          { error: 'Formato não suportado. Por favor, envie um arquivo de áudio (MP3, WAV) ou vídeo em formato compatível (MP4, MOV).' },
          { status: 400 }
        )
      }
      
      throw whisperError
    }

    const transcription = transcriptionResponse.text
    const duration = transcriptionResponse.duration || 0

    // Análise do roteiro com GPT
    const analysisPrompt = `Analise este roteiro de vídeo de vendas para nutricionistas e forneça:

1. ESTRUTURA DO ROTEIRO: Identifique cada segmento (Hook, Problema, Solução, Benefícios, CTA) com timestamps aproximados
2. SUGESTÕES DE OTIMIZAÇÃO: Pelo menos 3 sugestões específicas para melhorar conversão

IMPORTANTE: 
- NÃO use asteriscos (**) ou markdown nas sugestões
- Use apenas texto simples e claro
- Títulos devem ser diretos e objetivos

Roteiro:
"${transcription}"

Retorne em JSON com este formato:
{
  "scriptStructure": [
    {
      "type": "Hook|Problema|Solução|Benefícios|CTA",
      "text": "trecho do texto",
      "timestamp": "0-15s"
    }
  ],
  "suggestions": [
    {
      "title": "Título da sugestão (sem asteriscos, sem markdown)",
      "description": "Descrição detalhada e prática (sem asteriscos, sem markdown)"
    }
  ]
}`

    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em copywriting e vídeos de vendas. Analise roteiros e forneça sugestões práticas de otimização.',
        },
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const analysisText = analysisResponse.choices[0]?.message?.content || '{}'
    const analysis = JSON.parse(analysisText)

    // Upload do vídeo para Supabase Storage (opcional - pode ser feito depois)
    // Por enquanto, retornamos apenas a análise

    return NextResponse.json({
      transcription,
      duration,
      scriptStructure: analysis.scriptStructure || [],
      suggestions: analysis.suggestions || [],
      fileName: videoFile.name,
    })
  } catch (error: any) {
    console.error('Erro ao analisar vídeo:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao analisar vídeo' },
      { status: 500 }
    )
  }
}

