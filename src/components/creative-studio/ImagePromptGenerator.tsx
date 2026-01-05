'use client'

import { useState, useRef } from 'react'
import { Copy, Check, Sparkles, AlertCircle, Upload, Edit3, Wand2 } from 'lucide-react'
import { identifyDor, getImagePromptForDor, getDorMapping, type DorType } from '@/lib/creative-studio/dor-mapper'

interface ImagePromptGeneratorProps {
  sceneDescription: string
  sceneNumber: number
  onPromptGenerated?: (prompt: string, dor: DorType) => void
  onUploadImage?: (file: File) => Promise<string | null>
  onCreateWithYaki?: (prompt: string) => Promise<string | null>
  onEditImage?: (imageUrl: string) => void
}

export function ImagePromptGenerator({ 
  sceneDescription, 
  sceneNumber, 
  onPromptGenerated,
  onUploadImage,
  onCreateWithYaki,
  onEditImage
}: ImagePromptGeneratorProps) {
  const [copied, setCopied] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isCreatingWithYaki, setIsCreatingWithYaki] = useState(false)
  const [createdImageUrl, setCreatedImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Identificar a dor e gerar prompt
  const dor = identifyDor(sceneDescription)
  const dorMapping = getDorMapping(dor)
  const prompt = getImagePromptForDor(dor, sceneDescription)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    
    if (onPromptGenerated) {
      onPromptGenerated(prompt, dor)
    }
  }

  const handleCreateWithYaki = async () => {
    if (!onCreateWithYaki) return
    
    setIsCreatingWithYaki(true)
    try {
      const imageUrl = await onCreateWithYaki(prompt)
      if (imageUrl) {
        setCreatedImageUrl(imageUrl)
        if (onPromptGenerated) {
          onPromptGenerated(prompt, dor)
        }
      }
    } catch (error) {
      console.error('Erro ao criar com Yaki:', error)
      alert('Erro ao criar imagem com Yaki. Tente novamente.')
    } finally {
      setIsCreatingWithYaki(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onUploadImage) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem')
      return
    }

    try {
      const imageUrl = await onUploadImage(file)
      if (imageUrl) {
        setCreatedImageUrl(imageUrl)
        if (onPromptGenerated) {
          onPromptGenerated(prompt, dor)
        }
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem. Tente novamente.')
    }
  }

  const handleEditImage = () => {
    if (createdImageUrl && onEditImage) {
      onEditImage(createdImageUrl)
    }
  }

  if (!showPrompt) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 mb-1">
              Imagem não encontrada no acervo
            </h4>
            <p className="text-sm text-yellow-700 mb-3">
              Para a CENA {sceneNumber}, identifiquei a dor: <strong>{dorMapping.name}</strong>
            </p>
            <button
              onClick={() => setShowPrompt(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Gerar Prompt para ChatGPT
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-blue-900 mb-1">
            === SOLICITAÇÃO DE IMAGEM PARA CHATGPT ===
          </h4>
          <p className="text-xs text-blue-700 mb-3">
            CENA {sceneNumber} • Dor identificada: <strong>{dorMapping.name}</strong>
          </p>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-3">
            <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
              {prompt}
            </pre>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <p className="text-sm font-semibold text-red-900 mb-1">
              ⚠️ AÇÃO NECESSÁRIA:
            </p>
            <p className="text-xs text-red-700">
              Esta imagem NÃO foi criada automaticamente para evitar custos.
              Copie o prompt acima e solicite a geração da imagem no ChatGPT
              somente se desejar prosseguir.
            </p>
          </div>

          <div className="space-y-2">
            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Prompt
                  </>
                )}
              </button>
              
              {onCreateWithYaki && (
                <button
                  onClick={handleCreateWithYaki}
                  disabled={isCreatingWithYaki}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingWithYaki ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Criar com Yaki
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {onUploadImage && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={handleUploadClick}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Fazer Upload
                  </button>
                </>
              )}

              {createdImageUrl && onEditImage && (
                <button
                  onClick={handleEditImage}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar Imagem
                </button>
              )}
            </div>

            <button
              onClick={() => setShowPrompt(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm"
            >
              Fechar
            </button>

            {/* Preview da imagem criada */}
            {createdImageUrl && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-semibold text-green-900 mb-2">✅ Imagem criada/enviada com sucesso!</p>
                <img 
                  src={createdImageUrl} 
                  alt="Imagem criada" 
                  className="w-full rounded-lg border border-green-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

