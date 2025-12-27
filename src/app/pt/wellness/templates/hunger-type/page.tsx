'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { tipoFomeDiagnosticos } from '@/lib/diagnostics'

interface Pergunta {
  id: number
  pergunta: string
  tipo: 'multipla'
  opcoes: string[]
}

interface Resultado {
  score: number
  perfil: string
  descricao: string
  cor: string
  recomendacoes: string[]
  diagnostico?: any // Diagnóstico completo do arquivo de diagnósticos
}

export default function TipoFome({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente que precisa entender melhor seu tipo de fome para controlar melhor sua alimentação?',
      tipo: 'multipla',
      opcoes: [
        'Sim, preciso muito entender meu padrão de fome',
        'Sim, seria muito útil ter essa informação',
        'Talvez, se for algo prático e útil',
        'Não, não vejo necessidade'
      ]
    },
    {
      id: 2,
      pergunta: 'Você sente que precisa de ajuda para identificar se sua fome é física ou emocional?',
      tipo: 'multipla',
      opcoes: [
        'Sim, preciso muito de orientação profissional',
        'Sim, seria muito útil ter um acompanhamento',
        'Talvez, se for algo prático e personalizado',
        'Não, consigo identificar sozinho(a)'
      ]
    },
    {
      id: 3,
      pergunta: 'Você valoriza ter estratégias personalizadas baseadas no seu tipo de fome?',
      tipo: 'multipla',
      opcoes: [
        'Muito, é essencial para controlar minha alimentação',
        'Bastante, acredito que faria diferença',
        'Moderadamente, se for algo eficaz',
        'Pouco, prefiro seguir padrões gerais'
      ]
    },
    {
      id: 4,
      pergunta: 'Você acredita que produtos e estratégias específicas para seu tipo de fome podem ajudar?',
      tipo: 'multipla',
      opcoes: [
        'Sim, faria toda diferença e melhoraria muito',
        'Sim, acredito que seria muito útil',
        'Talvez, se for algo comprovado e eficaz',
        'Não, não vejo necessidade'
      ]
    },
    {
      id: 5,
      pergunta: 'Você está aberto(a) para ter um acompanhamento especializado em controle de fome?',
      tipo: 'multipla',
      opcoes: [
        'Sim, é exatamente o que preciso!',
        'Sim, seria muito útil ter um acompanhamento',
        'Talvez, se for alguém experiente e confiável',
        'Não, prefiro fazer sozinho(a)'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: mais necessidade = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais necessidade = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais valorização = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais crença = mais pontos
    [3, 2, 1, 0]  // Pergunta 5: mais abertura = mais pontos
  ]

  const iniciarQuiz = () => {
    setEtapa('quiz')
    setPerguntaAtual(0)
    setRespostas([])
  }

  const responder = (opcaoIndex: number) => {
    const novasRespostas = [...respostas, opcaoIndex]
    setRespostas(novasRespostas)

    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      calcularResultado(novasRespostas)
    }
  }

  const calcularResultado = (resps: number[]) => {
    let pontuacaoTotal = 0
    
    resps.forEach((resposta, index) => {
      pontuacaoTotal += pontosPorOpcao[index][resposta] || 0
    })

    // Determinar perfil baseado na pontuação (0-15 pontos)
    let perfil = 'FomeEmocional'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'fomeEmocional'

    if (pontuacaoTotal >= 12) {
      perfil = 'Fome Emocional - Necessita Atenção'
      descricao = 'Seu perfil indica que você tem padrões de fome emocional que precisam de atenção. Um acompanhamento especializado pode ajudar a identificar e controlar esses padrões, melhorando sua relação com a comida.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional para fome emocional',
        'Criar estratégias personalizadas de controle',
        'Utilizar produtos que ajudam no controle da fome',
        'Ter acompanhamento para monitorar progresso',
        'Aprender técnicas para diferenciar fome física de emocional'
      ]
      diagnosticoId = 'fomeEmocional'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Fome Mista - Otimização Necessária'
      descricao = 'Você apresenta padrões mistos de fome. Um acompanhamento pode ajudar a otimizar seu controle alimentar e criar estratégias personalizadas para cada tipo de fome.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em avaliação personalizada',
        'Ter estratégias para cada tipo de fome',
        'Utilizar produtos que ajudam no controle',
        'Acompanhar progresso com suporte profissional',
        'Aprender a otimizar seu controle alimentar'
      ]
      diagnosticoId = 'fomeMista'
    } else {
      perfil = 'Fome Física - Controle Adequado'
      descricao = 'Você parece ter bom controle da fome física! Mesmo assim, um acompanhamento preventivo pode ajudar a manter esse controle e otimizar ainda mais sua alimentação.'
      cor = 'green'
      recomendacoes = [
        'Manter bom controle com estratégias preventivas',
        'Otimizar ainda mais com plano personalizado',
        'Utilizar produtos que mantêm controle',
        'Ter acompanhamento preventivo',
        'Aprender estratégias avançadas de controle'
      ]
      diagnosticoId = 'fomeFisica'
    }

    const diagnostico = tipoFomeDiagnosticos.wellness[diagnosticoId as keyof typeof tipoFomeDiagnosticos.wellness]

    setResultado({
      score: pontuacaoTotal,
      perfil,
      descricao,
      cor,
      recomendacoes,
      diagnostico
    })
    setEtapa('resultado')
  }

  const voltar = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
      setRespostas(respostas.slice(0, -1))
    } else {
      setEtapa('landing')
      setPerguntaAtual(0)
      setRespostas([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Qual é o seu Tipo de Fome?"
        defaultDescription="Descubra seu padrão de fome e como controlá-lo"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('tipo-fome')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🍽️"
              defaultTitle="Qual é o seu Tipo de Fome?"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu padrão de fome e como controlá-lo
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para entender se sua fome é física ou emocional
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="🍽️ Começar Avaliação - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-amber-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all" 
                  style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {perguntas[perguntaAtual].pergunta}
              </h2>

              <div className="space-y-3">
                {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
                  <button
                    key={index}
                    onClick={() => responder(index)}
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all transform hover:scale-[1.02]"
                  >
                    <span className="text-gray-900 font-medium">{opcao}</span>
                  </button>
                ))}
              </div>

              {perguntaAtual > 0 && (
                <button
                  onClick={voltar}
                  className="mt-4 text-gray-600 hover:text-gray-800 flex items-center"
                >
                  ← Voltar
                </button>
              )}
            </div>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${
              resultado.cor === 'red' ? 'border-red-300' : 
              resultado.cor === 'yellow' ? 'border-yellow-300' : 
              'border-green-300'
            }`}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🍽️</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Tipo de Fome</h2>
                <div className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
                  resultado.cor === 'red' ? 'bg-red-100 text-red-800' : 
                  resultado.cor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {resultado.perfil}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {resultado.descricao}
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-xl flex items-center">
                      <span className="text-2xl mr-2">📋</span>
                      Diagnóstico Completo
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.diagnostico}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.causaRaiz}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.acaoImediata}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.plano7Dias}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.suplementacao}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.alimentacao}</p>
                      </div>
                      {resultado.diagnostico.proximoPasso && (
                        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border-l-4 border-amber-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <LeadCapturePostResult
              config={config}
              ferramenta="Quiz Tipo de Fome"
              resultadoTexto={`Perfil: ${resultado.perfil} (${resultado.score}/15 pontos)`}
              mensagemConvite="🧠 Quer controlar sua relação com a comida?"
              beneficios={[
                'Estratégias para identificar fome real vs emocional',
                'Técnicas de mindful eating personalizadas',
                'Plano para reduzir compulsões alimentares',
                'Acompanhamento comportamental'
              ]}
            />

            <WellnessActionButtons
              onRecalcular={() => {
                setPerguntaAtual(0)
                setRespostas([])
                setResultado(null)
                setEtapa('quiz')
              }}
              onVoltarInicio={() => {
                setPerguntaAtual(0)
                setRespostas([])
                setResultado(null)
                setEtapa('landing')
              }}
              textoRecalcular="↺ Refazer Avaliação"
            />
          </div>
        )}
      </main>
    </div>
  )
}

