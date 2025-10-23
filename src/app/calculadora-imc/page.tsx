'use client'

import { useState } from 'react'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'

interface IMCRecord {
  altura: number
  peso: number
  sexo: 'masculino' | 'feminino'
  atividadeFisica: 'sedentario' | 'leve' | 'moderado' | 'intenso'
  nome?: string
  email?: string
  telefone?: string
}

export default function CalculadoraIMC() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<IMCRecord>({
    altura: 0,
    peso: 0,
    sexo: 'masculino',
    atividadeFisica: 'sedentario'
  })
  const [resultado, setResultado] = useState<any>(null)
  const [profissao, setProfissao] = useState<'nutri' | 'sales' | 'coach'>('nutri')

  // Calcular IMC
  const calcularIMC = () => {
    if (data.altura > 0 && data.peso > 0) {
      const alturaMetros = data.altura / 100
      const imc = data.peso / (alturaMetros * alturaMetros)
      
      // Classificação por sexo (baseado na OMS)
      let classificacao = ''
      let cor = ''
      let recomendacoes = []
      
      if (imc < 18.5) {
        classificacao = 'Baixo peso'
        cor = 'text-blue-600'
        recomendacoes = [
          'Consulte um nutricionista para ganho de peso saudável',
          'Foque em alimentos nutritivos e calóricos',
          'Evite dietas restritivas'
        ]
      } else if (imc >= 18.5 && imc < 25) {
        classificacao = 'Peso normal'
        cor = 'text-green-600'
        recomendacoes = [
          'Mantenha hábitos alimentares equilibrados',
          'Continue praticando atividade física regular',
          'Monitore seu peso periodicamente'
        ]
      } else if (imc >= 25 && imc < 30) {
        classificacao = 'Sobrepeso'
        cor = 'text-yellow-600'
        recomendacoes = [
          'Consulte um nutricionista para orientação',
          'Aumente a atividade física gradualmente',
          'Foque em alimentos integrais e naturais'
        ]
      } else {
        classificacao = 'Obesidade'
        cor = 'text-red-600'
        recomendacoes = [
          'Consulte um médico e nutricionista',
          'Inicie atividade física com orientação',
          'Priorize mudanças graduais no estilo de vida'
        ]
      }

      // Recomendações baseadas na atividade física
      const recomendacoesAtividade = {
        sedentario: 'Considere iniciar atividades físicas leves, como caminhadas',
        leve: 'Mantenha sua rotina atual e considere aumentar gradualmente',
        moderado: 'Excelente! Continue com sua rotina de exercícios',
        intenso: 'Perfeito! Mantenha o equilíbrio entre exercício e descanso'
      }

      setResultado({
        imc: imc.toFixed(1),
        classificacao,
        cor,
        recomendacoes,
        recomendacaoAtividade: recomendacoesAtividade[data.atividadeFisica]
      })
      
      setStep(3)
    }
  }

  // Capturar dados do usuário
  const capturarDados = () => {
    // Aqui seria enviado para o backend/Supabase
    console.log('Dados capturados:', { ...data, resultado })
    setStep(4)
  }

  // Redirecionar baseado na profissão
  const redirecionar = () => {
    const urls = {
      nutri: '/pt/nutri',
      sales: '/pt/sales', 
      coach: '/pt/coach'
    }
    window.location.href = urls[profissao]
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/templates-environment">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Calculadora de IMC Inteligente
            </h1>
            <p className="text-gray-600">
              Descubra seu Índice de Massa Corporal com interpretação personalizada
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className="text-sm text-gray-600">{step}/4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Dados Básicos */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Dados Básicos</h2>
              
              <div className="space-y-6">
                {/* Altura */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm) *
                  </label>
                  <input
                    type="number"
                    value={data.altura || ''}
                    onChange={(e) => setData({...data, altura: Number(e.target.value)})}
                    placeholder="Ex: 175"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="100"
                    max="250"
                  />
                </div>

                {/* Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    value={data.peso || ''}
                    onChange={(e) => setData({...data, peso: Number(e.target.value)})}
                    placeholder="Ex: 70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="30"
                    max="300"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setData({...data, sexo: 'masculino'})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        data.sexo === 'masculino' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">👨</span>
                      Masculino
                    </button>
                    <button
                      onClick={() => setData({...data, sexo: 'feminino'})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        data.sexo === 'feminino' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">👩</span>
                      Feminino
                    </button>
                  </div>
                </div>

                {/* Atividade Física */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Atividade Física *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'sedentario', label: 'Sedentário', icon: '🛋️', desc: 'Pouco exercício' },
                      { id: 'leve', label: 'Leve', icon: '🚶', desc: '1-3x/semana' },
                      { id: 'moderado', label: 'Moderado', icon: '🏃', desc: '3-5x/semana' },
                      { id: 'intenso', label: 'Intenso', icon: '💪', desc: '6-7x/semana' }
                    ].map((opcao) => (
                      <button
                        key={opcao.id}
                        onClick={() => setData({...data, atividadeFisica: opcao.id as any})}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          data.atividadeFisica === opcao.id 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <span className="text-lg mr-2">{opcao.icon}</span>
                        <div>
                          <div className="font-medium">{opcao.label}</div>
                          <div className="text-xs text-gray-600">{opcao.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!data.altura || !data.peso}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Confirmação */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Confirme seus Dados</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Altura:</span>
                    <span className="font-medium ml-2">{data.altura} cm</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Peso:</span>
                    <span className="font-medium ml-2">{data.peso} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sexo:</span>
                    <span className="font-medium ml-2 capitalize">{data.sexo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Atividade:</span>
                    <span className="font-medium ml-2 capitalize">{data.atividadeFisica}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Voltar
                </button>
                <button
                  onClick={calcularIMC}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Calcular IMC
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resultado */}
          {step === 3 && resultado && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seu Resultado</h2>
              
              {/* IMC */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {resultado.imc}
                </div>
                <div className={`text-xl font-semibold ${resultado.cor}`}>
                  {resultado.classificacao}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Índice de Massa Corporal
                </div>
              </div>

              {/* Recomendações */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Recomendações Gerais:</h3>
                <ul className="space-y-2">
                  {resultado.recomendacoes.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Sobre sua Atividade Física:</h4>
                  <p className="text-blue-800">{resultado.recomendacaoAtividade}</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <p className="text-red-800 text-sm">
                  ⚠️ <strong>IMPORTANTE:</strong> Este cálculo é apenas informativo e educativo. 
                  Para recomendações específicas sobre sua saúde, consulte sempre 
                  um profissional qualificado (médico, nutricionista, etc.).
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Recalcular
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Configuração */}
          {step === 4 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configuração</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profissão do Usuário
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'nutri', label: 'Nutricionista', icon: '🥗' },
                      { id: 'sales', label: 'Vendedor', icon: '💼' },
                      { id: 'coach', label: 'Coach', icon: '🧘‍♀️' }
                    ].map((opcao) => (
                      <button
                        key={opcao.id}
                        onClick={() => setProfissao(opcao.id as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          profissao === opcao.id 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <span className="text-lg mb-1 block">{opcao.icon}</span>
                        <div className="text-sm font-medium">{opcao.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Ações Disponíveis:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Capturar dados do usuário</li>
                    <li>• Gerar relatório personalizado</li>
                    <li>• Redirecionar para página específica</li>
                    <li>• Agendar consulta/follow-up</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Voltar
                </button>
                <button
                  onClick={capturarDados}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  Capturar Dados
                </button>
                <button
                  onClick={redirecionar}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Redirecionar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              Calculadora de IMC YLADA
            </p>
            <p className="text-gray-500 text-xs">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
