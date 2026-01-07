'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { guiaHidratacaoDiagnosticos } from '@/lib/diagnostics'

interface Resultado {
  nivelHidratacao: string
  necessidadeAgua: number
  estrategias: string[]
  cronograma: Array<{ horario: string; quantidade: string; motivo: string }>
}

interface DiagnosticoCompleto {
  diagnostico?: string
  causaRaiz?: string
  acaoImediata?: string
  plano7Dias?: string
  suplementacao?: string
  alimentacao?: string
  proximoPasso?: string
}

export default function GuiaHidratacao({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    peso: '',
    atividade: '',
    clima: '',
    aguaAtual: '',
    sintomas: [] as string[]
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciarGuia = () => {
    setEtapa('formulario')
  }

  const calcularHidratacao = () => {
    if (!dados.peso || !dados.atividade || !dados.clima || !dados.aguaAtual) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const peso = parseFloat(dados.peso)
    if (isNaN(peso) || peso <= 0) {
      alert('Por favor, insira um peso válido.')
      return
    }

    const aguaAtualNum = parseFloat(dados.aguaAtual)
    if (isNaN(aguaAtualNum) || aguaAtualNum < 0) {
      alert('Por favor, insira um valor válido para consumo atual de água.')
      return
    }

    // Calcular necessidade base (35ml/kg)
    let necessidadeBase = peso * 35 // ml
    let necessidadeLitros = necessidadeBase / 1000

    // Ajustes por atividade
    let ajusteAtividade = 0
    if (dados.atividade === 'sedentario') {
      ajusteAtividade = 0
    } else if (dados.atividade === 'leve') {
      ajusteAtividade = 500 // +500ml
    } else if (dados.atividade === 'moderada') {
      ajusteAtividade = 1000 // +1L
    } else if (dados.atividade === 'intensa') {
      ajusteAtividade = 1500 // +1.5L
    }

    // Ajustes por clima
    let ajusteClima = 0
    if (dados.clima === 'quente') {
      ajusteClima = 500 // +500ml
    } else if (dados.clima === 'muito-quente') {
      ajusteClima = 1000 // +1L
    }

    // Necessidade total
    const necessidadeTotal = necessidadeBase + ajusteAtividade + ajusteClima
    const necessidadeTotalLitros = necessidadeTotal / 1000

    // Determinar nível de hidratação e resultado
    let nivelHidratacao = 'baixaHidratacao'
    let estrategias: string[] = []
    let cronograma: Array<{ horario: string; quantidade: string; motivo: string }> = []

    const porcentagemHidratacao = (aguaAtualNum / necessidadeTotalLitros) * 100

    if (porcentagemHidratacao < 70) {
      nivelHidratacao = 'baixaHidratacao'
      estrategias = [
        'Comece adicionando 500ml de água por dia',
        'Mantenha uma garrafa de água sempre por perto',
        'Beba água ao acordar (300ml)',
        'Configure lembretes no celular',
        'Aumente consumo de frutas e vegetais ricos em água'
      ]
      cronograma = [
        { horario: 'Ao acordar (7h)', quantidade: '300ml', motivo: 'Reidratação após jejum noturno' },
        { horario: 'Café da manhã (8h)', quantidade: '200ml', motivo: 'Hidratação com refeição' },
        { horario: 'Meio da manhã (10h)', quantidade: '250ml', motivo: 'Manter hidratação constante' },
        { horario: 'Almoço (12h)', quantidade: '300ml', motivo: 'Hidratação com refeição principal' },
        { horario: 'Meio da tarde (15h)', quantidade: '250ml', motivo: 'Evitar desidratação' },
        { horario: 'Jantar (19h)', quantidade: '300ml', motivo: 'Finalizar dia hidratado' }
      ]
    } else if (porcentagemHidratacao >= 70 && porcentagemHidratacao < 95) {
      nivelHidratacao = 'hidratacaoModerada'
      estrategias = [
        'Otimize timing da hidratação (pré/durante/pós atividade)',
        'Considere bebidas isotônicas para atividades intensas',
        'Mantenha hidratação consistente ao longo do dia',
        'Aumente qualidade dos líquidos (água filtrada, chás)',
        'Monitore sinais de desidratação durante exercícios'
      ]
      cronograma = [
        { horario: 'Ao acordar (7h)', quantidade: '400ml', motivo: 'Reidratação completa' },
        { horario: 'Pré-atividade (9h)', quantidade: '300ml', motivo: 'Preparar para exercício' },
        { horario: 'Durante atividade', quantidade: '250ml a cada 20min', motivo: 'Manter performance' },
        { horario: 'Pós-atividade (10h30)', quantidade: '500ml', motivo: 'Recuperação e reposição' },
        { horario: 'Almoço (12h)', quantidade: '300ml', motivo: 'Hidratação com refeição' },
        { horario: 'Meio da tarde (15h)', quantidade: '300ml', motivo: 'Manter níveis adequados' },
        { horario: 'Jantar (19h)', quantidade: '300ml', motivo: 'Finalizar dia hidratado' }
      ]
    } else {
      nivelHidratacao = 'altaHidratacao'
      estrategias = [
        'Mantenha padrão atual de hidratação',
        'Refine timing estratégico para máxima performance',
        'Considere eletrólitos para atividades muito longas',
        'Otimize qualidade (águas alcalinas, bebidas funcionais)',
        'Monitore balanço eletrolítico em treinos intensos'
      ]
      cronograma = [
        { horario: 'Ao acordar (7h)', quantidade: '500ml', motivo: 'Reidratação otimizada' },
        { horario: 'Pré-atividade (9h)', quantidade: '400ml', motivo: 'Pré-hidratação estratégica' },
        { horario: 'Durante atividade', quantidade: '300ml a cada 15min', motivo: 'Hidratação de elite' },
        { horario: 'Imediato pós-atividade (10h30)', quantidade: '600ml', motivo: 'Recuperação maximizada' },
        { horario: 'Almoço (12h)', quantidade: '400ml', motivo: 'Hidratação com refeição' },
        { horario: 'Meio da tarde (15h)', quantidade: '350ml', motivo: 'Manter níveis ótimos' },
        { horario: 'Jantar (19h)', quantidade: '350ml', motivo: 'Finalizar dia otimizado' },
        { horario: 'Antes de dormir (21h)', quantidade: '200ml', motivo: 'Hidratação noturna estratégica' }
      ]
    }

    const diagnosticoCompleto = guiaHidratacaoDiagnosticos.wellness[nivelHidratacao as keyof typeof guiaHidratacaoDiagnosticos.wellness] as DiagnosticoCompleto
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelHidratacao,
      necessidadeAgua: Math.round(necessidadeTotalLitros * 10) / 10,
      estrategias,
      cronograma
    })
    setEtapa('resultado')
  }

  const toggleSintoma = (sintoma: string) => {
    if (dados.sintomas.includes(sintoma)) {
      setDados({
        ...dados,
        sintomas: dados.sintomas.filter(s => s !== sintoma)
      })
    } else {
      setDados({
        ...dados,
        sintomas: [...dados.sintomas, sintoma]
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Guia de Hidratação"
        defaultDescription="Descubra seu nível ideal de hidratação"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          const templateBenefits = getTemplateBenefits('hydration-guide')
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="💧"
              defaultTitle="Guia de Hidratação"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu nível ideal de hidratação
                  </p>
                  <p className="text-gray-600">
                    Aprenda como a água pode transformar sua energia e performance
                  </p>
                </>
              }
              discover={templateBenefits.discover}
              benefits={templateBenefits.whyUse}
              benefitsTitle="A importância de saber a quantidade de água"
              onStart={iniciarGuia}
              buttonText="💧 Começar Guia de Hidratação - É Grátis"
            />
          )
        })()}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Seu Guia de Hidratação</h2>
              <p className="text-gray-600">Responda as perguntas para receber um guia personalizado de hidratação.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu peso (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dados.peso}
                  onChange={(e) => setDados({ ...dados, peso: e.target.value })}
                  placeholder="Ex: 70"
                  required
                  min="1"
                  step="0.1"
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
                  <option value="moderada">Moderada - Exercício moderado 3-5x por semana</option>
                  <option value="intensa">Intensa - Exercício intenso 5-7x por semana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clima onde você vive/trabalha <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.clima}
                  onChange={(e) => setDados({ ...dados, clima: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="temperado">Temperado - Clima ameno</option>
                  <option value="quente">Quente - Calor moderado</option>
                  <option value="muito-quente">Muito Quente - Calor intenso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quanto de água você bebe atualmente? (litros/dia) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dados.aguaAtual}
                  onChange={(e) => setDados({ ...dados, aguaAtual: e.target.value })}
                  placeholder="Ex: 1.5 (use ponto para decimal)"
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <p className="text-sm text-gray-500 mt-1">Não precisa ser exato, apenas uma estimativa do seu consumo médio diário</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você já sentiu algum destes sintomas? (opcional)
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['Sede frequente', 'Boca seca', 'Urina escura', 'Cansaço', 'Dor de cabeça', 'Pele seca'].map((sintoma) => (
                    <button
                      key={sintoma}
                      type="button"
                      onClick={() => toggleSintoma(sintoma)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.sintomas.includes(sintoma)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {dados.sintomas.includes(sintoma) && '✓ '}{sintoma}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={calcularHidratacao}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    backgroundColor: config.custom_colors.principal
                  }
                : {
                    backgroundColor: '#0284c7'
                  }}
            >
              Gerar Meu Guia de Hidratação →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-blue-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💧</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Guia de Hidratação Personalizado</h2>
                <p className="text-gray-600 text-lg">
                  Sua necessidade diária de água: <span className="font-bold text-blue-600">{resultado.necessidadeAgua}L</span>
                </p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Seu Nível de Hidratação
                </h3>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-800">
                    {resultado.nivelHidratacao === 'baixaHidratacao' && '🔴 Hidratação Baixa - Necessita melhorias'}
                    {resultado.nivelHidratacao === 'hidratacaoModerada' && '🟡 Hidratação Moderada - Pode ser otimizada'}
                    {resultado.nivelHidratacao === 'altaHidratacao' && '🟢 Hidratação Excelente - Mantenha e otimize'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Estratégias Recomendadas
                </h3>
                <ul className="space-y-2">
                  {resultado.estrategias.map((estrategia, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{estrategia}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⏰</span>
                  Cronograma de Hidratação Diária
                </h3>
                <div className="space-y-3">
                  {resultado.cronograma.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900">{item.horario}</span>
                        <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">
                          {item.quantidade}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{item.motivo}</p>
                    </div>
                  ))}
                </div>
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
                  <span className="text-2xl mr-2">💪</span>
                  Dicas Importantes sobre Hidratação
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>A cor da urina é um bom indicador: amarelo claro = bem hidratado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Beba água antes de sentir sede - sede já indica desidratação leve</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Em atividades intensas, considere bebidas isotônicas para repor eletrólitos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Alimentos ricos em água (frutas, vegetais) também contam para hidratação</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Evite beber grandes quantidades de uma vez - distribua ao longo do dia</span>
                  </li>
                </ul>
              </div>
            </div>

                        {/* Formulário de coleta de dados temporariamente desabilitado */}
                        {/* Formulário de coleta de dados temporariamente desabilitado */}
            {/* <LeadCapturePostResult */}
            {/* config={config} */}
            {/* ferramenta="Guia de Hidratação" */}
            {/* resultadoTexto={`Nível: ${resultado.nivelHidratacao === 'baixaHidratacao' ? 'Baixa' : resultado.nivelHidratacao === 'hidratacaoModerada' ? 'Moderada' : 'Alta'} | ${resultado.necessidadeAgua}L/dia`} */}
            {/* mensagemConvite="💧 Quer dominar a arte da hidratação?" */}
            {/* beneficios={[ */}
            {/* 'Plano de hidratação estratégico personalizado', */}
            {/* 'Orientações sobre tipos de água e eletrólitos', */}
            {/* 'Cronograma adaptado à sua rotina', */}
            {/* 'Impacto positivo em energia, pele e saúde' */}
            {/* ]} */}
            {/* /> */}

            <WellnessActionButtons
          onRecalcular={() => {
          setDados({
          peso: '',
          atividade: '',
          clima: '',
          aguaAtual: '',
          sintomas: []
          })
          setResultado(null)
          setDiagnostico(null)
          setEtapa('formulario')
          }}
          onVoltarInicio={() => {
          setDados({
          peso: '',
          atividade: '',
          clima: '',
          aguaAtual: '',
          sintomas: []
          })
          setResultado(null)
          setDiagnostico(null)
          setEtapa('landing')
          }}
          textoRecalcular="↺ Refazer Cálculo"
          />
          </div>
        )}
      </main>
    </div>
  )
}

