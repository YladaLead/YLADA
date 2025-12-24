'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import HypeDrinkCTA from '@/components/wellness/HypeDrinkCTA'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import { calcConsumoCafeinaDiagnosticos } from '@/lib/diagnostics'

interface ResultadoCafeina {
  consumoEstimado: number
  categoria: string
  cor: string
  descricao: string
  recomendacoes: string[]
  diagnostico?: any
}

const defaultConfig: TemplateBaseProps['config'] = {
  id: 'calc-consumo-cafeina',
  name: 'Calculadora: Consumo de Cafeína',
  description: 'Calcule seu consumo de cafeína e identifique alternativas',
  slug: 'calc-consumo-cafeina',
  profession: 'wellness'
}

export default function CalculadoraConsumoCafeina({ config = defaultConfig }: { config?: TemplateBaseProps['config'] }) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [cafes, setCafes] = useState('')
  const [energetico, setEnergetico] = useState(false)
  const [treina, setTreina] = useState(false)
  const [horarioTreino, setHorarioTreino] = useState('')
  const [resultado, setResultado] = useState<ResultadoCafeina | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularConsumo = () => {
    const cafesNum = parseFloat(cafes) || 0
    let consumoEstimado = cafesNum * 80 // mg por xícara

    if (energetico) {
      consumoEstimado += 80 // mg por energético
    }

    if (treina) {
      consumoEstimado += 50 // estimativa de pré-treino
    }

    let categoria = ''
    let cor = ''
    let descricao = ''
    let recomendacoes: string[] = []

    let diagnosticoId = ''
    if (consumoEstimado > 300) {
      categoria = 'Consumo Alto'
      cor = 'red'
      descricao = 'Seu consumo de cafeína está elevado e pode estar causando dependência ou efeitos colaterais.'
      recomendacoes = [
        'Considere reduzir gradualmente o consumo de café',
        'O Hype Drink pode ser uma alternativa mais equilibrada',
        'Ele oferece cafeína natural com dosagem controlada',
        'Ajuda a evitar picos e quedas bruscas de energia'
      ]
      diagnosticoId = 'consumoAlto'
    } else if (consumoEstimado > 200) {
      categoria = 'Consumo Moderado'
      cor = 'orange'
      descricao = 'Seu consumo de cafeína está moderado, mas pode ser otimizado.'
      recomendacoes = [
        'O Hype Drink pode ajudar a distribuir melhor a cafeína ao longo do dia',
        'Ele combina cafeína natural com vitaminas e hidratação',
        'Pode reduzir a dependência de café excessivo'
      ]
      diagnosticoId = 'consumoModerado'
    } else {
      categoria = 'Consumo Baixo'
      cor = 'green'
      descricao = 'Seu consumo de cafeína está baixo. O Hype Drink pode ser uma boa opção para aumentar energia e foco.'
      recomendacoes = [
        'O Hype Drink pode ajudar a aumentar energia e foco',
        'Ele oferece cafeína natural com dosagem controlada',
        'Ideal para quem não consome muito café'
      ]
      diagnosticoId = 'consumoBaixo'
    }

    const diagnostico = calcConsumoCafeinaDiagnosticos.wellness?.[diagnosticoId as keyof typeof calcConsumoCafeinaDiagnosticos.wellness] || {
      diagnostico: `📋 DIAGNÓSTICO: Seu consumo de cafeína está ${categoria.toLowerCase()}`,
      causaRaiz: '🔍 CAUSA RAIZ: O consumo de cafeína pode estar elevado ou mal distribuído ao longo do dia. Alternativas com cafeína natural e dosagem controlada podem ajudar a manter energia mais estável.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: O Hype Drink pode ser uma alternativa mais equilibrada ao café excessivo. Ele combina cafeína natural, vitaminas e hidratação em uma solução prática.',
      plano7Dias: '📅 PLANO 7 DIAS: Substitua parte do seu consumo de café pelo Hype Drink. Ele pode ajudar a manter energia mais estável ao longo do dia.',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink combina cafeína natural (chá verde e preto), vitaminas do complexo B e hidratação. Ele pode ser uma alternativa mais equilibrada ao café excessivo.',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada. O Hype Drink pode complementar sua rotina, especialmente para manter energia mais estável.',
      proximoPasso: '🎯 PRÓXIMO PASSO: O Hype Drink pode ajudar a equilibrar seu consumo de cafeína. Quer experimentar?'
    }

    setResultado({
      consumoEstimado,
      categoria,
      cor,
      descricao,
      recomendacoes,
      diagnostico
    })
    setEtapa('resultado')
  }

  const recomecar = () => {
    setEtapa('landing')
    setCafes('')
    setEnergetico(false)
    setTreina(false)
    setHorarioTreino('')
    setResultado(null)
  }

  if (etapa === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <WellnessHeader config={config} />
        <WellnessLanding
          title="Calcule seu consumo de cafeína"
          description="Uma calculadora para identificar se seu consumo de cafeína está adequado e conhecer alternativas como o Hype Drink"
          benefits={[
            'Identifique seu consumo diário de cafeína',
            'Descubra se está dentro do recomendado',
            'Conheça alternativas mais equilibradas',
            'Receba recomendações personalizadas'
          ]}
          onStart={iniciarCalculo}
          ctaText="Calcular Agora"
        />
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <WellnessHeader config={config} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Seu Resultado</h2>
            <div className={`p-4 rounded-lg mb-6 bg-${resultado.cor}-50 border-2 border-${resultado.cor}-200`}>
              <h3 className="text-xl font-semibold mb-2">{resultado.categoria}</h3>
              <p className="text-gray-700 mb-2">
                Consumo estimado: <strong>{resultado.consumoEstimado} mg de cafeína por dia</strong>
              </p>
              <p className="text-gray-700 mb-4">{resultado.descricao}</p>
              <ul className="list-disc list-inside space-y-2">
                {resultado.recomendacoes.map((rec, index) => (
                  <li key={index} className="text-gray-600">{rec}</li>
                ))}
              </ul>
            </div>

            {resultado.diagnostico && (
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.diagnostico}</h4>
                  <p className="text-gray-600">{resultado.diagnostico.causaRaiz}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.acaoImediata}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.plano7Dias}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.suplementacao}</h4>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{resultado.diagnostico.alimentacao}</h4>
                </div>
                {resultado.diagnostico.proximoPasso && (
                  <div>
                    <h4 className="font-semibold mb-2">{resultado.diagnostico.proximoPasso}</h4>
                  </div>
                )}
              </div>
            )}

            {/* CTA Forte - Foco em Conversão */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                🚀 Quer Experimentar o Hype Drink?
              </h3>
              <p className="text-gray-700 text-center mb-4">
                O Hype Drink pode ser uma alternativa mais equilibrada ao café excessivo, com cafeína natural e dosagem controlada!
              </p>
              <HypeDrinkCTA
                config={config}
                resultado={resultado.categoria}
                mensagemPersonalizada={`Olá! Calculei meu consumo de cafeína e o resultado foi: ${resultado.categoria}. Gostaria de saber mais sobre o Hype Drink como alternativa!`}
              />
            </div>

            <WellnessActionButtons
              onRecalculate={recomecar}
              onBack={() => setEtapa('formulario')}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <WellnessHeader config={config} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Informe seus dados</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantas xícaras de café você consome por dia?
              </label>
              <input
                type="number"
                min="0"
                value={cafes}
                onChange={(e) => setCafes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ex: 3"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={energetico}
                  onChange={(e) => setEnergetico(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Consumo energético regularmente
                </span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={treina}
                  onChange={(e) => setTreina(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Pratico atividade física
                </span>
              </label>
              {treina && (
                <select
                  value={horarioTreino}
                  onChange={(e) => setHorarioTreino(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Selecione o horário</option>
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="noite">Noite</option>
                </select>
              )}
            </div>

            <button
              onClick={calcularConsumo}
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              Calcular Consumo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

