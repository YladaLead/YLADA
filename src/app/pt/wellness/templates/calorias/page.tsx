'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'

interface ResultadoCalorias {
  tmb: number // Taxa Metabólica Basal
  tdee: number // Total Daily Energy Expenditure
  calorias: number // Calorias recomendadas baseadas no objetivo
  objetivo: string
  cor: string
  descricao: string
  recomendacoes: string[]
}

export default function CalculadoraCalorias({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [idade, setIdade] = useState('')
  const [genero, setGenero] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [atividade, setAtividade] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [resultado, setResultado] = useState<ResultadoCalorias | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularCalorias = () => {
    const pesoNum = parseFloat(peso)
    const alturaNum = parseFloat(altura) / 100
    const idadeNum = parseFloat(idade)

    if (!pesoNum || !alturaNum || !idadeNum || pesoNum <= 0 || alturaNum <= 0 || idadeNum <= 0) {
      alert('Por favor, preencha todos os campos com valores válidos.')
      return
    }

    if (!genero || !atividade || !objetivo) {
      alert('Por favor, selecione gênero, nível de atividade e objetivo.')
      return
    }

    // Calcular TMB (Taxa Metabólica Basal) usando fórmula de Mifflin-St Jeor
    let tmb = 0
    if (genero === 'masculino') {
      tmb = 10 * pesoNum + 6.25 * (alturaNum * 100) - 5 * idadeNum + 5
    } else {
      tmb = 10 * pesoNum + 6.25 * (alturaNum * 100) - 5 * idadeNum - 161
    }

    // Fator de atividade
    let fatorAtividade = 1.2 // Sedentário
    if (atividade === 'leve') fatorAtividade = 1.375
    else if (atividade === 'moderado') fatorAtividade = 1.55
    else if (atividade === 'intenso') fatorAtividade = 1.725
    else if (atividade === 'muito-intenso') fatorAtividade = 1.9

    // TDEE (Total Daily Energy Expenditure)
    const tdee = tmb * fatorAtividade

    // Ajustar por objetivo
    let calorias = tdee
    let descricao = ''
    let cor = 'green'
    let recomendacoes: string[] = []

    if (objetivo === 'perder') {
      calorias = Math.round(tdee * 0.85) // Déficit de 15%
      descricao = 'Para perder peso de forma saudável, você precisa de um déficit calórico moderado.'
      cor = 'orange'
      recomendacoes = [
        'Focar em alimentos ricos em nutrientes e baixos em calorias',
        'Manter ingestão adequada de proteínas para preservar massa muscular',
        'Praticar exercícios regulares combinando cardio e força',
        'Acompanhamento profissional para garantir perda saudável'
      ]
    } else if (objetivo === 'manter') {
      calorias = Math.round(tdee)
      descricao = 'Para manter seu peso atual, você precisa consumir a mesma quantidade de calorias que gasta.'
      cor = 'green'
      recomendacoes = [
        'Manter alimentação balanceada e variada',
        'Praticar atividades físicas regularmente',
        'Monitorar peso periodicamente',
        'Manter hábitos saudáveis de sono e hidratação'
      ]
    } else if (objetivo === 'ganhar') {
      calorias = Math.round(tdee * 1.15) // Superávit de 15%
      descricao = 'Para ganhar peso de forma saudável, você precisa de um superávit calórico moderado.'
      cor = 'blue'
      recomendacoes = [
        'Focar em alimentos nutritivos e calóricos',
        'Aumentar ingestão de proteínas para ganho de massa muscular',
        'Praticar exercícios de força regularmente',
        'Acompanhamento profissional para garantir ganho saudável'
      ]
    }

    setResultado({
      tmb: Math.round(tmb),
      tdee: Math.round(tdee),
      calorias,
      objetivo,
      cor,
      descricao,
      recomendacoes
    })
    setEtapa('resultado')
  }

  if (etapa === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
        <WellnessHeader />
        <WellnessLanding
          emoji={config.emoji || '🔥'}
          title={config.title || 'Calculadora de Calorias Diárias'}
          description={config.description || 'Descubra exatamente quantas calorias seu corpo precisa por dia — e receba orientações personalizadas baseadas em seu objetivo: emagrecer, manter ou ganhar peso.'}
          onStart={iniciarCalculo}
          customColors={config.custom_colors}
        />
      </div>
    )
  }

  if (etapa === 'formulario') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
        <WellnessHeader />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {config.title || 'Calculadora de Calorias Diárias'}
            </h2>

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
                  placeholder="Ex: 30"
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setGenero('masculino')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      genero === 'masculino'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    Masculino
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenero('feminino')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      genero === 'feminino'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    Feminino
                  </button>
                </div>
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
                  placeholder="Ex: 70"
                  min="1"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  placeholder="Ex: 175"
                  min="50"
                  max="250"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Nível de Atividade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Atividade Física <span className="text-red-500">*</span>
                </label>
                <select
                  value={atividade}
                  onChange={(e) => setAtividade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                  <option value="leve">Leve (exercício leve 1-3 dias/semana)</option>
                  <option value="moderado">Moderado (exercício moderado 3-5 dias/semana)</option>
                  <option value="intenso">Intenso (exercício intenso 6-7 dias/semana)</option>
                  <option value="muito-intenso">Muito Intenso (exercício muito intenso, trabalho físico)</option>
                </select>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setObjetivo('perder')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      objetivo === 'perder'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                    }`}
                  >
                    Perder Peso
                  </button>
                  <button
                    type="button"
                    onClick={() => setObjetivo('manter')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      objetivo === 'manter'
                        ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                    }`}
                  >
                    Manter Peso
                  </button>
                  <button
                    type="button"
                    onClick={() => setObjetivo('ganhar')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      objetivo === 'ganhar'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    Ganhar Peso
                  </button>
                </div>
              </div>

              {/* Botão Calcular */}
              <button
                onClick={calcularCalorias}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
              >
                Calcular Minhas Calorias
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
        <WellnessHeader />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Seu Resultado
            </h2>

            {/* Resultado Principal */}
            <div className={`bg-gradient-to-r ${
              resultado.cor === 'orange' ? 'from-orange-100 to-red-100' :
              resultado.cor === 'green' ? 'from-green-100 to-emerald-100' :
              'from-blue-100 to-cyan-100'
            } rounded-xl p-6 mb-6`}>
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {resultado.calorias.toLocaleString('pt-BR')}
                </div>
                <div className="text-lg font-semibold text-gray-700 mb-4">
                  calorias por dia
                </div>
                <div className="text-sm text-gray-600">
                  {resultado.objetivo === 'perder' && 'Para perder peso de forma saudável'}
                  {resultado.objetivo === 'manter' && 'Para manter seu peso atual'}
                  {resultado.objetivo === 'ganhar' && 'Para ganhar peso de forma saudável'}
                </div>
              </div>
            </div>

            {/* Detalhes Técnicos */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Detalhes do Cálculo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa Metabólica Basal (TMB):</span>
                  <span className="font-semibold text-gray-900">{resultado.tmb.toLocaleString('pt-BR')} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gasto Energético Total (TDEE):</span>
                  <span className="font-semibold text-gray-900">{resultado.tdee.toLocaleString('pt-BR')} kcal</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-900 font-semibold">Calorias Recomendadas:</span>
                  <span className="font-bold text-orange-600">{resultado.calorias.toLocaleString('pt-BR')} kcal</span>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                {resultado.descricao}
              </p>
            </div>

            {/* Recomendações */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Recomendações Importantes</h3>
              <ul className="space-y-2">
                {resultado.recomendacoes.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <WellnessCTAButton
              config={config}
              resultado={`${resultado.calorias.toLocaleString('pt-BR')} calorias diárias recomendadas para ${resultado.objetivo === 'perder' ? 'perder peso' : resultado.objetivo === 'manter' ? 'manter peso' : 'ganhar peso'}`}
            />
          </div>
        </div>
      </div>
    )
  }

  return null
}

