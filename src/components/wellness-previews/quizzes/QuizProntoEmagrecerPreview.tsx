'use client'

import { useState } from 'react'
import { prontoEmagrecerDiagnosticos } from '@/lib/diagnostics'

interface QuizProntoEmagrecerPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizProntoEmagrecerPreview({ etapa, onEtapaChange }: QuizProntoEmagrecerPreviewProps) {
  const diagnosticos = prontoEmagrecerDiagnosticos.wellness
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
      texto: 'Você está pronto(a) para começar uma jornada de emagrecimento saudável?',
      cor: 'purple',
      opcoes: [
        'Sim, estou muito motivado(a) e pronto(a) para começar',
        'Sim, mas preciso de orientação para começar',
        'Talvez, se tiver um acompanhamento adequado',
        'Ainda não, preciso de mais informações'
      ]
    },
    {
      numero: 2,
      texto: 'Sobre tentativas de mudar peso ou hábito — o que mais descreve você?',
      cor: 'pink',
      opcoes: [
        'Histórico de ir e voltar ou frustração forte com balança/espelho',
        'Algumas tentativas sem manter consistência',
        'Retomada agora com mais consciência do que antes',
        'Início recente ou primeira vez encarando com método'
      ]
    },
    {
      numero: 3,
      texto: 'Rotina de refeições (horários e regularidade) — como está hoje?',
      cor: 'purple',
      opcoes: [
        'Muito irregular: improviso ou pular refeições é comum',
        'Falha em mais de um dia da semana',
        'Oscila, mas tem dias bem organizados',
        'Tenho base de horários na maior parte do tempo'
      ]
    },
    {
      numero: 4,
      texto: 'Sono, estresse e comer “por nervoso” — o que mais combina?',
      cor: 'pink',
      opcoes: [
        'Quase sempre: noites ruins ou dias em que como fora de fome real',
        'Frequentemente em semanas mais carregadas',
        'Às vezes; já percebo alguns gatilhos',
        'Raramente: comida segue fome e descanso razoável'
      ]
    },
    {
      numero: 5,
      texto: 'Que tipo de apoio faria mais sentido para você neste momento?',
      cor: 'purple',
      opcoes: [
        'Conversa para montar próximos passos realistas com quem entende o caso',
        'Clareza de etapas com acompanhamento em algumas semanas',
        'Material ou desafio para testar sozinho(a) com calma',
        'Só explorando informação, sem compromisso ainda'
      ]
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🎯 Preview - Pronto para Emagrecer com Saúde
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🎯 Pronto para Emagrecer com Saúde</h4>
            <p className="text-gray-700 mb-3">Descubra se você está pronto para começar sua jornada de emagrecimento</p>
            <p className="text-purple-600 font-semibold">🚀 Uma avaliação rápida para ver prontidão, rotina e sono/estresse na mesma foto.</p>
            <div className="bg-white rounded-lg p-4 mt-4 border border-purple-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Sua prontidão para emagrecer</p>
                <p>✓ Onde refeições e gatilhos emocionais entram na semana</p>
                <p>✓ Que tipo de apoio combina com você agora</p>
                <p>✓ Orientações alinhadas ao seu perfil</p>
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
                  purple: 'bg-purple-50',
                  pink: 'bg-pink-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  purple: 'text-purple-900',
                  pink: 'text-pink-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  purple: 'border-purple-300',
                  pink: 'border-pink-300'
                }[pergunta.cor] || 'border-gray-300'

                const badgeColor = {
                  purple: 'bg-purple-600',
                  pink: 'bg-pink-600'
                }[pergunta.cor] || 'bg-gray-600'

                return (
                  <div key={pergunta.numero} className={`${bgColor} p-4 rounded-lg border-2 ${borderColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        Pergunta {pergunta.numero} de 5
                      </span>
                      <span className="text-xs text-gray-600 font-medium">Pronto para Emagrecer</span>
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
                          <input type="radio" name={`emagrecer-${pergunta.numero}`} className="mr-3" disabled />
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
            
            {/* Resultado 1: Alto Potencial */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">🎯 Alto Potencial - Pronto para Emagrecer</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">12-15 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.altoPotencialEmagrecer.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmagrecer.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmagrecer.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmagrecer.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmagrecer.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmagrecer.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.altoPotencialEmagrecer.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 2: Pronto para Emagrecer */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">🎯 Pronto para Emagrecer</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">8-11 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.prontoParaEmagrecer.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaEmagrecer.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaEmagrecer.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaEmagrecer.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaEmagrecer.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.prontoParaEmagrecer.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.prontoParaEmagrecer.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 3: Precisa de Mais Informações */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-blue-900">🎯 Precisa de Mais Informações</h5>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-7 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.precisaMaisInformacoesEmagrecer.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoesEmagrecer.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoesEmagrecer.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoesEmagrecer.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoesEmagrecer.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.precisaMaisInformacoesEmagrecer.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.precisaMaisInformacoesEmagrecer.proximoPasso}</p>
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
                    ? 'bg-purple-600 text-white'
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
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}

