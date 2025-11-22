'use client'

import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { useAuth } from '@/contexts/AuthContext'

interface VideoPlayerProps {
  videoUrl: string
  moduloId: string
  aulaId?: string
  onCompleted?: () => void
  onProgress?: (progress: number) => void
}

export default function VideoPlayer({
  videoUrl,
  moduloId,
  aulaId,
  onCompleted,
  onProgress,
}: VideoPlayerProps) {
  const { user } = useAuth()
  const [playing, setPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const playerRef = useRef<ReactPlayer>(null)

  // Carregar timestamp salvo do localStorage
  useEffect(() => {
    if (!user || !aulaId) return

    const storageKey = `video_progress_${user.id}_${aulaId}`
    const savedProgress = localStorage.getItem(storageKey)

    if (savedProgress) {
      const progress = parseFloat(savedProgress)
      setPlayed(progress)
      if (playerRef.current) {
        playerRef.current.seekTo(progress)
      }
    }
  }, [user, aulaId])

  // Salvar progresso no localStorage
  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played)
    
    if (user && aulaId) {
      const storageKey = `video_progress_${user.id}_${aulaId}`
      localStorage.setItem(storageKey, state.played.toString())
    }

    if (onProgress) {
      onProgress(state.played)
    }
  }

  // Marcar como concluído
  const handleMarkCompleted = async () => {
    if (!user || !moduloId) return

    try {
      // Atualizar progresso no backend
      const response = await fetch('/api/nutri/cursos/progresso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'modulo',
          item_id: moduloId,
          item_type: 'modulo',
          progress_percentage: 100,
          completed: true,
        }),
        credentials: 'include',
      })

      if (response.ok) {
        setCompleted(true)
        if (onCompleted) {
          onCompleted()
        }
      }
    } catch (error) {
      console.error('Erro ao marcar como concluído:', error)
    }
  }

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
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
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          controls
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onReady={() => setLoading(false)}
          onError={(error) => {
            console.error('Erro ao carregar vídeo:', error)
            setLoading(false)
          }}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
              },
            },
          }}
        />
        
        {loading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Botão Marcar como Concluído */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <button
          onClick={handleMarkCompleted}
          disabled={completed}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            completed
              ? 'bg-green-600 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {completed ? '✅ Vídeo Concluído' : 'Marcar Vídeo como Concluído'}
        </button>
      </div>
    </div>
  )
}

