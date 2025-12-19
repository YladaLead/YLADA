'use client'

import { useState, useEffect } from 'react'

interface NovaAvaliacaoModalProps {
  clienteId: string
  clienteNome: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  assessment_type: string
  assessment_name: string
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

export default function NovaAvaliacaoModal({
  clienteId,
  clienteNome,
  isOpen,
  onClose,
  onSuccess
}: NovaAvaliacaoModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [lyaSuggestions, setLyaSuggestions] = useState<string | null>(null)
  const [loadingLya, setLoadingLya] = useState(false)

  const initialFormState = (): FormData => ({
    assessment_type: 'antropometrica',
    assessment_name: '',
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

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormState())
      setCurrentStep(1)
      setErro(null)
      setLyaSuggestions(null)
    }
  }, [isOpen])

  if (!isOpen) return null

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
          } else {
            updated.data.bmi = ''
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

  // Pedir sugestões da LYA
  const pedirSugestoesLya = async () => {
    setLoadingLya(true)
    setLyaSuggestions(null)
    try {
      const dadosPreenchidos = Object.entries(formData.data)
        .filter(([_, value]) => value !== '')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')

      const prompt = `Estou fazendo uma avaliação antropométrica da cliente ${clienteNome}. 
Dados já preenchidos: ${dadosPreenchidos || 'nenhum ainda'}.

Me ajude com sugestões de:
1. Campos importantes que ainda não preenchi
2. Valores de referência para os dados já coletados
3. Pontos de atenção nesta avaliação

Seja breve e prática.`

      const response = await fetch('/api/nutri/lya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: prompt })
      })

      const data = await response.json()
      if (response.ok) {
        setLyaSuggestions(data.response || 'Não consegui gerar sugestões no momento.')
      } else {
        setLyaSuggestions('Erro ao carregar sugestões da LYA.')
      }
    } catch (error) {
      console.error('Erro ao pedir sugestões LYA:', error)
      setLyaSuggestions('Erro ao conectar com a LYA.')
    } finally {
      setLoadingLya(false)
    }
  }

  // Pedir interpretação da LYA
  const pedirInterpretacaoLya = async () => {
    setLoadingLya(true)
    try {
      const dadosCompletos = {
        peso: formData.data.weight,
        altura: formData.data.height,
        imc: formData.data.bmi,
        gordura_corporal: formData.data.body_fat_percentage,
        massa_magra: formData.data.muscle_mass,
        circunferencias: {
          cintura: formData.data.waist_circumference,
          quadril: formData.data.hip_circumference
        }
      }

      const prompt = `Analise esta avaliação antropométrica da cliente ${clienteNome}:

${JSON.stringify(dadosCompletos, null, 2)}

Me forneça:
1. Interpretação dos resultados
2. Classificações (IMC, % gordura, etc)
3. Principais insights
4. Recomendações práticas

Seja profissional, clara e objetiva.`

      const response = await fetch('/api/nutri/lya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: prompt })
      })

      const data = await response.json()
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          interpretation: data.response || ''
        }))
      }
    } catch (error) {
      console.error('Erro ao pedir interpretação LYA:', error)
    } finally {
      setLoadingLya(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    try {
      const payload = {
        assessment_type: formData.assessment_type,
        assessment_name: formData.assessment_name || null,
        status: formData.status,
        is_reevaluation: false,
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
        throw new Error(data.error || 'Erro ao salvar avaliação')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao salvar avaliação:', error)
      setErro(error.message || 'Erro ao salvar avaliação. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const steps = [
    { number: 1, title: 'Informações Básicas' },
    { number: 2, title: 'Medidas Corporais' },
    { number: 3, title: 'Composição Corporal' },
    { number: 4, title: 'Interpretação & Recomendações' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Nova Avaliação Antropométrica</h2>
              <p className="text-blue-100 mt-1">Cliente: {clienteNome}</p>
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

          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step.number
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500 text-white opacity-50'
                  }`}>
                    {step.number}
                  </div>
                  <span className={`ml-3 text-sm font-medium hidden md:block ${
                    currentStep >= step.number ? 'text-white' : 'text-blue-200'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    currentStep > step.number ? 'bg-white' : 'bg-blue-500 opacity-30'
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

          {/* Step 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Avaliação *
                  </label>
                  <select
                    name="assessment_type"
                    value={formData.assessment_type}
                    onChange={handleFieldChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="antropometrica">Antropométrica</option>
                    <option value="bioimpedancia">Bioimpedância</option>
                    <option value="anamnese">Anamnese</option>
                    <option value="questionario">Questionário</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome / Identificação
                  </label>
                  <input
                    type="text"
                    name="assessment_name"
                    value={formData.assessment_name}
                    onChange={handleFieldChange}
                    placeholder="Ex: Avaliação Inicial - Janeiro 2025"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data da Avaliação *
                  </label>
                  <input
                    type="date"
                    name="measurement_date"
                    value={formData.measurement_date}
                    onChange={handleFieldChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="completo">Completo</option>
                  </select>
                </div>
              </div>

              {/* LYA Suggestions */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">LYA</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Ajuda da LYA</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Precisa de sugestões sobre quais medidas coletar ou valores de referência?
                      </p>
                      {lyaSuggestions && (
                        <div className="bg-white rounded-lg p-3 mb-3 text-sm text-gray-700 whitespace-pre-line">
                          {lyaSuggestions}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={pedirSugestoesLya}
                        disabled={loadingLya}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                      >
                        {loadingLya ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Consultando LYA...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            Pedir Sugestões da LYA
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Medidas Corporais */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Básicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Peso (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="data.weight"
                      value={formData.data.weight}
                      onChange={handleFieldChange}
                      placeholder="Ex: 68.5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altura (m) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="data.height"
                      value={formData.data.height}
                      onChange={handleFieldChange}
                      placeholder="Ex: 1.65"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IMC (calculado)
                    </label>
                    <input
                      type="text"
                      name="data.bmi"
                      value={formData.data.bmi}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-600"
                      placeholder="Auto-calculado"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Circunferências (cm)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Cintura', name: 'waist_circumference', placeholder: '82' },
                    { label: 'Quadril', name: 'hip_circumference', placeholder: '98' },
                    { label: 'Pescoço', name: 'neck_circumference', placeholder: '34' },
                    { label: 'Peitoral', name: 'chest_circumference', placeholder: '95' },
                    { label: 'Braço', name: 'arm_circumference', placeholder: '28' },
                    { label: 'Coxa', name: 'thigh_circumference', placeholder: '52' },
                    { label: 'Panturrilha', name: 'calf_circumference', placeholder: '36' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name={`data.${field.name}`}
                        value={(formData.data as any)[field.name]}
                        onChange={handleFieldChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Composição Corporal */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Composição Corporal</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: '% Gordura Corporal', name: 'body_fat_percentage', placeholder: '28.5' },
                    { label: 'Massa Magra (kg)', name: 'muscle_mass', placeholder: '48' },
                    { label: 'Massa Óssea (kg)', name: 'bone_mass', placeholder: '2.4' },
                    { label: '% Água', name: 'water_percentage', placeholder: '52' },
                    { label: 'Gordura Visceral', name: 'visceral_fat', placeholder: '6' },
                    { label: 'Idade Metabólica', name: 'metabolic_age', placeholder: '32' }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name={`data.${field.name}`}
                        value={(formData.data as any)[field.name]}
                        onChange={handleFieldChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
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
                  placeholder="Observações privadas sobre esta avaliação..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Interpretação & Recomendações */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* LYA Interpretation */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">LYA</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Interpretação da LYA</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Deixe a LYA analisar os dados e gerar uma interpretação profissional automática
                    </p>
                    <button
                      type="button"
                      onClick={pedirInterpretacaoLya}
                      disabled={loadingLya || !formData.data.weight || !formData.data.height}
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
                          Gerar Interpretação com LYA
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interpretação / Análise dos Resultados
                </label>
                <textarea
                  name="interpretation"
                  value={formData.interpretation}
                  onChange={handleFieldChange}
                  rows={6}
                  placeholder="Análise dos dados da avaliação, classificações, pontos de atenção..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recomendações / Próximos Passos
                </label>
                <textarea
                  name="recommendations"
                  value={formData.recommendations}
                  onChange={handleFieldChange}
                  rows={6}
                  placeholder="Orientações nutricionais, ajustes no plano, próximas ações..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ← Anterior
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Próximo →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={salvando}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {salvando && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Salvar Avaliação
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

