'use client'

import { useState } from 'react'
import { Search, Image as ImageIcon, Video, Loader2, Plus, X, ExternalLink } from 'lucide-react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { MediaBrowser } from './MediaBrowser'

export function SearchResultsPanel() {
  const { searchResults, addClip, setSearching } = useCreativeStudioStore()
  const authenticatedFetch = useAuthenticatedFetch()
  const [selectedType, setSelectedType] = useState<'images' | 'videos'>('images')
  const [isBrowserOpen, setIsBrowserOpen] = useState(false)

  const handleAddToTimeline = async (item: { id: string; url: string; thumbnail: string; source: string; duration?: number }, type: 'image' | 'video') => {
    try {
      if (type === 'image') {
        addClip({
          id: `img-${Date.now()}-${Math.random()}`,
          startTime: 0,
          endTime: 5, // 5 segundos para imagens
          source: item.url,
          type: 'image',
        })
      } else {
        addClip({
          id: `vid-${Date.now()}-${Math.random()}`,
          startTime: 0,
          endTime: item.duration || 10,
          source: item.url,
          type: 'video',
        })
      }
    } catch (error) {
      console.error('Erro ao adicionar à timeline:', error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header com tabs */}
      <div className="flex border-b border-gray-200 mb-3">
        <button
          onClick={() => setSelectedType('images')}
          className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            selectedType === 'images'
              ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          Imagens
          {searchResults.images.length > 0 && (
            <span className="ml-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {searchResults.images.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setIsBrowserOpen(true)}
          className="px-3 py-2 text-xs sm:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
          title="Buscar mais imagens/vídeos"
        >
          <Search className="w-3 h-3 sm:w-4 sm:h-4" />
          Buscar
        </button>
        <button
          onClick={() => setSelectedType('videos')}
          className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
            selectedType === 'videos'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Video className="w-3 h-3 sm:w-4 sm:h-4" />
          Vídeos
          {searchResults.videos.length > 0 && (
            <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {searchResults.videos.length}
            </span>
          )}
        </button>
      </div>

      {/* Status de busca */}
      {searchResults.isSearching && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-medium text-blue-900">
                {searchResults.lastSearchType === 'images' ? '🔍 Buscando imagens...' : '🎬 Buscando vídeos...'}
              </p>
              {searchResults.searchQuery && (
                <p className="text-xs text-blue-700 mt-1">
                  Termo: "{searchResults.searchQuery}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto">
        {selectedType === 'images' ? (
          <>
            {searchResults.images.length === 0 && !searchResults.isSearching ? (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-500">
                  Nenhuma imagem encontrada ainda.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Peça ao assistente para buscar imagens.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {searchResults.images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-purple-500 transition-colors"
                  >
                    <img
                      src={img.thumbnail || img.url}
                      alt="Imagem"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleAddToTimeline(img, 'image')}
                        className="opacity-0 group-hover:opacity-100 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-110"
                        title="Adicionar à timeline"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white truncate">{img.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {searchResults.videos.length === 0 && !searchResults.isSearching ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-500">
                  Nenhum vídeo encontrado ainda.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Peça ao assistente para buscar vídeos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {searchResults.videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors"
                  >
                    <img
                      src={vid.thumbnail}
                      alt="Vídeo"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleAddToTimeline(vid, 'video')}
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-110"
                        title="Adicionar à timeline"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {vid.duration && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {Math.floor(vid.duration)}s
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white truncate">{vid.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Media Browser Modal */}
      <MediaBrowser
        isOpen={isBrowserOpen}
        onClose={() => setIsBrowserOpen(false)}
        type={selectedType}
      />
    </div>
  )
}

