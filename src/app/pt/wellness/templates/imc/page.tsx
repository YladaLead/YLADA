'use client'

import { useState } from 'react'
import { TemplateBaseProps } from '@/types/wellness'
import WellnessHeader from '@/components/wellness/WellnessHeader'
import WellnessLanding from '@/components/wellness/WellnessLanding'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { getTemplateBenefits } from '@/lib/template-benefits'

interface ResultadoIMC {
  imc: number
  categoria: string
  cor: string
  descricao: string
  recomendacoes: string[]
}

export default function CalculadoraIMC({ config }: TemplateBaseProps) {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [idade, setIdade] = useState('')
  const [genero, setGenero] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [resultado, setResultado] = useState<ResultadoIMC | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularIMC = () => {
    const pesoNum = parseFloat(peso)
    const alturaNum = parseFloat(altura) / 100

    if (!pesoNum || !alturaNum || pesoNum <= 0 || alturaNum <= 0) {
      alert('Por favor, preencha todos os campos com valores válidos.')
      return
    }

    const imc = pesoNum / (alturaNum * alturaNum)
    let categoria = ''
    let cor = ''
    let descricao = ''
    let recomendacoes: string[] = []

    if (imc < 18.5) {
      categoria = 'Abaixo do Peso'
      cor = 'blue'
      descricao = 'Seu IMC indica que você está abaixo do peso ideal.'
      recomendacoes = [
        'Consultar um especialista em nutrição',
        'Focar em alimentos nutritivos e calóricos',
        'Considerar exercícios de fortalecimento',
        'Acompanhar crescimento gradual'
      ]
    } else if (imc >= 18.5 && imc < 25) {
      categoria = 'Peso Normal'
      cor = 'green'
      descricao = 'Parabéns! Seu IMC está dentro da faixa saudável.'
      recomendacoes = [
        'Manter hábitos saudáveis',
        'Praticar atividades físicas regularmente',
        'Alimentação balanceada',
        'Acompanhamento preventivo'
      ]
    } else if (imc >= 25 && imc < 30) {
      categoria = 'Sobrepeso'
      cor = 'orange'
      descricao = 'Seu IMC indica sobrepeso. Com orientação adequada, você pode alcançar seu objetivo.'
      recomendacoes = [
        'Consultar especialista para avaliação completa',
        'Equilibrar alimentação e exercícios',
        'Estabelecer metas realistas',
        'Acompanhamento profissional'
      ]
    } else if (imc >= 30 && imc < 35) {
      categoria = 'Obesidade Grau I'
      cor = 'red'
      descricao = 'É importante buscar orientação profissional para um plano personalizado.'
      recomendacoes = [
        'Consultar urgentemente um especialista',
        'Plano nutricional supervisionado',
        'Atividade física acompanhada',
        'Suporte profissional contínuo'
      ]
    } else {
      categoria = 'Obesidade Grau II ou III'
      cor = 'red'
      descricao = 'É essencial buscar acompanhamento médico especializado.'
      recomendacoes = [
        'Buscar orientação médica imediata',
        'Plano personalizado e supervisionado',
        'Equipe multidisciplinar',
        'Acompanhamento contínuo'
      ]
    }

    setResultado({
      imc: parseFloat(imc.toFixed(2)),
      categoria,
      cor,
      descricao,
      recomendacoes
    })
    setEtapa('resultado')
  }

  const resetar = () => {
    setIdade('')
    setGenero('')
    setPeso('')
    setAltura('')
    setResultado(null)
    setEtapa('formulario')
  }

  const voltarInicio = () => {
    setIdade('')
    setGenero('')
    setPeso('')
    setAltura('')
    setResultado(null)
    setEtapa('landing')
  }

  const cores = {
    blue: 'bg-blue-600 text-blue-800',
    green: 'bg-green-600 text-green-800',
    orange: 'bg-orange-600 text-orange-800',
    red: 'bg-red-600 text-red-800'
  }

  const bordas = {
    blue: 'border-blue-300',
    green: 'border-green-300',
    orange: 'border-orange-300',
    red: 'border-red-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <WellnessHeader
        title={config?.title}
        description={config?.description}
        defaultTitle="Calculadora IMC"
        defaultDescription="Descubra seu Índice de Massa Corporal"
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (() => {
          // Obter benefícios automaticamente baseado no template
          const templateBenefits = getTemplateBenefits('calc-imc')
          
          return (
            <WellnessLanding
              config={config}
              defaultEmoji="📊"
              defaultTitle="Calculadora de IMC"
              defaultDescription={
                <>
                  <p className="text-xl text-gray-600 mb-2">
                    Descubra seu Índice de Massa Corporal em segundos
                  </p>
                  <p className="text-gray-600">
                    Com orientações personalizadas para alcançar seu peso ideal
                  </p>
                </>
              }
              discover={templateBenefits.discover || []}
              benefits={templateBenefits.whyUse || []}
              onStart={iniciarCalculo}
              buttonText="▶️ Calcular Agora - É Grátis"
            />
          )
        })()}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calcule seu IMC</h2>
              <p className="text-gray-600">Preencha os dados abaixo para descobrir seu Índice de Massa Corporal e receber orientações personalizadas.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  min="1"
                  max="120"
                  placeholder="Ex: 30"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  min="1"
                  max="300"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  min="100"
                  max="250"
                  placeholder="Ex: 175"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            <button
              onClick={calcularIMC}
              className="w-full mt-8 text-white py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
              style={config?.custom_colors
                ? {
                    background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
                  }
                : {
                    background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)'
                  }}
            >
              Calcular IMC →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${bordas[resultado.cor as keyof typeof bordas]}`}>
              <div className="text-center mb-6">
                <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-4 ${cores[resultado.cor as keyof typeof cores]}`}>
                  IMC: {resultado.imc}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{resultado.categoria}</h2>
                <p className="text-gray-600 text-lg">{resultado.descricao}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <WellnessCTAButton
                config={config}
                resultadoTexto={`IMC: ${resultado.imc} - ${resultado.categoria}`}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetar}
                className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all"
              >
                ↻ Calcular Novamente
              </button>
              <button
                onClick={voltarInicio}
                className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all"
              >
                🏠 Início
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

