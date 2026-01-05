'use client'

import { useRef, useState, useEffect } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { VideoClip } from '@/types/creative-studio'
import { Film, Image, Type, Trash2, Copy, GripVertical, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HorizontalTimeline() {
  const {
    clips,
    selectedClipId,
    setSelectedClipId,
    deleteClip,
    duplicateClip,
    currentTime,
    setCurrentTime,
    duration,
  } = useCreativeStudioStore()

  const timelineRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1) // 1x, 2x, 4x
  const [scrollPosition, setScrollPosition] = useState(0)
  const [draggingClip, setDraggingClip] = useState<string | null>(null)
  const [resizingClip, setResizingClip] = useState<{ id: string; side: 'left' | 'right' } | null>(null)

  const pixelsPerSecond = 50 * zoom // 50px por segundo no zoom 1x

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  const getClipIcon = (type: VideoClip['type']) => {
    switch (type) {
      case 'video':
        return <Film className="w-3 h-3" />
      case 'image':
        return <Image className="w-3 h-3" />
      case 'text':
        return <Type className="w-3 h-3" />
    }
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + scrollPosition
    const time = x / pixelsPerSecond
    setCurrentTime(Math.max(0, Math.min(duration, time)))
  }

  const handleClipDragStart = (clipId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDraggingClip(clipId)
    setSelectedClipId(clipId)
  }

  const handleClipResizeStart = (clipId: string, side: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation()
    setResizingClip({ id: clipId, side })
  }

  useEffect(() => {
    if (!draggingClip && !resizingClip) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return
      const rect = timelineRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left + scrollPosition
      const time = x / pixelsPerSecond

      if (draggingClip) {
        const clip = clips.find((c) => c.id === draggingClip)
        if (clip) {
          const clipDuration = clip.endTime - clip.startTime
          const newStartTime = Math.max(0, Math.min(duration - clipDuration, time))
          const { updateClip } = useCreativeStudioStore.getState()
          updateClip(draggingClip, {
            startTime: newStartTime,
            endTime: newStartTime + clipDuration,
          })
        }
      } else if (resizingClip) {
        const clip = clips.find((c) => c.id === resizingClip.id)
        if (clip) {
          const { updateClip } = useCreativeStudioStore.getState()
          if (resizingClip.side === 'left') {
            const newStartTime = Math.max(0, Math.min(clip.endTime - 0.5, time))
            updateClip(resizingClip.id, {
              startTime: newStartTime,
            })
          } else {
            const newEndTime = Math.max(clip.startTime + 0.5, Math.min(duration, time))
            updateClip(resizingClip.id, {
              endTime: newEndTime,
            })
          }
        }
      }
    }

    const handleMouseUp = () => {
      setDraggingClip(null)
      setResizingClip(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingClip, resizingClip, clips, duration, pixelsPerSecond, scrollPosition])

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

  const timelineWidth = duration * pixelsPerSecond

  return (
    <div className="space-y-2">
      {/* Controles de Zoom */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Zoom:</span>
          <div className="flex gap-1">
            {[0.5, 1, 2, 4].map((level) => (
              <button
                key={level}
                onClick={() => setZoom(level)}
                className={cn(
                  'px-2 py-1 text-xs rounded',
                  zoom === level
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
              >
                {level}x
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Duração: {formatTime(duration)}
        </div>
      </div>

      {/* Timeline Horizontal */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
        {/* Régua de Tempo */}
        <div className="h-8 bg-gray-200 border-b border-gray-300 flex items-center relative overflow-hidden">
          <div
            ref={timelineRef}
            className="absolute inset-0"
            style={{
              width: `${timelineWidth}px`,
              transform: `translateX(-${scrollPosition}px)`,
            }}
            onClick={handleTimelineClick}
          >
            {/* Marcadores de tempo */}
            {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l border-gray-400"
                style={{ left: `${i * pixelsPerSecond}px` }}
              >
                <span className="absolute top-1 left-1 text-xs text-gray-600 font-medium">
                  {formatTime(i)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Track de Vídeo/Imagem - ESTILO CAPCUT */}
        <div className="relative h-32 overflow-x-auto overflow-y-hidden bg-gray-50" style={{ maxHeight: '128px' }}>
          <div
            className="relative h-full"
            style={{
              width: `${timelineWidth}px`,
              minWidth: '100%',
            }}
          >
            {/* Linha de tempo atual */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-purple-500 z-20 pointer-events-none"
              style={{
                left: `${currentTime * pixelsPerSecond - scrollPosition}px`,
              }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full border-2 border-white" />
            </div>

            {/* Clips */}
            {clips.map((clip) => {
              const clipWidth = (clip.endTime - clip.startTime) * pixelsPerSecond
              const clipLeft = clip.startTime * pixelsPerSecond
              const isSelected = selectedClipId === clip.id

              return (
                <div
                  key={clip.id}
                  className={cn(
                    'absolute top-1 bottom-1 rounded-lg border-2 cursor-move transition-all shadow-md hover:shadow-lg',
                    isSelected 
                      ? 'ring-4 ring-purple-400 ring-offset-1 border-purple-500 z-10' 
                      : 'border-gray-400 hover:border-gray-500',
                    draggingClip === clip.id && 'opacity-80 scale-105',
                    getClipColor(clip.type)
                  )}
                  style={{
                    left: `${clipLeft}px`,
                    width: `${Math.max(clipWidth, 60)}px`, // Mínimo 60px para melhor visualização
                    minWidth: '60px',
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedClipId(clip.id)
                    // Pular para o início do clip quando clicar
                    setCurrentTime(clip.startTime)
                  }}
                >
                  {/* Thumbnail ou ícone - MAIOR E MAIS VISÍVEL */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg">
                    {clip.type === 'image' ? (
                      <img
                        src={clip.source}
                        alt={`Clip ${clip.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Se erro, mostrar ícone
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-30">
                        {getClipIcon(clip.type)}
                      </div>
                    )}
                  </div>

                  {/* Handle de arrastar - VISÍVEL NO HOVER */}
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-20 rounded-lg"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      handleClipDragStart(clip.id, e)
                    }}
                  >
                    <GripVertical className="w-6 h-6 text-white" />
                  </div>

                  {/* Label do clip - MAIS VISÍVEL */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white text-xs px-2 py-1.5 rounded-b-lg">
                    <div className="flex items-center justify-between font-medium">
                      <span className="truncate text-[10px]">
                        {clip.type === 'image' ? '📷' : clip.type === 'video' ? '🎬' : '📝'}
                      </span>
                      <span className="text-[10px] font-bold ml-1">
                        {formatTime(clip.endTime - clip.startTime)}
                      </span>
                    </div>
                  </div>

                  {/* Handles de resize - MAIS VISÍVEIS E FÁCEIS DE USAR */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize bg-white bg-opacity-70 hover:bg-opacity-100 border-r-2 border-white rounded-l-lg flex items-center justify-center group"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      handleClipResizeStart(clip.id, 'left', e)
                    }}
                    title="Ajustar início"
                  >
                    <div className="w-1 h-6 bg-gray-600 group-hover:bg-gray-800 rounded" />
                  </div>
                  <div
                    className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize bg-white bg-opacity-70 hover:bg-opacity-100 border-l-2 border-white rounded-r-lg flex items-center justify-center group"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      handleClipResizeStart(clip.id, 'right', e)
                    }}
                    title="Ajustar fim"
                  >
                    <div className="w-1 h-6 bg-gray-600 group-hover:bg-gray-800 rounded" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Controles do Clip Selecionado */}
      {selectedClipId && (
        <div className="flex items-center gap-2 px-2 py-2 bg-purple-50 rounded-lg border border-purple-200">
          <span className="text-xs text-purple-700 font-medium">
            Clip selecionado: {formatTime(clips.find((c) => c.id === selectedClipId)?.startTime || 0)} -{' '}
            {formatTime(clips.find((c) => c.id === selectedClipId)?.endTime || 0)}
          </span>
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => duplicateClip(selectedClipId)}
              className="p-1.5 rounded hover:bg-blue-100 text-blue-600"
              title="Duplicar"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteClip(selectedClipId)}
              className="p-1.5 rounded hover:bg-red-100 text-red-600"
              title="Deletar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

