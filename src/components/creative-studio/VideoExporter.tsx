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

    // Mostrar instruções antes de iniciar
    const confirmExport = confirm(
      '📹 EXPORTAR VÍDEO\n\n' +
      '1. Clique em "OK" para iniciar\n' +
      '2. No modal que aparecer, selecione a GUIA "YLADA NUTRI - MARKETING"\n' +
      '3. Clique em "Compartilhar"\n' +
      '4. O vídeo será reproduzido automaticamente\n' +
      '5. Quando terminar, o download começará\n\n' +
      '⚠️ IMPORTANTE: Selecione a GUIA do navegador, não a tela inteira!'
    )

    if (!confirmExport) {
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
          preferCurrentTab: true, // Preferir a guia atual
        } as any,
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

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        
        // Parar o stream
        stream.getTracks().forEach(track => track.stop())

        setIsExporting(false)
        setIsRecording(false)
        setExportProgress(100)

        // Tentar usar File System Access API (Chrome/Edge)
        if ('showSaveFilePicker' in window) {
          try {
            const fileHandle = await (window as any).showSaveFilePicker({
              suggestedName: `anuncio-ylada-${Date.now()}.webm`,
              types: [
                {
                  description: 'Vídeo WebM',
                  accept: { 'video/webm': ['.webm'] },
                },
                {
                  description: 'Vídeo MP4',
                  accept: { 'video/mp4': ['.mp4'] },
                },
              ],
            })
            
            const writable = await fileHandle.createWritable()
            await writable.write(blob)
            await writable.close()
            
            setExportProgress(0)
            alert('✅ Vídeo salvo com sucesso!')
            return
          } catch (error: any) {
            // Se o usuário cancelar, não fazer nada
            if (error.name === 'AbortError') {
              setExportProgress(0)
              return
            }
            console.error('Erro ao salvar arquivo:', error)
          }
        }

        // Fallback: download direto
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `anuncio-ylada-${Date.now()}.webm`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        setTimeout(() => {
          setExportProgress(0)
          alert('✅ Vídeo baixado com sucesso!\n\nO arquivo foi salvo no formato WebM. Você pode convertê-lo para MP4 usando um conversor online se necessário.')
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
      
      setIsExporting(false)
      setIsRecording(false)
      setExportProgress(0)
      
      if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
        alert(
          '⚠️ EXPORTAÇÃO CANCELADA\n\n' +
          'Você cancelou o compartilhamento de tela.\n\n' +
          '💡 COMO EXPORTAR:\n' +
          '1. Clique em "Exportar Vídeo" novamente\n' +
          '2. No modal do Chrome, SELECIONE a guia "YLADA NUTRI - MARKETING"\n' +
          '3. Clique em "Compartilhar"\n\n' +
          '⚠️ IMPORTANTE: Você precisa SELECIONAR uma guia antes de clicar em "Compartilhar"!'
        )
      } else if (error.name === 'NotFoundError') {
        alert('❌ Nenhuma fonte de tela encontrada. Certifique-se de que seu navegador suporta gravação de tela.')
      } else {
        alert(
          '❌ Erro ao exportar vídeo: ' + (error.message || 'Erro desconhecido') + '\n\n' +
          '💡 DICA: Se a gravação automática não funcionar, você pode:\n\n' +
          '1. Reproduzir o vídeo no player\n' +
          '2. Usar a ferramenta de gravação de tela do seu sistema operacional\n' +
          '3. Gravar apenas a área do vídeo\n\n' +
          'No Mac: Cmd + Shift + 5\n' +
          'No Windows: Win + G (Game Bar)'
        )
      }
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

      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500 text-center">
          {isExporting 
            ? '⏳ Aguarde a gravação terminar...'
            : '💡 O vídeo será gravado diretamente da tela'
          }
        </p>
        {!isExporting && (
          <div className="text-xs text-gray-400 text-center px-2">
            <p className="font-medium text-gray-600 mb-1">📋 Instruções:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-left">
              <li>Clique em "Exportar Vídeo"</li>
              <li>No modal, selecione a <strong>GUIA</strong> do navegador</li>
              <li>Clique em "Compartilhar"</li>
              <li>O vídeo será gravado automaticamente</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

