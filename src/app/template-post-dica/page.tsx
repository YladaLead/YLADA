'use client'

import { useState } from 'react'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'

interface TemplatePostDica {
  profissao: 'nutri' | 'sales' | 'coach'
  categoria: 'dicaBasica' | 'dicaModerada' | 'dicaAvancada'
  tipoPost: 'post-unico' | 'carrossel' | 'stories'
  tema: string
  titulo: string
  dicaPrincipal: string
  explicacao: string
  callToAction: string
  hashtags: string[]
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

export default function TemplatePostDica() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<TemplatePostDica>({
    profissao: 'nutri',
    categoria: 'dicaBasica',
    tipoPost: 'post-unico',
    tema: '',
    titulo: '',
    dicaPrincipal: '',
    explicacao: '',
    callToAction: '',
    hashtags: []
  })
  const [resultado, setResultado] = useState<any>(null)
  const [ctaSettings, setCtaSettings] = useState<CTASettings>({
    texto: 'Quero mais dicas como esta',
    cor: 'blue',
    tamanhoFonte: 'medium',
    capturarDados: true,
    urlRedirecionamento: '',
    camposCaptura: ['nome', 'email', 'telefone']
  })
  const [dadosCapturados, setDadosCapturados] = useState(false)

  // Temas de dicas por profissão
  const temasDicas = {
    nutri: {
      dicaBasica: [
        'Como escolher frutas frescas',
        'Dicas para beber mais água',
        'Como organizar a geladeira',
        'Dicas para comer mais vegetais',
        'Como fazer lanches saudáveis'
      ],
      dicaModerada: [
        'Como ler rótulos nutricionais',
        'Dicas para melhorar a digestão',
        'Como combinar alimentos',
        'Dicas para controlar porções',
        'Como fazer meal prep'
      ],
      dicaAvancada: [
        'Timing nutricional para atletas',
        'Dicas para otimizar absorção de nutrientes',
        'Como personalizar macros',
        'Dicas para inflamação crônica',
        'Como otimizar microbiota intestinal'
      ]
    },
    sales: {
      dicaBasica: [
        'Como escolher multivitamínico',
        'Dicas para tomar suplementos',
        'Como armazenar produtos',
        'Dicas para melhorar absorção',
        'Como ler rótulos de suplementos'
      ],
      dicaModerada: [
        'Como combinar suplementos',
        'Dicas para timing de suplementação',
        'Como escolher qualidade',
        'Dicas para resultados',
        'Como fazer protocolos'
      ],
      dicaAvancada: [
        'Protocolos personalizados',
        'Dicas para atletas',
        'Como otimizar biodisponibilidade',
        'Dicas para anti-envelhecimento',
        'Como fazer ciclos'
      ]
    },
    coach: {
      dicaBasica: [
        'Como criar rotina matinal',
        'Dicas para melhorar sono',
        'Como gerenciar estresse',
        'Dicas para mais energia',
        'Como criar hábitos'
      ],
      dicaModerada: [
        'Como manter motivação',
        'Dicas para equilíbrio',
        'Como definir metas',
        'Dicas para produtividade',
        'Como fazer mudanças'
      ],
      dicaAvancada: [
        'Como otimizar performance',
        'Dicas para liderança',
        'Como criar mindset',
        'Dicas para transformação',
        'Como fazer coaching'
      ]
    }
  }

  // Hashtags por profissão
  const hashtagsPorProfissao = {
    nutri: ['#nutricao', '#saude', '#alimentacaosaudavel', '#nutricionista', '#bemestar'],
    sales: ['#suplementos', '#nutraceuticos', '#saude', '#bemestar', '#qualidade'],
    coach: ['#coaching', '#bemestar', '#transformacao', '#habitos', '#motivacao']
  }

  // Gerar template baseado na profissão e categoria
  const gerarTemplate = () => {
    if (!data.tema || !data.titulo || !data.dicaPrincipal || !data.explicacao || !data.callToAction) {
      alert('Por favor, preencha todos os campos antes de continuar.')
      return
    }

    const dicasPorProfissao = {
      nutri: {
        dicaBasica: [
          '📝 DIAGNÓSTICO: Você precisa de template básico com dicas para conteúdo recorrente',
          '🔍 CAUSA RAIZ: Necessidade de conteúdo recorrente simples e eficaz através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente template básico com dicas por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de template básico com dicas',
          '💊 SUPLEMENTAÇÃO: Multivitamínico + Ômega-3 + Probióticos básicos',
          '🍎 ALIMENTAÇÃO: Foque em template básico com dicas e sustentável'
        ],
        dicaModerada: [
          '📝 DIAGNÓSTICO: Você precisa de template moderado com dicas para conteúdo recorrente',
          '🔍 CAUSA RAIZ: Necessidade de conteúdo recorrente com critérios específicos através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente template moderado com dicas por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de template moderado com dicas',
          '💊 SUPLEMENTAÇÃO: Suplementos específicos + Adaptógenos + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Compare template moderado com dicas funcional e superalimentos'
        ],
        dicaAvancada: [
          '📝 DIAGNÓSTICO: Você precisa de template avançado com dicas para conteúdo recorrente',
          '🔍 CAUSA RAIZ: Necessidade de conteúdo recorrente sofisticado e completo através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente template avançado com dicas por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de template avançado com dicas',
          '💊 SUPLEMENTAÇÃO: Suplementos premium + Nutracêuticos + Fitoquímicos',
          '🍎 ALIMENTAÇÃO: Compare template avançado com dicas orgânico e produtos gourmet'
        ]
      },
      sales: {
        dicaBasica: [
          '📝 DIAGNÓSTICO: Você precisa de produtos básicos para conteúdo recorrente através de dicas',
          '🔍 CAUSA RAIZ: Necessidade de produtos básicos para conteúdo recorrente através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente produtos básicos por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos básicos',
          '💊 SUPLEMENTAÇÃO: Produtos básicos + Suplementos essenciais + Multivitamínico',
          '🍎 ALIMENTAÇÃO: Alimentos básicos para sustentar conteúdo recorrente através de dicas'
        ],
        dicaModerada: [
          '📝 DIAGNÓSTICO: Você precisa de produtos moderados para conteúdo recorrente através de dicas',
          '🔍 CAUSA RAIZ: Necessidade de produtos específicos para conteúdo recorrente através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente produtos moderados por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos moderados',
          '💊 SUPLEMENTAÇÃO: Produtos específicos + Suplementos especializados + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Alimentos específicos para potencializar conteúdo recorrente através de dicas'
        ],
        dicaAvancada: [
          '📝 DIAGNÓSTICO: Você precisa de produtos avançados para conteúdo recorrente através de dicas',
          '🔍 CAUSA RAIZ: Necessidade de produtos premium para conteúdo recorrente através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente produtos avançados por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos avançados',
          '💊 SUPLEMENTAÇÃO: Produtos premium + Nutracêuticos + Adaptógenos + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Alimentos funcionais para sustentar conteúdo recorrente através de dicas avançado'
        ]
      },
      coach: {
        dicaBasica: [
          '🌱 DIAGNÓSTICO: Você precisa de coaching básico com conteúdo recorrente através de dicas',
          '🔍 CAUSA RAIZ: Necessidade de orientação básica em conteúdo recorrente através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente coaching básico por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching básico',
          '💊 SUPLEMENTAÇÃO: Produtos naturais básicos e suplementos essenciais',
          '🍎 ALIMENTAÇÃO: Foque em conceitos básicos de conteúdo recorrente através de dicas'
        ],
        dicaModerada: [
          '🌼 DIAGNÓSTICO: Você precisa de coaching moderado com conteúdo recorrente através de dicas',
          '🔍 CAUSA RAIZ: Necessidade de orientação moderada em conteúdo recorrente através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente coaching moderado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching moderado',
          '💊 SUPLEMENTAÇÃO: Produtos naturais específicos e suplementos especializados',
          '🍎 ALIMENTAÇÃO: Compare conteúdo recorrente através de dicas funcional e superalimentos'
        ],
        dicaAvancada: [
          '🔆 DIAGNÓSTICO: Você precisa de coaching avançado com conteúdo recorrente através de dicas',
          '🔍 CAUSA RAIZ: Necessidade de orientação avançada em conteúdo recorrente através de dicas',
          '⚡ AÇÃO IMEDIATA: Implemente coaching avançado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching avançado',
          '💊 SUPLEMENTAÇÃO: Adaptógenos e superalimentos para sustentar conteúdo recorrente através de dicas',
          '🍎 ALIMENTAÇÃO: Conteúdo recorrente através de dicas consciente e funcional mantido'
        ]
      }
    }

    const diagnosticos = dicasPorProfissao[data.profissao][data.categoria]
    
    // CTAs específicos por profissão
    const ctasPorProfissao = {
      nutri: {
        dicaBasica: 'Quero mais dicas nutricionais',
        dicaModerada: 'Quero dicas específicas para minha área',
        dicaAvancada: 'Quero dicas científicas avançadas'
      },
      sales: {
        dicaBasica: 'Quero produtos básicos',
        dicaModerada: 'Quero produtos específicos',
        dicaAvancada: 'Quero produtos premium'
      },
      coach: {
        dicaBasica: 'Quero coaching básico',
        dicaModerada: 'Quero coaching específico',
        dicaAvancada: 'Quero coaching avançado'
      }
    }

    setResultado({
      tema: data.tema,
      titulo: data.titulo,
      dicaPrincipal: data.dicaPrincipal,
      explicacao: data.explicacao,
      callToAction: data.callToAction,
      hashtags: hashtagsPorProfissao[data.profissao],
      tipoPost: data.tipoPost,
      diagnosticos,
      cta: ctasPorProfissao[data.profissao][data.categoria],
      profissao: data.profissao,
      categoria: data.categoria
    })
    
    setStep(3)
  }

  // Capturar dados do usuário
  const capturarDados = async () => {
    try {
      const dadosCompletos = {
        ...data,
        resultado,
        timestamp: new Date().toISOString(),
        ctaSettings
      }
      
      console.log('Dados capturados:', dadosCompletos)
      
      setDadosCapturados(true)
      setStep(4) // Ir para página de sucesso
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
      window.location.href = urls[data.profissao]
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
              <span className="text-2xl">📝</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Template de Post com Dica
            </h1>
            <p className="text-gray-600">
              Crie posts com dicas práticas para conteúdo recorrente e engajamento
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

          {/* Step 1: Configuração */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configuração do Template</h2>
              
              <div className="space-y-6">
                {/* Profissão */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profissão *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'nutri', label: 'Nutricionista', icon: '🥗', color: 'green' },
                      { id: 'sales', label: 'Consultor Nutra', icon: '💊', color: 'blue' },
                      { id: 'coach', label: 'Coach de Bem-estar', icon: '🧘‍♀️', color: 'purple' }
                    ].map((opcao) => (
                      <button
                        key={opcao.id}
                        onClick={() => setData({...data, profissao: opcao.id as any})}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          data.profissao === opcao.id 
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

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Complexidade *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dicaBasica', label: 'Básico', desc: 'Post simples', color: 'blue' },
                      { id: 'dicaModerada', label: 'Moderado', desc: 'Post específico', color: 'green' },
                      { id: 'dicaAvancada', label: 'Avançado', desc: 'Post complexo', color: 'yellow' }
                    ].map((opcao) => (
                      <button
                        key={opcao.id}
                        onClick={() => setData({...data, categoria: opcao.id as any})}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          data.categoria === opcao.id 
                            ? `border-${opcao.color}-500 bg-${opcao.color}-50 text-${opcao.color}-700` 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-sm font-medium">{opcao.label}</div>
                        <div className="text-xs text-gray-500">{opcao.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tipo de Post */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Post *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'post-unico', label: 'Post Único', desc: 'Feed', icon: '📱' },
                      { id: 'carrossel', label: 'Carrossel', desc: 'Múltiplas imagens', icon: '🔄' },
                      { id: 'stories', label: 'Stories', desc: '24h', icon: '📸' }
                    ].map((opcao) => (
                      <button
                        key={opcao.id}
                        onClick={() => setData({...data, tipoPost: opcao.id as any})}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          data.tipoPost === opcao.id 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <span className="text-lg mb-1 block">{opcao.icon}</span>
                        <div className="text-sm font-medium">{opcao.label}</div>
                        <div className="text-xs text-gray-500">{opcao.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tema */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema da Dica *
                  </label>
                  <select
                    value={data.tema}
                    onChange={(e) => setData({...data, tema: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  >
                    <option value="">Selecione um tema</option>
                    {temasDicas[data.profissao][data.categoria].map((tema, index) => (
                      <option key={index} value={tema}>{tema}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!data.tema}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Conteúdo */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Conteúdo do Post</h2>
              
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Chamativo *
                  </label>
                  <input
                    type="text"
                    value={data.titulo}
                    onChange={(e) => setData({...data, titulo: e.target.value})}
                    placeholder="Ex: 5 Dicas Infalíveis para..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Dica Principal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dica Principal *
                  </label>
                  <textarea
                    value={data.dicaPrincipal}
                    onChange={(e) => setData({...data, dicaPrincipal: e.target.value})}
                    placeholder="Ex: Sempre leia os ingredientes antes de comprar qualquer produto..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                  />
                </div>

                {/* Explicação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explicação Detalhada *
                  </label>
                  <textarea
                    value={data.explicacao}
                    onChange={(e) => setData({...data, explicacao: e.target.value})}
                    placeholder="Ex: Os ingredientes são listados em ordem decrescente de quantidade..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  />
                </div>

                {/* Call to Action */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call to Action *
                  </label>
                  <input
                    type="text"
                    value={data.callToAction}
                    onChange={(e) => setData({...data, callToAction: e.target.value})}
                    placeholder="Ex: Salve este post e teste hoje mesmo!"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Voltar
                </button>
                <button
                  onClick={gerarTemplate}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Gerar Template
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resultado */}
          {step === 3 && resultado && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seu Template de Post</h2>
              
              {/* Preview do Post */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">📝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dica do Dia</h3>
                    <p className="text-sm text-gray-600">{resultado.tema}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">{resultado.titulo}</h4>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Dica:</h4>
                    <p className="text-gray-700">{resultado.dicaPrincipal}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📖 Explicação:</h4>
                    <p className="text-gray-700">{resultado.explicacao}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🎯 Call to Action:</h4>
                    <p className="text-gray-700">{resultado.callToAction}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2"># Hashtags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {resultado.hashtags.map((hashtag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnósticos */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Diagnósticos Específicos:</h3>
                <ul className="space-y-2">
                  {resultado.diagnosticos.map((diagnostico: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{diagnostico}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <p className="text-red-800 text-sm">
                  ⚠️ <strong>IMPORTANTE:</strong> Este template é apenas informativo e educativo. 
                  Para recomendações específicas sobre sua saúde, consulte sempre 
                  um profissional qualificado (médico, nutricionista, etc.).
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Novo Template
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Captura de Dados */}
          {step === 4 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Capturar Dados</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={data.nome || ''}
                    onChange={(e) => setData({...data, nome: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email || ''}
                    onChange={(e) => setData({...data, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={data.telefone || ''}
                    onChange={(e) => setData({...data, telefone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={capturarDados}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                  Salvar e Continuar
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
              Template de Post com Dica YLADA
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
