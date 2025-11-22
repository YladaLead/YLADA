'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'

interface ResultadoHidratacao {
  aguaDiaria: number
  copos: number
  interpretacao: string
  cor: string
  recomendacoes: string[]
}

export default function CalculadoraHidratacao({ config }: TemplateBaseProps) {
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

    let interpretacao = ''
    let cor = ''
    let recomendacoes: string[] = []

    if (aguaL >= 3) {
      interpretacao = 'Sua necessidade diária de hidratação é alta!'
      cor = 'blue'
      recomendacoes = [
        'Beber água regularmente ao longo do dia',
        'Manter garrafa de água sempre à mão',
        'Aumentar ingestão nos momentos de treino',
        'Monitorar sinais de desidratação'
      ]
    } else if (aguaL >= 2) {
      interpretacao = 'Sua necessidade diária de hidratação está adequada.'
      cor = 'green'
      recomendacoes = [
        'Manter o consumo regular de água',
        'Beber água ao acordar',
        'Hidratar antes e após atividades físicas',
        'Incluir alimentos ricos em água'
      ]
    } else {
      interpretacao = 'Importante manter uma boa hidratação diária.'
      cor = 'orange'
      recomendacoes = [
        'Estabelecer rotina de hidratação',
        'Carregar garrafa de água sempre',
        'Beber água a cada hora',
        'Criar lembretes para beber água'
      ]
    }

    setResultado({
      aguaDiaria: aguaL,
      copos,
      interpretacao,
      cor,
      recomendacoes
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
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)'
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

            <WellnessCTAButton
              config={config}
              resultadoTexto={`${resultado.aguaDiaria}L de água/dia (${resultado.copos} copos) - ${resultado.interpretacao}`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setPeso('')
                  setAtividade('')
                  setClima('')
                  setResultado(null)
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Fazer Novo Cálculo
              </button>
              <button
                onClick={() => {
                  setPeso('')
                  setAtividade('')
                  setClima('')
                  setResultado(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
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

