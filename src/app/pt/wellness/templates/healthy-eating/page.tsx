'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
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
}

export default function QuizAlimentacao({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const perguntas: Pergunta[] = [
    {
      id: 1,
      pergunta: 'Quantas refeições você faz por dia?',
      tipo: 'multipla',
      opcoes: [
        '1-2 refeições por dia',
        '3 refeições (café, almoço, jantar)',
        '4-5 refeições com lanches',
        '6 ou mais refeições programadas'
      ]
    },
    {
      id: 2,
      pergunta: 'Você consome frutas e verduras diariamente?',
      tipo: 'multipla',
      opcoes: [
        'Raramente',
        'Às vezes (2-3x por semana)',
        'Frequentemente (quase todos os dias)',
        'Sempre (todas as refeições)'
      ]
    },
    {
      id: 3,
      pergunta: 'Como é sua ingestão de água?',
      tipo: 'multipla',
      opcoes: [
        'Esqueço de beber água',
        'Bebo quando sinto sede',
        'Tenho uma meta diária e sigo',
        'Carrego garrafa e bebo constantemente'
      ]
    },
    {
      id: 4,
      pergunta: 'Você faz planejamento alimentar?',
      tipo: 'multipla',
      opcoes: [
        'Não, como o que tiver disponível',
        'Raramente planejo',
        'Planejo algumas refeições',
        'Planejo semanalmente com antecedência'
      ]
    }
  ]

  const pontosPorOpcao = [
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
    let score = 0

    resps.forEach((resp, index) => {
      score += pontosPorOpcao[index][resp]
    })

    let perfil = ''
    let descricao = ''
    let cor = ''
    let recomendacoes: string[] = []

    if (score >= 9) {
      perfil = 'Alimentação Excelente'
      descricao = 'Parabéns! Seus hábitos alimentares são excelentes. Continue mantendo!'
      cor = 'green'
      recomendacoes = [
        'Manter rotina e planejamento',
        'Continuar diversificando alimentos',
        'Compartilhar hábitos com outros',
        'Monitorar e otimizar continuamente'
      ]
    } else if (score >= 6) {
      perfil = 'Alimentação Boa'
      descricao = 'Você tem bons hábitos! Com pequenos ajustes, pode otimizar ainda mais.'
      cor = 'blue'
      recomendacoes = [
        'Aumentar frequência de refeições',
        'Incluir mais frutas e verduras',
        'Melhorar planejamento alimentar',
        'Criar rotina de hidratação'
      ]
    } else if (score >= 3) {
      perfil = 'Hábitos a Melhorar'
      descricao = 'Você tem oportunidade de melhorar significativamente seus hábitos alimentares.'
      cor = 'orange'
      recomendacoes = [
        'Aumentar número de refeições diárias',
        'Incluir frutas e verduras em todas refeições',
        'Criar planejamento alimentar semanal',
        'Estabelecer meta de hidratação'
      ]
    } else {
      perfil = 'Precisa de Atendimento'
      descricao = 'Seus hábitos alimentares precisam de atenção urgente. Busque orientação profissional.'
      cor = 'red'
      recomendacoes = [
        'URGENTE: Buscar orientação nutricional',
        'Criar plano alimentar estruturado',
        'Estabelecer rotinas básicas de alimentação',
        'Definir metas semanais de melhoria'
      ]
    }

    setResultado({ score, perfil, descricao, cor, recomendacoes })
    setEtapa('resultado')
  }

  const cores = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600'
  }

  const bordas = {
    green: 'border-green-300',
    blue: 'border-blue-300',
    orange: 'border-orange-300',
    red: 'border-red-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Quiz: Alimentação Saudável"
        defaultDescription="Avalie seus hábitos alimentares"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('quiz-alimentacao')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🥗"
              defaultTitle="Alimentação Saudável"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Avalie seus hábitos alimentares e receba orientações
                  </p>
                  <p className="text-gray-600">
                    Descubra como seus hábitos estão impactando sua saúde
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarQuiz}
              buttonText="▶️ Iniciar Quiz - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-emerald-200">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </span>
                <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${((perguntaAtual + 1) / perguntas.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {perguntas[perguntaAtual].pergunta}
            </h2>

            <div className="space-y-4">
              {perguntas[perguntaAtual].opcoes.map((opcao, index) => (
                <button
                  key={index}
                  onClick={() => responder(index)}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all text-gray-900 font-medium"
                >
                  {opcao}
                </button>
              ))}
            </div>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${bordas[resultado.cor]}`}>
              <div className="text-center mb-6">
                <div className={`inline-block px-8 py-4 rounded-full text-white font-bold text-2xl mb-4 ${cores[resultado.cor]}`}>
                  {resultado.perfil}
                </div>
                <p className="text-gray-800 text-xl">{resultado.descricao}</p>
                <p className="text-sm text-gray-600 mt-2">Score: {resultado.score}/12</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações Nutricionais
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-emerald-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

                        {/* Formulário de coleta de dados temporariamente desabilitado */}
                        {/* Formulário de coleta de dados temporariamente desabilitado */}
            {/* <LeadCapturePostResult */}
            {/* config={config} */}
            {/* ferramenta="Alimentação Saudável" */}
            {/* resultadoTexto={`${resultado.perfil} (${resultado.score}/12 pontos)`} */}
            {/* mensagemConvite="🥗 Quer transformar sua alimentação?" */}
            {/* beneficios={[ */}
            {/* 'Plano alimentar saudável e prático', */}
            {/* 'Receitas simples e nutritivas', */}
            {/* 'Educação nutricional personalizada', */}
            {/* 'Mudanças sustentáveis e duradouras' */}
            {/* ]} */}
            {/* /> */}

            <WellnessActionButtons
          onRecalcular={() => {
          setPerguntaAtual(0)
          setRespostas([])
          setEtapa('quiz')
          }}
          onVoltarInicio={() => {
          setPerguntaAtual(0)
          setRespostas([])
          setEtapa('landing')
          }}
          textoRecalcular="↺ Fazer Quiz Novamente"
          />
          </div>
        )}
      </main>
    </div>
  )
}

