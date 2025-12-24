'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import HypeDrinkCTA from '@/components/wellness/HypeDrinkCTA'
import WellnessActionButtons from '@/components/wellness/WellnessActionButtons'
import { calcCustoEnergiaDiagnosticos } from '@/lib/diagnostics'

interface ResultadoCusto {
  percentualImprodutivo: number
  custoEstimado: number | null
  impacto: string
  cor: string
  descricao: string
  recomendacoes: string[]
  diagnostico?: any
}

const defaultConfig: TemplateBaseProps['config'] = {
  id: 'calc-custo-energia',
  name: 'Calculadora: Custo da Falta de Energia',
  description: 'Calcule o impacto da falta de energia na sua produtividade',
  slug: 'calc-custo-energia',
  profession: 'wellness'
}

export default function CalculadoraCustoEnergia({ config = defaultConfig }: { config?: TemplateBaseProps['config'] }) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [horasTrabalhadas, setHorasTrabalhadas] = useState('')
  const [horasImprodutivas, setHorasImprodutivas] = useState('')
  const [tipoTrabalho, setTipoTrabalho] = useState('')
  const [valorHora, setValorHora] = useState('')
  const [resultado, setResultado] = useState<ResultadoCusto | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularCusto = () => {
    const horasTrab = parseFloat(horasTrabalhadas) || 0
    const horasImprod = parseFloat(horasImprodutivas) || 0
    const valorHoraNum = parseFloat(valorHora) || null

    if (horasTrab <= 0 || horasImprod < 0 || horasImprod > horasTrab) {
      alert('Por favor, preencha os valores corretamente.')
      return
    }

    const percentualImprodutivo = horasTrab > 0 ? (horasImprod / horasTrab) * 100 : 0
    const custoEstimado = valorHoraNum ? horasImprod * valorHoraNum : null

    let impacto = ''
    let cor = ''
    let descricao = ''
    let recomendacoes: string[] = []

    let diagnosticoId = ''
    if (percentualImprodutivo > 30) {
      impacto = 'Alto Impacto'
      cor = 'red'
      descricao = 'A falta de energia está impactando significativamente sua produtividade.'
      recomendacoes = [
        'O Hype Drink pode ajudar a reduzir horas improdutivas',
        'Ele mantém energia e foco constantes ao longo do dia',
        'Pode aumentar significativamente sua produtividade',
        'Investimento que se paga com maior performance'
      ]
      diagnosticoId = 'altoImpacto'
    } else if (percentualImprodutivo > 15) {
      impacto = 'Impacto Moderado'
      cor = 'orange'
      descricao = 'A falta de energia está impactando moderadamente sua produtividade.'
      recomendacoes = [
        'O Hype Drink pode ajudar a otimizar sua produtividade',
        'Ele mantém energia e foco mais estáveis',
        'Pode reduzir horas improdutivas'
      ]
      diagnosticoId = 'impactoModerado'
    } else {
      impacto = 'Baixo Impacto'
      cor = 'green'
      descricao = 'Sua produtividade está boa, mas pode ser otimizada ainda mais.'
      recomendacoes = [
        'O Hype Drink pode ajudar a manter produtividade constante',
        'Ele pode prevenir quedas de energia',
        'Ideal para manter performance no topo'
      ]
      diagnosticoId = 'baixoImpacto'
    }

    const diagnostico = calcCustoEnergiaDiagnosticos.wellness?.[diagnosticoId as keyof typeof calcCustoEnergiaDiagnosticos.wellness] || {
      diagnostico: `📋 DIAGNÓSTICO: A falta de energia está causando ${impacto.toLowerCase()} na sua produtividade`,
      causaRaiz: '🔍 CAUSA RAIZ: A perda de energia ao longo do dia pode impactar diretamente sua produtividade. Estratégias simples de suporte energético ajudam na performance.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: O Hype Drink pode ajudar a manter energia e foco constantes, reduzindo horas improdutivas e aumentando produtividade.',
      plano7Dias: '📅 PLANO 7 DIAS: Use o Hype Drink pela manhã ou nos momentos de maior demanda. Ele pode ajudar a manter produtividade constante ao longo do dia.',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink é uma bebida funcional desenvolvida para apoiar energia, foco e hidratação. Ele pode aumentar significativamente sua produtividade.',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada. O Hype Drink pode complementar sua rotina, especialmente para manter energia e foco constantes.',
      proximoPasso: '🎯 PRÓXIMO PASSO: O Hype Drink pode ajudar a reduzir horas improdutivas e aumentar sua produtividade. Quer experimentar?'
    }

    setResultado({
      percentualImprodutivo,
      custoEstimado,
      impacto,
      cor,
      descricao,
      recomendacoes,
      diagnostico
    })
    setEtapa('resultado')
  }

  const recomecar = () => {
    setEtapa('landing')
    setHorasTrabalhadas('')
    setHorasImprodutivas('')
    setTipoTrabalho('')
    setValorHora('')
    setResultado(null)
  }

  if (etapa === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <WellnessHeader config={config} />
        <WellnessLanding
          title="💰 Quanto a Falta de Energia Está Custando?"
          description="Descubra em 1 minuto quanto dinheiro você está perdendo por falta de energia e produtividade - e como recuperar isso"
          benefits={[
            'Calcule quantas horas você perde por falta de energia',
            'Descubra o custo financeiro real da baixa produtividade',
            'Veja quanto você poderia ganhar com mais energia',
            'Receba um plano para aumentar sua performance e renda'
          ]}
          onStart={iniciarCalculo}
          ctaText="▶️ Calcular Meu Custo Agora - Grátis!"
        />
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <WellnessHeader config={config} />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Seu Resultado</h2>
            <div className={`p-4 rounded-lg mb-6 bg-${resultado.cor}-50 border-2 border-${resultado.cor}-200`}>
              <h3 className="text-xl font-semibold mb-2">{resultado.impacto}</h3>
              <p className="text-gray-700 mb-2">
                Percentual de horas improdutivas: <strong>{resultado.percentualImprodutivo.toFixed(1)}%</strong>
              </p>
              {resultado.custoEstimado !== null && (
                <p className="text-gray-700 mb-2">
                  Custo estimado: <strong>R$ {resultado.custoEstimado.toFixed(2)} por dia</strong>
                </p>
              )}
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
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-300 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                🚀 Quer Experimentar o Hype Drink?
              </h3>
              <p className="text-gray-700 text-center mb-4">
                O Hype Drink pode ajudar a reduzir horas improdutivas e aumentar sua produtividade significativamente!
              </p>
              <HypeDrinkCTA
                config={config}
                resultado={resultado.impacto}
                mensagemPersonalizada={`Olá! Calculei o custo da falta de energia e o impacto foi: ${resultado.impacto}. Gostaria de saber mais sobre o Hype Drink para aumentar minha produtividade!`}
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <WellnessHeader config={config} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Informe seus dados</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantas horas você trabalha por dia?
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={horasTrabalhadas}
                onChange={(e) => setHorasTrabalhadas(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantas horas você fica improdutivo por cansaço?
              </label>
              <input
                type="number"
                min="0"
                max={horasTrabalhadas || 24}
                value={horasImprodutivas}
                onChange={(e) => setHorasImprodutivas(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de trabalho
              </label>
              <select
                value={tipoTrabalho}
                onChange={(e) => setTipoTrabalho(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Selecione o tipo</option>
                <option value="mental">Mental/Intelectual</option>
                <option value="fisico">Físico</option>
                <option value="misto">Misto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor da sua hora trabalhada (opcional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorHora}
                onChange={(e) => setValorHora(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Ex: 50.00"
              />
              <p className="text-xs text-gray-500 mt-1">Deixe em branco se não quiser calcular o custo financeiro</p>
            </div>

            <button
              onClick={calcularCusto}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Calcular Custo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

