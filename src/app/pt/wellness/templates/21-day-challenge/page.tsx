'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getDiagnostico, DiagnosticoCompleto } from '@/lib/diagnosticos-nutri'
import { getTemplateBenefits } from '@/lib/template-benefits'

interface Semana {
  numero: number
  nome: string
  foco: string
  habitos: string[]
  dias: number[]
}

interface Resultado {
  nivelDesafio: string
  habitos: string[]
  semanas: Semana[]
}

export default function Desafio21Dias({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    experiencia: '',
    objetivo: '',
    comprometimento: ''
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<DiagnosticoCompleto | null>(null)

  const iniciarDesafio = () => {
    setEtapa('formulario')
  }

  const calcularDesafio = () => {
    if (!dados.experiencia || !dados.objetivo || !dados.comprometimento) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    // Sistema de pontuação para determinar diagnóstico
    let pontuacao = 0
    
    // Pontuação por experiência (0-2 pontos)
    if (dados.experiencia === 'iniciante') pontuacao += 0
    else if (dados.experiencia === 'intermediario') pontuacao += 1
    else if (dados.experiencia === 'avancado') pontuacao += 2
    
    // Pontuação por objetivo (0-2 pontos)
    if (dados.objetivo === 'habitos') pontuacao += 0
    else if (dados.objetivo === 'saude' || dados.objetivo === 'disciplina') pontuacao += 1
    else if (dados.objetivo === 'transformacao' || dados.objetivo === 'performance') pontuacao += 2
    
    // Pontuação por comprometimento (0-2 pontos)
    if (dados.comprometimento === 'baixo') pontuacao += 0
    else if (dados.comprometimento === 'moderado') pontuacao += 1
    else if (dados.comprometimento === 'alto') pontuacao += 2
    
    // Total: 0-6 pontos
    // Mapear pontuação para diagnóstico usando os 5 diagnósticos disponíveis
    let diagnosticoId = 'motivacaoBaixa'
    if (pontuacao === 0) {
      diagnosticoId = 'motivacaoBaixa'
    } else if (pontuacao >= 1 && pontuacao <= 2) {
      diagnosticoId = 'perfeitoParaDesafioEstruturado'
    } else if (pontuacao === 3) {
      diagnosticoId = 'altaMotivacaoParaMudanca'
    } else if (pontuacao >= 4 && pontuacao <= 5) {
      diagnosticoId = 'prontoParaTransformacao'
    } else if (pontuacao === 6) {
      diagnosticoId = 'motivacaoMuitoAlta'
    }

    // Determinar nível do desafio
    let nivelDesafio = 'desafioBasico'
    let habitos: string[] = []
    let semanas: Semana[] = []

    if (dados.experiencia === 'iniciante' || (dados.experiencia === 'intermediario' && dados.comprometimento === 'baixo')) {
      nivelDesafio = 'desafioBasico'
      habitos = [
        'Beber 2L de água por dia',
        'Adicionar vegetais em 2 refeições',
        'Manter horários consistentes de refeições',
        'Dormir pelo menos 7 horas'
      ]
      
      semanas = [
        {
          numero: 1,
          nome: 'Semana 1: Introdução',
          foco: 'Estabelecer base',
          habitos: [
            'Beber 1,5L de água/dia',
            '1 porção de vegetais no almoço',
            'Horários fixos para café, almoço e jantar'
          ],
          dias: [1, 2, 3, 4, 5, 6, 7]
        },
        {
          numero: 2,
          nome: 'Semana 2: Consolidação',
          foco: 'Aumentar consistência',
          habitos: [
            'Beber 2L de água/dia',
            '2 porções de vegetais (almoço + jantar)',
            'Manter horários + adicionar lanche saudável'
          ],
          dias: [8, 9, 10, 11, 12, 13, 14]
        },
        {
          numero: 3,
          nome: 'Semana 3: Automatização',
          foco: 'Tornar automático',
          habitos: [
            '2L água/dia (automático)',
            'Vegetais em 2 refeições (automático)',
            'Todos os horários consistentes',
            '7h+ de sono regular'
          ],
          dias: [15, 16, 17, 18, 19, 20, 21]
        }
      ]
    } else if (dados.experiencia === 'avancado' || (dados.experiencia === 'intermediario' && dados.comprometimento === 'alto')) {
      nivelDesafio = 'desafioAvancado'
      habitos = [
        'Beber 3L de água por dia',
        'Consumir 4-5 porções de vegetais',
        'Distribuir 30g proteína por refeição',
        'Timing nutricional estratégico',
        '8 horas de sono com rotina consistente',
        'Atividade física estruturada'
      ]
      
      semanas = [
        {
          numero: 1,
          nome: 'Semana 1: Fundação',
          foco: 'Estrutura base de elite',
          habitos: [
            '3L água distribuídos',
            '4 porções vegetais/dia',
            '30g proteína/refeição (5 refeições)',
            'Timing: proteína pré-treino',
            'Rotina de sono: 8h fixas'
          ],
          dias: [1, 2, 3, 4, 5, 6, 7]
        },
        {
          numero: 2,
          nome: 'Semana 2: Refinamento',
          foco: 'Otimização metabólica',
          habitos: [
            'Refinar timing nutricional',
            '5 porções vegetais com rotatividade',
            'Distribuição estratégica de carbs',
            'Otimizar recuperação pós-treino',
            'Manter rotina de sono consistente'
          ],
          dias: [8, 9, 10, 11, 12, 13, 14]
        },
        {
          numero: 3,
          nome: 'Semana 3: Automação',
          foco: 'Hábitos de elite automáticos',
          habitos: [
            'Todos os hábitos automáticos',
            'Monitoramento metabólico',
            'Ajustes finos baseados em resposta',
            'Sistema de alta performance consolidado'
          ],
          dias: [15, 16, 17, 18, 19, 20, 21]
        }
      ]
    } else {
      nivelDesafio = 'desafioModerado'
      habitos = [
        'Beber 2,5L de água por dia',
        'Consumir 3-4 porções de vegetais',
        'Proteína em 3-4 refeições',
        'Timing básico de refeições',
        '7-8 horas de sono'
      ]
      
      semanas = [
        {
          numero: 1,
          nome: 'Semana 1: Base',
          foco: 'Estabelecer padrão',
          habitos: [
            '2L água/dia',
            '3 porções vegetais',
            'Proteína em 3 refeições principais',
            'Horários consistentes'
          ],
          dias: [1, 2, 3, 4, 5, 6, 7]
        },
        {
          numero: 2,
          nome: 'Semana 2: Progressão',
          foco: 'Elevar qualidade',
          habitos: [
            '2,5L água/dia',
            '4 porções vegetais',
            'Proteína distribuída (3-4 refeições)',
            'Timing básico implementado'
          ],
          dias: [8, 9, 10, 11, 12, 13, 14]
        },
        {
          numero: 3,
          nome: 'Semana 3: Otimização',
          foco: 'Consolidar hábitos',
          habitos: [
            'Todos os hábitos automatizados',
            'Qualidade nutricional elevada',
            'Timing otimizado',
            'Pronto para evolução contínua'
          ],
          dias: [15, 16, 17, 18, 19, 20, 21]
        }
      ]
    }

    const diagnosticoCompleto = getDiagnostico('template-desafio-21dias', 'wellness', diagnosticoId)
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelDesafio,
      habitos,
      semanas
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Desafio 21 Dias"
        defaultDescription="Crie hábitos duradouros em apenas 21 dias"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          const templateBenefits = getTemplateBenefits('21-day-challenge')
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="📅"
              defaultTitle="Desafio 21 Dias"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Crie hábitos duradouros em apenas 21 dias
                  </p>
                  <p className="text-gray-600">
                    O tempo científico para formação de hábitos - transforme temporário em permanente
                  </p>
                </>
              }
              discover={templateBenefits.discover}
              benefits={templateBenefits.whyUse}
              onStart={iniciarDesafio}
              buttonText="▶️ Aceitar Desafio de 21 Dias - É Grátis"
            />
          )
        })()}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Seu Desafio de 21 Dias</h2>
              <p className="text-gray-600">Responda as perguntas para receber um desafio personalizado de 21 dias para formar hábitos duradouros.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu nível de experiência <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.experiencia}
                  onChange={(e) => setDados({ ...dados, experiencia: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante - Começando agora</option>
                  <option value="intermediario">Intermediário - Já tenho alguma experiência</option>
                  <option value="avancado">Avançado - Busco hábitos de elite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual seu principal objetivo? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="habitos">Criar hábitos duradouros</option>
                  <option value="transformacao">Transformação completa</option>
                  <option value="performance">Otimizar performance</option>
                  <option value="saude">Melhorar saúde a longo prazo</option>
                  <option value="disciplina">Desenvolver disciplina</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual seu nível de comprometimento? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.comprometimento}
                  onChange={(e) => setDados({ ...dados, comprometimento: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="baixo">Baixo - Preciso começar devagar</option>
                  <option value="moderado">Moderado - Posso manter consistência</option>
                  <option value="alto">Alto - Estou totalmente comprometido</option>
                </select>
              </div>
            </div>

            <button
              onClick={calcularDesafio}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  }}
            >
              Gerar Meu Desafio de 21 Dias →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-green-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📅</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Desafio de 21 Dias</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelDesafio === 'desafioBasico' && 'Nível: Básico (Hábitos Fundamentais Duradouros)'}
                  {resultado.nivelDesafio === 'desafioModerado' && 'Nível: Moderado (Transformação Sustentável)'}
                  {resultado.nivelDesafio === 'desafioAvancado' && 'Nível: Avançado (Hábitos de Elite Duradouros)'}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  Hábitos que Você Vai Criar
                </h3>
                <ul className="space-y-2">
                  {resultado.habitos.map((habito, index) => (
                    <li key={index} className="flex items-start text-green-800">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{habito}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📅</span>
                  Estrutura de 3 Semanas
                </h3>
                <div className="space-y-6">
                  {resultado.semanas.map((semana) => (
                    <div key={semana.numero} className="bg-white rounded-lg p-5 border-2 border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-900 text-lg">{semana.nome}</h4>
                        <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          {semana.foco}
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm text-gray-600">Dias: {semana.dias[0]} até {semana.dias[semana.dias.length - 1]}</span>
                      </div>
                      <ul className="space-y-2">
                        {semana.habitos.map((habito, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>{habito}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
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
                  <span className="text-2xl mr-2">💪</span>
                  Dicas para Sucesso nos 21 Dias
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Comece hoje mesmo - cada dia conta para formar o hábito</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Faça check-ins semanais para avaliar progresso e ajustar</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Celebre pequenas vitórias ao longo das 3 semanas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>No dia 21, revise tudo e planeje a manutenção dos hábitos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Lembre-se: 21 dias é o início - continue após o desafio</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Desafio: ${resultado.nivelDesafio === 'desafioBasico' ? 'Básico' : resultado.nivelDesafio === 'desafioModerado' ? 'Moderado' : 'Avançado'} | Objetivo: ${dados.objetivo}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    experiencia: '',
                    objetivo: '',
                    comprometimento: ''
                  })
                  setResultado(null)
                  setDiagnostico(null)
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Ajustar Desafio
              </button>
              <button
                onClick={() => {
                  setDados({
                    experiencia: '',
                    objetivo: '',
                    comprometimento: ''
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

