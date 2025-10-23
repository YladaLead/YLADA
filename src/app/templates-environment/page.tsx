'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import { TEMPLATES_CATALOG, Template, getTemplatesByObjective, getTemplatesByProfession, searchTemplates } from '@/lib/templates-catalog'

export default function TemplatesEnvironment() {
  const [selectedObjective, setSelectedObjective] = useState('all')
  const [selectedProfession, setSelectedProfession] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    setTemplates(TEMPLATES_CATALOG)
  }, [])

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const objectiveMatch = selectedObjective === 'all' || template.objective === selectedObjective
    const professionMatch = selectedProfession === 'all' || 
      template.profession === selectedProfession || 
      template.profession === 'universal'
    const searchMatch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return objectiveMatch && professionMatch && searchMatch
  })

  const getObjectiveLabel = (objective: string) => {
    const labels = {
      'attract-contacts': 'Atrair Novos Contatos',
      'convert-sales': 'Converter em Vendas',
      'engage-clients': 'Fidelizar e Engajar Clientes',
      'generate-authority': 'Gerar Valor e Autoridade',
      'all': 'Todos os Objetivos'
    }
    return labels[objective as keyof typeof labels] || objective
  }

  const getProfessionLabel = (profession: string) => {
    const labels = {
      'universal': 'Universal',
      'nutri': 'Nutricionista',
      'sales': 'Consultor Nutra',
      'coach': 'Coach de Bem-estar',
      'all': 'Todas as Profissões'
    }
    return labels[profession as keyof typeof labels] || profession
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      'quiz': '🧠',
      'calculator': '📊',
      'checklist': '✅',
      'ebook': '📚',
      'table': '📋',
      'planner': '📅',
      'challenge': '🏆',
      'guide': '📖',
      'infographic': '📈',
      'recipe': '👨‍🍳',
      'simulator': '🎮',
      'form': '📝',
      'template': '📄',
      'post': '📱',
      'reel': '🎬',
      'article': '📰',
      'catalog': '📦',
      'script': '🎭',
      'email': '📧',
      'calendar': '🗓️'
    }
    return icons[category as keyof typeof icons] || '📄'
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'easy': 'bg-green-100 text-green-800 border-green-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'advanced': 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getDisclaimerColor = (disclaimer: string) => {
    const colors = {
      'required': 'bg-red-100 text-red-800 border-red-200',
      'recommended': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'none': 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[disclaimer as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center max-w-6xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ambiente de{' '}
            <span className="text-blue-600">
              Templates YLADA
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Catálogo completo de 60 templates profissionais, organizados por objetivo e profissão.
            Cada template segue padrões científicos e conformidade legal.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Filtros Inteligentes</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            
            {/* Filtro por Objetivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo
              </label>
              <select
                value={selectedObjective}
                onChange={(e) => setSelectedObjective(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Objetivos</option>
                <option value="attract-contacts">Atrair Novos Contatos</option>
                <option value="convert-sales">Converter em Vendas</option>
                <option value="engage-clients">Fidelizar e Engajar Clientes</option>
                <option value="generate-authority">Gerar Valor e Autoridade</option>
              </select>
            </div>

            {/* Filtro por Profissão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profissão
              </label>
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as Profissões</option>
                <option value="universal">Universal</option>
                <option value="nutri">Nutricionista</option>
                <option value="sales">Consultor Nutra</option>
                <option value="coach">Coach de Bem-estar</option>
              </select>
            </div>

            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Templates
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o nome do template..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Resultados do Filtro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Mostrando <span className="text-blue-600 font-bold">{filteredTemplates.length}</span> templates para{' '}
              <span className="text-blue-600 font-bold">{getObjectiveLabel(selectedObjective)}</span> -{' '}
              <span className="text-blue-600 font-bold">{getProfessionLabel(selectedProfession)}</span>
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-xl">{getCategoryIcon(template.category)}</span>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getDisclaimerColor(template.disclaimer)}`}>
                    {template.disclaimer === 'required' ? '⚠️' : template.disclaimer === 'recommended' ? '💡' : '✅'}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {template.description}
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                  {getObjectiveLabel(template.objective)}
                </span>
                <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
                  {getProfessionLabel(template.profession)}
                </span>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                  {template.estimatedTime}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  template.status === 'published' ? 'bg-green-100 text-green-800' :
                  template.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {template.status === 'published' ? '✅ Publicado' :
                   template.status === 'ready' ? '🚀 Pronto' :
                   '📝 Rascunho'}
                </span>
                <span className="text-xs text-gray-500">
                  {template.captureData ? '📊 Captura dados' : '🔗 Redireciona'}
                </span>
              </div>

              {template.id === 'calculadora-imc' ? (
                <Link 
                  href="/calculadora-imc"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  🚀 Usar Agora
                </Link>
              ) : (
                <Link 
                  href={`/template/${template.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  {template.status === 'published' ? 'Usar Template' : 'Ver Detalhes'}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nenhum template encontrado</h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros para encontrar templates que atendam suas necessidades.
            </p>
            <button
              onClick={() => {
                setSelectedObjective('all')
                setSelectedProfession('all')
                setSearchTerm('')
              }}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Pronto para{' '}
            <span className="text-blue-600">
              Implementar Templates
            </span>?
          </h2>
          <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto">
            Comece implementando os templates mais impactantes para sua profissão 
            e veja sua conversão aumentar em até 340%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              <span className="mr-2 text-lg">🚀</span>
              Começar Implementação
            </Link>
            <Link 
              href="/TEMPLATES-PADROES-YLADA.md"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 text-base font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              <span className="mr-2 text-lg">📋</span>
              Ver Padrões
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Ambiente profissional de templates YLADA
            </p>
            <p className="text-gray-500 text-xs">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
