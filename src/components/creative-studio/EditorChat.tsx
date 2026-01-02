'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, Video, Scissors, Zap, Plus, Check, X, RotateCcw, Lightbulb } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'

interface EditorChatProps {
  mode?: 'edit' | 'create'
  area?: 'nutri' | 'coach' | 'wellness' | 'nutra'
  purpose?: 'quick-ad' | 'sales-page' | 'educational' | 'testimonial' | 'custom'
  objective?: string
}

export function EditorChat({ mode = 'edit', area = 'nutri', purpose = 'quick-ad', objective = '' }: EditorChatProps) {
  const getInitialMessage = () => {
    if (mode === 'create') {
      return 'Olá! Sou seu assistente de criação de vídeos. 🎬\n\nMe diga o que você precisa e vou criar o vídeo completo para você!'
    }
    return 'Olá! Sou seu assistente de edição. Faça upload do seu vídeo e eu analiso automaticamente, ou clique em "Diagnosticar" para começar.'
  }

  const [messages, setMessages] = useState<Array<{ 
    role: 'user' | 'assistant'
    content: string
    images?: Array<{ id: string; url: string; thumbnail: string; source: string }>
    videos?: Array<{ id: string; url: string; thumbnail: string; source: string; duration?: number }>
  }>>([
    {
      role: 'assistant',
      content: getInitialMessage(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSearchingImages, setIsSearchingImages] = useState(false)
  const [isSearchingVideos, setIsSearchingVideos] = useState(false)
  const [searchStatus, setSearchStatus] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const authenticatedFetch = useAuthenticatedFetch()
  const { videoAnalysis, clips, script, uploadedVideo, setVideoAnalysis, setUploadedVideo, addClip, setClips, updateClip, setCurrentTime, setIsPlaying, addDynamicSuggestion, addSuggestedCut, clearSuggestedCuts, setSearching, addSearchImages, addSearchVideos, setSearchResults } = useCreativeStudioStore()
  const analyzedVideoRef = useRef<File | null>(null)

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement
      if (container) {
        // Verificar se o usuário está próximo do final (dentro de 100px)
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
        // Só fazer scroll automático se estiver próximo do final ou se for forçado
        if (isNearBottom || force) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  useEffect(() => {
    // Scroll automático apenas quando novas mensagens são adicionadas
    // e o usuário está próximo do final
    scrollToBottom()
  }, [messages.length]) // Apenas quando o número de mensagens muda

  // Ajustar altura do textarea quando o input mudar
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 400)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [input])

  // Detectar quando um novo vídeo é carregado e fazer análise automática
  useEffect(() => {
    // Detectar vídeo mesmo que não esteja na timeline ainda
    // O vídeo pode estar apenas na área de upload
    if (uploadedVideo && uploadedVideo !== analyzedVideoRef.current && !videoAnalysis && !isAnalyzing) {
      // Verificar se o arquivo ainda existe (não foi removido)
      if (uploadedVideo instanceof File && uploadedVideo.size > 0) {
        analyzedVideoRef.current = uploadedVideo
        
        // Informar ao usuário que detectou o vídeo
        setMessages((prev) => {
          // Evitar mensagem duplicada
          const lastMessage = prev[prev.length - 1]
          if (lastMessage?.content?.includes('Detectei um vídeo')) {
            return prev
          }
          return [
            ...prev,
            {
              role: 'assistant',
              content: `✅ Detectei o vídeo "${uploadedVideo.name}"! Iniciando análise automática...`,
            },
          ]
        })
        
        // Pequeno delay para garantir que o upload terminou
        setTimeout(() => {
          analyzeVideo(uploadedVideo)
        }, 300)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedVideo, videoAnalysis, isAnalyzing])

  const analyzeVideo = async (file: File) => {
    setIsAnalyzing(true)
    
    // Adicionar mensagem de análise em andamento
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: '🎬 Detectei um vídeo novo! Fazendo análise automática... Isso pode levar alguns segundos.',
      },
    ])

    try {
      const formData = new FormData()
      formData.append('video', file)

      const response = await authenticatedFetch('/api/creative-studio/analyze-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Erro ao analisar vídeo')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Salvar análise no store
      setVideoAnalysis({
        transcription: data.transcription || '',
        scriptStructure: data.scriptStructure || [],
        suggestions: data.suggestions || [],
      })

      // Adicionar mensagem com diagnóstico - formato melhorado sem asteriscos
      let diagnosticMessage = '✅ Análise concluída!\n\n'
      
      if (data.transcription) {
        const transcriptionPreview = data.transcription.length > 200 
          ? data.transcription.substring(0, 200) + '...'
          : data.transcription
        diagnosticMessage += `📝 Transcrição:\n${transcriptionPreview}\n\n`
      }
      
      if (data.suggestions && data.suggestions.length > 0) {
        diagnosticMessage += `💡 Sugestões de otimização (${data.suggestions.length}):\n\n`
        data.suggestions.slice(0, 3).forEach((sug: any, idx: number) => {
          // Formato: número. título (sem asteriscos)
          // Descrição na próxima linha com indentação
          diagnosticMessage += `${idx + 1}. ${sug.title}\n   ${sug.description}\n\n`
        })
        if (data.suggestions.length > 3) {
          diagnosticMessage += `... e mais ${data.suggestions.length - 3} sugestão(ões)\n\n`
        }
      }
      
      diagnosticMessage += 'Posso ajudar você a aplicar essas sugestões ou fazer outros ajustes. O que você gostaria de fazer?'
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: diagnosticMessage,
        },
      ])
    } catch (error: any) {
      console.error('Erro ao analisar vídeo:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Não consegui analisar o vídeo automaticamente: ${error.message || 'Erro desconhecido'}. Você pode me pedir para tentar novamente ou continuar editando.`,
        },
      ])
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSend = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim()
    if (!messageToSend || isLoading) return

    const userMessage = messageToSend
    if (!customMessage) {
      setInput('')
      // Resetar altura do textarea após limpar
      if (textareaRef.current) {
        textareaRef.current.style.height = '48px'
      }
    }
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Função auxiliar para limpar dados e evitar referências circulares
      const cleanData = (data: any, visited = new WeakSet(), depth = 0): any => {
        // Limitar profundidade para evitar loops infinitos
        if (depth > 10) return null
        
        if (data === null || data === undefined) return null
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') return data
        if (data instanceof Date) return data.toISOString()
        if (data instanceof File) return { name: data.name, size: data.size, type: data.type }
        
        // Detectar referências circulares ANTES de processar
        if (typeof data === 'object') {
          if (visited.has(data)) return null // Referência circular detectada
          visited.add(data)
        }
        
        // Detectar elementos DOM e objetos React ANTES de processar
        if (data instanceof HTMLElement || 
            data instanceof SVGElement || 
            data instanceof Element ||
            data instanceof Node) {
          return null
        }
        
        // Detectar objetos React Fiber por nome do construtor
        if (data && typeof data === 'object' && data.constructor) {
          const constructorName = data.constructor.name
          if (constructorName.includes('Fiber') || 
              constructorName.includes('React') ||
              constructorName.startsWith('HTML') ||
              constructorName === 'HTMLButtonElement' ||
              constructorName === 'HTMLDivElement' ||
              constructorName === 'HTMLInputElement') {
            return null
          }
        }
        
        if (Array.isArray(data)) {
          return data.map(item => cleanData(item, visited, depth + 1))
        }
        
        if (typeof data === 'object') {
          const cleaned: any = {}
          for (const key in data) {
            // Ignorar propriedades internas do React/DOM
            if (key.startsWith('__') || 
                key === 'stateNode' || 
                key.includes('react') || 
                key.includes('Fiber') ||
                key === 'ownerDocument' ||
                key === 'parentNode' ||
                key === 'childNodes' ||
                key === '__reactFiber' ||
                key === '__reactInternalInstance' ||
                key === '_reactInternalFiber') {
              continue
            }
            
            try {
              const value = data[key]
              
              // Ignorar funções
              if (typeof value === 'function') continue
              
              // Ignorar elementos DOM
              if (value instanceof HTMLElement || 
                  value instanceof SVGElement ||
                  value instanceof Element ||
                  value instanceof Node) {
                continue
              }
              
              // Ignorar objetos React por nome do construtor
              if (value && typeof value === 'object' && value.constructor) {
                const constructorName = value.constructor.name
                if (constructorName.includes('Fiber') || 
                    constructorName.includes('React') ||
                    constructorName.startsWith('HTML')) {
                  continue
                }
              }
              
              cleaned[key] = cleanData(value, visited, depth + 1)
            } catch (e) {
              // Ignorar propriedades que causam erro
              continue
            }
          }
          return cleaned
        }
        
        return null
      }

      // Construir contexto do vídeo (apenas dados serializáveis - SEM elementos DOM)
      const rawContext = {
        hasAnalysis: !!videoAnalysis,
        hasClips: clips.length > 0,
        hasScript: script.length > 0,
        hasVideo: !!uploadedVideo,
        videoFileName: uploadedVideo?.name || null,
        videoSize: uploadedVideo?.size || null,
        videoInTimeline: clips.some(c => c.type === 'video'),
        analysis: videoAnalysis
          ? {
              transcription: videoAnalysis.transcription || null,
              suggestions: Array.isArray(videoAnalysis.suggestions) 
                ? videoAnalysis.suggestions.map((s: any) => ({
                    title: typeof s.title === 'string' ? s.title : null,
                    description: typeof s.description === 'string' ? s.description : null,
                  }))
                : [],
              scriptStructure: Array.isArray(videoAnalysis.scriptStructure)
                ? videoAnalysis.scriptStructure.map((s: any) => ({
                    text: typeof s.text === 'string' ? s.text : null,
                    timestamp: typeof s.timestamp === 'string' ? s.timestamp : null,
                    type: typeof s.type === 'string' ? s.type : null,
                  }))
                : [],
            }
          : null,
      }

      // Limpar todo o contexto antes de serializar
      const context = cleanData(rawContext)

      // Adicionar timeout de 30 segundos para a requisição
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos
      
      // Preparar body com proteção extra
      let requestBody: any = {
        message: userMessage,
        context,
        mode, // Enviar o modo para o backend usar o prompt correto
        area, // Enviar a área (nutri/coach/wellness/nutra)
        purpose, // Enviar o propósito do vídeo
        objective, // Enviar objetivo customizado se houver
      }
      
      // Testar serialização antes de enviar
      let bodyString: string
      try {
        bodyString = JSON.stringify(requestBody)
      } catch (error) {
        console.error('Erro ao serializar requestBody, usando contexto mínimo:', error)
        // Se ainda houver erro, usar contexto mínimo
        requestBody = {
          message: userMessage,
          context: {
            hasAnalysis: !!videoAnalysis,
            hasClips: clips.length > 0,
            hasScript: script.length > 0,
          },
          mode,
          area,
          purpose,
          objective,
        }
        bodyString = JSON.stringify(requestBody)
      }

      const response = await authenticatedFetch('/api/creative-studio/editor-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyString,
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeoutId)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erro ${response.status}: Erro ao processar mensagem`)
      }

      const data = await response.json()
      let assistantMessage = data.response

      // Detectar se o assistente sugeriu imagens/vídeos na resposta e buscar automaticamente
      const imageKeywords = ['imagem', 'foto', 'fotos', 'imagens', 'visual', 'elemento visual', 'gráfico', 'gráficos', 'ilustração', 'ilustrações']
      const videoKeywords = ['vídeo', 'video', 'vídeos', 'videos', 'clip', 'clips', 'filmagem', 'gravação']
      
      // Detectar sugestões do assistente (mais importante)
      const assistantLower = assistantMessage.toLowerCase()
      
      // LÓGICA DE DECISÃO: BUSCAR vs CRIAR
      // Detectar se o assistente quer CRIAR (DALL-E) ou BUSCAR (web)
      const createPatterns = [
        /(?:vou\s+)?criar\s+(?:uma\s+)?(?:imagem|foto|gráfico|visual)/i,
        /(?:vou\s+)?gerar\s+(?:uma\s+)?(?:imagem|foto|gráfico|visual)/i,
        /(?:vou\s+)?criar\s+(?:com\s+)?(?:ia|dall-e|dalle)/i,
        /(?:vou\s+)?gerar\s+(?:com\s+)?(?:ia|dall-e|dalle)/i,
        /(?:imagem|foto|gráfico)\s+(?:personalizada|customizada|única|específica)/i,
        /(?:criar|gerar)\s+(?:logo|dashboard|interface|botão|infográfico)/i,
        /(?:ylada|marca|brand)\s+(?:logo|dashboard|interface|visual)/i,
      ]
      
      const shouldCreate = createPatterns.some(pattern => pattern.test(assistantMessage))
      
      // Detectar se o assistente quer BUSCAR na web
      const searchPatterns = [
        /vou\s+buscar\s+(?:imagens?|fotos?)/i,
        /buscar\s+(?:imagens?|fotos?)/i,
        /vou\s+adicionar\s+(?:imagens?|fotos?)/i,
        /vou\s+incluir\s+(?:imagens?|fotos?)/i,
        /vou\s+mostrar\s+(?:imagens?|fotos?)/i,
        /buscar\s+imagens?\s+(?:de|para|sobre)/i,
      ]
      
      const hasExplicitPattern = searchPatterns.some(pattern => pattern.test(assistantMessage))
      
      // Detecção por palavras-chave
      const hasImageKeyword = imageKeywords.some(keyword => assistantLower.includes(keyword))
      const hasActionKeyword = (
        assistantLower.includes('suger') ||
        assistantLower.includes('adicionar') ||
        assistantLower.includes('incluir') ||
        assistantLower.includes('buscar') ||
        assistantLower.includes('recomendo') ||
        assistantLower.includes('vou buscar') ||
        assistantLower.includes('vou adicionar') ||
        assistantLower.includes('vou incluir') ||
        assistantLower.includes('posso buscar') ||
        assistantLower.includes('posso adicionar') ||
        assistantLower.includes('vou mostrar') ||
        assistantLower.includes('encontrei') ||
        assistantLower.includes('encontre') ||
        assistantLower.includes('mostrar') ||
        assistantLower.includes('exibir') ||
        assistantLower.includes('usar') ||
        assistantLower.includes('inserir')
      )
      
      // Se tem padrão explícito OU (palavra de imagem + palavra de ação)
      const assistantSuggestsImages = hasExplicitPattern || (hasImageKeyword && hasActionKeyword)
      
      // Detectar se o usuário pediu explicitamente
      const userWantsImages = imageKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      )
      
      // Detectar sugestões de vídeos do assistente
      const assistantSuggestsVideos = videoKeywords.some(keyword => 
        assistantLower.includes(keyword)
      ) && (
        assistantLower.includes('suger') ||
        assistantLower.includes('adicionar') ||
        assistantLower.includes('incluir') ||
        assistantLower.includes('buscar') ||
        assistantLower.includes('recomendo') ||
        assistantLower.includes('vou buscar') ||
        assistantLower.includes('vou adicionar') ||
        assistantLower.includes('vou incluir') ||
        assistantLower.includes('posso buscar') ||
        assistantLower.includes('encontrei') ||
        assistantLower.includes('mostrar') ||
        assistantLower.includes('usar')
      )
      
      const userWantsVideos = videoKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      )
      
      // Buscar se assistente sugeriu OU usuário pediu (mas não se for para criar)
      const shouldSearchImages = (assistantSuggestsImages || userWantsImages) && !shouldCreate
      const shouldCreateImages = shouldCreate && (assistantSuggestsImages || userWantsImages)
      const shouldSearchVideos = assistantSuggestsVideos || userWantsVideos

      // Debug: verificar se está detectando corretamente
      if (assistantSuggestsImages || userWantsImages) {
        console.log('🔍 [DEBUG] Ação de imagens detectada:', {
          shouldSearchImages,
          shouldCreateImages,
          shouldCreate,
          assistantMessage: assistantMessage.substring(0, 100)
        })
      }

      let foundImages: Array<{ id: string; url: string; thumbnail: string; source: string }> = []
      let foundVideos: Array<{ id: string; url: string; thumbnail: string; source: string; duration?: number }> = []
      
      // Declarar searchQuery no escopo mais amplo para evitar erros de inicialização
      let searchQuery: string = ''

      // CRIAR imagem com DALL-E
      if (shouldCreateImages) {
        // Extrair prompt para criação
        let createPrompt = ''
        
        // Padrões para extrair o que criar
        const createPatterns = [
          /(?:criar|gerar)\s+(?:uma\s+)?(?:imagem|foto|gráfico|visual)\s+(?:de|com|para)?\s*([^.,!?]+)/i,
          /(?:criar|gerar)\s+(?:com\s+)?(?:ia|dall-e)\s+(?:uma\s+)?(?:imagem|foto|gráfico)?\s*(?:de|com|para)?\s*([^.,!?]+)/i,
          /(?:imagem|foto|gráfico)\s+(?:personalizada|customizada)\s+(?:de|com|para)?\s*([^.,!?]+)/i,
        ]
        
        for (const pattern of createPatterns) {
          const match = assistantMessage.match(pattern)
          if (match && match[1]) {
            createPrompt = match[1].trim()
            break
          }
        }
        
        // Se não encontrou, usar contexto geral
        if (!createPrompt || createPrompt.length < 3) {
          const importantKeywords = assistantMessage.match(/(?:ylada|nutri|dashboard|logo|interface|gráfico|botão|infográfico|personalizada|customizada)/gi)
          if (importantKeywords && importantKeywords.length > 0) {
            createPrompt = importantKeywords.slice(0, 3).join(' ')
          } else {
            // Extrair do contexto da conversa
            const userKeywords = userMessage.match(/(?:ylada|nutri|agenda|plataforma|dashboard)/gi)
            if (userKeywords && userKeywords.length > 0) {
              createPrompt = `${userKeywords.join(' ')} dashboard interface`
            } else {
              createPrompt = 'YLADA NUTRI dashboard interface with growth charts'
            }
          }
        }
        
        setIsSearchingImages(true)
        setSearchStatus('🎨 Criando imagem com IA...')
        setSearching(true, 'images', createPrompt)
        
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `🎨 Criando imagem personalizada: "${createPrompt}"...`,
          },
        ])
        
        try {
          const createResponse = await authenticatedFetch('/api/creative-studio/search-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: createPrompt,
              type: 'create',
              count: 1,
            }),
          })
          
          if (createResponse.ok) {
            const createData = await createResponse.json()
            if (createData.images && createData.images.length > 0) {
              foundImages = createData.images.map((img: any) => ({
                id: img.id || `dalle-${Date.now()}`,
                url: img.url,
                thumbnail: img.thumbnail || img.url,
                source: 'dalle',
              }))
              
              addSearchImages(foundImages)
              
              if (!assistantMessage.includes('🎨')) {
                assistantMessage += `\n\n🎨 Criei uma imagem personalizada! Veja na aba "Busca".`
              }
              
              setMessages((prev) => {
                return prev.filter(m => 
                  !m.content.includes('🎨 Criando imagem personalizada')
                )
              })
            }
          }
        } catch (error) {
          console.error('Erro ao criar imagem:', error)
          setMessages((prev) => [
            ...prev.filter(m => !m.content.includes('🎨 Criando imagem personalizada')),
            {
              role: 'assistant',
              content: '❌ Não consegui criar a imagem. Tente novamente.',
            },
          ])
        } finally {
          setIsSearchingImages(false)
          setSearchStatus(null)
          setSearching(false)
        }
      }
      
      // BUSCAR imagens na web
      if (shouldSearchImages) {
        // Extrair termos de busca - priorizar sugestões do assistente
        searchQuery = '' // Resetar para nova busca
        
        // Primeiro tentar extrair da mensagem do assistente (sugestões)
        if (assistantSuggestsImages) {
          // Padrões para extrair o que o assistente quer buscar
          const patterns = [
            /(?:imagem|foto|gráfico|visual)\s+(?:de|para|sobre|com)\s+([^.,!?]+)/i,
            /(?:adicionar|incluir|buscar|sugerir)\s+(?:imagem|foto|gráfico|visual)\s+(?:de|para|sobre)?\s*([^.,!?]+)/i,
            /(?:mostrar|exibir|usar)\s+([^.,!?]+)\s+(?:imagem|foto|gráfico|visual)/i,
          ]
          
          for (const pattern of patterns) {
            const match = assistantMessage.match(pattern)
            if (match && match[1]) {
              searchQuery = match[1].trim()
              break
            }
          }
          
          // Se não encontrou, tentar extrair contexto geral da sugestão
          if (!searchQuery || searchQuery.length < 3) {
            // Procurar por frases como "imagem de nutricionista", "gráfico de resultados", etc.
            const contextPatterns = [
              /(?:de|sobre|com)\s+([^.,!?]+?)(?:\s+(?:imagem|foto|gráfico|visual)|$)/i,
              /(?:nutricionista|resultado|agenda|dashboard|plataforma|consulta|paciente|cliente)/i,
            ]
            
            for (const pattern of contextPatterns) {
              const match = assistantMessage.match(pattern)
              if (match && match[1]) {
                searchQuery = match[1].trim()
                break
              }
            }
          }
          
          // Se ainda não encontrou e o assistente disse "vou buscar imagens", usar contexto da conversa
          if (!searchQuery || searchQuery.length < 3) {
            // Extrair palavras-chave importantes da mensagem do assistente
            const importantKeywords = assistantMessage.match(/(?:agenda|nutricionista|nutri|ylada|plataforma|consulta|paciente|cliente|vendas|carreira|transformar)/gi)
            if (importantKeywords && importantKeywords.length > 0) {
              searchQuery = importantKeywords.slice(0, 2).join(' ').toLowerCase()
            }
          }
        }
        
        // Se ainda não encontrou, tentar da mensagem do usuário
        if (!searchQuery || searchQuery.length < 3) {
          searchQuery = userMessage
          .toLowerCase()
          .replace(/(?:quero|preciso|buscar|adicionar|incluir|colocar|usar|adicionar|inserir)\s+/g, '')
          .replace(/(?:imagem|foto|fotos|imagens|visual|elemento visual|gráfico|gráficos)/g, '')
          .replace(/(?:de|para|com|que|a|o|as|os|em|no|na)/g, '')
          .trim()
        }

        // Se ainda não encontrou, usar contexto geral da conversa (última tentativa)
        if (!searchQuery || searchQuery.length < 3) {
          // Extrair palavras-chave da mensagem do usuário original
          const userKeywords = userMessage.match(/(?:agenda|cheia|vazia|nutri|nutricionista|ylada|instagram|facebook|anúncio)/gi)
          if (userKeywords && userKeywords.length > 0) {
            searchQuery = userKeywords.slice(0, 2).join(' ').toLowerCase()
          } else {
            // Fallback: usar termos genéricos baseados no contexto
            searchQuery = 'nutricionista agenda'
          }
        }
        
        // Se ainda não encontrou, usar termos relacionados ao contexto
        if (!searchQuery || searchQuery.length < 3) {
          // Tentar extrair contexto geral da conversa
          if (videoAnalysis?.transcription) {
            // Extrair palavras-chave da transcrição
            const keywords = videoAnalysis.transcription
              .toLowerCase()
              .split(/\s+/)
              .filter(word => word.length > 4)
              .slice(0, 3)
              .join(' ')
            if (keywords) {
              searchQuery = keywords
            }
          }
          
          // Fallback para termos relacionados a nutricionistas
          if (!searchQuery || searchQuery.length < 3) {
            searchQuery = 'nutritionist professional consultation healthy lifestyle'
          }
        }

        // Garantir que temos um termo de busca válido
        if (!searchQuery || searchQuery.length < 2) {
          searchQuery = 'nutritionist professional'
        }
        
        // Agora que temos o termo de busca, iniciar a busca
        setIsSearchingImages(true)
        setSearchStatus('🔍 Buscando imagens...')
        setSearching(true, 'images', searchQuery)
        
        // Adicionar mensagem de progresso no chat
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `🔍 Buscando imagens relacionadas a "${searchQuery}"...`,
          },
        ])

        // Traduzir termos comuns para inglês
        const translations: Record<string, string> = {
          'nutricionista': 'nutritionist',
          'nutricionistas': 'nutritionists',
          'saude': 'health',
          'saúde': 'health',
          'alimentacao': 'nutrition',
          'alimentação': 'nutrition',
          'consulta': 'consultation',
          'paciente': 'patient',
          'cliente': 'client',
          'agenda': 'schedule',
          'dashboard': 'dashboard',
          'plataforma': 'platform',
          'resultado': 'results',
          'resultados': 'results',
        }
        
        Object.entries(translations).forEach(([pt, en]) => {
          searchQuery = searchQuery.replace(new RegExp(pt, 'gi'), en)
        })

        try {
          // Buscar imagens automaticamente
          const imageResponse = await authenticatedFetch('/api/creative-studio/search-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: searchQuery,
              type: 'search',
              count: 8,
            }),
          })

          if (imageResponse.ok) {
            const imageData = await imageResponse.json()
            if (imageData.images && imageData.images.length > 0) {
              foundImages = imageData.images.map((img: any) => ({
                id: img.id || `img-${Date.now()}-${Math.random()}`,
                url: img.url,
                thumbnail: img.thumbnail || img.url,
                source: img.source || 'pexels',
              }))
              
              // Adicionar ao store para exibir na aba de busca
              addSearchImages(foundImages)
              
              // Adicionar mensagem sobre as imagens encontradas
              if (!assistantMessage.includes('📸')) {
                assistantMessage += `\n\n📸 Encontrei ${foundImages.length} imagem(ns) relacionadas. Veja na aba "Busca" e selecione as que você quer usar:`
              }
              
              // Remover mensagem de progresso e adicionar resultado
              setMessages((prev) => {
                const filtered = prev.filter(m => 
                  !m.content.includes('🔍 Buscando imagens relacionadas...')
                )
                return filtered
              })
            }
          }
        } catch (error) {
          console.error('Erro ao buscar imagens:', error)
          setSearchStatus(null)
          // Remover mensagem de progresso
          setMessages((prev) => {
            const filtered = prev.filter(m => 
              !m.content.includes('🔍 Buscando imagens relacionadas...')
            )
            return [
              ...filtered,
              {
                role: 'assistant',
                content: '❌ Não consegui buscar imagens. Tente novamente.',
              },
            ]
          })
        } finally {
          setIsSearchingImages(false)
          setSearchStatus(null)
          setSearching(false)
        }
      }

      // Buscar vídeos se mencionado
      if (shouldSearchVideos) {
        setIsSearchingVideos(true)
        setSearchStatus('🎬 Buscando vídeos...')
        setSearching(true, 'videos', searchQuery || '')
        
        // Adicionar mensagem de progresso no chat
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '🎬 Buscando vídeos relacionados...',
          },
        ])
        
        // Extrair termos de busca - priorizar sugestões do assistente
        let searchQuery = ''
        
        // Primeiro tentar extrair da mensagem do assistente (sugestões)
        if (assistantSuggestsVideos) {
          const patterns = [
            /(?:vídeo|video|clip)\s+(?:de|para|sobre|com)\s+([^.,!?]+)/i,
            /(?:adicionar|incluir|buscar|sugerir)\s+(?:vídeo|video|clip)\s+(?:de|para|sobre)?\s*([^.,!?]+)/i,
          ]
          
          for (const pattern of patterns) {
            const match = assistantMessage.match(pattern)
            if (match && match[1]) {
              searchQuery = match[1].trim()
              break
            }
          }
        }
        
        // Se ainda não encontrou, tentar da mensagem do usuário
        if (!searchQuery || searchQuery.length < 3) {
          searchQuery = userMessage
            .toLowerCase()
            .replace(/(?:quero|preciso|buscar|adicionar|incluir|colocar|usar)\s+/g, '')
            .replace(/(?:vídeo|video|vídeos|videos|clip|clips|filmagem|gravação)/g, '')
            .replace(/(?:de|para|com|que|a|o|as|os|em|no|na)/g, '')
            .trim()
        }
        
        // Fallback
        if (!searchQuery || searchQuery.length < 3) {
          searchQuery = 'nutritionist professional consultation healthy lifestyle'
        }

        // Traduzir termos comuns para inglês
        const translations: Record<string, string> = {
          'nutricionista': 'nutritionist',
          'nutricionistas': 'nutritionists',
          'saude': 'health',
          'saúde': 'health',
          'alimentacao': 'nutrition',
          'alimentação': 'nutrition',
          'consulta': 'consultation',
          'paciente': 'patient',
          'cliente': 'client',
          'agenda': 'schedule',
          'dashboard': 'dashboard',
          'plataforma': 'platform',
          'resultado': 'results',
          'resultados': 'results',
        }
        
        Object.entries(translations).forEach(([pt, en]) => {
          searchQuery = searchQuery.replace(new RegExp(pt, 'gi'), en)
        })

        try {
          // Buscar vídeos automaticamente
          const videoResponse = await authenticatedFetch('/api/creative-studio/search-images', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: searchQuery,
              type: 'search-videos',
              count: 8,
            }),
          })

          if (videoResponse.ok) {
            const videoData = await videoResponse.json()
            if (videoData.videos && videoData.videos.length > 0) {
              foundVideos = videoData.videos.map((vid: any) => ({
                id: vid.id || `vid-${Date.now()}-${Math.random()}`,
                url: vid.url,
                thumbnail: vid.thumbnail || vid.image || '',
                source: vid.source || 'pexels',
                duration: vid.duration || 0,
              }))
              
              // Adicionar ao store para exibir na aba de busca
              addSearchVideos(foundVideos)
              
              // Adicionar mensagem sobre os vídeos encontrados
              if (!assistantMessage.includes('🎬')) {
                assistantMessage += `\n\n🎬 Encontrei ${foundVideos.length} vídeo(s) relacionado(s). Veja na aba "Busca" e selecione os que você quer usar:`
              }
              
              // Remover mensagem de progresso
              setMessages((prev) => {
                return prev.filter(m => 
                  !m.content.includes('🎬 Buscando vídeos relacionados...')
                )
              })
            }
          }
        } catch (error) {
          console.error('Erro ao buscar vídeos:', error)
          setSearchStatus(null)
          // Remover mensagem de progresso
          setMessages((prev) => {
            const filtered = prev.filter(m => 
              !m.content.includes('🎬 Buscando vídeos relacionados...')
            )
            return [
              ...filtered,
              {
                role: 'assistant',
                content: '❌ Não consegui buscar vídeos. Tente novamente.',
              },
            ]
          })
        } finally {
          setIsSearchingVideos(false)
          setSearchStatus(null)
          setSearching(false)
        }
      }

      setMessages((prev) => {
        const newMessages = [...prev, { 
        role: 'assistant', 
        content: assistantMessage,
        images: foundImages.length > 0 ? foundImages : undefined,
          videos: foundVideos.length > 0 ? foundVideos : undefined,
        }]
        // Forçar scroll quando assistente responde
        setTimeout(() => scrollToBottom(true), 100)
        return newMessages
      })
      
      // Extrair sugestões dinâmicas da resposta do assistente
      // Detectar sugestões de cortes e adicionar à timeline visual
      const cutsMatch = assistantMessage.match(/corte\s+(?:no|em|aos?)\s+(\d+(?:\.\d+)?)\s*(?:segundos?|s)/gi)
      if (cutsMatch) {
        // Limpar cortes anteriores
        clearSuggestedCuts()
        
        cutsMatch.forEach((match) => {
          const timestampMatch = match.match(/(\d+(?:\.\d+)?)/)
          if (timestampMatch) {
            const timestamp = parseFloat(timestampMatch[1])
            
            // Adicionar à lista de sugestões
            addDynamicSuggestion({
              title: `Corte no segundo ${timestamp.toFixed(1)}`,
              description: `Aplicar corte estratégico neste momento para melhorar o ritmo do vídeo.`,
              type: 'cut',
              timestamp,
            })
            
            // Adicionar marcador visual na timeline
            addSuggestedCut(timestamp, `Corte sugerido em ${timestamp.toFixed(1)}s`)
          }
        })
      }
      
      // Detectar sugestões de imagens
      if (foundImages.length > 0) {
        foundImages.forEach((img) => {
          addDynamicSuggestion({
            title: `Adicionar imagem: ${img.source}`,
            description: `Imagem sugerida para reforçar a mensagem do vídeo.`,
            type: 'image',
          })
        })
      }
      
      // Detectar outras sugestões no texto
      const suggestionPatterns = [
        /(\d+)\.\s+([^\n]+)\n\s+([^\n]+)/g, // Lista numerada com título e descrição
      ]
      
      suggestionPatterns.forEach((pattern) => {
        const matches = [...assistantMessage.matchAll(pattern)]
        matches.forEach((match) => {
          if (match[2] && match[3]) {
            addDynamicSuggestion({
              title: match[2].trim(),
              description: match[3].trim(),
              type: 'general',
            })
          }
        })
      })

      // Detectar se o usuário aceitou as sugestões
      const userAccepted = userMessage.toLowerCase().match(/\b(ok|pode aplicar|aceito|pode fazer|vamos|sim|aplicar|fazer|pode|aceito|ok pode)\b/i)
      
      // Se o usuário aceitou, aplicar automaticamente cortes e imagens
      if (userAccepted) {
        // Aplicar cortes sugeridos
        const cutsMatch = assistantMessage.match(/corte\s+(?:no|em|aos?)\s+(\d+(?:\.\d+)?)\s*(?:segundos?|s)/gi)
        if (cutsMatch && uploadedVideo && clips.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: '✂️ Aplicando cortes na timeline... Você pode ver as mudanças no preview acima!',
            },
          ])

          // Extrair timestamps de cortes sugeridos e ordenar
          const timestamps = cutsMatch.map(match => {
            const num = match.match(/(\d+(?:\.\d+)?)/)?.[1]
            return num ? parseFloat(num) : null
          }).filter((t): t is number => t !== null).sort((a, b) => a - b)

          if (timestamps.length > 0) {
            try {
              const videoClip = clips.find(c => c.type === 'video')
              if (videoClip) {
                // Criar cortes baseados nos timestamps
                const cuts: Array<{ start: number; end: number }> = []
                
                // Primeiro corte do início até o primeiro timestamp
                if (timestamps[0] > 0) {
                  cuts.push({ start: 0, end: timestamps[0] })
                }
                
                // Cortes entre timestamps
                for (let i = 0; i < timestamps.length - 1; i++) {
                  cuts.push({
                    start: timestamps[i],
                    end: timestamps[i + 1],
                  })
                }
                
                // Último corte do último timestamp até o fim
                if (videoClip.endTime > timestamps[timestamps.length - 1]) {
                  cuts.push({
                    start: timestamps[timestamps.length - 1],
                    end: videoClip.endTime,
                  })
                }

                const cutsResponse = await authenticatedFetch('/api/creative-studio/apply-cuts', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    videoUrl: videoClip.source,
                    cuts,
                    clipId: videoClip.id,
                  }),
                })

                if (cutsResponse.ok) {
                  const cutsData = await cutsResponse.json()
                  // Substituir clip original pelos cortes
                  const otherClips = clips.filter(c => c.id !== videoClip.id)
                  setClips([...otherClips, ...cutsData.clips])
                  
                  // Limpar cortes sugeridos já que foram aplicados
                  clearSuggestedCuts()
                  
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: 'assistant',
                      content: `✅ Apliquei ${cutsData.clips.length} corte(s) na timeline! Veja no preview acima.`,
                    },
                  ])
                }
              }
            } catch (error) {
              console.error('Erro ao aplicar cortes:', error)
              setMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: '❌ Erro ao aplicar cortes. Tente novamente.',
                },
              ])
            }
          }
        }

        // Adicionar imagens automaticamente quando usuário aceitar
        if (foundImages.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `📸 Adicionando ${foundImages.length} imagem(ns) à timeline... Você pode ver no preview acima em tempo real!`,
            },
          ])

          // Adicionar cada imagem à timeline com delay para feedback visual
          foundImages.forEach((img, index) => {
            setTimeout(() => {
              // Usar função que obtém o estado atualizado
              const currentClips = clips.length > 0 ? clips : []
              const lastClip = currentClips.length > 0 ? currentClips[currentClips.length - 1] : null
              const startTime = lastClip ? lastClip.endTime : 0
              const endTime = startTime + 5 // 5 segundos por imagem

              addClip({
                id: `img-auto-${img.id}-${Date.now()}-${index}`,
                startTime,
                endTime,
                source: img.url,
                type: 'image',
              })

              // Feedback final após adicionar todas
              if (index === foundImages.length - 1) {
                setTimeout(() => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: 'assistant',
                      content: `✅ Adicionei ${foundImages.length} imagem(ns) à timeline! Veja no preview acima.`,
                    },
                  ])
                }, 300)
              }
            }, index * 300) // Delay entre cada imagem
          })
        }
      }
    } catch (error: any) {
      console.error('Erro no chat:', error)
      
      let errorMessage = 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.'
      
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        errorMessage = '⏱️ A requisição demorou muito (mais de 30 segundos) e foi cancelada. Tente novamente.'
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ])
    } finally {
      setIsLoading(false)
      setSearchStatus(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Formatar mensagem removendo asteriscos e formatando corretamente
  // Função para pular vídeo para um timestamp específico
  const seekToTimestamp = (seconds: number) => {
    try {
      // Validar o timestamp
      if (isNaN(seconds) || seconds < 0) {
        console.error('Timestamp inválido:', seconds)
        return
      }
      
      // Verificar se há clips na timeline
      if (clips.length === 0) {
        console.warn('Nenhum clip na timeline para fazer seek')
        return
      }
      
      // Garantir que o timestamp não exceda a duração total
      const maxDuration = Math.max(...clips.map(c => c.endTime))
      const clampedTime = Math.min(seconds, maxDuration)
      
      setCurrentTime(clampedTime)
    setIsPlaying(false) // Pausar ao pular
      
      console.log(`Seek para ${clampedTime.toFixed(1)}s`)
    } catch (error) {
      console.error('Erro ao fazer seek:', error)
    }
  }

  // Função para extrair timestamp de texto (ex: "15.3", "15:03", "segundo 15.3")
  const parseTimestamp = (text: string): number | null => {
    // Padrões: "15.3", "15:03", "segundo 15.3", "15.3s", "15s"
    const patterns = [
      /(\d+):(\d+)/, // 15:03
      /(\d+\.\d+)\s*s/i, // 15.3s
      /segundo\s+(\d+\.\d+)/i, // segundo 15.3
      /segundo\s+(\d+)/i, // segundo 15
      /(\d+\.\d+)/, // 15.3
      /(\d+)\s*s/i, // 15s
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        if (pattern === patterns[0]) {
          // Formato MM:SS
          const minutes = parseInt(match[1])
          const secs = parseInt(match[2])
          return minutes * 60 + secs
        } else {
          return parseFloat(match[1])
        }
      }
    }
    return null
  }

  const formatMessage = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let skipNext = false

    lines.forEach((line, lineIndex) => {
      if (skipNext) {
        skipNext = false
        return
      }

      const trimmedLine = line.trim()
      
      // Linha vazia
      if (trimmedLine === '') {
        elements.push(<div key={`empty-${lineIndex}`} className="h-2" />)
        return
      }

      // Detectar listas numeradas (1. Título)
      const listMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/)
      if (listMatch) {
        const [, number, title] = listMatch
        // Verificar se a próxima linha é descrição (indentada com espaços)
        const nextLine = lines[lineIndex + 1]
        const isDescription = nextLine && nextLine.trim() && nextLine.startsWith('   ') && !nextLine.trim().match(/^\d+\./)
        
        if (isDescription) {
          // Título + Descrição
          const description = nextLine.trim()
          elements.push(
            <div key={`list-${lineIndex}`} className="mb-3">
              <p className="font-semibold text-gray-900 mb-1 text-sm">
                {number}. {title}
              </p>
              <p className="text-sm text-gray-700 ml-4 leading-relaxed">{description}</p>
            </div>
          )
          skipNext = true
          return
        } else {
          // Apenas título
          elements.push(
            <p key={`list-${lineIndex}`} className="font-semibold text-gray-900 mb-1 text-sm">
              {number}. {title}
            </p>
          )
          return
        }
      }

      // Processar linha com negrito e timestamps clicáveis
      const processLine = (line: string) => {
        const parts: Array<{ type: 'text' | 'bold' | 'timestamp'; content: string; timestamp?: number }> = []
        
        // Regex para timestamps: "corte no segundo 30.7", "segundo 15.3", "15.3s", "15:03", "15.3", "15s"
        // Melhorado para capturar "30.7" corretamente (número decimal)
        // Prioriza formato decimal (30.7) sobre formato MM:SS
        const timestampRegex = /(?:corte\s+(?:no|em|aos?)\s+)?(?:segundo\s+)?(\d+)(?:\.(\d+))?(?:\s*segundos?|\s*s)?|(\d+):(\d+)/gi
        const boldRegex = /\*\*([^*]+)\*\*/g
        
        let processed = line
        let lastIndex = 0
        
        // Processar negrito primeiro
        const boldMatches = [...processed.matchAll(boldRegex)]
        const allMatches: Array<{ index: number; length: number; type: 'bold' | 'timestamp'; content: string; timestamp?: number }> = []
        
        boldMatches.forEach(match => {
          if (match.index !== undefined) {
            allMatches.push({
              index: match.index,
              length: match[0].length,
              type: 'bold',
              content: match[1],
            })
          }
        })
        
        // Processar timestamps
        const timestampMatches = [...processed.matchAll(timestampRegex)]
        timestampMatches.forEach(match => {
          if (match.index !== undefined) {
            const fullMatch = match[0]
            let timestamp: number | null = null
            
            try {
              // Verificar se é formato MM:SS (match[3] e match[4] existem)
              if (match[3] !== undefined && match[4] !== undefined) {
                // Formato MM:SS
                timestamp = parseInt(match[3]) * 60 + parseInt(match[4])
              } else if (match[2] !== undefined) {
                // Formato MM.SS (ex: "30.7" = 30.7 segundos)
                timestamp = parseFloat(`${match[1]}.${match[2]}`)
              } else if (match[1] !== undefined) {
                // Formato simples (ex: "30" = 30 segundos)
              timestamp = parseFloat(match[1])
            }
            
              // Validar timestamp
              if (timestamp !== null && !isNaN(timestamp) && timestamp >= 0) {
              allMatches.push({
                index: match.index,
                length: fullMatch.length,
                type: 'timestamp',
                content: fullMatch,
                timestamp,
              })
              }
            } catch (error) {
              console.error('Erro ao processar timestamp:', match, error)
            }
          }
        })
        
        // Ordenar matches por índice
        allMatches.sort((a, b) => a.index - b.index)
        
        // Construir partes
        allMatches.forEach((match) => {
          // Texto antes do match
          if (match.index > lastIndex) {
            parts.push({ type: 'text', content: processed.substring(lastIndex, match.index) })
          }
          
          // Adicionar o match
          if (match.type === 'bold') {
            parts.push({ type: 'bold', content: match.content })
          } else if (match.type === 'timestamp' && match.timestamp !== undefined) {
            parts.push({ type: 'timestamp', content: match.content, timestamp: match.timestamp })
          }
          
          lastIndex = match.index + match.length
        })
        
        // Texto restante
        if (lastIndex < processed.length) {
          parts.push({ type: 'text', content: processed.substring(lastIndex) })
        }
        
        return parts.length > 0 ? parts : [{ type: 'text', content: line }]
      }

      // Verificar se tem negrito ou timestamps (incluindo "corte no segundo X.X")
      const hasTimestamp = /(?:corte\s+(?:no|em|aos?)\s+)?(?:segundo\s+)?\d+(?:[:\.]\d+)?(?:\s*segundos?|\s*s)?/i.test(trimmedLine)
      if (trimmedLine.includes('**') || hasTimestamp) {
        const processedParts = processLine(trimmedLine)
        elements.push(
          <p key={`line-${lineIndex}`} className="text-sm leading-relaxed mb-1">
            {processedParts.map((part, partIndex) => {
              if (part.type === 'bold') {
                return (
                  <strong key={`bold-${lineIndex}-${partIndex}`} className="font-semibold text-gray-900">
                    {part.content}
                  </strong>
                )
              } else if (part.type === 'timestamp' && part.timestamp !== undefined) {
                const timestamp = part.timestamp
                return (
                  <button
                    key={`timestamp-${lineIndex}-${partIndex}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      seekToTimestamp(timestamp)
                    }}
                    className="text-purple-600 hover:text-purple-800 underline font-semibold cursor-pointer transition-colors mx-0.5"
                    title={`Pular para ${timestamp.toFixed(1)}s`}
                    type="button"
                  >
                    {part.content}
                  </button>
                )
              } else {
                return <span key={`text-${lineIndex}-${partIndex}`}>{part.content}</span>
              }
            })}
          </p>
        )
        return
      }

      // Linha normal
      elements.push(
        <p key={`normal-${lineIndex}`} className="text-sm leading-relaxed mb-1">
          {trimmedLine}
        </p>
      )
    })

    return <div className="space-y-1">{elements}</div>
  }

  const handleQuickAction = async (action: string) => {
    if (isLoading || isAnalyzing) return
    
    let message = ''
    
    switch (action) {
      case 'diagnose':
        if (uploadedVideo) {
          // Verificar se já foi analisado
          if (videoAnalysis) {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: `✅ O vídeo "${uploadedVideo.name}" já foi analisado! Você pode ver as sugestões acima ou me pedir para aplicar melhorias específicas.`,
              },
            ])
            return
          }
          // Forçar nova análise
          analyzedVideoRef.current = null
          await analyzeVideo(uploadedVideo)
          return // Não precisa enviar mensagem, a análise já faz isso
        } else {
          message = 'Quero diagnosticar um vídeo. Como faço?'
        }
        break
      case 'sales-video':
        message = 'Quero criar um vídeo de vendas completo (2-3 minutos) para página de vendas. Pode me ajudar a criar o roteiro?'
        break
      case 'short-video':
        message = 'Quero criar um vídeo resumido de 60 segundos para redes sociais. Pode me ajudar?'
        break
      case 'build-from-scratch':
        message = 'Quero construir um vídeo do zero. Pode me guiar passo a passo?'
        break
    }
    
    if (message) {
      setInput(message)
      // Enviar automaticamente
      const userMessage = message
      setInput('')
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
      setIsLoading(true)

      try {
        // Função auxiliar para limpar dados e evitar referências circulares
        const cleanData = (data: any, visited = new WeakSet(), depth = 0): any => {
          // Limitar profundidade para evitar loops infinitos
          if (depth > 10) return null
          
          if (data === null || data === undefined) return null
          if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') return data
          if (data instanceof Date) return data.toISOString()
          if (data instanceof File) return { name: data.name, size: data.size, type: data.type }
          
          // Detectar referências circulares ANTES de processar
          if (typeof data === 'object') {
            if (visited.has(data)) return null // Referência circular detectada
            visited.add(data)
          }
          
          // Detectar elementos DOM e objetos React ANTES de processar
          if (data instanceof HTMLElement || 
              data instanceof SVGElement || 
              data instanceof Element ||
              data instanceof Node) {
            return null
          }
          
          // Detectar objetos React Fiber por nome do construtor
          if (data && typeof data === 'object' && data.constructor) {
            const constructorName = data.constructor.name
            if (constructorName.includes('Fiber') || 
                constructorName.includes('React') ||
                constructorName.startsWith('HTML') ||
                constructorName === 'HTMLButtonElement' ||
                constructorName === 'HTMLDivElement' ||
                constructorName === 'HTMLInputElement') {
              return null
            }
          }
          
          if (Array.isArray(data)) {
            return data.map(item => cleanData(item, visited, depth + 1))
          }
          
          if (typeof data === 'object') {
            const cleaned: any = {}
            for (const key in data) {
              // Ignorar propriedades internas do React/DOM
              if (key.startsWith('__') || 
                  key === 'stateNode' || 
                  key.includes('react') || 
                  key.includes('Fiber') ||
                  key === 'ownerDocument' ||
                  key === 'parentNode' ||
                  key === 'childNodes' ||
                  key === '__reactFiber' ||
                  key === '__reactInternalInstance' ||
                  key === '_reactInternalFiber') {
                continue
              }
              
              try {
                const value = data[key]
                
                // Ignorar funções
                if (typeof value === 'function') continue
                
                // Ignorar elementos DOM
                if (value instanceof HTMLElement || 
                    value instanceof SVGElement ||
                    value instanceof Element ||
                    value instanceof Node) {
                  continue
                }
                
                // Ignorar objetos React por nome do construtor
                if (value && typeof value === 'object' && value.constructor) {
                  const constructorName = value.constructor.name
                  if (constructorName.includes('Fiber') || 
                      constructorName.includes('React') ||
                      constructorName.startsWith('HTML')) {
                    continue
                  }
                }
                
                cleaned[key] = cleanData(value, visited, depth + 1)
              } catch (e) {
                // Ignorar propriedades que causam erro
                continue
              }
            }
            return cleaned
          }
          
          return null
        }

        const rawContext = {
          hasAnalysis: !!videoAnalysis,
          hasClips: clips.length > 0,
          hasScript: script.length > 0,
          hasVideo: !!uploadedVideo,
          videoFileName: uploadedVideo?.name || null,
          videoSize: uploadedVideo?.size || null,
          videoInTimeline: clips.some(c => c.type === 'video'),
          analysis: videoAnalysis
            ? {
                transcription: videoAnalysis.transcription || null,
                suggestions: Array.isArray(videoAnalysis.suggestions) 
                  ? videoAnalysis.suggestions.map((s: any) => ({
                      title: typeof s.title === 'string' ? s.title : null,
                      description: typeof s.description === 'string' ? s.description : null,
                    }))
                  : [],
                scriptStructure: Array.isArray(videoAnalysis.scriptStructure)
                  ? videoAnalysis.scriptStructure.map((s: any) => ({
                      text: typeof s.text === 'string' ? s.text : null,
                      timestamp: typeof s.timestamp === 'string' ? s.timestamp : null,
                      type: typeof s.type === 'string' ? s.type : null,
                    }))
                  : [],
              }
            : null,
        }

        // Limpar todo o contexto antes de serializar
        const context = cleanData(rawContext)

        // Preparar body com proteção extra
        let requestBody: any = {
          message: userMessage,
          context,
          mode, // Enviar o modo para o backend usar o prompt correto
        }
        
        // Testar serialização antes de enviar
        let bodyString: string
        try {
          bodyString = JSON.stringify(requestBody)
        } catch (error) {
          console.error('Erro ao serializar requestBody, usando contexto mínimo:', error)
          // Se ainda houver erro, usar contexto mínimo
          requestBody = {
            message: userMessage,
            context: {
              hasAnalysis: !!videoAnalysis,
              hasClips: clips.length > 0,
              hasScript: script.length > 0,
            },
            mode,
          }
          bodyString = JSON.stringify(requestBody)
        }

        const response = await authenticatedFetch('/api/creative-studio/editor-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: bodyString,
        })

        if (!response.ok) {
          throw new Error('Erro ao processar mensagem')
        }

        const data = await response.json()
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      } catch (error: any) {
        console.error('Erro no chat:', error)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Desculpe, tive um problema ao processar sua mensagem. Tente novamente.',
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Componente para seleção de imagem
  const ImageSelector = ({ 
    image, 
    onAdd 
  }: { 
    image: { id: string; url: string; thumbnail: string; source: string }
    onAdd: (url: string) => void 
  }) => {
    const [isAdding, setIsAdding] = useState(false)
    
    return (
      <div className="relative group">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-colors">
          <img
            src={image.thumbnail || image.url}
            alt="Imagem sugerida"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
            <button
              onClick={() => {
                setIsAdding(true)
                onAdd(image.url)
                setTimeout(() => setIsAdding(false), 1000)
              }}
              disabled={isAdding}
              className="opacity-0 group-hover:opacity-100 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {isAdding ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate" title={image.source}>
          {image.source}
        </p>
      </div>
    )
  }

  // Componente para seleção de vídeo
  const VideoSelector = ({ 
    video, 
    onAdd 
  }: { 
    video: { id: string; url: string; thumbnail: string; source: string; duration?: number }
    onAdd: (url: string, duration: number) => void 
  }) => {
    const [isAdding, setIsAdding] = useState(false)
    
    return (
      <div className="relative group">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-colors">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt="Vídeo sugerido"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
            <button
              onClick={() => {
                setIsAdding(true)
                onAdd(video.url, video.duration || 10)
                setTimeout(() => setIsAdding(false), 1000)
              }}
              disabled={isAdding}
              className="opacity-0 group-hover:opacity-100 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              {isAdding ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
          {video.duration && video.duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
              {Math.round(video.duration)}s
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate" title={video.source}>
          {video.source}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header - Mobile Responsive */}
      <div className="p-2 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Assistente</h3>
          {(isAnalyzing || isSearchingImages || isSearchingVideos) && (
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 animate-pulse" />
          )}
        </div>
        <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">
          {isAnalyzing 
            ? 'Analisando vídeo...' 
            : isSearchingImages 
            ? '🔍 Buscando imagens...' 
            : isSearchingVideos 
            ? '🎬 Buscando vídeos...' 
            : searchStatus 
            ? searchStatus 
            : 'Converse comigo para melhorar seu vídeo'}
        </p>
      </div>

      {/* Messages - Mobile Responsive */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              </div>
            )}
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.role === 'assistant' ? (
                formatMessage(msg.content)
              ) : (
                <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{msg.content}</p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
            </div>
            
            {/* Grid de Imagens para Seleção - Fora da bolha de mensagem */}
            {msg.role === 'assistant' && msg.images && msg.images.length > 0 && (
              <div className="mt-3 ml-11 max-w-[85%] sm:max-w-[80%]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-700">
                    📸 {msg.images.length} imagem(ns) encontrada(s) - Selecione as que deseja usar:
                  </p>
                  <button
                    onClick={async () => {
                      // Extrair contexto da mensagem para criar imagem
                      const contextText = msg.content.substring(0, 200)
                      const createPrompt = `Criar imagem relacionada a: ${contextText}`
                      
                      setIsSearchingImages(true)
                      try {
                        const response = await authenticatedFetch('/api/creative-studio/search-images', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            query: createPrompt,
                            type: 'create',
                            count: 1,
                          }),
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          if (data.images && data.images.length > 0) {
                            // Adicionar imagem criada à lista
                            setMessages((prev) =>
                              prev.map((m, i) =>
                                i === idx
                                  ? { ...m, images: [...(m.images || []), ...data.images] }
                                  : m
                              )
                            )
                          }
                        }
                      } catch (error) {
                        console.error('Erro ao criar imagem:', error)
                      } finally {
                        setIsSearchingImages(false)
                      }
                    }}
                    disabled={isSearchingImages}
                    className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Criar com IA
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {msg.images.map((img) => (
                    <ImageSelector
                      key={img.id}
                      image={img}
                      onAdd={(imageUrl) => {
                        // Adicionar imagem à timeline
                        const lastClip = clips.length > 0 ? clips[clips.length - 1] : null
                        const startTime = lastClip ? lastClip.endTime : 0
                        const endTime = startTime + 5 // 5 segundos por padrão
                        
                        addClip({
                          id: `img-${img.id}-${Date.now()}`,
                          startTime,
                          endTime,
                          source: imageUrl,
                          type: 'image',
                        })
                        
                        // Remover da lista de imagens disponíveis
                        setMessages((prev) =>
                          prev.map((m, i) =>
                            i === idx
                              ? { ...m, images: m.images?.filter((im) => im.id !== img.id) }
                              : m
                          )
                        )
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grid de Vídeos para Seleção - Fora da bolha de mensagem */}
            {msg.role === 'assistant' && msg.videos && msg.videos.length > 0 && (
              <div className="mt-3 ml-11 max-w-[85%] sm:max-w-[80%]">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  🎬 {msg.videos.length} vídeo(s) encontrado(s) - Selecione os que deseja usar:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {msg.videos.map((vid) => (
                    <VideoSelector
                      key={vid.id}
                      video={vid}
                      onAdd={(videoUrl, duration) => {
                        // Adicionar vídeo à timeline
                        const lastClip = clips.length > 0 ? clips[clips.length - 1] : null
                        const startTime = lastClip ? lastClip.endTime : 0
                        const endTime = startTime + duration
                        
                        addClip({
                          id: `vid-${vid.id}-${Date.now()}`,
                          startTime,
                          endTime,
                          source: videoUrl,
                          type: 'video',
                        })
                        
                        // Remover da lista de vídeos disponíveis
                        setMessages((prev) =>
                          prev.map((m, i) =>
                            i === idx
                              ? { ...m, videos: m.videos?.filter((v) => v.id !== vid.id) }
                              : m
                          )
                        )
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Botão de ação rápida - apenas Diagnosticar - Mobile Responsive */}
            {msg.role === 'assistant' && idx === 0 && mode === 'edit' && (
              <div className="mt-2 ml-7 sm:ml-11">
                <button
                  onClick={() => handleQuickAction('diagnose')}
                  disabled={isAnalyzing || isLoading}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-1.5 touch-manipulation"
                >
                  <Scissors className="w-3 h-3" />
                  <span className="text-xs">Diagnosticar</span>
                </button>
              </div>
            )}

            {/* Botões de ação rápida para sugestões (Aceito, Não aceito, Rever, Outra dica) */}
            {msg.role === 'assistant' && idx > 0 && (
              <>
                {/* Detectar se a mensagem contém sugestões de cortes ou imagens */}
                {(() => {
                  const hasCuts = /corte\s+(?:no|em|aos?)\s+(\d+(?:\.\d+)?)\s*(?:segundos?|s)/gi.test(msg.content)
                  const hasImages = msg.images && msg.images.length > 0
                  const hasSuggestions = hasCuts || hasImages || /sugest|sugiro|recomendo|vou aplicar|vou adicionar/gi.test(msg.content)
                  
                  if (!hasSuggestions) return null

                  return (
                    <div className="mt-3 ml-7 sm:ml-11 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          handleSend('ok pode aplicar')
                        }}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 touch-manipulation"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Aceito</span>
                      </button>
                      <button
                        onClick={() => {
                          handleSend('Não aceito, quero outra sugestão')
                        }}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 touch-manipulation"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Não aceito</span>
                      </button>
                      <button
                        onClick={() => {
                          handleSend('Rever as sugestões anteriores')
                        }}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 touch-manipulation"
                      >
                        <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Rever</span>
                      </button>
                      <button
                        onClick={() => {
                          handleSend('Quero outra dica ou sugestão diferente')
                        }}
                        disabled={isLoading}
                        className="px-3 py-1.5 text-xs sm:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 touch-manipulation"
                      >
                        <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Outra dica</span>
                      </button>
                    </div>
                  )
                })()}
              </>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-600" />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        {(isSearchingImages || isSearchingVideos) && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {isSearchingImages ? (
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              ) : (
                <Video className="w-4 h-4 text-blue-600 animate-pulse" />
              )}
            </div>
            <div className="bg-blue-50 rounded-lg px-4 py-2 border border-blue-200">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">
                  {isSearchingImages ? '🔍 Buscando imagens...' : '🎬 Buscando vídeos...'}
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Mobile Responsive */}
      <div className="p-2 sm:p-4 border-t border-gray-200">
        <div className="flex gap-1.5 sm:gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Digite sua mensagem..."
            rows={1}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed overflow-y-auto"
            disabled={isLoading || isSearchingImages || isSearchingVideos}
            style={{
              minHeight: '48px',
              maxHeight: '400px',
              height: '48px',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isSearchingImages || isSearchingVideos}
            className="h-[48px] w-[48px] sm:h-[52px] sm:w-[52px] bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              minHeight: '48px',
              minWidth: '48px',
            }}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}


