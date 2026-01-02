import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'
import { ScriptSegment } from '@/types/creative-studio'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
})

interface GenerateScriptRequest {
  topic: string
  duration: number
  style: 'educational' | 'entertaining' | 'promotional' | 'documentary'
  tone: 'casual' | 'formal' | 'energetic' | 'calm'
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body: GenerateScriptRequest = await request.json()

    if (!body.topic || body.topic.trim().length < 5) {
      return NextResponse.json(
        { error: 'Tópico deve ter pelo menos 5 caracteres' },
        { status: 400 }
      )
    }

    if (body.duration < 10 || body.duration > 600) {
      return NextResponse.json(
        { error: 'Duração deve estar entre 10 e 600 segundos' },
        { status: 400 }
      )
    }

    const systemPrompt = `Você é um especialista em criação de roteiros de vídeo altamente eficazes e envolventes. Você cria conteúdo que maximiza engajamento, retenção e compartilhamento.

PRINCÍPIOS DE ROTEIROS EFICAZES:
1. Hook forte nos primeiros 3-5 segundos
2. Estrutura clara e progressiva
3. Múltiplos pontos de interesse
4. Call to action claro no final
5. Tom apropriado para o estilo ${body.style}`

    const styleInstructions: Record<string, string> = {
      educational: `ESTILO EDUCACIONAL:
- Foco em ENSINAR e EXPLICAR conceitos claramente
- Use exemplos práticos e analogias
- Estruture: Problema → Solução → Aplicação
- Use linguagem didática mas acessível
- Inclua "como fazer" e "passo a passo"`,
      entertaining: `ESTILO ENTERTENIMENTO:
- Foco em DIVERTIR e ENGAJAR emocionalmente
- Use humor, surpresas e momentos "wow"
- Estruture: Hook impactante → Desenvolvimento divertido → Clímax emocional
- Use linguagem descontraída e expressiva`,
      promotional: `ESTILO PROMOCIONAL:
- Foco em VENDER e CRIAR DESEJO
- Use gatilhos mentais: escassez, autoridade, prova social
- Estruture: Problema/Dor → Solução/Benefício → Prova → CTA
- Use linguagem persuasiva e que desperte desejo`,
      documentary: `ESTILO DOCUMENTÁRIO:
- Foco em CONTAR HISTÓRIAS REAIS e AUTÊNTICAS
- Use narrativa envolvente e investigativa
- Estruture: Contexto → Desenvolvimento → Revelação → Reflexão
- Use linguagem informativa mas envolvente`,
    }

    const toneInstructions: Record<string, string> = {
      casual: 'TOM CASUAL: Conversacional e descontraído, como falar com um amigo',
      formal: 'TOM FORMAL: Profissional e respeitoso, adequado para audiências corporativas',
      energetic: 'TOM ENERGÉTICO: Animado e dinâmico, com alta energia e entusiasmo',
      calm: 'TOM CALMO: Tranquilo e sereno, ideal para conteúdo relaxante',
    }

    const userPrompt = `Crie um roteiro de vídeo com as seguintes especificações:

TÓPICO: ${body.topic}
DURAÇÃO TOTAL: ${body.duration} segundos
${styleInstructions[body.style]}
${toneInstructions[body.tone]}

IMPORTANTE:
- Divida o roteiro em segmentos de 5-15 segundos cada
- Cada segmento deve ter: texto, duração estimada, timestamp e tipo (intro/content/outro/transition)
- O primeiro segmento deve ser tipo "intro" (hook forte)
- O último segmento deve ser tipo "outro" (call to action)
- Segmentos intermediários devem ser tipo "content"
- Use transições (tipo "transition") quando necessário
- A soma de todas as durações deve ser aproximadamente ${body.duration} segundos

Retorne APENAS um JSON válido com este formato:
{
  "script": [
    {
      "id": "seg-1",
      "text": "Texto do segmento",
      "duration": 10,
      "timestamp": 0,
      "type": "intro"
    },
    ...
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(responseText)

    // Validar e formatar segmentos
    const segments: ScriptSegment[] = (parsed.script || []).map((seg: any, index: number) => ({
      id: seg.id || `seg-${index + 1}`,
      text: seg.text || '',
      duration: seg.duration || 5,
      timestamp: seg.timestamp ?? (index === 0 ? 0 : parsed.script.slice(0, index).reduce((acc: number, s: any) => acc + (s.duration || 5), 0)),
      type: seg.type || 'content',
    }))

    return NextResponse.json({ script: segments })
  } catch (error: any) {
    console.error('Erro ao gerar roteiro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar roteiro' },
      { status: 500 }
    )
  }
}

