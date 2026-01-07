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
  campaignType?: string
  ctaType?: string
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
      voiceStyle?: string
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
    // Duração padrão: 15-20s (múltiplas cenas de 3s cada) - transições rápidas
    // O sistema divide automaticamente textos longos em cenas de 3s
    const { objective, area = 'nutri', duration = 18, style = 'quick-ad', campaignType, ctaType } = body

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

    // Estrutura baseada no estilo - TRANSIÇÕES RÁPIDAS (2-3s por cena)
    // Cada segmento será dividido em múltiplas cenas de 2-3s se necessário
    const styleStructures: Record<string, any> = {
      'quick-ad': {
        hook: { duration: 3, weight: 1, sceneDuration: 3 }, // 3s por cena
        problem: { duration: 3, weight: 1, sceneDuration: 3 },
        solution: { duration: 3, weight: 1, sceneDuration: 3 },
        cta: { duration: 3, weight: 1, sceneDuration: 3 },
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

    // Mapear CTAs baseado no tipo selecionado
    const ctaMapping: Record<string, { phrases: string[], description: string, url?: string }> = {
      'pagina-descoberta': {
        phrases: [
          'Descubra se isso faz sentido pra você',
          'Veja como funciona',
          'Entre e explore',
          'Descubra se encaixa no seu momento'
        ],
        description: 'Página leve, explicativa, sem pressão - para tráfego frio',
        url: '/pt/nutri/descobrir'
      },
      'whatsapp': {
        phrases: [
          'Fale com alguém que entende sua rotina',
          'Converse com a gente',
          'Explique sua situação',
          'Fale com quem já passou por isso'
        ],
        description: 'Atendimento humanizado - para dores emocionais profundas',
        url: 'WhatsApp (configurar número)'
      },
      'pagina-ylada': {
        phrases: [
          'Descubra o YLADA',
          'Veja por dentro',
          'Entenda o conceito',
          'Conheça o YLADA'
        ],
        description: 'Descoberta + convite - para curiosidade',
        url: '/pt/nutri'
      },
      'aula-apresentacao': {
        phrases: [
          'Participe da apresentação gratuita',
          'Assista à apresentação estratégica',
          'Participe do encontro de clareza',
          'Veja a apresentação gratuita'
        ],
        description: 'Apresentação estratégica gratuita - clareza sem venda',
        url: 'Página de inscrição (criar)'
      },
      'pagina-venda': {
        phrases: [
          'Comece agora',
          'Transforme sua carreira',
          'Acesse e comece hoje',
          'Comece sua transformação'
        ],
        description: 'Venda direta - para remarketing',
        url: '/pt/nutri/checkout'
      }
    }

    const selectedCTA = ctaType ? ctaMapping[ctaType] : null
    const ctaInstructions = selectedCTA 
      ? `CTA ESPECÍFICO PARA ${ctaType?.toUpperCase()}: ${selectedCTA.description}
${selectedCTA.url ? `URL de destino: ${selectedCTA.url} (NÃO mencione na narração, apenas direcione para o botão)` : ''}
Use uma dessas frases: ${selectedCTA.phrases.join(', ')}
NUNCA mencione URLs ou links na narração. O botão do Instagram já leva para a página.`
      : 'CTA: Descoberta honesta - "Descubra se faz sentido", sem promessas vazias'

    // Mapear dores baseado no tipo de campanha
    const campaignDores: Record<string, string[]> = {
      'agenda-vazia': ['agenda vazia', 'poucos clientes', 'dependência de indicações'],
      'muito-esforco': ['sobrecarga', 'múltiplas tarefas', 'trabalho sem resultado'],
      'confusao': ['falta de direção', 'incerteza', 'não sabe por onde começar'],
      'cansaco-mental': ['burnout', 'estresse', 'sobrecarga mental'],
      'solidao-profissional': ['solidão', 'trabalho sozinha', 'falta de apoio'],
      'curiosidade': ['quer entender', 'curiosidade', 'conceito novo'],
      'remarketing': ['já visitou', 'precisa de impulso', 'dúvida final']
    }

    const specificDores = campaignType && campaignDores[campaignType] 
      ? campaignDores[campaignType] 
      : config.painPoints

    // Gerar roteiro completo com GPT - VERSÃO HIGH CONVERSION
    const systemPrompt = `Você é um ESPECIALISTA EM PSICOLOGIA DE CONVERSÃO para anúncios de ${config.product} no INSTAGRAM.

PRODUTO: ${config.product}
- ${config.description}
- Público-alvo: ${config.professionals}
- Dores específicas desta campanha: ${specificDores.join(', ')}

OBJETIVO DO VÍDEO: ${objective}
${campaignType ? `TIPO DE CAMPANHA: ${campaignType}` : ''}
${ctaType ? `DESTINO/CTA: ${ctaType}` : ''}

ESTRUTURA OBRIGATÓRIA (PSICOLOGIA DE CONVERSÃO):
1. HOOK (${adjustedStructure.hook.duration}s): Identificação rápida em 3-4s, não repita a dor
2. PROBLEMA (${adjustedStructure.problem.duration}s): Quebra de culpa - "Não é falta de competência, é falta de direção"
3. SOLUÇÃO (${adjustedStructure.solution.duration}s): Quebra de crença + mistério - não explique demais, mantenha curiosidade
4. CTA (${adjustedStructure.cta.duration}s): Descoberta honesta - "Descubra se faz sentido", sem promessas vazias

REGRAS CRÍTICAS DE CONVERSÃO:

🔥 HOOK IDENTITÁRIO (MÁXIMO 6s total - REGRA DE OURO):
- A palavra "${config.professionals}" DEVE aparecer nos primeiros 3 segundos (primeira cena)
- NÃO comece genérico: "Você olha pra sua agenda..." (qualquer profissional se identifica)
- SEMPRE comece com identificação: "${config.professionals}" + dor + situação cotidiana
- Exemplos OBRIGATÓRIOS para ${config.product}:
  ✅ "Você é ${config.professionals === 'nutricionistas' ? 'nutricionista' : config.professionals} e olha pra sua agenda..."
  ✅ "${config.professionals === 'nutricionistas' ? 'Nutricionista' : config.professionals}, sua agenda continua vazia?"
  ✅ "Você é ${config.professionals === 'nutricionistas' ? 'nutricionista' : config.professionals}, atende bem... mas a agenda não enche?"
- NÃO repita a dor por 9 segundos
- Identifique a persona em 3s, depois vá para o próximo ponto
- Exemplo bom: "Você é ${config.professionals === 'nutricionistas' ? 'nutricionista' : config.professionals} e olha pra sua agenda..." (3s) + "e ela continua vazia?" (3s)

💡 PROBLEMA (Quebra de Culpa):
- NÃO diga: "desafio de atrair clientes" (genérico demais)
- DIGA: "Não é falta de competência. É falta de direção."
- Remova a culpa da pessoa
- Crie identificação, não vergonha

🎯 SOLUÇÃO (Quebra de Crença + Mistério):
- NÃO explique como funciona (mata curiosidade)
- NÃO use linguagem genérica: "lotar agenda", "aumentar vendas", "sistema completo"
- DIGA: "Nutricionistas não precisam trabalhar mais. Precisam trabalhar com sistema."
- Crie mistério: "Não é um curso. Não é só uma ferramenta. É um apoio estratégico."
- NÃO prometa demais, mantenha curiosidade

✅ CTA (Descoberta Honesta):
${ctaInstructions}
- NUNCA mencione URLs ou links
- NÃO seja vendedor: "Transforme sua carreira agora!" (promessa vazia)
- Menos promessa, mais descoberta

REGRAS GERAIS:
- Evite linguagem genérica de marketing
- Menos explicação = mais curiosidade
- Menos promessa = mais descoberta
- Texto natural para narração
- Tom empático, não vendedor
- Duração total: ${duration} segundos
- Formato: Instagram Reels/Stories (vertical 9:16)

EXEMPLOS DE FRASES A EVITAR (genéricas demais):
❌ "lotar sua agenda"
❌ "aumentar suas vendas"
❌ "sistema de gestão completo"
❌ "transforme sua carreira"
❌ "resultados garantidos"

EXEMPLOS DE FRASES FORTES (específicas e curiosas):
✅ "Você é ${config.professionals === 'nutricionistas' ? 'nutricionista' : config.professionals} e olha pra sua agenda..."
✅ "Não é falta de competência. É falta de direção."
✅ "${config.professionals === 'nutricionistas' ? 'Nutricionistas' : config.professionals} não precisam trabalhar mais. Precisam trabalhar com sistema."
✅ "Não é um curso. Não é só uma ferramenta."
✅ "Descubra se faz sentido pra você."

Retorne APENAS um JSON válido com este formato:
{
  "hook": "Texto do hook completo (máximo 6s, DEVE começar com '${config.professionals === 'nutricionistas' ? 'Você é nutricionista' : config.professionals}' ou similar, direto e impactante)",
  "problem": "Texto do problema com quebra de culpa (não genérico)",
  "solution": "Texto da solução com mistério (não explique demais)",
  "cta": "Texto do CTA honesto (sem URLs, sem promessas vazias)"
}

⚠️ LEMBRE-SE: O hook DEVE mencionar "${config.professionals}" nos primeiros 3 segundos. NUNCA comece genérico.`

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

    // Função para dividir texto longo em cenas de 2-3 segundos
    const splitTextIntoScenes = (text: string, maxDuration: number, sceneDuration: number = 3): string[] => {
      const words = text.split(' ')
      const wordsPerSecond = 2.5 // Aproximadamente 2.5 palavras por segundo
      const wordsPerScene = Math.floor(sceneDuration * wordsPerSecond)
      
      if (words.length <= wordsPerScene) {
        return [text] // Texto cabe em uma cena
      }
      
      // Dividir em múltiplas cenas
      const scenes: string[] = []
      for (let i = 0; i < words.length; i += wordsPerScene) {
        const sceneWords = words.slice(i, i + wordsPerScene)
        scenes.push(sceneWords.join(' '))
      }
      return scenes
    }

    // Construir cenas com prompts de imagem
    const scenes: Scene[] = []
    let currentTime = 0
    let sceneNumber = 1
    const sceneDuration = 3 // 3 segundos por cena

    // Hook - dividir em cenas de 3s se necessário
    if (scriptData.hook) {
      const hookText = scriptData.hook
      const hookDor = identifyDor(hookText)
      const hookMapping = getDorMapping(hookDor)
      const hookScenes = splitTextIntoScenes(hookText, adjustedStructure.hook.duration, sceneDuration)
      
      hookScenes.forEach((sceneText, index) => {
        // Termos de busca específicos para nutricionistas no hook (sempre mostrar contexto de nutrição)
        const hookImageTerms = area === 'nutri' 
          ? [
              'nutritionist in clinic',
              'nutrition consultation room',
              'professional woman healthcare nutritionist',
              'dietitian looking at calendar',
              'nutritionist empty schedule',
              'nutritionist worried expression',
              'nutrition clinic professional',
              'dietitian consultation room empty'
            ]
          : hookMapping.searchTerms.length > 0 
            ? hookMapping.searchTerms 
            : ['professional looking worried', 'attention grabbing', 'question mark']
        
        scenes.push({
          number: sceneNumber++,
          type: 'hook',
          text: sceneText,
          duration: sceneDuration,
          startTime: currentTime,
          endTime: currentTime + sceneDuration,
          imagePrompt: '',
          imageSearchTerms: hookImageTerms,
          transition: 'cut',
          effects: [],
          notes: index === 0 ? 'Hook impactante - trocar imagem a cada 3s' : 'Continuar hook - trocar imagem',
        })
        currentTime += sceneDuration
      })
    }

    // Problema - dividir em cenas de 3s se necessário
    if (scriptData.problem) {
      const problemText = scriptData.problem
      const problemDor = identifyDor(problemText)
      const problemMapping = getDorMapping(problemDor)
      const problemScenes = splitTextIntoScenes(problemText, adjustedStructure.problem.duration, sceneDuration)
      
      problemScenes.forEach((sceneText, index) => {
        // Termos de busca específicos para nutricionistas no problema
        const problemImageTerms = area === 'nutri'
          ? [
              'frustrated nutritionist',
              'nutritionist empty calendar',
              'dietitian no clients',
              'nutritionist looking worried',
              'nutrition clinic empty',
              'nutritionist professional frustration'
            ]
          : problemMapping.searchTerms.length > 0 
            ? problemMapping.searchTerms 
            : ['frustrated professional', 'empty calendar', 'no clients']
        
        scenes.push({
          number: sceneNumber++,
          type: 'problem',
          text: sceneText,
          duration: sceneDuration,
          startTime: currentTime,
          endTime: currentTime + sceneDuration,
          imagePrompt: '',
          imageSearchTerms: problemImageTerms,
          transition: 'cut',
          effects: [],
          notes: index === 0 ? 'Mostrar a dor - trocar imagem a cada 3s' : 'Continuar problema - trocar imagem',
        })
        currentTime += sceneDuration
      })
    }

    // Solução - dividir em cenas de 3s se necessário
    if (scriptData.solution) {
      const solutionText = scriptData.solution
      const solutionMapping = {
        searchTerms: [
          'successful nutritionist',
          'happy professional woman',
          'confident businesswoman',
          'full calendar schedule',
          'busy schedule professional',
          'professional success',
          'nutritionist with clients',
          'dietitian consultation room',
          'nutrition clinic busy',
          'happy nutritionist',
          'dashboard analytics growth',
          'platform software success',
          'business growth chart',
        ],
      }
      const solutionScenes = splitTextIntoScenes(solutionText, adjustedStructure.solution.duration, sceneDuration)
      
      solutionScenes.forEach((sceneText, index) => {
        scenes.push({
          number: sceneNumber++,
          type: 'solution',
          text: sceneText,
          duration: sceneDuration,
          startTime: currentTime,
          endTime: currentTime + sceneDuration,
          imagePrompt: '',
          imageSearchTerms: solutionMapping.searchTerms,
          transition: 'cut',
          effects: [],
          notes: index === 0 ? 'Mostrar solução - trocar imagem a cada 3s' : 'Continuar solução - trocar imagem',
        })
        currentTime += sceneDuration
      })
    }

    // CTA - dividir em cenas de 3s se necessário
    if (scriptData.cta) {
      const ctaText = scriptData.cta
      const ctaScenes = splitTextIntoScenes(ctaText, adjustedStructure.cta.duration, sceneDuration)
      
      ctaScenes.forEach((sceneText, index) => {
        scenes.push({
          number: sceneNumber++,
          type: 'cta',
          text: sceneText,
          duration: sceneDuration,
          startTime: currentTime,
          endTime: currentTime + sceneDuration,
          imagePrompt: '',
          imageSearchTerms: [
            'call to action button',
            'sign up button',
            'get started button',
            'click here arrow',
            'action button green',
            'register now',
            'start now button',
          ],
          transition: 'cut',
          effects: [],
          notes: index === 0 ? 'CTA claro - trocar imagem a cada 3s' : 'Continuar CTA - trocar imagem',
        })
        currentTime += sceneDuration
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
        prompt: '', // Sempre usar Envato, não criar com IA
        searchTerms: scene.imageSearchTerms,
        source: 'envato', // SEMPRE Envato
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
            position: scene.type === 'cta' ? 'bottom' : scene.type === 'hook' ? 'top' : 'center',
            timing: `${scene.startTime}s - ${scene.endTime}s`,
            color: scene.type === 'cta' ? '#00C853' : '#FFFFFF',
            backgroundColor: scene.type === 'hook' ? 'rgba(0,0,0,0.7)' : 'transparent',
            fontSize: scene.type === 'hook' ? '32px' : scene.type === 'cta' ? '28px' : '24px',
          },
        })),
        audio: {
          narration: scenes.map(s => s.text).join(' '),
          backgroundMusic: 'Música suave e profissional, estilo "upbeat business" ou "corporate motivational" (sem direitos autorais). Volume: 30% para não sobrepor a voz.',
          soundEffects: ['transition-swoosh', 'button-click'],
          voiceStyle: 'Tom entusiasmado, confiante e profissional. Velocidade: 1.0x a 1.1x (ligeiramente acelerado para manter atenção).',
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

