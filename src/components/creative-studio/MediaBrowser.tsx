'use client'

import { useState, useEffect } from 'react'
import { Search, Image as ImageIcon, Video, Loader2, X, ExternalLink } from 'lucide-react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'

interface MediaBrowserProps {
  isOpen: boolean
  onClose: () => void
  type: 'images' | 'videos'
  initialQuery?: string
}

export function MediaBrowser({ isOpen, onClose, type, initialQuery = '' }: MediaBrowserProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [source, setSource] = useState<'pexels' | 'unsplash' | 'dalle' | null>(null)
  const authenticatedFetch = useAuthenticatedFetch()
  const { addClip, addSearchImages, addSearchVideos } = useCreativeStudioStore()

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSearch()
    }
  }, [isOpen, initialQuery])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setResults([])

    try {
      const response = await authenticatedFetch('/api/creative-studio/search-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          type: type === 'videos' ? 'search-videos' : 'search',
          count: 20,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (type === 'videos') {
          setResults(data.videos || [])
          addSearchVideos(data.videos || [])
        } else {
          setResults(data.images || [])
          addSearchImages(data.images || [])
        }
        setSource(data.source || 'pexels')
      }
    } catch (error) {
      console.error('Erro ao buscar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToTimeline = (item: any) => {
    if (type === 'images') {
      addClip({
        id: `img-${Date.now()}-${Math.random()}`,
        startTime: 0,
        endTime: 5,
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
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {type === 'images' ? (
              <ImageIcon className="w-6 h-6 text-purple-600" />
            ) : (
              <Video className="w-6 h-6 text-blue-600" />
            )}
            <h2 className="text-xl font-bold">
              Buscar {type === 'images' ? 'Imagens' : 'Vídeos'} - {source?.toUpperCase() || 'PEXELS'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={`Buscar ${type === 'images' ? 'imagens' : 'vídeos'}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">
                {searchQuery ? 'Nenhum resultado encontrado' : 'Digite um termo para buscar'}
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${type === 'images' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2'}`}>
              {results.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-purple-500 transition-all"
                >
                  {type === 'images' ? (
                    <img
                      src={item.thumbnail || item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {item.duration && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {Math.floor(item.duration)}s
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleAddToTimeline(item)}
                      className="opacity-0 group-hover:opacity-100 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-110"
                    >
                      Adicionar
                    </button>
                    {item.photographerUrl && (
                      <a
                        href={item.photographerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-110 flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ver original
                      </a>
                    )}
                  </div>

                  {/* Info footer */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white truncate">
                      {item.photographer || item.source || 'Pexels'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

