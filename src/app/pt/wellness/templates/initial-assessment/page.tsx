'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface Resultado {
  nivelAvaliacao: string
  resumo: {
    idade?: number
    genero: string
    objetivos: string[]
    historico: string[]
    sintomas: string[]
  }
  necessidades: string[]
  recomendacoes: string[]
}

export default function AvaliacaoInicial({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    nome: '',
    idade: '',
    genero: '',
    peso: '',
    altura: '',
    objetivo: [] as string[],
    atividade: '',
    historico: [] as string[],
    sintomas: [] as string[],
    alimentacao: '',
    hidratacao: '',
    suplementos: '',
    medicamentos: '',
    cirurgias: '',
    doencas: ''
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const objetivosDisponiveis = [
    'Perder peso',
    'Ganhar massa muscular',
    'Melhorar saúde',
    'Aumentar energia',
    'Melhorar digestão',
    'Melhorar sono',
    'Prevenir doenças',
    'Melhorar performance esportiva'
  ]

  const historicoDisponivel = [
    'Já tentei dietas anteriormente',
    'Tenho histórico familiar de doenças',
    'Já usei suplementos',
    'Tenho restrições alimentares',
    'Já fiz acompanhamento nutricional'
  ]

  const sintomasDisponiveis = [
    'Cansaço constante',
    'Problemas digestivos',
    'Problemas de sono',
    'Irritabilidade',
    'Dificuldade de concentração',
    'Dor muscular',
    'Retenção de líquidos',
    'Problemas de pele'
  ]

  const iniciarAvaliacao = () => {
    setEtapa('formulario')
  }

  const toggleObjetivo = (obj: string) => {
    if (dados.objetivo.includes(obj)) {
      setDados({
        ...dados,
        objetivo: dados.objetivo.filter(o => o !== obj)
      })
    } else {
      setDados({
        ...dados,
        objetivo: [...dados.objetivo, obj]
      })
    }
  }

  const toggleHistorico = (hist: string) => {
    if (dados.historico.includes(hist)) {
      setDados({
        ...dados,
        historico: dados.historico.filter(h => h !== hist)
      })
    } else {
      setDados({
        ...dados,
        historico: [...dados.historico, hist]
      })
    }
  }

  const toggleSintoma = (sint: string) => {
    if (dados.sintomas.includes(sint)) {
      setDados({
        ...dados,
        sintomas: dados.sintomas.filter(s => s !== sint)
      })
    } else {
      setDados({
        ...dados,
        sintomas: [...dados.sintomas, sint]
      })
    }
  }

  const processarAvaliacao = () => {
    if (!dados.idade || !dados.genero || !dados.objetivo.length || !dados.atividade) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const idadeNum = parseInt(dados.idade)
    const numObjetivos = dados.objetivo.length
    const numSintomas = dados.sintomas.length
    const numHistorico = dados.historico.length

    // Determinar nível de avaliação
    let nivelAvaliacao = 'avaliacaoBasica'
    let necessidades: string[] = []
    let recomendacoes: string[] = []

    if (numSintomas >= 5 || numHistorico >= 4 || (numObjetivos >= 4 && dados.medicamentos)) {
      nivelAvaliacao = 'avaliacaoAvancada'
      necessidades = [
        'Avaliação completa e abrangente',
        'Análise de múltiplos fatores',
        'Histórico médico detalhado',
        'Estratégias personalizadas complexas',
        'Acompanhamento profissional especializado'
      ]
      recomendacoes = [
        'Consulta nutricional completa com exames',
        'Análise detalhada de histórico médico',
        'Plano personalizado com múltiplas estratégias',
        'Acompanhamento regular e ajustes frequentes',
        'Integração com outros profissionais de saúde'
      ]
    } else if (numSintomas >= 3 || numHistorico >= 2 || numObjetivos >= 3) {
      nivelAvaliacao = 'avaliacaoModerada'
      necessidades = [
        'Avaliação detalhada e específica',
        'Análise de padrões e necessidades',
        'Estratégias direcionadas',
        'Plano personalizado moderado'
      ]
      recomendacoes = [
        'Consulta nutricional com avaliação detalhada',
        'Análise de padrões alimentares',
        'Plano personalizado direcionado',
        'Acompanhamento para otimização'
      ]
    } else {
      nivelAvaliacao = 'avaliacaoBasica'
      necessidades = [
        'Avaliação inicial completa',
        'Identificação de necessidades básicas',
        'Plano alimentar fundamental',
        'Orientação inicial personalizada'
      ]
      recomendacoes = [
        'Consulta nutricional inicial',
        'Avaliação de hábitos alimentares',
        'Plano básico personalizado',
        'Orientação sobre mudanças fundamentais'
      ]
    }

    const diagnosticoCompleto = getDiagnostico('template-avaliacao-inicial', 'nutri', nivelAvaliacao)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelAvaliacao,
      resumo: {
        idade: idadeNum,
        genero: dados.genero,
        objetivos: dados.objetivo,
        historico: dados.historico,
        sintomas: dados.sintomas
      },
      necessidades,
      recomendacoes
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Avaliação Inicial"
        defaultDescription="Avalie sua saúde de forma completa"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="📋"
            defaultTitle="Avaliação Inicial"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Avalie sua saúde de forma completa
                </p>
                <p className="text-gray-600">
                  Formulário completo para avaliação inicial e identificação de necessidades nutricionais
                </p>
              </>
            }
            benefits={[
              'Avaliação completa do seu perfil nutricional',
              'Identificação de necessidades específicas',
              'Recomendações personalizadas',
              'Base sólida para plano nutricional'
            ]}
            onStart={iniciarAvaliacao}
            buttonText="📋 Começar Avaliação - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Avaliação Inicial Completa</h2>
              <p className="text-gray-600">Preencha todas as informações para uma avaliação nutricional completa.</p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome <span className="text-gray-500 text-xs">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={dados.nome}
                    onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={dados.idade}
                    onChange={(e) => setDados({ ...dados, idade: e.target.value })}
                    placeholder="Ex: 30"
                    required
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dados.genero}
                    onChange={(e) => setDados({ ...dados, genero: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso atual (kg) <span className="text-gray-500 text-xs">(opcional)</span>
                  </label>
                  <input
                    type="number"
                    value={dados.peso}
                    onChange={(e) => setDados({ ...dados, peso: e.target.value })}
                    placeholder="Ex: 70"
                    min="1"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm) <span className="text-gray-500 text-xs">(opcional)</span>
                  </label>
                  <input
                    type="number"
                    value={dados.altura}
                    onChange={(e) => setDados({ ...dados, altura: e.target.value })}
                    placeholder="Ex: 170"
                    min="100"
                    max="250"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de atividade física <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dados.atividade}
                    onChange={(e) => setDados({ ...dados, atividade: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    <option value="">Selecione</option>
                    <option value="sedentario">Sedentário - Pouco ou nenhum exercício</option>
                    <option value="leve">Leve - Exercício leve 1-3x por semana</option>
                    <option value="moderado">Moderado - Exercício moderado 3-5x por semana</option>
                    <option value="intenso">Intenso - Exercício intenso 5-7x por semana</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quais são seus principais objetivos? <span className="text-red-500">*</span> (selecione todos que se aplicam)
                </label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {objetivosDisponiveis.map((obj) => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => toggleObjetivo(obj)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.objetivo.includes(obj)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {dados.objetivo.includes(obj) && '✓ '}{obj}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Histórico de saúde (selecione todos que se aplicam)
                </label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {historicoDisponivel.map((hist) => (
                    <button
                      key={hist}
                      type="button"
                      onClick={() => toggleHistorico(hist)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.historico.includes(hist)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {dados.historico.includes(hist) && '✓ '}{hist}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sintomas que você sente (selecione todos que se aplicam)
                </label>
                <div className="grid md:grid-cols-2 gap-3 mt-2">
                  {sintomasDisponiveis.map((sint) => (
                    <button
                      key={sint}
                      type="button"
                      onClick={() => toggleSintoma(sint)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.sintomas.includes(sint)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {dados.sintomas.includes(sint) && '✓ '}{sint}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Como você descreveria sua alimentação atual?
                </label>
                <select
                  value={dados.alimentacao}
                  onChange={(e) => setDados({ ...dados, alimentacao: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione (opcional)</option>
                  <option value="balanceada">Balanceada e saudável</option>
                  <option value="irregular">Irregular - como o que tenho tempo</option>
                  <option value="restritiva">Muito restritiva</option>
                  <option value="excessiva">Excessiva - como demais</option>
                  <option value="processados">Muitos alimentos processados</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consumo de água diário
                </label>
                <select
                  value={dados.hidratacao}
                  onChange={(e) => setDados({ ...dados, hidratacao: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione (opcional)</option>
                  <option value="pouco">Pouco - menos de 1L</option>
                  <option value="medio">Moderado - 1-2L</option>
                  <option value="bom">Bom - 2-3L</option>
                  <option value="otimo">Ótimo - mais de 3L</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você usa suplementos atualmente?
                </label>
                <select
                  value={dados.suplementos}
                  onChange={(e) => setDados({ ...dados, suplementos: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione (opcional)</option>
                  <option value="nao">Não uso</option>
                  <option value="as-vezes">Às vezes - multivitamínico</option>
                  <option value="regularmente">Regularmente - alguns suplementos</option>
                  <option value="muitos">Muitos suplementos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicamentos em uso <span className="text-gray-500 text-xs">(opcional)</span>
                </label>
                <textarea
                  value={dados.medicamentos}
                  onChange={(e) => setDados({ ...dados, medicamentos: e.target.value })}
                  placeholder="Liste os medicamentos que você usa regularmente"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cirurgias ou procedimentos anteriores <span className="text-gray-500 text-xs">(opcional)</span>
                </label>
                <textarea
                  value={dados.cirurgias}
                  onChange={(e) => setDados({ ...dados, cirurgias: e.target.value })}
                  placeholder="Descreva cirurgias ou procedimentos relevantes"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doenças ou condições de saúde <span className="text-gray-500 text-xs">(opcional)</span>
                </label>
                <textarea
                  value={dados.doencas}
                  onChange={(e) => setDados({ ...dados, doencas: e.target.value })}
                  placeholder="Descreva doenças ou condições de saúde relevantes"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            <button
              onClick={processarAvaliacao}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                  }}
            >
              Processar Avaliação →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-blue-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📋</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sua Avaliação Inicial</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelAvaliacao === 'avaliacaoBasica' && 'Nível: Avaliação Básica - Identificação de Necessidades Fundamentais'}
                  {resultado.nivelAvaliacao === 'avaliacaoModerada' && 'Nível: Avaliação Moderada - Análise Detalhada e Específica'}
                  {resultado.nivelAvaliacao === 'avaliacaoAvancada' && 'Nível: Avaliação Avançada - Análise Completa e Abrangente'}
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">👤</span>
                  Resumo do Seu Perfil
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {resultado.resumo.idade && (
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-semibold mb-1">Idade</p>
                      <p className="text-blue-900 font-medium">{resultado.resumo.idade} anos</p>
                    </div>
                  )}
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">Gênero</p>
                    <p className="text-blue-900 font-medium capitalize">{resultado.resumo.genero}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">Objetivos</p>
                    <p className="text-blue-900 font-medium">{resultado.resumo.objetivos.length} objetivo(s) identificado(s)</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-blue-600 font-semibold mb-1">Sintomas</p>
                    <p className="text-blue-900 font-medium">{resultado.resumo.sintomas.length} sintoma(s) relatado(s)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  Necessidades Identificadas
                </h3>
                <ul className="space-y-2">
                  {resultado.necessidades.map((nec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{nec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnósticos Nutricionais */}
              {diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
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
                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 border-l-4 border-blue-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📝</span>
                  Próximos Passos
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Esta avaliação é o primeiro passo para um plano nutricional personalizado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Com base nos dados coletados, será desenvolvido um plano específico para você</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Considere uma consulta profissional para análise detalhada e acompanhamento</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Avaliação: ${resultado.nivelAvaliacao === 'avaliacaoBasica' ? 'Básica' : resultado.nivelAvaliacao === 'avaliacaoModerada' ? 'Moderada' : 'Avançada'} | Objetivos: ${resultado.resumo.objetivos.length}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    nome: '',
                    idade: '',
                    genero: '',
                    peso: '',
                    altura: '',
                    objetivo: [],
                    atividade: '',
                    historico: [],
                    sintomas: [],
                    alimentacao: '',
                    hidratacao: '',
                    suplementos: '',
                    medicamentos: '',
                    cirurgias: '',
                    doencas: ''
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Refazer Avaliação
              </button>
              <button
                onClick={() => {
                  setDados({
                    nome: '',
                    idade: '',
                    genero: '',
                    peso: '',
                    altura: '',
                    objetivo: [],
                    atividade: '',
                    historico: [],
                    sintomas: [],
                    alimentacao: '',
                    hidratacao: '',
                    suplementos: '',
                    medicamentos: '',
                    cirurgias: '',
                    doencas: ''
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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

