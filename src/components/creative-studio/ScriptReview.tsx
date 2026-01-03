'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, X, Edit2, Trash2, Clock, Sparkles, Upload, Image as ImageIcon, Loader2, Edit3, Send } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Scene {
  number: number
  startTime: number
  endTime: number
  text: string
  imageDescription: string
}

interface ScriptReviewProps {
  script: {
    hook: string
    problem: string
    solution: string
    cta: string
    scenes: Scene[]
  }
  onApprove: () => void
  onEdit: (sceneNumber: number, newText: string) => void
  onDelete: (sceneNumber: number) => void
  onImageSelect?: (sceneNumber: number, imageUrl: string) => void
  onCreateImage?: (sceneNumber: number, customPrompt?: string) => Promise<string | null>
  onUploadImage?: (sceneNumber: number, file: File) => Promise<string | null>
  approvedImages?: Map<number, string[]> // Imagens já aprovadas (para sincronização)
}

export function ScriptReview({ 
  script, 
  onApprove, 
  onEdit, 
  onDelete,
  onImageSelect,
  onCreateImage,
  onUploadImage,
  approvedImages,
}: ScriptReviewProps) {
  const [editingScene, setEditingScene] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [expandedImageScenes, setExpandedImageScenes] = useState<Set<number>>(new Set())
  // Múltiplas imagens por cena: Map<sceneNumber, string[]>
  // Sincronizar com approvedImages se fornecido
  const [selectedImages, setSelectedImages] = useState<Map<number, string[]>>(
    approvedImages ? new Map(approvedImages) : new Map()
  )
  
  // Sincronizar quando approvedImages mudar
  useEffect(() => {
    if (approvedImages) {
      setSelectedImages(new Map(approvedImages))
    }
  }, [approvedImages])
  const [isCreatingImage, setIsCreatingImage] = useState<number | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState<number | null>(null)
  const [showCustomPrompt, setShowCustomPrompt] = useState<number | null>(null)
  const [customPrompts, setCustomPrompts] = useState<Map<number, string>>(new Map())
  const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map())
  const authenticatedFetch = useAuthenticatedFetch()

  const handleStartEdit = (scene: Scene) => {
    setEditingScene(scene.number)
    setEditText(scene.text)
  }

  const handleSaveEdit = (sceneNumber: number) => {
    onEdit(sceneNumber, editText)
    setEditingScene(null)
    setEditText('')
  }

  const handleCancelEdit = () => {
    setEditingScene(null)
    setEditText('')
  }

  const handleCreateImage = async (scene: Scene, useCustomPrompt = false) => {
    if (!onCreateImage) return
    
    setIsCreatingImage(scene.number)
    try {
      const customPrompt = useCustomPrompt ? customPrompts.get(scene.number) : undefined
      const imageUrl = await onCreateImage(scene.number, customPrompt)
      if (imageUrl) {
        setSelectedImages((prev) => {
          const newMap = new Map(prev)
          const currentImages = newMap.get(scene.number) || []
          newMap.set(scene.number, [...currentImages, imageUrl])
          return newMap
        })
        if (onImageSelect) {
          onImageSelect(scene.number, imageUrl)
        }
        setShowCustomPrompt(null)
      }
    } catch (error) {
      console.error('Erro ao criar imagem:', error)
      alert('Erro ao criar imagem com IA. Tente novamente.')
    } finally {
      setIsCreatingImage(null)
    }
  }

  const handleUploadImage = async (scene: Scene, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUploadImage) return
    
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem')
      return
    }

    setIsUploadingImage(scene.number)
    try {
      const imageUrl = await onUploadImage(scene.number, file)
      if (imageUrl) {
        setSelectedImages((prev) => {
          const newMap = new Map(prev)
          const currentImages = newMap.get(scene.number) || []
          newMap.set(scene.number, [...currentImages, imageUrl])
          return newMap
        })
        if (onImageSelect) {
          onImageSelect(scene.number, imageUrl)
        }
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem. Tente novamente.')
    } finally {
      setIsUploadingImage(null)
      const input = fileInputRefs.current.get(scene.number)
      if (input) input.value = ''
    }
  }

  const toggleImageSelector = (sceneNumber: number) => {
    setExpandedImageScenes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(sceneNumber)) {
        newSet.delete(sceneNumber)
      } else {
        newSet.add(sceneNumber)
      }
      return newSet
    })
    // Inicializar prompt se não existir
    if (!customPrompts.has(sceneNumber)) {
      const scene = script.scenes.find(s => s.number === sceneNumber)
      if (scene) {
        setCustomPrompts((prev) => {
          const newMap = new Map(prev)
          newMap.set(sceneNumber, scene.imageDescription)
          return newMap
        })
      }
    }
  }

  const removeImage = (sceneNumber: number, imageIndex: number) => {
    setSelectedImages((prev) => {
      const newMap = new Map(prev)
      const currentImages = newMap.get(sceneNumber) || []
      const updatedImages = currentImages.filter((_, idx) => idx !== imageIndex)
      if (updatedImages.length === 0) {
        newMap.delete(sceneNumber)
      } else {
        newMap.set(sceneNumber, updatedImages)
      }
      return newMap
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">📝 Roteiro Criado</h3>
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Aprovar e Continuar
          </button>
        </div>
      </div>

      {/* Estrutura Geral */}
      <div className="bg-purple-50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-purple-900">Estrutura do Anúncio:</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Hook (0-5s):</strong> {script.hook}</p>
          <p><strong>Problema (5-15s):</strong> {script.problem}</p>
          <p><strong>Solução (15-25s):</strong> {script.solution}</p>
          <p><strong>CTA (25-30s):</strong> {script.cta}</p>
        </div>
      </div>

      {/* Cenas Detalhadas */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Cenas Detalhadas:</h4>
        {script.scenes.map((scene) => (
          <div
            key={scene.number}
            className="border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  CENA {scene.number}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {scene.startTime}s - {scene.endTime}s ({scene.endTime - scene.startTime}s)
                </div>
              </div>
              <div className="flex gap-1">
                {editingScene === scene.number ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(scene.number)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Salvar"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(scene)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(scene.number)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {editingScene === scene.number ? (
              <textarea
                value={editText}
                onChange={(e) => {
                  setEditText(e.target.value)
                  // Auto-resize
                  e.target.style.height = 'auto'
                  e.target.style.height = `${e.target.scrollHeight}px`
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none overflow-hidden"
                style={{ minHeight: '60px' }}
                autoFocus
              />
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-700"><strong>Texto:</strong> {scene.text}</p>
                <p className="text-xs text-gray-500"><strong>Imagem:</strong> {scene.imageDescription}</p>
              </div>
            )}

            {/* Seletor de Imagem - SEMPRE VISÍVEL quando expandido */}
            {expandedImageScenes.has(scene.number) && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-blue-900">
                    Escolher Imagem(s) para Cena {scene.number}:
                  </p>
                  <button
                    onClick={() => toggleImageSelector(scene.number)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Fechar
                  </button>
                </div>

                {/* Preview das Imagens Selecionadas - Múltiplas */}
                {selectedImages.has(scene.number) && selectedImages.get(scene.number)!.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 font-medium">
                        {selectedImages.get(scene.number)!.length} imagem(ns) selecionada(s):
                      </p>
                      {selectedImages.get(scene.number)!.length === 1 && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-medium">
                          ✓ Sugerida automaticamente
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedImages.get(scene.number)!.map((imageUrl, idx) => (
                        <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-300">
                          <img
                            src={imageUrl}
                            alt={`Cena ${scene.number} - Imagem ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                            #{idx + 1}
                          </div>
                          <button
                            onClick={() => removeImage(scene.number, idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Remover imagem"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campo de Prompt Personalizado */}
                {showCustomPrompt === scene.number && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-blue-900">
                      Descreva a imagem com mais detalhes:
                    </label>
                    <textarea
                      value={customPrompts.get(scene.number) || scene.imageDescription}
                      onChange={(e) => {
                        setCustomPrompts((prev) => {
                          const newMap = new Map(prev)
                          newMap.set(scene.number, e.target.value)
                          return newMap
                        })
                        e.target.style.height = 'auto'
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      placeholder="Ex: nutricionista sorrindo com tablet mostrando dashboard YLADA, fundo moderno..."
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      rows={2}
                      style={{ minHeight: '50px' }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCreateImage(scene, true)}
                        disabled={isCreatingImage === scene.number}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                      >
                        {isCreatingImage === scene.number ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Criar com esta descrição
                      </button>
                      <button
                        onClick={() => setShowCustomPrompt(null)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Botões de Ação */}
                {showCustomPrompt !== scene.number && (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleCreateImage(scene, false)}
                      disabled={isCreatingImage === scene.number || isUploadingImage === scene.number}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                    >
                      {isCreatingImage === scene.number ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3" />
                      )}
                      Criar IA
                    </button>
                    <button
                      onClick={() => setShowCustomPrompt(scene.number)}
                      disabled={isCreatingImage === scene.number || isUploadingImage === scene.number}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                    >
                      <Edit3 className="w-3 h-3" />
                      Personalizar
                    </button>
                    <label className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50">
                      <Upload className="w-3 h-3" />
                      Upload
                      <input
                        ref={(el) => {
                          if (el) fileInputRefs.current.set(scene.number, el)
                        }}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadImage(scene, e)}
                        disabled={isCreatingImage === scene.number || isUploadingImage === scene.number}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Status de Upload */}
                {isUploadingImage === scene.number && (
                  <p className="text-xs text-blue-600 text-center">
                    <Loader2 className="w-3 h-3 inline animate-spin mr-1" />
                    Enviando imagem...
                  </p>
                )}
              </div>
            )}

            {/* Botão para escolher imagem - SEMPRE VISÍVEL */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => toggleImageSelector(scene.number)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-colors ${
                  expandedImageScenes.has(scene.number)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : selectedImages.has(scene.number) && selectedImages.get(scene.number)!.length > 0
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                {expandedImageScenes.has(scene.number) 
                  ? 'Fechar Seleção de Imagens' 
                  : selectedImages.has(scene.number) && selectedImages.get(scene.number)!.length > 0
                    ? `✓ Imagem Adicionada (${selectedImages.get(scene.number)!.length})`
                    : 'Escolher Imagem(s)'}
              </button>
              {selectedImages.has(scene.number) && selectedImages.get(scene.number)!.length > 0 && (
                <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded border border-green-300">
                  ✓ {selectedImages.get(scene.number)!.length} imagem(ns)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

