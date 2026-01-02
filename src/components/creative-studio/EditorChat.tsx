'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, Video, Scissors, Zap, Plus, Check, X, RotateCcw, Lightbulb } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'

interface EditorChatProps {
  mode?: 'edit' | 'create'
}

export function EditorChat({ mode = 'edit' }: EditorChatProps) {
  const getInitialMessage = () => {
    if (mode === 'create') {
      return 'Olá! Sou seu assistente de criação de vídeos. 🎬\n\nVou te ajudar a criar vídeos de vendas profissionais do zero!\n\nPara começar, me diga:\n• Qual o objetivo do vídeo? (anúncio curto, vídeo de vendas, post educativo)\n• Sobre o que você quer falar?\n• Qual a principal mensagem?\n\nCom essas informações, vou estruturar o vídeo completo, criar o roteiro e sugerir elementos visuais estratégicos!'
    }
    return 'Olá! Sou seu assistente de edição. Faça upload do seu vídeo e eu analiso automaticamente, ou clique em "Diagnosticar" para começar.'
  }

  const [messages, setMessages] = useState<Array<{ 
    role: 'user' | 'assistant'
    content: string
    images?: Array<{ id: string; url: string; thumbnail: string; source: string }>
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const authenticatedFetch = useAuthenticatedFetch()
  const { videoAnalysis, clips, script, uploadedVideo, setVideoAnalysis, setUploadedVideo, addClip, setClips, updateClip, setCurrentTime, setIsPlaying } = useCreativeStudioStore()
  const analyzedVideoRef = useRef<File | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
    }
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Construir contexto do vídeo
      const context = {
        hasAnalysis: !!videoAnalysis,
        hasClips: clips.length > 0,
        hasScript: script.length > 0,
        hasVideo: !!uploadedVideo,
        videoFileName: uploadedVideo?.name || null,
        videoSize: uploadedVideo?.size || null,
        videoInTimeline: clips.some(c => c.type === 'video'),
        analysis: videoAnalysis
          ? {
              transcription: videoAnalysis.transcription,
              suggestions: videoAnalysis.suggestions,
              scriptStructure: videoAnalysis.scriptStructure,
            }
          : null,
      }

      const response = await authenticatedFetch('/api/creative-studio/editor-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context,
          mode, // Enviar o modo para o backend usar o prompt correto
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar mensagem')
      }

      const data = await response.json()
      let assistantMessage = data.response

      // Detectar se o usuário ou assistente mencionou imagens e buscar automaticamente
      const imageKeywords = ['imagem', 'foto', 'fotos', 'imagens', 'visual', 'elemento visual', 'gráfico', 'gráficos']
      const userWantsImages = imageKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword) || assistantMessage.toLowerCase().includes(keyword)
      )

      let foundImages: Array<{ id: string; url: string; thumbnail: string; source: string }> = []

      if (userWantsImages) {
        setIsSearchingImages(true)
        
        // Extrair termos de busca da mensagem
        let searchQuery = userMessage
          .toLowerCase()
          .replace(/(?:quero|preciso|buscar|adicionar|incluir|colocar|usar|adicionar|inserir)\s+/g, '')
          .replace(/(?:imagem|foto|fotos|imagens|visual|elemento visual|gráfico|gráficos)/g, '')
          .replace(/(?:de|para|com|que|a|o|as|os|em|no|na)/g, '')
          .trim()

        // Se não encontrou termos específicos, usar termos relacionados a nutricionistas
        if (!searchQuery || searchQuery.length < 3) {
          // Tentar extrair do contexto do assistente
          const contextMatch = assistantMessage.match(/(?:imagem|foto|gráfico)\s+(?:de|para)?\s*([^.]+)/i)
          if (contextMatch) {
            searchQuery = contextMatch[1].trim()
          } else {
            searchQuery = 'nutritionist professional consultation healthy lifestyle'
          }
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
              
              assistantMessage += `\n\n📸 Busquei ${foundImages.length} imagem(ns) relacionadas a "${searchQuery}". Selecione as que você quer adicionar à timeline:`
            }
          }
        } catch (error) {
          console.error('Erro ao buscar imagens:', error)
        } finally {
          setIsSearchingImages(false)
        }
      }

      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: assistantMessage,
        images: foundImages.length > 0 ? foundImages : undefined,
      }])

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Formatar mensagem removendo asteriscos e formatando corretamente
  // Função para pular vídeo para um timestamp específico
  const seekToTimestamp = (seconds: number) => {
    setCurrentTime(seconds)
    setIsPlaying(false) // Pausar ao pular
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
        
        // Regex para timestamps: "segundo 15.3", "15.3s", "15:03", "15.3", "15s"
        // Mais específico para evitar falsos positivos
        const timestampRegex = /(?:corte\s+(?:no|em|aos?)\s+)?(?:segundo\s+)?(\d+)(?:[:\.](\d+))?(?:\s*segundos?|\s*s)?/gi
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
            
            if (match[2]) {
              // Formato MM:SS ou MM.SS
              timestamp = parseInt(match[1]) * 60 + parseInt(match[2])
            } else {
              // Formato simples
              timestamp = parseFloat(match[1])
            }
            
            if (timestamp !== null && timestamp > 0) {
              allMatches.push({
                index: match.index,
                length: fullMatch.length,
                type: 'timestamp',
                content: fullMatch,
                timestamp,
              })
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

      // Verificar se tem negrito ou timestamps
      if (trimmedLine.includes('**') || /(?:segundo\s+)?\d+(?:[:\.]\d+)?(?:\s*s)?/i.test(trimmedLine)) {
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
                return (
                  <button
                    key={`timestamp-${lineIndex}-${partIndex}`}
                    onClick={() => seekToTimestamp(part.timestamp!)}
                    className="text-purple-600 hover:text-purple-800 underline font-semibold cursor-pointer transition-colors mx-0.5"
                    title={`Pular para ${part.timestamp.toFixed(1)}s`}
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
        const context = {
          hasAnalysis: !!videoAnalysis,
          hasClips: clips.length > 0,
          hasScript: script.length > 0,
          hasVideo: !!uploadedVideo,
          analysis: videoAnalysis
            ? {
                transcription: videoAnalysis.transcription,
                suggestions: videoAnalysis.suggestions,
                scriptStructure: videoAnalysis.scriptStructure,
              }
            : null,
        }

        const response = await authenticatedFetch('/api/creative-studio/editor-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            context,
          }),
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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header - Mobile Responsive */}
      <div className="p-2 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Assistente</h3>
          {isAnalyzing && (
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 animate-pulse" />
          )}
        </div>
        <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">
          {isAnalyzing ? 'Analisando vídeo...' : 'Converse comigo para melhorar seu vídeo'}
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
                <p className="text-xs font-medium text-gray-700 mb-2">
                  📸 Selecione as imagens que deseja adicionar à timeline:
                </p>
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Mobile Responsive */}
      <div className="p-2 sm:p-4 border-t border-gray-200">
        <div className="flex gap-1.5 sm:gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              // Ajustar altura automaticamente
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              const newHeight = Math.min(target.scrollHeight, 400)
              target.style.height = `${newHeight}px`
              
              // Scroll suave para o final se necessário
              if (target.scrollHeight > 400) {
                setTimeout(() => {
                  target.scrollTop = target.scrollHeight
                }, 0)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Digite sua mensagem..."
            rows={1}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed"
            disabled={isLoading}
            style={{
              minHeight: '48px',
              maxHeight: '400px',
              height: '48px',
              overflowY: 'auto',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
            ref={(textarea) => {
              if (textarea) {
                // Ajustar altura baseado no conteúdo sempre que o valor mudar
                textarea.style.height = 'auto'
                const newHeight = Math.min(textarea.scrollHeight, 400)
                textarea.style.height = `${newHeight}px`
                
                // Scroll para o final se necessário
                if (textarea.scrollHeight > 400) {
                  textarea.scrollTop = textarea.scrollHeight
                }
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
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


