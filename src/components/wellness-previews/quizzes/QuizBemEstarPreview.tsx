'use client'

import { quizBemEstarDiagnosticos } from '@/lib/diagnostics'

interface QuizBemEstarPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizBemEstarPreview({ etapa, onEtapaChange }: QuizBemEstarPreviewProps) {
  const diagnosticos = quizBemEstarDiagnosticos.wellness
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
      texto: 'Você costuma priorizar o que come, mesmo com o dia corrido?',
      cor: 'purple'
    },
    {
      numero: 2,
      texto: 'Dorme bem e acorda com disposição?',
      cor: 'blue'
    },
    {
      numero: 3,
      texto: 'Pratica algum tipo de atividade física regularmente?',
      cor: 'teal'
    },
    {
      numero: 4,
      texto: 'Cuida mais da aparência física do que da saúde interna?',
      cor: 'pink'
    },
    {
      numero: 5,
      texto: 'Faz exames ou consultas de rotina com frequência?',
      cor: 'indigo'
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🧘‍♀️ Preview do Quiz Bem-Estar - "Descubra seu Perfil de Bem-Estar"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-teal-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🧘‍♀️ Qual é seu perfil predominante?</h4>
            <p className="text-gray-700 mb-3">Estético, Equilibrado ou Saúde/Performance — descubra em 1 minuto.</p>
            <p className="text-purple-600 font-semibold">🚀 Uma avaliação que pode transformar sua relação com o bem-estar.</p>
          </div>
        )}

        {/* Perguntas 1-5 */}
        {etapa >= 1 && etapa <= 5 && (
          <div className="space-y-6">
            {perguntas.map((pergunta) => {
              if (etapa === pergunta.numero) {
                const bgColor = {
                  purple: 'bg-purple-50',
                  blue: 'bg-blue-50',
                  teal: 'bg-teal-50',
                  pink: 'bg-pink-50',
                  indigo: 'bg-indigo-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  purple: 'text-purple-900',
                  blue: 'text-blue-900',
                  teal: 'text-teal-900',
                  pink: 'text-pink-900',
                  indigo: 'text-indigo-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  purple: 'border-purple-300',
                  blue: 'border-blue-300',
                  teal: 'border-teal-300',
                  pink: 'border-pink-300',
                  indigo: 'border-indigo-300'
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
                          <input type="radio" name={`bem-estar-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      🧠 Gatilho: Autopercepção e reflexão sobre hábitos
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
            
            {/* Resultado 1: Bem-Estar Baixo */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">📉 Bem-Estar Baixo</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">10-20 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.bemEstarBaixo.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarBaixo.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarBaixo.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarBaixo.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarBaixo.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarBaixo.alimentacao}</p>
                {diagnosticos.bemEstarBaixo.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.bemEstarBaixo.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 2: Bem-Estar Moderado */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">⚠️ Bem-Estar Moderado</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">21-35 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.bemEstarModerado.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarModerado.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarModerado.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarModerado.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarModerado.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarModerado.alimentacao}</p>
                {diagnosticos.bemEstarModerado.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.bemEstarModerado.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 3: Bem-Estar Alto */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">✅ Bem-Estar Alto</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">36-50 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.bemEstarAlto.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarAlto.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarAlto.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarAlto.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarAlto.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.bemEstarAlto.alimentacao}</p>
                {diagnosticos.bemEstarAlto.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.bemEstarAlto.proximoPasso}</p>
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












