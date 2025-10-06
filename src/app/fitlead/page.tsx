'use client'

import { Calculator, Shield, Zap, Heart, Brain, CheckCircle, Users, TrendingUp, Star, ExternalLink, Play, Target } from 'lucide-react'

export default function FitLeadPage() {
  const tools = [
    {
      icon: Calculator,
      title: 'Calculadora de IMC',
      description: 'Análise corporal completa com categorização e recomendações personalizadas',
      color: 'bg-emerald-500',
      demoHref: '/demo/bmi',
      category: 'Avaliação Corporal',
      type: 'calculator'
    },
    {
      icon: Shield,
      title: 'Necessidades de Proteína',
      description: 'Cálculo preciso baseado em diretrizes da OMS para diferentes objetivos',
      color: 'bg-green-500',
      demoHref: '/demo/protein',
      category: 'Nutrição',
      type: 'calculator'
    },
    {
      icon: Zap,
      title: 'Composição Corporal',
      description: 'Avaliação de massa muscular, gordura corporal, BMR e TDEE',
      color: 'bg-yellow-500',
      demoHref: '/demo/body-composition',
      category: 'Avaliação Corporal',
      type: 'calculator'
    },
    {
      icon: Heart,
      title: 'Planejador de Refeições',
      description: 'Cardápio personalizado com distribuição calórica e lista de compras',
      color: 'bg-red-500',
      demoHref: '/demo/meal-planner',
      category: 'Nutrição',
      type: 'calculator'
    },
    {
      icon: Brain,
      title: 'Monitor de Hidratação',
      description: 'Controle de ingestão hídrica baseado em atividade e clima',
      color: 'bg-purple-500',
      demoHref: '/demo/hydration',
      category: 'Saúde',
      type: 'calculator'
    },
    {
      icon: CheckCircle,
      title: 'Avaliação Nutricional',
      description: 'Identificação de deficiências e recomendações de suplementos',
      color: 'bg-indigo-500',
      demoHref: '/demo/nutrition-assessment',
      category: 'Saúde',
      type: 'calculator'
    }
  ]

  const quizzes = [
    {
      icon: Brain,
      title: 'Avaliação Nutricional Completa',
      description: 'Identifique deficiências nutricionais e receba recomendações personalizadas',
      color: 'bg-blue-500',
      demoHref: '/demo/quiz/nutritional-assessment',
      category: 'Quiz Nutricional',
      type: 'quiz',
      duration: '5-7 minutos',
      questions: 15
    },
    {
      icon: Heart,
      title: 'Avaliação de Estilo de Vida',
      description: 'Analise seus hábitos de vida e receba orientações para melhorar sua saúde',
      color: 'bg-green-500',
      demoHref: '/demo/quiz/lifestyle-evaluation',
      category: 'Quiz de Estilo de Vida',
      type: 'quiz',
      duration: '4-6 minutos',
      questions: 12
    },
    {
      icon: Target,
      title: 'Definição de Objetivos de Saúde',
      description: 'Estabeleça metas claras e receba um plano personalizado para alcançá-las',
      color: 'bg-purple-500',
      demoHref: '/demo/quiz/health-goals',
      category: 'Quiz de Objetivos',
      type: 'quiz',
      duration: '3-5 minutos',
      questions: 10
    },
    {
      icon: Shield,
      title: 'Check-up de Bem-Estar',
      description: 'Avaliação geral de saúde e bem-estar com recomendações preventivas',
      color: 'bg-emerald-500',
      demoHref: '/demo/quiz/wellness-checkup',
      category: 'Quiz de Bem-Estar',
      type: 'quiz',
      duration: '6-8 minutos',
      questions: 18
    }
  ]

  const benefits = [
    {
      icon: Users,
      title: 'Capture Leads Qualificados',
      description: 'Seus clientes preenchem os formulários e você recebe os dados automaticamente'
    },
    {
      icon: TrendingUp,
      title: 'Aumente Suas Vendas',
      description: 'Ferramentas profissionais que demonstram sua expertise e geram confiança'
    },
    {
      icon: Star,
      title: 'Diferencial Competitivo',
      description: 'Seja o profissional que oferece avaliações modernas e personalizadas'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">YLADA</h1>
                <p className="text-sm text-gray-600">Your Lead Accelerated Data App</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a
                href="/auth/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Entrar
              </a>
              <a
                href="/auth/register"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Começar Agora
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
              Para Profissionais de Saúde e Bem-Estar
            </span>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Ferramentas Profissionais para
            <span className="text-emerald-600"> Capturar Leads</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ofereça avaliações personalizadas aos seus clientes e receba os dados automaticamente. 
            Aumente suas vendas com ferramentas que demonstram sua expertise profissional.
          </p>

          {/* Social Proof */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="ml-3">+500 profissionais já usam</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>4.9/5 avaliação</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#demo"
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Demonstração
            </a>
            <a
              href="/auth/register"
              className="px-8 py-4 border border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Começar Gratuitamente
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o YLADA?
            </h3>
            <p className="text-lg text-gray-600">
              Ferramentas desenvolvidas especificamente para profissionais de saúde
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Demo Section */}
      <section id="demo" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Experimente Nossas Ferramentas
            </h3>
            <p className="text-lg text-gray-600">
              Demonstrações interativas para você testar antes de comprar
            </p>
          </div>

          {/* Calculadoras */}
          <div className="mb-16">
            <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              🧮 Calculadoras Profissionais
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 ${tool.color} rounded-lg flex items-center justify-center`}>
                      <tool.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      {tool.category}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {tool.title}
                  </h4>
                  
                  <p className="text-gray-600 mb-6">
                    {tool.description}
                  </p>
                  
                  <div className="flex space-x-3">
                    <a
                      href={tool.demoHref}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                    <a
                      href="/auth/register"
                      className="flex-1 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-center"
                    >
                      Comprar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quizzes */}
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              ❓ Quizzes de Avaliação
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes.map((quiz, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 ${quiz.color} rounded-lg flex items-center justify-center`}>
                      <quiz.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-1">
                        {quiz.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        {quiz.duration} • {quiz.questions} perguntas
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {quiz.title}
                  </h4>
                  
                  <p className="text-gray-600 mb-6">
                    {quiz.description}
                  </p>
                  
                  <div className="flex space-x-3">
                    <a
                      href={quiz.demoHref}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                    <a
                      href="/auth/register"
                      className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
                    >
                      Comprar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h3>
            <p className="text-lg text-gray-600">
              Tire suas dúvidas sobre o YLADA
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Como funciona a captura de leads?
              </h4>
              <p className="text-gray-700">
                Seus clientes preenchem os formulários das ferramentas e você recebe automaticamente 
                todos os dados no seu dashboard. Não precisa fazer nada manualmente!
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Posso personalizar com minha marca?
              </h4>
              <p className="text-gray-700">
                Sim! Você pode adicionar seu logo, cores da marca e mensagens personalizadas 
                em todas as ferramentas. Seus clientes verão sua identidade visual.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Quanto custa o YLADA?
              </h4>
              <p className="text-gray-700">
                Oferecemos um plano gratuito para começar e planos premium a partir de R$ 97/mês. 
                Sem taxas ocultas ou surpresas. Cancele quando quiser.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Preciso de conhecimento técnico?
              </h4>
              <p className="text-gray-700">
                Não! O YLADA foi desenvolvido para ser simples e intuitivo. 
                Em poucos minutos você estará capturando leads qualificados.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Os dados dos meus clientes são seguros?
              </h4>
              <p className="text-gray-700">
                Absolutamente! Usamos criptografia de nível bancário e seguimos todas as 
                normas de proteção de dados (LGPD). Seus dados estão 100% seguros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h3>
            <p className="text-lg text-gray-600">
              Profissionais que já aumentaram suas vendas com o YLADA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-emerald-600 font-bold text-lg">MS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Maria Silva</h4>
                  <p className="text-sm text-gray-600">Nutricionista - CRN 12345</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700">
                &quot;Com o YLADA consegui aumentar em 300% meus leads qualificados. 
                Os clientes adoram as avaliações personalizadas e eu recebo todos os dados automaticamente.&quot;
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">João Santos</h4>
                  <p className="text-sm text-gray-600">Personal Trainer - CREF 67890</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700">
                &quot;As ferramentas do YLADA me ajudaram a demonstrar minha expertise profissional. 
                Agora meus clientes confiam mais no meu trabalho e minhas vendas dobraram.&quot;
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-lg">AC</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ana Costa</h4>
                  <p className="text-sm text-gray-600">Nutricionista Esportiva - CRN 11111</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700">
                &quot;O YLADA revolucionou meu atendimento. Os quizzes interativos engajam muito mais 
                os clientes e eu consigo capturar leads de qualidade constantemente.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Garantia de 30 Dias
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Teste o YLADA por 30 dias sem compromisso. Se não aumentar suas vendas, 
              devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                <span>Sem compromisso</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                <span>Reembolso total</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                <span>Suporte completo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Pronto para aumentar suas vendas?
          </h3>
          <p className="text-xl text-emerald-100 mb-8">
            Junte-se a mais de 500 profissionais que já transformaram seus negócios
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Gratuitamente
            </a>
            <a
              href="#demo"
              className="px-8 py-4 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Ver Demonstração
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold">YLADA</h4>
            </div>
            <p className="text-gray-400 mb-4">
              Your Lead Accelerated Data App
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
