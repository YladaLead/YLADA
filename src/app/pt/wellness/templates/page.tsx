'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { Calculator, Target, Heart, Droplets, Activity, Sparkles, FileText, Brain, DollarSign, TrendingUp, Star, Zap, UtensilsCrossed, Search } from 'lucide-react'
import { calculadoraAguaDiagnosticos, calculadoraImcDiagnosticos, calculadoraProteinaDiagnosticos, calculadoraCaloriasDiagnosticos } from '@/lib/diagnosticos-nutri'

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
  const [etapaPreview, setEtapaPreview] = useState<number>(0) // 0 = landing, 1+ = formulário/perguntas, último = resultado

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
      <WellnessNavBar showTitle={true} title="Templates Wellness" />

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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => {
          setTemplatePreviewAberto(null)
          setEtapaPreview(0)
        }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const template = templates.find(t => t.id === templatePreviewAberto)
              if (!template) return null

              const Icon = template.icon
              
              // Determinar número de etapas baseado no tipo
              const totalEtapas = template.type === 'calculadora' ? 4 : template.type === 'quiz' ? 6 : 2
              const etapasLabels = template.type === 'calculadora' 
                ? ['Início', 'Formulário', 'Resultado', 'Diagnósticos']
                : template.type === 'quiz'
                ? ['Início', 'Pergunta 1', 'Pergunta 2', 'Pergunta 3', 'Resultado', 'CTA']
                : ['Início', 'Conteúdo']
              
              return (
                <>
                  {/* Header do Modal com Gradiente */}
                  <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{template.name}</h2>
                          <p className="text-teal-100 text-sm">Visualize o fluxo completo deste template</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setTemplatePreviewAberto(null)
                          setEtapaPreview(0)
                        }}
                        className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Conteúdo do Preview */}
                  <div className="flex-1 overflow-y-auto p-6 pb-24">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="text-2xl mr-2">🎯</span>
                        Preview do {template.type === 'calculadora' ? 'Calculadora' : template.type === 'quiz' ? 'Quiz' : 'Planilha'} - "{template.name}"
                      </h3>
                      
                      <div className="relative">
                        {/* Etapa 0: Landing */}
                        {etapaPreview === 0 && (
                          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h4>
                            <p className="text-gray-700 mb-4">{template.description}</p>
                            <div className="space-y-2 text-sm text-gray-600">
                              <p>✓ Descubra seu resultado personalizado</p>
                              <p>✓ Receba recomendações específicas</p>
                              <p>✓ Obtenha orientações profissionais</p>
                            </div>
                            <button className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                              ▶️ Começar Agora - É Grátis
                            </button>
                          </div>
                        )}

                        {/* Formulário Completo - Etapa 1 */}
                        {template.type === 'calculadora' && etapaPreview === 1 && (
                          <>
                            {template.id === 'hidratacao' || template.name?.toLowerCase().includes('água') || template.name?.toLowerCase().includes('agua') ? (
                              // Formulário específico para Calculadora de Água (igual à Nutri)
                              <div className="space-y-6">
                                {/* Dados Principais */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-blue-900 mb-3">⚖️ Informe seus dados</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                      <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                                      <input type="number" placeholder="Ex: 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                    </div>
                                  </div>
                                  <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Precisão científica</p>
                                </div>

                                {/* Nível de Atividade */}
                                <div className="bg-cyan-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-cyan-900 mb-3">🏃‍♂️ Nível de atividade física</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                      <input type="radio" name="atividade-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">Sedentário - Pouco ou nenhum exercício</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                      <input type="radio" name="atividade-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">Leve - Exercício leve 1-3 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                      <input type="radio" name="atividade-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">Moderado - Exercício moderado 3-5 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                                      <input type="radio" name="atividade-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">Intenso - Exercício intenso 6-7 dias/semana</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Personalização</p>
                                </div>

                                {/* Condições Climáticas */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-green-900 mb-3">🌡️ Condições climáticas (opcional)</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="clima-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">❄️ Clima frio/temperado</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="clima-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">☀️ Clima quente/seco</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="clima-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">🏔️ Altitude elevada</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="clima-agua" className="mr-3" disabled />
                                      <span className="text-gray-700">🏖️ Clima úmido</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Contextualização</p>
                                </div>
                              </div>
                            ) : template.id === 'imc' || template.name?.toLowerCase().includes('imc') ? (
                              // Formulário específico para Calculadora de IMC (igual à Nutri)
                              <div className="space-y-6">
                                {/* Dados Principais */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-blue-900 mb-3">📏 Informe seus dados</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                                      <input type="number" placeholder="Ex: 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                      <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                    </div>
                                  </div>
                                  <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Precisão científica</p>
                                </div>

                                {/* Sexo */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-green-900 mb-3">👤 Selecione seu sexo</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="sexo-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">👨 Masculino</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="sexo-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">👩 Feminino</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Personalização</p>
                                </div>

                                {/* Nível de Atividade */}
                                <div className="bg-orange-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-orange-900 mb-3">🏃‍♂️ Nível de atividade física (opcional)</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">Sedentário - Pouco ou nenhum exercício</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">Leve - Exercício leve 1-3 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">Moderado - Exercício moderado 3-5 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-orange-300">
                                      <input type="radio" name="atividade-imc" className="mr-3" disabled />
                                      <span className="text-gray-700">Intenso - Exercício intenso 6-7 dias/semana</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Contextualização</p>
                                </div>
                              </div>
                            ) : template.id === 'calorias' || template.name?.toLowerCase().includes('caloria') ? (
                              // Formulário específico para Calculadora de Calorias (igual à Nutri)
                              <div className="space-y-6">
                                {/* Dados Principais */}
                                <div className="bg-orange-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-orange-900 mb-3">⚖️ Informe seus dados</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                      <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                                      <input type="number" placeholder="Ex: 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                    </div>
                                  </div>
                                  <p className="text-xs text-orange-600 mt-2">🧠 Gatilho: Precisão científica</p>
                                </div>

                                {/* Idade e Sexo */}
                                <div className="bg-red-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-red-900 mb-3">👤 Idade e sexo</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Idade (anos)</label>
                                      <input type="number" placeholder="Ex: 30" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled>
                                        <option value="">Selecione</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                      </select>
                                    </div>
                                  </div>
                                  <p className="text-xs text-red-600 mt-2">🧠 Gatilho: Personalização</p>
                                </div>

                                {/* Nível de Atividade */}
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-yellow-900 mb-3">🏃‍♂️ Nível de atividade física</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                      <input type="radio" name="atividade-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">Sedentário - Pouco ou nenhum exercício</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                      <input type="radio" name="atividade-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">Leve - Exercício leve 1-3 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                      <input type="radio" name="atividade-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">Moderado - Exercício moderado 3-5 dias/semana</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-yellow-300">
                                      <input type="radio" name="atividade-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">Intenso - Exercício intenso 6-7 dias/semana</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-yellow-600 mt-2">🧠 Gatilho: Contextualização</p>
                                </div>

                                {/* Objetivo */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h4 className="font-semibold text-green-900 mb-3">🎯 Seu objetivo</h4>
                                  <div className="space-y-2">
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="objetivo-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">🔥 Emagrecer - Perder peso</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="objetivo-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">⚖️ Manter - Peso estável</span>
                                    </label>
                                    <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                                      <input type="radio" name="objetivo-calorias" className="mr-3" disabled />
                                      <span className="text-gray-700">🚀 Ganhar - Aumentar massa</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Motivação</p>
                                </div>
                              </div>
                            ) : (
                              // Formulário genérico para outras calculadoras
                              <div className="bg-white rounded-lg p-6 border-2 border-teal-200">
                                <h4 className="font-semibold text-gray-900 mb-4">Formulário de Dados</h4>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Campo 1</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Digite aqui..." disabled />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Campo 2</label>
                                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Digite aqui..." disabled />
                                  </div>
                                  <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium">
                                    Calcular →
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {template.type === 'quiz' && etapaPreview >= 1 && etapaPreview <= 3 && (
                          <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
                            <h4 className="font-semibold text-gray-900 mb-4">Pergunta {etapaPreview} de 5</h4>
                            <p className="text-base text-gray-700 mb-4">Esta é uma pergunta de exemplo do quiz?</p>
                            <div className="space-y-2">
                              {['Opção A', 'Opção B', 'Opção C'].map((opcao, idx) => (
                                <label key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                                  <input type="radio" className="mr-3" disabled />
                                  <span className="text-gray-700">{opcao}</span>
                                </label>
                              ))}
                            </div>
                            <button className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg font-medium">
                              Próxima Pergunta →
                            </button>
                          </div>
                        )}

                        {/* Etapa de Resultado Visual - Etapa 2 */}
                        {template.type === 'calculadora' && etapaPreview === 2 && (
                          <>
                            {template.id === 'hidratacao' || template.name?.toLowerCase().includes('água') || template.name?.toLowerCase().includes('agua') ? (
                              // Resultado Visual específico para Calculadora de Água (igual à Nutri)
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado da Calculadora de Água</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">2.8L</div>
                                    <div className="text-lg font-semibold text-green-600">Água Diária Recomendada</div>
                                    <div className="text-sm text-gray-600">Baseado em 40ml/kg para atividade moderada</div>
                                  </div>
                                  
                                  {/* Distribuição Diária */}
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-gray-800 mb-2">📅 Distribuição Diária:</h5>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🌅 Manhã (6h-12h):</span>
                                        <span className="font-semibold">0.8L</span>
                                      </div>
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>☀️ Tarde (12h-18h):</span>
                                        <span className="font-semibold">1.2L</span>
                                      </div>
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🌙 Noite (18h-24h):</span>
                                        <span className="font-semibold">0.8L</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Escala Visual */}
                                  <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                                    <div className="absolute left-0 top-0 h-6 bg-red-500 rounded-full" style={{width: '25%'}}></div>
                                    <div className="absolute left-0 top-0 h-6 bg-yellow-500 rounded-full" style={{width: '50%'}}></div>
                                    <div className="absolute left-0 top-0 h-6 bg-green-500 rounded-full" style={{width: '25%'}}></div>
                                  </div>
                                  
                                  {/* Legendas */}
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-red-600 font-semibold">Baixa</div>
                                      <div className="text-gray-600">&lt; 2L/dia</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-yellow-600 font-semibold">Moderada</div>
                                      <div className="text-gray-600">2-3L/dia</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-green-600 font-semibold">Alta</div>
                                      <div className="text-gray-600">&gt; 3L/dia</div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                              </div>
                            ) : template.id === 'imc' || template.name?.toLowerCase().includes('imc') ? (
                              // Resultado Visual específico para Calculadora de IMC (igual à Nutri)
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado Visual do IMC</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">IMC: 22.9</div>
                                    <div className="text-lg font-semibold text-green-600">Peso Normal</div>
                                    <div className="text-sm text-gray-600">Faixa: 18.5 - 24.9</div>
                                  </div>
                                  
                                  {/* Barra Visual */}
                                  <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                                    <div className="absolute left-0 top-0 h-6 bg-green-500 rounded-full" style={{width: '35%'}}></div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                              </div>
                            ) : template.id === 'calorias' || template.name?.toLowerCase().includes('caloria') ? (
                              // Resultado Visual específico para Calculadora de Calorias (igual à Nutri)
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado da Calculadora de Calorias</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">2.200</div>
                                    <div className="text-lg font-semibold text-green-600">Calorias Diárias Recomendadas</div>
                                    <div className="text-sm text-gray-600">Baseado em TMB + atividade física para manutenção</div>
                                  </div>
                                  
                                  {/* Distribuição de Macronutrientes */}
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-gray-800 mb-2">🥗 Distribuição de Macronutrientes:</h5>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🥩 Proteínas (25%):</span>
                                        <span className="font-semibold">550 cal (137g)</span>
                                      </div>
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🍞 Carboidratos (50%):</span>
                                        <span className="font-semibold">1.100 cal (275g)</span>
                                      </div>
                                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                                        <span>🥑 Gorduras (25%):</span>
                                        <span className="font-semibold">550 cal (61g)</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Escala Visual */}
                                  <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                                    <div className="absolute left-0 top-0 h-6 bg-blue-500 rounded-full" style={{width: '30%'}}></div>
                                    <div className="absolute left-0 top-0 h-6 bg-green-500 rounded-full" style={{width: '40%'}}></div>
                                    <div className="absolute left-0 top-0 h-6 bg-yellow-500 rounded-full" style={{width: '30%'}}></div>
                                  </div>
                                  
                                  {/* Legendas */}
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-blue-600 font-semibold">Déficit</div>
                                      <div className="text-gray-600">Perda de peso</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-green-600 font-semibold">Manutenção</div>
                                      <div className="text-gray-600">Peso estável</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                                      <div className="text-yellow-600 font-semibold">Superávit</div>
                                      <div className="text-gray-600">Ganho de peso</div>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                              </div>
                            ) : template.id === 'proteina' || template.name?.toLowerCase().includes('proteína') || template.name?.toLowerCase().includes('proteina') ? (
                              // Resultado Visual específico para Calculadora de Proteína
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado da Calculadora de Proteína</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">120g</div>
                                    <div className="text-lg font-semibold text-green-600">Proteína Diária Recomendada</div>
                                    <div className="text-sm text-gray-600">Baseado em 1.6g/kg para atividade moderada</div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">🧠 Gatilho: Visualização clara</p>
                              </div>
                            ) : (
                              // Resultado genérico para outras calculadoras
                              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">📊 Resultado</h4>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-teal-600 mb-2">Resultado</div>
                                    <div className="text-lg font-semibold text-gray-600">Análise completa</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {/* Etapa de Resultado para Quiz */}
                        {template.type === 'quiz' && etapaPreview === 4 && (
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-6 border-4 border-purple-200 shadow-lg">
                              <div className="text-center mb-6">
                                <div className="inline-block px-6 py-3 bg-purple-600 text-white rounded-full font-bold text-lg mb-4">
                                  Perfil Moderado
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">Score: 8/12</h4>
                                <p className="text-gray-600">Seu resultado mostra potencial para melhoria</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-6">
                                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                                  <span className="text-xl mr-2">💡</span>
                                  Recomendações
                                </h5>
                                <ul className="space-y-2">
                                  <li className="flex items-start text-gray-700">
                                    <span className="text-purple-600 mr-2">✓</span>
                                    <span>Implemente pequenas mudanças gradativamente</span>
                                  </li>
                                  <li className="flex items-start text-gray-700">
                                    <span className="text-purple-600 mr-2">✓</span>
                                    <span>Estabeleça metas específicas e mensuráveis</span>
                                  </li>
                                  <li className="flex items-start text-gray-700">
                                    <span className="text-purple-600 mr-2">✓</span>
                                    <span>Busque orientação profissional para acelerar resultados</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Etapa de Resultado para Planilha */}
                        {template.type === 'planilha' && etapaPreview === 1 && (
                          <div className="bg-white rounded-lg p-6 border-2 border-teal-200">
                            <h4 className="font-semibold text-gray-900 mb-4">Conteúdo da Planilha</h4>
                            <div className="space-y-3">
                              {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item, idx) => (
                                <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                  <input type="checkbox" className="mr-3" disabled />
                                  <span className="text-gray-700">{item}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                              <p className="text-sm text-teal-800"><strong>Próximo Passo:</strong> Receba orientações personalizadas via WhatsApp</p>
                            </div>
                          </div>
                        )}

                        {/* Etapa de Diagnóstico Completo - Etapa 3 (todos os diagnósticos possíveis) */}
                        {template.type === 'calculadora' && etapaPreview === 3 && (
                          <div className="space-y-6">
                            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Calculadora</h4>
                            
                            {template.id === 'hidratacao' || template.name?.toLowerCase().includes('água') || template.name?.toLowerCase().includes('agua') ? (
                              // Todos os diagnósticos possíveis para Calculadora de Água
                              <>
                                {/* Resultado 1: Baixa Hidratação */}
                                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-red-900">💧 Baixa Hidratação</h5>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 2L/dia</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.nutri.baixaHidratacao.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.baixaHidratacao.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 2: Hidratação Moderada */}
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-yellow-900">⚖️ Hidratação Moderada</h5>
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">2-3L/dia</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.hidratacaoModerada.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 3: Alta Hidratação */}
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-green-900">🚀 Alta Hidratação</h5>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&gt; 3L/dia</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.alimentacao}</p>
                                    {calculadoraAguaDiagnosticos.nutri.altaHidratacao.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraAguaDiagnosticos.nutri.altaHidratacao.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : template.id === 'imc' || template.name?.toLowerCase().includes('imc') ? (
                              // Todos os diagnósticos possíveis para Calculadora de IMC
                              <>
                                {/* Resultado 1: Baixo Peso */}
                                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-blue-900">📉 Baixo Peso</h5>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 18.5</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.nutri.baixoPeso.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.baixoPeso.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.nutri.baixoPeso.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.baixoPeso.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 2: Peso Normal */}
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-green-900">⚖️ Peso Normal</h5>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">18.5 - 24.9</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.nutri.pesoNormal.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.pesoNormal.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.nutri.pesoNormal.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.pesoNormal.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 3: Sobrepeso */}
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-yellow-900">📈 Sobrepeso</h5>
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">25.0 - 29.9</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.nutri.sobrepeso.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.sobrepeso.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.nutri.sobrepeso.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.sobrepeso.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 4: Obesidade */}
                                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-red-900">⚠️ Obesidade</h5>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">≥ 30.0</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraImcDiagnosticos.nutri.obesidade.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraImcDiagnosticos.nutri.obesidade.alimentacao}</p>
                                    {calculadoraImcDiagnosticos.nutri.obesidade.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraImcDiagnosticos.nutri.obesidade.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : template.id === 'calorias' || template.name?.toLowerCase().includes('caloria') ? (
                              // Todos os diagnósticos possíveis para Calculadora de Calorias
                              <>
                                {/* Resultado 1: Déficit Calórico */}
                                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-blue-900">🔥 Déficit Calórico</h5>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Perda de peso</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.deficitCalorico.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 2: Manutenção Calórica */}
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-green-900">⚖️ Manutenção Calórica</h5>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Peso estável</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.manutencaoCalorica.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 3: Superávit Calórico */}
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-yellow-900">🚀 Superávit Calórico</h5>
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">Ganho de peso</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.alimentacao}</p>
                                    {calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraCaloriasDiagnosticos.nutri.superavitCalorico.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : template.id === 'proteina' || template.name?.toLowerCase().includes('proteína') || template.name?.toLowerCase().includes('proteina') ? (
                              // Todos os diagnósticos possíveis para Calculadora de Proteína
                              <>
                                {/* Resultado 1: Baixa Proteína */}
                                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-red-900">📉 Baixa Proteína</h5>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&lt; 1.0g/kg</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.nutri.baixaProteina.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.baixaProteina.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 2: Proteína Normal */}
                                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-green-900">⚖️ Proteína Normal</h5>
                                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">1.0 - 1.6g/kg</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.nutri.proteinaNormal.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.proteinaNormal.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Resultado 3: Alta Proteína */}
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
                                  <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-lg font-bold text-yellow-900">📈 Alta Proteína</h5>
                                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">&gt; 1.6g/kg</span>
                                  </div>
                                  <div className="bg-white rounded-lg p-4 space-y-2">
                                    <p className="font-semibold text-gray-900">{calculadoraProteinaDiagnosticos.nutri.altaProteina.diagnostico}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.causaRaiz}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.acaoImediata}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.plano7Dias}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.suplementacao}</p>
                                    <p className="text-gray-700">{calculadoraProteinaDiagnosticos.nutri.altaProteina.alimentacao}</p>
                                    {calculadoraProteinaDiagnosticos.nutri.altaProteina.proximoPasso && (
                                      <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{calculadoraProteinaDiagnosticos.nutri.altaProteina.proximoPasso}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </div>
                        )}

                        {/* Etapa de CTA (apenas para quizzes) */}
                        {template.type === 'quiz' && etapaPreview === 5 && (
                          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border-2 border-teal-200">
                            <div className="text-center">
                              <p className="text-gray-700 font-medium mb-4">
                                💬 Quer orientações personalizadas para alcançar seu objetivo?
                              </p>
                              <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg">
                                📱 Falar no WhatsApp
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Planilha: Etapa de Conteúdo */}
                        {template.type === 'planilha' && etapaPreview === 1 && (
                          <div className="bg-white rounded-lg p-6 border-2 border-teal-200">
                            <h4 className="font-semibold text-gray-900 mb-4">Conteúdo da Planilha</h4>
                            <div className="space-y-3">
                              {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item, idx) => (
                                <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                  <input type="checkbox" className="mr-3" disabled />
                                  <span className="text-gray-700">{item}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                              <p className="text-sm text-teal-800"><strong>Próximo Passo:</strong> Receba orientações personalizadas via WhatsApp</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Navegação por Etapas */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setEtapaPreview(Math.max(0, etapaPreview - 1))}
                          disabled={etapaPreview === 0}
                          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ← Anterior
                        </button>

                        <div className="flex space-x-2">
                          {Array.from({ length: totalEtapas }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setEtapaPreview(i)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                etapaPreview === i
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={etapasLabels[i]}
                            >
                              {etapasLabels[i]}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setEtapaPreview(Math.min(totalEtapas - 1, etapaPreview + 1))}
                          disabled={etapaPreview === totalEtapas - 1}
                          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Próxima →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer do Modal */}
                  <div className="bg-gray-50 p-6 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={() => {
                        setTemplatePreviewAberto(null)
                        setEtapaPreview(0)
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 text-center py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Fechar
                    </button>
                    <Link
                      href={template.link}
                      onClick={() => {
                        setTemplatePreviewAberto(null)
                        setEtapaPreview(0)
                      }}
                      className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      Criar Meu Link
                    </Link>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
