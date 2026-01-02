'use client'

import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { VideoClip } from '@/types/creative-studio'
import { Film, Image, Type, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Timeline() {
  const { clips, selectedClipId, setSelectedClipId, deleteClip, currentTime } = useCreativeStudioStore()

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
              {Math.floor(clip.startTime)}s
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className={cn(
                "p-1.5 rounded text-white",
                getClipColor(clip.type)
              )}>
                {getClipIcon(clip.type)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {clip.source || `Clip ${clip.id.slice(0, 8)}`}
                </div>
                <div className="text-xs text-gray-500">
                  {clip.startTime.toFixed(1)}s - {clip.endTime.toFixed(1)}s
                  {' '}({(clip.endTime - clip.startTime).toFixed(1)}s)
                </div>
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


