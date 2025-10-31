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

interface CTASettings {
  texto: string
  cor: string
  tamanhoFonte: string
  capturarDados: boolean
  urlRedirecionamento: string
  camposCaptura: string[]
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
  const [ctaSettings, setCtaSettings] = useState<CTASettings>({
    texto: 'Quero saber mais sobre meu resultado',
    cor: 'blue',
    tamanhoFonte: 'medium',
    capturarDados: true,
    urlRedirecionamento: '',
    camposCaptura: ['nome', 'email', 'telefone']
  })
  const [dadosCapturados, setDadosCapturados] = useState(false)

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

      // Recomendações específicas por profissão
      const recomendacoesPorProfissao = {
        nutri: {
          baixoPeso: [
            '📋 Avaliação nutricional completa para ganho de peso saudável',
            '🥗 Plano alimentar hipercalórico e nutritivo',
            '💊 Suplementação para aumento de massa muscular',
            '📅 Acompanhamento nutricional semanal'
          ],
          pesoNormal: [
            '📋 Manutenção do peso com alimentação equilibrada',
            '🥗 Plano alimentar para otimização da saúde',
            '💪 Estratégias para ganho de massa muscular',
            '📅 Consultas de manutenção mensais'
          ],
          sobrepeso: [
            '📋 Plano alimentar para redução de peso',
            '🥗 Reeducação alimentar e mudança de hábitos',
            '💊 Suplementação para controle do apetite',
            '📅 Acompanhamento nutricional quinzenal'
          ],
          obesidade: [
            '📋 Plano alimentar para redução de peso',
            '🥗 Reeducação alimentar completa',
            '💊 Suplementação para controle metabólico',
            '📅 Acompanhamento nutricional semanal intensivo'
          ]
        },
        sales: {
          baixoPeso: [
            '💊 Whey Protein para ganho de massa muscular',
            '🍯 Maltodextrina para aumento calórico',
            '🥛 Mass Gainer para ganho de peso',
            '📞 Consultoria personalizada de suplementação'
          ],
          pesoNormal: [
            '💊 Multivitamínicos para otimização da saúde',
            '🥗 Proteínas para manutenção muscular',
            '💪 Creatina para performance física',
            '📞 Consultoria de suplementação preventiva'
          ],
          sobrepeso: [
            '💊 Termogênicos para aceleração metabólica',
            '🥗 Proteínas para preservação muscular',
            '💪 L-Carnitina para queima de gordura',
            '📞 Consultoria de suplementação para emagrecimento'
          ],
          obesidade: [
            '💊 Suplementos para controle metabólico',
            '🥗 Proteínas para preservação muscular',
            '💪 Suplementos para redução de apetite',
            '📞 Consultoria especializada em suplementação'
          ]
        },
        coach: {
          baixoPeso: [
            '🧘‍♀️ Programa de ganho de peso saudável',
            '💪 Treinos para aumento de massa muscular',
            '🍎 Coaching nutricional para ganho de peso',
            '📅 Acompanhamento semanal de transformação'
          ],
          pesoNormal: [
            '🧘‍♀️ Programa de otimização da saúde',
            '💪 Treinos para manutenção e performance',
            '🍎 Coaching de hábitos saudáveis',
            '📅 Acompanhamento mensal de bem-estar'
          ],
          sobrepeso: [
            '🧘‍♀️ Programa de transformação corporal',
            '💪 Treinos para redução de peso',
            '🍎 Coaching de mudança de hábitos',
            '📅 Acompanhamento quinzenal de progresso'
          ],
          obesidade: [
            '🧘‍♀️ Programa intensivo de transformação',
            '💪 Treinos adaptados para início da jornada',
            '🍎 Coaching completo de mudança de vida',
            '📅 Acompanhamento semanal intensivo'
          ]
        }
      }

      // Determinar categoria do IMC para recomendações específicas
      let categoriaIMC = ''
      if (imc < 18.5) categoriaIMC = 'baixoPeso'
      else if (imc >= 18.5 && imc < 25) categoriaIMC = 'pesoNormal'
      else if (imc >= 25 && imc < 30) categoriaIMC = 'sobrepeso'
      else categoriaIMC = 'obesidade'

      setResultado({
        imc: imc.toFixed(1),
        classificacao,
        cor,
        recomendacoes,
        recomendacaoAtividade: recomendacoesAtividade[data.atividadeFisica],
        recomendacoesProfissao: recomendacoesPorProfissao[profissao][categoriaIMC],
        categoriaIMC
      })
      
      setStep(3)
    }
  }

  // Capturar dados do usuário
  const capturarDados = async () => {
    try {
      // Simular envio para backend/Supabase
      const dadosCompletos = {
        ...data,
        resultado,
        profissao,
        timestamp: new Date().toISOString(),
        ctaSettings
      }
      
      console.log('Dados capturados:', dadosCompletos)
      
      // Aqui seria feita a chamada real para o backend
      // await fetch('/api/leads', { method: 'POST', body: JSON.stringify(dadosCompletos) })
      
      setDadosCapturados(true)
      setStep(6) // Ir para página de sucesso
    } catch (error) {
      console.error('Erro ao capturar dados:', error)
    }
  }

  // Redirecionar baseado na profissão
  const redirecionar = () => {
    if (ctaSettings.urlRedirecionamento) {
      window.location.href = ctaSettings.urlRedirecionamento
    } else {
      const urls = {
        nutri: '/pt/nutri',
        sales: '/pt/nutra', 
        coach: '/pt/coach'
      }
      window.location.href = urls[profissao]
    }
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
              <span className="text-sm text-gray-600">{step}/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
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
                  <select
                    value={data.sexo}
                    onChange={(e) => setData({...data, sexo: e.target.value as 'masculino' | 'feminino'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  >
                    <option value="masculino">👨 Masculino</option>
                    <option value="feminino">👩 Feminino</option>
                  </select>
                </div>

                {/* Atividade Física */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Atividade Física *
                  </label>
                  <select
                    value={data.atividadeFisica}
                    onChange={(e) => setData({...data, atividadeFisica: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  >
                    <option value="sedentario">🛋️ Sedentário - Pouco ou nenhum exercício</option>
                    <option value="leve">🚶 Leve - Exercícios leves 1-3x/semana</option>
                    <option value="moderado">🏃 Moderado - Exercícios moderados 3-5x/semana</option>
                    <option value="intenso">💪 Intenso - Exercícios intensos 6-7x/semana</option>
                  </select>
                </div>

                {/* Profissão para Diagnóstico */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Para receber recomendações específicas, escolha sua área:
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'nutri', label: 'Nutricionista', icon: '🥗', color: 'green' },
                      { id: 'sales', label: 'Consultor Nutra', icon: '💊', color: 'blue' },
                      { id: 'coach', label: 'Coach de Bem-estar', icon: '🧘‍♀️', color: 'purple' }
                    ].map((opcao) => (
                      <button
                        key={opcao.id}
                        onClick={() => setProfissao(opcao.id as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          profissao === opcao.id 
                            ? `border-${opcao.color}-500 bg-${opcao.color}-50 text-${opcao.color}-700` 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <span className="text-lg mb-1 block">{opcao.icon}</span>
                        <div className="text-sm font-medium">{opcao.label}</div>
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

                {/* Recomendações por Profissão */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Recomendações Específicas ({profissao === 'nutri' ? 'Nutricionista' : profissao === 'sales' ? 'Consultor Nutra' : 'Coach'}):
                  </h4>
                  <ul className="space-y-1">
                    {resultado.recomendacoesProfissao.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">→</span>
                        <span className="text-purple-800 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
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
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Novo Cálculo
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
