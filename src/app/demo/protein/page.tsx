'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MessageCircle, Info } from 'lucide-react'

export default function ProteinDemoPage() {
  const router = useRouter()
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => router.push('/fitlead')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para FitLead
            </button>
            <div className="text-sm text-gray-500">
              🎯 Demonstração - Calculadora de Proteína
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Explicação da Demonstração */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                🎯 Área de Demonstração
              </h3>
              <p className="text-yellow-700 mb-3">
                Esta é uma <strong>demonstração</strong> de como ficará a ferramenta quando você criar seus links personalizados.
              </p>
              <div className="bg-white rounded-lg p-4 border border-yellow-300">
                <h4 className="font-semibold text-gray-900 mb-2">📱 Como Funciona o Botão Personalizado:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>Texto do botão:</strong> Você escolhe (ex: "Saiba Mais", "Falar com Especialista")</li>
                  <li>• <strong>Redirecionamento:</strong> Pode ser WhatsApp, seu site, formulário, etc.</li>
                  <li>• <strong>URL personalizada:</strong> fitlead.ylada.com/seu-nome/nome-do-projeto</li>
                  <li>• <strong>Mensagem personalizada:</strong> Aparece antes do botão</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Simulação da Ferramenta */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Calculadora de Proteína
            </h1>
            <p className="text-gray-600">
              Calcule suas necessidades diárias de proteína baseadas em seus objetivos
            </p>
          </div>

          {/* Formulário de Demonstração */}
          <div className="max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 70"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Atividade
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>Sedentário</option>
                  <option>Levemente ativo</option>
                  <option>Moderadamente ativo</option>
                  <option>Muito ativo</option>
                  <option>Extremamente ativo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>Manter peso</option>
                  <option>Perder peso</option>
                  <option>Ganhar massa muscular</option>
                </select>
              </div>

              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 font-semibold"
              >
                Calcular Necessidades
              </button>
            </div>
          </div>

          {/* Resultado Simulado */}
          {showExplanation && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                🥩 Suas Necessidades de Proteína
              </h3>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">140g</div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">Proteína por dia</div>
                  <p className="text-gray-600 text-sm">
                    Baseado no seu peso e objetivo de ganhar massa muscular. Distribua ao longo do dia em 4-6 refeições.
                  </p>
                </div>
              </div>

              {/* Simulação do Botão Personalizado */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  🎯 Aqui apareceria seu botão personalizado:
                </h4>
                
                {/* Mensagem Personalizada */}
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Sua mensagem personalizada:</strong><br/>
                    "Quer um plano alimentar completo com essas quantidades de proteína? Fale comigo!"
                  </p>
                </div>

                {/* Botão Personalizado */}
                <div className="flex justify-center">
                  <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold text-lg flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Quero meu Plano Alimentar
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  <p>🔗 Este botão redirecionaria para:</p>
                  <p className="font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                    https://wa.me/5511999999999
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Informações Adicionais */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Como Usar Esta Ferramenta
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Crie seu Link</h3>
              <p className="text-gray-600 text-sm">
                No dashboard, crie um link personalizado para esta ferramenta
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalize</h3>
              <p className="text-gray-600 text-sm">
                Escolha o texto do botão e para onde redirecionar (WhatsApp, site, etc.)
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Compartilhe</h3>
              <p className="text-gray-600 text-sm">
                Compartilhe sua URL personalizada e colete leads qualificados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}