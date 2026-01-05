'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Film, Image, Music, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { VideoClip } from '@/types/creative-studio'
import { cn } from '@/lib/utils'

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: 'video' | 'image' | 'audio' | 'other'
  duration?: number
}

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/mov',
  'video/avi',
  'video/*',
]
const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addClip, clips, setDuration, setUploadedVideo } = useCreativeStudioStore()

  const getFileType = (file: File): UploadedFile['type'] => {
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.split('.').pop()

    if (
      file.type.startsWith('video/') ||
      ACCEPTED_VIDEO_TYPES.includes(file.type) ||
      ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'm4v'].includes(fileExtension || '')
    ) {
      return 'video'
    }

    if (
      file.type.startsWith('audio/') ||
      ACCEPTED_AUDIO_TYPES.includes(file.type) ||
      ['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(fileExtension || '')
    ) {
      return 'audio'
    }

    if (
      file.type.startsWith('image/') ||
      ACCEPTED_IMAGE_TYPES.includes(file.type) ||
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')
    ) {
      return 'image'
    }

    return 'other'
  }

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'video':
        return <Film className="w-5 h-5" />
      case 'audio':
        return <Music className="w-5 h-5" />
      case 'image':
        return <Image className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      const url = URL.createObjectURL(file)
      let resolved = false

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true
          window.URL.revokeObjectURL(url)
          resolve(10)
        }
      }, 10000)

      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        if (!resolved) {
          resolved = true
          clearTimeout(timeout)
          const duration = video.duration || 10
          window.URL.revokeObjectURL(url)
          resolve(duration)
        }
      }
      video.onerror = () => {
        if (!resolved) {
          resolved = true
          clearTimeout(timeout)
          window.URL.revokeObjectURL(url)
          resolve(10)
        }
      }
      video.src = url
    })
  }

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = document.createElement('audio')
      audio.preload = 'metadata'
      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src)
        resolve(audio.duration)
      }
      audio.onerror = () => resolve(0)
      audio.src = URL.createObjectURL(file)
    })
  }

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const newErrors: string[] = []
    const newFiles: UploadedFile[] = []

    setIsProcessing(true)
    setErrors([])

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]

      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`${file.name}: Arquivo muito grande (máx. ${formatFileSize(MAX_FILE_SIZE)})`)
        continue
      }

      const fileType = getFileType(file)
      console.log('📁 Arquivo processado:', {
        name: file.name,
        type: file.type,
        size: file.size,
        detectedType: fileType,
      })
      
      if (fileType === 'other') {
        newErrors.push(`${file.name}: Formato não suportado (tipo: ${file.type || 'desconhecido'})`)
        continue
      }

      let preview = ''
      let duration = 0

      if (fileType === 'video') {
        try {
          preview = URL.createObjectURL(file)
          duration = await getVideoDuration(file)
          if (duration <= 0) duration = 10
        } catch (error) {
          duration = 10
        }
      } else if (fileType === 'audio') {
        preview = ''
        duration = await getAudioDuration(file)
      } else if (fileType === 'image') {
        preview = URL.createObjectURL(file)
        duration = 5
      }

      const newFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
        type: fileType,
        duration,
      }

      newFiles.push(newFile)
      setUploadedFiles((prev) => [...prev, newFile])
      
      // Salvar vídeo no store imediatamente quando fizer upload (para o assistente detectar)
      if (fileType === 'video') {
        setUploadedVideo(file)
      }
    }

    setErrors(newErrors)
    setIsProcessing(false)
  }, [setUploadedVideo])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
      }
    },
    [processFiles]
  )

  const removeFile = useCallback((id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file && file.preview.startsWith('blob:')) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }, [])

  const addToTimeline = useCallback(
    (uploadedFile: UploadedFile) => {
      try {
        // Garantir que o tipo seja detectado corretamente
        const fileType = uploadedFile.type || getFileType(uploadedFile.file)
        
        // Determinar o tipo do clip baseado no arquivo
        let clipType: VideoClip['type'] = 'image'
        if (fileType === 'video') {
          clipType = 'video'
        } else if (fileType === 'image') {
          clipType = 'image'
        } else if (fileType === 'audio') {
          // Áudio será tratado separadamente, mas por enquanto como vídeo
          clipType = 'video'
        }

        const lastClip = clips.length > 0 ? clips[clips.length - 1] : null
        const startTime = lastClip ? lastClip.endTime : 0
        const endTime = startTime + (uploadedFile.duration || 5)

        // Criar URL do arquivo
        let source = ''
        if (uploadedFile.preview && uploadedFile.preview.startsWith('blob:')) {
          source = uploadedFile.preview
        } else {
          // Criar blob URL se não tiver preview
          source = URL.createObjectURL(uploadedFile.file)
        }

        const clip: VideoClip = {
          id: `upload-${uploadedFile.id}`,
          startTime,
          endTime,
          source,
          type: clipType,
        }

        addClip(clip)

        // Salvar arquivo original se for vídeo (para análise automática)
        if (fileType === 'video') {
          setUploadedVideo(uploadedFile.file)
        }

        const maxEndTime = clips.length > 0 ? Math.max(...clips.map((c) => c.endTime)) : 0
        if (endTime > maxEndTime) {
          setDuration(endTime)
        }
        
        console.log('✅ Arquivo adicionado à timeline:', {
          name: uploadedFile.file.name,
          type: fileType,
          clipType,
          duration: uploadedFile.duration,
        })
      } catch (error) {
        console.error('Erro ao adicionar à timeline:', error)
        alert(`Erro ao adicionar ${uploadedFile.file.name} à timeline: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    },
    [clips, addClip, setDuration, setUploadedVideo]
  )

  const addAllToTimeline = useCallback(() => {
    uploadedFiles.forEach((file) => {
      addToTimeline(file)
    })
  }, [uploadedFiles, addToTimeline])

  return (
    <div className="space-y-2">
      {/* Área de Upload Ultra Compacta */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-all flex-shrink-0',
          isDragging
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,audio/*,image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex items-center justify-center gap-2">
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
              <p className="text-xs text-gray-600">Processando...</p>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-gray-400" />
              <p className="text-xs font-medium text-gray-700">
                Arraste ou clique • Máx. {formatFileSize(MAX_FILE_SIZE)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Erros */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-800 mb-2">
                Erros ao processar arquivos ({errors.length}):
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Arquivos Carregados - Compacto com scroll */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {uploadedFiles.length} arquivo(s)
            </h3>
            <button
              onClick={addAllToTimeline}
              className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 flex items-center gap-1 flex-shrink-0"
            >
              <CheckCircle2 className="w-3 h-3" />
              Adicionar Todos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto pr-1" style={{ maxHeight: '200px' }}>
            {uploadedFiles.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="bg-gray-50 rounded border border-gray-200 overflow-hidden hover:shadow transition-shadow"
              >
                {/* Preview Compacto */}
                <div className="relative aspect-video bg-gray-100">
                  {uploadedFile.type === 'video' && (
                    <video
                      src={uploadedFile.preview}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  )}
                  {uploadedFile.type === 'image' && (
                    <img
                      src={uploadedFile.preview}
                      alt={uploadedFile.file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {uploadedFile.type === 'audio' && (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
                      <Music className="w-16 h-16 text-white opacity-80 mb-2" />
                      <p className="text-white text-sm font-medium">{uploadedFile.file.name}</p>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(uploadedFile.id)
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Info Compacto */}
                <div className="p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="text-purple-600 flex-shrink-0">
                      {getFileIcon(uploadedFile.type)}
                    </div>
                    <p className="text-xs font-medium text-gray-900 truncate flex-1">
                      {uploadedFile.file.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadedFile.file.size)}
                      {uploadedFile.duration && ` • ${Math.floor(uploadedFile.duration)}s`}
                    </p>
                    <button
                      onClick={() => addToTimeline(uploadedFile)}
                      className="px-2 py-0.5 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

