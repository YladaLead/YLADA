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
  const [selectedObjective, setSelectedObjective] = useState('todos')
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
      objective: 'attract-contacts',
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
      objective: 'attract-contacts',
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
      objective: 'attract-contacts',
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
      objective: 'convert-sales',
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
      objective: 'convert-sales',
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
      objective: 'attract-contacts',
      title: { pt: 'Suas Necessidades Calóricas', en: 'Your Caloric Needs', es: 'Tus Necesidades Calóricas' },
      usage_count: 567
    },
    {
      id: '7',
      name: { pt: 'Quiz: Qual seu Estilo de Vida?', en: 'Quiz: What\'s Your Lifestyle?', es: 'Quiz: ¿Cuál es tu Estilo de Vida?' },
      description: { pt: 'Descubra o estilo de vida ideal para seus objetivos de saúde', en: 'Discover the ideal lifestyle for your health goals', es: 'Descubre el estilo de vida ideal para tus objetivos de salud' },
      type: 'quiz',
      profession: 'todos',
      specialization: 'todos',
      language: 'pt',
      country: 'BR',
      objective: 'engage-clients',
      title: { pt: 'Seu Estilo de Vida Ideal', en: 'Your Ideal Lifestyle', es: 'Tu Estilo de Vida Ideal' },
      usage_count: 234
    },
    {
      id: '8',
      name: { pt: 'Guia Completo de Suplementação', en: 'Complete Supplementation Guide', es: 'Guía Completa de Suplementación' },
      description: { pt: 'E-book educativo sobre suplementação inteligente', en: 'Educational e-book on smart supplementation', es: 'E-book educativo sobre suplementación inteligente' },
      type: 'ebook',
      profession: 'todos',
      specialization: 'todos',
      language: 'pt',
      country: 'BR',
      objective: 'generate-authority',
      title: { pt: 'Suplementação Inteligente', en: 'Smart Supplementation', es: 'Suplementación Inteligente' },
      usage_count: 189
    }
  ]

  useEffect(() => {
    setTemplates(mockTemplates)
  }, [])

  // Filtrar templates baseado nos filtros selecionados
  const filteredTemplates = templates.filter(template => {
    const professionMatch = selectedProfession === 'todos' || template.profession === selectedProfession || template.profession === 'todos'
    const objectiveMatch = selectedObjective === 'todos' || template.objective === selectedObjective
    const languageMatch = template.language === selectedLanguage
    
    return professionMatch && objectiveMatch && languageMatch
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

  const getObjectiveLabel = (objective: string) => {
    const labels = {
      todos: { pt: 'Todos os Objetivos', en: 'All Objectives', es: 'Todos los Objetivos' },
      'attract-contacts': { pt: 'Atrair Novos Contatos', en: 'Attract New Contacts', es: 'Atraer Nuevos Contactos' },
      'convert-sales': { pt: 'Converter em Vendas', en: 'Convert to Sales', es: 'Convertir en Ventas' },
      'engage-clients': { pt: 'Fidelizar e Engajar Clientes', en: 'Retain and Engage Clients', es: 'Fidelizar y Comprometer Clientes' },
      'generate-authority': { pt: 'Gerar Valor e Autoridade', en: 'Generate Value and Authority', es: 'Generar Valor y Autoridad' }
    }
    return labels[objective as keyof typeof labels]?.[selectedLanguage as keyof typeof labels.todos] || objective
  }

  const getObjectiveIcon = (objective: string) => {
    const icons = {
      'attract-contacts': '🎯',
      'convert-sales': '💰',
      'engage-clients': '🤝',
      'generate-authority': '📚'
    }
    return icons[objective as keyof typeof icons] || '📄'
  }

  const getObjectiveColor = (objective: string) => {
    const colors = {
      'attract-contacts': 'from-green-500 to-green-600',
      'convert-sales': 'from-blue-500 to-blue-600',
      'engage-clients': 'from-purple-500 to-purple-600',
      'generate-authority': 'from-yellow-500 to-yellow-600'
    }
    return colors[objective as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-12 sm:h-16 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center max-w-6xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Templates que{' '}
            <span className="text-blue-600">
              Servem Antes de Vender
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cada template foi criado para agregar valor real ao seu cliente, 
            gerando gratidão e aumentando suas conversões em até{' '}
            <span className="text-blue-600 font-bold">340%</span>.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Filtros Inteligentes</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            
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
                <option value="todos">Todos os Profissionais</option>
                <option value="nutricionista">Nutricionistas</option>
                <option value="distribuidor_suplementos">Distribuidores</option>
                <option value="vendedor_nutraceuticos">Vendedores</option>
              </select>
            </div>

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
                <option value="todos">Todos os Objetivos</option>
                <option value="attract-contacts">Atrair Novos Contatos</option>
                <option value="convert-sales">Converter em Vendas</option>
                <option value="engage-clients">Fidelizar e Engajar Clientes</option>
                <option value="generate-authority">Gerar Valor e Autoridade</option>
              </select>
            </div>

            {/* Filtro por Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pt">🇧🇷 Português</option>
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </div>
          </div>
          
          {/* Resultados do Filtro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Mostrando <span className="text-blue-600 font-bold">{filteredTemplates.length}</span> templates para{' '}
              <span className="text-blue-600 font-bold">{getProfessionLabel(selectedProfession)}</span> -{' '}
              <span className="text-blue-600 font-bold">{getObjectiveLabel(selectedObjective)}</span>
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 group">
              <div className={`w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform`}>
                <span className="text-xl">{getObjectiveIcon(template.objective)}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                {template.name[selectedLanguage] || template.name.pt}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {template.description[selectedLanguage] || template.description.pt}
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                  {getProfessionLabel(template.profession)}
                </span>
                <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
                  {getObjectiveLabel(template.objective)}
                </span>
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                  {template.usage_count.toLocaleString()} usos
                </span>
              </div>

              <Link 
                href={`/template/${template.id}`}
                className={`w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300`}
              >
                Ver Template
              </Link>
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
                setSelectedProfession('todos')
                setSelectedObjective('todos')
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
              Servir Antes de Vender
            </span>?
          </h2>
          <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto">
            Comece a usar templates que realmente agregam valor aos seus clientes 
            e aumentam suas conversões em até 340%.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              <span className="mr-2 text-lg">🚀</span>
              Começar Agora
            </Link>
            <Link 
              href="/curso"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 text-base font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              <span className="mr-2 text-lg">📚</span>
              Aprender a Filosofia
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
              Templates que servem antes de vender
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