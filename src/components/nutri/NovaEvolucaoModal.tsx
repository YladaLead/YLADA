'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface NovaEvolucaoModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  onSuccess: () => void
  onLyaInsight?: (message: string) => void
}

export default function NovaEvolucaoModal({
  isOpen,
  onClose,
  clientId,
  onSuccess,
  onLyaInsight
}: NovaEvolucaoModalProps) {
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    measurement_date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    waist_circumference: '',
    hip_circumference: '',
    neck_circumference: '',
    chest_circumference: '',
    arm_circumference: '',
    thigh_circumference: '',
    body_fat_percentage: '',
    muscle_mass: '',
    bone_mass: '',
    water_percentage: '',
    visceral_fat: '',
    notes: ''
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        measurement_date: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
        waist_circumference: '',
        hip_circumference: '',
        neck_circumference: '',
        chest_circumference: '',
        arm_circumference: '',
        thigh_circumference: '',
        body_fat_percentage: '',
        muscle_mass: '',
        bone_mass: '',
        water_percentage: '',
        visceral_fat: '',
        notes: ''
      })
      setErro(null)
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    try {
      const payload: any = {
        measurement_date: formData.measurement_date,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        waist_circumference: formData.waist_circumference ? parseFloat(formData.waist_circumference) : null,
        hip_circumference: formData.hip_circumference ? parseFloat(formData.hip_circumference) : null,
        neck_circumference: formData.neck_circumference ? parseFloat(formData.neck_circumference) : null,
        chest_circumference: formData.chest_circumference ? parseFloat(formData.chest_circumference) : null,
        arm_circumference: formData.arm_circumference ? parseFloat(formData.arm_circumference) : null,
        thigh_circumference: formData.thigh_circumference ? parseFloat(formData.thigh_circumference) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
        bone_mass: formData.bone_mass ? parseFloat(formData.bone_mass) : null,
        water_percentage: formData.water_percentage ? parseFloat(formData.water_percentage) : null,
        visceral_fat: formData.visceral_fat ? parseFloat(formData.visceral_fat) : null,
        notes: formData.notes || null
      }

      // Validação mínima
      if (!payload.weight) {
        setErro('O peso é obrigatório')
        return
      }

      const response = await fetch(`/api/nutri/clientes/${clientId}/evolucao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar registro de evolução')
      }

      if (data.success) {
        // Notificar LYA sobre a nova evolução
        if (onLyaInsight && payload.weight) {
          const insight = generateInsight(payload)
          setTimeout(() => onLyaInsight(insight), 500)
        }

        onSuccess()
        onClose()
      }
    } catch (error: any) {
      console.error('Erro ao criar evolução:', error)
      setErro(error.message || 'Erro ao criar registro de evolução. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  // Gerar insight para a LYA
  const generateInsight = (data: any): string => {
    const insights = []
    
    if (data.weight) {
      insights.push(`Novo registro de peso: ${data.weight}kg`)
    }
    
    if (data.body_fat_percentage) {
      insights.push(`Percentual de gordura: ${data.body_fat_percentage}%`)
    }
    
    if (data.muscle_mass) {
      insights.push(`Massa muscular: ${data.muscle_mass}kg`)
    }

    return `Acabei de registrar uma nova evolução! ${insights.join(', ')}. Me ajuda a interpretar esses dados e sugerir próximos passos?`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Nova Medição</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{erro}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Data da Medição */}
            <div>
              <label htmlFor="measurement_date" className="block text-sm font-semibold text-gray-700 mb-2">
                Data da Medição *
              </label>
              <input
                type="date"
                id="measurement_date"
                name="measurement_date"
                value={formData.measurement_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            </div>

            {/* Dados Básicos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Básicos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    required
                    placeholder="Ex: 70.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (m)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="Ex: 1.70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Circunferências */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Circunferências (cm)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="neck_circumference" className="block text-sm font-medium text-gray-700 mb-2">
                    Pescoço
                  </label>
                  <input
                    type="number"
                    id="neck_circumference"
                    name="neck_circumference"
                    value={formData.neck_circumference}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 35.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="chest_circumference" className="block text-sm font-medium text-gray-700 mb-2">
                    Peitoral
                  </label>
                  <input
                    type="number"
                    id="chest_circumference"
                    name="chest_circumference"
                    value={formData.chest_circumference}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 95.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="waist_circumference" className="block text-sm font-medium text-gray-700 mb-2">
                    Cintura
                  </label>
                  <input
                    type="number"
                    id="waist_circumference"
                    name="waist_circumference"
                    value={formData.waist_circumference}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 80.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="hip_circumference" className="block text-sm font-medium text-gray-700 mb-2">
                    Quadril
                  </label>
                  <input
                    type="number"
                    id="hip_circumference"
                    name="hip_circumference"
                    value={formData.hip_circumference}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 100.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="arm_circumference" className="block text-sm font-medium text-gray-700 mb-2">
                    Braço
                  </label>
                  <input
                    type="number"
                    id="arm_circumference"
                    name="arm_circumference"
                    value={formData.arm_circumference}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 30.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="thigh_circumference" className="block text-sm font-medium text-gray-700 mb-2">
                    Coxa
                  </label>
                  <input
                    type="number"
                    id="thigh_circumference"
                    name="thigh_circumference"
                    value={formData.thigh_circumference}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 55.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Composição Corporal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Composição Corporal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="body_fat_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                    % Gordura Corporal
                  </label>
                  <input
                    type="number"
                    id="body_fat_percentage"
                    name="body_fat_percentage"
                    value={formData.body_fat_percentage}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="Ex: 25.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="muscle_mass" className="block text-sm font-medium text-gray-700 mb-2">
                    Massa Muscular (kg)
                  </label>
                  <input
                    type="number"
                    id="muscle_mass"
                    name="muscle_mass"
                    value={formData.muscle_mass}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 45.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="bone_mass" className="block text-sm font-medium text-gray-700 mb-2">
                    Massa Óssea (kg)
                  </label>
                  <input
                    type="number"
                    id="bone_mass"
                    name="bone_mass"
                    value={formData.bone_mass}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 3.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="water_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                    % Água
                  </label>
                  <input
                    type="number"
                    id="water_percentage"
                    name="water_percentage"
                    value={formData.water_percentage}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="Ex: 55.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="visceral_fat" className="block text-sm font-medium text-gray-700 mb-2">
                    Gordura Visceral
                  </label>
                  <input
                    type="number"
                    id="visceral_fat"
                    name="visceral_fat"
                    value={formData.visceral_fat}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="Ex: 8.0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Adicione observações sobre esta medição..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? 'Salvando...' : 'Salvar Medição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
