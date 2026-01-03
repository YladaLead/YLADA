'use client'

import { useState } from 'react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { Caption, CaptionStyle, CaptionPosition, CaptionAnimation } from '@/types/creative-studio'
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CaptionEditor() {
  const { captions, addCaption, updateCaption, deleteCaption, currentTime, duration } = useCreativeStudioStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<Caption>>({
    text: '',
    startTime: 0,
    endTime: 5,
    style: 'default',
    position: 'center',
    animation: 'fade-in',
    highlightWords: [],
  })

  const handleAdd = () => {
    if (!formData.text || !formData.startTime || !formData.endTime) return

    const newCaption: Caption = {
      id: `caption-${Date.now()}-${Math.random()}`,
      text: formData.text,
      startTime: formData.startTime,
      endTime: formData.endTime,
      style: (formData.style || 'default') as CaptionStyle,
      position: (formData.position || 'center') as CaptionPosition,
      animation: (formData.animation || 'fade-in') as CaptionAnimation,
      highlightWords: formData.highlightWords || [],
    }

    addCaption(newCaption)
    setIsAdding(false)
    setFormData({
      text: '',
      startTime: currentTime,
      endTime: currentTime + 5,
      style: 'default',
      position: 'center',
      animation: 'fade-in',
      highlightWords: [],
    })
  }

  const handleEdit = (caption: Caption) => {
    setEditingId(caption.id)
    setFormData({
      text: caption.text,
      startTime: caption.startTime,
      endTime: caption.endTime,
      style: caption.style,
      position: caption.position,
      animation: caption.animation,
      highlightWords: caption.highlightWords || [],
    })
  }

  const handleSave = () => {
    if (!editingId || !formData.text) return

    updateCaption(editingId, formData)
    setEditingId(null)
    setFormData({
      text: '',
      startTime: currentTime,
      endTime: currentTime + 5,
      style: 'default',
      position: 'center',
      animation: 'fade-in',
      highlightWords: [],
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      text: '',
      startTime: currentTime,
      endTime: currentTime + 5,
      style: 'default',
      position: 'center',
      animation: 'fade-in',
      highlightWords: [],
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const styleLabels: Record<CaptionStyle, string> = {
    hook: 'Hook (Grande)',
    dor: 'Dor (Vermelho)',
    solucao: 'Solução (Verde)',
    cta: 'CTA (Roxo)',
    default: 'Padrão',
  }

  const positionLabels: Record<CaptionPosition, string> = {
    center: 'Centro',
    top: 'Topo',
    bottom: 'Inferior',
    'middle-top': 'Meio Superior',
    'middle-bottom': 'Meio Inferior',
  }

  const animationLabels: Record<CaptionAnimation, string> = {
    'fade-in': 'Fade In',
    'slide-up': 'Slide Up',
    'slide-down': 'Slide Down',
    zoom: 'Zoom',
    typewriter: 'Typewriter',
    none: 'Nenhuma',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Legendas ({captions.length})
        </h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              setIsAdding(true)
              setFormData({
                ...formData,
                startTime: currentTime,
                endTime: Math.min(currentTime + 5, duration || currentTime + 5),
              })
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
          >
            <Plus className="w-3 h-3" />
            Adicionar
          </button>
        )}
      </div>

      {/* Formulário de adicionar/editar */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Texto
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Digite o texto da legenda..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Início (s)
              </label>
              <input
                type="number"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: Number(e.target.value) })}
                min={0}
                max={duration || 1000}
                step={0.1}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={() => setFormData({ ...formData, startTime: currentTime })}
                className="mt-1 text-xs text-purple-600 hover:text-purple-700"
              >
                Usar tempo atual ({formatTime(currentTime)})
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Fim (s)
              </label>
              <input
                type="number"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: Number(e.target.value) })}
                min={formData.startTime || 0}
                max={duration || 1000}
                step={0.1}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Estilo
              </label>
              <select
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value as CaptionStyle })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(styleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Posição
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as CaptionPosition })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(positionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Animação
              </label>
              <select
                value={formData.animation}
                onChange={(e) => setFormData({ ...formData, animation: e.target.value as CaptionAnimation })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {Object.entries(animationLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Palavras para destacar (separadas por vírgula)
            </label>
            <input
              type="text"
              value={formData.highlightWords?.join(', ') || ''}
              onChange={(e) => {
                const words = e.target.value.split(',').map(w => w.trim()).filter(w => w)
                setFormData({ ...formData, highlightWords: words })
              }}
              placeholder="agenda, cliente, resultado..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={isAdding ? handleAdd : handleSave}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
            >
              <Save className="w-4 h-4" />
              {isAdding ? 'Adicionar' : 'Salvar'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de legendas */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {captions.length === 0 && !isAdding && (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhuma legenda adicionada. Clique em "Adicionar" para começar.
          </p>
        )}

        {captions.map((caption) => (
          <div
            key={caption.id}
            className={cn(
              "bg-white rounded-lg p-3 border border-gray-200 hover:border-purple-300 transition-colors",
              editingId === caption.id && "ring-2 ring-purple-500"
            )}
          >
            {editingId === caption.id ? null : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {caption.text}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>
                        {formatTime(caption.startTime)} - {formatTime(caption.endTime)}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded">
                        {styleLabels[caption.style]}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded">
                        {positionLabels[caption.position]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleEdit(caption)}
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCaption(caption.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


