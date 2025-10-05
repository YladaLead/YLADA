'use client'

import { useState } from 'react'
import { Calculator, Shield, Zap, Heart, Brain, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'

export default function Home() {
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('pt')

  const features = [
    {
      icon: Calculator,
      title: 'Calculadora de IMC',
      description: 'Análise corporal completa e personalizada',
      color: 'bg-emerald-500',
      href: '/calculators/bmi'
    },
    {
      icon: Shield,
      title: 'Necessidades Proteicas',
      description: 'Calcule suas necessidades diárias de proteína',
      color: 'bg-green-500',
      href: '/calculators/protein'
    },
    {
      icon: Zap,
      title: 'Composição Corporal',
      description: 'Avalie massa muscular e gordura corporal',
      color: 'bg-yellow-500',
      href: '/calculators/body-composition'
    },
    {
      icon: Heart,
      title: 'Planejador de Refeições',
      description: 'Cardápio personalizado e lista de compras',
      color: 'bg-red-500',
      href: '/calculators/meal-planner'
    },
    {
      icon: Brain,
      title: 'Monitor de Hidratação',
      description: 'Controle sua ingestão de água diária',
      color: 'bg-purple-500',
      href: '/calculators/hydration'
    },
    {
      icon: CheckCircle,
      title: 'Avaliação Nutricional',
      description: 'Identifique deficiências nutricionais',
      color: 'bg-indigo-500',
      href: '/calculators/nutrition-assessment'
    }
  ]

  const languages = {
    pt: {
      title: 'YLADA',
      subtitle: 'Your Lead Advanced Data Assistant',
      description: 'Ferramentas avançadas de geração de leads para profissionais de bem-estar e qualidade de vida',
      getStarted: 'Descobrir Meu Protocolo',
      features: 'Funcionalidades',
      about: 'Sobre',
      contact: 'Contato',
      heroTitle: 'Profissional de Bem-Estar?',
      heroSubtitle: 'Gere leads qualificados com ferramentas profissionais de avaliação de bem-estar e qualidade de vida',
      cta: 'Comece a gerar leads agora',
      risks: 'Ferramentas Disponíveis',
      benefits: 'Benefícios do YLADA'
    },
    en: {
      title: 'YLADA',
      subtitle: 'Your Lead Advanced Data Assistant',
      description: 'Advanced lead generation tools for wellness and quality of life professionals',
      getStarted: 'Discover My Protocol',
      features: 'Features',
      about: 'About',
      contact: 'Contact',
      heroTitle: 'Wellness Professional?',
      heroSubtitle: 'Generate qualified leads with professional wellness and quality of life assessment tools',
      cta: 'Start generating leads now',
      risks: 'Available Tools',
      benefits: 'YLADA Benefits'
    },
    es: {
      title: 'YLADA',
      subtitle: 'Your Lead Advanced Data Assistant',
      description: 'Herramientas avanzadas de generación de leads para profesionales de bienestar y calidad de vida',
      getStarted: 'Descubrir Mi Protocolo',
      features: 'Características',
      about: 'Acerca de',
      contact: 'Contacto',
      heroTitle: '¿Profesional de Bienestar?',
      heroSubtitle: 'Genera leads calificados con herramientas profesionales de evaluación de bienestar y calidad de vida',
      cta: 'Comienza a generar leads ahora',
      risks: 'Herramientas Disponibles',
      benefits: 'Beneficios de YLADA'
    }
  }

  const t = languages[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Y</span>
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
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                PT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  language === 'en' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  language === 'es' 
                    ? 'bg-emerald-600 text-white' 
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
            {t.heroTitle}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors text-center flex items-center justify-center">
              Acessar Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition-colors">
              Ver Ferramentas
            </button>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t.risks}
            </h3>
            <p className="text-lg text-gray-600">
              Ferramentas profissionais para capturar e converter leads qualificados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Calculadoras</h4>
              <p className="text-gray-600 text-sm">IMC, proteína, calorias e composição corporal</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Avaliações</h4>
              <p className="text-gray-600 text-sm">Quiz de bem-estar e identificação de necessidades</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Links Compartilháveis</h4>
              <p className="text-gray-600 text-sm">Links personalizados para cada profissional</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h4>
              <p className="text-gray-600 text-sm">Acompanhe leads e conversões em tempo real</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t.benefits}
            </h3>
            <p className="text-lg text-gray-600">
              Ferramentas profissionais para profissionais de bem-estar e distribuidores gerarem leads qualificados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Component = feature.href ? 'a' : 'div'
              const props = feature.href ? { href: feature.href } : {}
              
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
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para gerar mais leads?
          </h3>
          <p className="text-xl text-emerald-100 mb-8">
            Acesse ferramentas profissionais e comece a capturar leads qualificados hoje mesmo
          </p>
          <a href="/dashboard" className="px-8 py-4 bg-white text-emerald-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
            Acessar Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Y</span>
                </div>
                <span className="text-xl font-bold">YLADA</span>
              </div>
              <p className="text-gray-400">
                Ferramentas avançadas de geração de leads para profissionais de bem-estar e qualidade de vida
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
                <button className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm">PT</button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm">EN</button>
                <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md text-sm">ES</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 YLADA. Todos os direitos reservados.</p>
            <p className="mt-2 text-sm">
              Este app é apenas para fins educativos. Sempre consulte um profissional de saúde.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}