'use client'

import { quizInterativoDiagnosticos } from '@/lib/diagnostics'

interface QuizInterativoPreviewProps {
  etapa: number
  onEtapaChange: (etapa: number) => void
}

export default function QuizInterativoPreview({ etapa, onEtapaChange }: QuizInterativoPreviewProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        🎯 Preview do Quiz Interativo - "Descubra seu Tipo de Metabolismo"
      </h3>
      
      {/* Container principal com navegação */}
      <div className="relative">
        {/* Tela de Abertura - Etapa 0 */}
        {etapa === 0 && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-2">🔍 Descubra Seu Tipo de Metabolismo em 60 Segundos</h4>
            <p className="text-gray-700 mb-3">Entenda por que seu corpo reage de um jeito único à alimentação, energia e suplementos — e descubra o melhor caminho para ter mais resultados.</p>
            <p className="text-teal-600 font-semibold">🚀 Leva menos de 1 minuto e pode mudar a forma como você cuida do seu corpo.</p>
          </div>
        )}

        {/* Perguntas 1-6 */}
        {etapa >= 1 && etapa <= 6 && (
          <div className="space-y-6">
            {etapa === 1 && (
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-900 mb-3">🕐 1. Como é seu nível de energia ao longo do dia?</h4>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                    <input type="radio" name="energia-dia" className="mr-3" disabled />
                    <span className="text-gray-700">(A) Vivo cansado, mesmo dormindo bem</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                    <input type="radio" name="energia-dia" className="mr-3" disabled />
                    <span className="text-gray-700">(B) Tenho altos e baixos</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-teal-300">
                    <input type="radio" name="energia-dia" className="mr-3" disabled />
                    <span className="text-gray-700">(C) Energia constante o dia inteiro</span>
                  </label>
                </div>
                <p className="text-xs text-teal-600 mt-2">🧠 Gatilho: Autopercepção e comparação</p>
              </div>
            )}

            {etapa === 2 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">🍽️ 2. Como costuma ser sua fome?</h4>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                    <input type="radio" name="fome" className="mr-3" disabled />
                    <span className="text-gray-700">(A) Forte, com vontade de comer o tempo todo</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                    <input type="radio" name="fome" className="mr-3" disabled />
                    <span className="text-gray-700">(B) Varia conforme o dia</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300">
                    <input type="radio" name="fome" className="mr-3" disabled />
                    <span className="text-gray-700">(C) Como de forma leve, sem exagerar</span>
                  </label>
                </div>
                <p className="text-xs text-blue-600 mt-2">🧠 Gatilho: Identificação emocional com comportamento alimentar</p>
              </div>
            )}

            {etapa === 3 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">💧 3. Quanta água você costuma beber por dia?</h4>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                    <input type="radio" name="agua" className="mr-3" disabled />
                    <span className="text-gray-700">(A) Quase nenhuma</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                    <input type="radio" name="agua" className="mr-3" disabled />
                    <span className="text-gray-700">(B) Mais ou menos 1 litro</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-green-300">
                    <input type="radio" name="agua" className="mr-3" disabled />
                    <span className="text-gray-700">(C) Sempre carrego minha garrafinha</span>
                  </label>
                </div>
                <p className="text-xs text-green-600 mt-2">🧠 Gatilho: Contraste e consciência de hábito</p>
              </div>
            )}

            {etapa === 4 && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3">💤 4. Como anda a qualidade do seu sono?</h4>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                    <input type="radio" name="sono" className="mr-3" disabled />
                    <span className="text-gray-700">(A) Péssima, acordo cansado</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                    <input type="radio" name="sono" className="mr-3" disabled />
                    <span className="text-gray-700">(B) Regular, depende do dia</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-purple-300">
                    <input type="radio" name="sono" className="mr-3" disabled />
                    <span className="text-gray-700">(C) Durmo bem e acordo disposto</span>
                  </label>
                </div>
                <p className="text-xs text-purple-600 mt-2">🧠 Gatilho: Reflexão + padrão de saúde percebida</p>
              </div>
            )}

            {etapa === 5 && (
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900 mb-3">🏃‍♂️ 5. Você pratica atividade física com qual frequência?</h4>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                    <input type="radio" name="exercicio" className="mr-3" disabled />
                    <span className="text-gray-700">(A) Quase nunca</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                    <input type="radio" name="exercicio" className="mr-3" disabled />
                    <span className="text-gray-700">(B) 2 a 3 vezes por semana</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300">
                    <input type="radio" name="exercicio" className="mr-3" disabled />
                    <span className="text-gray-700">(C) Quase todos os dias</span>
                  </label>
                </div>
                <p className="text-xs text-indigo-600 mt-2">🧠 Gatilho: Comparação e autoavaliação social</p>
              </div>
            )}

            {etapa === 6 && (
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-900 mb-3">⚖️ 6. Qual dessas opções melhor descreve você?</h4>
                <div className="space-y-2">
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                    <input type="radio" name="peso" className="mr-3" disabled />
                    <span className="text-gray-700">(A) Tenho dificuldade em perder peso</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                    <input type="radio" name="peso" className="mr-3" disabled />
                    <span className="text-gray-700">(B) Mantenho o peso com esforço</span>
                  </label>
                  <label className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-cyan-300">
                    <input type="radio" name="peso" className="mr-3" disabled />
                    <span className="text-gray-700">(C) Emagreço facilmente</span>
                  </label>
                </div>
                <p className="text-xs text-cyan-600 mt-2">🧠 Gatilho: Diagnóstico rápido (dor e aspiração)</p>
              </div>
            )}
          </div>
        )}

        {/* Tela de Resultados - Etapa 7 */}
        {etapa === 7 && (
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">📊 Resultados Possíveis do Quiz</h4>
            
            {/* Resultado 1: Metabolismo Lento */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-blue-900">🐌 Metabolismo Lento</h5>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">6-9 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{quizInterativoDiagnosticos.wellness.metabolismoLento.diagnostico}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoLento.causaRaiz}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoLento.acaoImediata}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoLento.plano7Dias}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoLento.suplementacao}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoLento.alimentacao}</p>
                {quizInterativoDiagnosticos.wellness.metabolismoLento.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{quizInterativoDiagnosticos.wellness.metabolismoLento.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 2: Metabolismo Equilibrado */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-green-900">⚖️ Metabolismo Equilibrado</h5>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">10-13 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{quizInterativoDiagnosticos.wellness.metabolismoEquilibrado.diagnostico}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoEquilibrado.causaRaiz}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoEquilibrado.acaoImediata}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoEquilibrado.plano7Dias}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoEquilibrado.suplementacao}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoEquilibrado.alimentacao}</p>
                {quizInterativoDiagnosticos.wellness.metabolismoEquilibrado.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{quizInterativoDiagnosticos.wellness.metabolismoEquilibrado.proximoPasso}</p>
                )}
              </div>
            </div>

            {/* Resultado 3: Metabolismo Acelerado */}
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-bold text-yellow-900">🚀 Metabolismo Acelerado</h5>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">14-18 pontos</span>
              </div>
              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">{quizInterativoDiagnosticos.wellness.metabolismoAcelerado.diagnostico}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoAcelerado.causaRaiz}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoAcelerado.acaoImediata}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoAcelerado.plano7Dias}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoAcelerado.suplementacao}</p>
                <p className="text-gray-700">{quizInterativoDiagnosticos.wellness.metabolismoAcelerado.alimentacao}</p>
                {quizInterativoDiagnosticos.wellness.metabolismoAcelerado.proximoPasso && (
                  <p className="text-gray-700 font-semibold bg-purple-50 p-3 rounded-lg mt-2">{quizInterativoDiagnosticos.wellness.metabolismoAcelerado.proximoPasso}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navegação com Setinhas */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => onEtapaChange(Math.max(0, etapa - 1))}
            disabled={etapa === 0}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          
          <div className="flex space-x-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((etapaNum) => {
              const labels = ['Início', '1', '2', '3', '4', '5', '6', 'Resultados']
              return (
                <button
                  key={etapaNum}
                  onClick={() => onEtapaChange(etapaNum)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    etapa === etapaNum
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={etapaNum === 0 ? 'Tela Inicial' : etapaNum === 7 ? 'Resultados' : `Pergunta ${etapaNum}`}
                >
                  {labels[etapaNum]}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => onEtapaChange(Math.min(7, etapa + 1))}
            disabled={etapa === 7}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima →
          </button>
        </div>
      </div>
    </div>
  )
}


