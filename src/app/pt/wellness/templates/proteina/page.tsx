'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'

interface ResultadoProteina {
  proteinaDiaria: number
  porRefeicao: number
  interpretacao: string
  cor: string
  recomendacoes: string[]
}

export default function CalculadoraProteina({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [idade, setIdade] = useState('')
  const [genero, setGenero] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [atividade, setAtividade] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [resultado, setResultado] = useState<ResultadoProteina | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularProteina = () => {
    const pesoNum = parseFloat(peso)

    if (!pesoNum || pesoNum <= 0) {
      alert('Por favor, preencha o peso com um valor válido.')
      return
    }

    // Fatores de proteína por kg baseado no objetivo
    let fator = 1.2 // Padrão sedentário
    
    if (objetivo === 'perder') fator = 2.2
    else if (objetivo === 'ganhar') fator = 2.5
    else fator = 1.8 // Manter peso

    // Ajuste por nível de atividade
    if (atividade === 'moderado') fator += 0.2
    else if (atividade === 'intenso') fator += 0.4
    else if (atividade === 'muito-intenso') fator += 0.6

    const proteinaDiaria = Math.round(pesoNum * fator)
    const porRefeicao = Math.round(proteinaDiaria / 5) // 5 refeições

    let interpretacao = ''
    let cor = ''
    let recomendacoes: string[] = []

    if (proteinaDiaria >= 100) {
      interpretacao = 'Consumo ideal para seus objetivos!'
      cor = 'green'
      recomendacoes = [
        'Manter consumo proteico regular',
        'Distribuir entre 5 refeições',
        'Incluir fontes variadas de proteína',
        'Monitorar resultados mensais'
      ]
    } else if (proteinaDiaria >= 70) {
      interpretacao = 'Boa quantidade, pode aumentar para otimizar resultados.'
      cor = 'blue'
      recomendacoes = [
        'Aumentar consumo proteico gradualmente',
        'Incluir proteína em cada refeição',
        'Considerar suplementação',
        'Monitorar progresso'
      ]
    } else {
      interpretacao = 'Consumo abaixo do ideal para seus objetivos.'
      cor = 'orange'
      recomendacoes = [
        'Aumentar ingestão de proteína urgentemente',
        'Incluir fontes como carnes, ovos, leguminosas',
        'Considerar suplementação proteica',
        'Consultar especialista para plano personalizado'
      ]
    }

    setResultado({
      proteinaDiaria,
      porRefeicao,
      interpretacao,
      cor,
      recomendacoes
    })
    setEtapa('resultado')
  }

  const resetar = () => {
    setIdade('')
    setGenero('')
    setPeso('')
    setAltura('')
    setAtividade('')
    setObjetivo('')
    setResultado(null)
    setEtapa('formulario')
  }

  const voltarInicio = () => {
    setIdade('')
    setGenero('')
    setPeso('')
    setAltura('')
    setAtividade('')
    setObjetivo('')
    setResultado(null)
    setEtapa('landing')
  }

  const cores = {
    green: 'bg-green-600 text-green-800',
    blue: 'bg-blue-600 text-blue-800',
    orange: 'bg-orange-600 text-orange-800'
  }

  const bordas = {
    green: 'border-green-300',
    blue: 'border-blue-300',
    orange: 'border-orange-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Calculadora de Proteína"
        defaultDescription="Suas necessidades proteicas diárias"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('calc-proteina')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="💪"
              defaultTitle="Calculadora de Proteína"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra quantas gramas de proteína você precisa por dia
                  </p>
                  <p className="text-gray-600">
                    Para atingir seus objetivos com saúde e resultados
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarCalculo}
              buttonText="▶️ Calcular Minha Proteína - É Grátis"
            />
          )
        })()}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calcule sua proteína diária</h2>
              <p className="text-gray-600">Preencha os dados para descobrir suas necessidades proteicas personalizadas.</p>
            </div>

            <div className="space-y-6">
              {/* Idade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  min="1"
                  max="120"
                  placeholder="Ex: 30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              {/* Peso */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Altura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  min="100"
                  max="250"
                  placeholder="Ex: 175"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Nível de Atividade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de atividade física <span className="text-red-500">*</span>
                </label>
                <select
                  value={atividade}
                  onChange={(e) => setAtividade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve (1-2x por semana)</option>
                  <option value="moderado">Moderado (3-4x por semana)</option>
                  <option value="intenso">Intenso (5-6x por semana)</option>
                  <option value="muito-intenso">Muito intenso (2x ao dia)</option>
                </select>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo <span className="text-red-500">*</span>
                </label>
                <select
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="manter">Manter peso</option>
                  <option value="perder">Perder gordura</option>
                  <option value="ganhar">Ganhar massa muscular</option>
                </select>
              </div>
            </div>

            <button
              onClick={calcularProteina}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)'
                  }}
            >
              Calcular Proteína →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            {/* Resultado */}
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${bordas[resultado.cor]}`}>
              <div className="text-center mb-6">
                <div className={`inline-block px-8 py-4 rounded-full text-white font-bold text-2xl mb-4 ${cores[resultado.cor]}`}>
                  {resultado.proteinaDiaria}g de proteína/dia
                </div>
                <p className="text-sm text-gray-600 mb-2">Aproximadamente {resultado.porRefeicao}g por refeição</p>
                <p className="text-gray-800 text-xl">{resultado.interpretacao}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações Importantes
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`${resultado.proteinaDiaria}g de proteína/dia - ${resultado.interpretacao}`}
            />

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetar}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Fazer Novo Cálculo
              </button>
              <button
                onClick={voltarInicio}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
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

