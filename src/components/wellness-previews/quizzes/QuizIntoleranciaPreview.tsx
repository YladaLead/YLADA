'use client'

import { useState } from 'react'
import { intoleranciaDiagnosticos } from '@/lib/diagnostics'

interface QuizIntoleranciaPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizIntoleranciaPreview({ etapa, onEtapaChange }: QuizIntoleranciaPreviewProps) {
  const diagnosticos = intoleranciaDiagnosticos.wellness
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
      texto: 'Você sente desconforto digestivo após consumir certos alimentos?',
      cor: 'orange',
      opcoes: [
        'Sempre, me sinto muito mal',
        'Frequentemente, tenho vários desconfortos',
        'Às vezes, depende do alimento',
        'Raramente ou nunca sinto desconforto'
      ]
    },
    {
      numero: 2,
      texto: 'Você já percebeu que alguns alimentos causam inchaço, gases ou dores abdominais?',
      cor: 'red',
      opcoes: [
        'Sim, tenho esses sintomas regularmente',
        'Sim, acontece com alguns alimentos específicos',
        'Às vezes, mas não sei identificar o que causa',
        'Não, não tenho esses sintomas'
      ]
    },
    {
      numero: 3,
      texto: 'Você sente que precisa de ajuda para identificar alimentos que te fazem mal?',
      cor: 'amber',
      opcoes: [
        'Sim, preciso muito de orientação profissional',
        'Sim, seria útil ter um acompanhamento',
        'Talvez, se for algo prático e personalizado',
        'Não, consigo identificar sozinho(a)'
      ]
    },
    {
      numero: 4,
      texto: 'Você valoriza produtos alimentares que sejam seguros e adequados para seu organismo?',
      cor: 'orange',
      opcoes: [
        'Muito, é essencial para minha saúde',
        'Bastante, procuro opções adequadas',
        'Moderadamente, mas não priorizo',
        'Pouco, não me preocupo muito'
      ]
    },
    {
      numero: 5,
      texto: 'Você sente que ter um plano alimentar personalizado faria diferença na sua qualidade de vida?',
      cor: 'red',
      opcoes: [
        'Sim, faria toda diferença e melhoraria muito',
        'Sim, acredito que seria muito útil',
        'Talvez, se for algo prático e eficaz',
        'Não, não vejo necessidade'
      ]
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🔍 Preview da Avaliação de Intolerância - "Avaliação de Intolerância Alimentar"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border-2 border-orange-200">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🔍 Avaliação de Intolerância Alimentar</h4>
            <p className="text-gray-700 mb-3">Descubra se você tem intolerâncias ou sensibilidades alimentares</p>
            <p className="text-orange-600 font-semibold">🚀 Uma avaliação personalizada para identificar alimentos que podem estar afetando seu bem-estar.</p>
            <div className="bg-white rounded-lg p-4 mt-4 border border-orange-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Possíveis intolerâncias alimentares</p>
                <p>✓ Alimentos que causam desconforto</p>
                <p>✓ Estratégias personalizadas para seu perfil</p>
                <p>✓ Produtos adequados ao seu organismo</p>
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
                  orange: 'bg-orange-50',
                  red: 'bg-red-50',
                  amber: 'bg-amber-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  orange: 'text-orange-900',
                  red: 'text-red-900',
                  amber: 'text-amber-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  orange: 'border-orange-300',
                  red: 'border-red-300',
                  amber: 'border-amber-300'
                }[pergunta.cor] || 'border-gray-300'

                const badgeColor = {
                  orange: 'bg-orange-600',
                  red: 'bg-red-600',
                  amber: 'bg-amber-600'
                }[pergunta.cor] || 'bg-gray-600'

                return (
                  <div key={pergunta.numero} className={`${bgColor} p-4 rounded-lg border-2 ${borderColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        Pergunta {pergunta.numero} de 5
                      </span>
                      <span className="text-xs text-gray-600 font-medium">Avaliação de Intolerância</span>
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
                          <input type="radio" name={`intolerancia-${pergunta.numero}`} className="mr-3" disabled />
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
              <h4 className="text-xl font-bold text-gray-900">📊 Resultados Possíveis da Avaliação</h4>
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
            
            {/* Resultado 1: Alta Suspeita */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">🔍 Alta Suspeita de Intolerância</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">12-15 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.altaSuspeitaIntolerancia.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altaSuspeitaIntolerancia.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altaSuspeitaIntolerancia.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altaSuspeitaIntolerancia.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altaSuspeitaIntolerancia.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altaSuspeitaIntolerancia.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.altaSuspeitaIntolerancia.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 2: Intolerância Moderada */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">🔍 Possível Intolerância Moderada</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">8-11 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.intoleranciaModerada.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.intoleranciaModerada.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.intoleranciaModerada.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.intoleranciaModerada.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.intoleranciaModerada.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.intoleranciaModerada.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.intoleranciaModerada.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 3: Baixa Probabilidade */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">🔍 Baixa Probabilidade</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-7 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.baixaProbabilidadeIntolerancia.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.baixaProbabilidadeIntolerancia.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.baixaProbabilidadeIntolerancia.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.baixaProbabilidadeIntolerancia.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.baixaProbabilidadeIntolerancia.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.baixaProbabilidadeIntolerancia.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.baixaProbabilidadeIntolerancia.proximoPasso}</p>
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
                    ? 'bg-orange-600 text-white'
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
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}

