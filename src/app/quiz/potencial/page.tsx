'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'

function QuizPotencialContent() {
  const searchParams = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [totalScore, setTotalScore] = useState(0)

  const questions = [
    {
      id: 1,
      text: "Você sente que está crescendo na velocidade que gostaria?",
      options: [
        { text: "Sim, totalmente.", score: 5 },
        { text: "Um pouco.", score: 15 },
        { text: "Às vezes me sinto travado.", score: 25 },
        { text: "Não, sinto que posso muito mais.", score: 30 }
      ]
    },
    {
      id: 2,
      text: "Você acredita que suas habilidades estão sendo usadas no máximo?",
      options: [
        { text: "Sim.", score: 5 },
        { text: "Em parte.", score: 15 },
        { text: "Não totalmente.", score: 25 },
        { text: "Nada do que sei é aproveitado.", score: 30 }
      ]
    },
    {
      id: 3,
      text: "Você se sente reconhecido pelo que entrega?",
      options: [
        { text: "Sempre.", score: 5 },
        { text: "Às vezes.", score: 15 },
        { text: "Raramente.", score: 25 },
        { text: "Nunca.", score: 30 }
      ]
    },
    {
      id: 4,
      text: "Você costuma aprender coisas novas no seu trabalho ou rotina?",
      options: [
        { text: "Sempre.", score: 5 },
        { text: "Ocasionalmente.", score: 15 },
        { text: "Quase nunca.", score: 25 },
        { text: "Nunca.", score: 30 }
      ]
    },
    {
      id: 5,
      text: "Quando pensa no futuro, você se sente animado com o que está construindo?",
      options: [
        { text: "Sim.", score: 5 },
        { text: "Parcialmente.", score: 15 },
        { text: "Em dúvida.", score: 25 },
        { text: "Preocupado.", score: 30 }
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
        title: 'Potencial Desperto',
        description: 'Você está num bom momento de desenvolvimento!',
        details: 'Estudos da Universidade de Stanford mostram que pessoas que continuam se desafiando e aprendendo algo novo a cada trimestre aumentam em até 38% o desempenho e a satisfação pessoal.',
        cta: 'Quer descobrir como aplicar seu potencial em algo que também gere renda e propósito?',
        buttonText: 'Quero despertar meu potencial 🌱',
        whatsappMessage: 'Oi! Fiz o teste de potencial e quero descobrir como posso usar melhor minhas habilidades para crescer. Pode me mostrar como expandir meu potencial?',
        color: 'green'
      }
    } else if (totalScore <= 99) {
      return {
        type: 'B',
        title: 'Potencial Adormecido',
        description: 'Você tem um bom potencial, mas talvez não esteja sendo totalmente aproveitado.',
        details: 'Um estudo da Gallup (2023) mostrou que 79% das pessoas não se sentem desafiadas no trabalho — e é exatamente aí que começa o desejo de expansão.',
        cta: 'Quer ver um exemplo real de quem fez isso e cresceu muito?',
        buttonText: 'Quero acelerar meu crescimento 💡',
        whatsappMessage: 'Oi! Fiz o teste e percebi que posso usar melhor o que já sei. Quero ver esse exemplo real de quem cresceu muito. Pode me mostrar?',
        color: 'yellow'
      }
    } else {
      return {
        type: 'C',
        title: 'Potencial Bloqueado',
        description: 'Você tem talentos, ideias e energia — mas parece que o ambiente atual não está te ajudando a crescer.',
        details: 'Segundo a Deloitte (2022), 7 em cada 10 pessoas com alto potencial acabam travadas por rotina e falta de reconhecimento.',
        cta: 'Quer conhecer um projeto leve e paralelo pra expandir seu potencial?',
        buttonText: 'Quero quebrar essas barreiras 🌿',
        whatsappMessage: 'Oi! Vi no meu resultado que posso expandir meu potencial e quero conhecer esse projeto paralelo que pode me ajudar a crescer. Pode me mostrar como funciona?',
        color: 'red'
      }
    }
  }

  const result = getResult()
  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🌱 Seu Resultado: {result.title}
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🌱 Descubra se o seu potencial está sendo bem aproveitado
          </h1>
          <p className="text-lg text-gray-600">
            Em 2 minutos, veja se o que você faz hoje está te levando ao seu verdadeiro nível de crescimento
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
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
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
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
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

export default function QuizPotencial() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <QuizPotencialContent />
    </Suspense>
  )
}
