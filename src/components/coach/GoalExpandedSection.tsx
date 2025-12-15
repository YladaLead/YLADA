'use client'

import { useState, useEffect } from 'react'

interface GoalExpandedSectionProps {
  clientId: string
  initialData?: {
    current_weight?: number | null
    current_height?: number | null
    goal_weight?: number | null
    goal_deadline?: string | null
    goal_type?: string | null
    goal?: string | null
  }
  editando: boolean
  onDataChange?: (data: any) => void
}

export default function GoalExpandedSection({ 
  clientId, 
  initialData, 
  editando,
  onDataChange 
}: GoalExpandedSectionProps) {
  const [formData, setFormData] = useState({
    current_weight: initialData?.current_weight?.toString() || '',
    current_height: initialData?.current_height?.toString() || '',
    goal_weight: initialData?.goal_weight?.toString() || '',
    goal_deadline: initialData?.goal_deadline || '',
    goal_type: initialData?.goal_type || '',
    goal: initialData?.goal || ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        current_weight: initialData.current_weight?.toString() || '',
        current_height: initialData.current_height?.toString() || '',
        goal_weight: initialData.goal_weight?.toString() || '',
        goal_deadline: initialData.goal_deadline || '',
        goal_type: initialData.goal_type || '',
        goal: initialData.goal || ''
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    if (onDataChange) {
      onDataChange(newData)
    }
  }

  if (!editando) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivo e Meta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialData?.goal && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Objetivo da Cliente</p>
              <p className="text-base text-gray-700 mt-1">{initialData.goal}</p>
            </div>
          )}
          {initialData?.goal_type && (
            <div>
              <p className="text-sm text-gray-600">Tipo de Objetivo</p>
              <p className="text-base font-medium text-gray-900 capitalize">
                {initialData.goal_type.replace('_', ' ')}
              </p>
            </div>
          )}
          {initialData?.current_weight && (
            <div>
              <p className="text-sm text-gray-600">Peso Atual</p>
              <p className="text-base font-medium text-gray-900">{initialData.current_weight} kg</p>
            </div>
          )}
          {initialData?.current_height && (
            <div>
              <p className="text-sm text-gray-600">Altura</p>
              <p className="text-base font-medium text-gray-900">{initialData.current_height} m</p>
            </div>
          )}
          {initialData?.current_weight && initialData?.current_height && (
            <div>
              <p className="text-sm text-gray-600">IMC Atual</p>
              <p className="text-base font-medium text-gray-900">
                {(initialData.current_weight / (initialData.current_height * initialData.current_height)).toFixed(1)}
              </p>
            </div>
          )}
          {initialData?.goal_weight && (
            <div>
              <p className="text-sm text-gray-600">Meta de Peso</p>
              <p className="text-base font-medium text-gray-900">{initialData.goal_weight} kg</p>
            </div>
          )}
          {initialData?.goal_deadline && (
            <div>
              <p className="text-sm text-gray-600">Prazo para Meta</p>
              <p className="text-base font-medium text-gray-900">
                {new Date(initialData.goal_deadline).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivo e Meta</h3>
      
      {/* Objetivo textual */}
      <div className="mb-4">
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
          Objetivo da Cliente
        </label>
        <textarea
          id="goal"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          rows={3}
          placeholder="Descreva o objetivo principal da cliente..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Objetivo */}
        <div>
          <label htmlFor="goal_type" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Objetivo
          </label>
          <select
            id="goal_type"
            name="goal_type"
            value={formData.goal_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Selecione</option>
            <option value="emagrecimento">Emagrecimento</option>
            <option value="ganho_massa">Ganho de Massa Muscular</option>
            <option value="saude">Saúde Geral</option>
            <option value="estetica">Estética</option>
            <option value="energia">Mais Energia</option>
            <option value="qualidade_vida">Qualidade de Vida</option>
          </select>
        </div>

        {/* Prazo para Meta */}
        <div>
          <label htmlFor="goal_deadline" className="block text-sm font-medium text-gray-700 mb-2">
            Prazo para Meta
          </label>
          <input
            type="date"
            id="goal_deadline"
            name="goal_deadline"
            value={formData.goal_deadline}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Peso Atual */}
        <div>
          <label htmlFor="current_weight" className="block text-sm font-medium text-gray-700 mb-2">
            Peso Atual (kg)
          </label>
          <input
            type="number"
            id="current_weight"
            name="current_weight"
            value={formData.current_weight}
            onChange={handleChange}
            step="0.1"
            min="0"
            placeholder="Ex: 70.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Altura */}
        <div>
          <label htmlFor="current_height" className="block text-sm font-medium text-gray-700 mb-2">
            Altura (m)
          </label>
          <input
            type="number"
            id="current_height"
            name="current_height"
            value={formData.current_height}
            onChange={handleChange}
            step="0.01"
            min="0"
            max="3"
            placeholder="Ex: 1.65"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Meta de Peso */}
        <div>
          <label htmlFor="goal_weight" className="block text-sm font-medium text-gray-700 mb-2">
            Meta de Peso (kg)
          </label>
          <input
            type="number"
            id="goal_weight"
            name="goal_weight"
            value={formData.goal_weight}
            onChange={handleChange}
            step="0.1"
            min="0"
            placeholder="Ex: 65.0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* IMC Calculado (readonly) */}
        {formData.current_weight && formData.current_height && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IMC Atual
            </label>
            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
              {(
                parseFloat(formData.current_weight) / 
                (parseFloat(formData.current_height) * parseFloat(formData.current_height))
              ).toFixed(1)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
