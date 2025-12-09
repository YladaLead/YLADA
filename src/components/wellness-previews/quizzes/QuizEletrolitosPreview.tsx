'use client'

import { useState } from 'react'
import { eletrolitosDiagnosticos } from '@/lib/diagnostics'

interface QuizEletrolitosPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizEletrolitosPreview({ etapa, onEtapaChange }: QuizEletrolitosPreviewProps) {
  const diagnosticos = eletrolitosDiagnosticos.wellness
  const totalEtapas = 6 // 0=landing, 1-5=perguntas, 6=resultados

  const handleNext = () => {
    onEtapaChange(Math.min(totalEtapas, etapa + 1))
  }

  const handlePrevious = () => {
    onEtapaChange(Math.max(0, etapa - 1))
  }

  const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']

  const perguntas = [
    {
      numero: 1,
      texto: 'Você sente cãibras musculares, fadiga ou desequilíbrio com frequência?',
      cor: 'cyan',
      opcoes: [
        'Sim, tenho esses sintomas frequentemente',
        'Sim, às vezes sinto esses problemas',
        'Raramente, mas já aconteceu',
        'Não, não tenho esses sintomas'
      ]
    },
    {
      numero: 2,
      texto: 'Você sente que precisa de ajuda para equilibrar seus eletrólitos?',
      cor: 'blue',
      opcoes: [
        'Sim, preciso muito de orientação profissional',
        'Sim, seria útil ter um acompanhamento',
        'Talvez, se for algo prático e eficaz',
        'Não, consigo equilibrar sozinho(a)'
      ]
    },
    {
      numero: 3,
      texto: 'Você valoriza produtos que ajudam a manter o equilíbrio eletrolítico?',
      cor: 'cyan',
      opcoes: [
        'Muito, é essencial para meu bem-estar',
        'Bastante, procuro opções adequadas',
        'Moderadamente, se for algo eficaz',
        'Pouco, não me preocupo muito'
      ]
    },
    {
      numero: 4,
      texto: 'Você acredita que um plano personalizado pode melhorar seu equilíbrio eletrolítico?',
      cor: 'blue',
      opcoes: [
        'Sim, faria toda diferença e melhoraria muito',
        'Sim, acredito que seria muito útil',
        'Talvez, se for algo comprovado e eficaz',
        'Não, não vejo necessidade'
      ]
    },
    {
      numero: 5,
      texto: 'Você está aberto(a) para ter um acompanhamento especializado em hidratação e eletrólitos?',
      cor: 'cyan',
      opcoes: [
        'Sim, é exatamente o que preciso!',
        'Sim, seria muito útil ter um acompanhamento',
        'Talvez, se for alguém experiente e confiável',
        'Não, prefiro fazer sozinho(a)'
      ]
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        ⚡ Preview do Diagnóstico de Eletrólitos - "Diagnóstico de Eletrólitos"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg border-2 border-cyan-200">
            <h4 className="text-xl font-bold text-gray-900 mb-2">⚡ Diagnóstico de Eletrólitos</h4>
            <p className="text-gray-700 mb-3">Descubra seu equilíbrio eletrolítico e como otimizá-lo</p>
            <p className="text-cyan-600 font-semibold">🚀 Uma avaliação personalizada para identificar desequilíbrios e criar estratégias eficazes.</p>
            <div className="bg-white rounded-lg p-4 mt-4 border border-cyan-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Possíveis desequilíbrios eletrolíticos</p>
                <p>✓ Como melhorar seu equilíbrio</p>
                <p>✓ Estratégias personalizadas</p>
                <p>✓ Produtos adequados ao seu perfil</p>
              </div>
            </div>
          </div>
        )}

        {/* Perguntas 1-5 */}
        {etapa >= 1 && etapa <= 5 && (
          <div className="space-y-6">
            {perguntas.map((pergunta) => {
              if (etapa === pergunta.numero) {
                const bgColor = {
                  cyan: 'bg-cyan-50',
                  blue: 'bg-blue-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  cyan: 'text-cyan-900',
                  blue: 'text-blue-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  cyan: 'border-cyan-300',
                  blue: 'border-blue-300'
                }[pergunta.cor] || 'border-gray-300'

                const badgeColor = {
                  cyan: 'bg-cyan-600',
                  blue: 'bg-blue-600'
                }[pergunta.cor] || 'bg-gray-600'

                return (
                  <div key={pergunta.numero} className={`${bgColor} p-4 rounded-lg border-2 ${borderColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        Pergunta {pergunta.numero} de 5
                      </span>
                      <span className="text-xs text-gray-600 font-medium">Diagnóstico de Eletrólitos</span>
                    </div>
                    <h4 className={`font-semibold ${textColor} mb-3`}>
                      {pergunta.numero}. {pergunta.texto}
                    </h4>
                    <div className="space-y-2">
                      {pergunta.opcoes.map((opcao, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:${borderColor}`}
                        >
                          <input type="radio" name={`eletrolitos-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      💡 Gatilho: Reflexão sobre sintomas e necessidade de orientação
                    </p>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Tela de Resultados - Etapa 6 */}
        {etapa === 6 && (
          <div className="space-y-6">
            <div className="text-center space-y-1 mb-6">
              <h4 className="text-xl font-bold text-gray-900">📊 Resultados Possíveis do Diagnóstico</h4>
              <p className="text-sm text-gray-600">
                Esta prévia mostra exatamente o que sua cliente receberá como diagnóstico final, baseado nas respostas que ela informar no formulário original.
              </p>
            </div>

            {/* Seção Azul Explicativa - Para o Dono */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-semibold mb-2">📋 O que acontece na ferramenta real:</p>
              <p className="text-sm text-blue-700 mb-2">
                A pessoa que preencher verá o diagnóstico abaixo correspondente às respostas dela.
              </p>
              <p className="text-sm text-blue-700">Em seguida, virá a seguinte mensagem:</p>
            </div>

            {/* CTA Simulado */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <p className="text-gray-700 font-medium mb-4 text-center text-lg">
                💬 Quer saber mais?
              </p>
              <div className="flex justify-center">
                <button
                  className="inline-flex items-center px-8 py-4 text-white rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-semibold shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
                  }}
                  disabled
                >
                  <span className="mr-2">✨</span>
                  Saiba Mais
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>
            
            {/* Resultado 1: Desequilíbrio Eletrolítico */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">⚡ Desequilíbrio Eletrolítico - Necessita Atenção</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">12-15 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.desequilibrioEletrolitico.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioEletrolitico.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioEletrolitico.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioEletrolitico.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioEletrolitico.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioEletrolitico.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.desequilibrioEletrolitico.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 2: Desequilíbrio Moderado */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">⚡ Possível Desequilíbrio Moderado</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">8-11 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.desequilibrioModerado.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioModerado.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioModerado.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioModerado.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioModerado.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.desequilibrioModerado.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.desequilibrioModerado.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 3: Equilíbrio Adequado */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">⚡ Equilíbrio Eletrolítico Adequado</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-7 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.equilibrioAdequado.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.equilibrioAdequado.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.equilibrioAdequado.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.equilibrioAdequado.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.equilibrioAdequado.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.equilibrioAdequado.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.equilibrioAdequado.proximoPasso}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navegação com Setinhas */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={etapa === 0}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          
          <div className="flex space-x-2 flex-wrap gap-2">
            {Array.from({ length: totalEtapas + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => onEtapaChange(i)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  etapa === i
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={labels[i] || `Etapa ${i}`}
              >
                {labels[i] || `${i}`}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={etapa === totalEtapas}
            className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}

