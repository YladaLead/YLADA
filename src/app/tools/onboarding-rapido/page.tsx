'use client'
import { useState } from 'react'
import { CheckCircle, Circle, Users, Target, Zap } from 'lucide-react'

export default function OnboardingRapidoPage() {
  const [steps, setSteps] = useState([
    { id: 1, title: 'Cadastro no sistema', description: 'Complete seu cadastro como distribuidor', completed: false },
    { id: 2, title: 'Treinamento inicial', description: 'Assista aos vídeos de treinamento', completed: false },
    { id: 3, title: 'Primeira compra', description: 'Faça sua primeira compra de produtos', completed: false },
    { id: 4, title: 'Criar perfil profissional', description: 'Configure seu perfil no sistema', completed: false },
    { id: 5, title: 'Primeira venda', description: 'Realize sua primeira venda', completed: false },
    { id: 6, title: 'Convidar primeiro cliente', description: 'Convide alguém para ser seu cliente', completed: false },
    { id: 7, title: 'Plano de crescimento', description: 'Defina seus objetivos e metas', completed: false }
  ])

  const toggleStep = (stepId: number) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ))
  }

  const getCompletionRate = () => {
    const completed = steps.filter(step => step.completed).length
    return Math.round((completed / steps.length) * 100)
  }

  const getMotivationalMessage = () => {
    const rate = getCompletionRate()
    if (rate === 100) return { message: "Parabéns! Você completou o onboarding!", color: "text-green-600" }
    if (rate >= 75) return { message: "Excelente progresso! Quase lá!", color: "text-blue-600" }
    if (rate >= 50) return { message: "Bom trabalho! Continue assim!", color: "text-yellow-600" }
    if (rate >= 25) return { message: "Bom começo! Vamos acelerar!", color: "text-orange-600" }
    return { message: "Vamos começar sua jornada!", color: "text-gray-600" }
  }

  const motivationalData = getMotivationalMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Onboarding Rápido
            </h1>
            <p className="text-gray-600">
              Complete os 7 passos para começar sua jornada como distribuidor
            </p>
          </div>

          {/* Progresso Geral */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6" />
                <span className="text-xl font-semibold">Seu Progresso</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{getCompletionRate()}%</div>
                <div className="text-sm opacity-90">
                  {steps.filter(s => s.completed).length}/{steps.length} passos
                </div>
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

          {/* Lista de Passos */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Passos para Começar
            </h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    step.completed
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="flex-shrink-0"
                    >
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">
                          Passo {step.id}
                        </span>
                        {step.completed && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Concluído
                          </span>
                        )}
                      </div>
                      <h3 className={`font-semibold ${step.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${step.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sua Jornada
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {steps.filter(s => s.completed).length}
                </div>
                <div className="text-sm text-gray-600">Passos Concluídos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {steps.length - steps.filter(s => s.completed).length}
                </div>
                <div className="text-sm text-gray-600">Passos Restantes</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <button
              onClick={() => window.open('https://wa.me/55119818680', '_blank')}
              className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Falar com meu mentor</span>
            </button>
            
            <button
              onClick={() => window.open('https://wa.me/55119818680', '_blank')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Começar minha jornada</span>
            </button>
            
            <p className="text-center text-sm text-gray-500">
              Cada passo te aproxima do sucesso!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
