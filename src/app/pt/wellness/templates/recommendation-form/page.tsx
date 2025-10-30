'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface Recomendacao {
  categoria: string
  descricao: string
  acoes: string[]
}

interface Resultado {
  nivelRecomendacao: string
  recomendacoes: Recomendacao[]
  prioridades: string[]
  proximosPassos: string[]
}

export default function FormularioRecomendacao({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    objetivo: '',
    experiencia: '',
    restricoes: [] as string[],
    sintomas: [] as string[],
    rotina: '',
    orcamento: '',
    disponibilidade: '',
    preferencias: [] as string[],
    dificuldades: [] as string[]
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const restricoesDisponiveis = [
    'Vegano',
    'Vegetariano',
    'Sem glúten',
    'Sem lactose',
    'Low carb',
    'Sem açúcar refinado',
    'Halal',
    'Kosher'
  ]

  const sintomasDisponiveis = [
    'Fadiga crônica',
    'Problemas digestivos',
    'Dores de cabeça frequentes',
    'Dificuldade para dormir',
    'Ansiedade',
    'Irritabilidade',
    'Baixa imunidade',
    'Problemas de pele'
  ]

  const preferenciasDisponiveis = [
    'Comidas rápidas e práticas',
    'Receitas elaboradas',
    'Comidas frias',
    'Comidas quentes',
    'Sabores intensos',
    'Sabores suaves',
    'Comidas doces',
    'Comidas salgadas'
  ]

  const dificuldadesDisponiveis = [
    'Falta de tempo para cozinhar',
    'Dificuldade em seguir dietas',
    'Falta de motivação',
    'Orçamento limitado',
    'Falta de conhecimento nutricional',
    'Ambiente não favorável',
    'Dúvidas sobre o que comer',
    'Falta de planejamento'
  ]

  const iniciarFormulario = () => {
    setEtapa('formulario')
  }

  const toggleArray = (array: string[], item: string, field: keyof typeof dados) => {
    const currentArray = dados[field] as string[]
    if (currentArray.includes(item)) {
      setDados({
        ...dados,
        [field]: currentArray.filter(i => i !== item)
      })
    } else {
      setDados({
        ...dados,
        [field]: [...currentArray, item]
      })
    }
  }

  const processarRecomendacoes = () => {
    if (!dados.objetivo || !dados.experiencia || !dados.rotina || !dados.orcamento) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const numRestricoes = dados.restricoes.length
    const numSintomas = dados.sintomas.length
    const numDificuldades = dados.dificuldades.length
    const experienciaAvancada = dados.experiencia === 'avancada'
    const orcamentoAlto = dados.orcamento === 'alto'

    // Determinar nível de recomendação
    let nivelRecomendacao = 'recomendacaoBasica'
    let recomendacoes: Recomendacao[] = []
    let prioridades: string[] = []
    let proximosPassos: string[] = []

    if ((numSintomas >= 4 && numDificuldades >= 3) || (experienciaAvancada && orcamentoAlto && numRestricoes >= 3)) {
      nivelRecomendacao = 'recomendacaoAvancada'
      prioridades = [
        'Abordagem complexa e especializada',
        'Múltiplas estratégias integradas',
        'Refinamentos de precisão',
        'Otimização máxima personalizada'
      ]
      proximosPassos = [
        'Consulta com nutricionista especializado',
        'Análise completa de exames',
        'Plano avançado personalizado',
        'Acompanhamento especializado regular'
      ]
      recomendacoes = [
        {
          categoria: 'Alimentação Avançada',
          descricao: 'Estratégias nutricionais avançadas e refinadas',
          acoes: [
            'Protocolos nutricionais especializados',
            'Timing nutricional de precisão',
            'Combinações sinérgicas de alimentos',
            'Otimização de micronutrientes específicos'
          ]
        },
        {
          categoria: 'Suplementação Especializada',
          descricao: 'Protocolos de suplementação avançados',
          acoes: [
            'Nutracêuticos específicos',
            'Protocolos de suplementação em ciclos',
            'Combinações sinérgicas de suplementos',
            'Ajustes baseados em respostas individuais'
          ]
        },
        {
          categoria: 'Otimização de Performance',
          descricao: 'Estratégias para otimização máxima',
          acoes: [
            'Biohacking nutricional',
            'Nutrigenômica aplicada',
            'Otimização hormonal através da nutrição',
            'Estratégias de longevidade e anti-envelhecimento'
          ]
        }
      ]
    } else if (numSintomas >= 2 || numDificuldades >= 2 || experienciaAvancada || orcamentoAlto) {
      nivelRecomendacao = 'recomendacaoModerada'
      prioridades = [
        'Estratégias direcionadas e específicas',
        'Otimizações baseadas no perfil',
        'Mudanças estratégicas progressivas',
        'Acompanhamento para resultados'
      ]
      proximosPassos = [
        'Avaliação nutricional detalhada',
        'Plano moderado personalizado',
        'Estratégias de otimização específicas',
        'Acompanhamento para ajustes'
      ]
      recomendacoes = [
        {
          categoria: 'Alimentação Otimizada',
          descricao: 'Estratégias nutricionais direcionadas',
          acoes: [
            'Plano alimentar específico para seu objetivo',
            'Otimização de macronutrientes',
            'Timing nutricional estratégico',
            'Integração de alimentos funcionais'
          ]
        },
        {
          categoria: 'Suplementação Direcionada',
          descricao: 'Suplementos específicos para suas necessidades',
          acoes: [
            'Identificação de deficiências específicas',
            'Suplementação direcionada',
            'Suporte para objetivos específicos',
            'Antioxidantes e adaptógenos quando necessário'
          ]
        },
        {
          categoria: 'Hábitos Estruturados',
          descricao: 'Estratégias para estabelecer hábitos consistentes',
          acoes: [
            'Planejamento semanal de refeições',
            'Estratégias de preparação antecipada',
            'Técnicas de mindfullness alimentar',
            'Monitoramento de progresso'
          ]
        }
      ]
    } else {
      nivelRecomendacao = 'recomendacaoBasica'
      prioridades = [
        'Fundamentos nutricionais sólidos',
        'Mudanças básicas e acessíveis',
        'Estabelecimento de hábitos fundamentais',
        'Base para progressão futura'
      ]
      proximosPassos = [
        'Avaliação nutricional inicial',
        'Plano básico personalizado',
        'Orientação sobre fundamentos',
        'Estabelecimento de rotina básica'
      ]
      recomendacoes = [
        {
          categoria: 'Alimentação Básica',
          descricao: 'Fundamentos nutricionais essenciais',
          acoes: [
            'Plano alimentar básico e acessível',
            'Foco em alimentos integrais',
            'Equilíbrio de macronutrientes',
            'Hidratação adequada'
          ]
        },
        {
          categoria: 'Suplementação Básica',
          descricao: 'Suporte nutricional fundamental',
          acoes: [
            'Multivitamínico de qualidade',
            'Ômega-3 para saúde geral',
            'Probióticos para saúde intestinal',
            'Vitamina D quando necessário'
          ]
        },
        {
          categoria: 'Hábitos Fundamentais',
          descricao: 'Estabelecimento de rotina básica',
          acoes: [
            'Horários regulares de refeições',
            'Planejamento básico de compras',
            'Preparação de refeições simples',
            'Monitoramento básico de progresso'
          ]
        }
      ]
    }

    const diagnosticoCompleto = getDiagnostico('formulario-recomendacao', 'nutri', nivelRecomendacao)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelRecomendacao,
      recomendacoes,
      prioridades,
      proximosPassos
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Formulário de Recomendação"
        defaultDescription="Receba recomendações personalizadas"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="📝"
            defaultTitle="Formulário de Recomendação"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Receba recomendações personalizadas
                </p>
                <p className="text-gray-600">
                  Formulário rápido para diagnóstico e recomendações nutricionais personalizadas
                </p>
              </>
            }
            benefits={[
              'Diagnóstico rápido do seu perfil',
              'Recomendações personalizadas e direcionadas',
              'Prioridades claras de ação',
              'Próximos passos específicos'
            ]}
            onStart={iniciarFormulario}
            buttonText="📝 Começar Formulário - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Formulário de Recomendação</h2>
              <p className="text-gray-600">Preencha as informações para receber recomendações personalizadas.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual é seu objetivo principal? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="perder-peso">Perder peso</option>
                  <option value="ganhar-massa">Ganhar massa muscular</option>
                  <option value="manter-peso">Manter peso</option>
                  <option value="melhorar-saude">Melhorar saúde geral</option>
                  <option value="aumentar-energia">Aumentar energia</option>
                  <option value="melhorar-digestao">Melhorar digestão</option>
                  <option value="performance-esportiva">Melhorar performance esportiva</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual é seu nível de experiência com nutrição? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.experiencia}
                  onChange={(e) => setDados({ ...dados, experiencia: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante - Estou começando</option>
                  <option value="basico">Básico - Já tenho alguma experiência</option>
                  <option value="intermediario">Intermediário - Tenho boa experiência</option>
                  <option value="avancada">Avançado - Tenho muita experiência</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restrições alimentares (selecione todas que se aplicam)
                </label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {restricoesDisponiveis.map((rest) => (
                    <button
                      key={rest}
                      type="button"
                      onClick={() => toggleArray(dados.restricoes, rest, 'restricoes')}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.restricoes.includes(rest)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      {dados.restricoes.includes(rest) && '✓ '}{rest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sintomas que você sente (selecione todas que se aplicam)
                </label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {sintomasDisponiveis.map((sint) => (
                    <button
                      key={sint}
                      type="button"
                      onClick={() => toggleArray(dados.sintomas, sint, 'sintomas')}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.sintomas.includes(sint)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      {dados.sintomas.includes(sint) && '✓ '}{sint}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Como é sua rotina diária? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.rotina}
                  onChange={(e) => setDados({ ...dados, rotina: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="muito-ocupada">Muito ocupada - Pouco tempo</option>
                  <option value="moderada">Moderada - Algum tempo disponível</option>
                  <option value="flexivel">Flexível - Tempo suficiente</option>
                  <option value="muito-flexivel">Muito flexível - Muito tempo disponível</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual é seu orçamento para alimentação? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.orcamento}
                  onChange={(e) => setDados({ ...dados, orcamento: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="limitado">Limitado - Preciso economizar</option>
                  <option value="moderado">Moderado - Orçamento razoável</option>
                  <option value="bom">Bom - Posso investir mais</option>
                  <option value="alto">Alto - Posso investir bastante</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual sua disponibilidade para preparar refeições?
                </label>
                <select
                  value={dados.disponibilidade}
                  onChange={(e) => setDados({ ...dados, disponibilidade: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione (opcional)</option>
                  <option value="nenhuma">Nenhuma - Não tenho tempo</option>
                  <option value="pouca">Pouca - Raramente cozinho</option>
                  <option value="moderada">Moderada - Cozinho algumas vezes</option>
                  <option value="alta">Alta - Cozinho frequentemente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferências alimentares (selecione todas que se aplicam)
                </label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {preferenciasDisponiveis.map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => toggleArray(dados.preferencias, pref, 'preferencias')}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.preferencias.includes(pref)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      {dados.preferencias.includes(pref) && '✓ '}{pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificuldades que você enfrenta (selecione todas que se aplicam)
                </label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {dificuldadesDisponiveis.map((dif) => (
                    <button
                      key={dif}
                      type="button"
                      onClick={() => toggleArray(dados.dificuldades, dif, 'dificuldades')}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.dificuldades.includes(dif)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      {dados.dificuldades.includes(dif) && '✓ '}{dif}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={processarRecomendacoes}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  }}
            >
              Receber Recomendações →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-green-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📝</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Suas Recomendações Personalizadas</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelRecomendacao === 'recomendacaoBasica' && 'Nível: Recomendações Básicas - Fundamentos Sólidos'}
                  {resultado.nivelRecomendacao === 'recomendacaoModerada' && 'Nível: Recomendações Moderadas - Estratégias Direcionadas'}
                  {resultado.nivelRecomendacao === 'recomendacaoAvancada' && 'Nível: Recomendações Avançadas - Otimização Máxima'}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  Prioridades de Ação
                </h3>
                <ul className="space-y-2">
                  {resultado.prioridades.map((prio, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-green-600 mr-2">{index + 1}.</span>
                      <span>{prio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 mb-6">
                {resultado.recomendacoes.map((rec, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border-2 border-green-100">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{rec.categoria}</h3>
                    <p className="text-gray-600 mb-4">{rec.descricao}</p>
                    <ul className="space-y-2">
                      {rec.acoes.map((acao, acaoIndex) => (
                        <li key={acaoIndex} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                          <span className="text-green-600 mr-2">•</span>
                          <span>{acao}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  Próximos Passos
                </h3>
                <ul className="space-y-2">
                  {resultado.proximosPassos.map((passo, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-blue-600 mr-2">→</span>
                      <span>{passo}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnósticos Nutricionais */}
              {diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                      <span className="text-2xl mr-2">📝</span>
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
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-l-4 border-green-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Recomendações: ${resultado.nivelRecomendacao === 'recomendacaoBasica' ? 'Básicas' : resultado.nivelRecomendacao === 'recomendacaoModerada' ? 'Moderadas' : 'Avançadas'} | ${resultado.recomendacoes.length} categorias`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    objetivo: '',
                    experiencia: '',
                    restricoes: [],
                    sintomas: [],
                    rotina: '',
                    orcamento: '',
                    disponibilidade: '',
                    preferencias: [],
                    dificuldades: []
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Refazer Formulário
              </button>
              <button
                onClick={() => {
                  setDados({
                    objetivo: '',
                    experiencia: '',
                    restricoes: [],
                    sintomas: [],
                    rotina: '',
                    orcamento: '',
                    disponibilidade: '',
                    preferencias: [],
                    dificuldades: []
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
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

