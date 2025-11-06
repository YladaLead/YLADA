'use client'

import { useState } from 'react'
import { avaliacaoInicialDiagnosticos } from '@/lib/diagnostics'

interface QuizAvaliacaoInicialPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizAvaliacaoInicialPreview({ etapa, onEtapaChange }: QuizAvaliacaoInicialPreviewProps) {
  const diagnosticos = avaliacaoInicialDiagnosticos.wellness
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
      texto: 'Você está pronto(a) para começar uma transformação na sua saúde e bem-estar?',
      cor: 'green',
      opcoes: [
        'Sim, estou muito motivado(a) e pronto(a) para começar',
        'Sim, mas preciso de orientação para começar',
        'Talvez, se tiver um acompanhamento adequado',
        'Ainda não, preciso de mais informações'
      ]
    },
    {
      numero: 2,
      texto: 'Você sente que precisa de ajuda profissional para alcançar seus objetivos?',
      cor: 'emerald',
      opcoes: [
        'Sim, preciso muito de orientação especializada',
        'Sim, seria muito útil ter um acompanhamento',
        'Talvez, se for algo prático e personalizado',
        'Não, consigo fazer sozinho(a)'
      ]
    },
    {
      numero: 3,
      texto: 'Você valoriza ter um plano personalizado baseado no seu perfil e objetivos?',
      cor: 'green',
      opcoes: [
        'Muito, é essencial para ter resultados',
        'Bastante, acredito que faria diferença',
        'Moderadamente, se for algo eficaz',
        'Pouco, prefiro seguir padrões gerais'
      ]
    },
    {
      numero: 4,
      texto: 'Você acredita que produtos de qualidade e acompanhamento podem acelerar seus resultados?',
      cor: 'emerald',
      opcoes: [
        'Sim, absolutamente! É o que estou procurando',
        'Sim, acredito que pode fazer diferença',
        'Talvez, se for algo comprovado e eficaz',
        'Não, não vejo necessidade'
      ]
    },
    {
      numero: 5,
      texto: 'Você está aberto(a) para ter um mentor que te guie em sua jornada de transformação?',
      cor: 'green',
      opcoes: [
        'Sim, é exatamente o que preciso!',
        'Sim, seria muito útil ter um mentor',
        'Talvez, se for alguém experiente e confiável',
        'Não, prefiro seguir sozinho(a)'
      ]
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🌟 Preview da Avaliação Inicial - "Avaliação Inicial"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🌟 Avaliação Inicial</h4>
            <p className="text-gray-700 mb-3">Descubra como podemos ajudar na sua transformação</p>
            <p className="text-green-600 font-semibold">🚀 Uma avaliação rápida para entender seu perfil e criar um plano personalizado.</p>
            <div className="bg-white rounded-lg p-4 mt-4 border border-green-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Seu perfil e necessidades</p>
                <p>✓ Como podemos te ajudar</p>
                <p>✓ Recomendações personalizadas</p>
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
                  green: 'bg-green-50',
                  emerald: 'bg-emerald-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  green: 'text-green-900',
                  emerald: 'text-emerald-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  green: 'border-green-300',
                  emerald: 'border-emerald-300'
                }[pergunta.cor] || 'border-gray-300'

                const badgeColor = {
                  green: 'bg-green-600',
                  emerald: 'bg-emerald-600'
                }[pergunta.cor] || 'bg-gray-600'

                return (
                  <div key={pergunta.numero} className={`${bgColor} p-4 rounded-lg border-2 ${borderColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        Pergunta {pergunta.numero} de 5
                      </span>
                      <span className="text-xs text-gray-600 font-medium">Avaliação Inicial</span>
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
                          <input type="radio" name={`inicial-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      💡 Gatilho: Reflexão sobre prontidão e necessidade de orientação
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
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis da Avaliação</h4>
            
            {/* Resultado 1: Alto Potencial */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">🌟 Alto Potencial - Pronto para Transformação</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">12-15 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.altoPotencial.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencial.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencial.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencial.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencial.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencial.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.altoPotencial.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 2: Pronto para Transformação */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">🌟 Pronto para Transformação</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">8-11 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.prontoParaTransformacao.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaTransformacao.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaTransformacao.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaTransformacao.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaTransformacao.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaTransformacao.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.prontoParaTransformacao.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 3: Precisa de Mais Informações */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-blue-900">🌟 Precisa de Mais Informações</h5>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-7 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.precisaMaisInformacoes.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoes.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoes.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoes.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoes.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoes.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.precisaMaisInformacoes.proximoPasso}</p>
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
                    ? 'bg-green-600 text-white'
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
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}

