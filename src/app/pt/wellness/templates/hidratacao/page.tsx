'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import LeadCapturePostResult from '@/components/wellness/LeadCapturePostResult'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'
import { calculadoraAguaDiagnosticos as wellnessAguaDiag } from '@/lib/diagnostics/wellness/calculadora-agua'
import { calculadoraAguaDiagnosticos as coachAguaDiag } from '@/lib/diagnostics/coach/calculadora-agua'

interface ResultadoHidratacao {
  aguaDiaria: number
  copos: number
  interpretacao: string
  cor: string
  recomendacoes: string[]
  diagnostico?: {
    diagnostico: string
    causaRaiz: string
    acaoImediata: string
    plano7Dias?: string
    suplementacao?: string
    alimentacao?: string
    proximoPasso?: string
  }
}

export default function CalculadoraHidratacao({ config }: TemplateBaseProps) {
  const isCoach = config?.vertical === 'coach-bem-estar' || config?.vertical === 'coach'

  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [peso, setPeso] = useState('')
  const [atividade, setAtividade] = useState('')
  const [clima, setClima] = useState('')
  const [resultado, setResultado] = useState<ResultadoHidratacao | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularHidratacao = () => {
    // 🚀 CORREÇÃO: Validar todos os campos obrigatórios antes de calcular
    const pesoNum = parseFloat(peso)

    // Validar campo numérico
    if (!pesoNum || pesoNum <= 0) {
      alert('Por favor, preencha o peso com um valor válido.')
      return
    }

    // Validar campos de seleção
    if (!atividade || !clima) {
      alert('Por favor, selecione o nível de atividade física e o clima onde você vive.')
      return
    }

    // Base: 35ml por kg
    let aguaDiaria = pesoNum * 35

    // Ajuste por atividade
    if (atividade === 'leve') aguaDiaria += 300
    else if (atividade === 'moderado') aguaDiaria += 600
    else if (atividade === 'intenso') aguaDiaria += 1000
    else if (atividade === 'muito-intenso') aguaDiaria += 1500

    // Ajuste por clima
    if (clima === 'quente') aguaDiaria += 500
    else if (clima === 'muito-quente') aguaDiaria += 1000

    // Converter para litros
    const aguaL = Math.round(aguaDiaria / 1000)
    const copos = Math.round(aguaDiaria / 250)

    const aguaDiag = isCoach ? coachAguaDiag.coach : wellnessAguaDiag.wellness

    let interpretacao = ''
    let cor = ''
    let recomendacoes: string[] = []
    let diagnosticoSelecionado

    if (aguaL < 2) {
      interpretacao = 'Importante manter uma boa hidratação diária.'
      cor = 'orange'
      recomendacoes = [
        'Estabelecer rotina de hidratação',
        'Carregar garrafa de água sempre',
        'Beber água a cada hora',
        'Criar lembretes para beber água'
      ]
      diagnosticoSelecionado = aguaDiag.baixaHidratacao
    } else if (aguaL >= 2 && aguaL < 3) {
      interpretacao = 'Sua necessidade diária de hidratação está adequada.'
      cor = 'green'
      recomendacoes = [
        'Manter o consumo regular de água',
        'Beber água ao acordar',
        'Hidratar antes e após atividades físicas',
        'Incluir alimentos ricos em água'
      ]
      diagnosticoSelecionado = aguaDiag.hidratacaoModerada
    } else {
      interpretacao = 'Sua necessidade diária de hidratação é alta!'
      cor = 'blue'
      recomendacoes = [
        'Beber água regularmente ao longo do dia',
        'Manter garrafa de água sempre à mão',
        'Aumentar ingestão nos momentos de treino',
        'Monitorar sinais de desidratação'
      ]
      diagnosticoSelecionado = aguaDiag.altaHidratacao
    }

    setResultado({
      aguaDiaria: aguaL,
      copos,
      interpretacao,
      cor,
      recomendacoes,
      diagnostico: diagnosticoSelecionado
    })
    setEtapa('resultado')
  }

  const cores = {
    blue: 'bg-blue-600 text-blue-800',
    green: 'bg-green-600 text-green-800',
    orange: 'bg-orange-600 text-orange-800'
  }

  const bordas = {
    blue: 'border-blue-300',
    green: 'border-green-300',
    orange: 'border-orange-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Calculadora de Hidratação"
        defaultDescription="Sua necessidade diária de água"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('calc-hidratacao')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="💧"
              defaultTitle="Calculadora de Hidratação"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra quanta água você precisa beber por dia
                  </p>
                  <p className="text-gray-600">
                    Para manter seu corpo hidratado e saudável
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              benefitsTitle="A importância de saber a quantidade de água"
              onStart={iniciarCalculo}
              buttonText="▶️ Calcular Minha Hidratação - É Grátis"
            />
          )
        })()}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-cyan-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calcule sua necessidade de água</h2>
              <p className="text-gray-600">Preencha os dados para descobrir quanta água você precisa beber por dia.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min="1"
                  max="300"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de atividade física <span className="text-red-500">*</span>
                </label>
                <select
                  value={atividade}
                  onChange={(e) => setAtividade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve (caminhadas leves)</option>
                  <option value="moderado">Moderado (1-3x por semana)</option>
                  <option value="intenso">Intenso (4-6x por semana)</option>
                  <option value="muito-intenso">Muito intenso (atleta)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clima onde você vive <span className="text-red-500">*</span>
                </label>
                <select
                  value={clima}
                  onChange={(e) => setClima(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="temperado">Temperado</option>
                  <option value="quente">Quente</option>
                  <option value="muito-quente">Muito quente</option>
                </select>
              </div>
            </div>

            <button
              onClick={calcularHidratacao}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    backgroundColor: config.custom_colors.principal
                  }
                : {
                    backgroundColor: '#0891b2'
                  }}
            >
              Calcular Hidratação →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${bordas[resultado.cor]}`}>
              <div className="text-center mb-6">
                <div className={`inline-block px-8 py-4 rounded-full text-white font-bold text-2xl mb-4 ${cores[resultado.cor]}`}>
                  {resultado.aguaDiaria}L de água/dia
                </div>
                <p className="text-sm text-gray-600 mb-2">Aproximadamente {resultado.copos} copos de 250ml</p>
                <p className="text-gray-800 text-xl">{resultado.interpretacao}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Dicas de Hidratação
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-cyan-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Diagnóstico Completo */}
            {resultado.diagnostico && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-cyan-200">
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200 mb-6">
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
                    {resultado.diagnostico.plano7Dias && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.plano7Dias}</p>
                      </div>
                    )}
                    {resultado.diagnostico.suplementacao && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.suplementacao}</p>
                      </div>
                    )}
                    {resultado.diagnostico.alimentacao && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-gray-800 whitespace-pre-line">{resultado.diagnostico.alimentacao}</p>
                      </div>
                    )}
                    {resultado.diagnostico.proximoPasso && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-gray-800 font-semibold whitespace-pre-line">{resultado.diagnostico.proximoPasso}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CTA Section - Mensagem e Benefícios (sem formulário de coleta) */}
            <div 
              className="rounded-2xl p-8 border-2 mb-6"
              style={{
                background: config?.custom_colors
                  ? `linear-gradient(135deg, ${config.custom_colors.principal}10 0%, ${config.custom_colors.secundaria}10 100%)`
                  : 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
                borderColor: config?.custom_colors?.principal || '#93c5fd'
              }}
            >
              {/* Título convidativo */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {isCoach ? '💧 Quer transformar sua hidratação em saúde real?' : '💧 Quer um plano completo de hidratação personalizado?'}
                </h3>
                <p className="text-gray-600">
                  {isCoach
                    ? 'Hidratação adequada é um dos pilares do seu bem-estar. Posso te ajudar!'
                    : 'Te ajudo a alcançar seus objetivos de forma personalizada!'}
                </p>
              </div>

              {/* Benefícios */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">✨</span>
                  O que você vai receber:
                </h4>
                {isCoach ? (
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 text-lg">✓</span>
                      <span className="text-gray-700">Estratégia de hidratação adaptada ao seu dia</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 text-lg">✓</span>
                      <span className="text-gray-700">Acompanhamento de bem-estar e disposição</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 text-lg">✓</span>
                      <span className="text-gray-700">Hábitos simples que se encaixam na sua rotina</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 text-lg">✓</span>
                      <span className="text-gray-700">Mais energia, foco e leveza no dia a dia</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 text-lg">✓</span>
                      <span className="text-gray-700">Cronograma de hidratação adaptado à sua rotina</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 text-lg">✓</span>
                      <span className="text-gray-700">Dicas para criar lembretes personalizados</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 text-lg">✓</span>
                      <span className="text-gray-700">Ajustes conforme treino e clima</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 text-lg">✓</span>
                      <span className="text-gray-700">Melhorar pele, energia e desempenho físico</span>
                    </li>
                  </ul>
                )}
              </div>

              {/* CTA Button - Botão do WhatsApp sem coleta de dados */}
              {config && (
                <WellnessCTAButton
                  config={config}
                  resultadoTexto={`${resultado.aguaDiaria}L de água/dia (${resultado.copos} copos)`}
                />
              )}
            </div>

            <WellnessActionButtons
          onRecalcular={() => {
          setPeso('')
          setAtividade('')
          setClima('')
          setResultado(null)
          setEtapa('formulario')
          }}
          onVoltarInicio={() => {
          setPeso('')
          setAtividade('')
          setClima('')
          setResultado(null)
          setEtapa('landing')
          }}
          />
          </div>
        )}
      </main>
    </div>
  )
}

