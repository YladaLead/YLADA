'use client'

import { useState, useRef } from 'react'

interface VideoPlayerYLADAProps {
  videoUrl?: string
  videoUrlMp4?: string
  videoUrlWebm?: string
  title?: string
  description?: string
  autoplay?: boolean
  className?: string
}

export default function VideoPlayerYLADA({
  videoUrl,
  videoUrlMp4,
  videoUrlWebm,
  title,
  description,
  autoplay = false,
  className = ''
}: VideoPlayerYLADAProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Determinar qual URL usar (prioridade: videoUrl > videoUrlMp4 > videoUrlWebm)
  const finalVideoUrl = videoUrl || videoUrlMp4 || videoUrlWebm

  if (!finalVideoUrl) {
    return (
      <div className={`w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <div className="text-4xl mb-4">📹</div>
          <p className="text-lg">Vídeo não disponível</p>
          <p className="text-sm text-gray-400 mt-2">
            O vídeo será adicionado em breve
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <div className="relative aspect-video">
        {loading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        <video
          ref={videoRef}
          controls
          autoPlay={autoplay}
          className="w-full h-full"
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setError(true)
            setLoading(false)
          }}
          preload="metadata"
        >
          {videoUrlWebm && <source src={videoUrlWebm} type="video/webm" />}
          {videoUrlMp4 && <source src={videoUrlMp4} type="video/mp4" />}
          {videoUrl && <source src={videoUrl} type="video/mp4" />}
          Seu navegador não suporta vídeos HTML5.
        </video>

        {error && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-lg">Erro ao carregar vídeo</p>
              <p className="text-sm text-gray-400 mt-2">
                Tente novamente mais tarde
              </p>
            </div>
          </div>
        )}
      </div>

      {(title || description) && (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          {title && (
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-300">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}

