'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import dynamic from 'next/dynamic'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const WellnessNavBar = dynamic(() => import('@/components/wellness/WellnessNavBar'), {
  ssr: true,
  loading: () => <div className="h-16 bg-white border-b border-gray-200 animate-pulse" />
})

// Importar tutoriais do documento
import { tutoriaisData, Tutorial } from '@/data/tutoriais-wellness'

// Ícones por categoria
const categoryIcons: Record<string, string> = {
  'primeiros-passos': '🚀',
  'funcionalidades': '⚙️',
  'avancado': '🎯',
  'otimizacao': '📈',
  'troubleshooting': '🔧'
}

// Calcular tempo estimado de leitura (palavras por minuto = 200)
function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.ceil(words / 200)
}

// Layout server-side já valida autenticação, perfil e assinatura
export default function TutoriaisWellnessPage() {
  return <TutoriaisWellnessContent />
}

function TutoriaisWellnessContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null)
  const [helpfulTutorials, setHelpfulTutorials] = useState<Set<string>>(new Set())

  // Categorias disponíveis
  const categories = [
    { id: 'todos', nome: 'Todos', cor: 'gray', icon: '📚' },
    { id: 'primeiros-passos', nome: 'Primeiros Passos', cor: 'green', icon: '🚀' },
    { id: 'funcionalidades', nome: 'Funcionalidades', cor: 'blue', icon: '⚙️' },
    { id: 'avancado', nome: 'Avançado', cor: 'purple', icon: '🎯' },
    { id: 'otimizacao', nome: 'Otimização', cor: 'orange', icon: '📈' },
    { id: 'troubleshooting', nome: 'Solução de Problemas', cor: 'red', icon: '🔧' }
  ]

  // Filtrar tutoriais
  const filteredTutorials = useMemo(() => {
    let filtered = tutoriaisData

    // Filtrar por categoria
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(t => t.categoria === selectedCategory)
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(t => 
        t.titulo.toLowerCase().includes(term) ||
        t.conteudo.toLowerCase().includes(term) ||
        t.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    return filtered
  }, [searchTerm, selectedCategory])

  const toggleTutorial = (id: string) => {
    setExpandedTutorial(expandedTutorial === id ? null : id)
  }

  const markAsHelpful = (id: string) => {
    setHelpfulTutorials(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Encontrar tutoriais relacionados (mesma categoria ou tags similares)
  const getRelatedTutorials = (tutorial: Tutorial): Tutorial[] => {
    return tutoriaisData
      .filter(t => 
        t.id !== tutorial.id && 
        (t.categoria === tutorial.categoria || 
         t.tags.some(tag => tutorial.tags.includes(tag)))
      )
      .slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Tutoriais e Recursos" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/pt/wellness/home" className="hover:text-green-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Tutoriais</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            📚 Tutoriais e Recursos
          </h1>
          <p className="text-gray-600 text-lg">
            Encontre respostas para suas dúvidas e aprenda a usar todas as funcionalidades do YLADA Wellness
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Barra de busca */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar tutoriais, dúvidas, funcionalidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filtros por categoria */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? `bg-${cat.cor}-600 text-white shadow-md scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredTutorials.length} {filteredTutorials.length === 1 ? 'tutorial encontrado' : 'tutoriais encontrados'}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('todos')
              }}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Lista de Tutoriais */}
        <div className="space-y-4">
          {filteredTutorials.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum tutorial encontrado</h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar sua busca ou escolher outra categoria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('todos')
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredTutorials.map((tutorial) => {
              const readingTime = calculateReadingTime(tutorial.conteudo)
              const relatedTutorials = getRelatedTutorials(tutorial)
              const isExpanded = expandedTutorial === tutorial.id
              const isHelpful = helpfulTutorials.has(tutorial.id)
              
              return (
                <div
                  key={tutorial.id}
                  id={`tutorial-${tutorial.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <button
                    onClick={() => toggleTutorial(tutorial.id)}
                    className="w-full px-6 py-5 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-2xl flex-shrink-0">
                          {categoryIcons[tutorial.categoria] || '📄'}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {tutorial.titulo}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                              tutorial.categoria === 'primeiros-passos' ? 'bg-green-100 text-green-800' :
                              tutorial.categoria === 'funcionalidades' ? 'bg-blue-100 text-blue-800' :
                              tutorial.categoria === 'avancado' ? 'bg-purple-100 text-purple-800' :
                              tutorial.categoria === 'otimizacao' ? 'bg-orange-100 text-orange-800' :
                              tutorial.categoria === 'troubleshooting' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {categories.find(c => c.id === tutorial.categoria)?.nome || tutorial.categoria}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {readingTime} min de leitura
                            </span>
                            {tutorial.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 py-6 border-t border-gray-200 bg-gray-50 animate-fadeIn">
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700 prose-code:text-green-700 prose-code:bg-green-50 prose-code:px-1 prose-code:rounded">
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {tutorial.conteudo}
                        </Markdown>
                      </div>

                      {/* Feedback e Ações */}
                      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                        <button
                          onClick={() => markAsHelpful(tutorial.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isHelpful
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v5m7 10h.01" />
                          </svg>
                          {isHelpful ? 'Foi útil!' : 'Foi útil?'}
                        </button>

                        {relatedTutorials.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Relacionados:</span>
                            <div className="flex gap-2">
                              {relatedTutorials.map(related => (
                                <button
                                  key={related.id}
                                  onClick={() => {
                                    setExpandedTutorial(related.id)
                                    setTimeout(() => {
                                      const element = document.getElementById(`tutorial-${related.id}`)
                                      if (element) {
                                        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                      }
                                    }, 100)
                                  }}
                                  className="text-green-600 hover:text-green-700 hover:underline text-xs"
                                >
                                  {related.titulo.length > 30 ? related.titulo.substring(0, 30) + '...' : related.titulo}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
