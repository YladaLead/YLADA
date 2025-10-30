'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface Projecao {
  periodo: string
  peso?: number
  energia: string
  saude: string
  bemEstar: string
  mudancas: string[]
}

interface Resultado {
  nivelResultados: string
  resultadoAtual: {
    peso?: number
    energia: number
    saude: number
    bemEstar: number
  }
  projecoes: Projecao[]
  mudancasChave: string[]
}

export default function SimuladorResultados({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    pesoAtual: '',
    objetivo: '',
    mudancasPlanejadas: [] as string[],
    consistencia: '',
    tempo: ''
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const mudancasDisponiveis = [
    'Beber mais água (2-3L/dia)',
    'Incluir vegetais em todas refeições',
    'Reduzir açúcar refinado',
    'Aumentar proteína',
    'Melhorar qualidade do sono',
    'Aumentar atividade física',
    'Reduzir alimentos processados',
    'Comer em horários regulares'
  ]

  const iniciarSimulacao = () => {
    setEtapa('formulario')
  }

  const toggleMudanca = (mudanca: string) => {
    if (dados.mudancasPlanejadas.includes(mudanca)) {
      setDados({
        ...dados,
        mudancasPlanejadas: dados.mudancasPlanejadas.filter(m => m !== mudanca)
      })
    } else {
      setDados({
        ...dados,
        mudancasPlanejadas: [...dados.mudancasPlanejadas, mudanca]
      })
    }
  }

  const simularResultados = () => {
    if (!dados.objetivo || !dados.consistencia || !dados.tempo) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const pesoAtualNum = dados.pesoAtual ? parseFloat(dados.pesoAtual) : null
    const numMudancas = dados.mudancasPlanejadas.length
    const consistenciaNum = parseFloat(dados.consistencia)

    // Determinar nível de resultados baseado no perfil
    let nivelResultados = 'resultadosBasicos'
    let projecoes: Projecao[] = []
    let mudancasChave: string[] = []

    if (numMudancas >= 5 && consistenciaNum >= 80 && (dados.tempo === '6meses' || dados.tempo === '12meses')) {
      nivelResultados = 'resultadosAvancados'
      mudancasChave = [
        'Mudanças múltiplas e estratégicas',
        'Alta consistência (80%+)',
        'Foco em otimização de longo prazo',
        'Abordagem integrada de hábitos'
      ]

      // Projeções avançadas
      const perdaPesoAvancada = pesoAtualNum && dados.objetivo === 'perder-peso' 
        ? Math.round(pesoAtualNum * 0.15) // ~15% em 12 meses
        : null

      projecoes = [
        {
          periodo: '1 Mês',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.02) : undefined,
          energia: 'Muito Boa',
          saude: 'Significativa melhoria',
          bemEstar: 'Aumento notável',
          mudancas: ['Aderência alta às mudanças', 'Primeiros resultados visíveis', 'Energia aumentando']
        },
        {
          periodo: '3 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.06) : undefined,
          energia: 'Excelente',
          saude: 'Melhoria consolidada',
          bemEstar: 'Melhoria consistente',
          mudancas: ['Hábitos consolidados', 'Resultados visíveis', 'Motivação alta']
        },
        {
          periodo: '6 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.10) : undefined,
          energia: 'Ótima',
          saude: 'Grande melhoria',
          bemEstar: 'Transformação significativa',
          mudancas: ['Resultados duradouros', 'Novos hábitos automáticos', 'Performance otimizada']
        },
        {
          periodo: '12 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? perdaPesoAvancada : undefined,
          energia: 'Ótima (sustentada)',
          saude: 'Transformação completa',
          bemEstar: 'Novo padrão estabelecido',
          mudancas: ['Transformação completa', 'Hábitos de elite', 'Resultados sustentados']
        }
      ]
    } else if (numMudancas >= 3 && consistenciaNum >= 60) {
      nivelResultados = 'resultadosModerados'
      mudancasChave = [
        'Mudanças estratégicas',
        'Boa consistência (60-79%)',
        'Foco em progressão gradual',
        'Abordagem equilibrada'
      ]

      const perdaPesoModerada = pesoAtualNum && dados.objetivo === 'perder-peso'
        ? Math.round(pesoAtualNum * 0.10) // ~10% em 12 meses
        : null

      projecoes = [
        {
          periodo: '1 Mês',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.015) : undefined,
          energia: 'Boa',
          saude: 'Melhoria inicial',
          bemEstar: 'Aumento moderado',
          mudancas: ['Primeiros passos', 'Resultados iniciais', 'Motivação em construção']
        },
        {
          periodo: '3 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.04) : undefined,
          energia: 'Boa a Muito Boa',
          saude: 'Melhoria estabelecida',
          bemEstar: 'Melhoria constante',
          mudancas: ['Progresso consistente', 'Resultados visíveis', 'Hábitos se formando']
        },
        {
          periodo: '6 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.07) : undefined,
          energia: 'Muito Boa',
          saude: 'Melhoria significativa',
          bemEstar: 'Transformação em curso',
          mudancas: ['Resultados sólidos', 'Hábitos consolidados', 'Progresso mantido']
        },
        {
          periodo: '12 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? perdaPesoModerada : undefined,
          energia: 'Muito Boa (sustentada)',
          saude: 'Grande melhoria',
          bemEstar: 'Novo padrão de vida',
          mudancas: ['Resultados duradouros', 'Estilo de vida transformado', 'Mudanças permanentes']
        }
      ]
    } else {
      nivelResultados = 'resultadosBasicos'
      mudancasChave = [
        'Mudanças simples e fundamentais',
        'Consistência básica (50-69%)',
        'Foco em sustentabilidade',
        'Progresso gradual'
      ]

      const perdaPesoBasica = pesoAtualNum && dados.objetivo === 'perder-peso'
        ? Math.round(pesoAtualNum * 0.07) // ~7% em 12 meses
        : null

      projecoes = [
        {
          periodo: '1 Mês',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.01) : undefined,
          energia: 'Melhorando',
          saude: 'Pequenas melhorias',
          bemEstar: 'Início de mudança',
          mudancas: ['Primeiros passos', 'Ajustes iniciais', 'Foco em consistência']
        },
        {
          periodo: '3 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.03) : undefined,
          energia: 'Boa',
          saude: 'Melhoria gradual',
          bemEstar: 'Aumento progressivo',
          mudancas: ['Progresso constante', 'Resultados iniciais', 'Hábitos se formando']
        },
        {
          periodo: '6 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? Math.round(pesoAtualNum - pesoAtualNum * 0.05) : undefined,
          energia: 'Boa',
          saude: 'Melhoria estabelecida',
          bemEstar: 'Melhoria consolidada',
          mudancas: ['Resultados visíveis', 'Hábitos básicos consolidados', 'Progresso mantido']
        },
        {
          periodo: '12 Meses',
          peso: pesoAtualNum && dados.objetivo === 'perder-peso' ? perdaPesoBasica : undefined,
          energia: 'Boa (sustentada)',
          saude: 'Melhoria significativa',
          bemEstar: 'Mudanças duradouras',
          mudancas: ['Resultados sustentados', 'Novo estilo de vida', 'Progresso mantido']
        }
      ]
    }

    // Calcular estado atual (simulado)
    const resultadoAtual = {
      peso: pesoAtualNum || undefined,
      energia: 40,
      saude: 40,
      bemEstar: 40
    }

    const diagnosticoCompleto = getDiagnostico('simulador-resultados', 'nutri', nivelResultados)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelResultados,
      resultadoAtual,
      projecoes,
      mudancasChave
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Simulador de Resultados"
        defaultDescription="Veja seus resultados antes de começar"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="🔮"
            defaultTitle="Simulador de Resultados"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Veja seus resultados antes de começar
                </p>
                <p className="text-gray-600">
                  Simule resultados futuros baseados em mudanças de hábitos nutricionais
                </p>
              </>
            }
            benefits={[
              'Projeção de resultados em 1, 3, 6 e 12 meses',
              'Visualização de progresso futuro',
              'Estimativas baseadas em mudanças reais',
              'Motivação através de perspectiva futura'
            ]}
            onStart={iniciarSimulacao}
            buttonText="🔮 Começar Simulação - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Sua Simulação</h2>
              <p className="text-gray-600">Preencha os dados para simular seus resultados futuros.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso atual (kg) <span className="text-gray-500 text-xs">(opcional)</span>
                </label>
                <input
                  type="number"
                  value={dados.pesoAtual}
                  onChange={(e) => setDados({ ...dados, pesoAtual: e.target.value })}
                  placeholder="Ex: 70"
                  min="1"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual seu principal objetivo? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="perder-peso">Perder peso</option>
                  <option value="ganhar-massa">Ganhar massa muscular</option>
                  <option value="aumentar-energia">Aumentar energia</option>
                  <option value="melhorar-saude">Melhorar saúde geral</option>
                  <option value="bem-estar">Aumentar bem-estar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quais mudanças você planeja fazer? (selecione todas que se aplicam)
                </label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {mudancasDisponiveis.map((mudanca) => (
                    <button
                      key={mudanca}
                      type="button"
                      onClick={() => toggleMudanca(mudanca)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.mudancasPlanejadas.includes(mudanca)
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      {dados.mudancasPlanejadas.includes(mudanca) && '✓ '}{mudanca}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual nível de consistência você acredita conseguir manter? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.consistencia}
                  onChange={(e) => setDados({ ...dados, consistencia: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="50">50% - Alguns dias da semana</option>
                  <option value="60">60% - Maioria dos dias</option>
                  <option value="70">70% - Quase todos os dias</option>
                  <option value="80">80% - Muito consistente</option>
                  <option value="90">90% - Extremamente consistente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quanto tempo você pretende manter essas mudanças? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.tempo}
                  onChange={(e) => setDados({ ...dados, tempo: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="1mes">1 mês</option>
                  <option value="3meses">3 meses</option>
                  <option value="6meses">6 meses</option>
                  <option value="12meses">12 meses ou mais</option>
                </select>
              </div>
            </div>

            <button
              onClick={simularResultados}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
                  }}
            >
              Simular Meus Resultados →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-purple-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🔮</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sua Projeção de Resultados</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelResultados === 'resultadosBasicos' && 'Nível: Resultados Básicos - Progresso Sustentável'}
                  {resultado.nivelResultados === 'resultadosModerados' && 'Nível: Resultados Moderados - Progresso Acelerado'}
                  {resultado.nivelResultados === 'resultadosAvancados' && 'Nível: Resultados Avançados - Transformação Completa'}
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Mudanças-Chave Identificadas
                </h3>
                <ul className="space-y-2">
                  {resultado.mudancasChave.map((mudanca, index) => (
                    <li key={index} className="flex items-start text-purple-800 bg-white rounded-lg p-3">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>{mudanca}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center text-xl">
                  <span className="text-2xl mr-2">📈</span>
                  Projeções de Resultados
                </h3>
                <div className="space-y-4">
                  {resultado.projecoes.map((projecao, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 text-xl">{projecao.periodo}</h4>
                        {projecao.peso && (
                          <span className="text-lg font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                            {projecao.peso} kg
                          </span>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-purple-50 rounded-lg p-3">
                          <p className="text-xs text-purple-600 font-semibold mb-1">⚡ Energia</p>
                          <p className="text-purple-900 font-medium">{projecao.energia}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-green-600 font-semibold mb-1">💚 Saúde</p>
                          <p className="text-green-900 font-medium">{projecao.saude}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-600 font-semibold mb-1">😊 Bem-Estar</p>
                          <p className="text-blue-900 font-medium">{projecao.bemEstar}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs text-gray-600 font-semibold mb-2">Mudanças esperadas:</p>
                        <ul className="space-y-1">
                          {projecao.mudancas.map((mudanca, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              <span>{mudanca}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnósticos Nutricionais */}
              {diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
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
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-l-4 border-purple-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Lembrete Importante
                </h3>
                <p className="text-gray-700 mb-3">
                  Estas são projeções baseadas em mudanças de hábitos mantidas consistentemente. Resultados individuais podem variar baseado em fatores genéticos, metabólicos e outros fatores de saúde.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Consistência é a chave para resultados duradouros</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Pequenas mudanças sustentáveis geram melhores resultados que mudanças extremas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Resultados reais podem variar de pessoa para pessoa</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Resultados: ${resultado.nivelResultados === 'resultadosBasicos' ? 'Básicos' : resultado.nivelResultados === 'resultadosModerados' ? 'Moderados' : 'Avançados'} | Objetivo: ${dados.objetivo}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    pesoAtual: '',
                    objetivo: '',
                    mudancasPlanejadas: [],
                    consistencia: '',
                    tempo: ''
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Nova Simulação
              </button>
              <button
                onClick={() => {
                  setDados({
                    pesoAtual: '',
                    objetivo: '',
                    mudancasPlanejadas: [],
                    consistencia: '',
                    tempo: ''
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

