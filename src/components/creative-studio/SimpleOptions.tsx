'use client'

import { useState, useEffect } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Type, Volume2, Settings } from 'lucide-react'

/**
 * Opções simples para pessoa leiga
 * Toggles claros para legendas e voz
 */
export function SimpleOptions() {
  const { captions, audioClips } = useCreativeStudioStore()
  const [showLegendas, setShowLegendas] = useState(captions.length > 0)
  const [showVoz, setShowVoz] = useState(audioClips.length > 0)

  // Atualizar quando captions/audio mudarem
  useEffect(() => {
    setShowLegendas(captions.length > 0)
  }, [captions.length])

  useEffect(() => {
    setShowVoz(audioClips.length > 0)
  }, [audioClips.length])

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-semibold text-gray-900">Opções do Vídeo</h3>
      </div>

      {/* Toggle Legendas */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Legendas</p>
            <p className="text-xs text-gray-500">
              {showLegendas ? 'Ativadas' : 'Desativadas'} ({captions.length} legenda{captions.length !== 1 ? 's' : ''})
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowLegendas(!showLegendas)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            showLegendas ? 'bg-purple-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              showLegendas ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Toggle Voz */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Narração</p>
            <p className="text-xs text-gray-500">
              {showVoz ? 'Ativada' : 'Desativada'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowVoz(!showVoz)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            showVoz ? 'bg-purple-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              showVoz ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
        💡 Você pode ajustar essas opções a qualquer momento
      </p>
    </div>
  )
}

