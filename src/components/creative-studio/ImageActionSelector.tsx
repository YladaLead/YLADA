'use client'

import { useState } from 'react'
import { Lightbulb, Search, Upload, FileText, X, Check } from 'lucide-react'

interface ImageActionSelectorProps {
  suggestion: {
    id: string
    title: string
    description: string
    requiresImages: boolean
  }
  onConfirm: (mode: 'auto-search' | 'manual' | 'skip') => void
  onCancel: () => void
  defaultMode?: 'auto-search' | 'manual' | 'skip'
}

export function ImageActionSelector({
  suggestion,
  onConfirm,
  onCancel,
  defaultMode = 'auto-search',
}: ImageActionSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<'auto-search' | 'manual' | 'skip'>(defaultMode)

  const modes = [
    {
      value: 'auto-search' as const,
      icon: Search,
      title: 'Buscar automaticamente',
      description: 'IA busca e mostra opções para você escolher',
      color: 'blue',
    },
    {
      value: 'manual' as const,
      icon: Upload,
      title: 'Adicionar manualmente',
      description: 'Você escolhe as imagens depois',
      color: 'purple',
    },
    {
      value: 'skip' as const,
      icon: FileText,
      title: 'Só criar roteiro',
      description: 'Apenas texto/roteiro, sem imagens por enquanto',
      color: 'gray',
    },
  ]

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 mt-0.5">
          <Lightbulb className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">
            {suggestion.title}
          </h4>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            {suggestion.description}
          </p>
          
          <p className="text-xs font-medium text-gray-700 mb-3">
            Como você quer proceder?
          </p>
          
          <div className="space-y-2 mb-4">
            {modes.map((mode) => {
              const Icon = mode.icon
              const isSelected = selectedMode === mode.value
              
              return (
                <label
                  key={mode.value}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${isSelected 
                      ? `bg-white border-${mode.color}-300 shadow-sm` 
                      : 'bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="image-action"
                    value={mode.value}
                    checked={isSelected}
                    onChange={() => setSelectedMode(mode.value)}
                    className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    isSelected ? `text-${mode.color}-600` : 'text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium text-sm block ${
                      isSelected ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {mode.title}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {mode.description}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  )}
                </label>
              )
            })}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onConfirm(selectedMode)}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              Confirmar
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

