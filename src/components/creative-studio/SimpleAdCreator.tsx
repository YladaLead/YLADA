'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Download, Play, Video as VideoIcon, Search } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { VideoPlayer } from './VideoPlayer'
import { VideoExporter } from './VideoExporter'
import { Timeline } from './Timeline'
import { HorizontalTimeline } from './HorizontalTimeline'
import { FileUploader } from './FileUploader'
import { ScriptReview } from './ScriptReview'
import { StoryboardView } from './StoryboardView'
import { ManualImageSearch } from './ManualImageSearch'
import { SceneImageSelector } from './SceneImageSelector'

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

        // Buscar imagens automaticamente para todas as cenas
        setPendingScript(adjustedScript)
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
            // Verificar se precisa de imagem YLADA
            const needsYladaImage = scene.imageDescription?.toLowerCase().includes('dashboard') ||
                                   scene.imageDescription?.toLowerCase().includes('ylada') ||
                                   scene.imageDescription?.toLowerCase().includes('marca') ||
                                   scene.imageDescription?.toLowerCase().includes('logo') ||
                                   scene.imageDescription?.toLowerCase().includes('plataforma') ||
                                   scene.imageDescription?.toLowerCase().includes('programilada')
            
            const shouldCreate = needsYladaImage ||
                               scene.imageDescription?.toLowerCase().includes('botão') ||
                               scene.imageDescription?.toLowerCase().includes('gráfico') ||
                               scene.imageDescription?.toLowerCase().includes('customizado')

            let imageUrl: string | null = null

            // Prioridade 1: Biblioteca YLADA (se necessário)
            if (needsYladaImage) {
              try {
                const yladaResponse = await authenticatedFetch('/api/creative-studio/search-media-library', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    query: scene.imageDescription,
                    area: 'nutri',
                    purpose: scene.number <= 2 ? 'hook' : scene.number <= 3 ? 'solucao' : 'cta',
                    mediaType: 'image',
                    count: 1,
                  }),
                })
                
                if (yladaResponse.ok) {
                  const yladaData = await yladaResponse.json()
                  if (yladaData.media && yladaData.media.length > 0) {
                    imageUrl = yladaData.media[0].file_url
                  }
                }
              } catch (err) {
                console.warn(`Erro ao buscar YLADA para CENA ${scene.number}:`, err)
              }
            }

            // Prioridade 2: Criar com DALL-E (se necessário e não encontrou YLADA)
            if (shouldCreate && !imageUrl) {
              try {
                const createResponse = await authenticatedFetch('/api/creative-studio/search-images', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    query: `Professional ${scene.imageDescription}, Instagram ads style, vertical 9:16, high quality, modern design`,
                    type: 'create',
                    count: 1,
                  }),
                })

                if (createResponse.ok) {
                  const createData = await createResponse.json()
                  if (createData.images?.[0]) {
                    imageUrl = createData.images[0].url
                  }
                }
              } catch (err) {
                console.warn(`Erro ao criar imagem para CENA ${scene.number}:`, err)
              }
            }

            // Prioridade 3: Buscar no Pexels/Biblioteca (se ainda não encontrou)
            if (!imageUrl) {
              try {
                // Tentar biblioteca própria primeiro
                const libraryResponse = await authenticatedFetch('/api/creative-studio/search-media-library', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    query: scene.imageDescription,
                    area: 'nutri',
                    purpose: scene.number <= 2 ? 'hook' : scene.number <= 3 ? 'solucao' : 'cta',
                    mediaType: 'image',
                    count: 1,
                  }),
                })
                
                if (libraryResponse.ok) {
                  const libraryData = await libraryResponse.json()
                  if (libraryData.media && libraryData.media.length > 0) {
                    imageUrl = libraryData.media[0].file_url
                  }
                }

                // Se não encontrou na biblioteca, buscar no Pexels
                if (!imageUrl) {
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
                }
              } catch (err) {
                console.warn(`Erro ao buscar imagem para CENA ${scene.number}:`, err)
              }
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
        imageResults.forEach(({ sceneNumber, imageUrl }) => {
          if (imageUrl) {
            newApprovedScenes.set(sceneNumber, [imageUrl])
          }
        })
        
        setApprovedScenes(newApprovedScenes)

        // Atualizar mensagem
        const foundCount = imageResults.filter(r => r.imageUrl).length
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1]
          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              content: `✅ Roteiro criado! Encontrei imagens para ${foundCount} de ${adjustedScript.scenes.length} cenas. Revise abaixo e ajuste se necessário.`,
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

    // Não buscar automaticamente - mostrar seletor de imagens por cena
    setCurrentSceneIndex(0)
    setApprovedScenes(new Map())
    
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `✅ Roteiro aprovado! Agora vamos escolher as imagens para cada cena.\n\nVocê pode:\n• Criar imagem com IA\n• Fazer upload da sua imagem\n• Aprovar a imagem sugerida`,
      },
    ])
  }

  const handleSceneImageApprove = async (sceneNumber: number, imageUrl: string) => {
    setApprovedScenes((prev) => {
      const newMap = new Map(prev)
      newMap.set(sceneNumber, imageUrl)
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
      
      for (const scene of scriptToUse.scenes) {
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
                mediaType: 'image',
                count: 1,
              }),
            })
            
            if (yladaResponse.ok) {
              const yladaData = await yladaResponse.json()
              if (yladaData.media && yladaData.media.length > 0) {
                images.push({
                  url: yladaData.media[0].file_url,
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
        
        if (shouldCreate && !imageFound) {
          // Criar com DALL-E
          console.log(`🎨 Criando imagem com DALL-E para CENA ${scene.number}`)
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
              if (imageData.images?.[0]) {
                images.push({
                  url: imageData.images[0].url,
                  sceneNumber: scene.number,
                  startTime: scene.startTime,
                  endTime: scene.endTime,
                })
                console.log(`✅ Imagem criada para CENA ${scene.number}`)
                imageFound = true
              } else {
                console.warn(`⚠️ Nenhuma imagem retornada para CENA ${scene.number}`)
              }
            } else {
              console.error(`❌ Erro ao criar imagem para CENA ${scene.number}`)
            }
          } catch (err) {
            console.error(`❌ Erro ao criar imagem para CENA ${scene.number}:`, err)
          }
        }
        
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
                mediaType: 'image',
                count: 1,
              }),
            })
            
            if (libraryResponse.ok) {
              const libraryData = await libraryResponse.json()
              if (libraryData.media && libraryData.media.length > 0) {
                images.push({
                  url: libraryData.media[0].file_url,
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
      const newClips = images.map((img, index) => {
        // Garantir duração mínima de 2.5 segundos e máxima de 3 segundos
        const duration = Math.max(2.5, Math.min(3, img.endTime - img.startTime))
        const adjustedStartTime = index === 0 ? 0 : images[index - 1].endTime
        const adjustedEndTime = adjustedStartTime + duration
        
        return {
          id: `img-${img.sceneNumber}-${Date.now()}-${index}`,
          startTime: adjustedStartTime,
          endTime: adjustedEndTime,
          source: img.url,
          type: 'image' as const,
        }
      })

      setClips(newClips)

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
      {/* LADO ESQUERDO - COMPACTO, TUDO VISÍVEL, SEM SCROLL */}
      <div className="w-[400px] flex-shrink-0 flex flex-col gap-3 overflow-hidden">
        {/* Preview */}
        <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Preview</h3>
          {clips.length > 0 ? (
            <div className="aspect-video bg-black rounded overflow-hidden">
              <VideoPlayer />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <p className="text-gray-400 text-xs text-center px-2">Nenhum clip na timeline</p>
            </div>
          )}
        </div>

        {/* Exportar */}
        <div className="flex-shrink-0">
          <VideoExporter />
        </div>

        {/* Timeline - Horizontal Estilo CapCut */}
        <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Timeline</h3>
          <div className="max-h-[200px] overflow-y-auto">
            <HorizontalTimeline />
          </div>
        </div>

        {/* Upload - Compacto */}
        <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-3">
          <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Adicionar Arquivos</h3>
          <div className="max-h-[100px] overflow-y-auto">
            <FileUploader />
          </div>
        </div>
      </div>

      {/* LADO DIREITO - CHAT COM SCROLL */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header do Chat */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Assistente</h3>
          </div>
          <p className="text-xs text-gray-600 mt-1">Digite o que você quer e eu crio tudo automaticamente</p>
          <button
            onClick={() => setShowManualSearch(!showManualSearch)}
            className="mt-2 px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            {showManualSearch ? 'Fechar' : 'Buscar Imagens Manualmente'}
          </button>
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
              {msg.script && (
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
                      const currentImages = newMap.get(sceneNumber) || []
                      // Adicionar nova imagem se não existir
                      if (!currentImages.includes(imageUrl)) {
                        newMap.set(sceneNumber, [...currentImages, imageUrl])
                      }
                      return newMap
                    })
                  }}
                  onImageRemove={(sceneNumber, imageIndex) => {
                    setApprovedScenes((prev) => {
                      const newMap = new Map(prev)
                      const currentImages = newMap.get(sceneNumber) || []
                      const updatedImages = currentImages.filter((_, idx) => idx !== imageIndex)
                      if (updatedImages.length > 0) {
                        newMap.set(sceneNumber, updatedImages)
                      } else {
                        newMap.delete(sceneNumber)
                      }
                      return newMap
                    })
                  }}
                  onCreateImage={async (sceneNumber, customPrompt) => {
                    const scene = msg.script?.scenes.find(s => s.number === sceneNumber)
                    if (!scene) return null
                    
                    const prompt = customPrompt || scene.imageDescription
                    try {
                      const imageResponse = await authenticatedFetch('/api/creative-studio/search-images', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          query: `Professional ${prompt}, Instagram ads style, vertical 9:16, high quality, modern design`,
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
                  }}
                  onUploadImage={async (sceneNumber, file) => {
                    return await handleUploadSceneImage(sceneNumber, file)
                  }}
                  onApprove={handleApproveScript}
                />
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
                  onUpload={(file) => {
                    const scene = pendingScript?.scenes[currentSceneIndex]
                    if (scene) {
                      handleUploadSceneImage(scene.number, file)
                    }
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
