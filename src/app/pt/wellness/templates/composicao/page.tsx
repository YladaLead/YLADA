'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ResultadoComposicao {
  imc: number
  massaMuscular: number
  gorduraCorporal: number
  agua: number
  interpretacao: string
  cor: string
  recomendacoes: string[]
}

export default function CalculadoraComposicao() {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [idade, setIdade] = useState('')
  const [genero, setGenero] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [cintura, setCintura] = useState('')
  const [resultado, setResultado] = useState<ResultadoComposicao | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularComposicao = () => {
    const pesoNum = parseFloat(peso)
    const alturaNum = parseFloat(altura) / 100
    const cinturaNum = parseFloat(cintura) || 0

    if (!pesoNum || !alturaNum || pesoNum <= 0 || alturaNum <= 0) {
      alert('Por favor, preencha peso e altura com valores válidos.')
      return
    }

    const imc = pesoNum / (alturaNum * alturaNum)

    // Estimativas aproximadas
    let massaMuscular = 0
    let gorduraCorporal = 0
    let agua = 0

    if (genero === 'masculino') {
      massaMuscular = Math.round(pesoNum * 0.40)
      gorduraCorporal = Math.round(pesoNum * 0.18)
      agua = Math.round(pesoNum * 0.60)
    } else {
      massaMuscular = Math.round(pesoNum * 0.35)
      gorduraCorporal = Math.round(pesoNum * 0.25)
      agua = Math.round(pesoNum * 0.50)
    }

    let interpretacao = ''
    let cor = ''
    let recomendacoes: string[] = []

    if (imc >= 18.5 && imc < 25) {
      interpretacao = 'Composição corporal equilibrada!'
      cor = 'green'
      recomendacoes = [
        'Manter hábitos de treino',
        'Alimentação balanceada',
        'Descanso adequado',
        'Monitoramento mensal'
      ]
    } else if (imc >= 25 && imc < 30) {
      interpretacao = 'Potencial para otimização de composição.'
      cor = 'blue'
      recomendacoes = [
        'Treinar força para ganhar músculo',
        'Controle alimentar',
        'Reduzir gordura corporal',
        'Acompanhamento profissional'
      ]
    } else {
      interpretacao = 'Foque em melhorar composição corporal.'
      cor = 'orange'
      recomendacoes = [
        'Treino personalizado',
        'Dieta estruturada',
        'Priorizar musculação',
        'Consulta urgente com especialista'
      ]
    }

    setResultado({
      imc: parseFloat(imc.toFixed(2)),
      massaMuscular,
      gorduraCorporal,
      agua,
      interpretacao,
      cor,
      recomendacoes
    })
    setEtapa('resultado')
  }

  const cores = {
    green: 'bg-green-600 text-green-800',
    blue: 'bg-blue-600 text-blue-800',
    orange: 'bg-orange-600 text-orange-800'
  }

  const bordas = {
    green: 'border-green-300',
    blue: 'border-blue-300',
    orange: 'border-orange-300'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Image
              src="/logos/ylada-logo-horizontal-vazado.png"
              alt="YLADA"
              width={160}
              height={50}
              className="h-10"
            />
            <div className="h-10 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Composição Corporal</h1>
              <p className="text-sm text-gray-600">Sua massa muscular, gordura e hidratação</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Avalie sua Composição Corporal</h2>
              <p className="text-xl text-gray-600 mb-2">
                Entenda sua massa muscular, gordura corporal e hidratação
              </p>
              <p className="text-gray-600 mb-6">
                Para otimizar sua saúde e alcançar seus objetivos
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border-2 border-green-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">💡 Por que avaliar sua composição?</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Entenda o que você ganha ao perder peso (músculo vs gordura)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Monitore ganhos de massa muscular e redução de gordura</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Planeje treinos e dieta com base em dados reais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Motive-se com progresso mensurável</span>
                </li>
              </ul>
            </div>

            <button
              onClick={iniciarCalculo}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              ▶️ Avaliar Minha Composição - É Grátis
            </button>
          </div>
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-green-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Avalie sua composição</h2>
              <p className="text-gray-600">Preencha os dados para entender sua massa muscular, gordura e hidratação.</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura (cm) <span className="text-gray-500">Opcional</span>
                </label>
                <input
                  type="number"
                  value={cintura}
                  onChange={(e) => setCintura(e.target.value)}
                  min="50"
                  max="200"
                  placeholder="Ex: 85"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            <button
              onClick={calcularComposicao}
              className="w-full mt-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              Avaliar Composição →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${bordas[resultado.cor]}`}>
              <div className="text-center mb-6">
                <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-4 ${cores[resultado.cor]}`}>
                  IMC: {resultado.imc}
                </div>
                <p className="text-gray-800 text-xl mb-2">{resultado.interpretacao}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{resultado.massaMuscular}kg</div>
                  <p className="text-sm text-gray-600">Massa Muscular</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{resultado.gorduraCorporal}kg</div>
                  <p className="text-sm text-gray-600">Gordura Corporal</p>
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-600 mb-1">{resultado.agua}kg</div>
                  <p className="text-sm text-gray-600">Água Corporal</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-center">
              <p className="text-white text-lg font-semibold mb-4">
                Quer criar um plano para otimizar sua composição corporal?
              </p>
              <a
                href="https://wa.me/5511999999999?text=Olá! Avaliei minha composição corporal através do YLADA e gostaria de saber mais sobre otimização. Pode me ajudar?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
              >
                💬 Conversar com Especialista
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setIdade('')
                  setGenero('')
                  setPeso('')
                  setAltura('')
                  setCintura('')
                  setResultado(null)
                  setEtapa('formulario')
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Fazer Nova Avaliação
              </button>
              <button
                onClick={() => {
                  setIdade('')
                  setGenero('')
                  setPeso('')
                  setAltura('')
                  setCintura('')
                  setResultado(null)
                  setEtapa('landing')
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
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

