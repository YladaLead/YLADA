'use client'

import { useState, useRef } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { AudioClip } from '@/types/creative-studio'
import { Mic, Loader2, Play, Volume2 } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface VoiceGeneratorProps {
  scriptText?: string // Texto do roteiro para narrar
  onVoiceGenerated?: (audioClip: AudioClip) => void
}

export function VoiceGenerator({ scriptText, onVoiceGenerated }: VoiceGeneratorProps) {
  const { script, captions, audioClips, addAudioClip, setCurrentTime, setIsPlaying } = useCreativeStudioStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState<'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'>('alloy')
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [audioDuration, setAudioDuration] = useState<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const authenticatedFetch = useAuthenticatedFetch()

  // Obter texto para narrar
  const getTextToNarrate = (): string => {
    if (scriptText) return scriptText
    
    // Se não tem texto específico, usar legendas ou roteiro
    if (captions.length > 0) {
      return captions.map(c => c.text).join('. ')
    }
    
    if (script.length > 0) {
      return script.map(s => s.text).join('. ')
    }
    
    return ''
  }

  const handleGenerateVoice = async () => {
    const textToNarrate = getTextToNarrate()
    
    if (!textToNarrate || textToNarrate.trim().length === 0) {
      alert('❌ Nenhum texto encontrado para narrar.\n\nAdicione legendas ou um roteiro primeiro.')
      return
    }

    setIsGenerating(true)
    setGeneratedAudio(null)

    try {
      const response = await authenticatedFetch('/api/creative-studio/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToNarrate,
          voice: selectedVoice,
          model: 'tts-1', // Modelo padrão (mais rápido e barato)
          speed: 1.0,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao gerar voz')
      }

      const data = await response.json()
      
      // Criar URL do áudio
      const audioUrl = data.audio || `data:audio/mpeg;base64,${data.audioBuffer}`
      setGeneratedAudio(audioUrl)
      setAudioDuration(data.duration || 0)

      // Criar AudioClip e adicionar ao store
      const audioClip: AudioClip = {
        id: `audio-${Date.now()}`,
        startTime: 0, // Começa no início (pode ajustar depois)
        endTime: data.duration || 0,
        source: audioUrl,
        text: textToNarrate,
        voice: selectedVoice,
        duration: data.duration || 0,
        volume: 1.0,
      }

      addAudioClip(audioClip)
      
      if (onVoiceGenerated) {
        onVoiceGenerated(audioClip)
      }

      // Ajustar duração do vídeo se necessário
      if (data.duration > 0) {
        const { setDuration } = useCreativeStudioStore.getState()
        const currentDuration = useCreativeStudioStore.getState().duration
        if (data.duration > currentDuration) {
          setDuration(data.duration)
        }
      }

    } catch (error: any) {
      console.error('Erro ao gerar voz:', error)
      alert(`❌ Erro ao gerar voz: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayAudio = () => {
    if (!generatedAudio) return
    
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
        setIsPlaying(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleAddToTimeline = () => {
    if (!generatedAudio) return
    
    const textToNarrate = getTextToNarrate()
    const audioClip: AudioClip = {
      id: `audio-${Date.now()}`,
      startTime: 0,
      endTime: audioDuration,
      source: generatedAudio,
      text: textToNarrate,
      voice: selectedVoice,
      duration: audioDuration,
      volume: 1.0,
    }

    addAudioClip(audioClip)
    alert('✅ Voz adicionada à timeline!')
  }

  const textToNarrate = getTextToNarrate()
  const hasText = textToNarrate.trim().length > 0

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Gerar Narração
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {hasText 
              ? `${textToNarrate.split(/\s+/).length} palavras • ~${Math.round(audioDuration)}s`
              : 'Adicione legendas ou roteiro primeiro'
            }
          </p>
        </div>
        <Volume2 className="w-5 h-5 text-purple-600" />
      </div>

      {!hasText && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            ⚠️ Adicione legendas ou um roteiro para gerar a narração.
          </p>
        </div>
      )}

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Voz
        </label>
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value as any)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isGenerating}
        >
          <option value="alloy">Alloy (Neutra, Profissional)</option>
          <option value="echo">Echo (Masculina, Profunda)</option>
          <option value="fable">Fable (Masculina, Expressiva)</option>
          <option value="onyx">Onyx (Masculina, Grave)</option>
          <option value="nova">Nova (Feminina, Jovem)</option>
          <option value="shimmer">Shimmer (Feminina, Suave)</option>
        </select>
      </div>

      <button
        onClick={handleGenerateVoice}
        disabled={!hasText || isGenerating}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-2.5
          text-sm font-medium rounded-md transition-colors mb-2
          ${hasText && !isGenerating
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Gerando voz...
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Gerar Narração
          </>
        )}
      </button>

      {generatedAudio && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayAudio}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Play className="w-3 h-3" />
              Ouvir
            </button>
            <button
              onClick={handleAddToTimeline}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
            >
              Adicionar à Timeline
            </button>
          </div>
          
          <audio
            ref={audioRef}
            src={generatedAudio}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={(e) => {
              const audio = e.currentTarget
              setCurrentTime(audio.currentTime)
            }}
            className="w-full"
            controls
          />
        </div>
      )}

      <div className="mt-2">
        <p className="text-xs text-gray-500 text-center">
          💡 A narração será sincronizada com as legendas automaticamente
        </p>
      </div>
    </div>
  )
}

