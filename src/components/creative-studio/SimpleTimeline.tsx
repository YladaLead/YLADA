'use client'

import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Image, Trash2 } from 'lucide-react'

/**
 * Timeline simplificada para pessoa leiga
 * Visual, intuitiva, sem complexidade técnica
 */
export function SimpleTimeline() {
  const { clips, deleteClip, setCurrentTime, currentTime } = useCreativeStudioStore()

  if (clips.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Adicione imagens para criar seu vídeo</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">
          Suas Imagens ({clips.length})
        </h4>
        <p className="text-xs text-gray-500">
          Cada imagem dura 2.5 segundos
        </p>
      </div>

      {/* Lista Visual de Imagens */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {clips.map((clip, index) => {
          const duration = clip.endTime - clip.startTime
          
          return (
            <div
              key={clip.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                {clip.type === 'image' ? (
                  <img
                    src={clip.source}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Image className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Imagem {index + 1}
                </p>
                <p className="text-xs text-gray-500">
                  {duration.toFixed(1)}s
                </p>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTime(clip.startTime)}
                  className="px-3 py-1.5 text-xs bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-medium"
                >
                  Ver
                </button>
                <button
                  onClick={() => deleteClip(clip.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Total */}
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          Duração total: {(clips.reduce((sum, c) => sum + (c.endTime - c.startTime), 0)).toFixed(1)}s
        </p>
      </div>
    </div>
  )
}


