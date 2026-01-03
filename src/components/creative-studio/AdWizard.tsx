'use client'

import { useState, useEffect } from 'react'
import { Check, X, Edit2, RefreshCw, Download, Play, ArrowRight, ArrowLeft, Loader2, Sparkles, Image as ImageIcon, Video } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'

interface AdWizardProps {
  area: 'nutri'
  purpose?: 'quick-ad'
  objective?: string
}

type WizardStep = 'script' | 'images' | 'video'

interface ScriptData {
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

interface ImageData {
  sceneNumber: number
  url: string
  thumbnail: string
  source: 'pexels' | 'dalle'
  prompt?: string
}

export function AdWizard({ area = 'nutri', purpose = 'quick-ad', objective }: AdWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('script')
  const [isGenerating, setIsGenerating] = useState(false)
  const authenticatedFetch = useAuthenticatedFetch()
  
  // Estado do roteiro
  const [script, setScript] = useState<ScriptData | null>(null)
  const [scriptApproved, setScriptApproved] = useState(false)
  const [scriptEdit, setScriptEdit] = useState('')
  
  // Auto-gerar roteiro ao montar componente (apenas uma vez)
  useEffect(() => {
    if (!script && !isGenerating) {
      handleGenerateScript()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Estado das imagens
  const [images, setImages] = useState<ImageData[]>([])
  const [imagesApproved, setImagesApproved] = useState(false)
  const [selectedImages, setSelectedImages] = useState<Record<number, string>>({})
  
  // Estado do vídeo
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)

  // ETAPA 1: Gerar Roteiro
  const handleGenerateScript = async () => {
    setIsGenerating(true)
    try {
      const response = await authenticatedFetch('/api/creative-studio/generate-ad-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: 'nutri',
          purpose: 'quick-ad',
          objective: objective || 'Criar anúncio para vender YLADA NUTRI para nutricionistas com agenda vazia',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setScript(data.script)
        setScriptEdit(JSON.stringify(data.script, null, 2))
      }
    } catch (error) {
      console.error('Erro ao gerar roteiro:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleApproveScript = () => {
    if (scriptEdit) {
      try {
        const parsed = JSON.parse(scriptEdit)
        setScript(parsed)
      } catch {
        // Se não for JSON válido, manter o original
      }
    }
    setScriptApproved(true)
    setCurrentStep('images')
  }

  // ETAPA 2: Buscar/Criar Imagens
  const handleGenerateImages = async () => {
    if (!script) return
    
    setIsGenerating(true)
    const newImages: ImageData[] = []
    
    for (const scene of script.scenes) {
      try {
        // Decidir automaticamente: buscar ou criar?
        const shouldCreate = scene.imageDescription.includes('dashboard') || 
                           scene.imageDescription.includes('interface') ||
                           scene.imageDescription.includes('YLADA') ||
                           scene.imageDescription.includes('marca')
        
        if (shouldCreate) {
          // Criar com DALL-E
          const response = await authenticatedFetch('/api/creative-studio/search-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `Professional ${scene.imageDescription}, Instagram ads style, vertical 9:16, high quality`,
              type: 'create',
              count: 1,
            }),
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.images && data.images.length > 0) {
              newImages.push({
                sceneNumber: scene.number,
                url: data.images[0].url,
                thumbnail: data.images[0].url,
                source: 'dalle',
                prompt: scene.imageDescription,
              })
            }
          }
        } else {
          // Buscar no Pexels
          const searchQuery = scene.imageDescription
            .toLowerCase()
            .replace(/nutricionista/gi, 'nutritionist')
            .replace(/preocupada/gi, 'worried stressed')
            .replace(/pensativa/gi, 'thoughtful')
            .replace(/confiante/gi, 'confident')
            .replace(/agenda/gi, 'calendar')
            .replace(/celular/gi, 'phone')
            .replace(/instagram/gi, 'instagram')
            .replace(/notebook/gi, 'laptop')
          
          const response = await authenticatedFetch('/api/creative-studio/search-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: searchQuery,
              type: 'search',
              count: 3, // Mostrar 3 opções
            }),
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.images && data.images.length > 0) {
              // Usar a primeira imagem encontrada (usuário pode trocar depois)
              newImages.push({
                sceneNumber: scene.number,
                url: data.images[0].url,
                thumbnail: data.images[0].thumbnail || data.images[0].url,
                source: 'pexels',
              })
            }
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar/criar imagem para cena ${scene.number}:`, error)
      }
    }
    
    setImages(newImages)
    // Auto-selecionar todas as imagens
    const autoSelected: Record<number, string> = {}
    newImages.forEach(img => {
      autoSelected[img.sceneNumber] = img.url
    })
    setSelectedImages(autoSelected)
    setIsGenerating(false)
  }

  const handleApproveImages = () => {
    setImagesApproved(true)
    setCurrentStep('video')
    // Gerar vídeo automaticamente
    handleGenerateVideo()
  }

  // ETAPA 3: Gerar Vídeo
  const handleGenerateVideo = async () => {
    if (!script || images.length === 0) return
    
    setIsGeneratingVideo(true)
    try {
      // Aqui você chamaria a API de geração de vídeo
      // Por enquanto, vamos simular
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // TODO: Integrar com Remotion ou FFmpeg para gerar o vídeo
      setVideoUrl('/api/placeholder-video')
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className={`flex items-center gap-2 ${currentStep === 'script' ? 'text-purple-600' : scriptApproved ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${scriptApproved ? 'bg-green-100' : currentStep === 'script' ? 'bg-purple-100' : 'bg-gray-100'}`}>
            {scriptApproved ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">1</span>}
          </div>
          <span className="font-medium">Roteiro</span>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
        <div className={`flex items-center gap-2 ${currentStep === 'images' ? 'text-purple-600' : imagesApproved ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${imagesApproved ? 'bg-green-100' : currentStep === 'images' ? 'bg-purple-100' : 'bg-gray-100'}`}>
            {imagesApproved ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">2</span>}
          </div>
          <span className="font-medium">Imagens</span>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
        <div className={`flex items-center gap-2 ${currentStep === 'video' ? 'text-purple-600' : videoUrl ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${videoUrl ? 'bg-green-100' : currentStep === 'video' ? 'bg-purple-100' : 'bg-gray-100'}`}>
            {videoUrl ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">3</span>}
          </div>
          <span className="font-medium">Vídeo</span>
        </div>
      </div>

      {/* ETAPA 1: ROTEIRO */}
      {currentStep === 'script' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">📝 Roteiro do Anúncio</h2>
          
          {!script ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <p className="text-gray-600 mb-6">Vou criar um roteiro completo para seu anúncio</p>
              <button
                onClick={handleGenerateScript}
                disabled={isGenerating}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando roteiro...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Roteiro
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Hook (0-5s)</h3>
                  <p className="text-gray-900">{script.hook}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Problema (5-15s)</h3>
                  <p className="text-gray-900">{script.problem}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Solução (15-25s)</h3>
                  <p className="text-gray-900">{script.solution}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">CTA (25-30s)</h3>
                  <p className="text-gray-900">{script.cta}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApproveScript}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Aprovar Roteiro
                </button>
                <button
                  onClick={() => setScriptEdit(JSON.stringify(script, null, 2))}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium flex items-center gap-2"
                >
                  <Edit2 className="w-5 h-5" />
                  Ajustar
                </button>
                <button
                  onClick={handleGenerateScript}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-purple-200 text-purple-800 rounded-lg hover:bg-purple-300 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Nova Versão
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ETAPA 2: IMAGENS */}
      {currentStep === 'images' && script && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">🖼️ Imagens do Anúncio</h2>
          
          {images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <p className="text-gray-600 mb-6">Vou buscar/criar imagens para cada cena</p>
              <button
                onClick={handleGenerateImages}
                disabled={isGenerating}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Buscando imagens...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    Buscar/Criar Imagens
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {script.scenes.map((scene) => {
                  const sceneImage = images.find(img => img.sceneNumber === scene.number)
                  return (
                    <div key={scene.number} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Cena {scene.number} ({scene.startTime}s-{scene.endTime}s)</h3>
                      <p className="text-sm text-gray-600 mb-3">{scene.text}</p>
                      {sceneImage && (
                        <div className="relative aspect-video bg-gray-100 rounded overflow-hidden mb-2">
                          <img
                            src={sceneImage.thumbnail}
                            alt={`Cena ${scene.number}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {sceneImage.source === 'dalle' ? '🎨 IA' : '📷 Stock'}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          // Trocar imagem
                          handleGenerateImages()
                        }}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        🔁 Trocar imagem
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApproveImages}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Aprovar Imagens
                </button>
                <button
                  onClick={handleGenerateImages}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-purple-200 text-purple-800 rounded-lg hover:bg-purple-300 font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Buscar Novamente
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ETAPA 3: VÍDEO */}
      {currentStep === 'video' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">🎬 Vídeo Final</h2>
          
          {isGeneratingVideo ? (
            <div className="text-center py-12">
              <Loader2 className="w-16 h-16 mx-auto text-purple-600 mb-4 animate-spin" />
              <p className="text-gray-600">Gerando vídeo...</p>
            </div>
          ) : videoUrl ? (
            <div className="space-y-6">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={videoUrl} controls className="w-full h-full" />
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download MP4
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Gerar Variação
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <p className="text-gray-600">Vídeo será gerado automaticamente após aprovar imagens</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

