'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calculator, Target, Heart, Droplets, Activity, Sparkles, FileText, Brain } from 'lucide-react'

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
  const [templates, setTemplates] = useState<Template[]>([
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
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('todas')

  const categories = ['todas', ...new Set(templates.map(t => t.category))]
  const filteredTemplates = selectedCategory === 'todas' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

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
                    src="/logos/ylada-logo-horizontal-vazado.png"
                    alt="YLADA"
                    width={120}
                    height={40}
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

        {/* Filtros */}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
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
                  <Link
                    href={template.link}
                    className="flex-1 bg-teal-600 text-white text-center py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Testar Demo
                  </Link>
                  <Link
                    href={template.link}
                    className="flex-1 bg-white border-2 border-teal-600 text-teal-600 text-center py-2.5 rounded-lg hover:bg-teal-50 transition-colors font-medium"
                  >
                    Começar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

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
                <li>• <strong>Testar Demo:</strong> Veja como funciona antes de usar</li>
                <li>• <strong>Começar:</strong> Crie seu link personalizado</li>
                <li>• <strong>Compartilhar:</strong> Envie para seus clientes via WhatsApp, email ou redes sociais</li>
                <li>• <strong>Coletar Leads:</strong> Receba os resultados diretamente no seu dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

