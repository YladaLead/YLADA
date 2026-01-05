'use client'

import { useState, useEffect, useRef } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Play, Pause } from 'lucide-react'
import { VideoRenderer } from './VideoRenderer'

/**
 * Preview simplificado para pessoa leiga
 * Mostra imagens mudando automaticamente
 */
export function SimpleVideoPreview() {
  const { clips, currentTime, setCurrentTime, isPlaying, setIsPlaying, duration } = useCreativeStudioStore()
  const [autoPlay, setAutoPlay] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Encontrar clip atual
  const currentClip = clips[currentIndex] || clips[0]

  // Auto-avançar imagens
  useEffect(() => {
    if (!autoPlay || clips.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % clips.length
        // Atualizar tempo também
        if (clips[next]) {
          setCurrentTime(clips[next].startTime)
        }
        return next
      })
    }, 2500) // 2.5 segundos por imagem

    return () => clearInterval(interval)
  }, [autoPlay, clips.length, setCurrentTime])

  // Atualizar dimensões
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1080, height: 1920 })

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

  if (clips.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg aspect-[9/16] flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">📷</p>
          <p className="text-gray-500 text-xs">Adicione imagens para ver o preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Preview Principal */}
      <div ref={containerRef} className="relative bg-black rounded-lg overflow-hidden aspect-[9/16]">
        {currentClip?.source && (
          <>
            {currentClip.type === 'image' ? (
              <div className="w-full h-full relative">
                <img
                  key={currentClip.id}
                  src={currentClip.source}
                  alt={`Imagem ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    // Atualizar dimensões quando imagem carregar
                    if (containerRef.current) {
                      const rect = containerRef.current.getBoundingClientRect()
                      setDimensions({ width: rect.width, height: rect.height })
                    }
                  }}
                />
                {/* Legendas sobre a imagem */}
                <div className="absolute inset-0 pointer-events-none">
                  <VideoRenderer
                    videoElement={null}
                    width={dimensions.width}
                    height={dimensions.height}
                  />
                </div>
              </div>
            ) : (
              <video
                src={currentClip.source}
                className="w-full h-full object-contain"
                controls
              />
            )}
          </>
        )}

        {/* Controles Simples */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/70 rounded-full px-4 py-2">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className="text-white hover:text-purple-400 transition-colors"
          >
            {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <span className="text-white text-xs">
            {currentIndex + 1} / {clips.length}
          </span>
        </div>
      </div>

      {/* Miniaturas - Visualização lado a lado */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {clips.map((clip, idx) => (
          <button
            key={clip.id}
            onClick={() => {
              setCurrentIndex(idx)
              setCurrentTime(clip.startTime)
            }}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              idx === currentIndex
                ? 'border-purple-500 ring-2 ring-purple-300'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {clip.type === 'image' ? (
              <img
                src={clip.source}
                alt={`Miniatura ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-xs">
                🎬
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

