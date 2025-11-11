'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'
import { getTemplateBenefits } from '@/lib/template-benefits'

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

export default function QuizGanhosProsperidade({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Você sente que seu estilo de vida atual permite ganhar mais e prosperar financeiramente?',
      tipo: 'multipla',
      opcoes: [
        'Não, sinto que preciso de novas oportunidades para prosperar',
        'Parcialmente, mas vejo potencial para ganhar muito mais',
        'Bastante, mas sempre há espaço para crescimento',
        'Sim, estou muito satisfeito com minha situação financeira'
      ]
    },
    {
      id: 2,
      pergunta: 'Você está aberto(a) para conhecer oportunidades que podem melhorar sua situação financeira?',
      tipo: 'multipla',
      opcoes: [
        'Sim, estou muito aberto(a) para novas oportunidades!',
        'Sim, gostaria de conhecer opções que podem me ajudar',
        'Talvez, se for algo que realmente faça sentido',
        'Não, prefiro manter minha situação atual'
      ]
    },
    {
      id: 3,
      pergunta: 'Você valoriza ter liberdade financeira e tempo para dedicar às coisas que realmente importam?',
      tipo: 'multipla',
      opcoes: [
        'Muito, é um dos meus maiores objetivos',
        'Bastante, gostaria de ter mais liberdade',
        'Moderadamente, seria interessante',
        'Pouco, não é uma prioridade para mim'
      ]
    },
    {
      id: 4,
      pergunta: 'Você acredita que pode criar uma renda adicional trabalhando com algo que também melhora a vida das pessoas?',
      tipo: 'multipla',
      opcoes: [
        'Sim, acredito muito nessa possibilidade!',
        'Sim, gostaria de conhecer como isso funciona',
        'Talvez, se for algo confiável e comprovado',
        'Não, não acredito nisso'
      ]
    },
    {
      id: 5,
      pergunta: 'Você está interessado(a) em conversar com quem te enviou este quiz sobre oportunidades de crescimento?',
      tipo: 'multipla',
      opcoes: [
        'Sim, estou muito interessado(a) em saber mais!',
        'Sim, gostaria de entender melhor as oportunidades',
        'Talvez, se for algo que realmente possa me ajudar',
        'Não, não tenho interesse no momento'
      ]
    }
  ]

  const pontosPorOpcao = [
    [3, 2, 1, 0], // Pergunta 1: menos satisfeito = mais pontos
    [3, 2, 1, 0], // Pergunta 2: mais abertura = mais pontos
    [3, 2, 1, 0], // Pergunta 3: mais valorização = mais pontos
    [3, 2, 1, 0], // Pergunta 4: mais crença = mais pontos
    [3, 2, 1, 0]  // Pergunta 5: mais interesse = mais pontos
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
    let perfil = 'AltoPotencial'
    let descricao = ''
    let cor = 'green'
    let recomendacoes: string[] = []
    let diagnosticoId = 'altoPotencial'

    if (pontuacaoTotal >= 12) {
      perfil = 'Alto Potencial para Ganhos e Prosperidade'
      descricao = 'Seu perfil indica que você tem alto potencial para ganhos e prosperidade! Você está aberto(a) para novas oportunidades e valoriza crescimento financeiro. Existem caminhos que podem te ajudar a alcançar seus objetivos de forma consistente.'
      cor = 'green'
      recomendacoes = [
        'Converse com quem te enviou este quiz sobre oportunidades',
        'Explore possibilidades de crescimento financeiro',
        'Descubra como criar renda adicional de forma consistente',
        'Conheça oportunidades que combinam propósito e resultados',
        'Invista em seu crescimento pessoal e financeiro'
      ]
      diagnosticoId = 'altoPotencial'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Potencial Moderado para Crescimento'
      descricao = 'Você tem potencial para crescimento financeiro! Com as oportunidades certas e o suporte adequado, você pode melhorar significativamente sua situação e alcançar maior prosperidade.'
      cor = 'yellow'
      recomendacoes = [
        'Converse com quem te enviou este quiz sobre possibilidades',
        'Explore oportunidades de crescimento gradual',
        'Descubra caminhos para melhorar sua situação financeira',
        'Conheça opções que se alinham com seus valores',
        'Considere investir em seu desenvolvimento'
      ]
      diagnosticoId = 'potencialModerado'
    } else {
      perfil = 'Bom Potencial para Expansão'
      descricao = 'Você tem uma base sólida e pode explorar novas oportunidades quando estiver pronto(a). Quando sentir que é o momento certo, existem caminhos que podem te ajudar a expandir seus horizontes.'
      cor = 'blue'
      recomendacoes = [
        'Mantenha-se aberto(a) para oportunidades futuras',
        'Explore quando sentir que é o momento certo',
        'Converse com quem te enviou quando quiser saber mais',
        'Conheça opções que podem se alinhar com seus objetivos',
        'Invista em seu crescimento quando estiver preparado(a)'
      ]
      diagnosticoId = 'bomPotencial'
    }

    const diagnostico = getDiagnostico('ganhos-prosperidade', 'wellness', diagnosticoId)

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Quiz: Ganhos e Prosperidade"
        defaultDescription="Descubra seu potencial para ganhos e prosperidade"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('quiz-ganhos')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="💰"
              defaultTitle="Quiz: Ganhos e Prosperidade"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu potencial para ganhos e prosperidade
                  </p>
                  <p className="text-gray-600">
                    Uma avaliação personalizada para entender suas oportunidades de crescimento
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="💰 Começar Quiz - É Grátis"
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
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all" 
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
              resultado.cor === 'green' ? 'border-green-300' : 
              resultado.cor === 'yellow' ? 'border-yellow-300' : 
              'border-blue-300'
            }`}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💰</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Potencial para Ganhos</h2>
                <div className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${
                  resultado.cor === 'green' ? 'bg-green-100 text-green-800' : 
                  resultado.cor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {resultado.perfil}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {resultado.descricao}
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-6">
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
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border-2 border-amber-200">
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
                        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4 border-l-4 border-amber-500">
                          <p className="text-gray-900 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
                ↺ Refazer Quiz
              </button>
              <button
                onClick={() => {
                  setPerguntaAtual(0)
                  setRespostas([])
                  setResultado(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
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

