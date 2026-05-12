'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { alimentacaoRotinaDiagnosticos } from '@/lib/diagnostics'

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

export default function VoceAlimentandoConformeRotina({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente que está se alimentando conforme sua rotina e necessidades?',
      tipo: 'multipla',
      opcoes: [
        'Não, minha alimentação não está adequada à minha rotina',
        'Parcialmente, mas preciso melhorar',
        'Bastante, mas posso otimizar',
        'Sim, me alimento muito bem conforme minha rotina'
      ]
    },
    {
      id: 2,
      pergunta: 'Horário de trabalho ou estudos — como encaixa refeições completas?',
      tipo: 'multipla',
      opcoes: [
        'Muito difícil: como o que der na mão ou pular é comum',
        'Frequentemente fora de horário ou muito rápido',
        'Consigo organizar em parte dos dias',
        'Na maior parte do tempo encaixo refeições com calma'
      ]
    },
    {
      id: 3,
      pergunta: 'Quando a rotina aperta, o que mais costuma “quebrar” primeiro?',
      tipo: 'multipla',
      opcoes: [
        'Tudo: café da manhã, almoço e jantar no improviso',
        'Principalmente almoço ou jantar',
        'Só um dos horários costuma falhar',
        'Consigo manter base mesmo em semana cheia'
      ]
    },
    {
      id: 4,
      pergunta: 'Água, fruta e comida minimamente preparada — na prática da semana:',
      tipo: 'multipla',
      opcoes: [
        'Bem abaixo do que eu mesma(o) gostaria',
        'Falha em mais de um desses na maior parte dos dias',
        'Tem dias bons e ruins',
        'Consigo hidratar e variar plantas com frequência'
      ]
    },
    {
      id: 5,
      pergunta: 'Que apoio faria mais sentido para encaixar alimentação na sua rotina real?',
      tipo: 'multipla',
      opcoes: [
        'Conversa para montar próximos passos com quem entende agenda corrida',
        'Plano simples de horários e lanches por algumas semanas',
        'Lista de compras e ideias para testar sozinha(o)',
        'Só curiosidade e informação por enquanto'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: menos adequado = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais desalinhamento refeição/trabalho = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais quebra sob pressão = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais distância do ideal hidratação/variedade = mais pontos
    [3, 2, 1, 0], // Pergunta 5: mais busca de apoio estruturado = mais pontos
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
    let perfil = 'AlimentacaoInadequada'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'alimentacaoInadequada'

    if (pontuacaoTotal >= 12) {
      perfil = 'Alimentação Inadequada - Necessita Ajuste Urgente'
      descricao = 'Seu perfil indica que sua alimentação não está adequada à sua rotina. Um acompanhamento especializado é essencial para criar um plano alimentar personalizado que se adapte ao seu estilo de vida e otimize sua saúde.'
      cor = 'red'
      recomendacoes = [
        'Buscar avaliação profissional urgente para adequar alimentação',
        'Criar um plano alimentar personalizado para sua rotina',
        'Utilizar produtos específicos que se adaptam à rotina',
        'Ter acompanhamento constante para monitorar adequação',
        'Aprender estratégias para manter alimentação adequada à rotina'
      ]
      diagnosticoId = 'alimentacaoInadequada'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Alimentação Parcialmente Adequada - Otimização Necessária'
      descricao = 'Você está parcialmente se alimentando conforme sua rotina, mas pode ser otimizado. Um acompanhamento pode ajudar a criar estratégias mais adequadas ao seu estilo de vida.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em avaliação personalizada para adequação completa',
        'Ter um plano de otimização alimentar para rotina',
        'Utilizar produtos que se adaptam à rotina',
        'Acompanhar progresso com suporte profissional',
        'Aprender estratégias para maximizar adequação à rotina'
      ]
      diagnosticoId = 'alimentacaoParcialmenteAdequada'
    } else {
      perfil = 'Alimentação Adequada à Rotina - Manutenção e Otimização'
      descricao = 'Você já está se alimentando bem conforme sua rotina! Mesmo assim, um acompanhamento preventivo pode ajudar a manter essa adequação e otimizar ainda mais sua alimentação.'
      cor = 'green'
      recomendacoes = [
        'Manter boa alimentação com estratégias preventivas',
        'Otimizar ainda mais com plano personalizado',
        'Utilizar produtos que mantêm adequação à rotina',
        'Ter acompanhamento preventivo',
        'Aprender estratégias avançadas de alimentação adaptada'
      ]
      diagnosticoId = 'alimentacaoAdequada'
    }

    const diagnostico = alimentacaoRotinaDiagnosticos.wellness[diagnosticoId as keyof typeof alimentacaoRotinaDiagnosticos.wellness]

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Você está se Alimentando Conforme sua Rotina?"
        defaultDescription="Descubra se sua alimentação está adequada à sua rotina"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          const templateBenefits = getTemplateBenefits('eating-routine')
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="⏰"
              defaultTitle="Você está se Alimentando Conforme sua Rotina?"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra se sua alimentação está adequada à sua rotina
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para entender adequação alimentar
                  </p>
                </>
              }
              discover={templateBenefits.discover}
              benefits={templateBenefits.whyUse}
              onStart={iniciarQuiz}
              buttonText="⏰ Começar Avaliação - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-indigo-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all" 
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
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all transform hover:scale-[1.02]"
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
                <div className="text-5xl mb-4">⏰</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Adequação à Rotina</h2>
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

              <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-6 border-2 border-indigo-200">
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
                        <div className="bg-gradient-to-r from-indigo-100 to-violet-100 rounded-lg p-4 border-l-4 border-indigo-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTA WhatsApp com resultado */}
            {config && (
              <WellnessCTAButton
                config={config}
                resultadoTexto={`Perfil: ${resultado.perfil}`}
              />
            )}

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

