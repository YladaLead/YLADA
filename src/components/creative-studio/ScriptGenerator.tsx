'use client'

import { useState } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const STYLE_DESCRIPTIONS: Record<string, string> = {
  educational: '📚 Para ensinar, explicar conceitos, tutoriais e conteúdo educativo. Foco em clareza e aprendizado.',
  entertaining: '🎭 Para entreter, divertir, reações, humor e conteúdo leve. Foco em engajamento e diversão.',
  promotional: '💼 Para vender, promover produtos, serviços e criar desejo. Foco em conversão e persuasão.',
  documentary: '🎬 Para documentar, contar histórias reais, investigar e informar. Foco em autenticidade e profundidade.',
}

export function ScriptGenerator() {
  const { setIsGeneratingScript, setScript, isGeneratingScript } = useCreativeStudioStore()
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState(60)
  const [style, setStyle] = useState<'educational' | 'entertaining' | 'promotional' | 'documentary'>('educational')
  const [tone, setTone] = useState<'casual' | 'formal' | 'energetic' | 'calm'>('casual')

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGeneratingScript(true)
    try {
      const response = await fetch('/api/creative-studio/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          duration,
          style,
          tone,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar roteiro')
      }

      const data = await response.json()
      setScript(data.script)
    } catch (error) {
      console.error('Erro ao gerar roteiro:', error)
      alert('Erro ao gerar roteiro. Tente novamente.')
    } finally {
      setIsGeneratingScript(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded p-2 border border-purple-200">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
          Gerar Roteiro
        </h3>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Tópico do vídeo..."
          className="w-full px-2 py-1.5 rounded border border-gray-300 bg-white text-gray-900 text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
          disabled={isGeneratingScript}
        />

        <div className="grid grid-cols-2 gap-1.5">
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={10}
            max={600}
            placeholder="Duração (s)"
            className="w-full px-2 py-1.5 rounded border border-gray-300 bg-white text-gray-900 text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            disabled={isGeneratingScript}
          />
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as any)}
            className="w-full px-2 py-1.5 rounded border border-gray-300 bg-white text-gray-900 text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
            disabled={isGeneratingScript}
          >
            <option value="educational">📚 Educacional</option>
            <option value="entertaining">🎭 Entretenimento</option>
            <option value="promotional">💼 Promocional</option>
            <option value="documentary">🎬 Documentário</option>
          </select>
        </div>

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value as any)}
          className="w-full px-2 py-1.5 rounded border border-gray-300 bg-white text-gray-900 text-xs focus:ring-1 focus:ring-purple-500 focus:border-transparent"
          disabled={isGeneratingScript}
        >
          <option value="casual">💬 Casual</option>
          <option value="formal">👔 Formal</option>
          <option value="energetic">⚡ Energético</option>
          <option value="calm">🧘 Calmo</option>
        </select>

        <button
          onClick={handleGenerate}
          disabled={isGeneratingScript || !topic.trim()}
          className={cn(
            "w-full py-1.5 px-3 rounded text-xs font-medium text-white transition-all",
            "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center gap-1.5"
          )}
        >
          {isGeneratingScript ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Gerando...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
              <span>Gerar</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}


