'use client'

import { useState } from 'react'
import { Calculator, Users, TrendingUp, Shield, CheckCircle, ArrowRight, Play, Heart, Activity, Brain, Mail } from 'lucide-react'
import Link from 'next/link'
import FitLeadLogo from '@/components/FitLeadLogo'

export default function FitLeadPage() {
  const funnelStages = {
    capture: {
      title: 'Captura de Leads',
      subtitle: 'Para quem ainda não conhece seu trabalho',
      description: 'Ferramentas que geram interesse inicial e capturam dados básicos',
      color: 'bg-blue-500',
      icon: Users,
      tools: {
        bmi: {
          title: 'Avaliação Corporal Rápida',
          description: 'Calculadora de IMC que gera interesse e captura dados básicos',
          icon: Calculator,
          color: 'emerald',
          category: 'Primeiro Contato',
          iconBg: 'bg-emerald-500',
          purpose: 'Captura leads através de avaliação simples e rápida'
        },
        hydration: {
          title: 'Teste de Hidratação',
          description: 'Questionário rápido sobre hábitos de hidratação',
          icon: Activity,
          color: 'blue',
          category: 'Primeiro Contato',
          iconBg: 'bg-blue-500',
          purpose: 'Gera interesse através de tema relevante e acessível'
        }
      }
    },
    qualify: {
      title: 'Qualificação de Clientes',
      subtitle: 'Para quem já tem interesse',
      description: 'Análises detalhadas que identificam necessidades específicas',
      color: 'bg-green-500',
      icon: Shield,
      tools: {
        protein: {
          title: 'Análise de Necessidades Proteicas',
          description: 'Cálculo personalizado baseado em objetivos e estilo de vida',
          icon: Shield,
          color: 'emerald',
          category: 'Qualificação',
          iconBg: 'bg-emerald-500',
          purpose: 'Identifica necessidades específicas e potencial de compra'
        },
        'body-composition': {
          title: 'Avaliação Corporal Completa',
          description: 'Análise detalhada de composição corporal e metabolismo',
          icon: Activity,
          color: 'yellow',
          category: 'Qualificação',
          iconBg: 'bg-yellow-500',
          purpose: 'Qualifica leads através de análise profissional'
        },
        'nutrition-assessment': {
          title: 'Avaliação Nutricional Detalhada',
          description: 'Análise completa de hábitos e necessidades nutricionais',
          icon: Heart,
          color: 'purple',
          category: 'Qualificação',
          iconBg: 'bg-purple-500',
          purpose: 'Identifica deficiências e oportunidades de venda'
        }
      }
    },
    convert: {
      title: 'Conversão e Vendas',
      subtitle: 'Para quem está pronto para comprar',
      description: 'Ferramentas que justificam investimento e fecham vendas',
      color: 'bg-purple-500',
      icon: TrendingUp,
      tools: {
        'meal-planner': {
          title: 'Plano Nutricional Personalizado',
          description: 'Cardápio completo com lista de compras e suplementos',
          icon: Heart,
          color: 'red',
          category: 'Conversão',
          iconBg: 'bg-red-500',
          purpose: 'Demonstra valor e justifica investimento em produtos'
        },
        'health-quiz': {
          title: 'Relatório de Saúde Personalizado',
          description: 'Análise completa com recomendações específicas',
          icon: Brain,
          color: 'indigo',
          category: 'Conversão',
          iconBg: 'bg-indigo-500',
          purpose: 'Gera relatório profissional que fecha vendas'
        }
      }
    },
    refer: {
      title: 'Indicações e Propagação',
      subtitle: 'Para clientes ativos',
      description: 'Ferramentas que clientes compartilham e geram indicações',
      color: 'bg-orange-500',
      icon: Users,
      tools: {
        'lifestyle-quiz': {
          title: 'Avaliação de Estilo de Vida',
          description: 'Quiz que clientes compartilham com amigos e familiares',
          icon: Activity,
          color: 'teal',
          category: 'Indicações',
          iconBg: 'bg-teal-500',
          purpose: 'Gera indicações através de compartilhamento'
        },
        'goals-quiz': {
          title: 'Planejamento de Objetivos',
          description: 'Ferramenta que clientes usam para motivar outros',
          icon: Brain,
          color: 'pink',
          category: 'Indicações',
          iconBg: 'bg-pink-500',
          purpose: 'Cria engajamento e gera novas oportunidades'
        }
      }
    }
  }

  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Obrigado! Entraremos em contato em breve para agendar sua demonstração personalizada.')
    setFormData({ name: '', email: '', phone: '', message: '' })
    setShowContactForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <FitLeadLogo size="md" showText={true} />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Ferramentas Profissionais</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-100 to-green-200 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Escale Seu Negócio com Ferramentas Profissionais
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Transforme visitantes em clientes fiéis com avaliações nutricionais que demonstram sua expertise e capturam leads qualificados automaticamente.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demonstração
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button 
              onClick={() => setShowContactForm(true)}
              className="px-8 py-4 border-2 border-emerald-700 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-700 hover:text-white transition-colors"
            >
              Testar Ferramentas
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Por que o FitLead Gera Muitos Contatos?</h3>
            <p className="text-lg text-gray-600">Ferramentas profissionais que aumentam sua credibilidade e multiplicam suas vendas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-emerald-50 rounded-xl">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Captura de Leads Qualificados</h4>
              <p className="text-gray-600">Seus clientes preenchem avaliações e você recebe dados completos automaticamente</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Aumento de Conversões</h4>
              <p className="text-gray-600">Ferramentas profissionais aumentam a confiança e conversão de leads</p>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Credibilidade Profissional</h4>
              <p className="text-gray-600">Demonstre expertise com ferramentas baseadas em diretrizes da OMS</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Dados Seguros</h4>
              <p className="text-gray-600">Sistema seguro para captura e armazenamento de informações dos clientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Funnel Stages Section */}
      <section id="tools" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ferramentas Organizadas por Funil de Vendas
            </h3>
            <p className="text-lg text-gray-600">
              Cada ferramenta tem um propósito específico no seu processo de vendas
            </p>
          </div>
          
          {/* Funnel Stages */}
          {Object.entries(funnelStages).map(([stageKey, stage]) => (
            <div key={stageKey} className="mb-16">
              {/* Stage Header */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 ${stage.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stage.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{stage.title}</h4>
                <p className="text-lg text-gray-700 mb-2">{stage.subtitle}</p>
                <p className="text-gray-600 max-w-2xl mx-auto">{stage.description}</p>
              </div>
              
              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(stage.tools).map(([toolKey, tool]) => (
                  <div key={toolKey} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    {/* Purpose Tag */}
                    <div className="flex justify-end mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {tool.category}
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-12 h-12 ${tool.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Title and Description */}
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      {tool.title}
                    </h5>
                    <p className="text-gray-600 text-sm mb-4">
                      {tool.description}
                    </p>
                    
                    {/* Purpose */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 font-medium mb-1">PROPÓSITO:</p>
                      <p className="text-sm text-gray-700">{tool.purpose}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link
                        href={`/tools/${toolKey}`}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center text-sm font-medium"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Demo
                      </Link>
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="flex-1 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors text-sm font-medium"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona o Funil de Vendas</h3>
            <p className="text-lg text-gray-600">4 estágios que transformam visitantes em clientes fiéis</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Captura de Leads</h4>
              <p className="text-gray-600">Use ferramentas simples para gerar interesse inicial e capturar dados básicos de quem ainda não conhece seu trabalho.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Qualificação</h4>
              <p className="text-gray-600">Aplique análises detalhadas para identificar necessidades específicas e potencial de compra dos leads interessados.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Conversão</h4>
              <p className="text-gray-600">Utilize relatórios profissionais e planos personalizados para justificar investimento e fechar vendas.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Indicações</h4>
              <p className="text-gray-600">Clientes satisfeitos compartilham ferramentas e geram novas oportunidades através de indicações.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Entre em Contato</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FitLeadLogo size="lg" showText={true} className="text-white" />
            </div>
            <p className="text-gray-400 mb-4">Powered by YLADA - Exclusivo para Distribuidores</p>
            <p className="text-sm text-gray-500">© 2024 YLADA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}