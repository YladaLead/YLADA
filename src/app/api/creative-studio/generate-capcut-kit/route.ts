import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import OpenAI from 'openai'
import { identifyDor, getDorMapping, getImagePromptForDor } from '@/lib/creative-studio/dor-mapper'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface CapCutKitRequest {
  objective: string
  area?: 'nutri' | 'coach' | 'wellness' | 'nutra'
  duration?: number // em segundos
  style?: 'quick-ad' | 'sales-page' | 'educational' | 'testimonial'
}

interface Scene {
  number: number
  type: 'hook' | 'problem' | 'solution' | 'cta'
  text: string
  duration: number
  startTime: number
  endTime: number
  imagePrompt: string
  imageSearchTerms: string[]
  transition?: string
  effects?: string[]
  notes?: string
}

interface CapCutKit {
  script: {
    title: string
    totalDuration: number
    scenes: Scene[]
    narration: string // texto completo para narração
  }
  images: {
    sceneNumber: number
    prompt: string
    searchTerms: string[]
    source: 'chatgpt' | 'envato' | 'pexels'
    notes: string
  }[]
  capcutInstructions: {
    projectSettings: {
      aspectRatio: string
      resolution: string
      frameRate: number
    }
    timeline: {
      sceneNumber: number
      imageDuration: number
      transition: string
      effects: string[]
      textOverlay?: {
        text: string
        style: string
        position: string
        timing: string
      }
    }[]
    audio: {
      narration: string
      backgroundMusic?: string
      soundEffects?: string[]
    }
    export: {
      format: string
      resolution: string
      quality: string
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body: CapCutKitRequest = await request.json()
    const { objective, area = 'nutri', duration = 30, style = 'quick-ad' } = body

    if (!objective) {
      return NextResponse.json({ error: 'Objetivo é obrigatório' }, { status: 400 })
    }

    // Configuração por área
    const areaConfigs: Record<string, any> = {
      nutri: {
        product: 'YLADA NUTRI',
        description: 'plataforma completa para nutricionistas',
        professionals: 'nutricionistas',
        painPoints: ['agenda vazia', 'dificuldade em atrair clientes', 'falta de sistema de gestão'],
        solutions: ['lotar agenda', 'aumentar vendas', 'sistema completo de gestão'],
        ctaUrl: '/pt/nutri',
      },
      coach: {
        product: 'YLADA COACH',
        description: 'plataforma completa para personal trainers',
        professionals: 'personal trainers',
        painPoints: ['poucos clientes', 'dificuldade em reter alunos'],
        solutions: ['mais clientes', 'sistema de treinamento'],
        ctaUrl: '/pt/coach',
      },
      wellness: {
        product: 'YLADA WELLNESS',
        description: 'plataforma completa de bem-estar',
        professionals: 'profissionais de bem-estar',
        painPoints: ['falta de estrutura', 'dificuldade em organizar programas'],
        solutions: ['programa completo', 'ferramentas de gestão'],
        ctaUrl: '/pt/wellness',
      },
    }

    const config = areaConfigs[area] || areaConfigs.nutri

    // Estrutura baseada no estilo
    const styleStructures: Record<string, any> = {
      'quick-ad': {
        hook: { duration: 5, weight: 1 },
        problem: { duration: 10, weight: 2 },
        solution: { duration: 10, weight: 2 },
        cta: { duration: 5, weight: 1 },
      },
      'sales-page': {
        hook: { duration: 8, weight: 1 },
        problem: { duration: 25, weight: 3 },
        solution: { duration: 50, weight: 4 },
        cta: { duration: 12, weight: 1 },
      },
      'educational': {
        hook: { duration: 5, weight: 1 },
        problem: { duration: 20, weight: 2 },
        solution: { duration: 30, weight: 3 },
        cta: { duration: 5, weight: 1 },
      },
    }

    const structure = styleStructures[style] || styleStructures['quick-ad']
    const totalWeight = Object.values(structure).reduce((sum: number, s: any) => sum + s.weight, 0)
    
    // Ajustar durações para o tempo total desejado
    const adjustedStructure = Object.entries(structure).reduce((acc: any, [key, value]: [string, any]) => {
      acc[key] = {
        ...value,
        duration: Math.round((value.weight / totalWeight) * duration),
      }
      return acc
    }, {})

    // Gerar roteiro completo com GPT
    const systemPrompt = `Você é um ESPECIALISTA EM ROTEIROS DE VÍDEO para anúncios de ${config.product}.

PRODUTO: ${config.product}
- ${config.description}
- Público-alvo: ${config.professionals}
- Dores principais: ${config.painPoints.join(', ')}
- Soluções: ${config.solutions.join(', ')}
- CTA URL: ${config.ctaUrl}

OBJETIVO DO VÍDEO: ${objective}

ESTRUTURA OBRIGATÓRIA:
1. HOOK (${adjustedStructure.hook.duration}s): Identificação imediata, impacto nos primeiros segundos
2. PROBLEMA (${adjustedStructure.problem.duration}s): Dor específica que ${config.professionals} enfrentam
3. SOLUÇÃO (${adjustedStructure.solution.duration}s): Como ${config.product} resolve o problema
4. CTA (${adjustedStructure.cta.duration}s): Chamada clara para ação

REGRAS:
- Texto direto, sem rodeios
- Linguagem natural para narração
- Foco em conversão
- Tom empático e profissional
- Duração total: ${duration} segundos

Retorne APENAS um JSON válido com este formato:
{
  "hook": "Texto do hook completo",
  "problem": "Texto do problema completo",
  "solution": "Texto da solução completa",
  "cta": "Texto do CTA completo"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Crie o roteiro completo para: ${objective}` },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const scriptData = JSON.parse(completion.choices[0]?.message?.content || '{}')

    // Construir cenas com prompts de imagem
    const scenes: Scene[] = []
    let currentTime = 0

    // Hook
    if (scriptData.hook) {
      const hookText = scriptData.hook
      const hookDor = identifyDor(hookText)
      const hookMapping = getDorMapping(hookDor)
      
      scenes.push({
        number: 1,
        type: 'hook',
        text: hookText,
        duration: adjustedStructure.hook.duration,
        startTime: currentTime,
        endTime: currentTime + adjustedStructure.hook.duration,
        imagePrompt: getImagePromptForDor(hookDor, hookText),
        imageSearchTerms: hookMapping.searchTerms,
        transition: 'fade-in',
        effects: ['zoom-in'],
        notes: 'Hook impactante - imagem deve chamar atenção imediatamente',
      })
      currentTime += adjustedStructure.hook.duration
    }

    // Problema
    if (scriptData.problem) {
      const problemText = scriptData.problem
      const problemDor = identifyDor(problemText)
      const problemMapping = getDorMapping(problemDor)
      
      scenes.push({
        number: 2,
        type: 'problem',
        text: problemText,
        duration: adjustedStructure.problem.duration,
        startTime: currentTime,
        endTime: currentTime + adjustedStructure.problem.duration,
        imagePrompt: getImagePromptForDor(problemDor, problemText),
        imageSearchTerms: problemMapping.searchTerms,
        transition: 'slide-left',
        effects: ['ken-burns'],
        notes: 'Mostrar a dor de forma realista, sem exagero',
      })
      currentTime += adjustedStructure.problem.duration
    }

    // Solução
    if (scriptData.solution) {
      const solutionText = scriptData.solution
      // Para solução, usar termos positivos
      const solutionMapping = {
        searchTerms: [
          'successful nutritionist',
          'happy professional',
          'full calendar',
          'busy schedule',
          'professional success',
          'sucesso profissional',
          'agenda cheia',
          'resultados positivos',
        ],
      }
      
      scenes.push({
        number: 3,
        type: 'solution',
        text: solutionText,
        duration: adjustedStructure.solution.duration,
        startTime: currentTime,
        endTime: currentTime + adjustedStructure.solution.duration,
        imagePrompt: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada na SOLUÇÃO para uma nutricionista.

Contexto emocional:
- Sensação de sucesso e realização profissional
- Profissional competente com agenda cheia e resultados
- Ambiente profissional positivo (consultório ativo ou home office organizado)

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional (nutricionista / saúde)
- Expressão de satisfação e confiança (não exagerada)
- Consultório com clientes ou agenda cheia
- Iluminação natural, tons quentes e positivos

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`,
        imageSearchTerms: solutionMapping.searchTerms,
        transition: 'fade',
        effects: ['zoom-out'],
        notes: 'Mostrar transformação positiva, resultados alcançados',
      })
      currentTime += adjustedStructure.solution.duration
    }

    // CTA
    if (scriptData.cta) {
      scenes.push({
        number: 4,
        type: 'cta',
        text: scriptData.cta,
        duration: adjustedStructure.cta.duration,
        startTime: currentTime,
        endTime: currentTime + adjustedStructure.cta.duration,
        imagePrompt: `Crie uma imagem vertical 9:16 para anúncio no Instagram,
focada em CALL TO ACTION para ${config.product}.

Contexto emocional:
- Sensação de urgência e oportunidade
- Profissional decidida a tomar ação
- Ambiente profissional moderno

Descrição visual:
- Mulher entre 25 e 45 anos
- Estilo profissional
- Expressão de determinação e ação
- Elementos visuais que sugerem "começar agora"
- Iluminação natural, tons vibrantes

Estilo:
- Realista (não ilustrado)
- Fotografia profissional
- Qualidade alta
- Aparência de anúncio moderno
- Sem textos na imagem (texto será adicionado no CapCut)
- Sem marcas ou logos

Uso:
- Anúncio para redes sociais
- Público: nutricionistas no Brasil`,
        imageSearchTerms: ['call to action', 'button click', 'start now', 'action', 'decisão'],
        transition: 'zoom',
        effects: ['pulse'],
        notes: 'CTA claro - imagem deve reforçar a ação',
      })
    }

    // Construir kit completo
    const kit: CapCutKit = {
      script: {
        title: `Anúncio ${config.product} - ${objective}`,
        totalDuration: duration,
        scenes,
        narration: scenes.map(s => s.text).join(' '),
      },
      images: scenes.map(scene => ({
        sceneNumber: scene.number,
        prompt: scene.imagePrompt,
        searchTerms: scene.imageSearchTerms,
        source: scene.imageSearchTerms.length > 0 ? 'envato' : 'chatgpt',
        notes: scene.notes || '',
      })),
      capcutInstructions: {
        projectSettings: {
          aspectRatio: '9:16',
          resolution: '1080x1920',
          frameRate: 30,
        },
        timeline: scenes.map(scene => ({
          sceneNumber: scene.number,
          imageDuration: scene.duration,
          transition: scene.transition || 'fade',
          effects: scene.effects || [],
          textOverlay: {
            text: scene.text,
            style: scene.type === 'hook' ? 'bold-large' : scene.type === 'cta' ? 'bold-colored' : 'medium',
            position: scene.type === 'cta' ? 'bottom' : 'center',
            timing: `${scene.startTime}s - ${scene.endTime}s`,
          },
        })),
        audio: {
          narration: scenes.map(s => s.text).join(' '),
          backgroundMusic: 'Música suave e profissional (sem direitos autorais)',
          soundEffects: ['transition-swoosh', 'button-click'],
        },
        export: {
          format: 'MP4',
          resolution: '1080x1920',
          quality: 'High',
        },
      },
    }

    return NextResponse.json({ success: true, kit })
  } catch (error: any) {
    console.error('Erro ao gerar kit CapCut:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar kit CapCut' },
      { status: 500 }
    )
  }
}

