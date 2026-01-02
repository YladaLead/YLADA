'use client'

import { useState } from 'react'
import { CheckCircle2, X, Sparkles } from 'lucide-react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'

interface SuggestionsPanelProps {
  suggestions: Array<{
    title: string
    description: string
  }>
  onApply?: (appliedSuggestions: number[]) => void
}

export function SuggestionsPanel({ suggestions, onApply }: SuggestionsPanelProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const { script, updateScriptSegment, setScript } = useCreativeStudioStore()

  const toggleSuggestion = (index: number) => {
    const newSelected = new Set(selected)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelected(newSelected)
  }

  const applySuggestions = () => {
    if (selected.size === 0) return

    // Aplicar sugestões ao roteiro
    // Por enquanto, apenas notificar - implementação específica depende do tipo de sugestão
    if (onApply) {
      onApply(Array.from(selected))
    }

    alert(`${selected.size} sugestão(ões) aplicada(s)!`)
  }

  if (suggestions.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-600 mb-2">
        Selecione as sugestões que deseja aplicar
      </p>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => {
          const isSelected = selected.has(index)
          return (
            <div
              key={index}
              onClick={() => toggleSuggestion(index)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-green-50 border-green-300'
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-400 rounded" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 mb-2 leading-tight">
                    {suggestion.title}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selected.size > 0 && (
        <button
          onClick={applySuggestions}
          className="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2 touch-manipulation transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Aplicar {selected.size} Sugestão(ões)
        </button>
      )}
    </div>
  )
}


