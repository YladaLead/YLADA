'use client'

import { useEffect, useRef, useState } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VideoRenderer } from './VideoRenderer'

export function VideoPlayer() {
  const {
    clips,
    audioClips,
    currentTime,
    duration,
    isPlaying,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    suggestedCuts,
  } = useCreativeStudioStore()
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Formato vertical 9:16 para Instagram (1080x1920)
  const [dimensions, setDimensions] = useState({ width: 1080, height: 1920 })

  // Encontrar clip atual baseado no tempo
  // Melhorado para lidar com bordas (incluindo o último frame)
  const currentClip = clips.find(
    (clip) => {
      // Incluir o último frame do clip (endTime)
      // Para imagens, usar <= para incluir o último momento
      // Para vídeos, usar < para não incluir o frame final (que pode ser do próximo clip)
      if (clip.type === 'image') {
        return currentTime >= clip.startTime && currentTime < clip.endTime
      }
      return currentTime >= clip.startTime && currentTime <= clip.endTime
    }
  ) || clips[0] // Fallback para o primeiro clip se não encontrar

  // Atualizar dimensões do container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Atualizar duração total quando clips mudam
  useEffect(() => {
    if (clips.length > 0) {
      const totalDuration = Math.max(...clips.map((c) => c.endTime))
      setDuration(totalDuration)
    }
  }, [clips, setDuration])

  // Encontrar áudio atual baseado no tempo
  const currentAudio = audioClips.find(
    (audio) => currentTime >= audio.startTime && currentTime <= audio.endTime
  )

  // Controlar play/pause do vídeo e áudio
  useEffect(() => {
    const video = videoRef.current
    const audio = audioRef.current

    if (isPlaying) {
      if (video && currentClip?.type !== 'image') {
        video.play().catch((err) => {
          console.error('Erro ao reproduzir vídeo:', err)
          setIsPlaying(false)
        })
      }
      if (audio && currentAudio) {
        audio.play().catch((err) => {
          console.error('Erro ao reproduzir áudio:', err)
        })
      }
    } else {
      if (video) video.pause()
      if (audio) audio.pause()
    }
  }, [isPlaying, setIsPlaying, currentClip, currentAudio])

  // Sincronizar tempo do vídeo e áudio com o store
  useEffect(() => {
    const video = videoRef.current
    const audio = audioRef.current

    // Sincronizar vídeo
    if (video && currentClip && currentClip.type !== 'image') {
      try {
        const relativeTime = currentTime - currentClip.startTime
        const clipDuration = currentClip.endTime - currentClip.startTime
        const videoTime = Math.max(0, Math.min(clipDuration, relativeTime))

        // Sincronizar apenas se a diferença for significativa (evitar loops)
        if (Math.abs(video.currentTime - videoTime) > 0.3) {
          video.currentTime = videoTime
        }
      } catch (error) {
        console.error('Erro ao sincronizar tempo do vídeo:', error)
      }
    }

    // Sincronizar áudio
    if (audio && currentAudio) {
      try {
        const relativeTime = currentTime - currentAudio.startTime
        const audioTime = Math.max(0, Math.min(currentAudio.duration, relativeTime))

        // Sincronizar apenas se a diferença for significativa (evitar loops)
        if (Math.abs(audio.currentTime - audioTime) > 0.3) {
          audio.currentTime = audioTime
        }
      } catch (error) {
        console.error('Erro ao sincronizar tempo do áudio:', error)
      }
    }
  }, [currentTime, currentClip, currentAudio])

  // Atualizar currentTime quando vídeo está reproduzindo (ou avançar automaticamente para imagens)
  useEffect(() => {
    if (currentClip?.type === 'image') {
      // Para imagens, apenas manter o tempo atual
      return
    }

    const video = videoRef.current
    if (!video || !isPlaying || !currentClip) return

    const interval = setInterval(() => {
      if (video) {
        const relativeTime = video.currentTime
        const absoluteTime = currentClip.startTime + relativeTime
        
        // Avançar para próximo clip quando terminar
        if (absoluteTime >= currentClip.endTime) {
          const nextClip = clips.find(c => c.startTime > currentClip.endTime)
          if (nextClip) {
            setCurrentTime(nextClip.startTime)
          } else {
            setIsPlaying(false)
            setCurrentTime(currentClip.endTime)
          }
        } else {
          setCurrentTime(absoluteTime)
        }
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, currentClip, setCurrentTime, clips, setIsPlaying])

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (newTime: number) => {
    // Garantir que o tempo está dentro dos limites válidos
    const clampedTime = Math.max(0, Math.min(duration || 0, newTime))
    setCurrentTime(clampedTime)
    
    // Forçar atualização do vídeo imediatamente
    if (videoRef.current && currentClip) {
      const relativeTime = clampedTime - currentClip.startTime
      const clipDuration = currentClip.endTime - currentClip.startTime
      const videoTime = Math.max(0, Math.min(clipDuration, relativeTime))
      
      if (Math.abs(videoRef.current.currentTime - videoTime) > 0.1) {
        videoRef.current.currentTime = videoTime
      }
    }
  }

  const handleSkip = (seconds: number) => {
    handleSeek(currentTime + seconds)
  }

  // Auto-play para imagens quando não está pausado
  useEffect(() => {
    if (currentClip?.type === 'image' && isPlaying) {
      const imageDuration = currentClip.endTime - currentClip.startTime
      const elapsed = currentTime - currentClip.startTime
      const remaining = imageDuration - elapsed
      
      if (remaining > 0) {
        const timer = setTimeout(() => {
          // Avançar para próximo clip quando imagem terminar
          const nextClip = clips.find(c => c.startTime >= currentClip.endTime)
          if (nextClip) {
            setCurrentTime(nextClip.startTime)
          } else {
            setIsPlaying(false)
            setCurrentTime(currentClip.endTime)
          }
        }, remaining * 1000)
        
        return () => clearTimeout(timer)
      } else {
        // Se já passou do tempo, avançar imediatamente
        const nextClip = clips.find(c => c.startTime >= currentClip.endTime)
        if (nextClip) {
          setCurrentTime(nextClip.startTime)
        } else {
          setIsPlaying(false)
          setCurrentTime(currentClip.endTime)
        }
      }
    }
  }, [currentClip, isPlaying, currentTime, clips, setIsPlaying, setCurrentTime])
  
  // Forçar atualização do preview quando currentClip muda
  useEffect(() => {
    // Isso garante que a imagem seja atualizada quando mudamos de clip
    if (currentClip?.type === 'image') {
      // Forçar re-render da imagem
      const img = containerRef.current?.querySelector('img')
      if (img && img.src !== currentClip.source) {
        img.src = currentClip.source
      }
    }
  }, [currentClip?.id, currentClip?.source])

  if (clips.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg aspect-[9/16] flex items-center justify-center">
        <p className="text-gray-400">Adicione clips para visualizar o vídeo</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden" data-video-container>
      <div 
        ref={containerRef}
        className="relative aspect-[9/16] bg-black flex items-center justify-center"
        style={{
          aspectRatio: '9/16',
          minHeight: '400px',
        }}
      >
        {currentClip?.source ? (
          <>
            {currentClip.type === 'image' ? (
              <div className="w-full h-full relative overflow-hidden bg-black">
                <img
                  key={currentClip.id}
                  src={currentClip.source}
                  alt={`Cena ${currentClip.id}`}
                  className="w-full h-full object-cover object-center"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    minWidth: '100%',
                    minHeight: '100%',
                  }}
                  onLoad={() => {
                    // Atualizar dimensões quando imagem carregar
                    if (containerRef.current) {
                      const rect = containerRef.current.getBoundingClientRect()
                      setDimensions({ width: rect.width, height: rect.height })
                    }
                  }}
                  onError={(e) => {
                    console.error('Erro ao carregar imagem:', currentClip.source, e)
                    // Mostrar placeholder em caso de erro
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                {/* Renderizar legendas sobre a imagem */}
                <VideoRenderer
                  videoElement={null}
                  width={dimensions.width}
                  height={dimensions.height}
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                src={currentClip.source}
                className="w-full h-full object-contain"
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error('Erro ao carregar vídeo:', e)
                }}
                onLoadedMetadata={() => {
                  // Garantir que o vídeo está no tempo correto quando carrega
                  if (videoRef.current && currentClip) {
                    const relativeTime = currentTime - currentClip.startTime
                    const clipDuration = currentClip.endTime - currentClip.startTime
                    const videoTime = Math.max(0, Math.min(clipDuration, relativeTime))
                    videoRef.current.currentTime = videoTime
                  }
                  // Atualizar dimensões quando vídeo carregar
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect()
                    setDimensions({ width: rect.width, height: rect.height })
                  }
                }}
              />
            )}
            {currentClip.type !== 'image' && (
              <VideoRenderer
                videoElement={videoRef.current}
                width={dimensions.width}
                height={dimensions.height}
              />
            )}
            
            {/* Áudio/Narração */}
            {currentAudio && (
              <audio
                ref={audioRef}
                src={currentAudio.source}
                volume={currentAudio.volume || 1.0}
                onEnded={() => {
                  // Áudio terminou, mas vídeo pode continuar
                }}
                onTimeUpdate={(e) => {
                  // Sincronizar áudio com store se necessário
                  const audio = e.currentTarget
                  if (isPlaying && currentAudio) {
                    const newTime = currentAudio.startTime + audio.currentTime
                    if (Math.abs(newTime - currentTime) > 0.5) {
                      setCurrentTime(newTime)
                    }
                  }
                }}
                style={{ display: 'none' }}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem vídeo selecionado
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="bg-gray-800 p-4 space-y-3">
                {/* Timeline - Arrastável para navegação rápida - MELHORADA */}
        <div className="relative">
          {/* Timeline visual melhorada - CLICÁVEL E ARRASTÁVEL */}
          <div 
            className="relative h-8 mb-2 cursor-pointer"
            onMouseDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const percent = (e.clientX - rect.left) / rect.width
              const newTime = Math.max(0, Math.min(duration, percent * duration))
              handleSeek(newTime)
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const moveRect = e.currentTarget.getBoundingClientRect()
                const movePercent = (moveEvent.clientX - moveRect.left) / moveRect.width
                const moveTime = Math.max(0, Math.min(duration, movePercent * duration))
                handleSeek(moveTime)
              }
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
              }
              
              document.addEventListener('mousemove', handleMouseMove)
              document.addEventListener('mouseup', handleMouseUp)
            }}
          >
            {/* Barra de progresso visual */}
            {duration > 0 && (
              <>
                {/* Clips existentes */}
                <div className="absolute top-0 left-0 w-full h-full rounded overflow-hidden bg-gray-700">
                  {clips.map((clip) => {
                    const leftPercent = (clip.startTime / duration) * 100
                    const widthPercent = ((clip.endTime - clip.startTime) / duration) * 100
                    return (
                      <div
                        key={clip.id}
                        className="absolute h-full border-l border-r border-gray-600"
                        style={{
                          left: `${Math.max(0, Math.min(100, leftPercent))}%`,
                          width: `${Math.max(0, Math.min(100, widthPercent))}%`,
                          backgroundColor: clip.type === 'image' ? 'rgba(34, 197, 94, 0.5)' : clip.type === 'video' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(147, 51, 234, 0.5)',
                        }}
                        title={`${clip.type === 'image' ? 'Imagem' : 'Vídeo'}: ${clip.startTime.toFixed(1)}s - ${clip.endTime.toFixed(1)}s`}
                      />
                    )
                  })}
                  
                  {/* Cortes sugeridos (ainda não aplicados) */}
                  {suggestedCuts.map((cut, idx) => {
                    const leftPercent = (cut.timestamp / duration) * 100
                    return (
                      <div
                        key={`suggested-cut-${idx}`}
                        className="absolute top-0 h-full w-0.5 bg-yellow-400 z-10"
                        style={{
                          left: `${Math.max(0, Math.min(100, leftPercent))}%`,
                        }}
                        title={`Corte sugerido: ${cut.timestamp.toFixed(1)}s${cut.description ? ` - ${cut.description}` : ''}`}
                      >
                        {/* Marcador visual */}
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-800 shadow-lg" />
                      </div>
                    )
                  })}
                  
                  {/* Indicador de posição atual */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-purple-400 z-20 shadow-lg"
                    style={{
                      left: `${(currentTime / duration) * 100}%`,
                    }}
                  >
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-400 rounded-full border-2 border-white shadow-lg" />
                  </div>
                </div>
                
                {/* Labels de tempo */}
                <div className="absolute -bottom-4 left-0 right-0 flex justify-between text-xs text-gray-400">
                  <span>0:00</span>
                  <span>{formatTime(duration || 0)}</span>
                </div>
              </>
            )}
          </div>
          
          {/* Slider arrastável melhorado - Funciona para vídeos longos */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            step={duration > 3600 ? 1 : 0.1} // Step maior para vídeos muito longos (>1h)
            onChange={(e) => {
              const newTime = Number(e.target.value)
              handleSeek(newTime)
            }}
            onInput={(e) => {
              // Atualizar em tempo real enquanto arrasta
              const newTime = Number((e.target as HTMLInputElement).value)
              setCurrentTime(newTime)
              setIsPlaying(false)
            }}
            onMouseDown={() => setIsPlaying(false)} // Pausar ao arrastar
            onMouseUp={(e) => {
              // Garantir que o seek acontece quando soltar o mouse
              const newTime = Number((e.target as HTMLInputElement).value)
              handleSeek(newTime)
            }}
            className="w-full h-3 bg-transparent appearance-none cursor-grab active:cursor-grabbing"
            style={{
              background: 'transparent',
            }}
          />
        </div>
        
        {/* Informações sobre cortes sugeridos */}
        {suggestedCuts.length > 0 && (
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded px-3 py-2">
            <p className="text-xs text-yellow-200 font-medium mb-1">
              ✂️ {suggestedCuts.length} corte(s) sugerido(s) - Arraste a timeline para ver onde serão aplicados
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedCuts.map((cut, idx) => (
                <span
                  key={idx}
                  className="text-xs text-yellow-300 bg-yellow-900 bg-opacity-50 px-2 py-0.5 rounded"
                >
                  {cut.timestamp.toFixed(1)}s
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Controles de reprodução */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSkip(-10)}
              className="p-2 rounded hover:bg-gray-700 text-white"
              aria-label="Voltar 10s"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={() => handleSkip(10)}
              className="p-2 rounded hover:bg-gray-700 text-white"
              aria-label="Avançar 10s"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <div className="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration || 0)}
          </div>
        </div>
      </div>
    </div>
  )
}


