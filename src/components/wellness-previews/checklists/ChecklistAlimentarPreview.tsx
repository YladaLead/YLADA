'use client'

import { checklistAlimentarDiagnosticos } from '@/lib/diagnostics'

interface ChecklistAlimentarPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function ChecklistAlimentarPreview({ etapa, onEtapaChange }: ChecklistAlimentarPreviewProps) {
  const diagnosticos = checklistAlimentarDiagnosticos.wellness
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
      texto: 'Quantas refeições você faz por dia?',
      emoji: '🥗',
      cor: 'teal',
      opcoes: [
        '5-6 refeições pequenas',
        '3-4 refeições principais',
        '1-2 refeições por dia'
      ],
      gatilho: 'Consciência alimentar'
    },
    {
      numero: 2,
      texto: 'Quantos vegetais você consome por dia?',
      emoji: '🥕',
      cor: 'emerald',
      opcoes: [
        '5+ porções de vegetais',
        '3-4 porções de vegetais',
        'Menos de 3 porções de vegetais'
      ],
      gatilho: 'Consciência nutricional'
    },
    {
      numero: 3,
      texto: 'Quantas frutas você consome por dia?',
      emoji: '🍎',
      cor: 'blue',
      opcoes: [
        '3+ porções de frutas',
        '1-2 porções de frutas',
        'Raramente como frutas'
      ],
      gatilho: 'Consciência de micronutrientes'
    },
    {
      numero: 4,
      texto: 'Com que frequência você come alimentos processados?',
      emoji: '🍔',
      cor: 'cyan',
      opcoes: [
        'Raramente como processados',
        'Às vezes como processados',
        'Frequentemente como processados'
      ],
      gatilho: 'Consciência de qualidade'
    },
    {
      numero: 5,
      texto: 'Como está sua hidratação?',
      emoji: '💧',
      cor: 'sky',
      opcoes: [
        'Bebo 2-3L de água por dia',
        'Bebo 1-2L de água por dia',
        'Bebo menos de 1L de água por dia'
      ],
      gatilho: 'Consciência hidratacional'
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🍽️ Preview do Checklist Alimentar - "Avalie Seus Hábitos Alimentares"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🍽️ Avalie Seus Hábitos Alimentares</h4>
            <p className="text-gray-700 mb-3">Descubra como está sua alimentação e receba orientações personalizadas para melhorar seus hábitos alimentares baseadas em sua rotina atual.</p>
            <p className="text-teal-600 font-semibold">💪 Uma avaliação que pode transformar sua relação com a comida.</p>
          </div>
        )}

        {/* Perguntas 1-5 */}
        {etapa >= 1 && etapa <= 5 && (
          <div className="space-y-6">
            {perguntas.map((pergunta) => {
              if (etapa === pergunta.numero) {
                const bgColor = {
                  teal: 'bg-teal-50',
                  emerald: 'bg-emerald-50',
                  blue: 'bg-blue-50',
                  cyan: 'bg-cyan-50',
                  sky: 'bg-sky-50'
                }[pergunta.cor] || 'bg-gray-50'
                
                const textColor = {
                  teal: 'text-teal-900',
                  emerald: 'text-emerald-900',
                  blue: 'text-blue-900',
                  cyan: 'text-cyan-900',
                  sky: 'text-sky-900'
                }[pergunta.cor] || 'text-gray-900'

                const borderColor = {
                  teal: 'border-teal-300',
                  emerald: 'border-emerald-300',
                  blue: 'border-blue-300',
                  cyan: 'border-cyan-300',
                  sky: 'border-sky-300'
                }[pergunta.cor] || 'border-gray-300'

                return (
                  <div key={pergunta.numero} className={`${bgColor} p-4 rounded-lg`}>
                    <h4 className={`font-semibold ${textColor} mb-3`}>
                      {pergunta.emoji} {pergunta.numero}. {pergunta.texto}
                    </h4>
                    <div className="space-y-2">
                      {pergunta.opcoes.map((opcao, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:${borderColor}`}
                        >
                          <input type="radio" name={`checklist-alimentar-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    <p className={`text-xs ${textColor.replace('900', '600')} mt-2`}>
                      🧠 Gatilho: {pergunta.gatilho}
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
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Checklist</h4>
            
            {/* Resultado 1: Alimentação Deficiente */}
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-red-900">📉 Alimentação Deficiente</h5>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">0-40 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.alimentacaoDeficiente.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoDeficiente.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoDeficiente.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoDeficiente.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoDeficiente.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoDeficiente.alimentacao}</p>
                {diagnosticos.alimentacaoDeficiente.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{diagnosticos.alimentacaoDeficiente.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 2: Alimentação Moderada */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">⚠️ Alimentação Moderada</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">41-70 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.alimentacaoModerada.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoModerada.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoModerada.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoModerada.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoModerada.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoModerada.alimentacao}</p>
                {diagnosticos.alimentacaoModerada.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{diagnosticos.alimentacaoModerada.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 3: Alimentação Equilibrada */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">✅ Alimentação Equilibrada</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">71-100 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{diagnosticos.alimentacaoEquilibrada.diagnostico}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoEquilibrada.causaRaiz}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoEquilibrada.acaoImediata}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoEquilibrada.plano7Dias}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoEquilibrada.suplementacao}</p>
                <p className="text-gray-700">{diagnosticos.alimentacaoEquilibrada.alimentacao}</p>
                {diagnosticos.alimentacaoEquilibrada.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-teal-50 p-3 rounded-lg mt-2">{diagnosticos.alimentacaoEquilibrada.proximoPasso}</p>
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
                    ? 'bg-teal-600 text-white'
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
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}




