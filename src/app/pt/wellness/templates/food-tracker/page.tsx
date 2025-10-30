'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface Resultado {
  nivelRastreamento: string
  recomendacoes: string[]
}

export default function RastreadorAlimentar({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    experiencia: '',
    frequencia: '',
    detalhamento: '',
    objetivo: ''
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciarRastreamento = () => {
    setEtapa('formulario')
  }

  const calcularResultado = () => {
    if (!dados.experiencia || !dados.frequencia || !dados.detalhamento) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    // Determinar nível de rastreamento baseado nas respostas
    let nivelRastreamento = 'rastreamentoBasico'
    let recomendacoes: string[] = []

    // Lógica de determinação do nível
    const experienciaBasica = dados.experiencia === 'nunca' || dados.experiencia === 'pouco'
    const frequenciaBaixa = dados.frequencia === 'esporadico' || dados.frequencia === 'semanal'
    const detalhamentoBasico = dados.detalhamento === 'apenas-alimentos' || dados.detalhamento === 'alimentos-horarios'

    const experienciaModerada = dados.experiencia === 'moderado'
    const frequenciaModerada = dados.frequencia === 'quase-dia'
    const detalhamentoModerado = dados.detalhamento === 'macronutrientes'

    if (experienciaBasica && frequenciaBaixa && detalhamentoBasico) {
      nivelRastreamento = 'rastreamentoBasico'
      recomendacoes = [
        'Comece rastreando apenas os alimentos que você consome',
        'Anote os horários das suas refeições principais',
        'Rastreie por pelo menos 30 dias para identificar padrões',
        'Não se preocupe com macronutrientes no início'
      ]
    } else if (experienciaModerada || (frequenciaModerada && detalhamentoModerado)) {
      nivelRastreamento = 'rastreamentoModerado'
      recomendacoes = [
        'Adicione informações sobre macronutrientes ao rastreamento',
        'Mantenha registro diário consistente',
        'Identifique padrões de horários e distribuição de refeições',
        'Compare padrões semanais para identificar tendências'
      ]
    } else {
      nivelRastreamento = 'rastreamentoAvancado'
      recomendacoes = [
        'Implemente rastreamento detalhado de macronutrientes e micronutrientes',
        'Registre timing nutricional relacionado aos treinos',
        'Monitore padrões complexos como relação entre alimentação e energia',
        'Considere análise profissional dos dados coletados'
      ]
    }

    const diagnosticoCompleto = getDiagnostico('rastreador-alimentar', 'nutri', nivelRastreamento)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelRastreamento,
      recomendacoes
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Rastreador Alimentar"
        defaultDescription="Identifique padrões alimentares e otimize sua nutrição"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="📈"
            defaultTitle="Rastreador Alimentar"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Identifique padrões alimentares e otimize sua nutrição
                </p>
                <p className="text-gray-600">
                  Descubra como rastrear sua alimentação pode transformar seus resultados
                </p>
              </>
            }
            benefits={[
              'Identifique padrões alimentares que afetam seus resultados',
              'Aumente consciência sobre seu consumo diário',
              'Receba orientações personalizadas baseadas no seu perfil',
              'Otimize sua nutrição através de dados reais'
            ]}
            onStart={iniciarRastreamento}
            buttonText="▶️ Começar Rastreamento - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurar Rastreamento</h2>
              <p className="text-gray-600">Responda as perguntas para receber orientações personalizadas sobre rastreamento alimentar.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você já rastreou sua alimentação antes? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.experiencia}
                  onChange={(e) => setDados({ ...dados, experiencia: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
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
                  Com que frequência você consegue rastrear? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.frequencia}
                  onChange={(e) => setDados({ ...dados, frequencia: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="esporadico">Esporadicamente (quando lembrar)</option>
                  <option value="semanal">Algumas vezes por semana</option>
                  <option value="quase-dia">Quase todos os dias</option>
                  <option value="diario">Todos os dias, consistentemente</option>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="apenas-alimentos">Apenas alimentos (simples)</option>
                  <option value="alimentos-horarios">Alimentos + horários</option>
                  <option value="macronutrientes">Macronutrientes (proteínas, carbs, gorduras)</option>
                  <option value="completo">Completo (macros + micronutrientes + timing)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual seu principal objetivo com o rastreamento?
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione (opcional)</option>
                  <option value="consciencia">Aumentar consciência alimentar</option>
                  <option value="perder-peso">Perder peso</option>
                  <option value="ganhar-massa">Ganhar massa muscular</option>
                  <option value="saude">Melhorar saúde geral</option>
                  <option value="performance">Otimizar performance esportiva</option>
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
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                  }}
            >
              Ver Meu Rastreamento Ideal →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-purple-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📈</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Rastreamento Ideal</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelRastreamento === 'rastreamentoBasico' && 'Rastreamento Básico Recomendado'}
                  {resultado.nivelRastreamento === 'rastreamentoModerado' && 'Rastreamento Moderado Recomendado'}
                  {resultado.nivelRastreamento === 'rastreamentoAvancado' && 'Rastreamento Avançado Recomendado'}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações de Rastreamento
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-purple-800">
                      <span className="text-purple-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnósticos Nutricionais */}
              {diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
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
                        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 border-l-4 border-purple-500">
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
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Comece a rastrear sua alimentação hoje mesmo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Use um aplicativo ou caderno para registrar seus alimentos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Seja consistente - rastreie por pelo menos 30 dias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Analise os padrões identificados após algumas semanas</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Nível: ${resultado.nivelRastreamento === 'rastreamentoBasico' ? 'Básico' : resultado.nivelRastreamento === 'rastreamentoModerado' ? 'Moderado' : 'Avançado'} | Objetivo: ${dados.objetivo || 'Geral'}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    experiencia: '',
                    frequencia: '',
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
                    frequencia: '',
                    detalhamento: '',
                    objetivo: ''
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
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

