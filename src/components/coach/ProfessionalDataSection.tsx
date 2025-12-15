'use client'

import { useState, useEffect } from 'react'

interface ProfessionalDataSectionProps {
  clientId: string
  initialData?: {
    occupation?: string | null
    work_start_time?: string | null
    work_end_time?: string | null
    wake_time?: string | null
    sleep_time?: string | null
    who_cooks?: string | null
    household_members?: string | null
    takes_lunchbox?: boolean | null
  }
  editando: boolean
  onDataChange?: (data: any) => void
}

export default function ProfessionalDataSection({ 
  clientId, 
  initialData, 
  editando,
  onDataChange 
}: ProfessionalDataSectionProps) {
  const [formData, setFormData] = useState({
    occupation: initialData?.occupation || '',
    work_start_time: initialData?.work_start_time || '',
    work_end_time: initialData?.work_end_time || '',
    wake_time: initialData?.wake_time || '',
    sleep_time: initialData?.sleep_time || '',
    who_cooks: initialData?.who_cooks || '',
    household_members: initialData?.household_members || '',
    takes_lunchbox: initialData?.takes_lunchbox || false
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        occupation: initialData.occupation || '',
        work_start_time: initialData.work_start_time || '',
        work_end_time: initialData.work_end_time || '',
        wake_time: initialData.wake_time || '',
        sleep_time: initialData.sleep_time || '',
        who_cooks: initialData.who_cooks || '',
        household_members: initialData.household_members || '',
        takes_lunchbox: initialData.takes_lunchbox || false
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    const newData = { ...formData, [name]: newValue }
    setFormData(newData)
    if (onDataChange) {
      onDataChange(newData)
    }
  }

  const formatTime = (time: string | null) => {
    if (!time) return '-'
    // Se já está no formato HH:mm, retornar
    if (time.includes(':')) return time
    // Se for apenas hora, adicionar :00
    return time.length === 2 ? `${time}:00` : time
  }

  if (!editando) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Profissionais e Rotina</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.occupation && (
            <div>
              <p className="text-sm text-gray-600">Profissão</p>
              <p className="text-base font-medium text-gray-900">{formData.occupation}</p>
            </div>
          )}
          {formData.work_start_time && (
            <div>
              <p className="text-sm text-gray-600">Horário de Início do Trabalho</p>
              <p className="text-base font-medium text-gray-900">{formatTime(formData.work_start_time)}</p>
            </div>
          )}
          {formData.work_end_time && (
            <div>
              <p className="text-sm text-gray-600">Horário de Término do Trabalho</p>
              <p className="text-base font-medium text-gray-900">{formatTime(formData.work_end_time)}</p>
            </div>
          )}
          {formData.wake_time && (
            <div>
              <p className="text-sm text-gray-600">Horário que Acorda</p>
              <p className="text-base font-medium text-gray-900">{formatTime(formData.wake_time)}</p>
            </div>
          )}
          {formData.sleep_time && (
            <div>
              <p className="text-sm text-gray-600">Horário que Dorme</p>
              <p className="text-base font-medium text-gray-900">{formatTime(formData.sleep_time)}</p>
            </div>
          )}
          {formData.who_cooks && (
            <div>
              <p className="text-sm text-gray-600">Quem Cozinha</p>
              <p className="text-base font-medium text-gray-900">{formData.who_cooks}</p>
            </div>
          )}
          {formData.household_members && (
            <div>
              <p className="text-sm text-gray-600">Quem Vive na Casa</p>
              <p className="text-base font-medium text-gray-900">{formData.household_members}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Leva Marmita</p>
            <p className="text-base font-medium text-gray-900">
              {formData.takes_lunchbox ? 'Sim' : 'Não'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Profissionais e Rotina</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profissão */}
        <div>
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
            Profissão / Área de Atuação
          </label>
          <input
            type="text"
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Ex: Engenheira, Professora, Empresária"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Horário de Início do Trabalho */}
        <div>
          <label htmlFor="work_start_time" className="block text-sm font-medium text-gray-700 mb-2">
            Horário de Início do Trabalho
          </label>
          <input
            type="time"
            id="work_start_time"
            name="work_start_time"
            value={formData.work_start_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Horário de Término do Trabalho */}
        <div>
          <label htmlFor="work_end_time" className="block text-sm font-medium text-gray-700 mb-2">
            Horário de Término do Trabalho
          </label>
          <input
            type="time"
            id="work_end_time"
            name="work_end_time"
            value={formData.work_end_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Horário que Acorda */}
        <div>
          <label htmlFor="wake_time" className="block text-sm font-medium text-gray-700 mb-2">
            Horário que Acorda
          </label>
          <input
            type="time"
            id="wake_time"
            name="wake_time"
            value={formData.wake_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Horário que Dorme */}
        <div>
          <label htmlFor="sleep_time" className="block text-sm font-medium text-gray-700 mb-2">
            Horário que Dorme
          </label>
          <input
            type="time"
            id="sleep_time"
            name="sleep_time"
            value={formData.sleep_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Quem Cozinha */}
        <div>
          <label htmlFor="who_cooks" className="block text-sm font-medium text-gray-700 mb-2">
            Quem Cozinha em Casa
          </label>
          <input
            type="text"
            id="who_cooks"
            name="who_cooks"
            value={formData.who_cooks}
            onChange={handleChange}
            placeholder="Ex: Eu mesma, Marido, Empregada"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Quem Vive na Casa */}
        <div>
          <label htmlFor="household_members" className="block text-sm font-medium text-gray-700 mb-2">
            Quem Vive na Casa
          </label>
          <input
            type="text"
            id="household_members"
            name="household_members"
            value={formData.household_members}
            onChange={handleChange}
            placeholder="Ex: Eu, Marido, 2 filhos"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Leva Marmita */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="takes_lunchbox"
              name="takes_lunchbox"
              checked={formData.takes_lunchbox}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Leva marmita para o trabalho
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
