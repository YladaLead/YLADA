'use client'

import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { ScriptSegment } from '@/types/creative-studio'
import { FileText, Clock, Trash2, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScriptEditor() {
  const { script, updateScriptSegment, deleteScriptSegment } = useCreativeStudioStore()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTypeColor = (type: ScriptSegment['type']) => {
    switch (type) {
      case 'intro':
        return 'bg-green-100 text-green-800'
      case 'outro':
        return 'bg-blue-100 text-blue-800'
      case 'transition':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: ScriptSegment['type']) => {
    switch (type) {
      case 'intro':
        return 'Introdução'
      case 'outro':
        return 'Conclusão'
      case 'transition':
        return 'Transição'
      default:
        return 'Conteúdo'
    }
  }

  if (script.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <FileText className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-xs text-gray-500">
          Nenhum roteiro ainda
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {script.map((segment, index) => (
        <div
          key={segment.id}
          className={cn(
            "p-3 rounded-lg border-2 transition-all",
            "bg-white border-gray-200 hover:border-purple-300"
          )}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-semibold text-gray-500">
                #{index + 1}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  getTypeColor(segment.type)
                )}
              >
                {getTypeLabel(segment.type)}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {formatTime(segment.timestamp)} ({segment.duration}s)
                </span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => {
                  const newText = prompt('Editar texto:', segment.text)
                  if (newText) updateScriptSegment(segment.id, { text: newText })
                }}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                aria-label="Editar"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Excluir?')) {
                    deleteScriptSegment(segment.id)
                  }
                }}
                className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
                aria-label="Excluir"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-900 whitespace-pre-wrap leading-relaxed">
            {segment.text}
          </p>
        </div>
      ))}
    </div>
  )
}


