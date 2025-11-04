'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calculator, Target, Heart, Droplets, Activity, Sparkles, FileText, Brain, DollarSign, TrendingUp, Star, Zap, UtensilsCrossed, Search } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  icon: any
  type: 'calculadora' | 'quiz' | 'planilha'
  category: string
  link: string
  color: string
}

export default function WellnessTemplatesPage() {
  // Estados do componente
  const [templates, setTemplates] = useState<Template[]>([])
  const [carregandoTemplates, setCarregandoTemplates] = useState(true)
  const [busca, setBusca] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todas')
  const [templatePreviewAberto, setTemplatePreviewAberto] = useState<string | null>(null)

  // Templates hardcoded como fallback mínimo (apenas se banco falhar)
  const templatesFallback: Template[] = [
    {
      id: 'imc',
      name: 'Calculadora IMC',
      description: 'Calcule o Índice de Massa Corporal dos seus clientes',
      icon: Calculator,
      type: 'calculadora',
      category: 'Avaliação',
      link: '/pt/wellness/templates/imc',
      color: 'bg-blue-500'
    },
    {
      id: 'proteina',
      name: 'Calculadora de Proteína',
      description: 'Calcule necessidades proteicas individuais',
      icon: Activity,
      type: 'calculadora',
      category: 'Nutrição',
      link: '/pt/wellness/templates/proteina',
      color: 'bg-orange-500'
    },
    {
      id: 'hidratacao',
      name: 'Calculadora de Hidratação',
      description: 'Avalie necessidades de água e eletrólitos',
      icon: Droplets,
      type: 'calculadora',
      category: 'Bem-Estar',
      link: '/pt/wellness/templates/hidratacao',
      color: 'bg-cyan-500'
    },
    {
      id: 'composicao',
      name: 'Composição Corporal',
      description: 'Avalie massa muscular, gordura e hidratação',
      icon: Target,
      type: 'calculadora',
      category: 'Avaliação',
      link: '/pt/wellness/templates/composicao',
      color: 'bg-green-500'
    },
    {
      id: 'wellness-profile',
      name: 'Quiz: Perfil de Bem-Estar',
      description: 'Descubra o perfil de bem-estar dos seus leads',
      icon: Heart,
      type: 'quiz',
      category: 'Quiz',
      link: '/pt/wellness/templates/wellness-profile',
      color: 'bg-purple-500'
    },
    {
      id: 'daily-wellness',
      name: 'Tabela: Bem-Estar Diário',
      description: 'Acompanhe métricas de bem-estar diárias',
      icon: FileText,
      type: 'planilha',
      category: 'Acompanhamento',
      link: '/pt/wellness/templates/daily-wellness',
      color: 'bg-teal-500'
    },
    {
      id: 'healthy-eating',
      name: 'Quiz: Alimentação Saudável',
      description: 'Avalie hábitos alimentares e oriente nutricionalmente',
      icon: Brain,
      type: 'quiz',
      category: 'Nutrição',
      link: '/pt/wellness/templates/healthy-eating',
      color: 'bg-emerald-500'
    },
    {
      id: 'ganhos',
      name: 'Quiz: Ganhos e Prosperidade',
      description: 'Avalie se o estilo de vida permite ganhar mais',
      icon: DollarSign,
      type: 'quiz',
      category: 'Negócio',
      link: '/pt/wellness/templates/ganhos',
      color: 'bg-blue-600'
    },
    {
      id: 'potencial',
      name: 'Quiz: Potencial e Crescimento',
      description: 'Descubra se o potencial está sendo bem aproveitado',
      icon: TrendingUp,
      type: 'quiz',
      category: 'Desenvolvimento',
      link: '/pt/wellness/templates/potencial',
      color: 'bg-green-600'
    },
    {
      id: 'proposito',
      name: 'Quiz: Propósito e Equilíbrio',
      description: 'Descubra se o dia a dia está alinhado com seus sonhos',
      icon: Star,
      type: 'quiz',
      category: 'Desenvolvimento',
      link: '/pt/wellness/templates/proposito',
      color: 'bg-purple-600'
    },
    {
      id: 'parasitas',
      name: 'Quiz: Diagnóstico de Parasitas',
      description: 'Descubra se você tem parasitas que estão afetando sua saúde',
      icon: Zap,
      type: 'quiz',
      category: 'Saúde',
      link: '/pt/wellness/templates/parasitas',
      color: 'bg-red-500'
    },
    {
      id: 'meal-planner',
      name: 'Planejador de Refeições',
      description: 'Crie planos alimentares personalizados',
      icon: UtensilsCrossed,
      type: 'calculadora',
      category: 'Nutrição',
      link: '/pt/wellness/templates/meal-planner',
      color: 'bg-pink-500'
    },
    {
      id: 'nutrition-assessment',
      name: 'Avaliação Nutricional',
      description: 'Questionário completo de hábitos alimentares',
      icon: Search,
      type: 'quiz',
      category: 'Nutrição',
      link: '/pt/wellness/templates/nutrition-assessment',
      color: 'bg-indigo-500'
    }
  ]

  // Mapeamento de ícones por categoria/tipo
  const iconMap: { [key: string]: any } = {
    calculadora: Calculator,
    quiz: Target,
    planilha: FileText,
    default: Calculator
  }

  // Mapeamento de cores por tipo
  const colorMap: { [key: string]: string } = {
    calculadora: 'bg-blue-500',
    quiz: 'bg-purple-500',
    planilha: 'bg-teal-500',
    default: 'bg-gray-500'
  }

  // Mapeamento de categorias
  const categoryMap: { [key: string]: string } = {
    calculadora: 'Calculadora',
    quiz: 'Quiz',
    planilha: 'Planilha',
    default: 'Outros'
  }

  // Carregar templates do banco
  useEffect(() => {
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/wellness/templates')
        if (response.ok) {
          const data = await response.json()
          if (data.templates && data.templates.length > 0) {
            console.log('📦 Templates carregados do banco:', data.templates.length)
            
            // Transformar templates do banco para formato da página
            const templatesFormatados = data.templates.map((t: any) => ({
              id: t.slug || t.id,
              name: t.nome,
              description: t.descricao || t.nome,
              icon: iconMap[t.type?.toLowerCase()] || iconMap[t.categoria?.toLowerCase()] || iconMap['default'],
              type: t.type || (t.categoria === 'Calculadora' ? 'calculadora' : t.categoria === 'Quiz' ? 'quiz' : 'planilha'),
              category: t.categoria || categoryMap[t.type] || 'Outros',
              link: `/pt/wellness/ferramentas/nova?template=${t.slug || t.id}`,
              color: colorMap[t.type?.toLowerCase()] || colorMap[t.categoria?.toLowerCase()] || colorMap['default']
            }))
            
            console.log('✨ Templates formatados:', templatesFormatados.length)
            setTemplates(templatesFormatados)
          } else {
            // Fallback se não houver templates no banco
            console.warn('⚠️ Nenhum template encontrado no banco, usando fallback')
            setTemplates(templatesFallback)
          }
        } else {
          // Fallback se erro na API
          console.error('⚠️ Erro ao buscar templates, usando fallback')
          setTemplates(templatesFallback)
        }
      } catch (error) {
        console.error('❌ Erro ao carregar templates:', error)
        // Fallback se erro
        setTemplates(templatesFallback)
      } finally {
        setCarregandoTemplates(false)
      }
    }
    carregarTemplates()
  }, [])

  const categories = ['todas', ...new Set(templates.map(t => t.category))]
  
  // Filtrar templates por categoria e busca
  const templatesFiltrados = templates.filter(template => {
    const matchCategoria = selectedCategory === 'todas' || template.category === selectedCategory
    const matchBusca = busca === '' || 
      template.name.toLowerCase().includes(busca.toLowerCase()) ||
      template.description.toLowerCase().includes(busca.toLowerCase()) ||
      template.category.toLowerCase().includes(busca.toLowerCase())
    return matchCategoria && matchBusca
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <button className="flex items-center text-gray-600 hover:text-gray-900">
                  <Image
                    src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
                    alt="YLADA"
                    width={280}
                    height={84}
                    className="h-10 w-auto"
                  />
                </button>
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Templates Wellness</h1>
            </div>
            <Link
              href="/pt/wellness/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 mb-8 border border-teal-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ferramentas Prontas para Crescer 📈
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Templates validados e otimizados para captura de leads, avaliações profissionais e acompanhamento de clientes em bem-estar.
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Campo de Busca */}
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Template
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="🔍 Buscar por nome, descrição ou categoria..."
                  className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                <span className="absolute left-4 top-2.5 text-xl">🔍</span>
              </div>
              {busca && (
                <p className="mt-2 text-sm text-gray-600">
                  {templatesFiltrados.length} template(s) encontrado(s)
                </p>
              )}
            </div>
            
            {/* Filtro de Categoria */}
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {categories.map(categoria => {
                  const count = categoria === 'todas' 
                    ? templates.length 
                    : templates.filter(t => t.category === categoria).length
                  return (
                    <option key={categoria} value={categoria}>
                      {categoria === 'todas' ? `Todas (${count})` : `${categoria} (${count})`}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>
        
        {/* Botões de Filtro Rápido */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-teal-300'
                }`}
              >
                {category === 'todas' ? 'Todas' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Templates */}
        {carregandoTemplates ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando templates...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesFiltrados.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg mb-2">Nenhum template encontrado</p>
                <p className="text-gray-400 text-sm">
                  {busca ? `Tente buscar por outros termos ou limpe o filtro de busca.` : 'Tente selecionar outra categoria.'}
                </p>
              </div>
            ) : (
              templatesFiltrados.map((template) => {
                const Icon = template.icon
                return (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-teal-300 transition-all duration-300 hover:shadow-lg group"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                            <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                              Demo
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 flex gap-3">
                      <button
                        onClick={() => setTemplatePreviewAberto(template.id)}
                        className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                      >
                        Ver Demo
                      </button>
                      <Link
                        href={template.link}
                        className="flex-1 bg-white border-2 border-teal-600 text-teal-600 text-center py-2.5 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                      >
                        Criar Link
                      </Link>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Como usar os templates?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Ver Demo:</strong> Veja como a ferramenta funciona antes de criar</li>
                <li>• <strong>Criar Link:</strong> Crie seu link personalizado e comece a usar</li>
                <li>• <strong>Compartilhar:</strong> Envie para seus clientes via WhatsApp, email ou redes sociais</li>
                <li>• <strong>Coletar Leads:</strong> Receba os resultados diretamente no seu dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Preview */}
      {templatePreviewAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setTemplatePreviewAberto(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const template = templates.find(t => t.id === templatePreviewAberto)
              if (!template) return null

              const Icon = template.icon
              
              return (
                <div className="p-6">
                  {/* Header do Modal */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setTemplatePreviewAberto(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* Preview Baseado no Tipo */}
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 bg-gray-50">
                    {template.type === 'calculadora' ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview da Calculadora</h3>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <p className="text-sm text-gray-600 mb-4">Esta é uma calculadora interativa. O usuário preencherá os campos necessários e receberá um resultado personalizado.</p>
                          <div className="space-y-3">
                            <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                            <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                            <button className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium">
                              Calcular
                            </button>
                          </div>
                          <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                            <p className="text-sm text-teal-800"><strong>Resultado:</strong> O resultado será exibido aqui após o cálculo.</p>
                          </div>
                        </div>
                      </div>
                    ) : template.type === 'quiz' ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview do Quiz</h3>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <p className="text-sm text-gray-600 mb-4">Este é um quiz interativo. O usuário responderá perguntas e receberá um diagnóstico personalizado.</p>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-2">Pergunta 1 de 5</p>
                              <p className="text-base text-gray-700 mb-3">Esta é uma pergunta de exemplo do quiz?</p>
                              <div className="space-y-2">
                                <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                                <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                                <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                              </div>
                            </div>
                            <button className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium">
                              Próxima Pergunta
                            </button>
                          </div>
                          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="text-sm text-purple-800"><strong>Diagnóstico:</strong> Um diagnóstico personalizado será exibido após todas as respostas.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview da Planilha</h3>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <p className="text-sm text-gray-600 mb-4">Esta é uma planilha/checklist. O usuário preencherá ou visualizará informações organizadas.</p>
                          <div className="space-y-3">
                            <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                            <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                            <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                            <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                          </div>
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800"><strong>Conteúdo:</strong> A planilha conterá informações organizadas e úteis para o usuário.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer do Modal */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setTemplatePreviewAberto(null)}
                      className="flex-1 bg-gray-100 text-gray-700 text-center py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Fechar
                    </button>
                    <Link
                      href={template.link}
                      onClick={() => setTemplatePreviewAberto(null)}
                      className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      Criar Meu Link
                    </Link>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
