'use client'

import { useState } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { Sparkles, Play, Download, Loader2, Settings, Volume2, CheckCircle } from 'lucide-react'

interface AutoVideoBuilderProps {
  script?: {
    hook: string
    problem: string
    solution: string
    cta: string
    scenes: Array<{
      number: number
      text: string
      imageDescription: string
      startTime: number
      endTime: number
    }>
  }
  images?: string[]
}

export function AutoVideoBuilder({ script, images }: AutoVideoBuilderProps) {
  const { 
    clips, 
    duration, 
    setDuration,
    addAudioClip,
    addCaption,
    updateClip,
  } = useCreativeStudioStore()
  const [isBuilding, setIsBuilding] = useState(false)
  const [isBuilt, setIsBuilt] = useState(false)
  const [settings, setSettings] = useState({
    voice: 'nova' as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
    transition: 'fade' as 'fade' | 'slide' | 'zoom',
    imageEffect: 'ken-burns' as 'ken-burns' | 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'none',
    speed: 1.0,
  })
  const [showSettings, setShowSettings] = useState(false)
  const authenticatedFetch = useAuthenticatedFetch()

  const handleBuildVideo = async () => {
    if (!script || clips.length === 0) {
      alert('Adicione um roteiro e imagens primeiro!')
      return
    }

    setIsBuilding(true)
    setVideoUrl(null)

    try {
      // 1. Montar vídeo automaticamente (gerar narração e legendas)
      const response = await authenticatedFetch('/api/creative-studio/build-auto-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          clips: clips.map(c => ({
            id: c.id,
            source: c.source,
            type: c.type,
            startTime: c.startTime,
            endTime: c.endTime,
          })),
          settings,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao montar vídeo')
      }

      const data = await response.json()
      
      // 2. Adicionar narração ao store
      if (data.audioUrl) {
        addAudioClip({
          id: `auto-audio-${Date.now()}`,
          startTime: 0,
          endTime: data.duration,
          source: data.audioUrl,
          text: [script.hook, script.problem, script.solution, script.cta].filter(Boolean).join('. '),
          voice: settings.voice,
          duration: data.duration,
          volume: 1.0,
        })
      }

      // 3. Adicionar legendas ao store
      if (data.captions && Array.isArray(data.captions)) {
        data.captions.forEach((caption: any) => {
          addCaption({
            id: `auto-caption-${Date.now()}-${Math.random()}`,
            text: caption.text,
            startTime: caption.startTime,
            endTime: caption.endTime,
            style: caption.style,
            position: caption.position,
            animation: caption.animation,
            highlightWords: [],
          })
        })
      }

      // 4. Atualizar duração
      if (data.duration) {
        setDuration(data.duration)
      }

      setIsBuilt(true)
      
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao montar vídeo. Tente novamente.')
    } finally {
      setIsBuilding(false)
    }
  }

  const canBuild = script && clips.length > 0

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            🎬 Montagem Automática
          </h3>
          <p className="text-xs text-gray-600">
            {canBuild 
              ? `${clips.length} imagem(ns) pronta(s) • ${duration.toFixed(1)}s`
              : 'Adicione roteiro e imagens primeiro'
            }
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Configurações"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Configurações */}
      {showSettings && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3 border border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Voz
            </label>
            <select
              value={settings.voice}
              onChange={(e) => setSettings({ ...settings, voice: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="alloy">Alloy (Neutra, Profissional)</option>
              <option value="echo">Echo (Masculina, Profunda)</option>
              <option value="fable">Fable (Masculina, Expressiva)</option>
              <option value="onyx">Onyx (Masculina, Grave)</option>
              <option value="nova">Nova (Feminina, Jovem)</option>
              <option value="shimmer">Shimmer (Feminina, Suave)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Transição entre Imagens
            </label>
            <select
              value={settings.transition}
              onChange={(e) => setSettings({ ...settings, transition: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="fade">Fade (Suave)</option>
              <option value="slide">Slide (Deslizante)</option>
              <option value="zoom">Zoom (Dinâmico)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Efeito nas Imagens
            </label>
            <select
              value={settings.imageEffect}
              onChange={(e) => setSettings({ ...settings, imageEffect: e.target.value as any })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="ken-burns">Ken Burns (Zoom + Movimento)</option>
              <option value="zoom-in">Zoom In</option>
              <option value="zoom-out">Zoom Out</option>
              <option value="pan-left">Pan Esquerda</option>
              <option value="pan-right">Pan Direita</option>
              <option value="none">Sem Efeito</option>
            </select>
          </div>
        </div>
      )}

      {/* Botão Principal */}
      {!isBuilt ? (
        <button
          onClick={handleBuildVideo}
          disabled={!canBuild || isBuilding}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3
            text-sm font-semibold rounded-lg transition-all
            ${canBuild && !isBuilding
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isBuilding ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Montando Vídeo...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Montar Vídeo Automático
            </>
          )}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">Vídeo Montado!</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Narração e legendas adicionadas. Veja o preview à esquerda e use "Exportar Vídeo" para baixar.
            </p>
          </div>
          <button
            onClick={() => setIsBuilt(false)}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Montar Novamente
          </button>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        💡 O vídeo será montado automaticamente com zoom, movimento e narração
      </p>
    </div>
  )
}

