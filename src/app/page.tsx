'use client'

import { useState } from 'react'
import { Calculator, BookOpen, Users, Globe, Zap, Heart, Brain, Shield } from 'lucide-react'

export default function Home() {
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('pt')

  const features = [
    {
      icon: Calculator,
      title: 'Calculadoras',
      description: 'IMC, massa magra, proteína diária',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: 'Tabelas Nutricionais',
      description: 'Proteínas, vitaminas, minerais',
      color: 'bg-green-500'
    },
    {
      icon: Zap,
      title: 'Suplementos',
      description: 'Guia educativo completo',
      color: 'bg-yellow-500'
    },
    {
      icon: Heart,
      title: 'Saúde',
      description: 'Dicas e orientações',
      color: 'bg-red-500'
    },
    {
      icon: Brain,
      title: 'Educação',
      description: 'Artigos e vídeos',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Troque experiências',
      color: 'bg-indigo-500'
    }
  ]

  const languages = {
    pt: {
      title: 'GLIVA',
      subtitle: 'Seu Guia de Suplementos',
      description: 'App educativo sobre suplementos, vitaminas e nutrição',
      getStarted: 'Começar',
      features: 'Funcionalidades',
      about: 'Sobre',
      contact: 'Contato'
    },
    en: {
      title: 'GLIVA',
      subtitle: 'Your Supplement Guide',
      description: 'Educational app about supplements, vitamins and nutrition',
      getStarted: 'Get Started',
      features: 'Features',
      about: 'About',
      contact: 'Contact'
    },
    es: {
      title: 'GLIVA',
      subtitle: 'Tu Guía de Suplementos',
      description: 'App educativo sobre suplementos, vitaminas y nutrición',
      getStarted: 'Comenzar',
      features: 'Características',
      about: 'Acerca de',
      contact: 'Contacto'
    }
  }

  const t = languages[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('pt')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  language === 'pt' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                PT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  language === 'en' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  language === 'es' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/calculators" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors text-center">
              {t.getStarted}
            </a>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              {t.features}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t.features}
            </h3>
            <p className="text-lg text-gray-600">
              Tudo que você precisa para entender suplementos e nutrição
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const isCalculator = feature.title === 'Calculadoras'
              const Component = isCalculator ? 'a' : 'div'
              const props = isCalculator ? { href: '/calculators' } : {}
              
              return (
                <Component
                  key={index}
                  {...props}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Component>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Baixe o app e tenha acesso a todo o conteúdo educativo
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Baixar App
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <span className="text-xl font-bold">GLIVA</span>
              </div>
              <p className="text-gray-400">
                Seu guia educativo de suplementos e nutrição
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.about}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.features}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.contact}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Idiomas</h4>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">PT</button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm">EN</button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm">ES</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GLIVA. Todos os direitos reservados.</p>
            <p className="mt-2 text-sm">
              Este app é apenas para fins educativos. Consulte sempre um profissional de saúde.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}