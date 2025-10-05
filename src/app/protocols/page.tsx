'use client'

import { useState } from 'react'
import { CheckCircle, Lock, Download, Star, ArrowRight, Shield, Zap, Heart } from 'lucide-react'
import Link from 'next/link'

export default function ProtocolsPage() {
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null)

  const protocols = [
    {
      id: 'muscle_protection',
      name: 'Protocolo de Proteção Muscular',
      description: 'Previne perda de massa magra durante o emagrecimento com canetas, comprimidos e inibidores de apetite',
      icon: Shield,
      color: 'bg-green-500',
      price: 9.90,
      purchased: true,
      features: [
        'Cálculos personalizados de proteína',
        'Guia de treino de força',
        'Protocolos de recuperação',
        'Estratégias de preservação muscular',
        'Ferramentas de acompanhamento'
      ],
      content: {
        overview: 'Este protocolo foi desenvolvido especificamente para prevenir a perda de massa magra durante o uso de medicamentos para emagrecimento.',
        proteinTarget: '1.5-2.0g por kg de peso corporal',
        timing: 'Distribuir proteína uniformemente ao longo do dia',
        supplements: ['Whey Protein', 'Creatina', 'BCAA', 'Beta-Alanina', 'Zinco + Magnésio'],
        exercises: ['Treino de força 3-4x/semana', 'HIIT 2x/semana', 'Timing proteico ao redor dos treinos', 'Descanso e recuperação adequados']
      }
    },
    {
      id: 'digestive_health',
      name: 'Digestive Health Protocol',
      description: 'Support healthy digestion and gut function with fiber, probiotics, and digestive enzymes',
      icon: Heart,
      color: 'bg-red-500',
      price: 9.90,
      purchased: false,
      features: [
        'Fiber optimization guide',
        'Probiotic recommendations',
        'Digestive enzyme support',
        'Gut health protocols',
        'Digestive symptom tracking'
      ]
    },
    {
      id: 'energy_immunity',
      name: 'Energy & Immunity Protocol',
      description: 'Boost energy levels and support immune function with targeted vitamins and minerals',
      icon: Zap,
      color: 'bg-yellow-500',
      price: 9.90,
      purchased: false,
      features: [
        'Vitamin D optimization',
        'B-complex recommendations',
        'Iron status support',
        'Energy boosting strategies',
        'Immune system protocols'
      ]
    }
  ]

  const handlePurchase = async (protocolId: string) => {
    // In a real app, this would integrate with Stripe
    alert(`Purchase ${protocolId} - Integration with Stripe coming soon!`)
  }

  const handleDownloadProtocol = (protocolId: string) => {
    // In a real app, this would generate and download a PDF
    alert(`Downloading ${protocolId} protocol...`)
  }

  if (activeProtocol) {
    const protocol = protocols.find(p => p.id === activeProtocol)
    if (!protocol) return null

    const IconComponent = protocol.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <button
                onClick={() => setActiveProtocol(null)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-6 h-6 text-gray-600 rotate-180" />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${protocol.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{protocol.name}</h1>
                  <p className="text-sm text-gray-600">Detailed protocol guide</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Protocol Overview */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Protocol Overview</h2>
            <p className="text-gray-600 mb-6">{protocol.content?.overview}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Protein Target</h3>
                <p className="text-2xl font-bold text-blue-600">{protocol.content?.proteinTarget}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Timing</h3>
                <p className="text-gray-700">{protocol.content?.timing}</p>
              </div>
            </div>
          </div>

          {/* Supplements */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Supplements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {protocol.content?.supplements.map((supplement, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{supplement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Guidelines */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercise Guidelines</h2>
            <div className="space-y-4">
              {protocol.content?.exercises.map((exercise, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{exercise}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center">
            <button
              onClick={() => handleDownloadProtocol(protocol.id)}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Full Protocol
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowRight className="w-6 h-6 text-gray-600 rotate-180" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Protocols</h1>
                <p className="text-sm text-gray-600">Access your purchased protocols</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to YLARA Protocols
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Access your personalized protocols designed specifically for nutrition professionals
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Evidence-based recommendations</span>
            <span>•</span>
            <span>Personalized for your needs</span>
            <span>•</span>
            <span>Updated regularly</span>
          </div>
          
          {/* Quiz Integration */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              🎯 Não sabe qual protocolo escolher?
            </h3>
            <p className="text-gray-600 mb-4">
              Faça nossa avaliação personalizada e descubra exatamente quais protocolos são ideais para você
            </p>
            <Link 
              href="/quiz"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Fazer Avaliação Personalizada
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Protocols Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {protocols.map((protocol) => {
            const IconComponent = protocol.icon
            return (
              <div key={protocol.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 ${protocol.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  {protocol.purchased ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Owned</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <Lock className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Locked</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {protocol.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {protocol.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Includes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {protocol.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                    {protocol.features.length > 3 && (
                      <li className="text-gray-500">
                        +{protocol.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    ${protocol.price}
                  </span>
                  
                  {protocol.purchased ? (
                    <button
                      onClick={() => setActiveProtocol(protocol.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      View Protocol
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(protocol.id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Purchase
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bundle Offer */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Complete Bundle
          </h3>
          <p className="text-blue-100 mb-6">
            Get all protocols plus future updates for just $7.90/month
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold">$7.90<span className="text-lg font-normal">/month</span></p>
              <p className="text-blue-100 text-sm">Cancel anytime</p>
            </div>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Upgrade to Bundle
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
