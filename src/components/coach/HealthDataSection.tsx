'use client'

import { useState, useEffect } from 'react'

interface HealthDataSectionProps {
  clientId: string
  initialData?: {
    health_problems?: string[] | null
    medications?: Array<{ name: string; dose?: string }> | null
    dietary_restrictions?: string[] | null
    supplements_current?: string[] | null
    supplements_recommended?: string[] | null
  }
  editando: boolean
  onDataChange?: (data: any) => void
}

export default function HealthDataSection({ 
  clientId, 
  initialData, 
  editando,
  onDataChange 
}: HealthDataSectionProps) {
  const [formData, setFormData] = useState({
    health_problems: initialData?.health_problems?.join(', ') || '',
    medications: initialData?.medications || [],
    dietary_restrictions: initialData?.dietary_restrictions?.join(', ') || '',
    supplements_current: initialData?.supplements_current?.join(', ') || '',
    supplements_recommended: initialData?.supplements_recommended?.join(', ') || ''
  })

  const [newMedication, setNewMedication] = useState({ name: '', dose: '' })

  useEffect(() => {
    if (initialData) {
      setFormData({
        health_problems: initialData.health_problems?.join(', ') || '',
        medications: initialData.medications || [],
        dietary_restrictions: initialData.dietary_restrictions?.join(', ') || '',
        supplements_current: initialData.supplements_current?.join(', ') || '',
        supplements_recommended: initialData.supplements_recommended?.join(', ') || ''
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    if (onDataChange) {
      onDataChange({
        ...newData,
        medications: formData.medications
      })
    }
  }

  const addMedication = () => {
    if (newMedication.name.trim()) {
      const updated = [...formData.medications, { 
        name: newMedication.name.trim(), 
        dose: newMedication.dose.trim() || undefined 
      }]
      const newData = { ...formData, medications: updated }
      setFormData(newData)
      setNewMedication({ name: '', dose: '' })
      if (onDataChange) {
        onDataChange(newData)
      }
    }
  }

  const removeMedication = (index: number) => {
    const updated = formData.medications.filter((_, i) => i !== index)
    const newData = { ...formData, medications: updated }
    setFormData(newData)
    if (onDataChange) {
      onDataChange(newData)
    }
  }

  if (!editando) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saúde Geral</h3>
        <div className="space-y-4">
          {formData.health_problems && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Problemas de Saúde</p>
              <p className="text-base text-gray-700">{formData.health_problems}</p>
            </div>
          )}
          {formData.medications && formData.medications.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Medicamentos</p>
              <div className="space-y-1">
                {formData.medications.map((med, index) => (
                  <p key={index} className="text-base text-gray-700">
                    • {med.name}{med.dose ? ` - ${med.dose}` : ''}
                  </p>
                ))}
              </div>
            </div>
          )}
          {formData.dietary_restrictions && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Restrições Alimentares</p>
              <p className="text-base text-gray-700">{formData.dietary_restrictions}</p>
            </div>
          )}
          {formData.supplements_current && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Suplementos em Uso</p>
              <p className="text-base text-gray-700">{formData.supplements_current}</p>
            </div>
          )}
          {formData.supplements_recommended && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Suplementos Recomendados</p>
              <p className="text-base text-gray-700">{formData.supplements_recommended}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Saúde Geral</h3>
      
      <div className="space-y-4">
        {/* Problemas de Saúde */}
        <div>
          <label htmlFor="health_problems" className="block text-sm font-medium text-gray-700 mb-2">
            Problemas de Saúde
          </label>
          <input
            type="text"
            id="health_problems"
            name="health_problems"
            value={formData.health_problems}
            onChange={handleChange}
            placeholder="Ex: Hipertensão, Diabetes, Ansiedade (separados por vírgula)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">Separe múltiplos problemas por vírgula</p>
        </div>

        {/* Medicamentos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medicamentos
          </label>
          {formData.medications.length > 0 && (
            <div className="mb-2 space-y-2">
              {formData.medications.map((med, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <span className="flex-1 text-sm text-gray-700">
                    {med.name}{med.dose ? ` - ${med.dose}` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMedication.name}
              onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              placeholder="Nome do medicamento"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
            />
            <input
              type="text"
              value={newMedication.dose}
              onChange={(e) => setNewMedication({ ...newMedication, dose: e.target.value })}
              placeholder="Dose (opcional)"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
            />
            <button
              type="button"
              onClick={addMedication}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Restrições Alimentares */}
        <div>
          <label htmlFor="dietary_restrictions" className="block text-sm font-medium text-gray-700 mb-2">
            Restrições Alimentares
          </label>
          <input
            type="text"
            id="dietary_restrictions"
            name="dietary_restrictions"
            value={formData.dietary_restrictions}
            onChange={handleChange}
            placeholder="Ex: Lactose, Glúten, Vegana (separados por vírgula)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">Intolerâncias, alergias ou preferências alimentares</p>
        </div>

        {/* Suplementos em Uso */}
        <div>
          <label htmlFor="supplements_current" className="block text-sm font-medium text-gray-700 mb-2">
            Suplementos em Uso
          </label>
          <input
            type="text"
            id="supplements_current"
            name="supplements_current"
            value={formData.supplements_current}
            onChange={handleChange}
            placeholder="Ex: Whey Protein, Vitamina D, Ômega 3 (separados por vírgula)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Suplementos Recomendados */}
        <div>
          <label htmlFor="supplements_recommended" className="block text-sm font-medium text-gray-700 mb-2">
            Suplementos Recomendados
          </label>
          <input
            type="text"
            id="supplements_recommended"
            name="supplements_recommended"
            value={formData.supplements_recommended}
            onChange={handleChange}
            placeholder="Ex: Creatina, Multivitamínico (separados por vírgula)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  )
}
