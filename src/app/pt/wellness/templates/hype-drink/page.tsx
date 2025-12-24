'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Activity, TrendingUp, Coffee, Calculator, Brain, Target, Clock } from 'lucide-react'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

interface HypeTemplate {
  id: string
  name: string
  description: string
  icon: any
  type: 'quiz' | 'calculadora'
  link: string
  color: string
  badge?: string
}

export default function HypeDrinkTemplatesPage() {
  const templates: HypeTemplate[] = [
    {
      id: 'energia-foco',
      name: 'Quiz: Energia & Foco',
      description: 'Descubra como melhorar sua energia e foco ao longo do dia',
      icon: Zap,
      type: 'quiz',
      link: '/pt/wellness/templates/hype-drink/energia-foco',
      color: 'bg-yellow-500',
      badge: 'Principal'
    },
    {
      id: 'pre-treino',
      name: 'Quiz: Pré-Treino Ideal',
      description: 'Identifique o pré-treino ideal para você',
      icon: Activity,
      type: 'quiz',
      link: '/pt/wellness/templates/hype-drink/pre-treino',
      color: 'bg-orange-500'
    },
    {
      id: 'rotina-produtiva',
      name: 'Quiz: Rotina Produtiva',
      description: 'Descubra como melhorar sua produtividade e constância',
      icon: TrendingUp,
      type: 'quiz',
      link: '/pt/wellness/templates/hype-drink/rotina-produtiva',
      color: 'bg-green-500'
    },
    {
      id: 'constancia',
      name: 'Quiz: Constância & Rotina',
      description: 'Identifique como manter uma rotina saudável todos os dias',
      icon: Target,
      type: 'quiz',
      link: '/pt/wellness/templates/hype-drink/constancia',
      color: 'bg-blue-500'
    },
    {
      id: 'consumo-cafeina',
      name: 'Calculadora: Consumo de Cafeína',
      description: 'Calcule seu consumo de cafeína e identifique alternativas',
      icon: Coffee,
      type: 'calculadora',
      link: '/pt/wellness/templates/hype-drink/consumo-cafeina',
      color: 'bg-amber-500'
    },
    {
      id: 'custo-energia',
      name: 'Calculadora: Custo da Falta de Energia',
      description: 'Calcule o impacto da falta de energia na sua produtividade',
      icon: Calculator,
      type: 'calculadora',
      link: '/pt/wellness/templates/hype-drink/custo-energia',
      color: 'bg-red-500'
    }
  ]

  const [selectedType, setSelectedType] = useState<'todos' | 'quiz' | 'calculadora'>('todos')

  const templatesFiltrados = selectedType === 'todos' 
    ? templates 
    : templates.filter(t => t.type === selectedType)

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <WellnessNavBar showTitle={true} title="Hype Drink - Templates" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🥤 Hype Drink
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
            Templates focados em vender Hype Drink através de diagnósticos de energia, foco e performance
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Bebida funcional com cafeína natural, vitaminas do complexo B e hidratação para apoiar energia e foco no dia a dia
          </p>
        </div>

        {/* Filtros */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedType('todos')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedType === 'todos'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos ({templates.length})
          </button>
          <button
            onClick={() => setSelectedType('quiz')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedType === 'quiz'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Quizzes ({templates.filter(t => t.type === 'quiz').length})
          </button>
          <button
            onClick={() => setSelectedType('calculadora')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedType === 'calculadora'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Calculadoras ({templates.filter(t => t.type === 'calculadora').length})
          </button>
        </div>

        {/* Grid de Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesFiltrados.map((template) => {
            const Icon = template.icon
            return (
              <Link
                key={template.id}
                href={template.link}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${template.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {template.badge && (
                    <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                      {template.badge}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  {template.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    template.type === 'quiz' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {template.type === 'quiz' ? 'Quiz' : 'Calculadora'}
                  </span>
                  <span className="text-yellow-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Ver template →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">💡 Sobre o Hype Drink</h3>
          <p className="text-gray-700 mb-4">
            O Hype Drink é uma bebida funcional desenvolvida para apoiar energia, foco e hidratação. 
            Ele combina cafeína natural (chá verde e preto), vitaminas do complexo B e hidratação em uma solução prática para o dia a dia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">⚡ Energia Estável</h4>
              <p className="text-sm text-gray-600">Apoia energia sem picos e quedas bruscas</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">🧠 Foco Mental</h4>
              <p className="text-sm text-gray-600">Ajuda na clareza mental e produtividade</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">💧 Hidratação</h4>
              <p className="text-sm text-gray-600">Mantém o corpo hidratado durante o dia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

