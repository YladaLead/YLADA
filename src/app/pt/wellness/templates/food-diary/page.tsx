'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface Resultado {
  nivelDiario: string
  recomendacoes: string[]
}

export default function DiarioAlimentar({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    experiencia: '',
    registroSentimentos: '',
    detalhamento: '',
    objetivo: ''
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciarDiario = () => {
    setEtapa('formulario')
  }

  const calcularResultado = () => {
    if (!dados.experiencia || !dados.registroSentimentos || !dados.detalhamento) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    // Determinar nível de diário baseado nas respostas
    let nivelDiario = 'diarioBasico'
    let recomendacoes: string[] = []

    // Lógica de determinação do nível
    const experienciaBasica = dados.experiencia === 'nunca' || dados.experiencia === 'pouco'
    const sentimentosBasicos = dados.registroSentimentos === 'nunca' || dados.registroSentimentos === 'raro'
    const detalhamentoBasico = dados.detalhamento === 'apenas-alimentos' || dados.detalhamento === 'alimentos-sentimentos'

    const experienciaModerada = dados.experiencia === 'moderado'
    const sentimentosModerados = dados.registroSentimentos === 'as-vezes'
    const detalhamentoModerado = dados.detalhamento === 'completo-basico'

    if (experienciaBasica && sentimentosBasicos && detalhamentoBasico) {
      nivelDiario = 'diarioBasico'
      recomendacoes = [
        'Comece registrando apenas os alimentos que você consome',
        'Adicione como se sentiu antes e depois de cada refeição principal',
        'Registre por pelo menos 30 dias para identificar padrões emocionais',
        'Observe conexões entre sentimentos e escolhas alimentares'
      ]
    } else if (experienciaModerada || (sentimentosModerados && detalhamentoModerado)) {
      nivelDiario = 'diarioModerado'
      recomendacoes = [
        'Adicione informações sobre horários e situações das refeições',
        'Registre sentimentos específicos relacionados a cada refeição',
        'Mantenha registro diário consistente incluindo emoções',
        'Compare padrões semanais para identificar tendências emocionais-alimentares'
      ]
    } else {
      nivelDiario = 'diarioAvancado'
      recomendacoes = [
        'Implemente registro detalhado de alimentos, macronutrientes e sentimentos',
        'Registre situações e contextos emocionais de cada refeição',
        'Monitore padrões complexos como relação entre estresse e alimentação',
        'Considere análise profissional dos dados emocionais-alimentares coletados'
      ]
    }

    const diagnosticoCompleto = getDiagnostico('diario-alimentar', 'nutri', nivelDiario)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelDiario,
      recomendacoes
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Diário Alimentar"
        defaultDescription="Registre seus hábitos alimentares e transforme sua nutrição"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="📝"
            defaultTitle="Diário Alimentar"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Registre seus hábitos alimentares e transforme sua nutrição
                </p>
                <p className="text-gray-600">
                  Descubra como registrar alimentos e sentimentos pode revelar padrões emocionais
                </p>
              </>
            }
            benefits={[
              'Identifique conexões entre emoções e alimentação',
              'Aumente consciência sobre seus hábitos alimentares',
              'Revele padrões emocionais que afetam suas escolhas',
              'Transforme sua relação com a comida através de dados reais'
            ]}
            onStart={iniciarDiario}
            buttonText="▶️ Começar Meu Diário - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurar Diário Alimentar</h2>
              <p className="text-gray-600">Responda as perguntas para receber orientações personalizadas sobre seu diário alimentar.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você já manteve um diário alimentar antes? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.experiencia}
                  onChange={(e) => setDados({ ...dados, experiencia: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="nunca">Nunca, sou iniciante</option>
                  <option value="pouco">Pouco, tentei algumas vezes</option>
                  <option value="moderado">Moderado, já tenho experiência</option>
                  <option value="avancado">Avançado, faço regularmente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você já registrou sentimentos relacionados à comida? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.registroSentimentos}
                  onChange={(e) => setDados({ ...dados, registroSentimentos: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="nunca">Nunca, nunca pensei nisso</option>
                  <option value="raro">Raramente, às vezes percebo conexões</option>
                  <option value="as-vezes">Às vezes, já tentei registrar</option>
                  <option value="regularmente">Regularmente, já faço isso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual nível de detalhamento você pretende usar? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.detalhamento}
                  onChange={(e) => setDados({ ...dados, detalhamento: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="apenas-alimentos">Apenas alimentos (simples)</option>
                  <option value="alimentos-sentimentos">Alimentos + sentimentos (básico)</option>
                  <option value="completo-basico">Completo básico (alimentos + sentimentos + horários)</option>
                  <option value="completo-avancado">Completo avançado (alimentos + sentimentos + situações + timing)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual seu principal objetivo com o diário?
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione (opcional)</option>
                  <option value="autoconsciencia">Aumentar autoconsciência alimentar</option>
                  <option value="emocional">Trabalhar relação emocional com comida</option>
                  <option value="perder-peso">Perder peso com consciência emocional</option>
                  <option value="bem-estar">Melhorar bem-estar geral</option>
                  <option value="transformacao">Transformar relação com alimentação</option>
                </select>
              </div>
            </div>

            <button
              onClick={calcularResultado}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)'
                  }}
            >
              Ver Meu Diário Ideal →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-orange-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📝</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Diário Ideal</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelDiario === 'diarioBasico' && 'Diário Alimentar Básico Recomendado'}
                  {resultado.nivelDiario === 'diarioModerado' && 'Diário Alimentar Moderado Recomendado'}
                  {resultado.nivelDiario === 'diarioAvancado' && 'Diário Alimentar Avançado Recomendado'}
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-orange-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações de Registro
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-orange-800">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnósticos Nutricionais */}
              {diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                      <span className="text-2xl mr-2">📋</span>
                      Diagnóstico Nutricional Completo
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.diagnostico}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.causaRaiz}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.acaoImediata}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.plano7Dias}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.suplementacao}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{diagnostico.alimentacao}</p>
                      </div>
                      {diagnostico.proximoPasso && (
                        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4 border-l-4 border-orange-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Próximos Passos
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Comece a registrar sua alimentação e sentimentos hoje mesmo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Use um caderno ou aplicativo para registrar alimentos e emoções</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Seja consistente - registre por pelo menos 30 dias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Analise os padrões emocionais-alimentares após algumas semanas</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Nível: ${resultado.nivelDiario === 'diarioBasico' ? 'Básico' : resultado.nivelDiario === 'diarioModerado' ? 'Moderado' : 'Avançado'} | Objetivo: ${dados.objetivo || 'Geral'}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    experiencia: '',
                    registroSentimentos: '',
                    detalhamento: '',
                    objetivo: ''
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Nova Análise
              </button>
              <button
                onClick={() => {
                  setDados({
                    experiencia: '',
                    registroSentimentos: '',
                    detalhamento: '',
                    objetivo: ''
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
              >
                🏠 Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

