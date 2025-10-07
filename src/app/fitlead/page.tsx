'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, Globe, ArrowRight, Users, TrendingUp, Star, Shield, Play, X, Target, Award, Zap } from 'lucide-react'

export default function FitLeadLandingPage() {
  const [showContactForm, setShowContactForm] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profession: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode implementar o envio do formulário
    alert('Obrigado pelo interesse! Entraremos em contato em breve.')
    setShowContactForm(false)
  }

  const handleDemoClick = (demoType: string) => {
    // Redirecionar para demos específicos do FitLead
    switch(demoType) {
      case 'bmi':
        router.push('/demo/bmi')
        break
      case 'body-composition':
        router.push('/demo/body-composition')
        break
      case 'nutrition':
        router.push('/demo/nutrition-assessment')
        break
      case 'protein':
        router.push('/demo/protein')
        break
      case 'hydration':
        router.push('/demo/hydration')
        break
      case 'meal-planner':
        router.push('/demo/meal-planner')
        break
      default:
        router.push('/demo/bmi')
    }
  }

  const demos = [
    {
      id: 'bmi',
      title: 'Calculadora de IMC',
      description: 'Calcule o Índice de Massa Corporal dos seus clientes',
      icon: Calculator,
      color: 'bg-blue-500'
    },
    {
      id: 'body-composition',
      title: 'Composição Corporal',
      description: 'Avalie massa muscular, gordura e hidratação',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      id: 'nutrition',
      title: 'Avaliação Nutricional',
      description: 'Questionário completo de hábitos alimentares',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      id: 'protein',
      title: 'Calculadora de Proteína',
      description: 'Calcule necessidades proteicas individuais',
      icon: Zap,
      color: 'bg-orange-500'
    },
    {
      id: 'hydration',
      title: 'Calculadora de Hidratação',
      description: 'Avalie necessidades de água e eletrólitos',
      icon: Globe,
      color: 'bg-cyan-500'
    },
    {
      id: 'meal-planner',
      title: 'Planejador de Refeições',
      description: 'Crie planos alimentares personalizados',
      icon: Users,
      color: 'bg-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FitLead</h1>
                <p className="text-sm text-gray-600">Your Lead Accelerated Data App</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowContactForm(true)}
                className="px-4 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Falar com Especialista
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Acessar Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6">
            🏋️ Ferramentas Profissionais para Fitness
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforme Visitantes em 
            <span className="text-emerald-600"> Clientes Qualificados</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ferramentas profissionais que demonstram sua expertise e capturam leads automaticamente para seu negócio de fitness e nutrição.
          </p>

          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">+500 profissionais já usam</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-gray-600">4.9/5 avaliação</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleDemoClick('bmi')}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demonstração
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-white text-emerald-600 border border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Começar Grátis
            </button>
          </div>
        </div>
      </section>

      {/* Demo Tools Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ferramentas Profissionais Disponíveis
            </h2>
            <p className="text-xl text-gray-600">
              Teste nossas ferramentas e veja como elas podem aumentar suas conversões
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleDemoClick(demo.id)}
              >
                <div className={`w-12 h-12 ${demo.color} rounded-lg flex items-center justify-center mb-4`}>
                  <demo.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {demo.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {demo.description}
                </p>
                <div className="flex items-center text-emerald-600 font-medium">
                  <Play className="w-4 h-4 mr-2" />
                  Testar Demo
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o FitLead?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Capture Leads Qualificados
              </h3>
              <p className="text-gray-600">
                Seus clientes preenchem formulários profissionais e você recebe os dados automaticamente
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aumente Suas Vendas
              </h3>
              <p className="text-gray-600">
                Ferramentas que demonstram sua expertise profissional e aumentam a confiança
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dados Seguros
              </h3>
              <p className="text-gray-600">
                Sistema seguro para captura e armazenamento de informações dos seus clientes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Falar com Especialista</h2>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profissão
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ex: Personal Trainer, Nutricionista"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Como podemos ajudar você?"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}