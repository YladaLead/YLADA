'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

function QuizGanhosContent() {
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  const questions = [
    {
      id: 1,
      text: "Hoje, o quanto você se sente limitado financeiramente?",
      options: [
        { text: "Nada.", score: 5 },
        { text: "Um pouco.", score: 15 },
        { text: "Bastante.", score: 25 },
        { text: "Muito.", score: 30 }
      ]
    },
    {
      id: 2,
      text: "Você sente que é pago proporcionalmente ao que entrega?",
      options: [
        { text: "Sim.", score: 5 },
        { text: "Mais ou menos.", score: 15 },
        { text: "Não.", score: 25 },
        { text: "Nem perto.", score: 30 }
      ]
    },
    {
      id: 3,
      text: "Com sua renda atual, consegue realizar sonhos?",
      options: [
        { text: "Sim.", score: 5 },
        { text: "Alguns.", score: 15 },
        { text: "Poucos.", score: 25 },
        { text: "Nenhum.", score: 30 }
      ]
    },
    {
      id: 4,
      text: "Você já pensou em criar uma renda extra sem depender de outra pessoa?",
      options: [
        { text: "Sim, e já faço algo.", score: 5 },
        { text: "Já pensei, mas não sei como.", score: 15 },
        { text: "Sim, mas tenho medo de começar.", score: 25 },
        { text: "Não, nunca tentei.", score: 30 }
      ]
    },
    {
      id: 5,
      text: "Quanto controle você sente sobre o seu futuro financeiro?",
      options: [
        { text: "Total.", score: 5 },
        { text: "Algum.", score: 15 },
        { text: "Pouco.", score: 25 },
        { text: "Nenhum.", score: 30 }
      ]
    }
  ]

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score]
    setAnswers(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const total = newAnswers.reduce((sum, score) => sum + score, 0)
      setTotalScore(total)
      setShowResult(true)
    }
  }

  const getResult = () => {
    if (totalScore <= 50) {
      return {
        type: 'A',
        title: 'Perfil Próspero',
        description: 'Você tem boa consciência financeira e mentalidade de crescimento.',
        details: 'Estudos da PwC (2022) indicam que pessoas que planejam e diversificam suas fontes de renda têm 52% mais estabilidade emocional.',
        cta: 'Quer ver formas modernas de fazer isso de modo leve e digital?',
        buttonText: 'Quero multiplicar minha renda 💰',
        whatsappMessage: 'Oi! Fiz o teste de ganhos e quero saber mais sobre essas formas digitais modernas de aumentar minha renda. Pode me mostrar como funciona?',
        color: 'green'
      }
    } else if (totalScore <= 99) {
      return {
        type: 'B',
        title: 'Perfil em Expansão',
        description: 'Sua mentalidade está no caminho certo, mas o modelo atual te limita.',
        details: 'Pesquisas mostram que 83% das pessoas sentem que poderiam ganhar mais se tivessem tempo e orientação.',
        cta: 'Quer que eu te mostre como algumas pessoas estão fazendo isso na prática?',
        buttonText: 'Quero aumentar minha renda 📈',
        whatsappMessage: 'Oi! Vi no meu diagnóstico que posso aumentar minha renda com algo paralelo. Quero ver como outras pessoas estão fazendo isso na prática. Pode me mostrar?',
        color: 'yellow'
      }
    } else {
      return {
        type: 'C',
        title: 'Perfil Estagnado',
        description: 'Você merece mais do que apenas pagar contas.',
        details: 'Um estudo global da Gallup (2023) revelou que 67% das pessoas se sentem presas no modelo de trabalho atual — mas 89% das que começaram uma nova fonte de renda disseram que voltaram a ter esperança.',
        cta: 'Quer descobrir um caminho simples e validado pra começar também?',
        buttonText: 'Quero sair dessa situação 💵',
        whatsappMessage: 'Oi! Quero descobrir esse caminho simples e validado que o teste mostrou para começar a ganhar mais. Pode me mostrar como funciona?',
        color: 'red'
      }
    }
  }

  const result = getResult()
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              💰 Seu Resultado: {result.title}
            </h1>
            <p className="text-lg text-gray-600">
              Pontuação: {totalScore} pontos
            </p>
          </div>

          {/* Result Card */}
          <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-${result.color}-500`}>
            <div className="flex items-start mb-4">
              <div className={`text-${result.color}-500 mr-3`}>
                {result.type === 'A' && <CheckCircle className="w-8 h-8" />}
                {result.type === 'B' && <AlertCircle className="w-8 h-8" />}
                {result.type === 'C' && <TrendingUp className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {result.description}
                </h2>
                <p className="text-gray-600 mb-4">
                  {result.details}
                </p>
                <p className="text-gray-700 font-medium">
                  {result.cta}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-6">
            <a
              href={`https://wa.me/5511999999999?text=${encodeURIComponent(result.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {result.buttonText}
            </a>
          </div>

          {/* Scientific Sources */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <h3 className="font-semibold mb-2">🔎 Fontes Científicas:</h3>
            <p>Gallup Global Workplace 2023 · Deloitte Future Workforce 2022 · PwC Financial Wellbeing 2022 · Harvard Business Review 2021 · OMS Saúde Mental 2022 · World Happiness Report 2023</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            💰 Descubra se o seu estilo de vida permite que você ganhe mais
          </h1>
          <p className="text-lg text-gray-600">
            Em 2 minutos, veja se o seu tempo e suas escolhas estão alinhados com a renda e a liberdade que você merece
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {questions[currentQuestion].text}
          </h2>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.score)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentQuestion > 0 && (
          <div className="text-center">
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QuizGanhos() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <QuizGanhosContent />
    </Suspense>
  )
}
