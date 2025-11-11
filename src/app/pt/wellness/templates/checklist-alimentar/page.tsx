'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { checklistAlimentarDiagnosticos } from '@/lib/diagnosticos-nutri'
import { getTemplateBenefits } from '@/lib/template-benefits'

interface Pergunta {
  id: number
  question: string
  description: string
  options: string[]
}

interface Resultado {
  score: number
  perfil: string
  descricao: string
  cor: string
  diagnostico: any
}

export default function ChecklistAlimentar({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'quiz' | 'resultado'>('landing')
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])
  const [resultado, setResultado] = useState<Resultado | null>(null)

  // 12 perguntas do Checklist Alimentar
  const perguntas: Pergunta[] = [
    {
      id: 1,
      question: 'Você consome pelo menos 5 porções de frutas e vegetais por dia?',
      description: 'Recomendação mínima para obter nutrientes essenciais',
      options: [
        'Nunca ou quase nunca',
        'Às vezes (1-2 dias/semana)',
        'Regularmente (3-4 dias/semana)',
        'Frequentemente (5-6 dias/semana)',
        'Sempre (todos os dias)'
      ]
    },
    {
      id: 2,
      question: 'Você ingere proteína em todas as refeições principais?',
      description: 'Proteína é essencial para saciedade e manutenção muscular',
      options: [
        'Nunca',
        'Raramente (1 refeição/dia)',
        'Às vezes (2 refeições/dia)',
        'Frequentemente (3 refeições/dia)',
        'Sempre (todas as refeições)'
      ]
    },
    {
      id: 3,
      question: 'Você bebe pelo menos 2 litros de água por dia?',
      description: 'Hidratação adequada é fundamental para todas as funções corporais',
      options: [
        'Menos de 1L',
        '1-1.5L por dia',
        '1.5-2L por dia',
        '2-3L por dia',
        'Mais de 3L por dia'
      ]
    },
    {
      id: 4,
      question: 'Você evita alimentos ultraprocessados na maioria das refeições?',
      description: 'Alimentos processados têm baixo valor nutricional',
      options: [
        'Nunca evito',
        'Raramente evito',
        'Às vezes evito',
        'Frequentemente evito',
        'Sempre evito'
      ]
    },
    {
      id: 5,
      question: 'Você consome fibras diariamente (cereais integrais, legumes, vegetais)?',
      description: 'Fibras auxiliam digestão e controle glicêmico',
      options: [
        'Nunca ou raramente',
        '1-2 vezes por semana',
        '3-4 vezes por semana',
        'Quase todos os dias',
        'Todos os dias'
      ]
    },
    {
      id: 6,
      question: 'Você faz refeições regulares (a cada 3-4 horas)?',
      description: 'Regularidade ajuda a manter metabolismo ativo',
      options: [
        'Não, refeições irregulares',
        'Raramente',
        'Às vezes',
        'Frequentemente',
        'Sim, sempre regulares'
      ]
    },
    {
      id: 7,
      question: 'Você inclui gorduras saudáveis na alimentação (azeite, abacate, oleaginosas)?',
      description: 'Gorduras saudáveis são essenciais para absorção de vitaminas',
      options: [
        'Nunca',
        'Raramente',
        'Às vezes',
        'Frequentemente',
        'Sempre'
      ]
    },
    {
      id: 8,
      question: 'Você limita o consumo de açúcar e doces?',
      description: 'Excesso de açúcar impacta energia e saúde metabólica',
      options: [
        'Não, consumo muito açúcar',
        'Raramente limito',
        'Às vezes limito',
        'Frequentemente limito',
        'Sim, consumo muito pouco'
      ]
    },
    {
      id: 9,
      question: 'Você planeja suas refeições com antecedência?',
      description: 'Planejamento facilita escolhas mais saudáveis',
      options: [
        'Nunca',
        'Raramente',
        'Às vezes',
        'Frequentemente',
        'Sempre planejo'
      ]
    },
    {
      id: 10,
      question: 'Você mastiga bem os alimentos antes de engolir?',
      description: 'Mastigação adequada melhora digestão e saciedade',
      options: [
        'Não, engulo rápido',
        'Raramente mastigo bem',
        'Às vezes mastigo bem',
        'Frequentemente mastigo bem',
        'Sim, sempre mastigo bem'
      ]
    },
    {
      id: 11,
      question: 'Você consome alimentos ricos em ferro regularmente?',
      description: 'Ferro é essencial para energia e saúde sanguínea',
      options: [
        'Nunca ou raramente',
        '1-2 vezes por semana',
        '3-4 vezes por semana',
        'Quase todos os dias',
        'Todos os dias'
      ]
    },
    {
      id: 12,
      question: 'Você se sente satisfeito após as refeições principais?',
      description: 'Saciedade adequada evita excessos e petiscos desnecessários',
      options: [
        'Nunca, sempre com fome',
        'Raramente',
        'Às vezes',
        'Frequentemente',
        'Sempre satisfeito'
      ]
    }
  ]

  // Sistema de pontuação: cada opção vale 0-4 pontos (total: 0-48, mas vamos usar 0-60 para facilitar)
  const pontosPorOpcao = perguntas.map(() => [0, 1, 2, 3, 4]) // 0, 1, 2, 3, 4 pontos por opção

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

    // Ranges: 0-24 = Deficiente, 25-40 = Moderada, 41-60 = Equilibrada
    let perfil = ''
    let descricao = ''
    let cor = ''
    let diagnostico: any = null

    if (score <= 24) {
      perfil = 'Alimentação Deficiente'
      descricao = 'Sua alimentação precisa de correção para melhorar saúde e bem-estar de forma sustentável'
      cor = 'red'
      diagnostico = checklistAlimentarDiagnosticos.nutri?.alimentacaoDeficiente || checklistAlimentarDiagnosticos.nutri?.alimentacaoDeficiente
    } else if (score <= 40) {
      perfil = 'Alimentação Moderada'
      descricao = 'Sua alimentação está moderada, mas pode ser otimizada para melhorar saúde e performance'
      cor = 'yellow'
      diagnostico = checklistAlimentarDiagnosticos.nutri?.alimentacaoModerada || checklistAlimentarDiagnosticos.nutri?.alimentacaoModerada
    } else {
      perfil = 'Alimentação Equilibrada'
      descricao = 'Sua alimentação está equilibrada, mantenha o padrão e considere otimizações estratégicas'
      cor = 'green'
      diagnostico = checklistAlimentarDiagnosticos.nutri?.alimentacaoEquilibrada || checklistAlimentarDiagnosticos.nutri?.alimentacaoEquilibrada
    }

    setResultado({
      score,
      perfil,
      descricao,
      cor,
      diagnostico
    })
    setEtapa('resultado')
  }

  const reiniciar = () => {
    setEtapa('landing')
    setPerguntaAtual(0)
    setRespostas([])
    setResultado(null)
  }

  const pergunta = perguntas[perguntaAtual]
  const progresso = ((perguntaAtual + 1) / perguntas.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessHeader config={config} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          const templateBenefits = getTemplateBenefits('checklist-alimentar')
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🍽️"
              defaultTitle="Checklist Alimentar"
              defaultDescription="Avalie seus hábitos alimentares em 12 pontos essenciais e descubra oportunidades de melhoria na sua nutrição"
              discover={templateBenefits.discover}
              benefits={templateBenefits.whyUse}
              onStart={iniciarQuiz}
              buttonText="▶️ Começar Avaliação - É Grátis"
            />
          )
        })()}

        {etapa === 'quiz' && pergunta && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* Progresso */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Pergunta {perguntaAtual + 1} de {perguntas.length}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(progresso)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            {/* Pergunta */}
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {pergunta.question}
              </h2>
              {pergunta.description && (
                <p className="text-gray-600 text-sm mb-6">{pergunta.description}</p>
              )}

              {/* Opções */}
              <div className="space-y-3">
                {pergunta.options.map((opcao, index) => (
                  <button
                    key={index}
                    onClick={() => responder(index)}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 rounded-lg transition-all transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                        {respostas.includes(index) && (
                          <div className="w-3 h-3 rounded-full bg-green-600" />
                        )}
                      </div>
                      <span className="text-gray-700 font-medium">{opcao}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dicas educativas (apenas em algumas perguntas) */}
            {perguntaAtual === 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Dica:</strong> Se você não alcança essa meta, pode estar perdendo nutrientes essenciais. Considere incluir mais frutas e vegetais variados no seu dia a dia para obter os nutrientes necessários.
                </p>
              </div>
            )}

            {perguntaAtual === 1 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💪 <strong>Importante:</strong> Proteína de qualidade em todas as refeições ajuda a manter massa muscular e saciedade. Considere incluir fontes proteicas variadas (carnes magras, ovos, leguminosas) em cada refeição principal.
                </p>
              </div>
            )}

            {perguntaAtual === 11 && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  🎯 <strong>Importante:</strong> Se você nunca se sente satisfeito, pode estar faltando algo essencial na sua alimentação. Considere aumentar o consumo de fibras, proteínas e gorduras saudáveis para melhorar a saciedade.
                </p>
              </div>
            )}
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            {/* Resultado Visual */}
            <div className={`bg-gradient-to-r ${
              resultado.cor === 'red' ? 'from-red-50 to-orange-50' :
              resultado.cor === 'yellow' ? 'from-yellow-50 to-amber-50' :
              'from-green-50 to-emerald-50'
            } p-6 rounded-xl border-2 ${
              resultado.cor === 'red' ? 'border-red-200' :
              resultado.cor === 'yellow' ? 'border-yellow-200' :
              'border-green-200'
            }`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                📊 Seu Resultado: {resultado.perfil}
              </h2>
              
              <div className="bg-white rounded-lg p-5 mb-4 border border-gray-200">
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold mb-2 ${
                    resultado.cor === 'red' ? 'text-red-600' :
                    resultado.cor === 'yellow' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {resultado.score} pontos
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    de 60 pontos possíveis
                  </div>
                </div>
                
                <div className="relative bg-gray-200 rounded-full h-6 mb-4">
                  <div
                    className={`absolute left-0 top-0 h-6 rounded-full ${
                      resultado.cor === 'red' ? 'bg-red-500' :
                      resultado.cor === 'yellow' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(resultado.score / 60) * 100}%` }}
                  />
                </div>
                
                <div className={`${
                  resultado.cor === 'red' ? 'bg-red-50 border-red-200' :
                  resultado.cor === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                } border rounded-lg p-4`}>
                  <p className="text-sm text-gray-700 mb-2"><strong>Análise:</strong></p>
                  <p className="text-sm text-gray-600">{resultado.descricao}</p>
                </div>
              </div>
            </div>

            {/* Diagnóstico Completo */}
            {resultado.diagnostico && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Diagnóstico Completo</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-2">{resultado.diagnostico.diagnostico}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700">{resultado.diagnostico.causaRaiz}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-gray-700">{resultado.diagnostico.acaoImediata}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-gray-700">{resultado.diagnostico.plano7Dias}</p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-gray-700">{resultado.diagnostico.suplementacao}</p>
                  </div>
                  
                  <div className="bg-teal-50 rounded-lg p-4">
                    <p className="text-gray-700">{resultado.diagnostico.alimentacao}</p>
                  </div>
                  
                  {resultado.diagnostico.proximoPasso && (
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border-2 border-purple-300">
                      <p className="text-gray-800 font-semibold">{resultado.diagnostico.proximoPasso}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Próximos Passos Recomendados */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="font-bold text-lg mb-3 text-center text-gray-900">
                💡 Próximos Passos Recomendados:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span><strong>Implementar</strong> mudanças graduais nos hábitos alimentares identificados</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span><strong>Buscar</strong> orientação profissional para criar um plano personalizado</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span><strong>Acompanhar</strong> seu progresso e ajustar estratégias conforme necessário</span>
                </li>
              </ul>
            </div>

            {/* Botão CTA */}
            <WellnessCTAButton
              config={config}
              resultadoTexto={`Checklist Alimentar: ${resultado.perfil} (${resultado.score} pontos)`}
            />

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={reiniciar}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                🔄 Fazer Novamente
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                🖨️ Imprimir Resultado
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

