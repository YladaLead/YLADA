'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { perfilMetabolicoDiagnosticos } from '@/lib/diagnostics'
import { getAvaliacaoPerfilMetabolicoPerguntasTemplate } from '@/lib/wellness/avaliacao-perfil-metabolico-quiz-questions'

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

export default function AvaliacaoPerfilMetabolico({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = getAvaliacaoPerfilMetabolicoPerguntasTemplate()

  /** Índice da opção 0 = mais pontos: sinais de metabolismo “pesado” na vivência (gasto baixo, energia irregular, etc.). */
  const pontosPorOpcao = [
    [3, 2, 1, 0],
    [3, 2, 1, 0],
    [3, 2, 1, 0],
    [3, 2, 1, 0],
    [3, 2, 1, 0],
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
    let perfil = 'MetabolismoLento'
    let descricao = ''
    let cor = 'red'
    let recomendacoes: string[] = []
    let diagnosticoId = 'metabolismoLento'

    if (pontuacaoTotal >= 12) {
      perfil = 'Metabolismo Lento - Necessita Otimização'
      descricao =
        'Pelas respostas, seu corpo parece estar pedindo mais apoio: energia oscilante, fome ou corpo “pesado” aparecem com frequência. Isso sugere um perfil mais lento ou sob estresse — um mapa útil para conversar com quem te acompanha.'
      cor = 'red'
      recomendacoes = [
        'Observar em quais horários a energia cai mais e o que você come antes',
        'Anotar dias com mais inchaço ou fome “fora de hora”',
        'Priorizar sono regular por uma ou duas semanas como teste simples',
        'Registrar uma semana de refeições sem julgar — só perceber padrões',
        'Levar essas observações para quem te orienta em nutrição ou bem-estar',
      ]
      diagnosticoId = 'metabolismoLento'
    } else if (pontuacaoTotal >= 8) {
      perfil = 'Metabolismo Moderado - Otimização Necessária'
      descricao =
        'Há um meio-termo interessante: você não está no extremo, mas já nota sinais (energia, digestão ou rotina) que podem ser afinados. É um perfil com boa margem para ajustes conscientes.'
      cor = 'yellow'
      recomendacoes = [
        'Escolher um único hábito (sono, horário da janta ou caminhada) para observar por 10 dias',
        'Notar se a fome bate junto com estresse ou cansaço',
        'Experimentar refeições mais estáveis no horário que costuma ser mais difícil',
        'Perceber se o inchaço segue algum padrão de alimento ou horário',
        'Usar o resultado como roteiro na conversa com seu acompanhamento',
      ]
      diagnosticoId = 'metabolismoModerado'
    } else {
      perfil = 'Metabolismo Rápido - Manutenção Preventiva'
      descricao =
        'Na leitura das respostas, seu ritmo parece mais favorável: menos travamentos no dia a dia. Ainda assim, manter sono, refeições e estresse sob controle ajuda a não “gastar” esse bom padrão ao longo do tempo.'
      cor = 'green'
      recomendacoes = [
        'Manter proteína e refeições regulares nos dias mais corridos',
        'Evitar pular refeições por longos períodos se você já sente queda de energia',
        'Continuar observando sono — é onde muita gente perde o equilíbrio metabólico',
        'Reforçar hidratação em dias de mais estresse ou treino',
        'Revisar o perfil de tempos em tempos se a rotina mudar muito',
      ]
      diagnosticoId = 'metabolismoRapido'
    }

    const diagnostico = perfilMetabolicoDiagnosticos.wellness[diagnosticoId as keyof typeof perfilMetabolicoDiagnosticos.wellness]

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Avaliação do Perfil Metabólico"
        defaultDescription="Perguntas sobre energia, fome, corpo e rotina para você reconhecer seu padrão metabólico."
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('avaliacao-perfil-metabolico')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="⚡"
              defaultTitle="Avaliação do Perfil Metabólico"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra como seu corpo está vivendo energia, fome e rotina hoje
                  </p>
                  <p className="text-gray-600">
                    Cinco reflexões rápidas para montar um primeiro mapa do seu perfil metabólico — sem julgamento, só clareza.
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="⚡ Começar — leva poucos minutos"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
                <span className="text-sm text-gray-500">{Math.round(((perguntaAtual + 1) / perguntas.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all" 
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
                    className="w-full text-left p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all transform hover:scale-[1.02]"
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
                <div className="text-5xl mb-4">⚡</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Perfil Metabólico</h2>
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

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  Recomendações Personalizadas
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700 bg-white rounded-lg p-3">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnóstico Completo */}
              {resultado.diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
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
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border-l-4 border-blue-500">
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

