'use client'

import { useState } from 'react'
import SpecialistCTA from '@/components/SpecialistCTA'
import { CheckCircle, Circle, Heart, Zap, Moon, Sun, ArrowRight } from 'lucide-react'

export default function BemEstarDiarioPage() {
  const [habits, setHabits] = useState({
    sono: false,
    hidratacao: false,
    alimentacao: false,
    exercicio: false,
    energia: false,
    estresse: false
  })

  const [energyLevel, setEnergyLevel] = useState(0)
  const [moodLevel, setMoodLevel] = useState(0)

  const toggleHabit = (habit: keyof typeof habits) => {
    setHabits(prev => ({
      ...prev,
      [habit]: !prev[habit]
    }))
  }

  const getScore = () => {
    const habitScore = Object.values(habits).filter(Boolean).length
    const energyScore = energyLevel
    const moodScore = moodLevel
    return habitScore + energyScore + moodScore
  }

  const getScoreMessage = () => {
    const score = getScore()
    if (score >= 8) return { message: "Excelente! Você está no caminho certo!", color: "text-green-600" }
    if (score >= 5) return { message: "Bom! Continue assim!", color: "text-blue-600" }
    if (score >= 3) return { message: "Pode melhorar! Vamos focar nos hábitos!", color: "text-yellow-600" }
    return { message: "Vamos trabalhar juntos para melhorar!", color: "text-red-600" }
  }

  const scoreData = getScoreMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tabela do Bem-Estar Diário
            </h1>
            <p className="text-gray-600">
              Acompanhe seus hábitos saudáveis e veja sua evolução
            </p>
          </div>
          
          {/* Hábitos Saudáveis */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Hábitos Saudáveis de Hoje
            </h2>
            <div className="space-y-3">
              {[
                { key: 'sono', label: 'Dormi 7-8 horas', icon: <Moon className="w-5 h-5" /> },
                { key: 'hidratacao', label: 'Bebi 2L de água', icon: <Sun className="w-5 h-5" /> },
                { key: 'alimentacao', label: 'Comi frutas e verduras', icon: <Heart className="w-5 h-5" /> },
                { key: 'exercicio', label: 'Fiz exercícios físicos', icon: <Zap className="w-5 h-5" /> }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => toggleHabit(key as keyof typeof habits)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                    habits[key as keyof typeof habits]
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {habits[key as keyof typeof habits] ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                  {icon}
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Níveis */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Energia */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Nível de Energia
                </h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setEnergyLevel(level)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                        energyLevel === level
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 hover:border-yellow-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Nível {level}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Humor */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Nível de Humor
                </h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setMoodLevel(level)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                        moodLevel === level
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4" />
                        <span>Nível {level}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Seu Resultado de Hoje
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {getScore()}/10
              </div>
              <p className={`text-lg font-medium ${scoreData.color}`}>
                {scoreData.message}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <button
              onClick={() => window.open('https://wa.me/55119818680', '_blank')}
              className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-5 h-5" />
              <span>Descubra como melhorar seus resultados em 7 dias</span>
            </button>
            
            <p className="text-center text-sm text-gray-500">
              Compartilhe seus resultados e receba dicas personalizadas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
