'use client'

import { quizPerfilNutricionalDiagnosticos } from '@/lib/diagnostics'

interface QuizPerfilNutricionalPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizPerfilNutricionalPreview({ etapa, onEtapaChange }: QuizPerfilNutricionalPreviewProps) {
  const diagnosticos = quizPerfilNutricionalDiagnosticos.wellness
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
      texto: 'Você costuma sentir desconforto digestivo após refeições?',
      cor: 'green'
    },
    {
      numero: 2,
      texto: 'Consome alimentos probióticos ou fermentados regularmente?',
      cor: 'emerald'
    },
    {
      numero: 3,
      texto: 'Nota que absorve bem os nutrientes (sem sintomas de deficiência)?',
      cor: 'teal'
    },
    {
      numero: 4,
      texto: 'Costuma combinar alimentos estrategicamente (ex: ferro + vitamina C)?',
      cor: 'cyan'
    },
    {
      numero: 5,
      texto: 'Faz uso de suplementos vitamínicos ou minerais?',
      cor: 'blue'
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🥗 Preview do Quiz Perfil Nutricional - "Identifique seu Perfil de Absorção"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🥗 Descubra seu Perfil de Absorção Nutricional</h4>
            <p className="text-gray-700 mb-3">Identifique como seu corpo absorve nutrientes e receba orientações personalizadas para otimizar sua nutrição.</p>
            <p className="text-green-600 font-semibold">🚀 Uma avaliação que pode transformar sua relação com a alimentação.</p>
          </div>
        )}

        {/* Perguntas 1-5 */}
        {etapa >= 1 && etapa <= 5 && (
          <div className="space-y-6">
            {perguntas.map((pergunta) => {
              if (etapa === pergunta.numero) {
                const bgColor = {
                  green: 'bg-green-50',
                  emerald: 'bg-emerald-50',
                  teal: 'bg-teal-50',
                  cyan: 'bg-cyan-50',
                  blue: 'bg-blue-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  green: 'text-green-900',
                  emerald: 'text-emerald-900',
                  teal: 'text-teal-900',
                  cyan: 'text-cyan-900',
                  blue: 'text-blue-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  green: 'border-green-300',
                  emerald: 'border-emerald-300',
                  teal: 'border-teal-300',
                  cyan: 'border-cyan-300',
                  blue: 'border-blue-300'
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
                          <input type="radio" name={`perfil-nutricional-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      🧠 Gatilho: Autoconhecimento sobre digestão e absorção
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
            
            {/* Resultado 1: Absorção Baixa */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">📉 Absorção Baixa</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">6-15 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.absorcaoBaixa.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoBaixa.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoBaixa.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoBaixa.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoBaixa.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoBaixa.alimentacao}</p>
                {diagnosticos.absorcaoBaixa.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.absorcaoBaixa.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 2: Absorção Moderada */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">⚠️ Absorção Moderada</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">16-25 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.absorcaoModerada.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoModerada.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoModerada.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoModerada.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoModerada.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoModerada.alimentacao}</p>
                {diagnosticos.absorcaoModerada.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.absorcaoModerada.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 3: Absorção Otimizada */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">✅ Absorção Otimizada</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">26-35 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.absorcaoOtimizada.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoOtimizada.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoOtimizada.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoOtimizada.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoOtimizada.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.absorcaoOtimizada.alimentacao}</p>
                {diagnosticos.absorcaoOtimizada.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{diagnosticos.absorcaoOtimizada.proximoPasso}</p>
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












