'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, ClipboardList, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function HealthyEatingDemoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "Com que frequência você consome frutas e vegetais?",
      options: [
        "Todos os dias, várias porções",
        "Quase todos os dias",
        "Algumas vezes por semana",
        "Raramente ou nunca"
      ]
    }
  ]

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      alert('Demo: Quiz finalizado! Na versão real, você veria seus resultados aqui.')
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz: Alimentação Saudável</h1>
                <p className="text-sm text-gray-600">Demo - Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Veja como seus clientes terão uma experiência incrível
          </h2>
          <p className="text-xl text-green-100 mb-6">
            E como cada ferramenta pode gerar novos contatos automaticamente!
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm">
              💡 Esta é uma versão de demonstração. Quando você adquirir o acesso, poderá personalizar o botão, mensagem e link de destino (WhatsApp, formulário ou site).
            </p>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz: Alimentação Saudável</h2>
            <p className="text-gray-600 mb-6">
              Responda às perguntas para descobrir como está sua alimentação
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500">
              Pergunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              {currentQ.question}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestion] === index
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      answers[currentQuestion] === index
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>
            
            <button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gray-50 rounded-xl p-8 text-center shadow-lg border border-gray-200">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">
            💼 Pronto para ter esta ferramenta com seu nome e link personalizado?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Clique em &quot;Assinar Agora&quot; e comece a gerar seus próprios leads com o Herbalead.
          </p>
            <button 
              onClick={() => window.location.href = '/payment'}
              className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl"
            >
              Clique abaixo e começa a gerar seus leads agora
            </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Este quiz é uma ferramenta de orientação e não substitui uma avaliação nutricional profissional completa. 
                Consulte sempre um especialista para uma análise detalhada da sua alimentação.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
