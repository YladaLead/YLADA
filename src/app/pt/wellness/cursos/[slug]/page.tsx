'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { useAuth } from '@/hooks/useAuth'
import { getCursoCompleto, atualizarProgressoMaterial } from '@/lib/wellness-cursos'
import type { WellnessCursoCompleto, WellnessCursoMaterial } from '@/types/wellness-cursos'

export default function WellnessCursoPlayerPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user } = useAuth()
  
  const [curso, setCurso] = useState<WellnessCursoCompleto | null>(null)
  const [materialAtual, setMaterialAtual] = useState<WellnessCursoMaterial | null>(null)
  const [moduloAberto, setModuloAberto] = useState<string | null>(null)
  const [topicoAberto, setTopicoAberto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      carregarCurso()
    }
  }, [slug])

  const carregarCurso = async () => {
    try {
      setLoading(true)
      setError(null)
      const cursoCompleto = await getCursoCompleto(slug, user?.id)
      
      if (!cursoCompleto) {
        setError('Curso não encontrado')
        return
      }

      setCurso(cursoCompleto)
      
      // Abrir primeiro módulo e primeiro tópico
      if (cursoCompleto.modulos.length > 0) {
        const primeiroModulo = cursoCompleto.modulos[0]
        setModuloAberto(primeiroModulo.id)
        
        // Abrir primeiro tópico
        if (primeiroModulo.topicos && primeiroModulo.topicos.length > 0) {
          const primeiroTopico = primeiroModulo.topicos[0]
          setTopicoAberto(primeiroTopico.id)
          
          // Selecionar primeiro material (curso)
          if (primeiroTopico.cursos && primeiroTopico.cursos.length > 0) {
            setMaterialAtual(primeiroTopico.cursos[0])
          }
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selecionarMaterial = (material: WellnessCursoMaterial) => {
    setMaterialAtual(material)
  }

  const marcarComoConcluido = async (materialId: string) => {
    if (!user || !curso) return

    try {
      // Encontrar o módulo que contém este material
      let moduloId: string | null = null
      for (const modulo of curso.modulos) {
        for (const topico of modulo.topicos || []) {
          const material = topico.cursos?.find(m => m.id === materialId)
          if (material) {
            moduloId = modulo.id
            break
          }
        }
        if (moduloId) break
      }

      if (!moduloId) {
        console.error('Módulo não encontrado para o material')
        return
      }

      await atualizarProgressoMaterial(
        user.id,
        curso.id,
        moduloId,
        materialId,
        { concluido: true }
      )
      
      // Recarregar curso para atualizar progresso
      await carregarCurso()
    } catch (err: any) {
      console.error('Erro ao marcar como concluído:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Carregando..." />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando curso...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Erro" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Curso não encontrado'}</p>
            <Link
              href="/pt/wellness/cursos"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Voltar para cursos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title={curso.titulo} />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Lista de Módulos e Materiais */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <Link
              href="/pt/wellness/cursos"
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
            >
              ← Voltar para cursos
            </Link>
            
            {/* Progresso Geral */}
            {curso.progresso && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progresso</span>
                  <span className="text-sm font-bold text-green-600">
                    {curso.progresso.porcentagem}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${curso.progresso.porcentagem}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {curso.progresso.materiais_concluidos} de {curso.progresso.total_materiais} materiais
                </p>
              </div>
            )}

            {/* Lista de Módulos */}
            <div className="space-y-2">
              {curso.modulos.map((modulo) => {
                // Calcular total de materiais em todos os tópicos do módulo
                const totalMateriais = modulo.topicos?.reduce((acc, topico) => {
                  return acc + (topico.cursos?.length || 0)
                }, 0) || 0

                return (
                  <div key={modulo.id} className="border border-gray-200 rounded-lg">
                    {/* Header do Módulo */}
                    <button
                      onClick={() => setModuloAberto(moduloAberto === modulo.id ? null : modulo.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-900 text-sm">
                          {modulo.titulo}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {totalMateriais} {totalMateriais === 1 ? 'material' : 'materiais'}
                        </div>
                      </div>
                      <span className="text-gray-400">
                        {moduloAberto === modulo.id ? '▼' : '▶'}
                      </span>
                    </button>

                    {/* Lista de Tópicos (Acordeão) */}
                    {moduloAberto === modulo.id && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {modulo.topicos?.map((topico) => {
                          const totalCursos = topico.cursos?.length || 0
                          return (
                            <div key={topico.id} className="border-b border-gray-200 last:border-b-0">
                              {/* Header do Tópico */}
                              <button
                                onClick={() => setTopicoAberto(topicoAberto === topico.id ? null : topico.id)}
                                className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex-1 text-left">
                                  <div className="font-medium text-gray-800 text-xs">
                                    {topico.titulo}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {totalCursos} {totalCursos === 1 ? 'material' : 'materiais'}
                                  </div>
                                </div>
                                <span className="text-gray-400 text-xs">
                                  {topicoAberto === topico.id ? '▼' : '▶'}
                                </span>
                              </button>

                              {/* Lista de Materiais (Cursos) */}
                              {topicoAberto === topico.id && (
                                <div className="bg-white border-t border-gray-200">
                                  {topico.cursos?.map((material) => {
                                    const isAtual = materialAtual?.id === material.id
                                    return (
                                      <button
                                        key={material.id}
                                        onClick={() => selecionarMaterial(material)}
                                        className={`w-full px-4 py-2 text-left text-xs transition-colors ${
                                          isAtual
                                            ? 'bg-green-50 border-l-4 border-green-600'
                                            : 'hover:bg-gray-50'
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
                          <div className="px-4 py-2 text-xs text-gray-500 text-center">
                            Nenhum tópico ainda
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Área Principal - Player */}
        <div className="flex-1 flex flex-col">
          {materialAtual ? (
            <>
              {/* Header do Material */}
              <div className="bg-white border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {materialAtual.titulo}
                </h2>
                {materialAtual.descricao && (
                  <p className="text-gray-600">{materialAtual.descricao}</p>
                )}
              </div>

              {/* Player/Visualizador */}
              <div className="flex-1 bg-gray-900 flex items-center justify-center p-8">
                {materialAtual.tipo === 'video' ? (
                  <div className="w-full max-w-4xl">
                    <video
                      controls
                      className="w-full rounded-lg shadow-lg"
                      src={materialAtual.arquivo_url}
                      onEnded={() => {
                        if (user) {
                          marcarComoConcluido(materialAtual.id)
                        }
                      }}
                    >
                      Seu navegador não suporta vídeo.
                    </video>
                  </div>
                ) : (
                  <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
                    {/* Verificar se é imagem ou PDF */}
                    {materialAtual.arquivo_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      // É uma imagem
                      <div className="flex flex-col items-center">
                        <img
                          src={materialAtual.arquivo_url}
                          alt={materialAtual.titulo}
                          className="max-w-full max-h-[calc(100vh-300px)] rounded-lg shadow-md"
                        />
                        <div className="mt-4 flex justify-end w-full">
                          <button
                            onClick={() => {
                              if (user) {
                                marcarComoConcluido(materialAtual.id)
                              }
                            }}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Marcar como Concluído
                          </button>
                        </div>
                      </div>
                    ) : (
                      // É um PDF
                      <>
                        <iframe
                          src={materialAtual.arquivo_url}
                          className="w-full h-[calc(100vh-300px)] rounded"
                          title={materialAtual.titulo}
                        />
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => {
                              if (user) {
                                marcarComoConcluido(materialAtual.id)
                              }
                            }}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Marcar como Concluído
                          </button>
                        </div>
                      </>
                    )}
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

