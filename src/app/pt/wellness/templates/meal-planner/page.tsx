'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'

interface Resultado {
  caloriasDiarias: number
  proteinas: number
  carbs: number
  gorduras: number
  suplementos: string[]
}

export default function PlanejadorRefeicoes({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [dados, setDados] = useState({
    idade: '',
    genero: '',
    peso: '',
    altura: '',
    atividade: '',
    objetivo: ''
  })
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const iniciarPlanejamento = () => {
    setEtapa('formulario')
  }

  const calcularPlano = () => {
    const peso = parseFloat(dados.peso)
    const altura = parseFloat(dados.altura) / 100

    if (!peso || !altura || peso <= 0 || altura <= 0) {
      alert('Por favor, preencha peso e altura com valores válidos.')
      return
    }

    // Calcular TMB (Taxa Metabólica Basal)
    let tmb = 0
    if (dados.genero === 'masculino') {
      tmb = 88.362 + (13.397 * peso) + (4.799 * (altura * 100)) - (5.677 * parseFloat(dados.idade))
    } else {
      tmb = 447.593 + (9.247 * peso) + (3.098 * (altura * 100)) - (4.330 * parseFloat(dados.idade))
    }

    // Fator de atividade
    let fatorAtividade = 1.2
    if (dados.atividade === 'leve') fatorAtividade = 1.375
    else if (dados.atividade === 'moderado') fatorAtividade = 1.55
    else if (dados.atividade === 'intenso') fatorAtividade = 1.725
    else if (dados.atividade === 'muito-intenso') fatorAtividade = 1.9

    // TDEE (Total Daily Energy Expenditure)
    const tdee = tmb * fatorAtividade

    // Ajustar por objetivo
    let calorias = tdee
    if (dados.objetivo === 'perder') calorias = tdee * 0.85 // Déficit de 15%
    else if (dados.objetivo === 'ganhar') calorias = tdee * 1.15 // Superávit de 15%

    // Distribuição de macronutrientes
    const proteinas = Math.round(peso * 2.2) // 2.2g por kg
    const caloriasProteina = proteinas * 4

    const gorduras = Math.round((calorias * 0.25) / 9) // 25% de gordura
    const caloriasGordura = gorduras * 9

    const caloriasCarbs = calorias - caloriasProteina - caloriasGordura
    const carbs = Math.round(caloriasCarbs / 4)

    // Suplementos recomendados
    const suplementos: string[] = []
    if (dados.objetivo === 'ganhar') {
      suplementos.push('Proteína em Pó (pós-treino)')
      suplementos.push('Creatina (antes/durante treino)')
    }
    suplementos.push('Multivitamínico (pela manhã)')
    suplementos.push('Ômega 3 (com refeições)')

    setResultado({
      caloriasDiarias: Math.round(calorias),
      proteinas,
      carbs,
      gorduras,
      suplementos
    })
    setEtapa('resultado')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Planejador de Refeições"
        defaultDescription="Crie seu plano alimentar personalizado"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <WellnessLanding
            config={config}
            defaultEmoji="🍽️"
            defaultTitle="Planejador de Refeições"
            defaultDescription={
              <>
                <p className="text-xl text-gray-600 mb-2">
                  Crie seu plano alimentar personalizado
                </p>
                <p className="text-gray-600">
                  Receba um plano completo com cardápio e macronutrientes
                </p>
              </>
            }
            benefits={[
              'Cardápio semanal personalizado',
              'Distribuição exata de macronutrientes',
              'Receitas recomendadas para seu objetivo',
              'Suplementação específica para seus resultados'
            ]}
            onStart={iniciarPlanejamento}
            buttonText="▶️ Criar Meu Plano - É Grátis"
          />
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-pink-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Criar Plano Alimentar</h2>
              <p className="text-gray-600">Preencha seus dados para receber um plano personalizado.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dados.idade}
                  onChange={(e) => setDados({ ...dados, idade: e.target.value })}
                  min="1"
                  max="120"
                  placeholder="Ex: 30"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.genero}
                  onChange={(e) => setDados({ ...dados, genero: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso atual (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dados.peso}
                  onChange={(e) => setDados({ ...dados, peso: e.target.value })}
                  step="0.1"
                  placeholder="Ex: 70.5"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={dados.altura}
                  onChange={(e) => setDados({ ...dados, altura: e.target.value })}
                  min="100"
                  max="250"
                  placeholder="Ex: 175"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de atividade <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.atividade}
                  onChange={(e) => setDados({ ...dados, atividade: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve (1-3x semana)</option>
                  <option value="moderado">Moderado (3-5x semana)</option>
                  <option value="intenso">Ativo (5-6x semana)</option>
                  <option value="muito-intenso">Muito ativo (2x ao dia)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo <span className="text-red-500">*</span>
                </label>
                <select
                  value={dados.objetivo}
                  onChange={(e) => setDados({ ...dados, objetivo: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="manter">Manter peso</option>
                  <option value="perder">Perder peso</option>
                  <option value="ganhar">Ganhar massa muscular</option>
                </select>
              </div>
            </div>

            <button
              onClick={calcularPlano}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #db2777 0%, #e11d48 100%)'
                  }}
            >
              Gerar Meu Plano →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-pink-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Seu Plano Alimentar</h2>
                <p className="text-gray-600 text-lg">{resultado.caloriasDiarias} calorias/dia</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{resultado.proteinas}g</div>
                  <p className="text-sm text-gray-600">Proteínas</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{resultado.carbs}g</div>
                  <p className="text-sm text-gray-600">Carboidratos</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{resultado.gorduras}g</div>
                  <p className="text-sm text-gray-600">Gorduras</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💊</span>
                  Suplementação Recomendada
                </h3>
                <ul className="space-y-2">
                  {resultado.suplementos.map((sup, index) => (
                    <li key={index} className="flex items-start text-purple-800">
                      <span className="text-purple-600 mr-2">✓</span>
                      <span>{sup}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Próximos Passos
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">✓</span>
                    <span>Dividir calorias em 5-6 refeições ao longo do dia</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">✓</span>
                    <span>Incluir proteína em todas as refeições</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">✓</span>
                    <span>Consumir carboidratos principalmente em torno do treino</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-2">✓</span>
                    <span>Monitorar progresso semanalmente e ajustar se necessário</span>
                  </li>
                </ul>
              </div>
            </div>

            <WellnessCTAButton
              config={config}
              resultadoTexto={`Plano: ${resultado.caloriasDiarias} cal/dia | Proteínas: ${resultado.proteinas}g | Carboidratos: ${resultado.carbs}g | Gorduras: ${resultado.gorduras}g`}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setDados({
                    idade: '',
                    genero: '',
                    peso: '',
                    altura: '',
                    atividade: '',
                    objetivo: ''
                  })
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Criar Novo Plano
              </button>
              <button
                onClick={() => {
                  setDados({
                    idade: '',
                    genero: '',
                    peso: '',
                    altura: '',
                    atividade: '',
                    objetivo: ''
                  })
                  setEtapa('landing')
                }}
                className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                🏠 Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

