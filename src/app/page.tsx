'use client'

import { useState } from 'react'
import { Calculator, Shield, Zap, Heart, Brain, CheckCircle, ArrowRight, Users, TrendingUp, Star, ExternalLink } from 'lucide-react'

export default function Home() {
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('pt')

  const tools = [
    {
      icon: Calculator,
      title: 'Calculadora de IMC',
      description: 'Análise corporal completa com categorização e recomendações personalizadas',
      color: 'bg-emerald-500',
      href: '/calculators/bmi',
      category: 'Avaliação Corporal'
    },
    {
      icon: Shield,
      title: 'Necessidades de Proteína',
      description: 'Cálculo preciso baseado em diretrizes da OMS para diferentes objetivos',
      color: 'bg-green-500',
      href: '/calculators/protein',
      category: 'Nutrição'
    },
    {
      icon: Zap,
      title: 'Composição Corporal',
      description: 'Avaliação de massa muscular, gordura corporal, BMR e TDEE',
      color: 'bg-yellow-500',
      href: '/calculators/body-composition',
      category: 'Avaliação Corporal'
    },
    {
      icon: Heart,
      title: 'Planejador de Refeições',
      description: 'Cardápio personalizado com distribuição calórica e lista de compras',
      color: 'bg-red-500',
      href: '/calculators/meal-planner',
      category: 'Nutrição'
    },
    {
      icon: Brain,
      title: 'Monitor de Hidratação',
      description: 'Controle de ingestão hídrica baseado em atividade e clima',
      color: 'bg-purple-500',
      href: '/calculators/hydration',
      category: 'Saúde'
    },
    {
      icon: CheckCircle,
      title: 'Avaliação Nutricional',
      description: 'Identificação de deficiências e recomendações de suplementos',
      color: 'bg-indigo-500',
      href: '/calculators/nutrition-assessment',
      category: 'Saúde'
    }
  ]

  const benefits = [
    {
      icon: Users,
      title: 'Geração de Leads Qualificados',
      description: 'Capture dados de clientes interessados em melhorar sua saúde e bem-estar',
      color: 'text-emerald-600'
    },
    {
      icon: TrendingUp,
      title: 'Aumento de Conversões',
      description: 'Ferramentas profissionais aumentam a confiança e conversão de leads',
      color: 'text-green-600'
    },
    {
      icon: Star,
      title: 'Credibilidade Profissional',
      description: 'Demonstre expertise com ferramentas baseadas em diretrizes da OMS',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Dados Seguros',
      description: 'Sistema seguro para captura e armazenamento de informações dos clientes',
      color: 'text-purple-600'
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
      heroTitle: 'Profissional de Saúde?',
      heroSubtitle: 'Gere leads qualificados com ferramentas profissionais de avaliação nutricional e de bem-estar',
      cta: 'Comece a gerar leads agora',
      toolsTitle: 'Ferramentas Profissionais Disponíveis',
      toolsSubtitle: 'Calculadoras baseadas em diretrizes da OMS para capturar leads qualificados',
      benefitsTitle: 'Por que escolher o YLADA?',
      benefitsSubtitle: 'Aumente sua credibilidade e gere mais leads com ferramentas profissionais',
      demoTitle: 'Veja como funciona',
      demoSubtitle: 'Teste nossas ferramentas e veja como seus clientes receberão os resultados',
      ctaTitle: 'Pronto para gerar mais leads?',
      ctaSubtitle: 'Acesse ferramentas profissionais e comece a capturar leads qualificados hoje mesmo'
    },
    en: {
      title: 'YLADA',
      subtitle: 'Your Lead Advanced Data Assistant',
      description: 'Advanced lead generation tools for wellness and quality of life professionals',
      getStarted: 'Discover My Protocol',
      features: 'Features',
      about: 'About',
      contact: 'Contact',
      heroTitle: 'Health Professional?',
      heroSubtitle: 'Generate qualified leads with professional nutritional and wellness assessment tools',
      cta: 'Start generating leads now',
      toolsTitle: 'Professional Tools Available',
      toolsSubtitle: 'Calculators based on WHO guidelines to capture qualified leads',
      benefitsTitle: 'Why choose YLADA?',
      benefitsSubtitle: 'Increase your credibility and generate more leads with professional tools',
      demoTitle: 'See how it works',
      demoSubtitle: 'Test our tools and see how your clients will receive the results',
      ctaTitle: 'Ready to generate more leads?',
      ctaSubtitle: 'Access professional tools and start capturing qualified leads today'
    },
    es: {
      title: 'YLADA',
      subtitle: 'Your Lead Advanced Data Assistant',
      description: 'Herramientas avanzadas de generación de leads para profesionales de bienestar y calidad de vida',
      getStarted: 'Descubrir Mi Protocolo',
      features: 'Características',
      about: 'Acerca de',
      contact: 'Contacto',
      heroTitle: '¿Profesional de Salud?',
      heroSubtitle: 'Genera leads calificados con herramientas profesionales de evaluación nutricional y bienestar',
      cta: 'Comienza a generar leads ahora',
      toolsTitle: 'Herramientas Profesionales Disponibles',
      toolsSubtitle: 'Calculadoras basadas en directrices de la OMS para capturar leads calificados',
      benefitsTitle: '¿Por qué elegir YLADA?',
      benefitsSubtitle: 'Aumenta tu credibilidad y genera más leads con herramientas profesionales',
      demoTitle: 'Ve cómo funciona',
      demoSubtitle: 'Prueba nuestras herramientas y ve cómo tus clientes recibirán los resultados',
      ctaTitle: '¿Listo para generar más leads?',
      ctaSubtitle: 'Accede a herramientas profesionales y comienza a capturar leads calificados hoy mismo'
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
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-4">
              Para Profissionais de Saúde
            </span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t.heroTitle}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors text-center flex items-center justify-center">
              Acessar Dashboard Profissional
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a href="#tools" className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition-colors">
              Ver Ferramentas Disponíveis
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t.benefitsTitle}
            </h3>
            <p className="text-lg text-gray-600">
              {t.benefitsSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className={`w-16 h-16 ${benefit.color.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t.toolsTitle}
            </h3>
            <p className="text-lg text-gray-600">
              {t.toolsSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <a
                key={index}
                href={tool.href}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-emerald-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {tool.category}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {tool.title}
                </h4>
                <p className="text-gray-600 mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center text-emerald-600 font-medium">
                  <span>Testar ferramenta</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            {t.ctaTitle}
          </h3>
          <p className="text-xl text-emerald-100 mb-8">
            {t.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="px-8 py-4 bg-white text-emerald-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
              Acessar Dashboard Profissional
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a href="/quiz" className="px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors">
              Ver Quizzes de Avaliação
            </a>
          </div>
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