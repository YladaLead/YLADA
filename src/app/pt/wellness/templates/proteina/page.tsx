'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ResultadoProteina {
  proteinaDiaria: number
  porRefeicao: number
  interpretacao: string
  cor: string
  recomendacoes: string[]
}

export default function CalculadoraProteina() {
  const [etapa, setEtapa] = useState<'landing' | 'formulario' | 'resultado'>('landing')
  const [idade, setIdade] = useState('')
  const [genero, setGenero] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [atividade, setAtividade] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [resultado, setResultado] = useState<ResultadoProteina | null>(null)

  const iniciarCalculo = () => {
    setEtapa('formulario')
  }

  const calcularProteina = () => {
    const pesoNum = parseFloat(peso)

    if (!pesoNum || pesoNum <= 0) {
      alert('Por favor, preencha o peso com um valor válido.')
      return
    }

    // Fatores de proteína por kg baseado no objetivo
    let fator = 1.2 // Padrão sedentário
    
    if (objetivo === 'perder') fator = 2.2
    else if (objetivo === 'ganhar') fator = 2.5
    else fator = 1.8 // Manter peso

    // Ajuste por nível de atividade
    if (atividade === 'moderado') fator += 0.2
    else if (atividade === 'intenso') fator += 0.4
    else if (atividade === 'muito-intenso') fator += 0.6

    const proteinaDiaria = Math.round(pesoNum * fator)
    const porRefeicao = Math.round(proteinaDiaria / 5) // 5 refeições

    let interpretacao = ''
    let cor = ''
    let recomendacoes: string[] = []

    if (proteinaDiaria >= 100) {
      interpretacao = 'Consumo ideal para seus objetivos!'
      cor = 'green'
      recomendacoes = [
        'Manter consumo proteico regular',
        'Distribuir entre 5 refeições',
        'Incluir fontes variadas de proteína',
        'Monitorar resultados mensais'
      ]
    } else if (proteinaDiaria >= 70) {
      interpretacao = 'Boa quantidade, pode aumentar para otimizar resultados.'
      cor = 'blue'
      recomendacoes = [
        'Aumentar consumo proteico gradualmente',
        'Incluir proteína em cada refeição',
        'Considerar suplementação',
        'Monitorar progresso'
      ]
    } else {
      interpretacao = 'Consumo abaixo do ideal para seus objetivos.'
      cor = 'orange'
      recomendacoes = [
        'Aumentar ingestão de proteína urgentemente',
        'Incluir fontes como carnes, ovos, leguminosas',
        'Considerar suplementação proteica',
        'Consultar especialista para plano personalizado'
      ]
    }

    setResultado({
      proteinaDiaria,
      porRefeicao,
      interpretacao,
      cor,
      recomendacoes
    })
    setEtapa('resultado')
  }

  const resetar = () => {
    setIdade('')
    setGenero('')
    setPeso('')
    setAltura('')
    setAtividade('')
    setObjetivo('')
    setResultado(null)
    setEtapa('formulario')
  }

  const voltarInicio = () => {
    setIdade('')
    setGenero('')
    setPeso('')
    setAltura('')
    setAtividade('')
    setObjetivo('')
    setResultado(null)
    setEtapa('landing')
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-xl font-bold text-gray-900">Calculadora de Proteína</h1>
                <p className="text-sm text-gray-600">Suas necessidades proteicas diárias</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {etapa === 'landing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💪</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Calculadora de Proteína</h2>
              <p className="text-xl text-gray-600 mb-2">
                Descubra quantas gramas de proteína você precisa por dia
              </p>
              <p className="text-gray-600 mb-6">
                Para atingir seus objetivos com saúde e resultados
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-8 border-2 border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">💡 Por que calcular sua proteína?</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Entenda suas necessidades individuais baseadas no seu perfil</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Saiba quanto consumir por refeição para melhores resultados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Otimize recuperação muscular e ganho de massa</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Receba recomendações personalizadas de fontes proteicas</span>
                </li>
              </ul>
            </div>

            <button
              onClick={iniciarCalculo}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              ▶️ Calcular Minha Proteína - É Grátis
            </button>
          </div>
        )}

        {etapa === 'formulario' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calcule sua proteína diária</h2>
              <p className="text-gray-600">Preencha os dados para descobrir suas necessidades proteicas personalizadas.</p>
            </div>

            <div className="space-y-6">
              {/* Idade */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <select
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              {/* Peso */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Altura */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Nível de Atividade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de atividade física <span className="text-red-500">*</span>
                </label>
                <select
                  value={atividade}
                  onChange={(e) => setAtividade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve (1-2x por semana)</option>
                  <option value="moderado">Moderado (3-4x por semana)</option>
                  <option value="intenso">Intenso (5-6x por semana)</option>
                  <option value="muito-intenso">Muito intenso (2x ao dia)</option>
                </select>
              </div>

              {/* Objetivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo <span className="text-red-500">*</span>
                </label>
                <select
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                >
                  <option value="">Selecione</option>
                  <option value="manter">Manter peso</option>
                  <option value="perder">Perder gordura</option>
                  <option value="ganhar">Ganhar massa muscular</option>
                </select>
              </div>
            </div>

            <button
              onClick={calcularProteina}
              className="w-full mt-8 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-[1.02] shadow-lg"
            >
              Calcular Proteína →
            </button>
          </div>
        )}

        {etapa === 'resultado' && resultado && (
          <div className="space-y-6">
            {/* Resultado */}
            <div className={`bg-white rounded-2xl shadow-lg p-8 border-4 ${bordas[resultado.cor]}`}>
              <div className="text-center mb-6">
                <div className={`inline-block px-8 py-4 rounded-full text-white font-bold text-2xl mb-4 ${cores[resultado.cor]}`}>
                  {resultado.proteinaDiaria}g de proteína/dia
                </div>
                <p className="text-sm text-gray-600 mb-2">Aproximadamente {resultado.porRefeicao}g por refeição</p>
                <p className="text-gray-800 text-xl">{resultado.interpretacao}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  Recomendações Importantes
                </h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA WhatsApp */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-center">
              <p className="text-white text-lg font-semibold mb-4">
                Quer ajuda para implementar essas quantidades no seu dia a dia?
              </p>
              <a
                href="https://wa.me/5511999999999?text=Olá! Calculei minhas necessidades proteicas diárias através do YLADA. Gostaria de saber mais sobre estratégias de implementação. Pode me ajudar?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
              >
                💬 Conversar com Especialista
              </a>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetar}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                ↺ Fazer Novo Cálculo
              </button>
              <button
                onClick={voltarInicio}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
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

