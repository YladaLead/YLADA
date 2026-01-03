'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit2, Check, X, Sparkles, Upload, Image as ImageIcon, Loader2, Edit3, Send, Copy, Trash2 } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Scene {
  number: number
  startTime: number
  endTime: number
  text: string
  imageDescription: string
}

interface StoryboardViewProps {
  script: {
    hook: string
    problem: string
    solution: string
    cta: string
    scenes: Scene[]
  }
  approvedImages: Map<number, string[]>
  onTextChange: (sceneNumber: number, newText: string) => void
  onImageSelect: (sceneNumber: number, imageUrl: string) => void
  onCreateImage: (sceneNumber: number, customPrompt?: string) => Promise<string | null>
  onUploadImage: (sceneNumber: number, file: File) => Promise<string | null>
  onApprove: () => void
}

export function StoryboardView({
  script,
  approvedImages,
  onTextChange,
  onImageSelect,
  onImageRemove,
  onCreateImage,
  onUploadImage,
  onApprove,
}: StoryboardViewProps) {
  const [editingText, setEditingText] = useState<number | null>(null)
  const [editTextValue, setEditTextValue] = useState('')
  const [expandedImage, setExpandedImage] = useState<number | null>(null)
  const [isCreatingImage, setIsCreatingImage] = useState<number | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState<number | null>(null)
  const [showCustomPrompt, setShowCustomPrompt] = useState<number | null>(null)
  const [customPrompts, setCustomPrompts] = useState<Map<number, string>>(new Map())
  const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map())
  const authenticatedFetch = useAuthenticatedFetch()

  const handleStartEditText = (scene: Scene) => {
    setEditingText(scene.number)
    setEditTextValue(scene.text)
  }

  const handleSaveText = (sceneNumber: number) => {
    if (editTextValue.trim()) {
      onTextChange(sceneNumber, editTextValue.trim())
    }
    setEditingText(null)
    setEditTextValue('')
  }

  const handleCancelEdit = () => {
    setEditingText(null)
    setEditTextValue('')
  }

  const handleCreateImage = async (scene: Scene, useCustomPrompt = false) => {
    setIsCreatingImage(scene.number)
    try {
      const customPrompt = useCustomPrompt ? customPrompts.get(scene.number) : undefined
      const imageUrl = await onCreateImage(scene.number, customPrompt)
      if (imageUrl) {
        onImageSelect(scene.number, imageUrl)
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
        onImageSelect(scene.number, imageUrl)
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

  const removeImage = (sceneNumber: number, imageIndex: number) => {
    if (onImageRemove) {
      onImageRemove(sceneNumber, imageIndex)
    } else {
      // Fallback: remover todas e adicionar as restantes
      const currentImages = approvedImages.get(sceneNumber) || []
      const updatedImages = currentImages.filter((_, idx) => idx !== imageIndex)
      // Por enquanto, apenas log - o componente pai precisa implementar onImageRemove
      console.log(`Remover imagem ${imageIndex} da cena ${sceneNumber}`)
    }
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Texto copiado!')
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">📝 Storyboard - Visualização e Edição</h3>
        <button
          onClick={onApprove}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Aprovar e Montar Vídeo
        </button>
      </div>

      {/* Cenas em formato Storyboard */}
      <div className="space-y-4">
        {script.scenes.map((scene) => {
          const sceneImages = approvedImages.get(scene.number) || []
          const hasImage = sceneImages.length > 0

          return (
            <div
              key={scene.number}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors bg-gradient-to-r from-white to-gray-50"
            >
              {/* Cabeçalho da Cena */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-lg">
                    CENA {scene.number}
                  </span>
                  <span className="text-xs text-gray-500">
                    {scene.startTime}s - {scene.endTime}s ({scene.endTime - scene.startTime}s)
                  </span>
                </div>
              </div>

              {/* Layout Storyboard: Texto à Esquerda, Imagem à Direita */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* LADO ESQUERDO - TEXTO */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase">Texto da Cena</label>
                    <div className="flex gap-1">
                      {editingText === scene.number ? (
                        <>
                          <button
                            onClick={() => handleSaveText(scene.number)}
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
                            onClick={() => copyText(scene.text)}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                            title="Copiar texto"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleStartEditText(scene)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Editar texto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editingText === scene.number ? (
                    <textarea
                      value={editTextValue}
                      onChange={(e) => {
                        setEditTextValue(e.target.value)
                        e.target.style.height = 'auto'
                        e.target.style.height = `${e.target.scrollHeight}px`
                      }}
                      className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      style={{ minHeight: '80px' }}
                      autoFocus
                      placeholder="Digite o texto da cena..."
                    />
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 min-h-[80px]">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{scene.text}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 bg-blue-50 rounded p-2">
                    <strong>Descrição da Imagem:</strong> {scene.imageDescription}
                  </div>
                </div>

                {/* LADO DIREITO - IMAGEM */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase">
                      Imagem da Cena {hasImage && `(${sceneImages.length})`}
                    </label>
                    {hasImage && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-medium">
                        ✓ Adicionada
                      </span>
                    )}
                  </div>

                  {/* Preview da Imagem */}
                  {hasImage ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {sceneImages.map((imageUrl, idx) => (
                          <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-green-300">
                            <img
                              src={imageUrl}
                              alt={`Cena ${scene.number} - Imagem ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded font-bold">
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
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">Nenhuma imagem</p>
                      </div>
                    </div>
                  )}

                  {/* Controles de Imagem - Expandir/Recolher */}
                  {expandedImage === scene.number ? (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-blue-900">Adicionar Imagem</p>
                        <button
                          onClick={() => setExpandedImage(null)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Fechar
                        </button>
                      </div>

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
                            placeholder="Ex: nutricionista sorrindo com tablet mostrando dashboard YLADA..."
                            className="w-full px-2 py-1.5 border border-blue-300 rounded text-xs resize-none"
                            rows={2}
                            style={{ minHeight: '50px' }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCreateImage(scene, true)}
                              disabled={isCreatingImage === scene.number}
                              className="flex-1 px-2 py-1.5 bg-blue-600 text-white rounded text-xs font-medium disabled:opacity-50"
                            >
                              {isCreatingImage === scene.number ? (
                                <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                              ) : (
                                'Criar com esta descrição'
                              )}
                            </button>
                            <button
                              onClick={() => setShowCustomPrompt(null)}
                              className="px-2 py-1.5 bg-gray-200 text-gray-700 rounded text-xs"
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
                            className="px-2 py-2 bg-purple-600 text-white rounded text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            {isCreatingImage === scene.number ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3" />
                                Criar IA
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomPrompt(scene.number)
                              if (!customPrompts.has(scene.number)) {
                                setCustomPrompts((prev) => {
                                  const newMap = new Map(prev)
                                  newMap.set(scene.number, scene.imageDescription)
                                  return newMap
                                })
                              }
                            }}
                            disabled={isCreatingImage === scene.number || isUploadingImage === scene.number}
                            className="px-2 py-2 bg-indigo-600 text-white rounded text-xs font-medium flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <Edit3 className="w-3 h-3" />
                            Personalizar
                          </button>
                          <label className="px-2 py-2 bg-blue-600 text-white rounded text-xs font-medium flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50">
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

                      {isUploadingImage === scene.number && (
                        <p className="text-xs text-blue-600 text-center">
                          <Loader2 className="w-3 h-3 inline animate-spin mr-1" />
                          Enviando...
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setExpandedImage(scene.number)
                        if (!customPrompts.has(scene.number)) {
                          setCustomPrompts((prev) => {
                            const newMap = new Map(prev)
                            newMap.set(scene.number, scene.imageDescription)
                            return newMap
                          })
                        }
                      }}
                      className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                        hasImage
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 inline mr-2" />
                      {hasImage ? `Editar Imagem(s) (${sceneImages.length})` : 'Adicionar Imagem'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

