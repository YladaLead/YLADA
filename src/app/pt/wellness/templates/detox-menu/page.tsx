'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'

interface RefeicaoDetox {
  refeicao: string
  alimentos: string[]
  beneficio: string
  tempo: string
}

interface Resultado {
  nivelDetox: string
  cardapio7Dias: Array<{
    dia: number
    refeicoes: RefeicaoDetox[]
    dica: string
  }>
  alimentosChave: string[]
  eliminacoes: string[]
}

export default function CardapioDetox({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    sintomas: [] as string[],
    exposicao: '',
    objetivo: '',
    experiencia: ''
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const sintomasDisponiveis = [
    'Cansaço constante',
    'Problemas digestivos',
    'Pele sem brilho',
    'Dores de cabeça frequentes',
    'Insônia ou sono ruim',
    'Retenção de líquidos',
    'Dificuldade de concentração',
    'Irritabilidade'
  ]

  const iniciarFormulario = () => {
    setEtapa('formulario')
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

  const gerarCardapio = () => {
    if (!dados.exposicao || !dados.objetivo || !dados.experiencia) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    // Determinar nível de detox baseado nos sintomas e exposição
    let nivelDetox = 'detoxBasico'
    let cardapio7Dias: Array<{
      dia: number
      refeicoes: RefeicaoDetox[]
      dica: string
    }> = []
    let alimentosChave: string[] = []
    let eliminacoes: string[] = []

    const pontuacaoSintomas = dados.sintomas.length
    const altaExposicao = dados.exposicao === 'alta'
    const experienciaAvancada = dados.experiencia === 'avancado'

    if (pontuacaoSintomas >= 5 || (altaExposicao && experienciaAvancada)) {
      nivelDetox = 'detoxAvancado'
      alimentosChave = [
        'Chá verde matcha',
        'Espinafre e couve orgânicos',
        'Frutos vermelhos',
        'Gengibre e cúrcuma',
        'Sementes de chia e linhaça',
        'Limão e água com gás',
        'Vegetais crucíferos (brócolis, couve-flor)',
        'Chá de dente-de-leão'
      ]
      eliminacoes = [
        'Processados e ultraprocessados',
        'Açúcar refinado',
        'Álcool',
        'Cafeína',
        'Laticínios',
        'Glúten',
        'Carnes vermelhas',
        'Frituras'
      ]

      // Cardápio avançado (exemplo para 3 dias - pode ser expandido)
      cardapio7Dias = [
        {
          dia: 1,
          refeicoes: [
            {
              refeicao: 'Café da Manhã',
              alimentos: ['Água com limão (morno)', 'Smoothie verde com couve, espinafre, abacaxi e gengibre'],
              beneficio: 'Alcalinização e início da depuração',
              tempo: '10 min'
            },
            {
              refeicao: 'Almoço',
              alimentos: ['Salada verde com quinoa, abacate e sementes', 'Sopa depurativa de vegetais'],
              beneficio: 'Fibras e antioxidantes máximos',
              tempo: '25 min'
            },
            {
              refeicao: 'Jantar',
              alimentos: ['Vegetais assados com especiarias', 'Chá de hibisco e gengibre'],
              beneficio: 'Desintoxicação noturna',
              tempo: '20 min'
            }
          ],
          dica: 'Beba 2,5-3L de água durante o dia. Evite qualquer alimento processado.'
        }
      ]
    } else if (pontuacaoSintomas >= 3 || altaExposicao) {
      nivelDetox = 'detoxModerado'
      alimentosChave = [
        'Chá verde',
        'Vegetais verdes folhosos',
        'Frutas cítricas',
        'Gengibre',
        'Sementes',
        'Água com limão',
        'Legumes cozidos',
        'Chás depurativos'
      ]
      eliminacoes = [
        'Alimentos processados',
        'Açúcar em excesso',
        'Álcool',
        'Cafeína em excesso',
        'Frituras',
        'Carnes processadas'
      ]

      cardapio7Dias = [
        {
          dia: 1,
          refeicoes: [
            {
              refeicao: 'Café da Manhã',
              alimentos: ['Água com limão', 'Smoothie com frutas e vegetais verdes'],
              beneficio: 'Depuração e energia',
              tempo: '5 min'
            },
            {
              refeicao: 'Almoço',
              alimentos: ['Salada verde com proteína magra', 'Vegetais cozidos no vapor'],
              beneficio: 'Nutrientes e desintoxicação',
              tempo: '20 min'
            },
            {
              refeicao: 'Jantar',
              alimentos: ['Sopa de legumes', 'Chá de ervas'],
              beneficio: 'Digestão leve e depuração',
              tempo: '15 min'
            }
          ],
          dica: 'Beba 2-2,5L de água. Priorize alimentos in natura.'
        }
      ]
    } else {
      nivelDetox = 'detoxBasico'
      alimentosChave = [
        'Água',
        'Chás depurativos',
        'Vegetais verdes',
        'Frutas',
        'Legumes',
        'Sucos naturais'
      ]
      eliminacoes = [
        'Alimentos ultraprocessados',
        'Açúcar em excesso',
        'Refrigerantes',
        'Frituras'
      ]

      cardapio7Dias = [
        {
          dia: 1,
          refeicoes: [
            {
              refeicao: 'Café da Manhã',
              alimentos: ['Água com limão', 'Frutas frescas', 'Chá verde'],
              beneficio: 'Hidratação e início da limpeza',
              tempo: '5 min'
            },
            {
              refeicao: 'Almoço',
              alimentos: ['Salada verde', 'Legumes cozidos', 'Proteína magra'],
              beneficio: 'Nutrientes essenciais',
              tempo: '15 min'
            },
            {
              refeicao: 'Jantar',
              alimentos: ['Vegetais cozidos', 'Chá de camomila'],
              beneficio: 'Digestão leve',
              tempo: '10 min'
            }
          ],
          dica: 'Beba 2L de água por dia. Elimine refrigerantes e processados.'
        }
      ]
    }

    const diagnosticoCompleto = getDiagnostico('cardapio-detox', 'nutri', nivelDetox)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelDetox,
      cardapio7Dias,
      alimentosChave,
      eliminacoes
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Cardápio Detox"
        defaultDescription="Seu corpo precisa de detox?"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="🥗"
            defaultTitle="Cardápio Detox"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Seu corpo precisa de detox?
                </p>
                <p className="text-gray-600">
                  Descubra e receba um cardápio detox personalizado para limpeza e bem-estar
                </p>
              </>
            }
            benefits={[
              'Avaliação rápida de necessidade de detox',
              'Cardápio de 7 dias personalizado',
              'Alimentos depurativos específicos',
              'Estratégias de limpeza do organismo'
            ]}
            onStart={iniciarFormulario}
            buttonText="🥗 Começar Avaliação - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Avalie Sua Necessidade de Detox</h2>
              <p className="text-gray-600">Responda as perguntas para receber um cardápio detox personalizado.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Você sente algum destes sintomas? (selecione todos que se aplicam)
                </label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {sintomasDisponiveis.map((sintoma) => (
                    <button
                      key={sintoma}
                      type="button"
                      onClick={() => toggleSintoma(sintoma)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors text-left ${
                        dados.sintomas.includes(sintoma)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                      }`}
                    >
                      {dados.sintomas.includes(sintoma) && '✓ '}{sintoma}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de exposição a toxinas (ambientais, alimentares) <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.exposicao}
                  onChange={(e) => setDados({ ...dados, exposicao: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="baixa">Baixa - Alimentação saudável, ambiente limpo</option>
                  <option value="moderada">Moderada - Alguma exposição ocasional</option>
                  <option value="alta">Alta - Exposição frequente a toxinas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual seu objetivo principal? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="limpeza">Limpeza geral do organismo</option>
                  <option value="energia">Aumentar energia</option>
                  <option value="digestao">Melhorar digestão</option>
                  <option value="pele">Melhorar aparência da pele</option>
                  <option value="peso">Suporte para perda de peso</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sua experiência com detox <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.experiencia}
                  onChange={(e) => setDados({ ...dados, experiencia: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante - Nunca fiz detox</option>
                  <option value="moderado">Moderado - Já fiz alguns detox</option>
                  <option value="avancado">Avançado - Tenho experiência com detox</option>
                </select>
              </div>
            </div>

            <button
              onClick={gerarCardapio}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  }}
            >
              Gerar Meu Cardápio Detox →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-green-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🥗</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Cardápio Detox Personalizado</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelDetox === 'detoxBasico' && 'Nível: Detox Básico - Limpeza Simples e Eficaz'}
                  {resultado.nivelDetox === 'detoxModerado' && 'Nível: Detox Moderado - Limpeza Profunda'}
                  {resultado.nivelDetox === 'detoxAvancado' && 'Nível: Detox Avançado - Limpeza Profunda e Completa'}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🍃</span>
                  Alimentos-Chave do Detox
                </h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {resultado.alimentosChave.map((alimento, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-green-800">{alimento}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-red-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🚫</span>
                  Alimentos a Evitar Durante o Detox
                </h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {resultado.eliminacoes.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 flex items-center">
                      <span className="text-red-600 mr-2">✗</span>
                      <span className="text-red-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-xl">
                  <span className="text-2xl mr-2">📅</span>
                  Exemplo de Cardápio Detox (Dia 1)
                </h3>
                {resultado.cardapio7Dias.map((dia) => (
                  <div key={dia.dia} className="space-y-4">
                    {dia.refeicoes.map((refeicao, index) => (
                      <div key={index} className="bg-white rounded-lg p-5 border-2 border-green-200">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">{refeicao.refeicao}</h4>
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            {refeicao.tempo}
                          </span>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Alimentos:</p>
                          <ul className="space-y-1">
                            {refeicao.alimentos.map((alimento, idx) => (
                              <li key={idx} className="text-sm text-gray-600 flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                <span>{alimento}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-green-50 rounded p-3">
                          <p className="text-sm text-green-800">
                            <span className="font-semibold">✓ Benefício: </span>
                            {refeicao.beneficio}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-sm text-blue-900">
                        <span className="font-semibold">💡 Dica do Dia: </span>
                        {dia.dica}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Diagnósticos Nutricionais */}
              {diagnostico && (
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
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
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-l-4 border-green-500">
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
                  Dicas Importantes sobre Detox
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Hidrate-se bem - beba pelo menos 2L de água por dia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Priorize descanso adequado durante o detox (7-8 horas de sono)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Evite exercícios intensos nos primeiros dias do detox</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Ouça seu corpo - ajuste conforme necessário</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Após o detox, reintroduza alimentos gradualmente</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Detox: ${resultado.nivelDetox === 'detoxBasico' ? 'Básico' : resultado.nivelDetox === 'detoxModerado' ? 'Moderado' : 'Avançado'} | Objetivo: ${dados.objetivo}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    sintomas: [],
                    exposicao: '',
                    objetivo: '',
                    experiencia: ''
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
                    sintomas: [],
                    exposicao: '',
                    objetivo: '',
                    experiencia: ''
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
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

