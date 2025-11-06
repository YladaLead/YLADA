'use client'

import { checklistDetoxDiagnosticos } from '@/lib/diagnostics'

interface ChecklistDetoxPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function ChecklistDetoxPreview({ etapa, onEtapaChange }: ChecklistDetoxPreviewProps) {
  const diagnosticos = checklistDetoxDiagnosticos.wellness
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
      emoji: '😴',
      cor: 'purple',
      opcoes: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
      gatilho: 'Avaliação de Sinais',
      alerta: 'Se você respondeu "Frequentemente" ou "Sempre", seu corpo pode estar pedindo ajuda para eliminar toxinas.'
    },
    {
      numero: 2,
      texto: 'Você tem dificuldade para perder peso mesmo com dieta?',
      emoji: '⚖️',
      cor: 'pink',
      opcoes: ['Não tenho dificuldade', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre tenho dificuldade'],
      gatilho: 'Metabolismo comprometido',
      alerta: 'Se você tem dificuldade para perder peso mesmo com dieta, pode ser que seu organismo esteja sobrecarregado com toxinas.'
    },
    {
      numero: 3,
      texto: 'Você tem problemas digestivos frequentes (constipação, gases)?',
      emoji: '💩',
      cor: 'rose',
      opcoes: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
      gatilho: 'Digestão comprometida',
      alerta: 'Problemas digestivos frequentes podem estar impedindo seu organismo de eliminar toxinas adequadamente.'
    },
    {
      numero: 4,
      texto: 'Você nota sinais de inchaço ou retenção de líquidos?',
      emoji: '💧',
      cor: 'fuchsia',
      opcoes: ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'],
      gatilho: 'Sistema de eliminação',
      alerta: 'Inchaço pode indicar que seu corpo está tendo dificuldade para eliminar toxinas e líquidos.'
    },
    {
      numero: 5,
      texto: 'Você consome alimentos processados ou vive em ambiente poluído?',
      emoji: '🏭',
      cor: 'violet',
      opcoes: ['Muito pouco', 'Ocasionalmente', 'Moderadamente', 'Frequentemente', 'Muito frequentemente'],
      gatilho: 'Exposição tóxica',
      alerta: 'Exposição constante a toxinas pode sobrecarregar seu sistema de eliminação natural.'
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🧪 Preview do Checklist Detox - "Seu Corpo Precisa de Detox?"
      </h3>
      
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🧪 Checklist Detox</h4>
            <p className="text-gray-700 mb-4 font-medium">Identifique sinais de sobrecarga tóxica e receba orientações para um processo de detox eficaz.</p>
            <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
              <p className="text-sm text-gray-700 mb-2"><strong>💡 O que você vai descobrir:</strong></p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>✓ Identifique sinais de sobrecarga tóxica no seu organismo</p>
                <p>✓ Entenda como toxinas podem estar afetando sua energia e saúde</p>
                <p>✓ Receba orientações para um processo de detox eficaz</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ <strong>Atenção:</strong> Se você sente cansaço constante, dificuldade para perder peso ou problemas digestivos, pode ser um sinal de que seu corpo precisa de suporte para eliminar toxinas. Descubra agora!
              </p>
            </div>
            <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg">
              ▶️ Começar Avaliação - É Grátis
            </button>
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
                  <div key={pergunta.numero} className={`${bgColor} p-5 rounded-lg border-2 border-${pergunta.cor}-200`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`bg-${pergunta.cor}-600 text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                        Pergunta {pergunta.numero} de 5
                      </span>
                      <span className="text-xs text-purple-700 font-medium">{pergunta.gatilho}</span>
                    </div>
                    <h4 className={`font-semibold ${textColor} mb-2 text-lg`}>
                      {pergunta.texto}
                    </h4>
                    <p className="text-sm text-purple-700 mb-4">{pergunta.gatilho}</p>
                    <div className="space-y-2">
                      {pergunta.opcoes.map((opcao, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center p-3 bg-white rounded-lg border border-purple-200 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all`}
                        >
                          <input type="radio" name={`checklist-detox-${pergunta.numero}`} className="mr-3" disabled />
                          <span className="text-gray-700">{opcao}</span>
                        </label>
                      ))}
                    </div>
                    {pergunta.alerta && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-800">
                          ⚠️ <strong>Atenção:</strong> {pergunta.alerta}
                        </p>
                      </div>
                    )}
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
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Seu Resultado: Toxicidade Moderada</h4>
              <div className="bg-white rounded-lg p-5 mb-4 border border-purple-200">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-orange-600 mb-2">28 pontos</div>
                  <div className="text-lg font-semibold text-gray-700">de 50 pontos possíveis</div>
                </div>
                <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                  <div className="absolute left-0 top-0 h-6 bg-orange-500 rounded-full" style={{width: '56%'}}></div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2"><strong>Análise:</strong></p>
                  <p className="text-sm text-gray-600">Sinais de acúmulo tóxico moderado que precisam de intervenção. Seu organismo está mostrando sinais de que precisa de suporte para eliminar toxinas adequadamente.</p>
                </div>
              </div>
              
              {/* Resultados Possíveis */}
              <div className="space-y-4">
                {/* Resultado 1: Baixa Toxicidade */}
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-bold text-green-900">✅ Baixa Toxicidade</h5>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">5-15 pontos</span>
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
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">16-30 pontos</span>
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
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">31-50 pontos</span>
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

