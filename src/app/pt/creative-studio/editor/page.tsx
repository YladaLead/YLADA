'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Video, Upload, Sparkles, FileText, Play, Scissors, CheckCircle2 } from 'lucide-react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { ScriptGenerator } from '@/components/creative-studio/ScriptGenerator'
import { ScriptEditor } from '@/components/creative-studio/ScriptEditor'
import { VideoPlayer } from '@/components/creative-studio/VideoPlayer'
import { Timeline } from '@/components/creative-studio/Timeline'
import { FileUploader } from '@/components/creative-studio/FileUploader'
import { EditorChat } from '@/components/creative-studio/EditorChat'
import { SuggestionsPanel } from '@/components/creative-studio/SuggestionsPanel'

export default function CreativeStudioEditorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode') || 'edit' // 'edit' ou 'create'
  
  const {
    activePanel,
    setActivePanel,
    uploadedVideo,
    videoAnalysis,
    script,
    clips,
    setUploadedVideo,
    setVideoAnalysis,
    addClip,
    setScript,
  } = useCreativeStudioStore()

  const videoLoadedRef = useRef(false)
  const [leftWidth, setLeftWidth] = useState(66.666) // 2/3 por padrão
  const [isResizing, setIsResizing] = useState(false)
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false)
  const [chatHeight, setChatHeight] = useState(60) // 60% da altura por padrão
  const containerRef = useRef<HTMLDivElement>(null)
  const horizontalResizerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'script' | 'suggestions'>('script') // Aba ativa

  // Carregar vídeo automaticamente quando vier da página de análise (apenas se ainda não foi adicionado)
  useEffect(() => {
    // Verificar se o vídeo já está na timeline
    const videoAlreadyInTimeline = clips.some(c => c.id === 'uploaded-video' || (uploadedVideo && c.source.includes(uploadedVideo.name)))
    
    if (uploadedVideo && clips.length === 0 && !videoLoadedRef.current && !videoAlreadyInTimeline) {
      videoLoadedRef.current = true

      // Criar URL do vídeo se ainda não foi criada
      const videoUrl = URL.createObjectURL(uploadedVideo)
      
      // Obter duração real do vídeo
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = videoUrl
      
      let clipAdded = false
      
      video.onloadedmetadata = () => {
        if (clipAdded) return
        clipAdded = true
        
        const duration = video.duration || 60 // Fallback para 60s se não conseguir obter
        
        // Adicionar vídeo à timeline automaticamente
        addClip({
          id: 'uploaded-video',
          startTime: 0,
          endTime: duration,
          source: videoUrl,
          type: 'video',
        })
      }
      
      video.onerror = () => {
        if (clipAdded) return
        clipAdded = true
        
        // Se não conseguir obter metadata, usar duração padrão
        addClip({
          id: 'uploaded-video',
          startTime: 0,
          endTime: 60, // Duração padrão
          source: videoUrl,
          type: 'video',
        })
      }
      
      // Timeout de segurança (reduzido para 1s)
      const timeout = setTimeout(() => {
        if (!clipAdded && clips.length === 0) {
          clipAdded = true
          addClip({
            id: 'uploaded-video',
            startTime: 0,
            endTime: 60, // Duração padrão
            source: videoUrl,
            type: 'video',
          })
        }
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }

    // Carregar roteiro se vier da análise
    if (videoAnalysis && script.length === 0) {
      if (videoAnalysis.scriptStructure && videoAnalysis.scriptStructure.length > 0) {
        const scriptSegments = videoAnalysis.scriptStructure.map((seg: any, idx: number) => {
          let timestamp = idx * 10
          if (seg.timestamp) {
            const match = seg.timestamp.match(/(\d+)/)
            if (match) timestamp = parseInt(match[1])
          }
          
          return {
            id: `seg-${idx + 1}`,
            text: seg.text || '',
            duration: 10,
            timestamp,
            type: (seg.type?.toLowerCase() || 'content') as 'intro' | 'content' | 'outro' | 'transition',
          }
        })
        setScript(scriptSegments)
      } else if (videoAnalysis.transcription) {
        const words = videoAnalysis.transcription.split(' ')
        const estimatedDuration = Math.ceil(words.length / 2.5)
        setScript([
          {
            id: 'seg-1',
            text: videoAnalysis.transcription,
            duration: estimatedDuration,
            timestamp: 0,
            type: 'content' as const,
          },
        ])
      }
    }
  }, [uploadedVideo, videoAnalysis, clips.length, script.length, addClip, setScript])

  // Handlers para redimensionar vertical (apenas desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Não redimensionar em mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return
    e.preventDefault()
    setIsResizing(true)
  }

  // Handlers para redimensionar horizontal (chat vs abas)
  const handleHorizontalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingHorizontal(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && containerRef.current) {
        // Não redimensionar em mobile
        if (window.innerWidth < 1024) {
          setIsResizing(false)
          return
        }
        
        const containerRect = containerRef.current.getBoundingClientRect()
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
        
        // Limitar entre 30% e 70%
        const clampedWidth = Math.max(30, Math.min(70, newLeftWidth))
        setLeftWidth(clampedWidth)
      }

      if (isResizingHorizontal && horizontalResizerRef.current) {
        const resizerRect = horizontalResizerRef.current.getBoundingClientRect()
        const parentRect = horizontalResizerRef.current.parentElement?.getBoundingClientRect()
        
        if (parentRect) {
          const newHeight = ((e.clientY - parentRect.top) / parentRect.height) * 100
          
          // Limitar entre 30% e 80%
          const clampedHeight = Math.max(30, Math.min(80, newHeight))
          setChatHeight(clampedHeight)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setIsResizingHorizontal(false)
    }

    if (isResizing || isResizingHorizontal) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = isResizing ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, isResizingHorizontal])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col max-w-[1920px] mx-auto w-full px-2 sm:px-4 py-2 sm:py-4">
        {/* Header Compacto - Mobile First */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => {
                setUploadedVideo(null)
                setVideoAnalysis(null)
                setScript([])
                setTimeout(() => {
                  router.replace('/pt/creative-studio')
                  setTimeout(() => {
                    if (window.location.pathname === '/pt/creative-studio/editor') {
                      window.location.replace('/pt/creative-studio')
                    }
                  }, 100)
                }, 50)
              }}
              className="inline-flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              🎬 Editor
            </h1>
          </div>
          {uploadedVideo && clips.length > 0 && (
            <p className="text-xs sm:text-sm text-gray-600 hidden lg:block truncate max-w-[200px]">
              {uploadedVideo.name} • {clips.length} clip(s)
            </p>
          )}
        </div>

        {/* Layout Principal - Mobile First: Stack em mobile, side-by-side em desktop */}
        <div 
          ref={containerRef}
          className="flex-1 flex flex-col lg:flex-row gap-3 lg:gap-0 min-h-0 relative"
        >
          {/* Coluna Esquerda - Preview Fixo + Timeline */}
          <div 
            className="flex flex-col gap-2 sm:gap-3 min-h-0 lg:pr-2 w-full"
            style={{ 
              width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${leftWidth}%` : '100%' 
            }}
          >
            {/* Preview Fixo - Mobile Responsive - Sempre visível no topo */}
            <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-2 sm:p-3">
              <h3 className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2 uppercase tracking-wide">Preview</h3>
              {clips.length > 0 ? (
                <div className="aspect-video bg-black rounded overflow-hidden">
                  <VideoPlayer />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded flex items-center justify-center border-2 border-dashed border-gray-300">
                  <p className="text-gray-400 text-xs sm:text-sm px-2 text-center">Nenhum clip na timeline</p>
                </div>
              )}
            </div>

            {/* Timeline e Upload - Scrollável apenas se necessário */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 sm:space-y-3">
              {/* Timeline - Mobile Responsive */}
              <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-2 sm:p-3">
                <h3 className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2 uppercase tracking-wide">Timeline</h3>
                <Timeline />
              </div>

              {/* Upload Compacto - Mobile Responsive */}
              <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-2 sm:p-3">
                <h3 className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2 uppercase tracking-wide">Adicionar Arquivos</h3>
                <div className="max-h-[200px] sm:max-h-[250px] overflow-y-auto">
                  <FileUploader />
                </div>
              </div>
            </div>
          </div>

          {/* Resizer Bar - Apenas em desktop */}
          <div
            onMouseDown={handleMouseDown}
            className={`hidden lg:block w-1 bg-gray-300 hover:bg-purple-500 cursor-col-resize transition-colors flex-shrink-0 ${
              isResizing ? 'bg-purple-500' : ''
            }`}
            style={{ minWidth: '4px' }}
          />

          {/* Coluna Direita - Chat + Abas (Roteiro/Sugestões) - Mobile Responsive */}
          <div 
            ref={horizontalResizerRef}
            className="flex flex-col gap-0 overflow-hidden lg:pl-2 w-full"
            style={{ 
              width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${100 - leftWidth}%` : '100%' 
            }}
          >
            {/* Chat com IA - Altura ajustável */}
            <div 
              className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
              style={{ 
                height: typeof window !== 'undefined' && window.innerWidth >= 1024 
                  ? `${chatHeight}%` 
                  : '450px'
              }}
            >
              <EditorChat mode={mode as 'edit' | 'create'} />
            </div>

            {/* Resizer Horizontal - Barra para ajustar altura */}
            <div
              onMouseDown={handleHorizontalMouseDown}
              className={`hidden lg:block h-1 bg-gray-300 hover:bg-purple-500 cursor-row-resize transition-colors flex-shrink-0 ${
                isResizingHorizontal ? 'bg-purple-500' : ''
              }`}
              style={{ minHeight: '4px' }}
            />

            {/* Abas: Roteiro / Sugestões - Altura ajustável */}
            <div 
              className="flex-shrink-0 bg-white rounded-lg shadow-sm overflow-hidden"
              style={{ 
                height: typeof window !== 'undefined' && window.innerWidth >= 1024 
                  ? `${100 - chatHeight}%` 
                  : 'auto'
              }}
            >
              {/* Tabs Header */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('script')}
                  className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'script'
                      ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Roteiro
                  {script.length > 0 && (
                    <span className="ml-1 text-xs">({script.length})</span>
                  )}
                </button>
                {videoAnalysis && videoAnalysis.suggestions && videoAnalysis.suggestions.length > 0 && (
                  <button
                    onClick={() => setActiveTab('suggestions')}
                    className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors relative ${
                      activeTab === 'suggestions'
                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    Sugestões
                    <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {videoAnalysis.suggestions.length}
                    </span>
                  </button>
                )}
              </div>

              {/* Tab Content - Altura fixa para melhor visualização */}
              <div className="p-3 sm:p-4 h-[280px] sm:h-[320px] overflow-y-auto">
                {activeTab === 'script' ? (
                  <>
                    {script.length > 0 ? (
                      <ScriptEditor />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">Nenhum roteiro ainda</p>
                        <ScriptGenerator />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {videoAnalysis && videoAnalysis.suggestions && videoAnalysis.suggestions.length > 0 ? (
                      <SuggestionsPanel 
                        suggestions={videoAnalysis.suggestions}
                        onApply={(applied) => {
                          console.log('Aplicar sugestões:', applied)
                        }}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-xs sm:text-sm text-gray-500">Nenhuma sugestão disponível</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

