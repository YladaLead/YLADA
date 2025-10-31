'use client'

import { useState } from 'react'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'

interface PostCuriosidades {
  profissao: 'nutri' | 'sales' | 'coach'
  categoria: 'curiosidadeBasica' | 'curiosidadeModerada' | 'curiosidadeAvancada'
  tema: string
  curiosidade: string
  explicacao: string
  dicaPratica: string
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

export default function PostCuriosidades() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<PostCuriosidades>({
    profissao: 'nutri',
    categoria: 'curiosidadeBasica',
    tema: '',
    curiosidade: '',
    explicacao: '',
    dicaPratica: ''
  })
  const [resultado, setResultado] = useState<any>(null)
  const [ctaSettings, setCtaSettings] = useState<CTASettings>({
    texto: 'Quero mais curiosidades como esta',
    cor: 'blue',
    tamanhoFonte: 'medium',
    capturarDados: true,
    urlRedirecionamento: '',
    camposCaptura: ['nome', 'email', 'telefone']
  })
  const [dadosCapturados, setDadosCapturados] = useState(false)

  // Temas de curiosidades por profissão
  const temasCuriosidades = {
    nutri: {
      curiosidadeBasica: [
        'Por que sentimos fome?',
        'O que acontece quando não bebemos água?',
        'Por que precisamos de proteína?',
        'O que são vitaminas?',
        'Por que frutas são doces?'
      ],
      curiosidadeModerada: [
        'Como o intestino afeta o humor?',
        'Por que alguns alimentos causam inchaço?',
        'Como a digestão funciona?',
        'O que são probióticos?',
        'Por que precisamos de fibras?'
      ],
      curiosidadeAvancada: [
        'Como os micronutrientes afetam a expressão gênica?',
        'O papel dos fitoquímicos na prevenção do câncer',
        'Como a microbiota intestinal influencia o sistema imunológico',
        'A relação entre inflamação crônica e doenças metabólicas',
        'Como os antioxidantes protegem o DNA'
      ]
    },
    sales: {
      curiosidadeBasica: [
        'Por que suplementos são importantes?',
        'O que são multivitamínicos?',
        'Por que precisamos de ômega-3?',
        'O que são probióticos?',
        'Por que proteína em pó funciona?'
      ],
      curiosidadeModerada: [
        'Como escolher o suplemento certo?',
        'Por que timing é importante?',
        'O que são adaptógenos?',
        'Como suplementos melhoram performance?',
        'Por que qualidade importa?'
      ],
      curiosidadeAvancada: [
        'Biodisponibilidade e absorção de nutrientes',
        'Sinergia entre micronutrientes',
        'Personalização baseada em genética',
        'Tecnologia de liberação controlada',
        'Pesquisas clínicas em nutracêuticos'
      ]
    },
    coach: {
      curiosidadeBasica: [
        'Por que exercício faz bem?',
        'O que é bem-estar?',
        'Por que precisamos dormir?',
        'O que é estresse?',
        'Por que respiração é importante?'
      ],
      curiosidadeModerada: [
        'Como mente afeta o corpo?',
        'Por que hábitos são poderosos?',
        'O que é mindfulness?',
        'Como gerenciar energia?',
        'Por que conexão social importa?'
      ],
      curiosidadeAvancada: [
        'Neuroplasticidade e mudança de hábitos',
        'Psiconeuroimunologia e saúde',
        'Cronobiologia e ritmos circadianos',
        'Epigenética e estilo de vida',
        'Medicina integrativa e holística'
      ]
    }
  }

  // Gerar post baseado na profissão e categoria
  const gerarPost = () => {
    if (!data.tema || !data.curiosidade || !data.explicacao || !data.dicaPratica) {
      alert('Por favor, preencha todos os campos antes de continuar.')
      return
    }

    const curiosidadesPorProfissao = {
      nutri: {
        curiosidadeBasica: [
          '📋 DIAGNÓSTICO: Você precisa de post básico com curiosidades para autoridade',
          '🔍 CAUSA RAIZ: Necessidade de autoridade simples e eficaz através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente post básico com curiosidades por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de post básico com curiosidades',
          '💊 SUPLEMENTAÇÃO: Multivitamínico + Ômega-3 + Probióticos básicos',
          '🍎 ALIMENTAÇÃO: Foque em post básico com curiosidades e sustentável'
        ],
        curiosidadeModerada: [
          '📋 DIAGNÓSTICO: Você precisa de post moderado com curiosidades para autoridade',
          '🔍 CAUSA RAIZ: Necessidade de autoridade com critérios específicos através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente post moderado com curiosidades por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de post moderado com curiosidades',
          '💊 SUPLEMENTAÇÃO: Suplementos específicos + Adaptógenos + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Compare post moderado com curiosidades funcional e superalimentos'
        ],
        curiosidadeAvancada: [
          '📋 DIAGNÓSTICO: Você precisa de post avançado com curiosidades para autoridade',
          '🔍 CAUSA RAIZ: Necessidade de autoridade sofisticada e completa através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente post avançado com curiosidades por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de post avançado com curiosidades',
          '💊 SUPLEMENTAÇÃO: Suplementos premium + Nutracêuticos + Fitoquímicos',
          '🍎 ALIMENTAÇÃO: Compare post avançado com curiosidades orgânico e produtos gourmet'
        ]
      },
      sales: {
        curiosidadeBasica: [
          '📋 DIAGNÓSTICO: Você precisa de produtos básicos para autoridade através de curiosidades',
          '🔍 CAUSA RAIZ: Necessidade de produtos básicos para autoridade através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente produtos básicos por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos básicos',
          '💊 SUPLEMENTAÇÃO: Produtos básicos + Suplementos essenciais + Multivitamínico',
          '🍎 ALIMENTAÇÃO: Alimentos básicos para sustentar autoridade através de curiosidades'
        ],
        curiosidadeModerada: [
          '📋 DIAGNÓSTICO: Você precisa de produtos moderados para autoridade através de curiosidades',
          '🔍 CAUSA RAIZ: Necessidade de produtos específicos para autoridade através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente produtos moderados por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos moderados',
          '💊 SUPLEMENTAÇÃO: Produtos específicos + Suplementos especializados + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Alimentos específicos para potencializar autoridade através de curiosidades'
        ],
        curiosidadeAvancada: [
          '📋 DIAGNÓSTICO: Você precisa de produtos avançados para autoridade através de curiosidades',
          '🔍 CAUSA RAIZ: Necessidade de produtos premium para autoridade através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente produtos avançados por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de produtos avançados',
          '💊 SUPLEMENTAÇÃO: Produtos premium + Nutracêuticos + Adaptógenos + Antioxidantes',
          '🍎 ALIMENTAÇÃO: Alimentos funcionais para sustentar autoridade através de curiosidades avançado'
        ]
      },
      coach: {
        curiosidadeBasica: [
          '🌱 DIAGNÓSTICO: Você precisa de coaching básico com autoridade através de curiosidades',
          '🔍 CAUSA RAIZ: Necessidade de orientação básica em autoridade através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente coaching básico por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching básico',
          '💊 SUPLEMENTAÇÃO: Produtos naturais básicos e suplementos essenciais',
          '🍎 ALIMENTAÇÃO: Foque em conceitos básicos de autoridade através de curiosidades'
        ],
        curiosidadeModerada: [
          '🌼 DIAGNÓSTICO: Você precisa de coaching moderado com autoridade através de curiosidades',
          '🔍 CAUSA RAIZ: Necessidade de orientação moderada em autoridade através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente coaching moderado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching moderado',
          '💊 SUPLEMENTAÇÃO: Produtos naturais específicos e suplementos especializados',
          '🍎 ALIMENTAÇÃO: Compare autoridade através de curiosidades funcional e superalimentos'
        ],
        curiosidadeAvancada: [
          '🔆 DIAGNÓSTICO: Você precisa de coaching avançado com autoridade através de curiosidades',
          '🔍 CAUSA RAIZ: Necessidade de orientação avançada em autoridade através de curiosidades',
          '⚡ AÇÃO IMEDIATA: Implemente coaching avançado por 7 dias',
          '📅 PLANO 7 DIAS: Protocolo de coaching avançado',
          '💊 SUPLEMENTAÇÃO: Adaptógenos e superalimentos para sustentar autoridade através de curiosidades',
          '🍎 ALIMENTAÇÃO: Autoridade através de curiosidades consciente e funcional mantido'
        ]
      }
    }

    const diagnosticos = curiosidadesPorProfissao[data.profissao][data.categoria]
    
    // CTAs específicos por profissão
    const ctasPorProfissao = {
      nutri: {
        curiosidadeBasica: 'Quero mais curiosidades nutricionais',
        curiosidadeModerada: 'Quero curiosidades específicas para minha área',
        curiosidadeAvancada: 'Quero curiosidades científicas avançadas'
      },
      sales: {
        curiosidadeBasica: 'Quero produtos básicos',
        curiosidadeModerada: 'Quero produtos específicos',
        curiosidadeAvancada: 'Quero produtos premium'
      },
      coach: {
        curiosidadeBasica: 'Quero coaching básico',
        curiosidadeModerada: 'Quero coaching específico',
        curiosidadeAvancada: 'Quero coaching avançado'
      }
    }

    setResultado({
      tema: data.tema,
      curiosidade: data.curiosidade,
      explicacao: data.explicacao,
      dicaPratica: data.dicaPratica,
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
            <div className="w-16 h-16 bg-yellow-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Post de Curiosidades
            </h1>
            <p className="text-gray-600">
              Crie posts educativos que geram autoridade e engajamento
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
                className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Configuração */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configuração do Post</h2>
              
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
                      { id: 'curiosidadeBasica', label: 'Básico', desc: 'Post simples', color: 'blue' },
                      { id: 'curiosidadeModerada', label: 'Moderado', desc: 'Post específico', color: 'green' },
                      { id: 'curiosidadeAvancada', label: 'Avançado', desc: 'Post complexo', color: 'yellow' }
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

                {/* Tema */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema da Curiosidade *
                  </label>
                  <select
                    value={data.tema}
                    onChange={(e) => setData({...data, tema: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-base"
                  >
                    <option value="">Selecione um tema</option>
                    {temasCuriosidades[data.profissao][data.categoria].map((tema, index) => (
                      <option key={index} value={tema}>{tema}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!data.tema}
                  className="w-full px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
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
                {/* Curiosidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curiosidade Principal *
                  </label>
                  <textarea
                    value={data.curiosidade}
                    onChange={(e) => setData({...data, curiosidade: e.target.value})}
                    placeholder="Ex: Você sabia que o intestino tem mais neurônios que a medula espinhal?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-20 resize-none"
                  />
                </div>

                {/* Explicação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explicação Científica *
                  </label>
                  <textarea
                    value={data.explicacao}
                    onChange={(e) => setData({...data, explicacao: e.target.value})}
                    placeholder="Ex: O sistema nervoso entérico, conhecido como 'segundo cérebro', contém cerca de 100 milhões de neurônios..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-24 resize-none"
                  />
                </div>

                {/* Dica Prática */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dica Prática *
                  </label>
                  <textarea
                    value={data.dicaPratica}
                    onChange={(e) => setData({...data, dicaPratica: e.target.value})}
                    placeholder="Ex: Para cuidar do seu 'segundo cérebro', consuma probióticos e fibras prebióticas diariamente."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent h-20 resize-none"
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
                  onClick={gerarPost}
                  className="flex-1 px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-all duration-300"
                >
                  Gerar Post
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resultado */}
          {step === 3 && resultado && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Seu Post de Curiosidades</h2>
              
              {/* Preview do Post */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">💡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Curiosidade Nutricional</h3>
                    <p className="text-sm text-gray-600">{resultado.tema}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Você sabia que...</h4>
                    <p className="text-gray-700">{resultado.curiosidade}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🔬 Explicação:</h4>
                    <p className="text-gray-700">{resultado.explicacao}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Dica Prática:</h4>
                    <p className="text-gray-700">{resultado.dicaPratica}</p>
                  </div>
                </div>
              </div>

              {/* Diagnósticos */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Diagnósticos Específicos:</h3>
                <ul className="space-y-2">
                  {resultado.diagnosticos.map((diagnostico: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{diagnostico}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <p className="text-red-800 text-sm">
                  ⚠️ <strong>IMPORTANTE:</strong> Este post é apenas informativo e educativo. 
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
                  className="flex-1 px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-all duration-300"
                >
                  Novo Post
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={capturarDados}
                  className="w-full px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-all duration-300"
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
              Post de Curiosidades YLADA
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
