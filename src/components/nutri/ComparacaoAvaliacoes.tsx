'use client'

import { useState, useEffect } from 'react'

interface Assessment {
  id: string
  assessment_number: number
  assessment_name: string | null
  assessment_type: string
  created_at: string
  is_reevaluation: boolean
  parent_assessment_id: string | null
  data: any
  interpretation?: string
  recommendations?: string
  comparison_data?: any
}

interface ComparacaoAvaliacoesProps {
  clienteId: string
  clienteNome: string
  avaliacaoAtualId: string
  isOpen: boolean
  onClose: () => void
}

export default function ComparacaoAvaliacoes({
  clienteId,
  clienteNome,
  avaliacaoAtualId,
  isOpen,
  onClose
}: ComparacaoAvaliacoesProps) {
  const [carregando, setCarregando] = useState(true)
  const [avaliacaoAtual, setAvaliacaoAtual] = useState<Assessment | null>(null)
  const [avaliacaoAnterior, setAvaliacaoAnterior] = useState<Assessment | null>(null)
  const [comparacao, setComparacao] = useState<any>(null)
  const [lyaAnalise, setLyaAnalise] = useState<string | null>(null)
  const [loadingLya, setLoadingLya] = useState(false)
  const [visualizacao, setVisualizacao] = useState<'tabela' | 'cards'>('cards')

  useEffect(() => {
    if (isOpen && avaliacaoAtualId) {
      carregarDados()
    }
  }, [isOpen, avaliacaoAtualId])

  const carregarDados = async () => {
    setCarregando(true)
    try {
      const response = await fetch(
        `/api/nutri/clientes/${clienteId}/avaliacoes?limit=100`,
        { credentials: 'include' }
      )
      
      if (!response.ok) throw new Error('Erro ao carregar avaliações')
      
      const data = await response.json()
      const avaliacoes = data.data?.assessments || []
      
      const atual = avaliacoes.find((av: Assessment) => av.id === avaliacaoAtualId)
      
      if (!atual) {
        throw new Error('Avaliação não encontrada')
      }
      
      setAvaliacaoAtual(atual)
      
      // Se tiver parent_assessment_id, buscar avaliação pai
      if (atual.parent_assessment_id) {
        const anterior = avaliacoes.find((av: Assessment) => av.id === atual.parent_assessment_id)
        setAvaliacaoAnterior(anterior || null)
      } else {
        // Se não for reavaliação, buscar a mais recente antes dela
        const anteriores = avaliacoes
          .filter((av: Assessment) => new Date(av.created_at) < new Date(atual.created_at))
          .sort((a: Assessment, b: Assessment) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        
        setAvaliacaoAnterior(anteriores[0] || null)
      }
      
      // Usar comparison_data se disponível, ou calcular manualmente
      if (atual.comparison_data) {
        setComparacao(atual.comparison_data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setCarregando(false)
    }
  }

  // Calcular comparação manual se não existir
  useEffect(() => {
    if (avaliacaoAtual && avaliacaoAnterior && !comparacao) {
      calcularComparacao()
    }
  }, [avaliacaoAtual, avaliacaoAnterior])

  const calcularComparacao = () => {
    if (!avaliacaoAnterior || !avaliacaoAtual) return

    const anterior = avaliacaoAnterior.data
    const atual = avaliacaoAtual.data

    const comparacaoData: any = {}

    const campos = [
      'weight', 'height', 'bmi', 'body_fat_percentage', 'muscle_mass',
      'waist_circumference', 'hip_circumference', 'chest_circumference',
      'arm_circumference', 'thigh_circumference', 'water_percentage',
      'visceral_fat', 'bone_mass', 'metabolic_age'
    ]

    campos.forEach(campo => {
      const valorAnterior = anterior?.[campo]
      const valorAtual = atual?.[campo]

      if (valorAnterior && valorAtual) {
        const old = parseFloat(valorAnterior.toString())
        const current = parseFloat(valorAtual.toString())
        
        if (!isNaN(old) && !isNaN(current)) {
          const difference = current - old
          const percentChange = old !== 0 ? ((difference / old) * 100) : 0
          
          comparacaoData[campo] = {
            old,
            current,
            difference: parseFloat(difference.toFixed(2)),
            percent_change: parseFloat(percentChange.toFixed(2))
          }
        }
      }
    })

    const diasEntre = Math.floor(
      (new Date(avaliacaoAtual.created_at).getTime() - new Date(avaliacaoAnterior.created_at).getTime()) / 
      (1000 * 60 * 60 * 24)
    )

    comparacaoData.dias_entre_avaliacoes = diasEntre

    setComparacao(comparacaoData)
  }

  // Pedir análise completa da LYA
  const pedirAnaliseLya = async () => {
    if (!comparacao || !avaliacaoAtual || !avaliacaoAnterior) return

    setLoadingLya(true)
    try {
      const resumo = {
        cliente: clienteNome,
        periodo: `${comparacao.dias_entre_avaliacoes} dias`,
        data_anterior: new Date(avaliacaoAnterior.created_at).toLocaleDateString('pt-BR'),
        data_atual: new Date(avaliacaoAtual.created_at).toLocaleDateString('pt-BR'),
        mudancas: Object.entries(comparacao)
          .filter(([key]) => key !== 'dias_entre_avaliacoes')
          .map(([key, value]: [string, any]) => ({
            metrica: key.replace(/_/g, ' '),
            anterior: value.old,
            atual: value.current,
            diferenca: value.difference,
            percentual: value.percent_change
          }))
      }

      const prompt = `Analise COMPLETA desta evolução da cliente ${clienteNome}:

Período: ${comparacao.dias_entre_avaliacoes} dias entre avaliações

DADOS COMPLETOS:
${JSON.stringify(resumo.mudancas, null, 2)}

Forneça uma análise COMPLETA E DETALHADA incluindo:

1. **Resumo Geral da Evolução**
2. **Análise de Cada Métrica Importante** (peso, gordura, massa magra, circunferências)
3. **Classificação do Progresso** (excelente/bom/moderado/precisa atenção)
4. **Pontos Positivos Específicos** (o que está funcionando)
5. **Pontos de Atenção** (o que pode melhorar)
6. **Recomendações Práticas e Específicas**
7. **Próxima Reavaliação** (quando sugerir)

Seja profissional, detalhada, motivadora quando apropriado, e forneça insights acionáveis.`

      const response = await fetch('/api/nutri/lya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: prompt })
      })

      const data = await response.json()
      if (response.ok) {
        setLyaAnalise(data.response || 'Não foi possível gerar análise.')
      }
    } catch (error) {
      console.error('Erro ao pedir análise LYA:', error)
      setLyaAnalise('Erro ao conectar com a LYA.')
    } finally {
      setLoadingLya(false)
    }
  }

  const renderCard = (campo: string, label: string, unidade: string) => {
    const comp = comparacao?.[campo]
    if (!comp) return null

    const isPositive = ['muscle_mass', 'water_percentage', 'bone_mass'].includes(campo)
    const isNegative = ['body_fat_percentage', 'visceral_fat', 'waist_circumference', 'weight'].includes(campo)
    
    const diff = comp.difference
    const isGood = (isPositive && diff > 0) || (isNegative && diff < 0)
    const isBad = (isPositive && diff < 0) || (isNegative && diff > 0)

    const colorClass = isGood ? 'text-green-600' : isBad ? 'text-red-600' : 'text-gray-600'
    const bgClass = isGood ? 'bg-green-50 border-green-200' : isBad ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
    const icon = diff > 0 ? '↑' : diff < 0 ? '↓' : '='

    return (
      <div className={`${bgClass} border-2 rounded-lg p-4`}>
        <p className="text-xs font-semibold text-gray-600 mb-2">{label}</p>
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {comp.current} <span className="text-sm font-normal">{unidade}</span>
            </p>
            <p className="text-xs text-gray-500">
              De: {comp.old} {unidade}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-xl font-bold ${colorClass}`}>
              {icon} {Math.abs(diff).toFixed(1)}
            </p>
            <p className={`text-xs font-semibold ${colorClass}`}>
              {diff > 0 ? '+' : ''}{comp.percent_change}%
            </p>
          </div>
        </div>
        {isGood && (
          <div className="mt-2 flex items-center text-xs text-green-700">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            Evolução positiva
          </div>
        )}
        {isBad && (
          <div className="mt-2 flex items-center text-xs text-red-700">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
            Precisa atenção
          </div>
        )}
      </div>
    )
  }

  const renderLinha = (campo: string, label: string, unidade: string) => {
    const comp = comparacao?.[campo]
    if (!comp) return null

    const diff = comp.difference
    const sinal = diff > 0 ? '+' : ''
    const colorClass = diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-600'

    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td className="py-3 px-4 font-medium text-gray-900">{label}</td>
        <td className="py-3 px-4 text-gray-600">{comp.old} {unidade}</td>
        <td className="py-3 px-4 text-gray-900 font-semibold">{comp.current} {unidade}</td>
        <td className={`py-3 px-4 font-semibold ${colorClass}`}>
          {sinal}{diff.toFixed(2)} {unidade}
        </td>
        <td className={`py-3 px-4 font-semibold ${colorClass}`}>
          {sinal}{comp.percent_change}%
        </td>
      </tr>
    )
  }

  if (!isOpen) return null

  if (carregando) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando comparação...</p>
        </div>
      </div>
    )
  }

  if (!avaliacaoAtual || !avaliacaoAnterior) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 text-center max-w-md">
          <p className="text-gray-600 mb-4">Não foi possível carregar os dados para comparação.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">📊 Comparação de Avaliações</h2>
              <p className="text-blue-100 mt-1">{clienteNome}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-700 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs text-blue-100">Avaliação Anterior</p>
              <p className="font-semibold">
                {new Date(avaliacaoAnterior.created_at).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-blue-100">
                #{avaliacaoAnterior.assessment_number} - {avaliacaoAnterior.assessment_name || 'Avaliação'}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-xs text-blue-100">Avaliação Atual</p>
              <p className="font-semibold">
                {new Date(avaliacaoAtual.created_at).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-blue-100">
                #{avaliacaoAtual.assessment_number} - {avaliacaoAtual.assessment_name || 'Avaliação'}
              </p>
            </div>
          </div>

          {comparacao?.dias_entre_avaliacoes && (
            <div className="mt-3 bg-white bg-opacity-20 rounded-lg px-4 py-2 inline-block">
              <span className="text-sm">
                ⏱️ Período: <span className="font-semibold">{comparacao.dias_entre_avaliacoes} dias</span>
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* LYA Análise Completa */}
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-5">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">LYA</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Análise Completa da LYA</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Deixe a LYA fazer uma análise profissional completa desta evolução
                </p>
                
                {lyaAnalise && (
                  <div className="bg-white rounded-lg p-4 mb-4 text-sm text-gray-700 whitespace-pre-line max-h-96 overflow-y-auto border border-purple-200">
                    {lyaAnalise}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={pedirAnaliseLya}
                  disabled={loadingLya}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingLya ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analisando com LYA...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Gerar Análise Completa com LYA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Toggle de Visualização */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Comparação Detalhada</h3>
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVisualizacao('cards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  visualizacao === 'cards'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Cards
              </button>
              <button
                onClick={() => setVisualizacao('tabela')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  visualizacao === 'tabela'
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Tabela
              </button>
            </div>
          </div>

          {comparacao && (
            <>
              {visualizacao === 'cards' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderCard('weight', 'Peso', 'kg')}
                  {renderCard('bmi', 'IMC', '')}
                  {renderCard('body_fat_percentage', '% Gordura Corporal', '%')}
                  {renderCard('muscle_mass', 'Massa Magra', 'kg')}
                  {renderCard('waist_circumference', 'Circunferência Cintura', 'cm')}
                  {renderCard('hip_circumference', 'Circunferência Quadril', 'cm')}
                  {renderCard('chest_circumference', 'Circunferência Peitoral', 'cm')}
                  {renderCard('arm_circumference', 'Circunferência Braço', 'cm')}
                  {renderCard('thigh_circumference', 'Circunferência Coxa', 'cm')}
                  {renderCard('water_percentage', '% Água Corporal', '%')}
                  {renderCard('visceral_fat', 'Gordura Visceral', '')}
                  {renderCard('bone_mass', 'Massa Óssea', 'kg')}
                  {renderCard('metabolic_age', 'Idade Metabólica', 'anos')}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Métrica</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Anterior</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Atual</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Diferença</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Variação %</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {renderLinha('weight', 'Peso', 'kg')}
                      {renderLinha('bmi', 'IMC', '')}
                      {renderLinha('body_fat_percentage', '% Gordura', '%')}
                      {renderLinha('muscle_mass', 'Massa Magra', 'kg')}
                      {renderLinha('waist_circumference', 'Cintura', 'cm')}
                      {renderLinha('hip_circumference', 'Quadril', 'cm')}
                      {renderLinha('chest_circumference', 'Peitoral', 'cm')}
                      {renderLinha('arm_circumference', 'Braço', 'cm')}
                      {renderLinha('thigh_circumference', 'Coxa', 'cm')}
                      {renderLinha('water_percentage', '% Água', '%')}
                      {renderLinha('visceral_fat', 'Gordura Visceral', '')}
                      {renderLinha('bone_mass', 'Massa Óssea', 'kg')}
                      {renderLinha('metabolic_age', 'Idade Metabólica', 'anos')}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Interpretações das avaliações */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {avaliacaoAnterior.interpretation && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  📝 Interpretação Anterior
                </h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {avaliacaoAnterior.interpretation}
                </p>
              </div>
            )}

            {avaliacaoAtual.interpretation && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  📝 Interpretação Atual
                </h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {avaliacaoAtual.interpretation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
