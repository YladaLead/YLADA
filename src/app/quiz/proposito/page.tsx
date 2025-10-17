'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

function QuizPropositoContent() {
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  const questions = [
    {
      id: 1,
      text: "Seu trabalho te deixa feliz ao final do dia?",
      options: [
        { text: "Sempre.", score: 5 },
        { text: "Às vezes.", score: 15 },
        { text: "Raramente.", score: 25 },
        { text: "Nunca.", score: 30 }
      ]
    },
    {
      id: 2,
      text: "Você sente que o que faz tem propósito real?",
      options: [
        { text: "Sim, totalmente.", score: 5 },
        { text: "Parcialmente.", score: 15 },
        { text: "Pouco.", score: 25 },
        { text: "Não.", score: 30 }
      ]
    },
    {
      id: 3,
      text: "Sua rotina permite cuidar de você mesmo (saúde, lazer, família)?",
      options: [
        { text: "Sim.", score: 5 },
        { text: "Às vezes.", score: 15 },
        { text: "Raramente.", score: 25 },
        { text: "Nunca.", score: 30 }
      ]
    },
    {
      id: 4,
      text: "Quando foi a última vez que você aprendeu algo novo só por prazer?",
      options: [
        { text: "Essa semana.", score: 5 },
        { text: "Há meses.", score: 15 },
        { text: "Há anos.", score: 25 },
        { text: "Nem lembro.", score: 30 }
      ]
    },
    {
      id: 5,
      text: "Você sente que está vivendo no automático?",
      options: [
        { text: "Não.", score: 5 },
        { text: "Um pouco.", score: 15 },
        { text: "Sim.", score: 25 },
        { text: "Totalmente.", score: 30 }
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
        title: 'Vida em Equilíbrio',
        description: 'Você está conseguindo equilibrar bem suas áreas — parabéns!',
        details: 'Estudos de Harvard (2021) mostram que pessoas com alta clareza de propósito vivem 7 anos a mais em média.',
        cta: 'Quer conhecer formas de multiplicar esse equilíbrio e ajudar outras pessoas a alcançarem também?',
        buttonText: 'Quero multiplicar meu impacto 💚',
        whatsappMessage: 'Oi! Fiz o teste de propósito e quero saber como posso multiplicar esse equilíbrio ajudando outras pessoas a alcançarem também. Pode me mostrar como funciona?',
        color: 'green'
      }
    } else if (totalScore <= 99) {
      return {
        type: 'B',
        title: 'Buscando Propósito',
        description: 'Você tem um bom ritmo, mas sente falta de significado.',
        details: 'Segundo o World Happiness Report, o propósito é o maior indicador de bem-estar a longo prazo.',
        cta: 'Quer conhecer uma forma de unir propósito e resultado, mesmo dedicando poucas horas por semana?',
        buttonText: 'Quero encontrar meu propósito 💫',
        whatsappMessage: 'Oi! Quero saber como unir propósito e resultado do jeito que o teste sugeriu, mesmo dedicando poucas horas por semana. Pode me mostrar como funciona?',
        color: 'yellow'
      }
    } else {
      return {
        type: 'C',
        title: 'Vida no Automático',
        description: 'Você está cumprindo tarefas, mas talvez tenha perdido o brilho de fazer algo que te inspira.',
        details: 'Estudos da Gallup mostram que o engajamento emocional com o que fazemos impacta diretamente saúde e felicidade.',
        cta: 'Quer descobrir um projeto leve que devolve energia, liberdade e sentido?',
        buttonText: 'Quero resgatar minha vida 🌞',
        whatsappMessage: 'Oi! Vi que preciso resgatar meu propósito e quero conhecer esse projeto leve que pode devolver energia, liberdade e sentido para minha vida. Pode me mostrar como funciona?',
        color: 'red'
      }
    }
  }

  const result = getResult()
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              💫 Seu Resultado: {result.title}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            💫 Descubra se o seu dia a dia está alinhado com a vida que você sonha
          </h1>
          <p className="text-lg text-gray-600">
            Em poucos minutos, descubra se você está equilibrando bem tempo, propósito e resultados
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
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
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

export default function QuizProposito() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <QuizPropositoContent />
    </Suspense>
  )
}
