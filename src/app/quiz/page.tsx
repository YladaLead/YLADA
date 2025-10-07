'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  Heart,
  Activity,
  Target,
  Brain,
  Shield,
  Zap,
  Users,
  Star
} from 'lucide-react'

export default function QuizSelectionPage() {
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>('pt')

  const quizTypes = [
    {
      id: 'nutritional-assessment',
      icon: Brain,
      title: 'Avaliação Nutricional Completa',
      description: 'Identifique deficiências nutricionais e receba recomendações personalizadas',
      duration: '5-7 minutos',
      questions: 15,
      color: 'bg-blue-500',
      href: '/quiz/nutritional-assessment',
      benefits: [
        'Identificação de deficiências',
        'Recomendações de suplementos',
        'Plano nutricional personalizado',
        'Avaliação de risco nutricional'
      ]
    },
    {
      id: 'lifestyle-evaluation',
      icon: Heart,
      title: 'Avaliação de Estilo de Vida',
      description: 'Analise seus hábitos de vida e receba orientações para melhorar sua saúde',
      duration: '4-6 minutos',
      questions: 12,
      color: 'bg-green-500',
      href: '/quiz/lifestyle-evaluation',
      benefits: [
        'Análise de hábitos alimentares',
        'Avaliação de atividade física',
        'Gestão de estresse',
        'Qualidade do sono'
      ]
    },
    {
      id: 'health-goals',
      icon: Target,
      title: 'Definição de Objetivos de Saúde',
      description: 'Estabeleça metas claras e receba um plano personalizado para alcançá-las',
      duration: '3-5 minutos',
      questions: 10,
      color: 'bg-purple-500',
      href: '/quiz/health-goals',
      benefits: [
        'Metas personalizadas',
        'Plano de ação detalhado',
        'Cronograma de progresso',
        'Acompanhamento de resultados'
      ]
    },
    {
      id: 'wellness-checkup',
      icon: Shield,
      title: 'Check-up de Bem-Estar',
      description: 'Avaliação geral de saúde e bem-estar com recomendações preventivas',
      duration: '6-8 minutos',
      questions: 18,
      color: 'bg-emerald-500',
      href: '/quiz/wellness-checkup',
      benefits: [
        'Avaliação geral de saúde',
        'Identificação de riscos',
        'Recomendações preventivas',
        'Plano de bem-estar'
      ]
    },
    {
      id: 'weight-management',
      icon: Activity,
      title: 'Gestão de Peso',
      description: 'Avaliação específica para controle de peso com estratégias personalizadas',
      duration: '4-6 minutos',
      questions: 14,
      color: 'bg-orange-500',
      href: '/quiz/weight-management',
      benefits: [
        'Análise de composição corporal',
        'Estratégias de perda/ganho de peso',
        'Plano alimentar personalizado',
        'Exercícios recomendados'
      ]
    },
    {
      id: 'stress-energy',
      icon: Zap,
      title: 'Energia e Estresse',
      description: 'Avalie seus níveis de energia e estresse para otimizar seu desempenho',
      duration: '3-5 minutos',
      questions: 11,
      color: 'bg-yellow-500',
      href: '/quiz/stress-energy',
      benefits: [
        'Avaliação de energia',
        'Gestão de estresse',
        'Técnicas de relaxamento',
        'Otimização de performance'
      ]
    }
  ]

  const languages = {
    pt: {
      title: 'Escolha seu Quiz de Avaliação',
      subtitle: 'Selecione o tipo de avaliação que melhor se adequa às suas necessidades',
      description: 'Todos os nossos quizzes são baseados em diretrizes científicas e fornecem recomendações personalizadas',
      startQuiz: 'Iniciar Quiz',
      duration: 'Duração',
      questions: 'Perguntas',
      benefits: 'Benefícios',
      professional: 'Para Profissionais de Saúde',
      clientTool: 'Ferramenta para capturar leads qualificados'
    },
    en: {
      title: 'Choose Your Assessment Quiz',
      subtitle: 'Select the type of assessment that best fits your needs',
      description: 'All our quizzes are based on scientific guidelines and provide personalized recommendations',
      startQuiz: 'Start Quiz',
      duration: 'Duration',
      questions: 'Questions',
      benefits: 'Benefits',
      professional: 'For Health Professionals',
      clientTool: 'Tool to capture qualified leads'
    },
    es: {
      title: 'Elige tu Quiz de Evaluación',
      subtitle: 'Selecciona el tipo de evaluación que mejor se adapte a tus necesidades',
      description: 'Todos nuestros quizzes están basados en directrices científicas y proporcionan recomendaciones personalizadas',
      startQuiz: 'Iniciar Quiz',
      duration: 'Duración',
      questions: 'Preguntas',
      benefits: 'Beneficios',
      professional: 'Para Profesionales de Salud',
      clientTool: 'Herramienta para capturar leads calificados'
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
              <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Quizzes de Avaliação</h1>
                  <p className="text-sm text-gray-600">Escolha o tipo de avaliação</p>
                </div>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-4">
              {t.professional}
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t.description}
          </p>
        </section>

        {/* Quiz Types Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {quizTypes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 ${quiz.color} rounded-lg flex items-center justify-center`}>
                  <quiz.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">{t.duration}</div>
                  <div className="text-sm text-gray-500">{quiz.questions} {t.questions}</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {quiz.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {quiz.description}
              </p>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">{t.benefits}:</h4>
                <ul className="space-y-1">
                  {quiz.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <a
                href={quiz.href}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                {t.startQuiz}
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          ))}
        </section>

        {/* Professional Info */}
        <section className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              {t.professional}
            </h3>
            <p className="text-emerald-100 mb-6">
              {t.clientTool}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Leads Qualificados</h4>
                <p className="text-sm text-emerald-100">Capture dados de clientes interessados</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Credibilidade</h4>
                <p className="text-sm text-emerald-100">Demonstre expertise profissional</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-2">Conversão</h4>
                <p className="text-sm text-emerald-100">Aumente suas vendas</p>
              </div>
            </div>
            
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Acessar Dashboard Profissional
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}