'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'
import type { Trilha, Microcurso, BibliotecaItem, Tutorial } from '@/types/cursos'

export default function CoachCursos() {
  return <CoachCursosContent />
}

function CoachCursosContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'trilhas' | 'microcursos' | 'biblioteca' | 'tutoriais'>('trilhas')
  
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  const [microcursos, setMicrocursos] = useState<Microcurso[]>([])
  const [biblioteca, setBiblioteca] = useState<BibliotecaItem[]>([])
  const [tutoriais, setTutoriais] = useState<Tutorial[]>([])
  
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Carregar dados
  useEffect(() => {
    if (!user) return

    const carregarDados = async () => {
      try {
        setCarregando(true)
        setErro(null)

        // Carregar trilhas
        const trilhasRes = await fetch('/api/c/cursos?tipo=trilhas', {
          credentials: 'include'
        })
        if (trilhasRes.ok) {
          const trilhasData = await trilhasRes.json()
          setTrilhas(trilhasData.data?.trilhas || [])
        }

        // Carregar microcursos
        const microcursosRes = await fetch('/api/c/cursos?tipo=microcursos', {
          credentials: 'include'
        })
        if (microcursosRes.ok) {
          const microcursosData = await microcursosRes.json()
          setMicrocursos(microcursosData.data?.microcursos || [])
        }

        // Carregar biblioteca
        const bibliotecaRes = await fetch('/api/c/cursos?tipo=biblioteca', {
          credentials: 'include'
        })
        if (bibliotecaRes.ok) {
          const bibliotecaData = await bibliotecaRes.json()
          setBiblioteca(bibliotecaData.data?.biblioteca || [])
        }

        // Carregar tutoriais
        const tutoriaisRes = await fetch('/api/c/cursos?tipo=tutoriais', {
          credentials: 'include'
        })
        if (tutoriaisRes.ok) {
          const tutoriaisData = await tutoriaisRes.json()
          setTutoriais(tutoriaisData.data?.tutoriais || [])
        }

      } catch (error: any) {
        console.error('Erro ao carregar cursos:', error)
        setErro('Erro ao carregar cursos')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      <div className="flex-1 lg:ml-56">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Cursos</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Filosofia ILADA – Cursos e Trilhas</h1>
            <p className="text-gray-600 mt-1">Seu crescimento acelerado como nutricionista empreendedora</p>
          </div>

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800">{erro}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveTab('trilhas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'trilhas'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📚 Trilhas
            </button>
            <button
              onClick={() => setActiveTab('microcursos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'microcursos'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              ⚡ Microcursos
            </button>
            <button
              onClick={() => setActiveTab('biblioteca')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'biblioteca'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📦 Biblioteca
            </button>
            <button
              onClick={() => setActiveTab('tutoriais')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'tutoriais'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🎓 Tutoriais
            </button>
          </div>

          {/* Conteúdo */}
          {carregando ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando cursos...</p>
            </div>
          ) : (
            <>
              {/* Trilhas */}
              {activeTab === 'trilhas' && (
                <div className="space-y-6">
                  {trilhas.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                      <p className="text-gray-600">Nenhuma trilha disponível no momento.</p>
                      <p className="text-sm text-gray-500 mt-2">Os cursos estarão disponíveis em breve!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {trilhas.map((trilha) => (
                        <Link
                          key={trilha.id}
                          href={`/pt/coach/cursos/${trilha.id}`}
                          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{trilha.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{trilha.short_description || trilha.description}</p>
                            </div>
                            {trilha.thumbnail_url && (
                              <img
                                src={trilha.thumbnail_url}
                                alt={trilha.title}
                                className="w-20 h-20 object-cover rounded-lg ml-4"
                              />
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{trilha.estimated_hours}h • {trilha.level}</span>
                              <span>{trilha.modulos_count || 0} módulos</span>
                            </div>
                            
                            {trilha.progress_percentage > 0 && (
                              <div>
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Progresso</span>
                                  <span>{Math.round(trilha.progress_percentage)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-purple-600 h-2 rounded-full transition-all"
                                    style={{ width: `${trilha.progress_percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            
                            <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                              {trilha.progress_percentage > 0 ? 'Continuar' : 'Começar'}
                            </button>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Microcursos */}
              {activeTab === 'microcursos' && (
                <div className="space-y-6">
                  {microcursos.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                      <p className="text-gray-600">Nenhum microcurso disponível no momento.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {microcursos.map((microcurso) => (
                        <div
                          key={microcurso.id}
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          {microcurso.thumbnail_url && (
                            <img
                              src={microcurso.thumbnail_url}
                              alt={microcurso.title}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h3 className="font-semibold text-gray-900 mb-1">{microcurso.title}</h3>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{microcurso.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{microcurso.duration_minutes} min</span>
                            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                              Assistir →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Biblioteca */}
              {activeTab === 'biblioteca' && (
                <div className="space-y-6">
                  {biblioteca.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                      <p className="text-gray-600">Nenhum recurso disponível no momento.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {biblioteca.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">
                              {item.file_type === 'pdf' && '📄'}
                              {item.file_type === 'template' && '🎨'}
                              {item.file_type === 'script' && '📝'}
                              {item.file_type === 'planilha' && '📊'}
                              {item.file_type === 'mensagem' && '💬'}
                              {!['pdf', 'template', 'script', 'planilha', 'mensagem'].includes(item.file_type) && '📎'}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{item.category}</span>
                                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                  Abrir →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tutoriais */}
              {activeTab === 'tutoriais' && (
                <div className="space-y-6">
                  {tutoriais.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                      <p className="text-gray-600">Nenhum tutorial disponível no momento.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tutoriais.map((tutorial) => (
                        <div
                          key={tutorial.id}
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">🎓</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{tutorial.title}</h3>
                              <p className="text-xs text-gray-600 mb-2">{tutorial.tool_name}</p>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{tutorial.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{tutorial.duration_minutes} min • {tutorial.level}</span>
                                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                  Assistir →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
