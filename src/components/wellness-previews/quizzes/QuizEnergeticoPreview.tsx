'use client'

import { quizEnergeticoDiagnosticos } from '@/lib/diagnostics'

interface QuizEnergeticoPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizEnergeticoPreview({ etapa, onEtapaChange }: QuizEnergeticoPreviewProps) {
  const diagnosticos = quizEnergeticoDiagnosticos.wellness
  const totalEtapas = 7 // 0=landing, 1-6=perguntas, 7=resultados

  const handleNext = () => {
    onEtapaChange(Math.min(totalEtapas, etapa + 1))
  }

  const handlePrevious = () => {
    onEtapaChange(Math.max(0, etapa - 1))
  }

  const labels = ['Início', '1', '2', '3', '4', '5', '6', 'Resultados']

  const perguntas = [
    {
      numero: 1,
      texto: 'Como você avalia seu nível de energia ao longo do dia?',
      cor: 'yellow'
    },
    {
      numero: 2,
      texto: 'Você costuma sentir fadiga ou cansaço constante?',
      cor: 'orange'
    },
    {
      numero: 3,
      texto: 'Consome alimentos energéticos regularmente (café, chá, açúcar)?',
      cor: 'amber'
    },
    {
      numero: 4,
      texto: 'Nota que sua energia cai após refeições?',
      cor: 'yellow'
    },
    {
      numero: 5,
      texto: 'Pratica atividade física regularmente para manter energia?',
      cor: 'orange'
    },
    {
      numero: 6,
      texto: 'Dorme bem e acorda com disposição?',
      cor: 'amber'
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        ⚡ Preview do Quiz Energético - "Descubra seu Nível de Energia"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-2">⚡ Como Está Sua Energia?</h4>
            <p className="text-gray-700 mb-3">Identifique seu nível de energia e receba orientações personalizadas para aumentar sua vitalidade e disposição.</p>
            <p className="text-yellow-600 font-semibold">🚀 Uma avaliação que pode transformar sua energia diária.</p>
          </div>
        )}

        {/* Perguntas 1-6 */}
        {etapa >= 1 && etapa <= 6 && (
          <div className="space-y-6">
            {perguntas.map((pergunta) => {
              if (etapa === pergunta.numero) {
                const bgColor = {
                  yellow: 'bg-yellow-50',
                  orange: 'bg-orange-50',
                  amber: 'bg-amber-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  yellow: 'text-yellow-900',
                  orange: 'text-orange-900',
                  amber: 'text-amber-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  yellow: 'border-yellow-300',
                  orange: 'border-orange-300',
                  amber: 'border-amber-300'
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
                          <input type="radio" name={`energetico-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      🧠 Gatilho: Autopercepção sobre níveis de energia
                    </p>
                  </div>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Tela de Resultados - Etapa 7 */}
        {etapa === 7 && (
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
            
            {/* Resultado 1: Energia Baixa */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">📉 Energia Baixa</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">6-15 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.energiaBaixa.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.energiaBaixa.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.energiaBaixa.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.energiaBaixa.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.energiaBaixa.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.energiaBaixa.alimentacao}</p>
                {diagnosticos.energiaBaixa.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.energiaBaixa.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 2: Energia Moderada */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">⚠️ Energia Moderada</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">16-25 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.energiaModerada.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.energiaModerada.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.energiaModerada.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.energiaModerada.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.energiaModerada.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.energiaModerada.alimentacao}</p>
                {diagnosticos.energiaModerada.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.energiaModerada.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 3: Energia Alta */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">✅ Energia Alta</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">26-30 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.energiaAlta.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.energiaAlta.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.energiaAlta.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.energiaAlta.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.energiaAlta.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.energiaAlta.alimentacao}</p>
                {diagnosticos.energiaAlta.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.energiaAlta.proximoPasso}</p>
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
            {Array.from({ length: totalEtapas + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => onEtapaChange(i)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  etapa === i
                    ? 'bg-yellow-600 text-white'
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
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}

