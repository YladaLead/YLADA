'use client'

import { useState } from 'react'
import { ArrowLeft, Brain, CheckCircle, Droplets, Sun, Activity } from 'lucide-react'

export default function HydrationDemoPage() {
  const [formData, setFormData] = useState({
    weight: '',
    age: '',
    gender: 'masculino',
    activity: 'moderate',
    climate: 'temperate',
    exerciseDuration: '',
    exerciseIntensity: 'moderate'
  })
  const [result, setResult] = useState<{
    totalWater: number
    hourlyIntake: number
    morningIntake: number
    afternoonIntake: number
    eveningIntake: number
    dehydrationSigns: string[]
    hydrationTips: string[]
    hydratingFoods: string[]
  } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const calculateHydration = () => {
    const weight = parseFloat(formData.weight)
    const age = parseInt(formData.age)
    const exerciseDuration = parseFloat(formData.exerciseDuration) || 0
    
    // Cálculo base de água (ml/kg)
    let baseWaterPerKg = 35 // ml por kg de peso corporal
    
    // Ajustes por idade
    if (age > 65) baseWaterPerKg = 30
    if (age < 18) baseWaterPerKg = 40
    
    // Ajustes por gênero
    if (formData.gender === 'feminino') baseWaterPerKg = baseWaterPerKg * 0.9
    
    // Cálculo base
    let totalWater = weight * baseWaterPerKg
    
    // Ajustes por atividade
    const activityMultipliers = {
      'sedentary': 1.0,
      'light': 1.1,
      'moderate': 1.2,
      'active': 1.3,
      'very-active': 1.4
    }
    
    totalWater = totalWater * activityMultipliers[formData.activity as keyof typeof activityMultipliers]
    
    // Ajustes por clima
    const climateAdjustments = {
      'cold': 1.0,
      'temperate': 1.1,
      'hot': 1.3,
      'very-hot': 1.5
    }
    
    totalWater = totalWater * climateAdjustments[formData.climate as keyof typeof climateAdjustments]
    
    // Ajustes por exercício
    const exerciseIntensityMultipliers = {
      'light': 0.5,
      'moderate': 0.7,
      'intense': 1.0
    }
    
    const exerciseWater = exerciseDuration * exerciseIntensityMultipliers[formData.exerciseIntensity as keyof typeof exerciseIntensityMultipliers] * 10
    totalWater += exerciseWater
    
    // Distribuição ao longo do dia
    const hourlyIntake = Math.round(totalWater / 16) // 16 horas acordado
    const morningIntake = Math.round(totalWater * 0.2) // 20% pela manhã
    const afternoonIntake = Math.round(totalWater * 0.4) // 40% à tarde
    const eveningIntake = Math.round(totalWater * 0.4) // 40% à noite
    
    // Sinais de desidratação
    const dehydrationSigns = [
      'Sede excessiva',
      'Boca seca',
      'Urina escura',
      'Fadiga',
      'Dor de cabeça',
      'Tontura'
    ]
    
    // Dicas de hidratação
    const hydrationTips = [
      'Beba água ao acordar',
      'Mantenha uma garrafa sempre por perto',
      'Beba antes de sentir sede',
      'Consuma frutas com alto teor de água',
      'Evite álcool e cafeína em excesso',
      'Monitore a cor da urina'
    ]
    
    // Alimentos hidratantes
    const hydratingFoods = [
      'Melancia (92% água)',
      'Pepino (95% água)',
      'Tomate (94% água)',
      'Laranja (87% água)',
      'Iogurte (85% água)',
      'Sopa de vegetais'
    ]

    setResult({
      totalWater: Math.round(totalWater),
      hourlyIntake,
      morningIntake,
      afternoonIntake,
      eveningIntake,
      dehydrationSigns,
      hydrationTips,
      hydratingFoods
    })
    setShowResult(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Monitor de Hidratação - Demo</h1>
                <p className="text-sm text-gray-600">Demonstração da ferramenta profissional</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Esta é uma demonstração
              </h3>
              <p className="text-blue-700">
                Esta é uma versão de demonstração da ferramenta. Na versão completa, 
                você receberá os dados dos seus clientes automaticamente e poderá 
                personalizar com sua marca.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Monitor de Hidratação
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="300"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="70.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Atividade *
                  </label>
                  <select
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="sedentary">Sedentário</option>
                    <option value="light">Leve</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Ativo</option>
                    <option value="very-active">Muito Ativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clima *
                  </label>
                  <select
                    value={formData.climate}
                    onChange={(e) => setFormData({...formData, climate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="cold">Frio</option>
                    <option value="temperate">Temperado</option>
                    <option value="hot">Quente</option>
                    <option value="very-hot">Muito Quente</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercício por Dia (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={formData.exerciseDuration}
                    onChange={(e) => setFormData({...formData, exerciseDuration: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensidade do Exercício
                </label>
                <select
                  value={formData.exerciseIntensity}
                  onChange={(e) => setFormData({...formData, exerciseIntensity: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="light">Leve</option>
                  <option value="moderate">Moderada</option>
                  <option value="intense">Intensa</option>
                </select>
              </div>

              <button
                type="button"
                onClick={calculateHydration}
                disabled={!formData.weight || !formData.age}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calcular Necessidades de Hidratação
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Plano de Hidratação
            </h2>
            
            {showResult && result ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Droplets className="w-8 h-8 text-blue-600 mr-2" />
                    <div className="text-3xl font-bold text-blue-600">{result.totalWater}ml</div>
                  </div>
                  <div className="text-lg text-gray-600">Água por dia</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {Math.round(result.totalWater / 1000 * 10) / 10} litros
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Sun className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-yellow-600">{result.morningIntake}ml</div>
                    <div className="text-xs text-gray-600">Manhã</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Activity className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-orange-600">{result.afternoonIntake}ml</div>
                    <div className="text-xs text-gray-600">Tarde</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Droplets className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-purple-600">{result.eveningIntake}ml</div>
                    <div className="text-xs text-gray-600">Noite</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Consumo por Hora:</h3>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-700">{result.hourlyIntake}ml</div>
                    <div className="text-sm text-gray-600">A cada hora acordado</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Sinais de Desidratação:</h3>
                  <ul className="space-y-1">
                    {result.dehydrationSigns.map((sign: string, index: number) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></div>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Dicas de Hidratação:</h3>
                  <ul className="space-y-1">
                    {result.hydrationTips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Alimentos Hidratantes:</h3>
                  <ul className="space-y-1">
                    {result.hydratingFoods.map((food: string, index: number) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Preencha os dados para ver o plano</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Gostou da demonstração?
          </h3>
          <p className="text-emerald-100 mb-6">
            Com a versão completa, você receberá os dados dos seus clientes automaticamente 
            e poderá personalizar com sua marca.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Gratuitamente
            </Link>
            <Link
              href="/"
              className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Ver Outras Ferramentas
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}