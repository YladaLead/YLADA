'use client'

import { useState } from 'react'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'

interface TemplateReelsRoteirizado {
  profissao: 'nutri' | 'sales' | 'coach'
  categoria: 'reelsBasico' | 'reelsModerado' | 'reelsAvancado'
  tipoReels: 'educativo' | 'demonstracao' | 'storytelling'
  tema: string
  titulo: string
  hook: string
  desenvolvimento: string[]
  conclusao: string
  callToAction: string
  hashtags: string[]
  duracao: number
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

export default function TemplateReelsRoteirizado() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<TemplateReelsRoteirizado>({
    profissao: 'nutri',
    categoria: 'reelsBasico',
    tipoReels: 'educativo',
    tema: '',
    titulo: '',
    hook: '',
    desenvolvimento: [''],
    conclusao: '',
    callToAction: '',
    hashtags: [],
    duracao: 15
  })
  const [resultado, setResultado] = useState<any>(null)
  const [ctaSettings, setCtaSettings] = useState<CTASettings>({
    texto: 'Quero mais reels como este',
    cor: 'purple',
    tamanhoFonte: 'medium',
    capturarDados: true,
    urlRedirecionamento: '',
    camposCaptura: ['nome', 'email', 'telefone']
  })
  const [dadosCapturados, setDadosCapturados] = useState(false)

  // Temas de reels por profissão
  const temasReels = {
    nutri: {
      reelsBasico: [
        '3 alimentos que você deve evitar',
        'Como fazer uma salada perfeita',
        '5 dicas para beber mais água',
        'Como escolher frutas frescas',
        '3 erros na alimentação'
      ],
      reelsModerado: [
        'Como ler rótulos nutricionais',
        'Meal prep para iniciantes',
        'Como combinar proteínas',
        'Dicas para melhorar digestão',
        'Como controlar porções'
      ],
      reelsAvancado: [
        'Timing nutricional para atletas',
        'Como otimizar absorção de nutrientes',
        'Protocolos para inflamação',
        'Microbiota intestinal',
        'Personalização de macros'
      ]
    },
    sales: {
      reelsBasico: [
        '3 suplementos essenciais',
        'Como escolher multivitamínico',
        '5 erros na suplementação',
        'Como tomar whey protein',
        'Dicas para melhorar absorção'
      ],
      reelsModerado: [
        'Como combinar suplementos',
        'Timing ideal de suplementação',
        'Como escolher qualidade',
        'Protocolos para resultados',
        'Dicas para atletas'
      ],
      reelsAvancado: [
        'Protocolos personalizados',
        'Biodisponibilidade de nutrientes',
        'Ciclos de suplementação',
        'Anti-envelhecimento',
        'Performance otimizada'
      ]
    },
    coach: {
      reelsBasico: [
        '3 hábitos matinais essenciais',
        'Como criar rotina de sono',
        '5 dicas para mais energia',
        'Como gerenciar estresse',
        'Hábitos para transformação'
      ],
      reelsModerado: [
        'Como manter motivação',
        'Equilíbrio vida pessoal',
        'Como definir metas',
        'Produtividade máxima',
        'Mudança de mindset'
      ],
      reelsAvancado: [
        'Otimização de performance',
        'Liderança transformacional',
        'Coaching avançado',
        'Transformação completa',
        'Mindset de sucesso'
      ]
    }
  }

  // Hashtags por profissão
  const hashtagsPorProfissao = {
    nutri: ['#nutricao', '#saude', '#alimentacaosaudavel', '#nutricionista', '#bemestar', '#reelsnutricao'],
    sales: ['#suplementos', '#nutraceuticos', '#saude', '#bemestar', '#qualidade', '#reelssuplementos'],
    coach: ['#coaching', '#bemestar', '#transformacao', '#habitos', '#motivacao', '#reelscoaching']
  }

  // Adicionar ponto de desenvolvimento
  const adicionarDesenvolvimento = () => {
    setData({...data, desenvolvimento: [...data.desenvolvimento, '']})
  }

  // Remover ponto de desenvolvimento
  const removerDesenvolvimento = (index: number) => {
    const novosDesenvolvimentos = data.desenvolvimento.filter((_, i) => i !== index)
    setData({...data, desenvolvimento: novosDesenvolvimentos})
  }

  // Gerar template baseado na profissão e categoria
  const gerarTemplate = () => {
    if (!data.tema || !data.titulo || !data.hook || !data.conclusao || !data.callToAction) {
      alert('Por favor, preencha todos os campos obrigatórios antes de continuar.')
      return
    }

    const reelsPorProfissao = {
      nutri: {
        reelsBasico: [
          '🎬 DIAGNÓSTICO: Você precisa de reels básico roteirizado para captação visual',
          '🔍 CAUSA RAIZ: Necessidade de captação visual simples e eficaz através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente reels básico roteirizado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de reels básico roteirizado',
          '💊 SUPLEMENTAÇÃO: Multivitamínico + Ômega-3 + Probióticos básicos',
          '🍎 ALIMENTAÇÃO: Foque em reels básico roteirizado e sustentável'
        ],
        reelsModerado: [
          '🎬 DIAGNÓSTICO: Você precisa de reels moderado roteirizado para captação visual',
          '🔍 CAUSA RAIZ: Necessidade de captação visual com critérios específicos através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente reels moderado roteirizado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de reels moderado roteirizado',
          '💊 SUPLEMENTAÇÃO: Suplementos específicos + Adaptógenos + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Compare reels moderado roteirizado funcional e superalimentos'
        ],
        reelsAvancado: [
          '🎬 DIAGNÓSTICO: Você precisa de reels avançado roteirizado para captação visual',
          '🔍 CAUSA RAIZ: Necessidade de captação visual sofisticada e completa através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente reels avançado roteirizado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de reels avançado roteirizado',
          '💊 SUPLEMENTAÇÃO: Suplementos premium + Nutracêuticos + Fitoquímicos',
          '🍎 ALIMENTAÇÃO: Compare reels avançado roteirizado orgânico e produtos gourmet'
        ]
      },
      sales: {
        reelsBasico: [
          '🎬 DIAGNÓSTICO: Você precisa de produtos básicos para captação visual através de reels',
          '🔍 CAUSA RAIZ: Necessidade de produtos básicos para captação visual através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente produtos básicos por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos básicos',
          '💊 SUPLEMENTAÇÃO: Produtos básicos + Suplementos essenciais + Multivitamínico',
          '🍎 ALIMENTAÇÃO: Alimentos básicos para sustentar captação visual através de reels'
        ],
        reelsModerado: [
          '🎬 DIAGNÓSTICO: Você precisa de produtos moderados para captação visual através de reels',
          '🔍 CAUSA RAIZ: Necessidade de produtos específicos para captação visual através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente produtos moderados por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos moderados',
          '💊 SUPLEMENTAÇÃO: Produtos específicos + Suplementos especializados + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Alimentos específicos para potencializar captação visual através de reels'
        ],
        reelsAvancado: [
          '🎬 DIAGNÓSTICO: Você precisa de produtos avançados para captação visual através de reels',
          '🔍 CAUSA RAIZ: Necessidade de produtos premium para captação visual através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente produtos avançados por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos avançados',
          '💊 SUPLEMENTAÇÃO: Produtos premium + Nutracêuticos + Adaptógenos + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Alimentos funcionais para sustentar captação visual através de reels avançado'
        ]
      },
      coach: {
        reelsBasico: [
          '🌱 DIAGNÓSTICO: Você precisa de coaching básico com captação visual através de reels',
          '🔍 CAUSA RAIZ: Necessidade de orientação básica em captação visual através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente coaching básico por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching básico',
          '💊 SUPLEMENTAÇÃO: Produtos naturais básicos e suplementos essenciais',
          '🍎 ALIMENTAÇÃO: Foque em conceitos básicos de captação visual através de reels'
        ],
        reelsModerado: [
          '🌼 DIAGNÓSTICO: Você precisa de coaching moderado com captação visual através de reels',
          '🔍 CAUSA RAIZ: Necessidade de orientação moderada em captação visual através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente coaching moderado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching moderado',
          '💊 SUPLEMENTAÇÃO: Produtos naturais específicos e suplementos especializados',
          '🍎 ALIMENTAÇÃO: Compare captação visual através de reels funcional e superalimentos'
        ],
        reelsAvancado: [
          '🔆 DIAGNÓSTICO: Você precisa de coaching avançado com captação visual através de reels',
          '🔍 CAUSA RAIZ: Necessidade de orientação avançada em captação visual através de reels',
          '⚡ AÇÃO IMEDIATA: Implemente coaching avançado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching avançado',
          '💊 SUPLEMENTAÇÃO: Adaptógenos e superalimentos para sustentar captação visual através de reels',
          '🍎 ALIMENTAÇÃO: Captação visual através de reels consciente e funcional mantido'
        ]
      }
    }

    const diagnosticos = reelsPorProfissao[data.profissao][data.categoria]
    
    // CTAs específicos por profissão
    const ctasPorProfissao = {
      nutri: {
        reelsBasico: 'Quero mais reels nutricionais',
        reelsModerado: 'Quero reels específicos para minha área',
        reelsAvancado: 'Quero reels científicos avançados'
      },
      sales: {
        reelsBasico: 'Quero produtos básicos',
        reelsModerado: 'Quero produtos específicos',
        reelsAvancado: 'Quero produtos premium'
      },
      coach: {
        reelsBasico: 'Quero coaching básico',
        reelsModerado: 'Quero coaching específico',
        reelsAvancado: 'Quero coaching avançado'
      }
    }

    setResultado({
      tema: data.tema,
      titulo: data.titulo,
      hook: data.hook,
      desenvolvimento: data.desenvolvimento.filter(d => d.trim() !== ''),
      conclusao: data.conclusao,
      callToAction: data.callToAction,
      hashtags: hashtagsPorProfissao[data.profissao],
      tipoReels: data.tipoReels,
      duracao: data.duracao,
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
        coach: '/pt/c'
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
            <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Template de Reels Roteirizado
            </h1>
            <p className="text-gray-600">
              Crie reels estruturados e envolventes para máxima captação visual
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
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Configuração */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configuração do Reels</h2>
              
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
                      { id: 'reelsBasico', label: 'Básico', desc: 'Roteiro simples', color: 'blue' },
                      { id: 'reelsModerado', label: 'Moderado', desc: 'Roteiro específico', color: 'green' },
                      { id: 'reelsAvancado', label: 'Avançado', desc: 'Roteiro complexo', color: 'yellow' }
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

                {/* Tipo de Reels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Reels *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'educativo', label: 'Educativo', desc: 'Ensina algo', icon: '🎓' },
                      { id: 'demonstracao', label: 'Demonstração', desc: 'Mostra processo', icon: '👨‍🍳' },
                      { id: 'storytelling', label: 'Storytelling', desc: 'Conta história', icon: '📖' }
                    ].map((opcao) => (
                      <button
                        key={opcao.id}
                        onClick={() => setData({...data, tipoReels: opcao.id as any})}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          data.tipoReels === opcao.id 
                            ? 'border-purple-500 bg-purple-50 text-purple-700' 
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

                {/* Duração */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duração do Reels (segundos) *
                  </label>
                  <select
                    value={data.duracao}
                    onChange={(e) => setData({...data, duracao: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                  >
                    <option value={15}>15 segundos</option>
                    <option value={30}>30 segundos</option>
                    <option value={60}>60 segundos</option>
                    <option value={90}>90 segundos</option>
                  </select>
                </div>

                {/* Tema */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema do Reels *
                  </label>
                  <select
                    value={data.tema}
                    onChange={(e) => setData({...data, tema: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
                  >
                    <option value="">Selecione um tema</option>
                    {temasReels[data.profissao][data.categoria].map((tema, index) => (
                      <option key={index} value={tema}>{tema}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!data.tema}
                  className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Roteiro */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Roteiro do Reels</h2>
              
              <div className="space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Reels *
                  </label>
                  <input
                    type="text"
                    value={data.titulo}
                    onChange={(e) => setData({...data, titulo: e.target.value})}
                    placeholder="Ex: 3 Alimentos que Você Deve Evitar"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Hook */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hook (Primeiros 3 segundos) *
                  </label>
                  <textarea
                    value={data.hook}
                    onChange={(e) => setData({...data, hook: e.target.value})}
                    placeholder="Ex: Você está comendo esses 3 alimentos todos os dias e não sabe o mal que fazem..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Máximo 3 segundos de fala</p>
                </div>

                {/* Desenvolvimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desenvolvimento (Pontos principais) *
                  </label>
                  {data.desenvolvimento.map((ponto, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={ponto}
                        onChange={(e) => {
                          const novosDesenvolvimentos = [...data.desenvolvimento]
                          novosDesenvolvimentos[index] = e.target.value
                          setData({...data, desenvolvimento: novosDesenvolvimentos})
                        }}
                        placeholder={`Ponto ${index + 1}: Ex: Primeiro alimento é o açúcar refinado...`}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {data.desenvolvimento.length > 1 && (
                        <button
                          onClick={() => removerDesenvolvimento(index)}
                          className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={adicionarDesenvolvimento}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-300 mt-2"
                  >
                    + Adicionar Ponto
                  </button>
                </div>

                {/* Conclusão */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conclusão *
                  </label>
                  <textarea
                    value={data.conclusao}
                    onChange={(e) => setData({...data, conclusao: e.target.value})}
                    placeholder="Ex: Agora você sabe quais alimentos evitar. Salve este post e comece hoje mesmo!"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-20 resize-none"
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
                    placeholder="Ex: Segue para mais dicas como esta!"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-300"
                >
                  Gerar Roteiro
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resultado */}
          {step === 3 && resultado && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seu Roteiro de Reels</h2>
              
              {/* Preview do Roteiro */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">🎬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Reels Roteirizado</h3>
                    <p className="text-sm text-gray-600">{resultado.tema} • {resultado.duracao}s</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">{resultado.titulo}</h4>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🎯 Hook (0-3s):</h4>
                    <p className="text-gray-700">{resultado.hook}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📝 Desenvolvimento:</h4>
                    <ul className="space-y-2">
                      {resultado.desenvolvimento.map((ponto: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🎬 Conclusão:</h4>
                    <p className="text-gray-700">{resultado.conclusao}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📢 Call to Action:</h4>
                    <p className="text-gray-700">{resultado.callToAction}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2"># Hashtags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {resultado.hashtags.map((hashtag: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
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
                      <span className="text-purple-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{diagnostico}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <p className="text-red-800 text-sm">
                  ⚠️ <strong>IMPORTANTE:</strong> Este roteiro é apenas informativo e educativo. 
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
                  className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-300"
                >
                  Novo Roteiro
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={capturarDados}
                  className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-300"
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
              Template de Reels Roteirizado YLADA
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
