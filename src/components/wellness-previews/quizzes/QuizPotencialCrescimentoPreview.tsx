'use client'

import { useState } from 'react'
import { potencialCrescimentoDiagnosticos } from '@/lib/diagnostics'

interface QuizPotencialCrescimentoPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizPotencialCrescimentoPreview({ etapa, onEtapaChange }: QuizPotencialCrescimentoPreviewProps) {
  const diagnosticos = potencialCrescimentoDiagnosticos.wellness
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
      texto: 'Você sente que seu potencial está sendo bem aproveitado atualmente?',
      cor: 'green',
      opcoes: [
        'Não, sinto que tenho muito mais potencial não explorado',
        'Parcialmente, mas vejo muito espaço para crescimento',
        'Bastante, mas sempre posso melhorar',
        'Sim, sinto que estou aproveitando bem meu potencial'
      ]
    },
    {
      numero: 2,
      texto: 'Você está aberto(a) para conhecer caminhos que podem ajudar você a alcançar seu máximo potencial?',
      cor: 'emerald',
      opcoes: [
        'Sim, estou muito interessado(a) em descobrir!',
        'Sim, gostaria de conhecer opções de crescimento',
        'Talvez, se for algo que realmente me ajude',
        'Não, prefiro manter como está'
      ]
    },
    {
      numero: 3,
      texto: 'Você valoriza ter suporte e mentoria para acelerar seu crescimento pessoal e profissional?',
      cor: 'green',
      opcoes: [
        'Muito, é essencial para meu crescimento',
        'Bastante, acredito que faria diferença',
        'Moderadamente, pode ser útil',
        'Pouco, prefiro fazer sozinho(a)'
      ]
    },
    {
      numero: 4,
      texto: 'Você acredita que pode crescer trabalhando com algo que também ajuda outras pessoas a melhorarem de vida?',
      cor: 'emerald',
      opcoes: [
        'Sim, acredito muito nessa possibilidade!',
        'Sim, gostaria de entender como isso funciona',
        'Talvez, se for algo genuíno e comprovado',
        'Não, não acredito nisso'
      ]
    },
    {
      numero: 5,
      texto: 'Você está interessado(a) em conversar com quem te enviou este quiz sobre seu potencial de crescimento?',
      cor: 'green',
      opcoes: [
        'Sim, estou muito interessado(a) em saber mais!',
        'Sim, gostaria de entender melhor as possibilidades',
        'Talvez, se for algo que realmente possa me ajudar',
        'Não, não tenho interesse no momento'
      ]
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🌱 Preview - Quiz: Potencial e Crescimento
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-200">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🌱 Quiz: Potencial e Crescimento</h4>
            <p className="text-gray-700 mb-3">Descubra seu potencial de crescimento</p>
            <p className="text-green-600 font-semibold">🚀 Uma avaliação personalizada para entender suas oportunidades de desenvolvimento.</p>
            <div className="bg-white rounded-lg p-4 mt-4 border border-green-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Seu potencial de crescimento</p>
                <p>✓ Oportunidades de desenvolvimento</p>
                <p>✓ Insights personalizados</p>
                <p>✓ Caminhos para acelerar seu crescimento</p>
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
                      <span className="text-xs text-gray-600 font-medium">Potencial e Crescimento</span>
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
                          <input type="radio" name={`potencial-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      💡 Gatilho: Reflexão sobre desenvolvimento de potencial e abertura para crescimento
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
              <h4 className="text-xl font-bold text-gray-900">📊 Resultados Possíveis do Quiz</h4>
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
            
            {/* Resultado 1: Alto Potencial */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">🌱 Alto Potencial para Crescimento</h5>
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

            {/* Resultado 2: Potencial Moderado */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">🌱 Potencial Moderado para Desenvolvimento</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">8-11 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.potencialModerado.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.potencialModerado.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.potencialModerado.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.potencialModerado.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.potencialModerado.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.potencialModerado.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.potencialModerado.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 3: Bom Potencial */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-blue-900">🌱 Bom Potencial para Expansão</h5>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-7 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.bomPotencial.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.bomPotencial.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.bomPotencial.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.bomPotencial.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.bomPotencial.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.bomPotencial.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.bomPotencial.proximoPasso}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navegação */}
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

