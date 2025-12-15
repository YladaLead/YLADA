'use client'

import { useState, useEffect } from 'react'

interface FoodHabitsSectionProps {
  clientId: string
  initialData?: {
    water_intake_liters?: number | null
    breakfast?: string | null
    morning_snack?: string | null
    lunch?: string | null
    afternoon_snack?: string | null
    dinner?: string | null
    supper?: string | null
    snacks_between_meals?: boolean | null
    snacks_description?: string | null
    alcohol_consumption?: string | null
    soda_consumption?: string | null
  }
  editando: boolean
  onDataChange?: (data: any) => void
}

export default function FoodHabitsSection({ 
  clientId, 
  initialData, 
  editando,
  onDataChange 
}: FoodHabitsSectionProps) {
  const [formData, setFormData] = useState({
    water_intake_liters: initialData?.water_intake_liters?.toString() || '',
    breakfast: initialData?.breakfast || '',
    morning_snack: initialData?.morning_snack || '',
    lunch: initialData?.lunch || '',
    afternoon_snack: initialData?.afternoon_snack || '',
    dinner: initialData?.dinner || '',
    supper: initialData?.supper || '',
    snacks_between_meals: initialData?.snacks_between_meals || false,
    snacks_description: initialData?.snacks_description || '',
    alcohol_consumption: initialData?.alcohol_consumption || '',
    soda_consumption: initialData?.soda_consumption || ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        water_intake_liters: initialData.water_intake_liters?.toString() || '',
        breakfast: initialData.breakfast || '',
        morning_snack: initialData.morning_snack || '',
        lunch: initialData.lunch || '',
        afternoon_snack: initialData.afternoon_snack || '',
        dinner: initialData.dinner || '',
        supper: initialData.supper || '',
        snacks_between_meals: initialData.snacks_between_meals || false,
        snacks_description: initialData.snacks_description || '',
        alcohol_consumption: initialData.alcohol_consumption || '',
        soda_consumption: initialData.soda_consumption || ''
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    const newData = { ...formData, [name]: newValue }
    setFormData(newData)
    if (onDataChange) {
      onDataChange(newData)
    }
  }

  if (!editando) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hábitos Alimentares</h3>
        <div className="space-y-4">
          {formData.water_intake_liters && (
            <div>
              <p className="text-sm text-gray-600">Ingestão de Água</p>
              <p className="text-base font-medium text-gray-900">{formData.water_intake_liters} litros/dia</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.breakfast && (
              <div>
                <p className="text-sm text-gray-600">Café da Manhã</p>
                <p className="text-base text-gray-700">{formData.breakfast}</p>
              </div>
            )}
            {formData.morning_snack && (
              <div>
                <p className="text-sm text-gray-600">Lanche da Manhã</p>
                <p className="text-base text-gray-700">{formData.morning_snack}</p>
              </div>
            )}
            {formData.lunch && (
              <div>
                <p className="text-sm text-gray-600">Almoço</p>
                <p className="text-base text-gray-700">{formData.lunch}</p>
              </div>
            )}
            {formData.afternoon_snack && (
              <div>
                <p className="text-sm text-gray-600">Lanche da Tarde</p>
                <p className="text-base text-gray-700">{formData.afternoon_snack}</p>
              </div>
            )}
            {formData.dinner && (
              <div>
                <p className="text-sm text-gray-600">Jantar</p>
                <p className="text-base text-gray-700">{formData.dinner}</p>
              </div>
            )}
            {formData.supper && (
              <div>
                <p className="text-sm text-gray-600">Ceia</p>
                <p className="text-base text-gray-700">{formData.supper}</p>
              </div>
            )}
          </div>

          {formData.snacks_between_meals && (
            <div>
              <p className="text-sm text-gray-600">Beliscos Entre Refeições</p>
              <p className="text-base text-gray-700">
                {formData.snacks_description || 'Sim'}
              </p>
            </div>
          )}

          {formData.alcohol_consumption && (
            <div>
              <p className="text-sm text-gray-600">Consumo de Álcool</p>
              <p className="text-base text-gray-700">{formData.alcohol_consumption}</p>
            </div>
          )}

          {formData.soda_consumption && (
            <div>
              <p className="text-sm text-gray-600">Consumo de Refrigerante</p>
              <p className="text-base text-gray-700">{formData.soda_consumption}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hábitos Alimentares</h3>
      
      <div className="space-y-4">
        {/* Ingestão de Água */}
        <div>
          <label htmlFor="water_intake_liters" className="block text-sm font-medium text-gray-700 mb-2">
            Ingestão de Água (litros/dia)
          </label>
          <input
            type="number"
            id="water_intake_liters"
            name="water_intake_liters"
            value={formData.water_intake_liters}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="10"
            placeholder="Ex: 2.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Refeições */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="breakfast" className="block text-sm font-medium text-gray-700 mb-2">
              Café da Manhã
            </label>
            <textarea
              id="breakfast"
              name="breakfast"
              value={formData.breakfast}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva o que costuma comer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="morning_snack" className="block text-sm font-medium text-gray-700 mb-2">
              Lanche da Manhã
            </label>
            <textarea
              id="morning_snack"
              name="morning_snack"
              value={formData.morning_snack}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva o que costuma comer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="lunch" className="block text-sm font-medium text-gray-700 mb-2">
              Almoço
            </label>
            <textarea
              id="lunch"
              name="lunch"
              value={formData.lunch}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva o que costuma comer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="afternoon_snack" className="block text-sm font-medium text-gray-700 mb-2">
              Lanche da Tarde
            </label>
            <textarea
              id="afternoon_snack"
              name="afternoon_snack"
              value={formData.afternoon_snack}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva o que costuma comer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="dinner" className="block text-sm font-medium text-gray-700 mb-2">
              Jantar
            </label>
            <textarea
              id="dinner"
              name="dinner"
              value={formData.dinner}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva o que costuma comer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="supper" className="block text-sm font-medium text-gray-700 mb-2">
              Ceia
            </label>
            <textarea
              id="supper"
              name="supper"
              value={formData.supper}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva o que costuma comer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Beliscos */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              id="snacks_between_meals"
              name="snacks_between_meals"
              checked={formData.snacks_between_meals}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Belisca entre as refeições
            </span>
          </label>
          {formData.snacks_between_meals && (
            <textarea
              id="snacks_description"
              name="snacks_description"
              value={formData.snacks_description}
              onChange={handleChange}
              rows={2}
              placeholder="Descreva o que costuma beliscar..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          )}
        </div>

        {/* Bebidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="alcohol_consumption" className="block text-sm font-medium text-gray-700 mb-2">
              Consumo de Álcool
            </label>
            <input
              type="text"
              id="alcohol_consumption"
              name="alcohol_consumption"
              value={formData.alcohol_consumption}
              onChange={handleChange}
              placeholder="Ex: 2x por semana, Finais de semana"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="soda_consumption" className="block text-sm font-medium text-gray-700 mb-2">
              Consumo de Refrigerante
            </label>
            <input
              type="text"
              id="soda_consumption"
              name="soda_consumption"
              value={formData.soda_consumption}
              onChange={handleChange}
              placeholder="Ex: Diário, Raramente, Não consome"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
