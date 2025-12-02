'use client'

import { useState, useRef, useEffect } from 'react'
import type { Aula, Modulo } from '@/types/formacao'

interface AulaPlayerProps {
  aula: Aula
  trilhaId: string
  modulos: Modulo[]
  onConcluir: () => void
  onProximaAula: (proximaAula: Aula | null) => void
}

export default function AulaPlayer({ aula, trilhaId, modulos, onConcluir, onProximaAula }: AulaPlayerProps) {
  const [isCompleted, setIsCompleted] = useState(aula.is_completed)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Encontrar próxima aula
  const encontrarProximaAula = (): Aula | null => {
    for (const modulo of modulos) {
      const aulaIndex = modulo.aulas.findIndex(a => a.id === aula.id)
      if (aulaIndex !== -1) {
        // Próxima aula no mesmo módulo
        if (aulaIndex < modulo.aulas.length - 1) {
          return modulo.aulas[aulaIndex + 1]
        }
        // Próxima aula no próximo módulo
        const moduloIndex = modulos.findIndex(m => m.id === modulo.id)
        if (moduloIndex < modulos.length - 1) {
          return modulos[moduloIndex + 1].aulas[0]
        }
      }
    }
    return null
  }

  const proximaAula = encontrarProximaAula()

  const handleConcluir = async () => {
    setIsCompleted(true)
    onConcluir()
  }

  const handleProximaAula = () => {
    if (proximaAula) {
      onProximaAula(proximaAula)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Player de Vídeo */}
      <div className="aspect-video bg-black relative">
        {aula.video_url ? (
          <video
            ref={videoRef}
            src={aula.video_url}
            controls
            className="w-full h-full"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-lg">Vídeo em breve</p>
            </div>
          </div>
        )}
      </div>

      {/* Informações da Aula */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{aula.title}</h2>
        <p className="text-gray-600 mb-6 whitespace-pre-line">{aula.description}</p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3">
          {!isCompleted && (
            <button
              onClick={handleConcluir}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ✓ Marcar como concluída
            </button>
          )}
          
          {isCompleted && (
            <div className="flex-1 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium text-center">
              ✓ Aula concluída
            </div>
          )}

          {proximaAula && (
            <button
              onClick={handleProximaAula}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              → Ir para próxima aula
            </button>
          )}

          {!proximaAula && isCompleted && (
            <div className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium text-center">
              🎉 Parabéns! Você concluiu esta trilha!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

