'use client'

import { useState } from 'react'
import { CheckCircle, Circle, Droplets, Coffee, Walking, Share2, Trophy, ArrowRight } from 'lucide-react'

export default function Desafio7DiasPage() {
  const [currentDay, setCurrentDay] = useState(0)
  const [habits, setHabits] = useState<{[key: string]: boolean}>({})
  
  const days = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ]

  const dailyHabits = [
    { key: 'agua', label: 'Beber 2L de água', icon: <Droplets className="w-5 h-5" />, points: 2 },
    { key: 'shake', label: 'Tomar shake Herbalife', icon: <Coffee className="w-5 h-5" />, points: 3 },
    { key: 'caminhada', label: 'Fazer 30min de caminhada', icon: <Walking className="w-5 h-5" />, points: 2 },
    { key: 'compartilhar', label: 'Compartilhar progresso', icon: <Share2 className="w-5 h-5" />, points: 1 }
  ]

  const toggleHabit = (habitKey: string) => {
    const habitId = `${currentDay}-${habitKey}`
    setHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }))
  }

  const getDayScore = (day: number) => {
    return dailyHabits.reduce((score, habit) => {
      const habitId = `${day}-${habit.key}`
      return score + (habits[habitId] ? habit.points : 0)
    }, 0)
  }

  const getTotalScore = () => {
    return days.reduce((total, _, day) => total + getDayScore(day), 0)
  }

  const getMaxScore = () => {
    return days.length * dailyHabits.reduce((sum, habit) => sum + habit.points, 0)
  }

  const getCompletionRate = () => {
    return Math.round((getTotalScore() / getMaxScore()) * 100)
  }

  const getMotivationalMessage = () => {
    const rate = getCompletionRate()
    if (rate >= 80) return { message: "Incrível! Você está dominando o desafio!", color: "text-green-600" }
    if (rate >= 60) return { message: "Ótimo progresso! Continue assim!", color: "text-blue-600" }
    if (rate >= 40) return { message: "Bom começo! Vamos acelerar!", color: "text-yellow-600" }
    return { message: "Vamos começar! Cada dia conta!", color: "text-orange-600" }
  }

  const motivationalData = getMotivationalMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Desafio de 7 Dias
            </h1>
            <p className="text-gray-600">
              Complete os hábitos diários e acompanhe sua evolução
            </p>
          </div>

          {/* Progresso Geral */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6" />
                <span className="text-xl font-semibold">Seu Progresso</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{getTotalScore()}/{getMaxScore()}</div>
                <div className="text-sm opacity-90">{getCompletionRate()}% completo</div>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionRate()}%` }}
              />
            </div>
            <p className={`text-center mt-3 font-medium ${motivationalData.color.replace('text-', 'text-white/')}`}>
              {motivationalData.message}
            </p>
          </div>

          {/* Navegação dos Dias */}
          <div className="mb-8">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDay(index)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                    currentDay === index
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                  <div className="text-xs mt-1">
                    {getDayScore(index)} pts
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hábitos do Dia Atual */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Hábitos de {days[currentDay]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyHabits.map((habit) => {
                const habitId = `${currentDay}-${habit.key}`
                const isCompleted = habits[habitId]
                
                return (
                  <button
                    key={habit.key}
                    onClick={() => toggleHabit(habit.key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isCompleted
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                      {habit.icon}
                      <div className="text-left">
                        <div className="font-medium">{habit.label}</div>
                        <div className="text-sm text-gray-500">{habit.points} pontos</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Resumo da Semana */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo da Semana
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium text-gray-700">{day}</div>
                  <div className="text-lg font-bold text-emerald-600">{getDayScore(index)}</div>
                  <div className="text-xs text-gray-500">pts</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <button
              onClick={() => window.open('https://wa.me/55119818680', '_blank')}
              className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Compartilhar meu resultado</span>
            </button>
            
            <button
              onClick={() => window.open('https://wa.me/55119818680', '_blank')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Falar com meu distribuidor</span>
            </button>
            
            <p className="text-center text-sm text-gray-500">
              Continue o desafio e mantenha seus hábitos saudáveis!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
