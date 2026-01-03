'use client'

import { useState } from 'react'
import { Search, Image as ImageIcon, Loader2, Plus, X, Sparkles } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'

interface ManualImageSearchProps {
  onClose?: () => void
}

export function ManualImageSearch({ onClose }: ManualImageSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<Array<{ id: string; url: string; thumbnail: string; source: string }>>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const authenticatedFetch = useAuthenticatedFetch()
  const { clips, addClip } = useCreativeStudioStore()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setResults([])
    setSelectedItems(new Set())

    try {
      const response = await authenticatedFetch('/api/creative-studio/search-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          type: 'search',
          count: 20,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.images || [])
      }
    } catch (error) {
      console.error('Erro ao buscar:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleAddSelected = () => {
    if (selectedItems.size === 0) return

    const lastClip = clips.length > 0 ? clips[clips.length - 1] : null
    let currentStartTime = lastClip ? lastClip.endTime : 0

    selectedItems.forEach((id) => {
      const image = results.find((img) => img.id === id)
      if (image) {
        const duration = 2.5 // 2.5 segundos por imagem
        addClip({
          id: `img-manual-${Date.now()}-${Math.random()}`,
          startTime: currentStartTime,
          endTime: currentStartTime + duration,
          source: image.url,
          type: 'image',
        })
        currentStartTime += duration
      }
    })

    setSelectedItems(new Set())
    if (onClose) onClose()
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Buscar Imagens Manualmente</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Campo de busca */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ex: nutricionista atendendo, agenda cheia, sucesso profissional..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Buscar
        </button>
      </div>

      {/* Resultados */}
      {isSearching ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {results.length} resultado(s) encontrado(s)
            </p>
            {selectedItems.size > 0 && (
              <button
                onClick={handleAddSelected}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar {selectedItems.size} selecionada(s)
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
            {results.map((img) => (
              <div
                key={img.id}
                className={`group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedItems.has(img.id)
                    ? 'border-purple-500 ring-2 ring-purple-200'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => handleToggleSelect(img.id)}
              >
                <img
                  src={img.thumbnail || img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {selectedItems.has(img.id) && (
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-30 flex items-center justify-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const lastClip = clips.length > 0 ? clips[clips.length - 1] : null
                      const startTime = lastClip ? lastClip.endTime : 0
                      addClip({
                        id: `img-manual-${Date.now()}-${Math.random()}`,
                        startTime,
                        endTime: startTime + 2.5,
                        source: img.url,
                        type: 'image',
                      })
                    }}
                    className="p-1.5 bg-purple-600 text-white rounded hover:bg-purple-700"
                    title="Adicionar diretamente"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : searchQuery && !isSearching ? (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Nenhum resultado encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Tente outros termos de busca</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Digite um termo para buscar imagens</p>
          <p className="text-sm text-gray-400 mt-1">Ex: "nutricionista", "agenda cheia", "sucesso profissional"</p>
        </div>
      )}
    </div>
  )
}

