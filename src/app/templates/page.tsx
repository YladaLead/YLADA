'use client'

import { useState, useEffect } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

interface Template {
  id: string
  name: Record<string, string>
  description: Record<string, string>
  type: string
  profession: string
  specialization: string
  language: string
  country: string
  objective: string
  title: Record<string, string>
  usage_count: number
}

export default function TemplatesPage() {
  const [selectedProfession, setSelectedProfession] = useState('todos')
  const [selectedType, setSelectedType] = useState('todos')
  const [selectedLanguage, setSelectedLanguage] = useState('pt')
  const [templates, setTemplates] = useState<Template[]>([])

  // Templates mockados (depois virá do Supabase)
  const mockTemplates: Template[] = [
    {
      id: '1',
      name: { pt: 'Quiz Diagnóstico Nutricional', en: 'Nutritional Diagnostic Quiz', es: 'Cuestionario Diagnóstico Nutricional' },
      description: { pt: 'Descubra o perfil nutricional ideal através de perguntas estratégicas', en: 'Discover your ideal nutritional profile through strategic questions', es: 'Descubre tu perfil nutricional ideal a través de preguntas estratégicas' },
      type: 'quiz',
      profession: 'todos',
      specialization: 'todos',
      language: 'pt',
      country: 'BR',
      objective: 'capturar-leads',
      title: { pt: 'Descubra seu Perfil Nutricional Ideal', en: 'Discover Your Ideal Nutritional Profile', es: 'Descubre tu Perfil Nutricional Ideal' },
      usage_count: 1247
    },
    {
      id: '2',
      name: { pt: 'Calculadora IMC Avançada', en: 'Advanced BMI Calculator', es: 'Calculadora IMC Avanzada' },
      description: { pt: 'Calcule seu IMC e receba recomendações personalizadas', en: 'Calculate your BMI and get personalized recommendations', es: 'Calcula tu IMC y recibe recomendaciones personalizadas' },
      type: 'calculadora',
      profession: 'todos',
      specialization: 'todos',
      language: 'pt',
      country: 'BR',
      objective: 'capturar-leads',
      title: { pt: 'Calcule seu IMC e Peso Ideal', en: 'Calculate Your BMI and Ideal Weight', es: 'Calcula tu IMC y Peso Ideal' },
      usage_count: 892
    },
    {
      id: '3',
      name: { pt: 'Planilha Dieta Personalizada', en: 'Personalized Diet Plan', es: 'Plan de Dieta Personalizado' },
      description: { pt: 'Cardápio semanal completo baseado no seu perfil nutricional', en: 'Complete weekly menu based on your nutritional profile', es: 'Menú semanal completo basado en tu perfil nutricional' },
      type: 'planilha',
      profession: 'nutricionista',
      specialization: 'todos',
      language: 'pt',
      country: 'BR',
      objective: 'capturar-leads',
      title: { pt: 'Sua Dieta Personalizada', en: 'Your Personalized Diet', es: 'Tu Dieta Personalizada' },
      usage_count: 634
    },
    {
      id: '4',
      name: { pt: 'Catálogo Suplementos Interativo', en: 'Interactive Supplements Catalog', es: 'Catálogo Interactivo de Suplementos' },
      description: { pt: 'Descubra os suplementos ideais para seus objetivos', en: 'Discover the ideal supplements for your goals', es: 'Descubre los suplementos ideales para tus objetivos' },
      type: 'catalogo',
      profession: 'distribuidor_suplementos',
      specialization: 'todos',
      language: 'pt',
      country: 'BR',
      objective: 'vender-suplementos',
      title: { pt: 'Seus Suplementos Ideais', en: 'Your Ideal Supplements', es: 'Tus Suplementos Ideales' },
      usage_count: 445
    },
    {
      id: '5',
      name: { pt: 'Quiz: Qual Suplemento Ideal?', en: 'Quiz: Which Supplement is Right?', es: 'Quiz: ¿Cuál Suplemento Ideal?' },
      description: { pt: 'Descubra quais suplementos são ideais para seus objetivos', en: 'Discover which supplements are ideal for your goals', es: 'Descubre qué suplementos son ideales para tus objetivos' },
      type: 'quiz',
      profession: 'vendedor_nutraceuticos',
      specialization: 'todos',
      language: 'pt',
      country: 'BR',
      objective: 'vender-suplementos',
      title: { pt: 'Descubra Seus Suplementos Ideais', en: 'Discover Your Ideal Supplements', es: 'Descubre tus Suplementos Ideales' },
      usage_count: 321
    },
    {
      id: '6',
      name: { pt: 'Calculadora Calorias Diárias', en: 'Daily Calories Calculator', es: 'Calculadora Calorías Diarias' },
      description: { pt: 'Calcule suas necessidades calóricas diárias', en: 'Calculate your daily caloric needs', es: 'Calcula tus necesidades calóricas diarias' },
      type: 'calculadora',
      profession: 'todos',
      specialization: 'todos',
      language: 'pt',
      country: 'BR',
      objective: 'capturar-leads',
      title: { pt: 'Suas Necessidades Calóricas', en: 'Your Caloric Needs', es: 'Tus Necesidades Calóricas' },
      usage_count: 567
    }
  ]

  useEffect(() => {
    setTemplates(mockTemplates)
  }, [])

  // Filtrar templates baseado nos filtros selecionados
  const filteredTemplates = templates.filter(template => {
    const professionMatch = selectedProfession === 'todos' || template.profession === selectedProfession || template.profession === 'todos'
    const typeMatch = selectedType === 'todos' || template.type === selectedType
    const languageMatch = template.language === selectedLanguage
    
    return professionMatch && typeMatch && languageMatch
  })

  const getProfessionLabel = (profession: string) => {
    const labels = {
      todos: { pt: 'Todos os Profissionais', en: 'All Professionals', es: 'Todos los Profesionales' },
      nutricionista: { pt: 'Nutricionistas', en: 'Nutritionists', es: 'Nutricionistas' },
      distribuidor_suplementos: { pt: 'Distribuidores', en: 'Distributors', es: 'Distribuidores' },
      vendedor_nutraceuticos: { pt: 'Vendedores', en: 'Sellers', es: 'Vendedores' }
    }
    return labels[profession as keyof typeof labels]?.[selectedLanguage as keyof typeof labels.todos] || profession
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      todos: { pt: 'Todos os Tipos', en: 'All Types', es: 'Todos los Tipos' },
      quiz: { pt: 'Quizzes', en: 'Quizzes', es: 'Cuestionarios' },
      calculadora: { pt: 'Calculadoras', en: 'Calculators', es: 'Calculadoras' },
      planilha: { pt: 'Planilhas', en: 'Spreadsheets', es: 'Hojas de Cálculo' },
      catalogo: { pt: 'Catálogos', en: 'Catalogs', es: 'Catálogos' }
    }
    return labels[type as keyof typeof labels]?.[selectedLanguage as keyof typeof labels.todos] || type
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      quiz: '🧠',
      calculadora: '📊',
      planilha: '📋',
      catalogo: '💊'
    }
    return icons[type as keyof typeof icons] || '📄'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      quiz: 'from-green-500 to-green-600',
      calculadora: 'from-blue-500 to-blue-600',
      planilha: 'from-yellow-500 to-yellow-600',
      catalogo: 'from-purple-500 to-purple-600'
    }
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-300 bg-white/95 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <Link href="/">
            <YLADALogo size="xl" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center max-w-6xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Templates que{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Servem Antes de Vender
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Cada template foi criado para agregar valor real ao seu cliente, 
            gerando gratidão e aumentando suas conversões em até{' '}
            <span className="text-yellow-400 font-bold">340%</span>.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-12 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Filtros Inteligentes</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            
            {/* Filtro por Profissão */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profissão
              </label>
              <select
                value={selectedProfession}
                onChange={(e) => setSelectedProfession(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos os Profissionais</option>
                <option value="nutricionista">Nutricionistas</option>
                <option value="distribuidor_suplementos">Distribuidores</option>
                <option value="vendedor_nutraceuticos">Vendedores</option>
              </select>
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Template
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="quiz">Quizzes</option>
                <option value="calculadora">Calculadoras</option>
                <option value="planilha">Planilhas</option>
                <option value="catalogo">Catálogos</option>
              </select>
            </div>

            {/* Filtro por Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Idioma
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="pt">🇧🇷 Português</option>
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </div>
          </div>
          
          {/* Resultados do Filtro */}
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Mostrando <span className="text-green-400 font-bold">{filteredTemplates.length}</span> templates para{' '}
              <span className="text-blue-400 font-bold">{getProfessionLabel(selectedProfession)}</span> -{' '}
              <span className="text-yellow-400 font-bold">{getTypeLabel(selectedType)}</span>
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-green-500 group">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${getTypeColor(template.type)} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl sm:text-3xl">{getTypeIcon(template.type)}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">
                {template.name[selectedLanguage] || template.name.pt}
              </h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                {template.description[selectedLanguage] || template.description.pt}
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                  {getProfessionLabel(template.profession)}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                  {getTypeLabel(template.type)}
                </span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                  {template.usage_count.toLocaleString()} usos
                </span>
              </div>

              <Link 
                href={`/template/${template.id}`}
                className={`w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r ${getTypeColor(template.type)} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300`}
              >
                Ver Template
              </Link>
            </div>
          ))}
        </div>

        {/* Mensagem quando não há resultados */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">Nenhum template encontrado</h3>
            <p className="text-gray-300 mb-6">
              Tente ajustar os filtros para encontrar templates que atendam suas necessidades.
            </p>
            <button
              onClick={() => {
                setSelectedProfession('todos')
                setSelectedType('todos')
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-gray-800 rounded-3xl p-8 sm:p-12 border border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Pronto para{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Servir Antes de Vender
            </span>?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Comece a usar templates que realmente agregam valor aos seus clientes 
            e aumentam suas conversões em até 340%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-3 text-xl">🚀</span>
              Começar Agora
            </Link>
            <Link 
              href="/curso"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-3 text-xl">📚</span>
              Aprender a Filosofia
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white/95 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="mb-6">
              <YLADALogo size="xl" />
            </div>
            <p className="text-gray-600 text-lg mb-4">
              Templates que servem antes de vender
            </p>
            <p className="text-gray-500">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}