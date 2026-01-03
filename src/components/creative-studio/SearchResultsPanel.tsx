'use client'

import { useState } from 'react'
import { Search, Image as ImageIcon, Video, Loader2, Plus, X, ExternalLink, Sparkles, Check } from 'lucide-react'
import { useCreativeStudioStore } from '@/stores/creative-studio-store'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { MediaBrowser } from './MediaBrowser'

interface SearchResultsPanelProps {
  area?: 'nutri' | 'coach' | 'wellness' | 'nutra'
  purpose?: 'quick-ad' | 'sales-page' | 'educational' | 'testimonial' | 'custom'
}

export function SearchResultsPanel({ area = 'nutri', purpose = 'quick-ad' }: SearchResultsPanelProps) {
  const { searchResults, addClip, setSearching, clips, addSearchImages } = useCreativeStudioStore()
  const authenticatedFetch = useAuthenticatedFetch()
  const [selectedType, setSelectedType] = useState<'images' | 'videos'>('images')
  const [isBrowserOpen, setIsBrowserOpen] = useState(false)
  const [savingItems, setSavingItems] = useState<Set<string>>(new Set())

  const handleAddToTimeline = async (item: { id: string; url: string; thumbnail: string; source: string; duration?: number }, type: 'image' | 'video') => {
    try {
      console.log('🎬 [DEBUG] Adicionando à timeline:', { item, type, clipsCount: clips.length })
      
      // Calcular tempo de início (após último clip)
      const lastClip = clips.length > 0 ? clips[clips.length - 1] : null
      const startTime = lastClip ? lastClip.endTime : 0
      const endTime = startTime + (type === 'image' ? 5 : item.duration || 10)

      console.log('🎬 [DEBUG] Tempos calculados:', { startTime, endTime, lastClip })

      // Adicionar à timeline primeiro (para não bloquear UI)
      if (type === 'image') {
        const newClip = {
          id: `img-${Date.now()}-${Math.random()}`,
          startTime,
          endTime,
          source: item.url,
          type: 'image' as const,
        }
        console.log('🎬 [DEBUG] Adicionando clip de imagem:', newClip)
        addClip(newClip)
        console.log('🎬 [DEBUG] Clip adicionado! Verificando timeline...')
      } else {
        const newClip = {
          id: `vid-${Date.now()}-${Math.random()}`,
          startTime,
          endTime,
          source: item.url,
          type: 'video' as const,
        }
        console.log('🎬 [DEBUG] Adicionando clip de vídeo:', newClip)
        addClip(newClip)
        console.log('🎬 [DEBUG] Clip adicionado! Verificando timeline...')
      }
      
      // Feedback visual imediato
      setSavingItems(prev => new Set(prev).add(item.id))
      
      // Feedback no console para debug
      setTimeout(() => {
        const updatedClips = clips.length
        console.log('🎬 [DEBUG] Timeline atualizada! Clips agora:', updatedClips + 1)
      }, 100)

      // Salvar no banco próprio automaticamente (em background)
      // Apenas se não for do banco próprio já (evitar duplicatas)
      if (item.source !== 'media_library') {
        setSavingItems(prev => new Set(prev).add(item.id))
        
        try {
          // Detectar propósito baseado na busca ou usar o propósito da campanha
          const detectedPurpose = searchResults.searchQuery?.toLowerCase().includes('dor') ? 'dor' :
                                  searchResults.searchQuery?.toLowerCase().includes('solucao') ? 'solucao' :
                                  searchResults.searchQuery?.toLowerCase().includes('hook') ? 'hook' :
                                  searchResults.searchQuery?.toLowerCase().includes('cta') ? 'cta' : 
                                  (purpose === 'quick-ad' ? 'hook' : 'all')

          // Extrair tags da query de busca
          const tags = searchResults.searchQuery?.toLowerCase().split(/\s+/) || []

          await authenticatedFetch('/api/creative-studio/save-to-library', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: item.url,
              thumbnail: item.thumbnail,
              source: item.source,
              sourceId: item.id,
              type: type,
              area: area,
              purpose: detectedPurpose,
              title: `Imagem ${type === 'image' ? 'de' : 'vídeo de'} ${searchResults.searchQuery || 'campanha'}`,
              tags: tags.filter(t => t.length > 2).slice(0, 5), // Máximo 5 tags
            }),
          })

          // Silencioso - não precisa mostrar mensagem
        } catch (saveError) {
          // Erro silencioso - não bloqueia o uso
          console.log('Não foi possível salvar no banco (não crítico):', saveError)
        } finally {
          setSavingItems(prev => {
            const next = new Set(prev)
            next.delete(item.id)
            return next
          })
        }
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
              <div className="text-center py-8 px-4">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Nenhuma imagem encontrada.
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {searchResults.searchQuery 
                    ? `Não encontrei resultados para "${searchResults.searchQuery}"`
                    : 'Peça ao assistente para buscar imagens.'}
                </p>
                {searchResults.searchQuery && (
                  <button
                    onClick={async () => {
                      // Criar imagem com DALL-E
                      try {
                        setSearching(true, 'images', searchResults.searchQuery || '')
                        const response = await authenticatedFetch('/api/creative-studio/search-images', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            query: searchResults.searchQuery,
                            type: 'create',
                            count: 1,
                          }),
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          if (data.images && data.images.length > 0) {
                            addSearchImages(data.images.map((img: any) => ({
                              id: img.id || `dalle-${Date.now()}`,
                              url: img.url,
                              thumbnail: img.thumbnail || img.url,
                              source: 'dalle',
                            })))
                          }
                        }
                      } catch (error) {
                        console.error('Erro ao criar imagem:', error)
                      } finally {
                        setSearching(false)
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 text-sm font-medium flex items-center gap-2 mx-auto transition-all shadow-sm hover:shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    Criar imagem com IA
                  </button>
                )}
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
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('🎬 [DEBUG] Botão clicado para imagem:', img.id)
                          handleAddToTimeline(img, 'image')
                        }}
                        disabled={savingItems.has(img.id)}
                        className="opacity-0 group-hover:opacity-100 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Adicionar à timeline"
                      >
                        {savingItems.has(img.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-xs text-white truncate">
                        {img.source}
                        {savingItems.has(img.id) && ' • Adicionado! ✓'}
                      </p>
                    </div>
                    {savingItems.has(img.id) && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 shadow-lg">
                        <Check className="w-3 h-3" />
                        Adicionado
                      </div>
                    )}
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
                        disabled={savingItems.has(vid.id)}
                        className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Adicionar à timeline"
                      >
                        {savingItems.has(vid.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
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

