'use client'

import { useState } from 'react'
import { avaliacaoEmocionalDiagnosticos } from '@/lib/diagnostics'

interface QuizEmocionalPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizEmocionalPreview({ etapa, onEtapaChange }: QuizEmocionalPreviewProps) {
  const diagnosticos = avaliacaoEmocionalDiagnosticos.wellness
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
      texto: 'Como você se sente em relação à sua autoestima hoje?',
      cor: 'pink',
      opcoes: [
        'Baixa, tenho dificuldades com minha imagem',
        'Média, algumas vezes me sinto inseguro(a)',
        'Boa, geralmente me sinto bem comigo mesmo(a)',
        'Excelente, me sinto muito confiante'
      ]
    },
    {
      numero: 2,
      texto: 'Quanto você se sente motivado(a) para cuidar da sua saúde e bem-estar?',
      cor: 'purple',
      opcoes: [
        'Pouco motivado(a), tenho dificuldades para começar',
        'Moderadamente, mas preciso de incentivo',
        'Muito motivado(a), já tenho alguns hábitos',
        'Extremamente motivado(a), estou sempre buscando melhorar'
      ]
    },
    {
      numero: 3,
      texto: 'Como você lida com os desafios e obstáculos da vida?',
      cor: 'rose',
      opcoes: [
        'Tenho dificuldades, me sinto sobrecarregado(a)',
        'Às vezes consigo, mas preciso de suporte',
        'Consigo lidar bem na maioria das vezes',
        'Lido muito bem, vejo desafios como oportunidades'
      ]
    },
    {
      numero: 4,
      texto: 'Corpo, descanso e mente — o que mais pesa quando você quer se sentir melhor?',
      cor: 'fuchsia',
      opcoes: [
        'Sono curto ou irregular na maior parte da semana',
        'Cabeça acelerada, dificuldade de pausar ou desligar',
        'Rotina corrida, pouco tempo para autocuidado básico',
        'Na maior parte do tempo consigo equilibrar com hábitos simples'
      ]
    },
    {
      numero: 5,
      texto: 'Qual seu principal objetivo neste momento?',
      cor: 'pink',
      opcoes: [
        'Entender melhor o que está acontecendo',
        'Saber por onde começar',
        'Falar com alguém que entende',
        'Só quero me informar'
      ]
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        💖 Preview da Avaliação Emocional - "Avaliação de Forma Emocional"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border-2 border-pink-200">
            <h4 className="text-xl font-bold text-gray-900 mb-2">💖 Avaliação de Forma Emocional</h4>
            <p className="text-gray-700 mb-3">Descubra como suas emoções influenciam sua jornada de transformação</p>
            <p className="text-pink-600 font-semibold">🚀 Uma avaliação para mapear autoestima, motivação e o que sustenta ou pesa no dia a dia.</p>
            <div className="bg-white rounded-lg p-4 mt-4 border border-pink-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Seu nível de autoestima e confiança</p>
                <p>✓ Sua motivação para transformação</p>
                <p>✓ Como você lida com desafios</p>
                <p>✓ Seu perfil emocional completo</p>
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
                  pink: 'bg-pink-50',
                  purple: 'bg-purple-50',
                  rose: 'bg-rose-50',
                  fuchsia: 'bg-fuchsia-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  pink: 'text-pink-900',
                  purple: 'text-purple-900',
                  rose: 'text-rose-900',
                  fuchsia: 'text-fuchsia-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  pink: 'border-pink-300',
                  purple: 'border-purple-300',
                  rose: 'border-rose-300',
                  fuchsia: 'border-fuchsia-300'
                }[pergunta.cor] || 'border-gray-300'

                const badgeColor = {
                  pink: 'bg-pink-600',
                  purple: 'bg-purple-600',
                  rose: 'bg-rose-600',
                  fuchsia: 'bg-fuchsia-600'
                }[pergunta.cor] || 'bg-gray-600'

                return (
                  <div key={pergunta.numero} className={`${bgColor} p-4 rounded-lg border-2 ${borderColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        Pergunta {pergunta.numero} de 5
                      </span>
                      <span className="text-xs text-gray-600 font-medium">Avaliação Emocional</span>
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
                          <input type="radio" name={`emocional-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      💡 Gatilho: Reflexão sobre autoestima e motivação
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
            
            {/* Resultado 1: Necessita Suporte Emocional */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">💖 Necessita Suporte Emocional</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-5 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.necessitaSuporteEmocional.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.necessitaSuporteEmocional.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.necessitaSuporteEmocional.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.necessitaSuporteEmocional.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.necessitaSuporteEmocional.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.necessitaSuporteEmocional.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.necessitaSuporteEmocional.proximoPasso}</p>
                </div>
              </div>
            </div>

            {/* Resultado 2: Pronto para Transformação */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">💖 Pronto para Transformação</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">6-10 pontos</span>
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

            {/* Resultado 3: Alto Potencial Emocional */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">💖 Alto Potencial Emocional</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">11-15 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">{diagnosticos.altoPotencialEmocional.diagnostico}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmocional.causaRaiz}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmocional.acaoImediata}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmocional.plano7Dias}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmocional.suplementacao}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-line">{diagnosticos.altoPotencialEmocional.alimentacao}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500">
                  <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnosticos.altoPotencialEmocional.proximoPasso}</p>
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
                    ? 'bg-pink-600 text-white'
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
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}

