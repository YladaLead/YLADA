'use client'

import { useState, useEffect } from 'react'

interface DigestionDataSectionProps {
  clientId: string
  initialData?: {
    bowel_function?: string | null
    digestive_complaints?: string[] | null
  }
  editando: boolean
  onDataChange?: (data: any) => void
}

export default function DigestionDataSection({ 
  clientId, 
  initialData, 
  editando,
  onDataChange 
}: DigestionDataSectionProps) {
  const [formData, setFormData] = useState({
    bowel_function: initialData?.bowel_function || '',
    digestive_complaints: initialData?.digestive_complaints?.join(', ') || ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        bowel_function: initialData.bowel_function || '',
        digestive_complaints: initialData.digestive_complaints?.join(', ') || ''
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    if (onDataChange) {
      onDataChange(newData)
    }
  }

  const getBowelFunctionLabel = (value: string) => {
    const labels: Record<string, string> = {
      'diario': 'Diário',
      'dias_alternados': 'Dias Alternados',
      'constipacao': 'Constipação',
      'diarreia': 'Diarreia'
    }
    return labels[value] || value
  }

  if (!editando) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Intestino e Digestão</h3>
        <div className="space-y-4">
          {formData.bowel_function && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Funcionamento Intestinal</p>
              <p className="text-base font-medium text-gray-900">
                {getBowelFunctionLabel(formData.bowel_function)}
              </p>
            </div>
          )}
          {formData.digestive_complaints && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Queixas Digestivas</p>
              <p className="text-base text-gray-700">{formData.digestive_complaints}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Intestino e Digestão</h3>
      
      <div className="space-y-4">
        {/* Funcionamento Intestinal */}
        <div>
          <label htmlFor="bowel_function" className="block text-sm font-medium text-gray-700 mb-2">
            Funcionamento Intestinal
          </label>
          <select
            id="bowel_function"
            name="bowel_function"
            value={formData.bowel_function}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Selecione</option>
            <option value="diario">Diário</option>
            <option value="dias_alternados">Dias Alternados</option>
            <option value="constipacao">Constipação</option>
            <option value="diarreia">Diarreia</option>
          </select>
        </div>

        {/* Queixas Digestivas */}
        <div>
          <label htmlFor="digestive_complaints" className="block text-sm font-medium text-gray-700 mb-2">
            Queixas Digestivas
          </label>
          <input
            type="text"
            id="digestive_complaints"
            name="digestive_complaints"
            value={formData.digestive_complaints}
            onChange={handleChange}
            placeholder="Ex: Estufamento, Gases, Refluxo, Dor Abdominal (separados por vírgula)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">Separe múltiplas queixas por vírgula</p>
        </div>
      </div>
    </div>
  )
}
