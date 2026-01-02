'use client'

import { useEffect, useRef } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'

export function VideoPlayer() {
  const {
    clips,
    currentTime,
    duration,
    isPlaying,
    setIsPlaying,
    setCurrentTime,
    setDuration,
  } = useCreativeStudioStore()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Encontrar clip atual baseado no tempo
  const currentClip = clips.find(
    (clip) => currentTime >= clip.startTime && currentTime < clip.endTime
  )

  // Atualizar duração total quando clips mudam
  useEffect(() => {
    if (clips.length > 0) {
      const totalDuration = Math.max(...clips.map((c) => c.endTime))
      setDuration(totalDuration)
    }
  }, [clips, setDuration])

  // Controlar play/pause do vídeo
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.play().catch((err) => {
        console.error('Erro ao reproduzir vídeo:', err)
        setIsPlaying(false)
      })
    } else {
      video.pause()
    }
  }, [isPlaying, setIsPlaying])

  // Sincronizar tempo do vídeo com o store
  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentClip) return

    const relativeTime = currentTime - currentClip.startTime
    const clipDuration = currentClip.endTime - currentClip.startTime
    const videoTime = Math.max(0, Math.min(clipDuration, relativeTime))

    if (Math.abs(video.currentTime - videoTime) > 0.5) {
      video.currentTime = videoTime
    }
  }, [currentTime, currentClip])

  // Atualizar currentTime quando vídeo está reproduzindo
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isPlaying || !currentClip) return

    const interval = setInterval(() => {
      if (video) {
        const relativeTime = video.currentTime
        const absoluteTime = currentClip.startTime + relativeTime
        setCurrentTime(absoluteTime)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, currentClip, setCurrentTime])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (newTime: number) => {
    setCurrentTime(Math.max(0, Math.min(duration, newTime)))
  }

  const handleSkip = (seconds: number) => {
    handleSeek(currentTime + seconds)
  }

  if (clips.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
        <p className="text-gray-400">Adicione clips para visualizar o vídeo</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-black">
        {currentClip?.source ? (
          <video
            ref={videoRef}
            src={currentClip.source}
            className="w-full h-full object-contain"
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem vídeo selecionado
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="bg-gray-800 p-4 space-y-3">
        {/* Timeline */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>

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
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  )
}


