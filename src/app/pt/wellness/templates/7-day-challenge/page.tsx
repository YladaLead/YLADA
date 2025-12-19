'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { desafio7DiasDiagnosticos } from '@/lib/diagnostics'

interface Resultado {
  nivelDesafio: string
  habitos: string[]
  dias: Array<{ dia: number; foco: string; tarefas: string[] }>
}

const HABITOS_BASICOS = [
  'Beber 2L de água por dia',
  'Adicionar 1 porção de vegetais no almoço',
  'Fazer 20 minutos de caminhada',
  'Dormir pelo menos 7 horas'
]

const HABITOS_MODERADOS = [
  'Beber 2,5L de água por dia',
  'Consumir 3 porções de vegetais',
  'Incluir proteína em 3 refeições',
  'Fazer 30 minutos de atividade física',
  'Dormir 7-8 horas'
]

const HABITOS_AVANCADOS = [
  'Beber 3L de água por dia',
  'Consumir 4-5 porções de vegetais',
  'Distribuir 30g proteína por refeição',
  'Timing nutricional estratégico',
  '45 minutos de atividade física',
  '8 horas de sono + rotina de sono'
]

export default function Desafio7Dias({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    experiencia: '',
    objetivo: '',
    disponibilidade: ''
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [diagnostico, setDiagnostico] = useState<any>(null)

  const iniciarDesafio = () => {
    setEtapa('formulario')
  }

  const calcularDesafio = () => {
    if (!dados.experiencia || !dados.objetivo || !dados.disponibilidade) {
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
    else if (dados.objetivo === 'bem-estar' || dados.objetivo === 'energia') pontuacao += 1
    else if (dados.objetivo === 'perder-peso' || dados.objetivo === 'performance') pontuacao += 2
    
    // Pontuação por disponibilidade (0-2 pontos)
    if (dados.disponibilidade === 'baixa') pontuacao += 0
    else if (dados.disponibilidade === 'moderada') pontuacao += 1
    else if (dados.disponibilidade === 'alta') pontuacao += 2
    
    // Total: 0-6 pontos
    // Mapear pontuação para diagnóstico usando os 5 diagnósticos disponíveis
    let diagnosticoId = 'motivacaoBaixa'
    if (pontuacao === 0) {
      diagnosticoId = 'motivacaoBaixa'
    } else if (pontuacao >= 1 && pontuacao <= 2) {
      diagnosticoId = 'perfeitoParaDesafioEstruturado7Dias'
    } else if (pontuacao === 3) {
      diagnosticoId = 'altaMotivacaoParaTransformacaoRapida'
    } else if (pontuacao >= 4 && pontuacao <= 5) {
      diagnosticoId = 'prontoParaResultadosRapidos'
    } else if (pontuacao === 6) {
      diagnosticoId = 'motivacaoMuitoAlta'
    }

    // Determinar nível do desafio
    let nivelDesafio = 'desafioBasico'
    let habitos: string[] = []
    let dias: Array<{ dia: number; foco: string; tarefas: string[] }> = []

    if (dados.experiencia === 'iniciante' || (dados.experiencia === 'intermediario' && dados.disponibilidade === 'baixa')) {
      nivelDesafio = 'desafioBasico'
      habitos = HABITOS_BASICOS
      
      dias = [
        { dia: 1, foco: 'Água', tarefas: ['Beber 2L de água', 'Caminhar 20min', 'Adicionar 1 porção de vegetais no almoço'] },
        { dia: 2, foco: 'Sono', tarefas: ['Dormir 7h', 'Beber água regularmente', '1 porção de vegetais'] },
        { dia: 3, foco: 'Movimento', tarefas: ['Caminhar 20min', '2L água', 'Vegetais no almoço'] },
        { dia: 4, foco: 'Consistência', tarefas: ['Manter hábitos dos dias anteriores', 'Beber água', 'Caminhar'] },
        { dia: 5, foco: 'Progressão', tarefas: ['Aumentar movimento para 25min', '2L água', '2 porções de vegetais'] },
        { dia: 6, foco: 'Consolidação', tarefas: ['Manter todos os hábitos', 'Monitorar progresso'] },
        { dia: 7, foco: 'Celebração', tarefas: ['Review completo', 'Avaliar resultados', 'Definir próximos passos'] }
      ]
    } else if (dados.experiencia === 'avancado' || (dados.experiencia === 'intermediario' && dados.disponibilidade === 'alta')) {
      nivelDesafio = 'desafioAvancado'
      habitos = HABITOS_AVANCADOS
      
      dias = [
        { dia: 1, foco: 'Fundação', tarefas: ['3L água', '4 porções vegetais', '30g proteína/refeição', '45min treino'] },
        { dia: 2, foco: 'Timing', tarefas: ['Proteína pré-treino', '3L água', '4 porções vegetais', '8h sono'] },
        { dia: 3, foco: 'Otimização', tarefas: ['Distribuição estratégica', 'Rotina de sono', '4-5 porções vegetais'] },
        { dia: 4, foco: 'Performance', tarefas: ['Refinamentos', 'Monitoramento metabólico', 'Recuperação ativa'] },
        { dia: 5, foco: 'Aceleração', tarefas: ['Máxima sinergia', 'Ajustes finos', 'Refinamentos'] },
        { dia: 6, foco: 'Consolidação', tarefas: ['Manter todos os hábitos', 'Avaliar resposta metabólica'] },
        { dia: 7, foco: 'Evolução', tarefas: ['Review completo', 'Análise de performance', 'Planejamento avançado'] }
      ]
    } else {
      nivelDesafio = 'desafioModerado'
      habitos = HABITOS_MODERADOS
      
      dias = [
        { dia: 1, foco: 'Início', tarefas: ['2,5L água', '3 porções vegetais', 'Proteína em 3 refeições'] },
        { dia: 2, foco: 'Integração', tarefas: ['Atividade física 30min', 'Distribuir proteína', 'Manter hidratação'] },
        { dia: 3, foco: 'Qualidade', tarefas: ['Focar em qualidade nutricional', 'Timing das refeições', '30min movimento'] },
        { dia: 4, foco: 'Consistência', tarefas: ['Manter todos os hábitos', 'Monitorar energia', 'Ajustar se necessário'] },
        { dia: 5, foco: 'Progressão', tarefas: ['Aumentar para 4 porções vegetais', 'Otimizar timing', 'Manter atividade'] },
        { dia: 6, foco: 'Sinergia', tarefas: ['Hábitos integrados', 'Avaliar resultados intermediários'] },
        { dia: 7, foco: 'Transformação', tarefas: ['Review completo', 'Identificar ganhos', 'Planejar evolução'] }
      ]
    }

    const diagnosticoCompleto = desafio7DiasDiagnosticos.wellness[diagnosticoId as keyof typeof desafio7DiasDiagnosticos.wellness]
    setDiagnostico(diagnosticoCompleto)

    setResultado({
      nivelDesafio,
      habitos,
      dias
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Desafio 7 Dias"
        defaultDescription="Transforme sua vida em apenas 7 dias"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          const templateBenefits = getTemplateBenefits('7-day-challenge')
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="🏆"
              defaultTitle="Desafio 7 Dias"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Transforme sua vida em apenas 7 dias
                  </p>
                  <p className="text-gray-600">
                    Um desafio gamificado para criar hábitos duradouros e resultados reais
                  </p>
                </>
              }
              discover={templateBenefits.discover}
              benefits={templateBenefits.whyUse}
              onStart={iniciarDesafio}
              buttonText="▶️ Aceitar Desafio - É Grátis"
            />
          )
        })()}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Seu Desafio</h2>
              <p className="text-gray-600">Responda as perguntas para receber um desafio personalizado de 7 dias.</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="iniciante">Iniciante - Começando agora</option>
                  <option value="intermediario">Intermediário - Já tenho alguma experiência</option>
                  <option value="avancado">Avançado - Busco otimização máxima</option>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="habitos">Criar hábitos saudáveis</option>
                  <option value="energia">Aumentar energia e disposição</option>
                  <option value="perder-peso">Perder peso de forma saudável</option>
                  <option value="performance">Otimizar performance</option>
                  <option value="bem-estar">Melhorar bem-estar geral</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual sua disponibilidade diária? <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.disponibilidade}
                  onChange={(e) => setDados({ ...dados, disponibilidade: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="baixa">Baixa - Menos de 30min/dia</option>
                  <option value="moderada">Moderada - 30-60min/dia</option>
                  <option value="alta">Alta - Mais de 60min/dia</option>
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
                    background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)'
                  }}
            >
              Gerar Meu Desafio de 7 Dias →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-orange-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🏆</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Desafio de 7 Dias</h2>
                <p className="text-gray-600 text-lg">
                  {resultado.nivelDesafio === 'desafioBasico' && 'Nível: Básico (Hábitos Fundamentais)'}
                  {resultado.nivelDesafio === 'desafioModerado' && 'Nível: Moderado (Aceleração)'}
                  {resultado.nivelDesafio === 'desafioAvancado' && 'Nível: Avançado (Performance Máxima)'}
                </p>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-orange-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  Hábitos do Desafio
                </h3>
                <ul className="space-y-2">
                  {resultado.habitos.map((habito, index) => (
                    <li key={index} className="flex items-start text-orange-800">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>{habito}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📅</span>
                  Cronograma de 7 Dias
                </h3>
                <div className="space-y-4">
                  {resultado.dias.map((dia) => (
                    <div key={dia.dia} className="bg-white rounded-lg p-4 border-2 border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">Dia {dia.dia}</h4>
                        <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                          {dia.foco}
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {dia.tarefas.map((tarefa, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            <span>{tarefa}</span>
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
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
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
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 border-l-4 border-orange-500">
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
                  Dicas para Sucesso
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Comece hoje mesmo - não adie para segunda-feira</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Marque cada dia completo com um check</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Celebre pequenas vitórias diárias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span>Revisão no dia 7: avalie o que funcionou e o que precisa ajustar</span>
                  </li>
                </ul>
              </div>
            </div>

            <LeadCapturePostResult
              config={config}
              ferramenta="Desafio 7 Dias"
              resultadoTexto={`Nível: ${resultado.nivelDesafio === 'desafioBasico' ? 'Básico' : resultado.nivelDesafio === 'desafioModerado' ? 'Moderado' : 'Avançado'} | Objetivo: ${dados.objetivo}`}
              mensagemConvite="🎯 Quer continuar evoluindo após o desafio?"
              beneficios={[
                'Plano de continuidade personalizado',
                'Novos desafios para manter motivação',
                'Acompanhamento profissional dos resultados',
                'Ajustes conforme sua evolução'
              ]}
            />

            <WellnessActionButtons
              onRecalcular={() => {
                setDados({
                  experiencia: '',
                  objetivo: '',
                  disponibilidade: ''
                })
                setResultado(null)
                setDiagnostico(null)
                setEtapa('formulario')
              }}
              onVoltarInicio={() => {
                setDados({
                  experiencia: '',
                  objetivo: '',
                  disponibilidade: ''
                })
                setResultado(null)
                setDiagnostico(null)
                setEtapa('landing')
              }}
              textoRecalcular="↺ Ajustar Desafio"
            />
          </div>
        )}
      </main>
    </div>
  )
}

