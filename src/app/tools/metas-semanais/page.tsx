'use client'

import { useState } from 'react'
import SpecialistCTA from '@/components/SpecialistCTA'
import { Target, Plus, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react'

export default function MetasSemanaisPage() {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Beber 2L de água por dia', completed: false },
    { id: 2, text: 'Tomar shake todos os dias', completed: false },
    { id: 3, text: 'Fazer exercícios 3x na semana', completed: false }
  ])
  const [newGoal, setNewGoal] = useState('')

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { 
        id: Date.now(), 
        text: newGoal.trim(), 
        completed: false 
      }])
      setNewGoal('')
    }
  }

  const toggleGoal = (id: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ))
  }

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const getCompletionRate = () => {
    if (goals.length === 0) return 0
    const completed = goals.filter(goal => goal.completed).length
    return Math.round((completed / goals.length) * 100)
  }

  const getMotivationalMessage = () => {
    const rate = getCompletionRate()
    if (rate === 100) return { message: "Perfeito! Você completou todas as metas!", color: "text-green-600" }
    if (rate >= 75) return { message: "Excelente progresso! Quase lá!", color: "text-blue-600" }
    if (rate >= 50) return { message: "Bom trabalho! Continue assim!", color: "text-yellow-600" }
    if (rate >= 25) return { message: "Bom começo! Vamos acelerar!", color: "text-orange-600" }
    return { message: "Vamos começar! Defina suas metas!", color: "text-gray-600" }
  }

  const motivationalData = getMotivationalMessage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Metas Semanais de Saúde
            </h1>
            <p className="text-gray-600">
              Defina e acompanhe suas metas para esta semana
            </p>
          </div>

          {/* Progresso Geral */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6" />
                <span className="text-xl font-semibold">Progresso da Semana</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{getCompletionRate()}%</div>
                <div className="text-sm opacity-90">
                  {goals.filter(g => g.completed).length}/{goals.length} metas
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

          {/* Adicionar Nova Meta */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Adicionar Nova Meta
            </h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Ex: Caminhar 30min por dia"
                className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              />
              <button
                onClick={addGoal}
                className="bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          {/* Lista de Metas */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Suas Metas ({goals.length})
            </h2>
            {goals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma meta definida ainda.</p>
                <p className="text-sm">Adicione suas primeiras metas acima!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      goal.completed
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-emerald-500 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleGoal(goal.id)}
                        className="flex-shrink-0"
                      >
                        {goal.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-400 rounded-full" />
                        )}
                      </button>
                      <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {goal.text}
                      </span>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Estatísticas da Semana
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {goals.filter(g => g.completed).length}
                </div>
                <div className="text-sm text-gray-600">Metas Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {goals.length - goals.filter(g => g.completed).length}
                </div>
                <div className="text-sm text-gray-600">Metas Pendentes</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <button
              onClick={() => window.open('https://wa.me/55119818680', '_blank')}
              className="w-full bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Compartilhar meu progresso</span>
            </button>
            
            <button
              onClick={() => window.open('https://wa.me/55119818680', '_blank')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Falar com meu distribuidor</span>
            </button>
            
            <p className="text-center text-sm text-gray-500">
              Mantenha o foco e alcance suas metas!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
