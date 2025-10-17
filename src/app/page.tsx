'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, Globe, ArrowRight, Users, TrendingUp, Star, Shield, Play, Target, Award, Zap, Heart } from 'lucide-react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'

export default function YLADALandingPage() {
  // Fix: Corrigir erro de build no Vercel
  const router = useRouter()
  const [showContactForm, setShowContactForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    question: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setTimeout(() => {
          setShowContactForm(false)
          setSubmitStatus('idle')
          setFormData({ name: '', phone: '', question: '' })
        }, 2000)
      } else {
        throw new Error('Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar contato:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoClick = (demoType: string) => {
    // Redirecionar para demos específicos do YLADA (apenas MVP)
    switch(demoType) {
      case 'bmi':
        router.push('/demo/bmi')
        break
      case 'protein':
        router.push('/demo/protein')
        break
      case 'hydration':
        router.push('/demo/hydration')
        break
      case 'body-composition':
        router.push('/demo/body-composition')
        break
      case 'meal-planner':
        router.push('/demo/meal-planner')
        break
      case 'nutrition-assessment':
        router.push('/demo/nutrition-assessment')
        break
      case 'wellness-profile':
        router.push('/demo/wellness-profile')
        break
      case 'daily-wellness':
        router.push('/demo/daily-wellness')
        break
      case 'healthy-eating':
        router.push('/demo/healthy-eating')
        break
      default:
        router.push('/demo/bmi')
    }
  }

  const demos = [
    // 📊 Ferramentas de Saúde e Bem-estar (9 funcionalidades)
    {
      id: 'bmi',
      title: 'Calculadora IMC',
      description: 'Calcule o Índice de Massa Corporal dos seus clientes',
      icon: Calculator,
      color: 'bg-blue-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    },
    {
      id: 'protein',
      title: 'Calculadora de Proteína',
      description: 'Calcule necessidades proteicas individuais',
      icon: Zap,
      color: 'bg-orange-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    },
    {
      id: 'hydration',
      title: 'Calculadora de Hidratação',
      description: 'Avalie necessidades de água e eletrólitos',
      icon: Globe,
      color: 'bg-cyan-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    },
    {
      id: 'body-composition',
      title: 'Composição Corporal',
      description: 'Avalie massa muscular, gordura e hidratação',
      icon: Target,
      color: 'bg-green-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    },
    {
      id: 'meal-planner',
      title: 'Planejador de Refeições',
      description: 'Crie planos alimentares personalizados',
      icon: Users,
      color: 'bg-pink-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    },
    {
      id: 'nutrition-assessment',
      title: 'Avaliação Nutricional',
      description: 'Questionário completo de hábitos alimentares',
      icon: Award,
      color: 'bg-purple-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    },
    {
      id: 'wellness-profile',
      title: 'Quiz: Perfil de Bem-Estar',
      description: 'Descubra o perfil de bem-estar dos seus leads',
      icon: Star,
      color: 'bg-yellow-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    },
    {
      id: 'daily-wellness',
      title: 'Tabela: Bem-Estar Diário',
      description: 'Acompanhe métricas de bem-estar diárias',
      icon: Shield,
      color: 'bg-teal-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    },
    {
      id: 'healthy-eating',
      title: 'Quiz: Alimentação Saudável',
      description: 'Avalie hábitos alimentares e oriente nutricionalmente',
      icon: Calculator,
      color: 'bg-lime-500',
      category: 'Ferramentas de Saúde',
      tag: 'Demo disponível'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div className="flex items-center space-x-3">
              <YLADALogo size="lg" variant="horizontal" responsive={true} />
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LanguageSelector />
              <button
                onClick={() => window.open('https://api.whatsapp.com/send?phone=5519996049800&text=Estou%20no%20site%20e%20gostaria%20de%20entender%20melhor', '_blank')}
                className="px-3 py-2 text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center text-sm sm:text-base"
              >
                <svg className="w-4 h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="hidden sm:inline">Falar Conosco</span>
                <span className="sm:hidden">Contato</span>
              </button>
              <button 
                onClick={() => router.push('/login')}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Entrar</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Transforme seu negócio em uma<br />
            <span className="text-emerald-600">máquina de gerar contatos</span><br />
            com o YLADA 🚀
          </h1>
          

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('ferramentas')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver demonstrações
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => router.push('/payment')}
              className="px-8 py-4 bg-white text-emerald-600 border border-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              Quero começar agora
            </button>
          </div>
        </div>
      </section>

      {/* Benefícios Diretos */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transforme seu negócio em uma máquina de resultados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gere leads automáticos e segmentados
              </h3>
              <p className="text-gray-600 text-sm">
                Capture dados qualificados dos seus clientes automaticamente através de quizzes e avaliações personalizadas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Capture dados dos clientes via quizzes e avaliações
              </h3>
              <p className="text-gray-600 text-sm">
                Colete informações valiosas sobre objetivos, hábitos e necessidades dos seus clientes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Crie desafios e metas para engajamento
              </h3>
              <p className="text-gray-600 text-sm">
                Mantenha seus clientes engajados com desafios de 7 dias e acompanhamento de metas semanais
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Acompanhe o progresso dos seus clientes
              </h3>
              <p className="text-gray-600 text-sm">
                Monitore resultados, conversões e performance dos seus clientes em tempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Tools Section */}
      <section id="ferramentas" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Nossas Ferramentas de Geração de Leads
                </h2>
                <p className="text-lg text-gray-600">
                  Explore as calculadoras e quizzes que vão impulsionar seu negócio de saúde e bem-estar.
                </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
                onClick={() => handleDemoClick(demo.id)}
              >
                {/* Tag */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    {demo.tag}
                  </span>
                </div>
                
                <div className={`w-12 h-12 ${demo.color} rounded-lg flex items-center justify-center mb-4`}>
                  <demo.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {demo.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {demo.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-emerald-600 font-medium">
                    <Play className="w-4 h-4 mr-2" />
                    Testar Demo
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push('/payment')
                    }}
                    className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Começar
                  </button>
                </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call Final */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Pronto para Transformar Seu Negócio?
                </h2>
                <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                  Comece a gerar leads qualificados e a expandir sua base de clientes hoje mesmo!
                </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/payment')}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Quero começar agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Modal de Contato */}
      {showContactForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Falar Conosco</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone/WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sua Dúvida *
                </label>
                <textarea
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Como podemos ajudar você?"
                />
              </div>
              
              {submitStatus === 'success' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ Mensagem enviada com sucesso! Entraremos em contato em breve.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    ❌ Erro ao enviar mensagem. Tente novamente.
                  </p>
                </div>
              )}
              
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
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}