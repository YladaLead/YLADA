'use client'

import { useState, useRef } from 'react'
import { Check, X, Upload, Sparkles, Image as ImageIcon, Loader2, Edit3, Send } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Scene {
  number: number
  startTime: number
  endTime: number
  text: string
  imageDescription: string
}

interface SceneImageSelectorProps {
  scene: Scene
  suggestedImageUrl?: string
  onApprove: (imageUrl: string) => void
  onCreateWithAI: () => Promise<string | null>
  onUpload: (file: File) => Promise<string | null>
  onSkip: () => void
}

export function SceneImageSelector({
  scene,
  suggestedImageUrl,
  onApprove,
  onCreateWithAI,
  onUpload,
  onSkip,
}: SceneImageSelectorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(suggestedImageUrl || null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const [customPrompt, setCustomPrompt] = useState(scene.imageDescription)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const authenticatedFetch = useAuthenticatedFetch()

  const handleCreateWithAI = async (useCustomPrompt = false) => {
    setIsCreating(true)
    try {
      let imageUrl: string | null = null
      
      if (useCustomPrompt && customPrompt.trim()) {
        // Criar com prompt personalizado
        const response = await authenticatedFetch('/api/creative-studio/search-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `Professional ${customPrompt}, Instagram ads style, vertical 9:16, high quality, modern design, detailed`,
            type: 'create',
            count: 1,
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          imageUrl = data.images?.[0]?.url || null
        }
      } else {
        // Usar função padrão
        imageUrl = await onCreateWithAI()
      }
      
      if (imageUrl) {
        setSelectedImage(imageUrl)
        setShowCustomPrompt(false)
      }
    } catch (error) {
      console.error('Erro ao criar imagem:', error)
      alert('Erro ao criar imagem com IA. Tente novamente.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem')
      return
    }

    setIsUploading(true)
    try {
      const imageUrl = await onUpload(file)
      if (imageUrl) {
        setSelectedImage(imageUrl)
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem. Tente novamente.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleApprove = () => {
    if (selectedImage) {
      onApprove(selectedImage)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Cabeçalho da Cena */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
            CENA {scene.number}
          </span>
          <span className="text-xs text-gray-500">
            {scene.startTime}s - {scene.endTime}s
          </span>
        </div>
      </div>

      {/* Texto da Cena */}
      <div className="bg-gray-50 rounded p-2">
        <p className="text-sm text-gray-700 font-medium mb-1">Texto:</p>
        <p className="text-sm text-gray-900">{scene.text}</p>
      </div>

      {/* Descrição da Imagem */}
      <div className="bg-blue-50 rounded p-2">
        <p className="text-xs text-blue-700 font-medium mb-1">Imagem sugerida:</p>
        <p className="text-xs text-blue-900">{scene.imageDescription}</p>
      </div>

      {/* Preview da Imagem */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={`Cena ${scene.number}`}
            className="w-full h-full object-cover"
            onError={() => {
              setSelectedImage(null)
              alert('Erro ao carregar imagem. Tente novamente.')
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Nenhuma imagem selecionada</p>
            </div>
          </div>
        )}
      </div>

      {/* Campo de Prompt Personalizado */}
      {showCustomPrompt && (
        <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <label className="text-sm font-medium text-blue-900">
            Descreva a imagem que você quer (seja específico):
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight}px`
            }}
            placeholder="Ex: nutricionista sorrindo com tablet mostrando dashboard YLADA, fundo moderno, cores roxas e verdes..."
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            rows={3}
            style={{ minHeight: '60px' }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleCreateWithAI(true)}
              disabled={isCreating || !customPrompt.trim()}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isCreating ? 'Criando...' : 'Criar com esta descrição'}
            </button>
            <button
              onClick={() => {
                setShowCustomPrompt(false)
                setCustomPrompt(scene.imageDescription)
              }}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Opções de Ação */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleCreateWithAI(false)}
          disabled={isCreating || isUploading}
          className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isCreating ? 'Criando...' : 'Criar com IA'}
        </button>
        
        <button
          onClick={() => setShowCustomPrompt(!showCustomPrompt)}
          disabled={isCreating || isUploading}
          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit3 className="w-4 h-4" />
          Personalizar
        </button>

        <label className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          <Upload className="w-4 h-4" />
          {isUploading ? 'Enviando...' : 'Upload'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isCreating || isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Botões de Ação Final */}
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={!selectedImage || isCreating || isUploading}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" />
          Aprovar esta imagem
        </button>
        <button
          onClick={onSkip}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
        >
          Pular
        </button>
      </div>
    </div>
  )
}

