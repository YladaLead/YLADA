'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import type { WellnessCursoModulo, WellnessModuloTopico, WellnessCursoMaterial } from '@/types/wellness-cursos'

const supabase = createClient()

type ModuloCompleto = WellnessCursoModulo & {
  topicos?: (WellnessModuloTopico & {
    cursos?: WellnessCursoMaterial[]
  })[]
}

export default function WellnessModuloPlayerPage() {
  const params = useParams()
  const moduloId = params.id as string
  const { user } = useAuth()
  
  const [modulo, setModulo] = useState<ModuloCompleto | null>(null)
  const [materialAtual, setMaterialAtual] = useState<WellnessCursoMaterial | null>(null)
  const [urlMaterialAtual, setUrlMaterialAtual] = useState<string | null>(null)
  const [topicoAberto, setTopicoAberto] = useState<string | null>(null)
  const [sidebarAberto, setSidebarAberto] = useState(false) // Mobile sidebar
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (moduloId) {
      carregarModulo()
    }
  }, [moduloId])

  const carregarModulo = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      // Buscar módulo
      const moduloResponse = await fetch(`/api/wellness/modulos/${moduloId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!moduloResponse.ok) {
        throw new Error('Módulo não encontrado')
      }

      const moduloData = await moduloResponse.json()
      const moduloBase = moduloData.modulo

      // Buscar tópicos
      const topicosResponse = await fetch(`/api/wellness/modulos/${moduloId}/topicos`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      let topicos: (WellnessModuloTopico & { cursos?: WellnessCursoMaterial[] })[] = []
      
      if (topicosResponse.ok) {
        const topicosData = await topicosResponse.json()
        topicos = await Promise.all(
          (topicosData.topicos || []).map(async (topico: WellnessModuloTopico) => {
            // Buscar materiais do tópico (filtrar automaticamente pela área wellness)
            const materiaisResponse = await fetch(`/api/wellness/modulos/${moduloId}/topicos/${topico.id}/cursos?area=wellness`, {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            })

            let cursos: WellnessCursoMaterial[] = []
            if (materiaisResponse.ok) {
              const materiaisData = await materiaisResponse.json()
              cursos = materiaisData.cursos || []
            }

            return { ...topico, cursos }
          })
        )
      }

      const moduloCompleto: ModuloCompleto = {
        ...moduloBase,
        topicos
      }

      setModulo(moduloCompleto)
      
      // Abrir primeiro tópico e selecionar primeiro material
      if (topicos.length > 0) {
        setTopicoAberto(topicos[0].id)
        if (topicos[0].cursos && topicos[0].cursos.length > 0) {
          await selecionarMaterial(topicos[0].cursos[0])
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selecionarMaterial = async (material: WellnessCursoMaterial) => {
    setMaterialAtual(material)
    setUrlMaterialAtual(null) // Resetar URL antes de gerar nova
    
    const arquivoUrl = material.arquivo_url
    
    if (!arquivoUrl) {
      console.error('Material sem arquivo_url')
      setError('Material sem arquivo definido')
      return
    }

    // Sempre gerar URL assinada, pois os buckets são privados
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.error('Sem sessão para gerar URL assinada')
        setError('Sessão expirada. Por favor, faça login novamente.')
        return
      }

      // Determinar bucket baseado no tipo do material
      const bucket = material.tipo === 'video' 
        ? 'wellness-cursos-videos' 
        : 'wellness-cursos-pdfs'

      // Extrair path da URL
      let path = arquivoUrl
      
      // Se a URL contém o padrão do Supabase Storage, extrair apenas o path
      // Formato: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
      // ou: https://[project].supabase.co/storage/v1/object/sign/[bucket]/[path]?token=...
      const storageMatch = arquivoUrl.match(/\/storage\/v1\/object\/(?:public|sign)\/([^\/]+)\/(.+?)(?:\?|$)/)
      if (storageMatch) {
        path = storageMatch[2] // Já temos o path sem query params
        console.log('Path extraído da URL:', path, 'Bucket detectado:', storageMatch[1])
      } else if (arquivoUrl.startsWith('http')) {
        // Tentar outro padrão
        const urlMatch = arquivoUrl.match(/\/storage\/v1\/object\/[^\/]+\/([^\/]+)\/(.+?)(?:\?|$)/)
        if (urlMatch) {
          path = urlMatch[2]
        } else {
          // Se não conseguir extrair, tentar usar a URL completa como path
          console.warn('Não foi possível extrair path da URL, tentando usar URL completa:', arquivoUrl)
        }
      }
      // Se não começa com http, assumir que já é um path relativo (ex: "pdf/123-abc-nome.pdf")

      console.log('Gerando URL assinada:', { bucket, path, arquivoUrlOriginal: arquivoUrl })

      // Gerar URL assinada
      const signedUrlResponse = await fetch('/api/wellness/storage/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          bucket,
          path,
          expiresIn: 3600 // 1 hora
        })
      })

      if (signedUrlResponse.ok) {
        const signedData = await signedUrlResponse.json()
        console.log('URL assinada gerada com sucesso')
        setUrlMaterialAtual(signedData.signedUrl)
        setError(null)
      } else {
        const errorData = await signedUrlResponse.json().catch(() => ({ error: 'Erro desconhecido' }))
        console.error('Erro ao gerar URL assinada:', errorData)
        setError(`Erro ao carregar arquivo: ${errorData.error || 'Erro desconhecido'}`)
        // Tentar usar a URL original como fallback
        setUrlMaterialAtual(arquivoUrl)
      }
    } catch (err: any) {
      console.error('Erro ao gerar URL assinada:', err)
      setError(`Erro ao carregar arquivo: ${err.message}`)
      // Tentar usar a URL original como fallback
      setUrlMaterialAtual(arquivoUrl)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Carregando..." />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando módulo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !modulo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Erro" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Módulo não encontrado'}</p>
            <Link
              href="/pt/wellness/cursos"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Voltar para biblioteca
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title={modulo.titulo} />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)]">
        {/* Botão Mobile para abrir sidebar - Posicionado no header */}
        <button
          onClick={() => setSidebarAberto(!sidebarAberto)}
          className="lg:hidden fixed top-[56px] sm:top-16 right-4 z-50 bg-white border-2 border-green-600 rounded-lg p-2.5 shadow-lg hover:bg-green-50 transition-colors"
          aria-label="Abrir menu"
        >
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Overlay Mobile */}
        {sidebarAberto && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarAberto(false)}
          />
        )}

        {/* Sidebar - Lista de Tópicos e Materiais */}
        <div className={`
          fixed lg:static
          top-[56px] sm:top-16 left-0
          w-80 max-w-[85vw]
          h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)]
          bg-white border-r border-gray-200
          overflow-y-auto
          z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarAberto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/pt/wellness/cursos"
                className="text-sm text-gray-600 hover:text-gray-900 inline-block"
                onClick={() => setSidebarAberto(false)}
              >
                ← Voltar para biblioteca
              </Link>
              <button
                onClick={() => setSidebarAberto(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                aria-label="Fechar menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Informações do Módulo */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h2 className="font-semibold text-gray-900 text-sm mb-1">
                {modulo.titulo}
              </h2>
              {modulo.descricao && (
                <p className="text-xs text-gray-600 mt-1">
                  {modulo.descricao}
                </p>
              )}
            </div>

            {/* Lista de Tópicos */}
            <div className="space-y-2">
              {modulo.topicos?.map((topico) => {
                const totalCursos = topico.cursos?.length || 0
                return (
                  <div key={topico.id} className="border border-gray-200 rounded-lg">
                    {/* Header do Tópico */}
                    <button
                      onClick={() => setTopicoAberto(topicoAberto === topico.id ? null : topico.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 text-sm">
                          {topico.titulo}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {totalCursos} {totalCursos === 1 ? 'material' : 'materiais'}
                        </div>
                      </div>
                      <span className="text-gray-400">
                        {topicoAberto === topico.id ? '▼' : '▶'}
                      </span>
                    </button>

                    {/* Lista de Materiais (Cursos) */}
                    {topicoAberto === topico.id && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {topico.cursos?.map((material) => {
                          const isAtual = materialAtual?.id === material.id
                          return (
                            <button
                              key={material.id}
                              onClick={() => {
                                selecionarMaterial(material)
                                setSidebarAberto(false) // Fechar sidebar no mobile ao selecionar
                              }}
                              className={`w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm transition-colors ${
                                isAtual
                                  ? 'bg-green-50 border-l-4 border-green-600'
                                  : 'hover:bg-gray-100 active:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-400">
                                  {material.tipo === 'video' ? '▶️' : '📄'}
                                </span>
                                <span className="flex-1">{material.titulo}</span>
                              </div>
                            </button>
                          )
                        })}
                        {(!topico.cursos || topico.cursos.length === 0) && (
                          <div className="px-4 py-2 text-xs text-gray-500">
                            Nenhum material ainda
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              {(!modulo.topicos || modulo.topicos.length === 0) && (
                <div className="text-center py-8 text-sm text-gray-500">
                  Nenhum tópico disponível ainda
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Área Principal - Player */}
        <div className="flex-1 flex flex-col w-full lg:w-auto pt-12 lg:pt-0">
          {materialAtual ? (
            <>
              {/* Header do Material */}
              <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {materialAtual.titulo}
                </h2>
                {materialAtual.descricao && (
                  <p className="text-sm sm:text-base text-gray-600">{materialAtual.descricao}</p>
                )}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>

              {/* Player/Visualizador */}
              <div className="flex-1 bg-gray-900 flex items-center justify-center p-2 sm:p-4 lg:p-8">
                {urlMaterialAtual ? (
                  materialAtual.tipo === 'video' ? (
                    <div className="w-full max-w-4xl">
                      <video
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        className="w-full h-auto rounded-lg shadow-lg"
                        src={urlMaterialAtual}
                        crossOrigin="anonymous"
                        onLoadedMetadata={(e) => {
                          const video = e.currentTarget
                          const hasAudio = video.mozHasAudio || 
                                           (video.webkitAudioDecodedByteCount > 0) ||
                                           (video.audioTracks && video.audioTracks.length > 0)
                          
                          console.log('Vídeo carregado:', {
                            duration: video.duration,
                            videoWidth: video.videoWidth,
                            videoHeight: video.videoHeight,
                            muted: video.muted,
                            volume: video.volume,
                            hasAudio: hasAudio,
                            audioTracks: video.audioTracks?.length || 0,
                            src: urlMaterialAtual,
                            format: materialAtual.arquivo_url?.split('.').pop()?.toLowerCase()
                          })
                          
                          // Garantir que não está mudo
                          if (video.muted) {
                            video.muted = false
                            console.log('Vídeo estava mudo, desmutado')
                          }
                          
                          // Verificar se tem áudio (apenas log, sem mostrar erro ao usuário)
                          if (!hasAudio && video.audioTracks && video.audioTracks.length === 0) {
                            console.warn('⚠️ Vídeo pode não ter faixa de áudio ou codec não suportado')
                            // Não mostrar erro ao usuário para melhor experiência
                          }
                        }}
                        onCanPlay={(e) => {
                          const video = e.currentTarget
                          const hasAudio = video.mozHasAudio || 
                                           (video.webkitAudioDecodedByteCount > 0) ||
                                           (video.audioTracks && video.audioTracks.length > 0)
                          
                          console.log('Vídeo pronto para reprodução:', {
                            muted: video.muted,
                            volume: video.volume,
                            hasAudio: hasAudio,
                            audioTracks: video.audioTracks?.length || 0
                          })
                        }}
                        onError={(e) => {
                          console.error('Erro ao carregar vídeo:', e)
                          const video = e.currentTarget
                          const errorDetails = {
                            error: video.error,
                            errorCode: video.error?.code,
                            errorMessage: video.error?.message,
                            networkState: video.networkState,
                            readyState: video.readyState,
                            src: urlMaterialAtual,
                            format: materialAtual.arquivo_url?.split('.').pop()?.toLowerCase()
                          }
                          console.error('Detalhes do erro:', errorDetails)
                          
                          let errorMsg = 'Erro ao carregar vídeo. '
                          if (video.error?.code === 4) {
                            errorMsg += 'O formato do vídeo pode não ser suportado. Arquivos .MOV podem ter problemas de compatibilidade. Recomendamos converter para MP4 (H.264 + AAC).'
                          } else {
                            errorMsg += 'Verifique se o arquivo existe e está acessível.'
                          }
                          setError(errorMsg)
                        }}
                      >
                        Seu navegador não suporta vídeo.
                      </video>
                    </div>
                  ) : (
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-2 sm:p-4">
                      {/* Verificar se é imagem ou PDF */}
                      {materialAtual.arquivo_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        // É uma imagem
                        <div className="flex flex-col items-center">
                          <img
                            src={urlMaterialAtual}
                            alt={materialAtual.titulo}
                            className="max-w-full max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-300px)] rounded-lg shadow-md"
                            onError={(e) => {
                              console.error('Erro ao carregar imagem:', e)
                              setError('Erro ao carregar imagem. Verifique se o arquivo existe.')
                            }}
                          />
                        </div>
                      ) : (
                        // É um PDF
                        <iframe
                          src={urlMaterialAtual}
                          className="w-full h-[calc(100vh-200px)] sm:h-[calc(100vh-300px)] rounded"
                          title={materialAtual.titulo}
                          onError={(e) => {
                            console.error('Erro ao carregar PDF:', e)
                            setError('Erro ao carregar PDF. Verifique se o arquivo existe.')
                          }}
                        />
                      )}
                    </div>
                  )
                ) : (
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Carregando conteúdo...</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-4">
                  Selecione um material para começar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

