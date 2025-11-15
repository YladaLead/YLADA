'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import dynamic from 'next/dynamic'

const WellnessNavBar = dynamic(() => import('@/components/wellness/WellnessNavBar'), {
  ssr: true,
  loading: () => <div className="h-16 bg-white border-b border-gray-200 animate-pulse" />
})

// Importar tutoriais do documento
import { tutoriaisData, Tutorial } from '@/data/tutoriais-wellness'

export default function TutoriaisWellnessPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <TutoriaisWellnessContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function TutoriaisWellnessContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null)

  // Categorias disponíveis
  const categories = [
    { id: 'todos', nome: 'Todos', cor: 'gray' },
    { id: 'primeiros-passos', nome: 'Primeiros Passos', cor: 'green' },
    { id: 'funcionalidades', nome: 'Funcionalidades', cor: 'blue' },
    { id: 'avancado', nome: 'Avançado', cor: 'purple' },
    { id: 'otimizacao', nome: 'Otimização', cor: 'orange' },
    { id: 'troubleshooting', nome: 'Solução de Problemas', cor: 'red' }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Tutoriais e Recursos" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📚 Tutoriais e Recursos
          </h1>
          <p className="text-gray-600">
            Encontre respostas para suas dúvidas e aprenda a usar todas as funcionalidades do YLADA Wellness
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Barra de busca */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar tutoriais, dúvidas, funcionalidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? `bg-${cat.cor}-600 text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredTutorials.length} {filteredTutorials.length === 1 ? 'tutorial encontrado' : 'tutoriais encontrados'}
          </p>
        </div>

        {/* Lista de Tutoriais */}
        <div className="space-y-4">
          {filteredTutorials.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleTutorial(tutorial.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {tutorial.titulo}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        tutorial.categoria === 'primeiros-passos' ? 'bg-green-100 text-green-800' :
                        tutorial.categoria === 'funcionalidades' ? 'bg-blue-100 text-blue-800' :
                        tutorial.categoria === 'avancado' ? 'bg-purple-100 text-purple-800' :
                        tutorial.categoria === 'otimizacao' ? 'bg-orange-100 text-orange-800' :
                        tutorial.categoria === 'troubleshooting' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {categories.find(c => c.id === tutorial.categoria)?.nome || tutorial.categoria}
                      </span>
                      {tutorial.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4">
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedTutorial === tutorial.id ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedTutorial === tutorial.id && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div 
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: formatTutorialContent(tutorial.conteudo) }}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Seção de Recursos Adicionais */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/pt/wellness/modulos"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Módulos e Cursos</h3>
            <p className="text-gray-600 text-sm">
              Acesse materiais educacionais e cursos completos
            </p>
          </Link>

          <Link
            href="/pt/wellness/suporte"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Suporte</h3>
            <p className="text-gray-600 text-sm">
              Entre em contato com nossa equipe de suporte
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat IA</h3>
            <p className="text-gray-600 text-sm mb-4">
              Tire dúvidas em tempo real com nosso assistente virtual
            </p>
            <p className="text-xs text-gray-500">
              Disponível na Home
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Função para formatar conteúdo do tutorial (Markdown básico)
function formatTutorialContent(content: string): string {
  // Converter quebras de linha em <br>
  let formatted = content.replace(/\n\n/g, '</p><p>')
  formatted = formatted.replace(/\n/g, '<br>')
  
  // Converter **texto** em <strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Converter *texto* em <em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Converter listas
  formatted = formatted.replace(/^\- (.*)$/gm, '<li>$1</li>')
  formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  
  return `<p>${formatted}</p>`
}

