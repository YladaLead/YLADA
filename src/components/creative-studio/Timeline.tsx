'use client'

import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { VideoClip } from '@/types/creative-studio'
import { Film, Image, Type, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Timeline() {
  const { clips, selectedClipId, setSelectedClipId, deleteClip, currentTime } = useCreativeStudioStore()

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return `${secs}s`
  }

  const getClipIcon = (type: VideoClip['type']) => {
    switch (type) {
      case 'video':
        return <Film className="w-4 h-4" />
      case 'image':
        return <Image className="w-4 h-4" />
      case 'text':
        return <Type className="w-4 h-4" />
    }
  }

  const getClipColor = (type: VideoClip['type']) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500'
      case 'image':
        return 'bg-green-500'
      case 'text':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
        <Film className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          Arraste vídeos, imagens ou textos para a timeline
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2">
        <div className="w-16 text-xs text-gray-500 font-medium">
          Tempo
        </div>
        <div className="flex-1 text-xs text-gray-500 font-medium">
          Clips
        </div>
      </div>

      <div className="space-y-1">
        {clips.map((clip) => (
          <div
            key={clip.id}
            onClick={() => setSelectedClipId(clip.id)}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
              "hover:bg-gray-100",
              selectedClipId === clip.id && "bg-purple-100 border-2 border-purple-500"
            )}
          >
            <div className="w-16 text-xs text-gray-600">
              {formatTime(clip.startTime)}
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded text-white",
                getClipColor(clip.type)
              )}>
                {getClipIcon(clip.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {clip.type === 'image' ? (
                    <span className="flex items-center gap-1">
                      <Image className="w-3 h-3 text-green-600" />
                      Imagem adicionada
                    </span>
                  ) : clip.type === 'video' ? (
                    <span className="flex items-center gap-1">
                      <Film className="w-3 h-3 text-blue-600" />
                      {clip.source.includes('blob:') ? 'Vídeo original' : clip.source.split('/').pop()?.slice(0, 30) || `Clip ${clip.id.slice(0, 8)}`}
                    </span>
                  ) : (
                    clip.source || `Clip ${clip.id.slice(0, 8)}`
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                  {' '}({formatTime(clip.endTime - clip.startTime)})
                </div>
                {clip.type === 'image' && (
                  <div className="mt-1">
                    <img 
                      src={clip.source} 
                      alt="Preview" 
                      className="w-16 h-10 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteClip(clip.id)
                }}
                className="p-1.5 rounded hover:bg-red-100 text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


