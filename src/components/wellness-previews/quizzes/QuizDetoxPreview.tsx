'use client'

import { quizDetoxDiagnosticos } from '@/lib/diagnostics'

interface QuizDetoxPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizDetoxPreview({ etapa, onEtapaChange }: QuizDetoxPreviewProps) {
  const diagnosticos = quizDetoxDiagnosticos.wellness
  const totalEtapas = 5 // 0=landing, 1-5=perguntas, 6=resultados

  const handleNext = () => {
    onEtapaChange(Math.min(totalEtapas + 1, etapa + 1))
  }

  const handlePrevious = () => {
    onEtapaChange(Math.max(0, etapa - 1))
  }

  const labels = ['Início', '1', '2', '3', '4', '5', 'Resultados']

  const perguntas = [
    {
      numero: 1,
      texto: 'Você se sente cansado mesmo após dormir bem?',
      cor: 'purple'
    },
    {
      numero: 2,
      texto: 'Tem dificuldade para perder peso mesmo com dieta?',
      cor: 'pink'
    },
    {
      numero: 3,
      texto: 'Consome alimentos processados com frequência?',
      cor: 'rose'
    },
    {
      numero: 4,
      texto: 'Nota sinais de inchaço ou retenção de líquidos?',
      cor: 'fuchsia'
    },
    {
      numero: 5,
      texto: 'Faz uso de produtos de limpeza ou vive em ambiente poluído?',
      cor: 'violet'
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🧽 Preview do Quiz Detox - "Descubra se seu Corpo Precisa de Detox"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🧽 Seu Corpo Está Pedindo Detox?</h4>
            <p className="text-gray-700 mb-3">Identifique sinais de sobrecarga tóxica e receba orientações personalizadas para um processo de desintoxicação seguro e eficaz.</p>
            <p className="text-purple-600 font-semibold">🚀 Uma avaliação que pode transformar sua saúde e energia.</p>
          </div>
        )}

        {/* Perguntas 1-5 */}
        {etapa >= 1 && etapa <= 5 && (
          <div className="space-y-6">
            {perguntas.map((pergunta) => {
              if (etapa === pergunta.numero) {
                const bgColor = {
                  purple: 'bg-purple-50',
                  pink: 'bg-pink-50',
                  rose: 'bg-rose-50',
                  fuchsia: 'bg-fuchsia-50',
                  violet: 'bg-violet-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  purple: 'text-purple-900',
                  pink: 'text-pink-900',
                  rose: 'text-rose-900',
                  fuchsia: 'text-fuchsia-900',
                  violet: 'text-violet-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  purple: 'border-purple-300',
                  pink: 'border-pink-300',
                  rose: 'border-rose-300',
                  fuchsia: 'border-fuchsia-300',
                  violet: 'border-violet-300'
                }[pergunta.cor] || 'border-gray-300'

                return (
                  <div key={pergunta.numero} className={`${bgColor} p-4 rounded-lg`}>
                    <h4 className={`font-semibold ${textColor} mb-3`}>
                      {pergunta.numero}. {pergunta.texto}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((opcao, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:${borderColor}`}
                        >
                          <input type="radio" name={`detox-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      🧠 Gatilho: Identificação de sinais de toxicidade
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
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
            
            {/* Resultado 1: Baixa Toxicidade */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">✅ Baixa Toxicidade</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">5-10 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.baixaToxicidade.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.baixaToxicidade.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.baixaToxicidade.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.baixaToxicidade.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.baixaToxicidade.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.baixaToxicidade.alimentacao}</p>
                {diagnosticos.baixaToxicidade.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.baixaToxicidade.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 2: Toxicidade Moderada */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">⚠️ Toxicidade Moderada</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">11-20 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.toxicidadeModerada.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.toxicidadeModerada.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.toxicidadeModerada.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.toxicidadeModerada.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.toxicidadeModerada.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.toxicidadeModerada.alimentacao}</p>
                {diagnosticos.toxicidadeModerada.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.toxicidadeModerada.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 3: Alta Toxicidade */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">🔴 Alta Toxicidade</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">21-25 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.altaToxicidade.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.altaToxicidade.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.altaToxicidade.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.altaToxicidade.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.altaToxicidade.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.altaToxicidade.alimentacao}</p>
                {diagnosticos.altaToxicidade.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.altaToxicidade.proximoPasso}</p>
                )}
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
          
          <div className="flex space-x-2">
            {Array.from({ length: totalEtapas + 2 }, (_, i) => (
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
            disabled={etapa === totalEtapas + 1}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}











