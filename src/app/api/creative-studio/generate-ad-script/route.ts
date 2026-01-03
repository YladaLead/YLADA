import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
})

function getAreaConfig(area: string) {
  const configs: Record<string, any> = {
    nutri: {
      product: 'YLADA NUTRI',
      painPoints: [
        'agenda vazia',
        'dificuldade para captar clientes',
        'falta de organização',
        'dependência de indicações',
      ],
      solutions: [
        'ferramentas de captação automática',
        'organização completa da rotina',
        'templates prontos para usar',
        'sistema de gestão integrado',
      ],
      ctaUrl: '/pt/nutri',
      tone: 'empático e profissional',
    },
    coach: {
      product: 'YLADA COACH',
      painPoints: ['falta de clientes', 'dificuldade em escalar'],
      solutions: ['automação', 'ferramentas prontas'],
      ctaUrl: '/pt/coach',
      tone: 'motivacional',
    },
  }
  return configs[area] || configs.nutri
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { area, purpose, objective } = body

    const areaConfig = getAreaConfig(area)

    const systemPrompt = `Você é um ESPECIALISTA EM ANÚNCIOS INSTAGRAM ADS para vender YLADA NUTRI.

OBJETIVO ÚNICO: Criar anúncio que VENDE YLADA NUTRI para nutricionistas com agenda vazia.

PÚBLICO-ALVO:
- Nutricionistas
- Agenda vazia ou poucos clientes
- Frustradas com falta de resultados
- Precisam de ferramentas para captar clientes

PRODUTO: YLADA NUTRI
- Plataforma completa para nutricionistas
- Organiza rotina
- Ensina captação
- Ajuda a construir agenda cheia
- URL: /pt/nutri

ESTRUTURA OBRIGATÓRIA (25-30 segundos):
1. HOOK (0-5s): Identificação imediata - "Você está cansada de ver sua agenda vazia?"
2. PROBLEMA (5-15s): Dor específica - agenda vazia, falta de clientes, frustração
3. SOLUÇÃO (15-25s): YLADA NUTRI resolve - organiza, ensina captação, agenda cheia
4. CTA (25-30s): "Acesse /pt/nutri agora e comece a mudar sua história"

CENAS:
- Cada cena: número, startTime, endTime, text, imageDescription
- imageDescription ESPECÍFICA: "nutricionista preocupada olhando agenda vazia"
- Total: 4-7 cenas
- Duração: 25-30 segundos

TOM: Empático, profissional, direto ao ponto
ESTILO: Instagram Reels/Stories - vertical 9:16, cortes rápidos, texto animado`

    const userPrompt = `Crie um roteiro COMPLETO de anúncio Instagram Ads para VENDER YLADA NUTRI.

OBJETIVO: ${objective || 'Vender YLADA NUTRI para nutricionistas com agenda vazia'}

DORES DO PÚBLICO:
- Agenda vazia
- Dificuldade para captar clientes
- Falta de organização
- Dependência de indicações
- Frustração com resultados

SOLUÇÕES (YLADA NUTRI):
- Organiza rotina completa
- Ensina captação de clientes
- Ferramentas prontas para usar
- Sistema de gestão integrado
- Ajuda a construir agenda cheia

REGRAS ABSOLUTAS:
- Hook DEVE gerar identificação imediata
- Problema DEVE ser a dor da agenda vazia
- Solução DEVE mencionar YLADA NUTRI e benefícios
- CTA DEVE direcionar para /pt/nutri
- Texto curto, direto, persuasivo
- Imagens devem ser específicas e emocionais

Retorne APENAS JSON válido:
{
  "hook": "Texto do hook impactante (0-5s)",
  "problem": "Texto do problema/dor (5-15s)",
  "solution": "Texto da solução YLADA NUTRI (15-25s)",
  "cta": "Texto do CTA com /pt/nutri (25-30s)",
  "scenes": [
    {
      "number": 1,
      "startTime": 0,
      "endTime": 5,
      "text": "Texto exato da cena",
      "imageDescription": "Descrição ESPECÍFICA da imagem (ex: nutricionista preocupada olhando agenda vazia)"
    }
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

    return NextResponse.json({ script: parsed })
  } catch (error: any) {
    console.error('Erro ao gerar roteiro de anúncio:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar roteiro' },
      { status: 500 }
    )
  }
}

