'use client'

import { useState, useMemo } from 'react'
import { BookOpen, Search, Filter, Target, ArrowLeft, Zap, Shield, Heart, Brain, TrendingUp, Users, Star } from 'lucide-react'
import Link from 'next/link'

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<'vitamins' | 'minerals' | 'proteins' | 'calculator'>('vitamins')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGoal, setSelectedGoal] = useState<string>('')
  const [selectedSymptom, setSelectedSymptom] = useState<string>('')
  const [userProfile, setUserProfile] = useState({
    age: '',
    gender: 'male',
    activity: 'moderate',
    weight: '',
    height: ''
  })

  const goals = [
    { id: 'energy', name: 'Energia', icon: Zap, color: 'text-yellow-500' },
    { id: 'immunity', name: 'Imunidade', icon: Shield, color: 'text-blue-500' },
    { id: 'muscle', name: 'Massa Muscular', icon: TrendingUp, color: 'text-green-500' },
    { id: 'heart', name: 'Saúde Cardíaca', icon: Heart, color: 'text-red-500' },
    { id: 'brain', name: 'Função Cerebral', icon: Brain, color: 'text-purple-500' },
    { id: 'weight-loss', name: 'Perda de Peso', icon: Target, color: 'text-orange-500' }
  ]

  const symptoms = [
    'Fadiga', 'Dor de cabeça', 'Cãibras musculares', 'Queda de cabelo',
    'Problemas de memória', 'Insônia', 'Ansiedade', 'Depressão',
    'Problemas digestivos', 'Pele seca', 'Unhas fracas', 'Resfriados frequentes'
  ]

  const vitamins = [
    {
      name: 'Vitamina C',
      benefits: ['Imunidade', 'Síntese de colágeno', 'Antioxidante'],
      sources: ['Frutas cítricas', 'Pimentão', 'Brócolis', 'Morango'],
      rda: { male: 90, female: 75, unit: 'mg' },
      ul: 2000,
      deficiency: ['Escorbuto', 'Cicatrização lenta', 'Imunidade baixa'],
      interactions: [
        { nutrient: 'Ferro', effect: 'Melhora absorção', type: 'positive' },
        { nutrient: 'Vitamina E', effect: 'Sinergia antioxidante', type: 'positive' }
      ],
      evidence: 'Alta evidência científica',
      timing: 'Com as refeições',
      goals: ['immunity', 'energy'],
      symptoms: ['Resfriados frequentes', 'Fadiga']
    },
    {
      name: 'Vitamina D',
      benefits: ['Absorção de cálcio', 'Imunidade', 'Função muscular'],
      sources: ['Sol', 'Peixes gordurosos', 'Gema de ovo', 'Leite fortificado'],
      rda: { male: 15, female: 15, unit: 'mcg' },
      ul: 100,
      deficiency: ['Osteoporose', 'Raquitismo', 'Imunidade baixa'],
      interactions: [
        { nutrient: 'Cálcio', effect: 'Melhora absorção', type: 'positive' },
        { nutrient: 'Magnésio', effect: 'Necessário para ativação', type: 'positive' }
      ],
      evidence: 'Alta evidência científica',
      timing: 'Com gordura',
      goals: ['immunity', 'muscle'],
      symptoms: ['Fadiga', 'Dor óssea']
    },
    {
      name: 'Vitamina B12',
      benefits: ['Formação de glóbulos vermelhos', 'Função neurológica', 'Metabolismo'],
      sources: ['Carnes', 'Peixes', 'Ovos', 'Laticínios'],
      rda: { male: 2.4, female: 2.4, unit: 'mcg' },
      ul: null,
      deficiency: ['Anemia', 'Neuropatia', 'Fadiga'],
      interactions: [
        { nutrient: 'Ácido fólico', effect: 'Trabalham juntos', type: 'positive' },
        { nutrient: 'Álcool', effect: 'Reduz absorção', type: 'negative' }
      ],
      evidence: 'Alta evidência científica',
      timing: 'Com estômago vazio',
      goals: ['energy', 'brain'],
      symptoms: ['Fadiga', 'Problemas de memória']
    },
    {
      name: 'Vitamina B6',
      benefits: ['Metabolismo de proteínas', 'Função neurológica', 'Síntese de neurotransmissores'],
      sources: ['Frango', 'Peixe', 'Banana', 'Batata'],
      rda: { male: 1.3, female: 1.3, unit: 'mg' },
      ul: 100,
      deficiency: ['Depressão', 'Anemia', 'Problemas de pele'],
      interactions: [
        { nutrient: 'Magnésio', effect: 'Melhora absorção', type: 'positive' },
        { nutrient: 'Zinco', effect: 'Competição por absorção', type: 'negative' }
      ],
      evidence: 'Média evidência científica',
      timing: 'Com as refeições',
      goals: ['brain', 'energy'],
      symptoms: ['Depressão', 'Ansiedade']
    }
  ]

  const minerals = [
    {
      name: 'Ferro',
      benefits: ['Transporte de oxigênio', 'Função muscular', 'Imunidade'],
      sources: ['Carnes vermelhas', 'Espinafre', 'Feijão', 'Lentilha'],
      rda: { male: 8, female: 18, unit: 'mg' },
      ul: 45,
      deficiency: ['Anemia', 'Fadiga', 'Queda de cabelo'],
      interactions: [
        { nutrient: 'Vitamina C', effect: 'Melhora absorção', type: 'positive' },
        { nutrient: 'Cálcio', effect: 'Reduz absorção', type: 'negative' }
      ],
      evidence: 'Alta evidência científica',
      timing: 'Com vitamina C',
      goals: ['energy', 'immunity'],
      symptoms: ['Fadiga', 'Queda de cabelo']
    },
    {
      name: 'Magnésio',
      benefits: ['Função muscular', 'Síntese de proteínas', 'Controle glicêmico'],
      sources: ['Espinafre', 'Amêndoas', 'Abacate', 'Chocolate amargo'],
      rda: { male: 420, female: 320, unit: 'mg' },
      ul: 350,
      deficiency: ['Cãibras', 'Insônia', 'Ansiedade'],
      interactions: [
        { nutrient: 'Vitamina D', effect: 'Necessário para absorção', type: 'positive' },
        { nutrient: 'Cálcio', effect: 'Equilíbrio importante', type: 'neutral' }
      ],
      evidence: 'Alta evidência científica',
      timing: 'Antes de dormir',
      goals: ['muscle', 'brain'],
      symptoms: ['Cãibras musculares', 'Insônia', 'Ansiedade']
    },
    {
      name: 'Zinco',
      benefits: ['Imunidade', 'Cicatrização', 'Função cognitiva'],
      sources: ['Ostras', 'Carne bovina', 'Sementes de abóbora', 'Grão-de-bico'],
      rda: { male: 11, female: 8, unit: 'mg' },
      ul: 40,
      deficiency: ['Imunidade baixa', 'Cicatrização lenta', 'Perda de paladar'],
      interactions: [
        { nutrient: 'Cobre', effect: 'Competição por absorção', type: 'negative' },
        { nutrient: 'Ferro', effect: 'Competição por absorção', type: 'negative' }
      ],
      evidence: 'Alta evidência científica',
      timing: 'Com estômago vazio',
      goals: ['immunity', 'brain'],
      symptoms: ['Resfriados frequentes', 'Problemas de memória']
    }
  ]

  const proteins = [
    {
      name: 'Whey Protein',
      benefits: ['Síntese proteica', 'Recuperação muscular', 'Saciedade'],
      sources: ['Suplemento', 'Leite', 'Queijo'],
      rda: { male: 1.6, female: 1.6, unit: 'g/kg' },
      ul: null,
      deficiency: ['Perda muscular', 'Fadiga', 'Recuperação lenta'],
      interactions: [
        { nutrient: 'Carboidratos', effect: 'Melhora absorção', type: 'positive' },
        { nutrient: 'Água', effect: 'Necessário para metabolismo', type: 'positive' }
      ],
      evidence: 'Alta evidência científica',
      timing: 'Pós-treino',
      goals: ['muscle', 'weight-loss'],
      symptoms: ['Fadiga', 'Cãibras musculares']
    },
    {
      name: 'Caseína',
      benefits: ['Liberação lenta', 'Recuperação noturna', 'Saciedade prolongada'],
      sources: ['Leite', 'Queijo', 'Suplemento'],
      rda: { male: 1.6, female: 1.6, unit: 'g/kg' },
      ul: null,
      deficiency: ['Perda muscular', 'Fome noturna'],
      interactions: [
        { nutrient: 'Cálcio', effect: 'Melhora absorção', type: 'positive' },
        { nutrient: 'Vitamina D', effect: 'Melhora absorção', type: 'positive' }
      ],
      evidence: 'Média evidência científica',
      timing: 'Antes de dormir',
      goals: ['muscle'],
      symptoms: ['Insônia']
    }
  ]

  const filteredNutrients = useMemo(() => {
    let nutrients = []
    
    if (activeTab === 'vitamins') nutrients = vitamins
    else if (activeTab === 'minerals') nutrients = minerals
    else if (activeTab === 'proteins') nutrients = proteins

    return nutrients.filter(nutrient => {
      const matchesSearch = nutrient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          nutrient.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          nutrient.sources.some(source => source.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesGoal = !selectedGoal || nutrient.goals.includes(selectedGoal)
      const matchesSymptom = !selectedSymptom || nutrient.symptoms.includes(selectedSymptom)
      
      return matchesSearch && matchesGoal && matchesSymptom
    })
  }, [activeTab, searchTerm, selectedGoal, selectedSymptom])

  const calculateNeeds = () => {
    const age = parseFloat(userProfile.age)
    const weight = parseFloat(userProfile.weight)
    
    if (!age || !weight) return null

    const needs = {
      protein: weight * 1.6,
      vitaminC: userProfile.gender === 'male' ? 90 : 75,
      vitaminD: 15,
      iron: userProfile.gender === 'male' ? 8 : 18,
      magnesium: userProfile.gender === 'male' ? 420 : 320,
      zinc: userProfile.gender === 'male' ? 11 : 8
    }

    return needs
  }

  const userNeeds = calculateNeeds()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tabelas Nutricionais</h1>
                <p className="text-sm text-gray-600">Guia inteligente de nutrientes</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'vitamins', name: 'Vitaminas', icon: Zap },
            { id: 'minerals', name: 'Minerais', icon: Shield },
            { id: 'proteins', name: 'Proteínas', icon: TrendingUp },
            { id: 'calculator', name: 'Suas Necessidades', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {activeTab === 'calculator' ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculadora de Necessidades Nutricionais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                <input
                  type="number"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                <select
                  value={userProfile.gender}
                  onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  value={userProfile.weight}
                  onChange={(e) => setUserProfile({...userProfile, weight: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: 70"
                />
              </div>
            </div>

            {userNeeds && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suas Necessidades Diárias:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">Proteína</h4>
                    <p className="text-2xl font-bold text-green-600">{userNeeds.protein.toFixed(1)}g</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">Vitamina C</h4>
                    <p className="text-2xl font-bold text-green-600">{userNeeds.vitaminC}mg</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">Vitamina D</h4>
                    <p className="text-2xl font-bold text-green-600">{userNeeds.vitaminD}mcg</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">Ferro</h4>
                    <p className="text-2xl font-bold text-green-600">{userNeeds.iron}mg</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">Magnésio</h4>
                    <p className="text-2xl font-bold text-green-600">{userNeeds.magnesium}mg</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">Zinco</h4>
                    <p className="text-2xl font-bold text-green-600">{userNeeds.zinc}mg</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar nutrientes, benefícios ou fontes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Todos os objetivos</option>
                    {goals.map(goal => (
                      <option key={goal.id} value={goal.id}>{goal.name}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedSymptom}
                    onChange={(e) => setSelectedSymptom(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Todos os sintomas</option>
                    {symptoms.map(symptom => (
                      <option key={symptom} value={symptom}>{symptom}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Goals Quick Access */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos Rápidos:</h3>
              <div className="flex flex-wrap gap-3">
                {goals.map(goal => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(selectedGoal === goal.id ? '' : goal.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedGoal === goal.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <goal.icon className={`w-4 h-4 ${selectedGoal === goal.id ? 'text-white' : goal.color}`} />
                    <span>{goal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nutrients Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredNutrients.map((nutrient, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{nutrient.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{nutrient.evidence}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Benefícios:</h4>
                    <div className="flex flex-wrap gap-2">
                      {nutrient.benefits.map((benefit, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Fontes:</h4>
                    <p className="text-gray-600">{nutrient.sources.join(', ')}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">RDA:</h4>
                      <p className="text-sm text-gray-600">
                        Homem: {nutrient.rda.male} {nutrient.rda.unit}
                      </p>
                      <p className="text-sm text-gray-600">
                        Mulher: {nutrient.rda.female} {nutrient.rda.unit}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Timing:</h4>
                      <p className="text-sm text-gray-600">{nutrient.timing}</p>
                    </div>
                  </div>

                  {nutrient.interactions && nutrient.interactions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Interações:</h4>
                      <div className="space-y-1">
                        {nutrient.interactions.map((interaction, i) => (
                          <div key={i} className={`text-sm p-2 rounded ${
                            interaction.type === 'positive' 
                              ? 'bg-green-50 text-green-800' 
                              : interaction.type === 'negative'
                              ? 'bg-red-50 text-red-800'
                              : 'bg-gray-50 text-gray-800'
                          }`}>
                            <strong>{interaction.nutrient}:</strong> {interaction.effect}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {nutrient.deficiency && nutrient.deficiency.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Deficiência:</h4>
                      <div className="flex flex-wrap gap-2">
                        {nutrient.deficiency.map((def, i) => (
                          <span key={i} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                            {def}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredNutrients.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum nutriente encontrado</h3>
                <p className="text-gray-600">Tente ajustar os filtros ou termo de busca</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
