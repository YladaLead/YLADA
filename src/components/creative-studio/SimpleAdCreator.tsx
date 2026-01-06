'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Download, Play, Video as VideoIcon, Search } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { VideoPlayer } from './VideoPlayer'
import { VideoExporter } from './VideoExporter'
import { VoiceGenerator } from './VoiceGenerator'
import { Timeline } from './Timeline'
import { HorizontalTimeline } from './HorizontalTimeline'
import { FileUploader } from './FileUploader'
import { ScriptReview } from './ScriptReview'
import { StoryboardView } from './StoryboardView'
import { ManualImageSearch } from './ManualImageSearch'
import { SceneImageSelector } from './SceneImageSelector'
import { ImagePromptGenerator } from './ImagePromptGenerator'
import { CaptionEditor } from './CaptionEditor'
import { AutoVideoBuilder } from './AutoVideoBuilder'
import { ResizablePanel } from './ResizablePanel'
import { SimpleVideoPreview } from './SimpleVideoPreview'
import { SimpleTimeline } from './SimpleTimeline'
import { SimpleOptions } from './SimpleOptions'
import { identifyDor, getSearchTermsForDor, getImagePromptForDor, type DorType } from '@/lib/creative-studio/dor-mapper'

interface Script {
  hook: string
  problem: string
  solution: string
  cta: string
  scenes: Array<{
    number: number
    startTime: number
    endTime: number
    text: string
    imageDescription: string
  }>
}

export function SimpleAdCreator() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; script?: Script }>>([
    {
      role: 'assistant',
      content: 'Olá! Sou especialista em criar anúncios para vender YLADA NUTRI.\n\n📝 **Como usar:**\n1. Digite o objetivo do anúncio (ex: "Criar anúncio sobre agenda vazia")\n2. Revise e aprove o roteiro\n3. Ajuste as imagens se necessário\n\n🎨 **Comandos para editar:**\n• "Tirar primeira imagem" ou "Remover segunda imagem"\n• "Duplicar primeira imagem" ou "Copiar última imagem"\n• "Mover primeira imagem para 5 segundos"\n• "Aumentar primeira imagem para 3 segundos"\n• "Buscar imagens" ou "Buscar imagens de nutricionista"\n\n✅ Timeline horizontal estilo CapCut! Arraste clips, ajuste duração, edite visualmente ou use comandos de voz.',
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [pendingScript, setPendingScript] = useState<Script | null>(null)
  const [showManualSearch, setShowManualSearch] = useState(false)
  const [approvedScenes, setApprovedScenes] = useState<Map<number, string[]>>(new Map())
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [missingImagePrompts, setMissingImagePrompts] = useState<Map<number, { prompt: string; dor: DorType; description: string }>>(new Map())
  const [autoSearchImages, setAutoSearchImages] = useState(false) // Modo "Só Roteiro" por padrão
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const authenticatedFetch = useAuthenticatedFetch()
  const { clips, addClip, setClips, deleteClip, duplicateClip, updateClip } = useCreativeStudioStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessageOriginal = input.trim()
    const userMessage = userMessageOriginal.toLowerCase()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessageOriginal }])
    
    // Detectar comandos de ajuste de imagens
    const imageClips = clips.filter(c => c.type === 'image')
    
    // Comandos para remover imagens
    const removePatterns = [
      /(?:tirar|remover|deletar|excluir)\s+(?:a\s+)?(?:primeira|1ª|1a)\s+imagem/i,
      /(?:tirar|remover|deletar|excluir)\s+(?:a\s+)?(?:segunda|2ª|2a)\s+imagem/i,
      /(?:tirar|remover|deletar|excluir)\s+(?:a\s+)?(?:terceira|3ª|3a)\s+imagem/i,
      /(?:tirar|remover|deletar|excluir)\s+(?:a\s+)?(?:quarta|4ª|4a)\s+imagem/i,
      /(?:tirar|remover|deletar|excluir)\s+(?:a\s+)?(?:quinta|5ª|5a)\s+imagem/i,
      /(?:tirar|remover|deletar|excluir)\s+(?:a\s+)?(?:última)\s+imagem/i,
    ]
    
    // Comandos para duplicar imagens
    const duplicatePatterns = [
      /(?:duplicar|copiar|repetir)\s+(?:a\s+)?(?:primeira|1ª|1a)\s+imagem/i,
      /(?:duplicar|copiar|repetir)\s+(?:a\s+)?(?:segunda|2ª|2a)\s+imagem/i,
      /(?:duplicar|copiar|repetir)\s+(?:a\s+)?(?:terceira|3ª|3a)\s+imagem/i,
      /(?:duplicar|copiar|repetir)\s+(?:a\s+)?(?:quarta|4ª|4a)\s+imagem/i,
      /(?:duplicar|copiar|repetir)\s+(?:a\s+)?(?:quinta|5ª|5a)\s+imagem/i,
      /(?:duplicar|copiar|repetir)\s+(?:a\s+)?(?:última)\s+imagem/i,
    ]
    
    // Comando para busca manual
    const manualSearchPatterns = [
      /(?:buscar|procurar|pesquisar)\s+imagens?\s+(?:de|sobre|para)?\s*(.+)/i,
      /(?:buscar|procurar|pesquisar)\s+(.+)\s+(?:imagens?|fotos?)/i,
      /(?:quero|preciso)\s+(?:de\s+)?imagens?\s+(?:de|sobre|para)?\s*(.+)/i,
    ]
    
    // Verificar se é comando de busca manual
    for (const pattern of manualSearchPatterns) {
      const match = userMessage.match(pattern)
      if (match) {
        setShowManualSearch(true)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `🔍 Abrindo busca manual de imagens. Use o painel abaixo para buscar e selecionar as imagens que deseja adicionar.`,
          },
        ])
        return
      }
    }
    
    // Comando simples para abrir busca
    if (/^(?:buscar|procurar|pesquisar)\s+imagens?$/i.test(userMessage)) {
      setShowManualSearch(true)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🔍 Busca manual de imagens aberta! Digite o que você quer buscar e selecione as imagens.`,
        },
      ])
      return
    }
    
    // Verificar se é comando de remover
    for (let i = 0; i < removePatterns.length; i++) {
      if (removePatterns[i].test(userMessage)) {
        let clipIndex = -1
        if (i === 0) clipIndex = 0 // primeira
        else if (i === 1) clipIndex = 1 // segunda
        else if (i === 2) clipIndex = 2 // terceira
        else if (i === 3) clipIndex = 3 // quarta
        else if (i === 4) clipIndex = 4 // quinta
        else if (i === 5) clipIndex = imageClips.length - 1 // última
        
        if (clipIndex >= 0 && clipIndex < imageClips.length) {
          const clipToRemove = imageClips[clipIndex]
          deleteClip(clipToRemove.id)
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `✅ Imagem ${clipIndex === imageClips.length - 1 ? 'última' : ['primeira', 'segunda', 'terceira', 'quarta', 'quinta'][clipIndex]} removida! Veja o preview atualizado à esquerda.`,
            },
          ])
          return
        }
      }
    }
    
    // Verificar se é comando de duplicar
    for (let i = 0; i < duplicatePatterns.length; i++) {
      if (duplicatePatterns[i].test(userMessage)) {
        let clipIndex = -1
        if (i === 0) clipIndex = 0 // primeira
        else if (i === 1) clipIndex = 1 // segunda
        else if (i === 2) clipIndex = 2 // terceira
        else if (i === 3) clipIndex = 3 // quarta
        else if (i === 4) clipIndex = 4 // quinta
        else if (i === 5) clipIndex = imageClips.length - 1 // última
        
        if (clipIndex >= 0 && clipIndex < imageClips.length) {
          const clipToDuplicate = imageClips[clipIndex]
          duplicateClip(clipToDuplicate.id)
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `✅ Imagem ${clipIndex === imageClips.length - 1 ? 'última' : ['primeira', 'segunda', 'terceira', 'quarta', 'quinta'][clipIndex]} duplicada! Veja o preview atualizado à esquerda.`,
            },
          ])
          return
        }
      }
    }

    // Comandos para mover clips na timeline
    const movePatterns = [
      /(?:mover|deslocar)\s+(?:a\s+)?(?:primeira|1ª|1a)\s+imagem\s+(?:para|até)\s+(\d+)\s*segundos?/i,
      /(?:mover|deslocar)\s+(?:a\s+)?(?:segunda|2ª|2a)\s+imagem\s+(?:para|até)\s+(\d+)\s*segundos?/i,
      /(?:mover|deslocar)\s+(?:a\s+)?(?:terceira|3ª|3a)\s+imagem\s+(?:para|até)\s+(\d+)\s*segundos?/i,
    ]

    for (let i = 0; i < movePatterns.length; i++) {
      const match = userMessage.match(movePatterns[i])
      if (match) {
        let clipIndex = i
        const targetTime = parseFloat(match[1])
        
        if (clipIndex >= 0 && clipIndex < imageClips.length) {
          const clip = imageClips[clipIndex]
          const duration = clip.endTime - clip.startTime
          updateClip(clip.id, {
            startTime: targetTime,
            endTime: targetTime + duration,
          })
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `✅ Imagem ${['primeira', 'segunda', 'terceira'][i]} movida para ${targetTime}s! Veja a timeline atualizada.`,
            },
          ])
          return
        }
      }
    }

    // Comandos para ajustar duração
    const durationPatterns = [
      /(?:aumentar|diminuir|ajustar)\s+(?:a\s+)?(?:primeira|1ª|1a)\s+imagem\s+(?:para|em)\s+(\d+(?:\.\d+)?)\s*segundos?/i,
      /(?:aumentar|diminuir|ajustar)\s+(?:a\s+)?(?:segunda|2ª|2a)\s+imagem\s+(?:para|em)\s+(\d+(?:\.\d+)?)\s*segundos?/i,
    ]

    for (let i = 0; i < durationPatterns.length; i++) {
      const match = userMessage.match(durationPatterns[i])
      if (match) {
        let clipIndex = i
        const newDuration = parseFloat(match[1])
        
        if (clipIndex >= 0 && clipIndex < imageClips.length) {
          const clip = imageClips[clipIndex]
          updateClip(clip.id, {
            endTime: clip.startTime + newDuration,
          })
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `✅ Duração da imagem ${['primeira', 'segunda'][i]} ajustada para ${newDuration}s!`,
            },
          ])
          return
        }
      }
    }
    
    setIsLoading(true)

    try {
      // Gerar roteiro automaticamente
      const scriptResponse = await authenticatedFetch('/api/creative-studio/generate-ad-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: 'nutri',
          purpose: 'quick-ad',
          objective: userMessageOriginal,
        }),
      })

      if (scriptResponse.ok) {
        const scriptData = await scriptResponse.json()
        const script = scriptData.script

        // Ajustar timing das cenas para 2-3 segundos cada
        const adjustedScenes = script.scenes.map((scene: any, index: number) => {
          const duration = 2.5 // 2.5 segundos por cena
          const startTime = index * duration
          const endTime = startTime + duration
          return {
            ...scene,
            startTime: Math.round(startTime * 10) / 10,
            endTime: Math.round(endTime * 10) / 10,
          }
        })

        const adjustedScript = {
          ...script,
          scenes: adjustedScenes,
        }

        // Definir script pendente
        setPendingScript(adjustedScript)
        
        // Se autoSearchImages estiver desativado, apenas mostrar roteiro
        if (!autoSearchImages) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `✅ Roteiro criado! ${adjustedScript.scenes.length} cenas prontas.\n\n📝 **Modo Manual Ativado:** Você pode adicionar imagens manualmente usando:\n• Botão "Buscar Imagens Manualmente" acima\n• Ou adicionar imagens diretamente nas cenas abaixo\n\n💡 Dica: Ative "Buscar Imagens Automaticamente" se quiser que o sistema busque por você.`,
              script: adjustedScript,
            },
          ])
          setIsLoading(false)
          return
        }

        // Buscar imagens automaticamente para todas as cenas (só se autoSearchImages estiver ativo)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `✅ Roteiro criado! Buscando imagens automaticamente para todas as cenas...`,
            script: adjustedScript,
          },
        ])

        // Buscar imagens para cada cena em paralelo
        const imagePromises = adjustedScript.scenes.map(async (scene: any) => {
          try {
            // Verificar se precisa de imagem YLADA (dashboard, logo, etc)
            const needsYladaImage = scene.imageDescription?.toLowerCase().includes('dashboard') ||
                                   scene.imageDescription?.toLowerCase().includes('ylada') ||
                                   scene.imageDescription?.toLowerCase().includes('marca') ||
                                   scene.imageDescription?.toLowerCase().includes('logo') ||
                                   scene.imageDescription?.toLowerCase().includes('plataforma') ||
                                   scene.imageDescription?.toLowerCase().includes('programilada')

            let imageUrl: string | null = null
            const newMissingPrompts = new Map(missingImagePrompts)

            // PRIORIDADE 1: Biblioteca YLADA (se necessário para dashboard/logo)
            if (needsYladaImage) {
              try {
                const yladaResponse = await authenticatedFetch('/api/creative-studio/search-media-library', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    query: scene.imageDescription,
                    area: 'nutri',
                    purpose: scene.number <= 2 ? 'hook' : scene.number <= 3 ? 'solucao' : 'cta',
                    type: 'image',
                    count: 1,
                  }),
                })
                
                if (yladaResponse.ok) {
                  const yladaData = await yladaResponse.json()
                  if (yladaData.images && yladaData.images.length > 0) {
                    imageUrl = yladaData.images[0].url
                  }
                }
              } catch (err) {
                console.warn(`Erro ao buscar YLADA para CENA ${scene.number}:`, err)
              }
            }

            // PRIORIDADE 2: Buscar no acervo próprio (Envato) usando mapeamento de dores
            if (!imageUrl) {
              try {
                // Identificar a dor da cena
                const dor = identifyDor(scene.imageDescription || scene.text || '')
                const searchTerms = getSearchTermsForDor(dor)
                
                // Tentar buscar com termos específicos da dor
                let libraryResponse = null
                for (const term of searchTerms.slice(0, 3)) { // Tentar até 3 termos
                  libraryResponse = await authenticatedFetch('/api/creative-studio/search-media-library', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      query: term,
                      area: 'nutri',
                      purpose: scene.number <= 2 ? 'hook' : scene.number <= 3 ? 'solucao' : 'cta',
                      type: 'image',
                      count: 1,
                    }),
                  })
                  
                  if (libraryResponse.ok) {
                    const libraryData = await libraryResponse.json()
                    if (libraryData.images && libraryData.images.length > 0) {
                      imageUrl = libraryData.images[0].url
                      break // Encontrou, parar busca
                    }
                  }
                }

                // Se não encontrou com termos específicos, tentar com descrição original
                if (!imageUrl) {
                  libraryResponse = await authenticatedFetch('/api/creative-studio/search-media-library', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      query: scene.imageDescription,
                      area: 'nutri',
                      purpose: scene.number <= 2 ? 'hook' : scene.number <= 3 ? 'solucao' : 'cta',
                      type: 'image',
                      count: 1,
                    }),
                  })
                  
                  if (libraryResponse.ok) {
                    const libraryData = await libraryResponse.json()
                    if (libraryData.images && libraryData.images.length > 0) {
                      imageUrl = libraryData.images[0].url
                    }
                  }
                }
              } catch (err) {
                console.warn(`Erro ao buscar no acervo para CENA ${scene.number}:`, err)
              }
            }

            // PRIORIDADE 3: Buscar no Pexels (gratuito) como fallback
            if (!imageUrl) {
              try {
                const pexelsResponse = await authenticatedFetch('/api/creative-studio/search-images', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    query: scene.imageDescription,
                    type: 'search',
                    count: 1,
                  }),
                })

                if (pexelsResponse.ok) {
                  const pexelsData = await pexelsResponse.json()
                  if (pexelsData.images?.[0]) {
                    imageUrl = pexelsData.images[0].url
                  }
                }
              } catch (err) {
                console.warn(`Erro ao buscar no Pexels para CENA ${scene.number}:`, err)
              }
            }

            // PRIORIDADE 4: Se não encontrou em lugar nenhum, gerar prompt para ChatGPT
            // NÃO criar automaticamente com DALL-E (economia de créditos)
            if (!imageUrl) {
              const dor = identifyDor(scene.imageDescription || scene.text || '')
              const prompt = getImagePromptForDor(dor, scene.imageDescription)
              newMissingPrompts.set(scene.number, {
                prompt,
                dor,
                description: scene.imageDescription || scene.text || ''
              })
            }

            return { sceneNumber: scene.number, imageUrl }
          } catch (error) {
            console.error(`Erro ao processar CENA ${scene.number}:`, error)
            return { sceneNumber: scene.number, imageUrl: null }
          }
        })

        // Aguardar todas as buscas
        const imageResults = await Promise.all(imagePromises)
        
        // Adicionar imagens encontradas como sugestões
        const newApprovedScenes = new Map<number, string[]>()
        const newMissingPrompts = new Map<number, { prompt: string; dor: DorType; description: string }>()
        
        imageResults.forEach(({ sceneNumber, imageUrl }) => {
          if (imageUrl) {
            newApprovedScenes.set(sceneNumber, [imageUrl])
          }
        })
        
        // Coletar prompts de cenas sem imagem
        adjustedScript.scenes.forEach((scene: any) => {
          if (!newApprovedScenes.has(scene.number)) {
            const dor = identifyDor(scene.imageDescription || scene.text || '')
            const prompt = getImagePromptForDor(dor, scene.imageDescription)
            newMissingPrompts.set(scene.number, {
              prompt,
              dor,
              description: scene.imageDescription || scene.text || ''
            })
          }
        })
        
        setApprovedScenes(newApprovedScenes)
        setMissingImagePrompts(newMissingPrompts)

        // Atualizar mensagem
        const foundCount = imageResults.filter(r => r.imageUrl).length
        const missingCount = adjustedScript.scenes.length - foundCount
        
        let messageContent = `✅ Roteiro criado! Encontrei imagens para ${foundCount} de ${adjustedScript.scenes.length} cenas.`
        
        if (missingCount > 0) {
          messageContent += `\n\n⚠️ ${missingCount} cena(s) não encontrou imagem no acervo. Veja abaixo os prompts para gerar no ChatGPT.`
        }
        
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1]
          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              content: messageContent,
            },
          ]
        })
        
        setIsLoading(false)
        return
      }
    } catch (error) {
      console.error('Erro:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Erro ao criar anúncio. Tente novamente.',
        },
      ])
      setIsLoading(false)
    }
  }

  const handleApproveScript = async () => {
    if (!pendingScript) return

    // 1. Auto-preencher legendas com os textos das cenas
    const { addCaption } = useCreativeStudioStore.getState()
    
    pendingScript.scenes.forEach((scene: any) => {
      // Determinar estilo baseado no tipo de cena
      let style: 'hook' | 'dor' | 'solucao' | 'cta' | 'default' = 'default'
      const textLower = scene.text.toLowerCase()
      if (textLower.includes('agenda') || textLower.includes('vazia') || textLower.includes('frustração')) {
        style = 'dor'
      } else if (textLower.includes('ylada') || textLower.includes('solução') || textLower.includes('organiza')) {
        style = 'solucao'
      } else if (textLower.includes('acesse') || textLower.includes('comece') || textLower.includes('mudar')) {
        style = 'cta'
      }
      
      addCaption({
        id: `auto-caption-${scene.number}-${Date.now()}`,
        text: scene.text,
        startTime: scene.startTime,
        endTime: scene.endTime,
        style,
        position: 'center',
        animation: 'fade-in',
        highlightWords: [],
      })
    })

    // 2. Verificar se já tem imagens aprovadas para todas as cenas
    const allScenesHaveImages = pendingScript.scenes.every((scene: any) => {
      const sceneImages = approvedScenes.get(scene.number)
      return sceneImages && Array.isArray(sceneImages) && sceneImages.length > 0
    })

    // 3. Se já tem imagens em todas as cenas, montar vídeo diretamente
    if (allScenesHaveImages) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ Todas as cenas já têm imagens! Legendas criadas automaticamente. Montando vídeo agora...`,
        },
      ])
      handleFinalizeVideo()
      return
    }

    // 4. Se não tem todas as imagens, mostrar seletor por cena
    setCurrentSceneIndex(0)
    
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `✅ Roteiro aprovado! Legendas criadas automaticamente.\n\nAgora vamos escolher as imagens para cada cena.\n\nVocê pode:\n• Criar imagem com IA\n• Fazer upload da sua imagem\n• Aprovar a imagem sugerida`,
      },
    ])
  }

  const handleSceneImageApprove = async (sceneNumber: number, imageUrl: string) => {
    setApprovedScenes((prev) => {
      const newMap = new Map(prev)
      newMap.set(sceneNumber, [imageUrl])
      return newMap
    })

    // Avançar para próxima cena
    if (pendingScript && currentSceneIndex < pendingScript.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1)
    } else {
      // Todas as cenas aprovadas, montar vídeo
      handleFinalizeVideo()
    }
  }

  const handleCreateSceneImage = async (scene: any): Promise<string | null> => {
    try {
      const imageResponse = await authenticatedFetch('/api/creative-studio/search-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Professional ${scene.imageDescription}, Instagram ads style, vertical 9:16, high quality, modern design`,
          type: 'create',
          count: 1,
        }),
      })

      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        return imageData.images?.[0]?.url || null
      }
      return null
    } catch (error) {
      console.error('Erro ao criar imagem:', error)
      return null
    }
  }

  const handleUploadSceneImage = async (sceneNumber: number, file: File): Promise<string | null> => {
    try {
      // Criar FormData para upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('area', 'nutri')
      formData.append('purpose', 'quick-ad')

      const uploadResponse = await authenticatedFetch('/api/creative-studio/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {
        const data = await uploadResponse.json()
        return data.url || null
      }
      return null
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      return null
    }
  }

  const handleFinalizeVideo = async () => {
    if (!pendingScript) return

    setIsLoading(true)
    const scriptToUse = pendingScript
    setPendingScript(null)

    try {
      // Adicionar imagens aprovadas primeiro (suporta múltiplas imagens por cena)
      const images: Array<{ url: string; sceneNumber: number; startTime: number; endTime: number }> = []
      
      // Ordenar cenas por número para garantir ordem correta
      const sortedScenes = [...scriptToUse.scenes].sort((a, b) => a.number - b.number)
      
      for (const scene of sortedScenes) {
        const approvedImages = approvedScenes.get(scene.number)
        if (approvedImages && approvedImages.length > 0) {
          // Se tem múltiplas imagens, dividir o tempo da cena entre elas
          const sceneDuration = scene.endTime - scene.startTime
          const imageDuration = sceneDuration / approvedImages.length
          
          approvedImages.forEach((imageUrl, idx) => {
            const imageStartTime = scene.startTime + (idx * imageDuration)
            const imageEndTime = scene.startTime + ((idx + 1) * imageDuration)
            
            images.push({
              url: imageUrl,
              sceneNumber: scene.number,
              startTime: imageStartTime,
              endTime: imageEndTime,
            })
          })
        }
      }
      
      console.log(`📸 Imagens aprovadas coletadas: ${images.length} imagens de ${approvedScenes.size} cenas`)

      // Buscar imagens para cenas que não foram aprovadas
      for (let i = 0; i < scriptToUse.scenes.length; i++) {
        const scene = scriptToUse.scenes[i]
        
        // Pular se já foi aprovada
        if (approvedScenes.has(scene.number)) {
          continue
        }
        
        console.log(`🔍 [${i + 1}/${scriptToUse.scenes.length}] Buscando imagem para CENA ${scene.number}: ${scene.imageDescription}`)
        
        let imageFound = false
        
        // Verificar se precisa de imagem YLADA (dashboard, marca, logo, plataforma)
        const needsYladaImage = scene.imageDescription?.toLowerCase().includes('dashboard') ||
                               scene.imageDescription?.toLowerCase().includes('ylada') ||
                               scene.imageDescription?.toLowerCase().includes('marca') ||
                               scene.imageDescription?.toLowerCase().includes('logo') ||
                               scene.imageDescription?.toLowerCase().includes('plataforma') ||
                               scene.imageDescription?.toLowerCase().includes('programilada')
        
        // Verificar se precisa criar com IA (botão, gráfico customizado, etc)
        const shouldCreate = needsYladaImage ||
                             scene.imageDescription?.toLowerCase().includes('botão') ||
                             scene.imageDescription?.toLowerCase().includes('gráfico') ||
                             scene.imageDescription?.toLowerCase().includes('customizado')
        
        if (needsYladaImage && !imageFound) {
          // Primeiro, tentar buscar na biblioteca YLADA
          try {
            const yladaResponse = await authenticatedFetch('/api/creative-studio/search-media-library', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: scene.imageDescription,
                area: 'nutri',
                purpose: scene.number <= 2 ? 'hook' : scene.number <= 3 ? 'solucao' : 'cta',
                type: 'image',
                count: 1,
              }),
            })
            
            if (yladaResponse.ok) {
              const yladaData = await yladaResponse.json()
              if (yladaData.images && yladaData.images.length > 0) {
                images.push({
                  url: yladaData.images[0].url,
                  sceneNumber: scene.number,
                  startTime: scene.startTime,
                  endTime: scene.endTime,
                })
                console.log(`✅ Imagem YLADA encontrada para CENA ${scene.number}`)
                imageFound = true
              }
            }
          } catch (err) {
            console.warn(`⚠️ Erro ao buscar imagem YLADA para CENA ${scene.number}:`, err)
          }
        }
        
        // REMOVIDO: Criação automática com DALL-E
        // Agora o sistema gera prompt para ChatGPT ao invés de criar automaticamente
        // Isso economiza créditos e dá controle ao usuário
        
        if (!imageFound) {
          // Buscar no Pexels ou biblioteca própria
          console.log(`🔍 Buscando imagem no Pexels para CENA ${scene.number}`)
          
          // Primeiro tentar biblioteca própria
          try {
            const libraryResponse = await authenticatedFetch('/api/creative-studio/search-media-library', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: scene.imageDescription,
                area: 'nutri',
                purpose: scene.number <= 2 ? 'hook' : scene.number <= 3 ? 'solucao' : 'cta',
                type: 'image',
                count: 1,
              }),
            })
            
            if (libraryResponse.ok) {
              const libraryData = await libraryResponse.json()
              if (libraryData.images && libraryData.images.length > 0) {
                images.push({
                  url: libraryData.images[0].url,
                  sceneNumber: scene.number,
                  startTime: scene.startTime,
                  endTime: scene.endTime,
                })
                console.log(`✅ Imagem da biblioteca encontrada para CENA ${scene.number}`)
                imageFound = true
              }
            }
          } catch (err) {
            console.warn(`⚠️ Erro ao buscar na biblioteca para CENA ${scene.number}:`, err)
          }
          
          // Se não encontrou na biblioteca, buscar no Pexels
          if (!imageFound) {
            const searchQuery = scene.imageDescription
              ?.toLowerCase()
              .replace(/nutricionista/gi, 'nutritionist')
              .replace(/preocupada/gi, 'worried stressed')
              .replace(/pensativa/gi, 'thoughtful')
              .replace(/confiante/gi, 'confident')
              .replace(/agenda/gi, 'calendar')
              .replace(/celular/gi, 'phone')
              .replace(/instagram/gi, 'instagram')
              .replace(/notebook/gi, 'laptop')
              .replace(/computador/gi, 'laptop computer')
              .replace(/sorrindo/gi, 'smiling')
              .replace(/feliz/gi, 'happy')
              .replace(/desanimada/gi, 'discouraged unmotivated') || 'nutritionist professional'

            try {
              const imageResponse = await authenticatedFetch('/api/creative-studio/search-images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  query: searchQuery,
                  type: 'search',
                  count: 1,
                }),
              })

              if (imageResponse.ok) {
                const imageData = await imageResponse.json()
                if (imageData.images?.[0]) {
                  images.push({
                    url: imageData.images[0].url,
                    sceneNumber: scene.number,
                    startTime: scene.startTime,
                    endTime: scene.endTime,
                  })
                  console.log(`✅ Imagem encontrada no Pexels para CENA ${scene.number}`)
                  imageFound = true
                } else {
                  console.warn(`⚠️ Nenhuma imagem retornada do Pexels para CENA ${scene.number}`)
                }
              } else {
                console.error(`❌ Erro ao buscar imagem no Pexels para CENA ${scene.number}`)
              }
            } catch (err) {
              console.error(`❌ Erro ao buscar imagem no Pexels para CENA ${scene.number}:`, err)
            }
          }
        }
        
        if (!imageFound) {
          console.error(`❌ NENHUMA IMAGEM ENCONTRADA PARA CENA ${scene.number} - Usando placeholder`)
        }
      }
        
        console.log(`📊 Total de imagens encontradas: ${images.length} de ${scriptToUse.scenes.length}`)

      // Adicionar imagens à timeline com duração garantida de 2-3 segundos
      // IMPORTANTE: Manter os tempos originais das cenas, não recalcular
      const newClips = images.map((img, index) => {
        // Usar os tempos originais da cena, garantindo duração mínima de 2.5s
        const originalDuration = img.endTime - img.startTime
        const duration = Math.max(2.5, originalDuration)
        const adjustedStartTime = img.startTime
        const adjustedEndTime = adjustedStartTime + duration
        
        return {
          id: `img-${img.sceneNumber}-${Date.now()}-${index}`,
          startTime: adjustedStartTime,
          endTime: adjustedEndTime,
          source: img.url,
          type: 'image' as const,
        }
      })
      
      // Ordenar clips por startTime para garantir ordem correta
      newClips.sort((a, b) => a.startTime - b.startTime)
      
      console.log(`🎬 Clips criados:`, newClips.map(c => ({
        id: c.id,
        start: c.startTime,
        end: c.endTime,
        duration: c.endTime - c.startTime,
        source: c.source.substring(0, 50) + '...'
      })))

      setClips(newClips)

      // Limpar estados após montar o vídeo
      setPendingScript(null)
      setCurrentSceneIndex(0)
      setApprovedScenes(new Map())

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🎬 Vídeo montado! ${images.length} imagem(ns) adicionadas na timeline.\n\n✅ Cada imagem dura 2.5 segundos para manter o ritmo dinâmico do anúncio.\n\nVeja o preview à esquerda e use "Exportar Vídeo" para baixar.`,
        },
      ])
    } catch (error) {
      console.error('Erro ao buscar imagens:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Erro ao buscar imagens. Tente novamente.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditScene = (sceneNumber: number, newText: string) => {
    if (!pendingScript) return
    const updatedScenes = pendingScript.scenes.map((scene) =>
      scene.number === sceneNumber ? { ...scene, text: newText } : scene
    )
    const updatedScript = { ...pendingScript, scenes: updatedScenes }
    setPendingScript(updatedScript)
    
    // Atualizar também na mensagem que contém o script
    setMessages((prev) =>
      prev.map((msg) =>
        msg.script && msg.script.scenes.some((s: any) => s.number === sceneNumber)
          ? { ...msg, script: updatedScript }
          : msg
      )
    )
    
    // Sugerir buscar nova imagem para a cena editada
    const editedScene = updatedScenes.find((s) => s.number === sceneNumber)
    if (editedScene) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ Texto da CENA ${sceneNumber} atualizado!\n\n💡 Dica: Após aprovar, o sistema buscará uma nova imagem baseada na descrição: "${editedScene.imageDescription}"`,
        },
      ])
    }
  }

  const handleDeleteScene = (sceneNumber: number) => {
    if (!pendingScript) return
    const updatedScenes = pendingScript.scenes.filter((scene) => scene.number !== sceneNumber)
    setPendingScript({ ...pendingScript, scenes: updatedScenes })
  }

  return (
    <div className="h-full flex gap-4 overflow-hidden">
      {/* LADO ESQUERDO - REDIMENSIONÁVEL */}
      <ResizablePanel defaultWidth={400} minWidth={300} maxWidth={800}>
        {/* Preview Simplificado */}
        <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Preview do Vídeo</h3>
          <SimpleVideoPreview />
        </div>

        {/* Opções Simples */}
        <div className="flex-shrink-0">
          <SimpleOptions />
        </div>

        {/* Montagem Automática - NOVO MODO SIMPLIFICADO */}
        <div className="flex-shrink-0">
          <AutoVideoBuilder 
            script={pendingScript || undefined}
            images={Array.from(approvedScenes.values()).flat()}
          />
        </div>

        {/* Gerador de Voz */}
        <div className="flex-shrink-0">
          <VoiceGenerator />
        </div>

        {/* Timeline Simplificada */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <SimpleTimeline />
        </div>

        {/* Editor de Legendas */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Legendas</h3>
          <div className="max-h-[250px] overflow-y-auto">
            <CaptionEditor />
          </div>
        </div>

        {/* Upload - Compacto */}
        <div className="bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Adicionar Arquivos</h3>
          <div className="max-h-[100px] overflow-y-auto">
            <FileUploader />
          </div>
        </div>
      </ResizablePanel>

      {/* LADO DIREITO - CHAT COM SCROLL */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header do Chat */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Assistente</h3>
          </div>
          <p className="text-xs text-gray-600 mt-1">Digite o que você quer e eu crio tudo automaticamente</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowManualSearch(!showManualSearch)}
              className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium flex items-center gap-1"
            >
              <Search className="w-3 h-3" />
              {showManualSearch ? 'Fechar' : 'Buscar Imagens Manualmente'}
            </button>
            <button
              onClick={() => setAutoSearchImages(!autoSearchImages)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium flex items-center gap-1 ${
                autoSearchImages
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {autoSearchImages ? (
                <>
                  <span>✓</span> Busca Automática Ativa
                </>
              ) : (
                <>
                  <span>○</span> Só Roteiro (Manual)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mensagens - Scroll Independente */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-4">
              <div
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
              {msg.script && !pendingScript && (
                <>
                  <StoryboardView
                    script={msg.script}
                    approvedImages={approvedScenes}
                    onTextChange={(sceneNumber, newText) => {
                      handleEditScene(sceneNumber, newText)
                      // Atualizar o script na mensagem também
                      setMessages((prev) =>
                        prev.map((m) => {
                          if (m.script && m.script.scenes.some((s: any) => s.number === sceneNumber)) {
                            const updatedScenes = m.script.scenes.map((s: any) =>
                              s.number === sceneNumber ? { ...s, text: newText } : s
                            )
                            return { ...m, script: { ...m.script, scenes: updatedScenes } }
                          }
                          return m
                        })
                      )
                    }}
                  onImageSelect={(sceneNumber, imageUrl) => {
                    setApprovedScenes((prev) => {
                      const newMap = new Map(prev)
                      const currentImagesRaw = newMap.get(sceneNumber)
                      const currentImages = Array.isArray(currentImagesRaw) ? currentImagesRaw : []
                      // Adicionar nova imagem se não existir
                      if (!currentImages.includes(imageUrl)) {
                        newMap.set(sceneNumber, [...currentImages, imageUrl])
                      }
                      return newMap
                    })
                  }}
                    onCreateImage={async (sceneNumber, customPrompt) => {
                      // NÃO criar automaticamente - retornar null para forçar uso do prompt
                      return null
                    }}
                    onUploadImage={async (sceneNumber, file) => {
                      return await handleUploadSceneImage(sceneNumber, file)
                    }}
                    onApprove={handleApproveScript}
                  />
                  
                  {/* Mostrar prompts para cenas sem imagem */}
                  {Array.from(missingImagePrompts.entries()).map(([sceneNumber, { prompt, dor, description }]) => {
                    const scene = msg.script?.scenes.find((s: any) => s.number === sceneNumber)
                    if (!scene) return null
                    
                    return (
                      <div key={sceneNumber} className="mt-4">
                        <ImagePromptGenerator
                          sceneDescription={description}
                          sceneNumber={sceneNumber}
                          onPromptGenerated={(generatedPrompt, dorType) => {
                            // Opcional: salvar prompt gerado
                            console.log(`Prompt gerado para CENA ${sceneNumber}:`, generatedPrompt)
                          }}
                          onUploadImage={async (file) => {
                            return await handleUploadSceneImage(sceneNumber, file)
                          }}
                          onCreateWithYaki={async (prompt) => {
                            // Criar imagem com Yaki usando o prompt
                            try {
                              const imageResponse = await authenticatedFetch('/api/creative-studio/search-images', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  query: prompt,
                                  type: 'create',
                                  count: 1,
                                }),
                              })
                              
                              if (imageResponse.ok) {
                                const imageData = await imageResponse.json()
                                const imageUrl = imageData.images?.[0]?.url || null
                                
                                // Adicionar automaticamente à cena se criou com sucesso
                                if (imageUrl) {
                                  setApprovedScenes((prev) => {
                                    const newMap = new Map(prev)
                                    const currentImages = newMap.get(sceneNumber) || []
                                    if (!currentImages.includes(imageUrl)) {
                                      newMap.set(sceneNumber, [...currentImages, imageUrl])
                                    }
                                    return newMap
                                  })
                                }
                                
                                return imageUrl
                              }
                              return null
                            } catch (error) {
                              console.error('Erro ao criar com Yaki:', error)
                              return null
                            }
                          }}
                          onEditImage={(imageUrl) => {
                            // Abrir editor de imagem (pode ser um modal ou redirecionar)
                            // Por enquanto, apenas adiciona à cena
                            setApprovedScenes((prev) => {
                              const newMap = new Map(prev)
                              const currentImages = newMap.get(sceneNumber) || []
                              if (!currentImages.includes(imageUrl)) {
                                newMap.set(sceneNumber, [...currentImages, imageUrl])
                              }
                              return newMap
                            })
                          }}
                        />
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          ))}
          
          {/* Seletor de Imagens por Cena */}
          {pendingScript && currentSceneIndex < pendingScript.scenes.length && (
            <div className="mt-4">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
                <h4 className="font-semibold text-purple-900 mb-1">
                  Escolha a imagem para cada cena
                </h4>
                <p className="text-sm text-purple-700">
                  Cena {currentSceneIndex + 1} de {pendingScript.scenes.length}
                </p>
              </div>
              <SceneImageSelector
                scene={pendingScript.scenes[currentSceneIndex]}
                onApprove={(imageUrl) => handleSceneImageApprove(pendingScript.scenes[currentSceneIndex].number, imageUrl)}
                onCreateWithAI={() => handleCreateSceneImage(pendingScript.scenes[currentSceneIndex])}
                onUpload={async (file) => {
                  const scene = pendingScript?.scenes[currentSceneIndex]
                  if (scene) {
                    return await handleUploadSceneImage(scene.number, file)
                  }
                  return null
                }}
                onSkip={() => {
                  if (currentSceneIndex < pendingScript.scenes.length - 1) {
                    setCurrentSceneIndex(currentSceneIndex + 1)
                  } else {
                    handleFinalizeVideo()
                  }
                }}
              />
            </div>
          )}
          
          {/* Busca Manual de Imagens */}
          {showManualSearch && (
            <div className="mt-4">
              <ManualImageSearch
                onClose={() => {
                  setShowManualSearch(false)
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: 'assistant',
                      content: '✅ Imagens adicionadas! Veja o preview à esquerda atualizado.',
                    },
                  ])
                }}
              />
            </div>
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Fixo */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Digite o que você quer no anúncio..."
              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Criar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
