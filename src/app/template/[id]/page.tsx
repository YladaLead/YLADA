'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import { TEMPLATES_CATALOG, Template } from '@/lib/templates-catalog'

interface TemplateDetailProps {
  params: {
    id: string
  }
}

export default function TemplateDetail({ params }: TemplateDetailProps) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundTemplate = TEMPLATES_CATALOG.find(t => t.id === params.id)
    setTemplate(foundTemplate || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando template...</p>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template não encontrado</h1>
          <p className="text-gray-600 mb-6">O template que você está procurando não existe.</p>
          <Link 
            href="/templates-environment"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Voltar para Templates
          </Link>
        </div>
      </div>
    )
  }

  const getObjectiveLabel = (objective: string) => {
    const labels = {
      'attract-contacts': 'Atrair Novos Contatos',
      'convert-sales': 'Converter em Vendas',
      'engage-clients': 'Fidelizar e Engajar Clientes',
      'generate-authority': 'Gerar Valor e Autoridade'
    }
    return labels[objective as keyof typeof labels] || objective
  }

  const getProfessionLabel = (profession: string) => {
    const labels = {
      'universal': 'Universal',
      'nutri': 'Nutricionista',
      'sales': 'Vendedor',
      'coach': 'Coach'
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

      {/* Template Detail */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/templates-environment" className="hover:text-blue-600">Templates</Link>
              <span>›</span>
              <span className="text-gray-900">{template.name}</span>
            </div>
          </nav>

          {/* Template Header */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {template.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-sm rounded-full border ${getDifficultyColor(template.difficulty)}`}>
                  {template.difficulty}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full border ${getDisclaimerColor(template.disclaimer)}`}>
                  {template.disclaimer === 'required' ? '⚠️ Obrigatório' : 
                   template.disclaimer === 'recommended' ? '💡 Recomendado' : 
                   '✅ Não necessário'}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                {getObjectiveLabel(template.objective)}
              </span>
              <span className="px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-full border border-gray-200">
                {getProfessionLabel(template.profession)}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200">
                {template.estimatedTime}
              </span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200">
                {template.category}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  template.status === 'published' ? 'bg-green-100 text-green-800' :
                  template.status === 'ready' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {template.status === 'published' ? '✅ Publicado' :
                   template.status === 'ready' ? '🚀 Pronto' :
                   '📝 Rascunho'}
                </span>
                <span className="text-sm text-gray-600">
                  {template.captureData ? '📊 Captura dados do usuário' : '🔗 Redireciona para link'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Criado em: {template.createdAt.toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Template Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* CTA Configuration */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Configuração de CTA</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={template.ctaText}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>
                  {template.redirectUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de Redirecionamento
                      </label>
                      <input
                        type="text"
                        value={template.redirectUrl}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Scientific Basis */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Base Científica</h2>
                <div className="space-y-3">
                  {template.scientificBasis.map((basis, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-blue-600 mr-3">🔬</span>
                      <span className="text-blue-800 font-medium">{basis}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              {template.disclaimer !== 'none' && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Aviso Legal</h2>
                  <div className={`p-4 rounded-lg border ${
                    template.disclaimer === 'required' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    <p className={`text-sm ${
                      template.disclaimer === 'required' ? 'text-red-800' : 'text-yellow-800'
                    }`}>
                      ⚠️ <strong>IMPORTANTE:</strong> Este template é apenas informativo e educativo. 
                      Para recomendações específicas sobre sua saúde, consulte sempre 
                      um profissional qualificado (médico, nutricionista, etc.).
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300">
                    🚀 Usar Template
                  </button>
                  <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300">
                    📋 Duplicar
                  </button>
                  <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300">
                    ⚙️ Configurar
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informações</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-mono text-gray-900">{template.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="text-gray-900">{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo:</span>
                    <span className="text-gray-900">{template.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dificuldade:</span>
                    <span className="text-gray-900">{template.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Atualizado:</span>
                    <span className="text-gray-900">{template.updatedAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Related Templates */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Templates Relacionados</h3>
                <div className="space-y-3">
                  {TEMPLATES_CATALOG
                    .filter(t => t.objective === template.objective && t.id !== template.id)
                    .slice(0, 3)
                    .map(relatedTemplate => (
                      <Link 
                        key={relatedTemplate.id}
                        href={`/template/${relatedTemplate.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getCategoryIcon(relatedTemplate.category)}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{relatedTemplate.name}</p>
                            <p className="text-xs text-gray-600">{relatedTemplate.estimatedTime}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
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
              Template profissional YLADA
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
