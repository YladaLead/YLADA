'use client'

import { useState, useEffect } from 'react'

interface NovaReavaliacaoModalProps {
  clienteId: string
  clienteNome: string
  avaliacaoAnteriorId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface Assessment {
  id: string
  assessment_number: number
  created_at: string
  data: any
}

interface FormData {
  measurement_date: string
  status: string
  interpretation: string
  recommendations: string
  data: {
    weight: string
    height: string
    bmi: string
    waist_circumference: string
    hip_circumference: string
    chest_circumference: string
    arm_circumference: string
    thigh_circumference: string
    calf_circumference: string
    neck_circumference: string
    body_fat_percentage: string
    muscle_mass: string
    water_percentage: string
    visceral_fat: string
    bone_mass: string
    metabolic_age: string
    notes: string
  }
}

export default function NovaReavaliacaoModal({
  clienteId,
  clienteNome,
  avaliacaoAnteriorId,
  isOpen,
  onClose,
  onSuccess
}: NovaReavaliacaoModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [carregandoAnterior, setCarregandoAnterior] = useState(true)
  const [avaliacaoAnterior, setAvaliacaoAnterior] = useState<Assessment | null>(null)
  const [comparacao, setComparacao] = useState<any>(null)
  const [lyaInsights, setLyaInsights] = useState<string | null>(null)
  const [loadingLya, setLoadingLya] = useState(false)

  const initialFormState = (): FormData => ({
    measurement_date: new Date().toISOString().split('T')[0],
    status: 'completo',
    interpretation: '',
    recommendations: '',
    data: {
      weight: '',
      height: '',
      bmi: '',
      waist_circumference: '',
      hip_circumference: '',
      chest_circumference: '',
      arm_circumference: '',
      thigh_circumference: '',
      calf_circumference: '',
      neck_circumference: '',
      body_fat_percentage: '',
      muscle_mass: '',
      water_percentage: '',
      visceral_fat: '',
      bone_mass: '',
      metabolic_age: '',
      notes: ''
    }
  })

  const [formData, setFormData] = useState<FormData>(initialFormState())

  // Carregar avaliação anterior
  useEffect(() => {
    if (isOpen && avaliacaoAnteriorId) {
      carregarAvaliacaoAnterior()
    }
  }, [isOpen, avaliacaoAnteriorId])

  // Calcular comparação automaticamente quando houver dados suficientes
  useEffect(() => {
    if (avaliacaoAnterior && (formData.data.weight || formData.data.body_fat_percentage)) {
      calcularComparacao()
    }
  }, [formData.data, avaliacaoAnterior])

  const carregarAvaliacaoAnterior = async () => {
    setCarregandoAnterior(true)
    try {
      const response = await fetch(
        `/api/nutri/clientes/${clienteId}/avaliacoes?limit=100`,
        { credentials: 'include' }
      )
      
      if (!response.ok) throw new Error('Erro ao carregar avaliação anterior')
      
      const data = await response.json()
      const avaliacoes = data.data?.assessments || []
      const anterior = avaliacoes.find((av: any) => av.id === avaliacaoAnteriorId)
      
      if (anterior) {
        setAvaliacaoAnterior(anterior)
        // Pré-preencher altura (geralmente não muda)
        if (anterior.data?.height) {
          setFormData(prev => ({
            ...prev,
            data: {
              ...prev.data,
              height: anterior.data.height.toString()
            }
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar avaliação anterior:', error)
      setErro('Não foi possível carregar os dados da avaliação anterior')
    } finally {
      setCarregandoAnterior(false)
    }
  }

  const calcularComparacao = () => {
    if (!avaliacaoAnterior) return

    const anterior = avaliacaoAnterior.data
    const atual = formData.data

    const comparacaoData: any = {}

    const campos = [
      'weight', 'bmi', 'body_fat_percentage', 'muscle_mass',
      'waist_circumference', 'hip_circumference', 'water_percentage',
      'visceral_fat'
    ]

    campos.forEach(campo => {
      const valorAnterior = anterior?.[campo]
      const valorAtual = atual[campo as keyof typeof atual]

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

    // Calcular dias entre avaliações
    const diasEntre = Math.floor(
      (new Date().getTime() - new Date(avaliacaoAnterior.created_at).getTime()) / 
      (1000 * 60 * 60 * 24)
    )

    comparacaoData.dias_entre_avaliacoes = diasEntre

    setComparacao(comparacaoData)
  }

  // Pedir insights da LYA sobre a comparação
  const pedirInsightsLya = async () => {
    if (!comparacao || !avaliacaoAnterior) return

    setLoadingLya(true)
    try {
      const resumoComparacao = Object.entries(comparacao)
        .filter(([key]) => key !== 'dias_entre_avaliacoes')
        .map(([key, value]: [string, any]) => {
          const label = key.replace(/_/g, ' ')
          const sinal = value.difference > 0 ? '+' : ''
          return `${label}: ${sinal}${value.difference} (${sinal}${value.percent_change}%)`
        })
        .join('\n')

      const prompt = `Analise esta reavaliação da cliente ${clienteNome}:

Tempo desde última avaliação: ${comparacao.dias_entre_avaliacoes} dias

Mudanças observadas:
${resumoComparacao}

Me forneça:
1. Interpretação das mudanças (positivas/negativas)
2. Insights sobre o progresso
3. Recomendações específicas baseadas nos resultados
4. Próximos passos sugeridos

Seja profissional, motivadora quando apropriado, e objetiva.`

      const response = await fetch('/api/nutri/lya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: prompt })
      })

      const data = await response.json()
      if (response.ok) {
        setLyaInsights(data.response || '')
        // Sugerir preencher interpretação com insights da LYA
        if (data.response && !formData.interpretation) {
          setFormData(prev => ({
            ...prev,
            interpretation: data.response
          }))
        }
      }
    } catch (error) {
      console.error('Erro ao pedir insights LYA:', error)
    } finally {
      setLoadingLya(false)
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith('data.')) {
      const field = name.replace('data.', '')
      setFormData(prev => {
        const updated = {
          ...prev,
          data: {
            ...prev.data,
            [field]: value
          }
        }

        // Auto-calcular IMC
        if (field === 'weight' || field === 'height') {
          const peso = parseFloat((field === 'weight' ? value : updated.data.weight || '').replace(',', '.'))
          const altura = parseFloat((field === 'height' ? value : updated.data.height || '').replace(',', '.'))
          if (!isNaN(peso) && !isNaN(altura) && altura > 0) {
            const bmi = (peso / (altura * altura)).toFixed(1)
            updated.data.bmi = bmi
          }
        }

        return updated
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const normalizeNumber = (value: string) => {
    if (!value) return null
    const parsed = parseFloat(value.replace(',', '.'))
    return isNaN(parsed) ? null : parsed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    try {
      const payload = {
        assessment_type: avaliacaoAnterior?.assessment_type || 'antropometrica',
        assessment_name: `Reavaliação #${(avaliacaoAnterior?.assessment_number || 0) + 1}`,
        status: formData.status,
        is_reevaluation: true,
        parent_assessment_id: avaliacaoAnteriorId,
        interpretation: formData.interpretation || null,
        recommendations: formData.recommendations || null,
        data: {
          measurement_date: formData.measurement_date,
          weight: normalizeNumber(formData.data.weight),
          height: normalizeNumber(formData.data.height),
          bmi: normalizeNumber(formData.data.bmi),
          waist_circumference: normalizeNumber(formData.data.waist_circumference),
          hip_circumference: normalizeNumber(formData.data.hip_circumference),
          chest_circumference: normalizeNumber(formData.data.chest_circumference),
          arm_circumference: normalizeNumber(formData.data.arm_circumference),
          thigh_circumference: normalizeNumber(formData.data.thigh_circumference),
          calf_circumference: normalizeNumber(formData.data.calf_circumference),
          neck_circumference: normalizeNumber(formData.data.neck_circumference),
          body_fat_percentage: normalizeNumber(formData.data.body_fat_percentage),
          muscle_mass: normalizeNumber(formData.data.muscle_mass),
          water_percentage: normalizeNumber(formData.data.water_percentage),
          visceral_fat: normalizeNumber(formData.data.visceral_fat),
          bone_mass: normalizeNumber(formData.data.bone_mass),
          metabolic_age: normalizeNumber(formData.data.metabolic_age),
          notes: formData.data.notes || null
        }
      }

      const response = await fetch(`/api/nutri/clientes/${clienteId}/avaliacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar reavaliação')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao salvar reavaliação:', error)
      setErro(error.message || 'Erro ao salvar reavaliação. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const renderComparacao = (campo: string, label: string, unidade: string) => {
    const comp = comparacao?.[campo]
    if (!comp) return null

    const isPositive = campo === 'muscle_mass' || campo === 'water_percentage'
    const isNegative = campo === 'body_fat_percentage' || campo === 'visceral_fat' || 
                       campo === 'waist_circumference' || campo === 'weight'
    
    const diff = comp.difference
    const isGood = (isPositive && diff > 0) || (isNegative && diff < 0)
    const isBad = (isPositive && diff < 0) || (isNegative && diff > 0)

    const colorClass = isGood ? 'text-green-600' : isBad ? 'text-red-600' : 'text-gray-600'
    const bgClass = isGood ? 'bg-green-50' : isBad ? 'bg-red-50' : 'bg-gray-50'
    const icon = diff > 0 ? '↑' : diff < 0 ? '↓' : '='

    return (
      <div className={`${bgClass} border rounded-lg p-3`}>
        <p className="text-xs text-gray-600 mb-1">{label}</p>
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-bold text-gray-900">
            {comp.current} {unidade}
          </p>
          <p className={`text-sm font-semibold ${colorClass}`}>
            {icon} {Math.abs(diff).toFixed(1)} {unidade}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Antes: {comp.old} {unidade} ({diff > 0 ? '+' : ''}{comp.percent_change}%)
        </p>
      </div>
    )
  }

  if (!isOpen) return null

  if (carregandoAnterior) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da avaliação anterior...</p>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: 'Novas Medidas' },
    { number: 2, title: 'Comparação' },
    { number: 3, title: 'Interpretação' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Nova Reavaliação 🔄</h2>
              <p className="text-purple-100 mt-1">
                Cliente: {clienteNome} • Avaliação #{(avaliacaoAnterior?.assessment_number || 0) + 1}
              </p>
              {avaliacaoAnterior && (
                <p className="text-purple-200 text-sm mt-1">
                  Comparando com avaliação de {new Date(avaliacaoAnterior.created_at).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-purple-700 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.number
                      ? 'bg-white text-purple-600'
                      : 'bg-purple-500 text-white opacity-50'
                  }`}>
                    {step.number}
                  </div>
                  <span className={`ml-3 text-sm font-medium hidden md:block ${
                    currentStep >= step.number ? 'text-white' : 'text-purple-200'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    currentStep > step.number ? 'bg-white' : 'bg-purple-500 opacity-30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{erro}</p>
            </div>
          )}

          {/* Step 1: Novas Medidas */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Dados da Avaliação Anterior</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {avaliacaoAnterior?.data?.weight && (
                    <div>
                      <span className="text-blue-600">Peso:</span> {avaliacaoAnterior.data.weight} kg
                    </div>
                  )}
                  {avaliacaoAnterior?.data?.bmi && (
                    <div>
                      <span className="text-blue-600">IMC:</span> {avaliacaoAnterior.data.bmi}
                    </div>
                  )}
                  {avaliacaoAnterior?.data?.body_fat_percentage && (
                    <div>
                      <span className="text-blue-600">% Gordura:</span> {avaliacaoAnterior.data.body_fat_percentage}%
                    </div>
                  )}
                  {avaliacaoAnterior?.data?.muscle_mass && (
                    <div>
                      <span className="text-blue-600">Massa Magra:</span> {avaliacaoAnterior.data.muscle_mass} kg
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data desta Reavaliação *
                  </label>
                  <input
                    type="date"
                    name="measurement_date"
                    value={formData.measurement_date}
                    onChange={handleFieldChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="completo">Completo</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Básicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      name="data.weight"
                      value={formData.data.weight}
                      onChange={handleFieldChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Altura (m) *</label>
                    <input
                      type="number"
                      step="0.01"
                      name="data.height"
                      value={formData.data.height}
                      onChange={handleFieldChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IMC</label>
                    <input
                      type="text"
                      name="data.bmi"
                      value={formData.data.bmi}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Circunferências & Composição</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Cintura (cm)', name: 'waist_circumference' },
                    { label: 'Quadril (cm)', name: 'hip_circumference' },
                    { label: '% Gordura', name: 'body_fat_percentage' },
                    { label: 'Massa Magra (kg)', name: 'muscle_mass' },
                    { label: '% Água', name: 'water_percentage' },
                    { label: 'Gordura Visceral', name: 'visceral_fat' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                      <input
                        type="number"
                        step="0.1"
                        name={`data.${field.name}`}
                        value={(formData.data as any)[field.name]}
                        onChange={handleFieldChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Comparação */}
          {currentStep === 2 && comparacao && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">📊 Comparação Automática</h3>
                <p className="text-gray-600 mb-4">
                  Comparando com avaliação de {new Date(avaliacaoAnterior!.created_at).toLocaleDateString('pt-BR')} 
                  ({comparacao.dias_entre_avaliacoes} dias atrás)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {renderComparacao('weight', 'Peso', 'kg')}
                  {renderComparacao('bmi', 'IMC', '')}
                  {renderComparacao('body_fat_percentage', '% Gordura', '%')}
                  {renderComparacao('muscle_mass', 'Massa Magra', 'kg')}
                  {renderComparacao('waist_circumference', 'Cintura', 'cm')}
                  {renderComparacao('hip_circumference', 'Quadril', 'cm')}
                  {renderComparacao('water_percentage', '% Água', '%')}
                  {renderComparacao('visceral_fat', 'Gordura Visceral', '')}
                </div>
              </div>

              {/* LYA Insights */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">LYA</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Insights da LYA sobre a Evolução</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Deixe a LYA analisar as mudanças e gerar insights profissionais automáticos
                    </p>
                    
                    {lyaInsights && (
                      <div className="bg-white rounded-lg p-4 mb-3 text-sm text-gray-700 whitespace-pre-line">
                        {lyaInsights}
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={pedirInsightsLya}
                      disabled={loadingLya}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      {loadingLya ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Analisando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Analisar Evolução com LYA
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interpretação */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interpretação / Análise da Evolução
                </label>
                <textarea
                  name="interpretation"
                  value={formData.interpretation}
                  onChange={handleFieldChange}
                  rows={8}
                  placeholder="Análise das mudanças observadas, pontos positivos, áreas de atenção..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recomendações / Ajustes no Plano
                </label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleFieldChange}
                  rows={8}
                  placeholder="Ajustes necessários, novas orientações, próximos objetivos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Internas
                </label>
                <textarea
                  name="data.notes"
                  value={formData.data.notes}
                  onChange={handleFieldChange}
                  rows={4}
                  placeholder="Observações privadas..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                ← Anterior
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Próximo →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={salvando}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {salvando && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Salvar Reavaliação
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
