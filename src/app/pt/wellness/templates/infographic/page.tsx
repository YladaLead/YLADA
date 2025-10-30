'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface Pergunta {
  id: string
  texto: string
  opcoes: Array<{ valor: number; texto: string }>
}

interface Resultado {
  nivelConhecimento: string
  pontuacao: number
  recomendacoes: Array<{ topico: string; descricao: string; nivel: string }>
}

const perguntas: Pergunta[] = [
  {
    id: 'macronutrientes',
    texto: 'Quais são os três macronutrientes principais?',
    opcoes: [
      { valor: 1, texto: 'Não tenho certeza' },
      { valor: 2, texto: 'Carboidratos, proteínas e gorduras' },
      { valor: 3, texto: 'Carboidratos, proteínas, gorduras e suas funções específicas' }
    ]
  },
  {
    id: 'hidratacao',
    texto: 'Quanto de água você conhece sobre hidratação ideal?',
    opcoes: [
      { valor: 1, texto: 'Beba quando sentir sede' },
      { valor: 2, texto: 'Aproximadamente 2-3L por dia para adultos' },
      { valor: 3, texto: '35ml/kg de peso + ajustes por atividade e clima' }
    ]
  },
  {
    id: 'timing',
    texto: 'Como você entende o timing nutricional?',
    opcoes: [
      { valor: 1, texto: 'Não conheço conceitos de timing' },
      { valor: 2, texto: 'Distribuir refeições ao longo do dia é importante' },
      { valor: 3, texto: 'Timing estratégico pré/durante/pós atividade otimiza resultados' }
    ]
  },
  {
    id: 'superalimentos',
    texto: 'O que você sabe sobre alimentos funcionais e superalimentos?',
    opcoes: [
      { valor: 1, texto: 'Conceitos que ouvi falar mas não entendo bem' },
      { valor: 2, texto: 'Alimentos com propriedades especiais para saúde' },
      { valor: 3, texto: 'Alimentos funcionais específicos e suas aplicações estratégicas' }
    ]
  },
  {
    id: 'micronutrientes',
    texto: 'Como você entende a importância dos micronutrientes?',
    opcoes: [
      { valor: 1, texto: 'Vitaminas e minerais são importantes mas não sei detalhes' },
      { valor: 2, texto: 'Micronutrientes são essenciais para funções vitais' },
      { valor: 3, texto: 'Balanço e sinergia de micronutrientes para otimização metabólica' }
    ]
  }
]

export default function InfograficoEducativo({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [respostas, setRespostas] = useState<Record<string, number>>({})
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciarQuiz = () => {
    setEtapa('quiz')
    setPerguntaAtual(0)
    setRespostas({})
  }

  const responderPergunta = (valor: number) => {
    const novaResposta = { ...respostas, [perguntas[perguntaAtual].id]: valor }
    setRespostas(novaResposta)

    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      calcularResultado(novaResposta)
    }
  }

  const calcularResultado = (respostasCompletas: Record<string, number>) => {
    const pontuacaoTotal = Object.values(respostasCompletas).reduce((sum, val) => sum + val, 0)
    const pontuacaoMaxima = perguntas.length * 3
    const porcentagem = (pontuacaoTotal / pontuacaoMaxima) * 100

    let nivelConhecimento = 'conhecimentoBasico'
    let recomendacoes: Array<{ topico: string; descricao: string; nivel: string }> = []

    if (porcentagem >= 71) {
      nivelConhecimento = 'conhecimentoAvancado'
      recomendacoes = [
        {
          topico: 'Nutrigenômica',
          descricao: 'Como genes influenciam resposta nutricional',
          nivel: 'Avançado'
        },
        {
          topico: 'Estratégias de Elite',
          descricao: 'Refinamentos para alta performance',
          nivel: 'Avançado'
        },
        {
          topico: 'Ciência Atualizada',
          descricao: 'Pesquisas recentes em nutrição',
          nivel: 'Avançado'
        },
        {
          topico: 'Fitoquímicos Avançados',
          descricao: 'Compostos bioativos especializados',
          nivel: 'Avançado'
        }
      ]
    } else if (porcentagem >= 41) {
      nivelConhecimento = 'conhecimentoModerado'
      recomendacoes = [
        {
          topico: 'Timing Nutricional',
          descricao: 'Otimização de horários das refeições',
          nivel: 'Moderado'
        },
        {
          topico: 'Alimentos Funcionais',
          descricao: 'Superalimentos e suas propriedades',
          nivel: 'Moderado'
        },
        {
          topico: 'Combinações Estratégicas',
          descricao: 'Sinergia entre alimentos',
          nivel: 'Moderado'
        },
        {
          topico: 'Nutrição Esportiva',
          descricao: 'Estratégias para atividade física',
          nivel: 'Moderado'
        }
      ]
    } else {
      nivelConhecimento = 'conhecimentoBasico'
      recomendacoes = [
        {
          topico: 'Macronutrientes Básicos',
          descricao: 'Carboidratos, proteínas e gorduras',
          nivel: 'Básico'
        },
        {
          topico: 'Hidratação',
          descricao: 'Importância da água e consumo ideal',
          nivel: 'Básico'
        },
        {
          topico: 'Alimentação Saudável',
          descricao: 'Fundamentos de uma dieta equilibrada',
          nivel: 'Básico'
        },
        {
          topico: 'Micronutrientes Essenciais',
          descricao: 'Vitaminas e minerais fundamentais',
          nivel: 'Básico'
        }
      ]
    }

    const diagnosticoCompleto = getDiagnostico('infografico-educativo', 'nutri', nivelConhecimento)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelConhecimento,
      pontuacao: Math.round(porcentagem),
      recomendacoes
    })
    setEtapa('resultado')
  }

  const voltarPergunta = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
    }
  }

  const progresso = ((perguntaAtual + 1) / perguntas.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Infográfico Educativo"
        defaultDescription="Aprenda de forma visual e eficiente"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="📊"
            defaultTitle="Infográfico Educativo"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Aprenda de forma visual e eficiente
                </p>
                <p className="text-gray-600">
                  Descubra seu nível de conhecimento e receba infográficos educativos personalizados
                </p>
              </>
            }
            benefits={[
              'Avaliação rápida do seu conhecimento nutricional',
              'Infográficos educativos personalizados por nível',
              'Aprendizado visual com 65% mais retenção',
              'Conteúdo científico e prático'
            ]}
            onStart={iniciarQuiz}
            buttonText="📊 Começar Avaliação - É Grátis"
          />
        )}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-200">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </span>
                <span className="text-sm font-medium text-purple-600">
                  {Math.round(progresso)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {perguntas[perguntaAtual].texto}
              </h2>

              <div className="space-y-4">
                {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
                  <button
                    key={index}
                    onClick={() => responderPergunta(opcao.valor)}
                    className="w-full text-left px-6 py-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-600">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <span className="text-gray-800">{opcao.texto}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {perguntaAtual > 0 && (
              <button
                onClick={voltarPergunta}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Voltar
              </button>
            )}
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-purple-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Perfil de Conhecimento</h2>
                <p className="text-gray-600 text-lg mb-4">
                  Pontuação: <span className="font-bold text-purple-600">{resultado.pontuacao}%</span>
                </p>
                <div className="inline-block bg-purple-100 rounded-full px-6 py-2">
                  <p className="text-purple-800 font-semibold">
                    {resultado.nivelConhecimento === 'conhecimentoBasico' && '📚 Nível: Básico - Continue aprendendo!'}
                    {resultado.nivelConhecimento === 'conhecimentoModerado' && '📖 Nível: Moderado - Excelente conhecimento!'}
                    {resultado.nivelConhecimento === 'conhecimentoAvancado' && '🎓 Nível: Avançado - Você é um expert!'}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-4 flex items-center text-xl">
                  <span className="text-2xl mr-2">📋</span>
                  Infográficos Recomendados para Você
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {resultado.recomendacoes.map((rec, index) => (
                    <div key={index} className="bg-white rounded-lg p-5 border-2 border-purple-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{rec.topico}</h4>
                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {rec.nivel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{rec.descricao}</p>
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
                  Por que Infográficos Educativos?
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>65% mais retenção de informação quando comparado a texto puro</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Aprendizado visual acelera compreensão de conceitos complexos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Fácil compartilhamento e referência rápida</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Baseado em ciência nutricional atualizada</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <span>Conteúdo personalizado para seu nível de conhecimento</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Conhecimento: ${resultado.nivelConhecimento === 'conhecimentoBasico' ? 'Básico' : resultado.nivelConhecimento === 'conhecimentoModerado' ? 'Moderado' : 'Avançado'} | Pontuação: ${resultado.pontuacao}%`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setRespostas({})
                  setPerguntaAtual(0)
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('quiz')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Refazer Avaliação
              </button>
              <button
                onClick={() => {
                  setRespostas({})
                  setPerguntaAtual(0)
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

