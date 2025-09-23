'use client'

import { useState } from 'react'
import { Calculator, Scale, Activity, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null)

  const calculators = [
    {
      id: 'imc',
      title: 'Calculadora de IMC',
      description: 'Índice de Massa Corporal',
      icon: Scale,
      color: 'bg-blue-500',
      component: <IMCCalculator />
    },
    {
      id: 'lean-mass',
      title: 'Massa Magra',
      description: 'Calcule sua massa muscular',
      icon: Activity,
      color: 'bg-green-500',
      component: <LeanMassCalculator />
    },
    {
      id: 'protein',
      title: 'Proteína Diária',
      description: 'Necessidade proteica diária',
      icon: Zap,
      color: 'bg-yellow-500',
      component: <ProteinCalculator />
    }
  ]

  if (activeCalculator) {
    const calculator = calculators.find(calc => calc.id === activeCalculator)
    const IconComponent = calculator?.icon
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <button
                onClick={() => setActiveCalculator(null)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${calculator?.color} rounded-lg flex items-center justify-center`}>
                  {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{calculator?.title}</h1>
                  <p className="text-sm text-gray-600">{calculator?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Calculator Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {calculator?.component}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calculadoras</h1>
                <p className="text-sm text-gray-600">Ferramentas para sua saúde</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Calculators Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Calculadoras Nutricionais
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use nossas calculadoras para entender melhor suas necessidades nutricionais e de saúde
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {calculators.map((calculator) => {
            const IconComponent = calculator.icon
            return (
              <div
                key={calculator.id}
                onClick={() => setActiveCalculator(calculator.id)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${calculator.color} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {calculator.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {calculator.description}
                </p>
                <div className="text-blue-600 font-medium">
                  Calcular →
                </div>
              </div>
            )
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-blue-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Importante
          </h3>
          <p className="text-gray-700 text-center max-w-3xl mx-auto">
            Estas calculadoras são apenas para fins educativos e informativos. 
            Sempre consulte um profissional de saúde qualificado antes de fazer 
            mudanças significativas em sua dieta ou rotina de exercícios.
          </p>
        </div>
      </main>
    </div>
  )
}

// IMC Calculator Component
function IMCCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [category, setCategory] = useState('')

  const calculateIMC = () => {
    const w = parseFloat(weight)
    const h = parseFloat(height) / 100 // Convert cm to meters
    
    if (w && h) {
      const imc = w / (h * h)
      setResult(imc)
      
      if (imc < 18.5) setCategory('Abaixo do peso')
      else if (imc < 25) setCategory('Peso normal')
      else if (imc < 30) setCategory('Sobrepeso')
      else setCategory('Obesidade')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculadora de IMC</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 70"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Altura (cm)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 175"
          />
        </div>
      </div>

      <button
        onClick={calculateIMC}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
      >
        Calcular IMC
      </button>

      {result && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resultado:</h3>
          <p className="text-3xl font-bold text-blue-600 mb-2">{result.toFixed(1)}</p>
          <p className="text-gray-700">Classificação: <span className="font-semibold">{category}</span></p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">Classificação do IMC:</h4>
        <ul className="space-y-1">
          <li>• Abaixo do peso: IMC &lt; 18,5</li>
          <li>• Peso normal: IMC 18,5 - 24,9</li>
          <li>• Sobrepeso: IMC 25 - 29,9</li>
          <li>• Obesidade: IMC &ge; 30</li>
        </ul>
      </div>
    </div>
  )
}

// Lean Mass Calculator Component
function LeanMassCalculator() {
  const [weight, setWeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [estimatedBodyFat, setEstimatedBodyFat] = useState<number | null>(null)
  const [method, setMethod] = useState<'manual' | 'estimate'>('estimate')

  const calculateLeanMass = () => {
    const w = parseFloat(weight)
    let bf = parseFloat(bodyFat)
    
    if (method === 'estimate' && w && age && waist && neck) {
      // Estimativa usando fórmula da Marinha Americana
      const ageNum = parseFloat(age)
      const waistNum = parseFloat(waist)
      const neckNum = parseFloat(neck)
      const hipNum = parseFloat(hip)
      
      if (gender === 'male') {
        bf = 86.010 * Math.log10(waistNum - neckNum) - 70.041 * Math.log10(parseFloat(height) || 175) + 36.76
      } else {
        if (hipNum) {
          bf = 163.205 * Math.log10(waistNum + hipNum - neckNum) - 97.684 * Math.log10(parseFloat(height) || 165) - 78.387
        } else {
          bf = 163.205 * Math.log10(waistNum - neckNum) - 97.684 * Math.log10(parseFloat(height) || 165) - 78.387
        }
      }
      
      setEstimatedBodyFat(Math.max(0, Math.min(100, bf)))
    }
    
    if (w && bf) {
      const leanMass = w * (1 - bf / 100)
      setResult(leanMass)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculadora de Massa Magra</h2>
      
      {/* Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Como você quer calcular?
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => setMethod('estimate')}
            className={`px-4 py-2 rounded-lg font-medium ${
              method === 'estimate' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Estimativa por Medidas
          </button>
          <button
            onClick={() => setMethod('manual')}
            className={`px-4 py-2 rounded-lg font-medium ${
              method === 'manual' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Valor Conhecido
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso Total (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ex: 80"
          />
        </div>

        {method === 'estimate' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 175"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade (anos)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexo
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cintura (cm)
              </label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 85"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pescoço (cm)
              </label>
              <input
                type="number"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: 38"
              />
            </div>

            {gender === 'female' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quadril (cm) - Opcional
                </label>
                <input
                  type="number"
                  value={hip}
                  onChange={(e) => setHip(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 95"
                />
              </div>
            )}
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentual de Gordura (%)
            </label>
            <input
              type="number"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: 15"
            />
          </div>
        )}
      </div>

      <button
        onClick={calculateLeanMass}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-6"
      >
        Calcular Massa Magra
      </button>

      {estimatedBodyFat && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Percentual de Gordura Estimado:</h3>
          <p className="text-2xl font-bold text-blue-600">{estimatedBodyFat.toFixed(1)}%</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resultado:</h3>
          <p className="text-3xl font-bold text-green-600 mb-2">{result.toFixed(1)} kg</p>
          <p className="text-gray-700">Massa magra estimada</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">Como medir corretamente:</h4>
        <ul className="space-y-1 mb-4">
          <li>• <strong>Cintura:</strong> Meça na parte mais estreita do abdômen</li>
          <li>• <strong>Pescoço:</strong> Meça logo abaixo do pomo de Adão</li>
          <li>• <strong>Quadril:</strong> Meça na parte mais larga dos quadris (mulheres)</li>
        </ul>
        
        <h4 className="font-semibold mb-2">Métodos mais precisos:</h4>
        <ul className="space-y-1">
          <li>• <strong>DEXA Scan:</strong> Exame médico mais preciso</li>
          <li>• <strong>Bioimpedância:</strong> Balanças especiais</li>
          <li>• <strong>Adipômetro:</strong> Medição de dobras cutâneas</li>
        </ul>
      </div>
    </div>
  )
}

// Protein Calculator Component
function ProteinCalculator() {
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState('sedentary')
  const [result, setResult] = useState<number | null>(null)

  const activityMultipliers = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    intense: 1.4,
    athlete: 1.6
  }

  const calculateProtein = () => {
    const w = parseFloat(weight)
    
    if (w) {
      const multiplier = activityMultipliers[activity as keyof typeof activityMultipliers]
      const protein = w * multiplier
      setResult(protein)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculadora de Proteína Diária</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peso (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Ex: 70"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível de Atividade
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="sedentary">Sedentário</option>
            <option value="light">Leve</option>
            <option value="moderate">Moderado</option>
            <option value="intense">Intenso</option>
            <option value="athlete">Atleta</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculateProtein}
        className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition-colors mb-6"
      >
        Calcular Proteína
      </button>

      {result && (
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resultado:</h3>
          <p className="text-3xl font-bold text-yellow-600 mb-2">{result.toFixed(1)} g</p>
          <p className="text-gray-700">Proteína diária recomendada</p>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">Níveis de Atividade:</h4>
        <ul className="space-y-1">
          <li>• <strong>Sedentário:</strong> Pouco ou nenhum exercício</li>
          <li>• <strong>Leve:</strong> Exercício leve 1-3x/semana</li>
          <li>• <strong>Moderado:</strong> Exercício moderado 3-5x/semana</li>
          <li>• <strong>Intenso:</strong> Exercício intenso 6-7x/semana</li>
          <li>• <strong>Atleta:</strong> Exercício muito intenso + trabalho físico</li>
        </ul>
      </div>
    </div>
  )
}