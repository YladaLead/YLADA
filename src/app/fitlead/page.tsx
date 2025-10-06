'use client'

import { useState } from 'react'
import { Calculator, Users, TrendingUp, Shield, CheckCircle, ArrowRight, Play, Award, Target, Heart, Activity, Brain, Mail, Phone } from 'lucide-react'

export default function FitLeadPage() {
  const demos = {
    bmi: {
      title: 'Calculadora de IMC',
      description: 'Avalie o peso ideal dos seus clientes',
      icon: Calculator,
      color: 'emerald'
    },
    nutrition: {
      title: 'Avaliação Nutricional',
      description: 'Análise completa de necessidades nutricionais',
      icon: Heart,
      color: 'red'
    },
    meal: {
      title: 'Planejador de Refeições',
      description: 'Crie planos alimentares personalizados',
      icon: Activity,
      color: 'blue'
    },
    quiz: {
      title: 'Questionário de Saúde',
      description: 'Identifique necessidades específicas',
      icon: Brain,
      color: 'purple'
    }
  }

  const [activeDemo, setActiveDemo] = useState<keyof typeof demos>('bmi')
  const [demoResult, setDemoResult] = useState<{
    score: string;
    recommendation: string;
    nextSteps: string[];
  } | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    distributorId: '',
    message: ''
  })

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular resultado do demo
    setDemoResult({
      score: '85%',
      recommendation: 'Cliente ideal para produtos nutricionais!',
      nextSteps: ['Agendar consulta', 'Enviar catálogo', 'Oferecer desconto']
    })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Obrigado! Entraremos em contato em breve para agendar sua demonstração personalizada.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      distributorId: '',
      message: ''
    })
    setShowContactForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FitLead</h1>
                <p className="text-xs text-gray-600">Powered by YLADA</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Exclusivo para Distribuidores</span>
              <button
                onClick={() => setShowContactForm(true)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Agendar Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
              🎯 Exclusivo para Distribuidores
            </span>
          </div>
          
          <h2 className="text-5xl font-bold mb-6">
            Escale Seu Negócio com Ferramentas Profissionais
          </h2>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Transforme visitantes em clientes fiéis com avaliações nutricionais que demonstram sua expertise e capturam leads qualificados automaticamente.
          </p>


          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowContactForm(true)}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demonstração
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Testar Ferramentas
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Por que Distribuidores Escolhem o FitLead?
            </h3>
            <p className="text-lg text-gray-600">
              Ferramentas profissionais que aumentam sua credibilidade e multiplicam suas vendas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-emerald-50 rounded-xl">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Captura de Leads Qualificados
              </h4>
              <p className="text-gray-600">
                Seus clientes preenchem avaliações e você recebe dados completos automaticamente
              </p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Aumento de Conversões
              </h4>
              <p className="text-gray-600">
                Ferramentas profissionais aumentam a confiança e conversão de leads
              </p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Credibilidade Profissional
              </h4>
              <p className="text-gray-600">
                Demonstre expertise com ferramentas baseadas em diretrizes da OMS
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Dados Seguros
              </h4>
              <p className="text-gray-600">
                Sistema seguro para captura e armazenamento de informações dos clientes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demos Section */}
      <section id="demos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Teste Nossas Ferramentas Agora
            </h3>
            <p className="text-lg text-gray-600">
              Experimente como seus clientes vão interagir com suas avaliações profissionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Demo Selector */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">
                Escolha uma Ferramenta para Testar:
              </h4>
              
              {Object.entries(demos).map(([key, demo]) => (
                <button
                  key={key}
                  onClick={() => setActiveDemo(key as keyof typeof demos)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors ${
                    activeDemo === key
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-${demo.color}-100 rounded-lg flex items-center justify-center`}>
                      <demo.icon className={`w-6 h-6 text-${demo.color}-600`} />
                    </div>
                    <div className="text-left">
                      <h5 className="font-semibold text-gray-900">{demo.title}</h5>
                      <p className="text-sm text-gray-600">{demo.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Demo Interface */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {demos[activeDemo].title}
                </h4>
                <p className="text-gray-600">{demos[activeDemo].description}</p>
              </div>
              
              {!demoResult ? (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Cliente
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: Maria Silva"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idade
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: 35"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: 70"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ex: 165"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular Resultado
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-2">
                    Resultado: {demoResult.score}
                  </h5>
                  <p className="text-gray-600 mb-4">{demoResult.recommendation}</p>
                  
                  <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                    <h6 className="font-semibold text-emerald-800 mb-2">Próximos Passos:</h6>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      {demoResult.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => setDemoResult(null)}
                    className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    Testar Novamente
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Como Funciona na Prática
            </h3>
            <p className="text-lg text-gray-600">
              3 passos simples para começar a escalar seu negócio hoje
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Configure Suas Ferramentas
              </h4>
              <p className="text-gray-600">
                Personalize com sua marca e área de atuação. Configure em menos de 10 minutos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Compartilhe com Seus Clientes
              </h4>
              <p className="text-gray-600">
                Envie links das ferramentas para seus prospects via WhatsApp, redes sociais ou e-mail.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Receba os Dados Automaticamente
              </h4>
              <p className="text-gray-600">
                Todos os formulários preenchidos chegam no seu dashboard com dados completos dos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-6">
              🎁 Oferta Exclusiva para Distribuidores
            </span>
          </div>
          
          <h3 className="text-3xl font-bold mb-4">
            Comece Hoje com 50% de Desconto
          </h3>
          
          <p className="text-xl mb-8">
            + Suporte personalizado + Treinamento gratuito
          </p>
          
          <div className="bg-white/10 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div>
                <Award className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <h4 className="font-semibold mb-1">Suporte Personalizado</h4>
                <p className="text-sm">Consultoria 1:1 para maximizar resultados</p>
              </div>
              <div>
                <Target className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <h4 className="font-semibold mb-1">Treinamento Gratuito</h4>
                <p className="text-sm">Aprenda a usar todas as ferramentas</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowContactForm(true)}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Agendar Demonstração
            </button>
            <button
              onClick={() => setShowContactForm(true)}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Falar com Especialista
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Agendar Demonstração</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Distribuidor
                </label>
                <input
                  type="text"
                  value={formData.distributorId}
                  onChange={(e) => setFormData({...formData, distributorId: e.target.value})}
                  placeholder="Ex: 123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Como podemos ajudar?
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Conte-nos sobre seus objetivos com o FitLead..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Agendar Demo
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Entraremos em contato em até 2 horas úteis</p>
              <p className="font-semibold text-emerald-600">Suporte especializado para distribuidores</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold">FitLead</h4>
            </div>
            <p className="text-gray-400 mb-4">
              Powered by YLADA - Exclusivo para Distribuidores
            </p>
            <p className="text-sm text-gray-500">
              © 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}