'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

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
  diagnostico: DiagnosticoCompleto | null
}

export default function AvaliacaoEmocional({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Como você se sente em relação à sua autoestima hoje?',
      tipo: 'multipla',
      opcoes: [
        'Baixa, tenho dificuldades com minha imagem',
        'Média, algumas vezes me sinto inseguro(a)',
        'Boa, geralmente me sinto bem comigo mesmo(a)',
        'Excelente, me sinto muito confiante'
      ]
    },
    {
      id: 2,
      pergunta: 'Quanto você se sente motivado(a) para cuidar da sua saúde e bem-estar?',
      tipo: 'multipla',
      opcoes: [
        'Pouco motivado(a), tenho dificuldades para começar',
        'Moderadamente, mas preciso de incentivo',
        'Muito motivado(a), já tenho alguns hábitos',
        'Extremamente motivado(a), estou sempre buscando melhorar'
      ]
    },
    {
      id: 3,
      pergunta: 'Como você lida com os desafios e obstáculos da vida?',
      tipo: 'multipla',
      opcoes: [
        'Tenho dificuldades, me sinto sobrecarregado(a)',
        'Às vezes consigo, mas preciso de suporte',
        'Consigo lidar bem na maioria das vezes',
        'Lido muito bem, vejo desafios como oportunidades'
      ]
    },
    {
      id: 4,
      pergunta: 'Você sente que tem o suporte necessário para alcançar seus objetivos de bem-estar?',
      tipo: 'multipla',
      opcoes: [
        'Não, sinto que estou sozinho(a) nessa jornada',
        'Parcialmente, mas preciso de mais orientação',
        'Sim, tenho algum suporte, mas poderia ser melhor',
        'Sim, tenho um excelente suporte e acompanhamento'
      ]
    },
    {
      id: 5,
      pergunta: 'O quanto você valoriza ter um acompanhamento personalizado para sua transformação?',
      tipo: 'multipla',
      opcoes: [
        'Não valorizo muito, prefiro fazer sozinho(a)',
        'Valorizo um pouco, mas não é essencial',
        'Valorizo bastante, faria toda diferença',
        'Valorizo muito, é essencial para meu sucesso'
      ]
    }
  ]

  const pontosPorOpcao = [
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 2, 3]
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
    let perfil = 'NecessitaSuporte'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'necessitaSuporteEmocional'

    if (pontuacaoTotal <= 5) {
      perfil = 'Necessita Suporte'
      descricao = 'Você está no início da sua jornada de transformação e pode se beneficiar muito de um acompanhamento personalizado e motivacional.'
      cor = 'red'
      recomendacoes = [
        'Buscar um acompanhamento personalizado para ter suporte emocional',
        'Estabelecer metas pequenas e alcançáveis para começar',
        'Encontrar um mentor que entenda suas necessidades',
        'Criar uma rotina de autocuidado diária',
        'Conectar-se com uma comunidade de apoio'
      ]
      diagnosticoId = 'necessitaSuporteEmocional'
    } else if (pontuacaoTotal <= 10) {
      perfil = 'Pronto para Transformação'
      descricao = 'Você tem motivação e está aberto(a) para mudanças. Um acompanhamento personalizado pode acelerar seus resultados e manter sua motivação.'
      cor = 'yellow'
      recomendacoes = [
        'Investir em um programa personalizado de transformação',
        'Ter um mentor que te guie passo a passo',
        'Acompanhar seu progresso com suporte profissional',
        'Acessar produtos e estratégias personalizadas',
        'Manter motivação através de acompanhamento regular'
      ]
      diagnosticoId = 'prontoParaTransformacao'
    } else {
      perfil = 'Alto Potencial'
      descricao = 'Você tem uma base sólida e está muito motivado(a)! Um acompanhamento especializado pode potencializar seus resultados e levar você ao próximo nível.'
      cor = 'green'
      recomendacoes = [
        'Acelerar resultados com programa de alto desempenho',
        'Acesso a produtos premium e estratégias avançadas',
        'Acompanhamento VIP para maximizar potencial',
        'Mentoria especializada para resultados excepcionais',
        'Tornar-se referência e inspirar outros'
      ]
      diagnosticoId = 'altoPotencialEmocional'
    }

    const diagnostico = getDiagnostico('avaliacao-emocional', 'wellness', diagnosticoId)

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Avaliação de Forma Emocional"
        defaultDescription="Descubra seu perfil emocional e como podemos ajudar na sua transformação"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="💖"
            defaultTitle="Avaliação de Forma Emocional"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Descubra como suas emoções influenciam sua jornada de transformação
                </p>
                <p className="text-gray-600">
                  Uma avaliação personalizada para entender sua relação com o bem-estar e autoestima
                </p>
              </>
            }
            benefits={[
              'Avalie sua autoestima e confiança',
              'Entenda sua motivação para transformação',
              'Descubra como você lida com desafios',
              'Receba orientações personalizadas',
              'Conecte-se com suporte especializado'
            ]}
            onStart={iniciarQuiz}
            buttonText="💖 Começar Avaliação Emocional - É Grátis"
          />
        )}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-pink-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all" 
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
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all transform hover:scale-[1.02]"
                  >
                    <span className="text-gray-700">{opcao}</span>
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
                <div className="text-5xl mb-4">💖</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Perfil Emocional</h2>
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

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-pink-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200">
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
                      {resultado.diagnostico.proximoPasso && (
                        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4 border-l-4 border-pink-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💬</span>
                  Próximo Passo
                </h3>
                <p className="text-gray-700 mb-4">
                  Com base na sua avaliação emocional, você está pronto(a) para receber um acompanhamento personalizado. 
                  Entre em contato para conhecer como podemos ajudar na sua transformação completa.
                </p>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Perfil: ${resultado.perfil} | Pontuação: ${resultado.score}/15`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setResultado(null)
                  setEtapa('quiz')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Refazer Avaliação
              </button>
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setResultado(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
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

