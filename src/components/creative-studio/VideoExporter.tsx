'use client'

import { useState, useRef, useEffect } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Download, Loader2, Video } from 'lucide-react'

export function VideoExporter() {
  const { clips, captions, duration, isPlaying, setIsPlaying, setCurrentTime } = useCreativeStudioStore()
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Função para capturar o vídeo usando MediaRecorder
  const handleExport = async () => {
    if (clips.length === 0) {
      alert('Adicione pelo menos um clip ao vídeo antes de exportar')
      return
    }

    // Encontrar o container do vídeo
    const videoContainer = document.querySelector('[data-video-container]') as HTMLElement
    if (!videoContainer) {
      alert('Não foi possível encontrar o player de vídeo. Certifique-se de que o vídeo está visível na tela.')
      return
    }

    setIsExporting(true)
    setExportProgress(0)

    try {
      // Usar Screen Capture API para gravar a área do vídeo
      const displayMediaOptions = {
        video: {
          displaySurface: 'browser' as const,
        },
        audio: false,
      }

      // Tentar capturar a tela (requer permissão do usuário)
      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
      streamRef.current = stream

      // Criar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      })

      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `video-ylada-${Date.now()}.webm`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // Parar o stream
        stream.getTracks().forEach(track => track.stop())

        setIsExporting(false)
        setIsRecording(false)
        setExportProgress(100)
        
        setTimeout(() => {
          setExportProgress(0)
          alert('✅ Vídeo exportado com sucesso!\n\nO arquivo foi baixado no formato WebM. Você pode convertê-lo para MP4 usando um conversor online se necessário.')
        }, 500)
      }

      // Iniciar gravação
      setIsRecording(true)
      mediaRecorder.start()

      // Reproduzir o vídeo automaticamente
      setIsPlaying(true)
      setCurrentTime(0)

      // Atualizar progresso em tempo real
      const progressInterval = setInterval(() => {
        const store = useCreativeStudioStore.getState()
        const progress = (store.currentTime / duration) * 100
        setExportProgress(Math.min(progress, 95))
      }, 100)

      // Parar gravação quando o vídeo terminar
      const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop()
          clearInterval(progressInterval)
          setIsPlaying(false)
        }
      }

      // Listener para quando o vídeo terminar (mais preciso que setTimeout)
      const videoElement = document.querySelector('video') as HTMLVideoElement
      let timeoutId: NodeJS.Timeout | null = null
      
      const onVideoEnd = () => {
        stopRecording()
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        if (videoElement) {
          videoElement.removeEventListener('ended', onVideoEnd)
        }
      }

      if (videoElement) {
        videoElement.addEventListener('ended', onVideoEnd)
      }

      // Fallback: Aguardar o vídeo terminar (com margem de segurança)
      timeoutId = setTimeout(() => {
        stopRecording()
        if (videoElement) {
          videoElement.removeEventListener('ended', onVideoEnd)
        }
      }, (duration * 1000) + 1000) // +1s de margem

    } catch (error: any) {
      console.error('Erro ao exportar vídeo:', error)
      
      if (error.name === 'NotAllowedError') {
        alert('❌ Permissão negada. Por favor, permita o acesso à tela para gravar o vídeo.')
      } else if (error.name === 'NotFoundError') {
        alert('❌ Nenhuma fonte de tela encontrada. Certifique-se de que seu navegador suporta gravação de tela.')
      } else {
        alert('❌ Erro ao exportar vídeo: ' + (error.message || 'Erro desconhecido'))
      }
      
      setIsExporting(false)
      setIsRecording(false)
      setExportProgress(0)
      
      // Fallback: instruções para screen recording manual
      alert(
        '💡 DICA: Se a gravação automática não funcionar, você pode:\n\n' +
        '1. Reproduzir o vídeo no player\n' +
        '2. Usar a ferramenta de gravação de tela do seu sistema operacional\n' +
        '3. Gravar apenas a área do vídeo\n\n' +
        'No Mac: Cmd + Shift + 5\n' +
        'No Windows: Win + G (Game Bar)'
      )
    }
  }

  // Limpar recursos ao desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const canExport = clips.length > 0 && !isExporting

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Exportar Vídeo
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {clips.length} clip(s) • {captions.length} legenda(s) • {duration.toFixed(1)}s
          </p>
        </div>
        <Video className="w-5 h-5 text-purple-600" />
      </div>

      {isExporting && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Exportando...</span>
            <span>{exportProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleExport}
        disabled={!canExport || isExporting}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-2.5
          text-sm font-medium rounded-md transition-colors
          ${canExport && !isExporting
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isExporting ? (
          <>
            {isRecording ? (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                Gravando... ({Math.round(exportProgress)}%)
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparando...
              </>
            )}
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Exportar Vídeo
          </>
        )}
      </button>

      {isRecording && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800 font-medium mb-1">
            🎬 Gravando vídeo...
          </p>
          <p className="text-xs text-yellow-700">
            O vídeo será reproduzido automaticamente. Quando terminar, o download começará.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2 text-center">
        {isExporting 
          ? '⏳ Aguarde a gravação terminar...'
          : '💡 O vídeo será gravado diretamente da tela'
        }
      </p>
    </div>
  )
}

