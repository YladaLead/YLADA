'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import QRCode from 'qrcode'

interface Template {
  id: string
  nome: string
  categoria: string
  objetivo: string
  icon: string
  descricao: string
  preview: string
}

interface FerramentaPersonalizada {
  id: string
  templateId: string
  nome: string
  nomePessoa?: string
  nomeProjeto?: string
  cores: {
    primaria: string
    secundaria: string
    texto: string
  }
  textos: {
    titulo: string
    subtitulo: string
    cta: string
  }
  url: string
  status: 'ativa' | 'inativa'
  leads: number
  visualizacoes: number
  configuracoesPosDiagnostico: {
    tipoResposta: string
    acaoAposDiagnostico: string
    urlRedirecionamento: string
    camposColeta: {
      nome: boolean
      email: boolean
      telefone: boolean
      mensagemPersonalizada: string
    }
    entregaDiagnostico: {
      paginaResultado: boolean
      pdfDownload: boolean
    }
  }
}

export default function CriarFerramenta() {
  const [etapaAtual, setEtapaAtual] = useState(1)
  const [templateSelecionado, setTemplateSelecionado] = useState<Template | null>(null)
  const [ferramentaPersonalizada, setFerramentaPersonalizada] = useState<FerramentaPersonalizada>({
    id: '',
    templateId: '',
    nome: '',
    nomePessoa: '',
    nomeProjeto: '',
    cores: { primaria: '#3B82F6', secundaria: '#1D4ED8', texto: '#1F2937' },
    textos: { titulo: '', subtitulo: '', cta: '' },
    url: '',
    status: 'ativa',
    leads: 0,
    visualizacoes: 0,
    configuracoesPosDiagnostico: {
      tipoResposta: 'completo',
      acaoAposDiagnostico: 'coletar',
      urlRedirecionamento: '',
      camposColeta: { nome: true, email: false, telefone: false, mensagemPersonalizada: '' },
      entregaDiagnostico: { paginaResultado: true, pdfDownload: false }
    }
  })
  const [previewAtivo, setPreviewAtivo] = useState(false)
  const [telaPreviewAtual, setTelaPreviewAtual] = useState(0)
  
  // Estados para personalização
  const [coresPersonalizadas, setCoresPersonalizadas] = useState({
    primaria: '#3B82F6',
    secundaria: '#1E40AF',
    texto: '#1F2937'
  })

  // Estado para validação do nome da URL
  const [nomeUrlUsuario, setNomeUrlUsuario] = useState('')
  const [nomeUrlDisponivel, setNomeUrlDisponivel] = useState<boolean | null>(null)
  const [validandoNome, setValidandoNome] = useState(false)

  // Estado para QR Code
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')
  const [gerandoQRCode, setGerandoQRCode] = useState(false)

  // Função para verificar disponibilidade do nome (simulada)
  const verificarDisponibilidadeNome = async (nome: string) => {
    if (!nome.trim()) {
      setNomeUrlDisponivel(null)
      return
    }

    setValidandoNome(true)
    
    // Simular verificação no banco de dados
    setTimeout(() => {
      const nomesOcupados = ['ana-silva', 'joao-santos', 'maria-costa', 'nutri-sp', 'consultorio-sao-paulo']
      const nomeNormalizado = normalizarTexto(nome)
      const disponivel = !nomesOcupados.includes(nomeNormalizado)
      
      setNomeUrlDisponivel(disponivel)
      setValidandoNome(false)
    }, 1000)
  }

  // Debounce para evitar muitas verificações
  useEffect(() => {
    const timer = setTimeout(() => {
      verificarDisponibilidadeNome(nomeUrlUsuario)
    }, 500)

    return () => clearTimeout(timer)
  }, [nomeUrlUsuario])

  // Função para gerar QR Code
  const gerarQRCode = async (url: string) => {
    if (!url) return

    setGerandoQRCode(true)
    try {
      const qrCodeDataURL = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeDataURL(qrCodeDataURL)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
    } finally {
      setGerandoQRCode(false)
    }
  }

  // Função para baixar QR Code
  const baixarQRCode = () => {
    if (!qrCodeDataURL) return

    const link = document.createElement('a')
    link.download = `qr-code-${ferramentaPersonalizada.nomeProjeto || 'ferramenta'}.png`
    link.href = qrCodeDataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Gerar QR Code quando a URL estiver pronta
  useEffect(() => {
    if (ferramentaPersonalizada.url && etapaAtual === 3) {
      gerarQRCode(ferramentaPersonalizada.url)
    }
  }, [ferramentaPersonalizada.url, etapaAtual])
  const [textosPersonalizados, setTextosPersonalizados] = useState({
    titulo: '',
    subtitulo: '',
    cta: 'Começar Agora'
  })
  
  // Estados para configurações pós-diagnóstico
  const [configuracoesPosDiagnostico, setConfiguracoesPosDiagnostico] = useState({
    tipoResposta: 'completo', // 'completo', 'resumo', 'resultado'
    acaoAposDiagnostico: 'coletar', // 'coletar', 'redirecionar', 'ambos'
    urlRedirecionamento: '',
    camposColeta: {
      nome: true,
      email: true,
      telefone: false,
      mensagemPersonalizada: ''
    },
    entregaDiagnostico: {
      paginaResultado: true,
      pdfDownload: false
    }
  })

  // Templates disponíveis (baseados nas ferramentas YLADA)
  const templates: Template[] = [
    {
      id: 'quiz-interativo',
      nome: 'Quiz Interativo',
      categoria: 'Atrair Leads',
      objetivo: 'Atrair leads frios',
      icon: '🎯',
      descricao: 'Quiz com perguntas estratégicas para capturar informações dos clientes',
      preview: 'Pergunta 1: Qual sua principal dificuldade com alimentação?'
    },
    {
      id: 'calculadora-imc',
      nome: 'Calculadora de IMC',
      categoria: 'Avaliação',
      objetivo: 'Avaliação corporal',
      icon: '📊',
      descricao: 'Calculadora para avaliar índice de massa corporal',
      preview: 'Digite seu peso e altura para calcular seu IMC'
    },
    {
      id: 'checklist-detox',
      nome: 'Checklist Detox',
      categoria: 'Educação',
      objetivo: 'Educação rápida',
      icon: '📋',
      descricao: 'Lista de verificação para processo de detox',
      preview: 'Marque os itens que você consome regularmente'
    },
    {
      id: 'mini-ebook',
      nome: 'Mini E-book Educativo',
      categoria: 'Autoridade',
      objetivo: 'Autoridade',
      icon: '📚',
      descricao: 'E-book compacto para demonstrar expertise',
      preview: 'Baixe nosso guia completo de nutrição'
    },
    {
      id: 'template-desafio-7dias',
      nome: 'Desafio 7 Dias',
      categoria: 'Gamificação',
      objetivo: 'Gamificação',
      icon: '🏆',
      descricao: 'Desafio de 7 dias para engajar clientes',
      preview: 'Participe do nosso desafio de 7 dias'
    }
  ]

  // Função para normalizar texto para URL
  const normalizarTexto = (texto: string): string => {
    return texto
      .toLowerCase() // Maiúsculas → minúsculas
      .normalize('NFD') // Remove acentos
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Espaços → hífens
      .replace(/-+/g, '-') // Múltiplos hífens → único
      .replace(/^-|-$/g, '') // Remove hífens do início/fim
  }

  const gerarURLUnica = (nomeUrlUsuario: string, nomeProjeto?: string): string => {
    // Estrutura super simples: nome-url/projeto
    const projeto = nomeProjeto ? normalizarTexto(nomeProjeto) : 'projeto'
    
    return `https://ylada.app/pt/nutri/${nomeUrlUsuario}/${projeto}`
  }

  // Telas do preview do quiz
  const telasPreview = templateSelecionado ? [
    {
      id: 'entrada',
      titulo: 'Tela de Entrada',
      conteudo: (
        <div className="text-center">
          <span className="text-3xl mb-2 block">{templateSelecionado.icon}</span>
          <h4 
            className="font-semibold mb-1"
            style={{ color: coresPersonalizadas.texto }}
          >
            {textosPersonalizados.titulo || templateSelecionado.nome}
          </h4>
          <p className="text-sm mb-3" style={{ color: coresPersonalizadas.texto + '80' }}>
            {textosPersonalizados.subtitulo || templateSelecionado.descricao}
          </p>
          <div 
            className="text-white px-4 py-2 rounded-lg text-sm"
            style={{ backgroundColor: coresPersonalizadas.primaria }}
          >
            {textosPersonalizados.cta}
          </div>
        </div>
      )
    },
    {
      id: 'pergunta1',
      titulo: 'Pergunta 1',
      conteudo: (
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Pergunta 1 de 5</span>
              <span className="text-xs text-gray-500">20%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{width: '20%', backgroundColor: coresPersonalizadas.primaria}}
              ></div>
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-4">Qual sua principal dificuldade com alimentação?</h4>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Controle de porções</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Falta de tempo para cozinhar</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Compulsão alimentar</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Não sei o que comer</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pergunta2',
      titulo: 'Pergunta 2',
      conteudo: (
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Pergunta 2 de 5</span>
              <span className="text-xs text-gray-500">40%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{width: '40%', backgroundColor: coresPersonalizadas.primaria}}
              ></div>
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-4">Quantas refeições você faz por dia?</h4>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">1-2 refeições</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">3 refeições</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">4-5 refeições</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Mais de 5 refeições</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pergunta3',
      titulo: 'Pergunta 3',
      conteudo: (
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Pergunta 3 de 5</span>
              <span className="text-xs text-gray-500">60%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{width: '60%', backgroundColor: coresPersonalizadas.primaria}}
              ></div>
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-4">Qual seu objetivo principal?</h4>
          <div className="space-y-2">
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Perder peso</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Ganhar massa muscular</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Melhorar saúde</span>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <span className="text-sm">Manter peso atual</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'resultado',
      titulo: 'Captura de Lead',
      conteudo: (
        <div className="text-center">
          <span className="text-3xl mb-2 block">🎉</span>
          <h4 className="font-semibold text-gray-900 mb-2">Quiz Concluído!</h4>
          <p className="text-sm text-gray-600 mb-4">Receba seu resultado personalizado</p>
          
          {/* Campos de coleta baseados na configuração */}
          <div className="space-y-2">
            {configuracoesPosDiagnostico.camposColeta.nome && (
              <input 
                type="text" 
                placeholder="Seu nome" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            )}
            {configuracoesPosDiagnostico.camposColeta.email && (
              <input 
                type="email" 
                placeholder="Seu email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            )}
            {configuracoesPosDiagnostico.camposColeta.telefone && (
              <input 
                type="tel" 
                placeholder="Seu telefone" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            )}
            
            <div 
              className="text-white px-4 py-2 rounded-lg text-sm"
              style={{ backgroundColor: coresPersonalizadas.primaria }}
            >
              {configuracoesPosDiagnostico.acaoAposDiagnostico === 'redirecionar' 
                ? 'Ir para WhatsApp' 
                : 'Receber Resultado'
              }
            </div>
            
            {/* Indicador de configuração */}
            <div className="text-xs text-gray-500 mt-2">
              {configuracoesPosDiagnostico.acaoAposDiagnostico === 'coletar' && '📧 Coletando dados'}
              {configuracoesPosDiagnostico.acaoAposDiagnostico === 'redirecionar' && '🔗 Redirecionando'}
              {configuracoesPosDiagnostico.acaoAposDiagnostico === 'ambos' && '📧🔗 Coletando + Redirecionando'}
            </div>
          </div>
        </div>
      )
    }
  ] : []

  const criarFerramenta = () => {
    if (!templateSelecionado) return

    const novaFerramenta: FerramentaPersonalizada = {
      id: `ferramenta-${Date.now()}`,
      templateId: templateSelecionado.id,
      nome: templateSelecionado.nome, // Usar nome do template
      nomePessoa: ferramentaPersonalizada.nomePessoa,
      nomeProjeto: ferramentaPersonalizada.nomeProjeto,
      cores: coresPersonalizadas,
      textos: {
        titulo: textosPersonalizados.titulo || templateSelecionado.nome,
        subtitulo: textosPersonalizados.subtitulo || templateSelecionado.descricao,
        cta: textosPersonalizados.cta
      },
      url: gerarURLUnica(nomeUrlUsuario, ferramentaPersonalizada.nomeProjeto),
      status: 'ativa',
      leads: 0,
      visualizacoes: 0,
      configuracoesPosDiagnostico: configuracoesPosDiagnostico
    }

    setFerramentaPersonalizada(novaFerramenta)
    setEtapaAtual(3)
  }

  const etapas = [
    { numero: 1, titulo: 'Escolher Template', descricao: 'Selecione o tipo de ferramenta' },
    { numero: 2, titulo: 'Personalizar', descricao: 'Customize cores e textos' },
    { numero: 3, titulo: 'Preview & Publicar', descricao: 'Visualize e ative sua ferramenta' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Criar Ferramenta
                </h1>
                <p className="text-sm text-gray-600">Construa links personalizados para capturar leads</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/dashboard"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {etapas.map((etapa, index) => (
              <div key={etapa.numero} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  etapaAtual >= etapa.numero 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {etapaAtual > etapa.numero ? '✓' : etapa.numero}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    etapaAtual >= etapa.numero ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {etapa.titulo}
                  </p>
                  <p className="text-xs text-gray-500">{etapa.descricao}</p>
                </div>
                {index < etapas.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    etapaAtual > etapa.numero ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Painel Principal */}
          <div className="lg:col-span-2">
            {etapaAtual === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Escolha um Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setTemplateSelecionado(template)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        templateSelecionado?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{template.nome}</h3>
                          <p className="text-sm text-gray-600 mb-2">{template.descricao}</p>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {template.categoria}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {template.objetivo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {templateSelecionado && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Template Selecionado:</h3>
                    <p className="text-blue-800">{templateSelecionado.nome}</p>
                    <p className="text-sm text-blue-700">{templateSelecionado.descricao}</p>
                  </div>
                )}
              </div>
            )}

            {etapaAtual === 2 && templateSelecionado && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personalizar Ferramenta</h2>
                
                <div className="space-y-6">
                  {/* Cores */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Cores</h3>
                      <div className="group relative">
                        <button className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors">
                          ?
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="text-center">
                            <strong>Personalize as cores da sua ferramenta:</strong><br/>
                            • <strong>Primária:</strong> Botões principais e barras de progresso<br/>
                            • <strong>Secundária:</strong> Elementos secundários e hover<br/>
                            • <strong>Texto:</strong> Títulos e textos principais<br/>
                            <em>As cores aplicam automaticamente no preview!</em>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
                        <input
                          type="color"
                          value={coresPersonalizadas.primaria}
                          onChange={(e) => setCoresPersonalizadas(prev => ({...prev, primaria: e.target.value}))}
                          className="w-full h-10 rounded-lg border border-gray-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Botões e elementos principais</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                        <input
                          type="color"
                          value={coresPersonalizadas.secundaria}
                          onChange={(e) => setCoresPersonalizadas(prev => ({...prev, secundaria: e.target.value}))}
                          className="w-full h-10 rounded-lg border border-gray-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Elementos secundários</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Texto</label>
                        <input
                          type="color"
                          value={coresPersonalizadas.texto}
                          onChange={(e) => setCoresPersonalizadas(prev => ({...prev, texto: e.target.value}))}
                          className="w-full h-10 rounded-lg border border-gray-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Títulos e textos</p>
                      </div>
                    </div>
                  </div>

                  {/* Nome da URL */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Nome da URL</h3>
                      <div className="group relative">
                        <button className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors">
                          ?
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="text-center">
                            <strong>Nome único para seus links:</strong><br/>
                            • <strong>Exemplos:</strong> "ana-silva", "nutri-sp", "consultorio-sao-paulo"<br/>
                            • <strong>Pode ser:</strong> Seu nome, cidade, consultório, marca<br/>
                            • <strong>Será verificado:</strong> Disponibilidade em tempo real<br/>
                            • <strong>URL:</strong> ylada.app/pt/nutri/[seu-nome-url]/[projeto]<br/>
                            <em>Escolha algo único e memorável!</em>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ex: ana-silva, nutri-sp, consultorio-sao-paulo"
                          className={`w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            nomeUrlDisponivel === true ? 'border-green-500 bg-green-50' :
                            nomeUrlDisponivel === false ? 'border-red-500 bg-red-50' :
                            'border-gray-300'
                          }`}
                          value={nomeUrlUsuario}
                          onChange={(e) => setNomeUrlUsuario(e.target.value)}
                          required
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {validandoNome && (
                            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          )}
                          {!validandoNome && nomeUrlDisponivel === true && (
                            <span className="text-green-500 text-lg">✓</span>
                          )}
                          {!validandoNome && nomeUrlDisponivel === false && (
                            <span className="text-red-500 text-lg">✗</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        {validandoNome && (
                          <p className="text-xs text-blue-600">Verificando disponibilidade...</p>
                        )}
                        {nomeUrlDisponivel === true && (
                          <p className="text-xs text-green-600">✓ Nome disponível! Será: {normalizarTexto(nomeUrlUsuario)}</p>
                        )}
                        {nomeUrlDisponivel === false && (
                          <p className="text-xs text-red-600">✗ Nome já existe. Tente: {normalizarTexto(nomeUrlUsuario)}-nutri ou {normalizarTexto(nomeUrlUsuario)}-sp</p>
                        )}
                        {nomeUrlDisponivel === null && nomeUrlUsuario && (
                          <p className="text-xs text-gray-500">Será normalizado automaticamente</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nome do Projeto */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Nome do Projeto</h3>
                      <div className="group relative">
                        <button className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors">
                          ?
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="text-center">
                            <strong>Organize suas ferramentas por projeto:</strong><br/>
                            • <strong>Por situação:</strong> "Consultório", "WhatsApp", "Instagram"<br/>
                            • <strong>Por ferramenta:</strong> "Quiz IMC", "Calculadora Peso"<br/>
                            • <strong>Por cliente:</strong> "Cliente João", "Empresa ABC"<br/>
                            • <strong>Vantagem:</strong> Mesma ferramenta em situações diferentes<br/>
                            • <strong>URL:</strong> ylada.app/pt/nutri/[seu-nome-url]/[projeto]<br/>
                            <em>Escolha o que fizer mais sentido para você!</em>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Ex: Consultório, WhatsApp, Instagram, Site"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={ferramentaPersonalizada.nomeProjeto || ''}
                        onChange={(e) => setFerramentaPersonalizada({
                          ...ferramentaPersonalizada,
                          nomeProjeto: e.target.value
                        })}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Será normalizado automaticamente: "Consultório" → "consultorio"
                      </p>
                    </div>
                  </div>

                  {/* Preview da URL Completa */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 text-sm mb-2">🔗 Sua URL será:</h4>
                    <p className="text-xs text-blue-800 font-mono break-all">
                      ylada.app/pt/nutri/{nomeUrlUsuario ? normalizarTexto(nomeUrlUsuario) : '[seu-nome-url]'}/{ferramentaPersonalizada.nomeProjeto ? normalizarTexto(ferramentaPersonalizada.nomeProjeto) : '[projeto]'}
                    </p>
                    <p className="text-xs text-blue-700 mt-2">
                      <strong>Exemplo:</strong> ylada.app/pt/nutri/ana-silva-nutri/consultorio
                    </p>
                    <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>📋 Composição da URL:</strong><br/>
                        • <strong>[seu-nome-url]:</strong> Nome único do seu perfil (configurado acima)<br/>
                        • <strong>[projeto]:</strong> Nome do projeto que você escolher<br/>
                        <br/>
                        <strong>💡 Dica:</strong> Seu nome da URL é único e será verificado automaticamente!<br/>
                        Pode ser seu nome, cidade, consultório ou marca pessoal.
                      </p>
                    </div>
                  </div>

                  {/* Textos */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Textos</h3>
                      <div className="group relative">
                        <button className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors">
                          ?
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="text-center">
                            <strong>Personalize os textos da sua ferramenta:</strong><br/>
                            • <strong>Título:</strong> Nome principal da ferramenta<br/>
                            • <strong>Subtítulo:</strong> Descrição explicativa<br/>
                            • <strong>CTA:</strong> Texto do botão principal<br/>
                            <em>Deixe vazio para usar os textos padrão!</em>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <input
                          type="text"
                          value={textosPersonalizados.titulo}
                          onChange={(e) => setTextosPersonalizados(prev => ({...prev, titulo: e.target.value}))}
                          placeholder={templateSelecionado.nome}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Deixe vazio para usar o nome padrão</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                        <textarea
                          value={textosPersonalizados.subtitulo}
                          onChange={(e) => setTextosPersonalizados(prev => ({...prev, subtitulo: e.target.value}))}
                          placeholder={templateSelecionado.descricao}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Deixe vazio para usar a descrição padrão</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Texto do Botão CTA</label>
                        <input
                          type="text"
                          value={textosPersonalizados.cta}
                          onChange={(e) => setTextosPersonalizados(prev => ({...prev, cta: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Texto do botão principal</p>
                      </div>
                    </div>
                  </div>

                  {/* Configurações Pós-Diagnóstico */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Configurações Pós-Diagnóstico</h3>
                      <div className="group relative">
                        <button className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors">
                          ?
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="text-center">
                            <strong>Configure o que acontece após o diagnóstico:</strong><br/>
                            • <strong>Completo:</strong> Explicações detalhadas + causas + ações<br/>
                            • <strong>Resumo:</strong> Pontos principais + próximos passos<br/>
                            • <strong>Resultado:</strong> Apenas o resultado final<br/>
                            • <strong>Ação:</strong> Coletar dados, redirecionar ou ambos<br/>
                            • <strong>URL:</strong> WhatsApp, Instagram, site, etc.<br/>
                            <em>Exemplos: Brasil→WhatsApp, México→Facebook</em>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      
                      {/* Tipo de Resposta */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Diagnóstico</label>
                        <div className="grid grid-cols-3 gap-3">
                          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="tipoResposta"
                              value="completo"
                              checked={configuracoesPosDiagnostico.tipoResposta === 'completo'}
                              onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({...prev, tipoResposta: e.target.value}))}
                              className="mr-2"
                            />
                            <div>
                              <div className="font-medium text-sm">Completo</div>
                              <div className="text-xs text-gray-500">Diagnóstico detalhado com explicações completas, causas, ações e recomendações específicas</div>
                            </div>
                          </label>
                          
                          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="tipoResposta"
                              value="resumo"
                              checked={configuracoesPosDiagnostico.tipoResposta === 'resumo'}
                              onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({...prev, tipoResposta: e.target.value}))}
                              className="mr-2"
                            />
                            <div>
                              <div className="font-medium text-sm">Resumo</div>
                              <div className="text-xs text-gray-500">Resultado resumido com pontos principais e próximos passos</div>
                            </div>
                          </label>
                          
                          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="tipoResposta"
                              value="resultado"
                              checked={configuracoesPosDiagnostico.tipoResposta === 'resultado'}
                              onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({...prev, tipoResposta: e.target.value}))}
                              className="mr-2"
                            />
                            <div>
                              <div className="font-medium text-sm">Resultado</div>
                              <div className="text-xs text-gray-500">Apenas o resultado final, sem explicações detalhadas</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Ação Após Diagnóstico */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">O que acontece após o diagnóstico?</label>
                        <div className="space-y-3">
                          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="acaoAposDiagnostico"
                              value="coletar"
                              checked={configuracoesPosDiagnostico.acaoAposDiagnostico === 'coletar'}
                              onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({...prev, acaoAposDiagnostico: e.target.value}))}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium text-sm">📧 Coletar dados do cliente</div>
                              <div className="text-xs text-gray-500">Capturar nome, email e telefone</div>
                            </div>
                          </label>
                          
                          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="acaoAposDiagnostico"
                              value="redirecionar"
                              checked={configuracoesPosDiagnostico.acaoAposDiagnostico === 'redirecionar'}
                              onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({...prev, acaoAposDiagnostico: e.target.value}))}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium text-sm">🔗 Redirecionar para URL</div>
                              <div className="text-xs text-gray-500">Enviar para WhatsApp, site ou landing page</div>
                            </div>
                          </label>
                          
                          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="acaoAposDiagnostico"
                              value="ambos"
                              checked={configuracoesPosDiagnostico.acaoAposDiagnostico === 'ambos'}
                              onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({...prev, acaoAposDiagnostico: e.target.value}))}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium text-sm">📧🔗 Ambos</div>
                              <div className="text-xs text-gray-500">Coletar dados + redirecionar</div>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* URL de Redirecionamento */}
                      {(configuracoesPosDiagnostico.acaoAposDiagnostico === 'redirecionar' || configuracoesPosDiagnostico.acaoAposDiagnostico === 'ambos') && (
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <label className="block text-sm font-medium text-gray-700">URL de Redirecionamento</label>
                            <div className="group relative">
                              <button className="w-4 h-4 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors">
                                ?
                              </button>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <div className="text-center">
                                  <strong>Exemplos de URLs por país:</strong><br/>
                                  🇧🇷 <strong>Brasil:</strong> https://wa.me/5511999999999<br/>
                                  🇲🇽 <strong>México:</strong> https://facebook.com/seu_perfil<br/>
                                  🇦🇷 <strong>Argentina:</strong> https://instagram.com/seu_perfil<br/>
                                  🇨🇴 <strong>Colômbia:</strong> https://seu-site.com/contato<br/>
                                  <em>Funciona com qualquer URL válida!</em>
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <input
                            type="url"
                            value={configuracoesPosDiagnostico.urlRedirecionamento}
                            onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({...prev, urlRedirecionamento: e.target.value}))}
                            placeholder="https://wa.me/5511999999999 ou https://seusite.com/contato"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Exemplos: WhatsApp, site, landing page, calendário</p>
                        </div>
                      )}

                      {/* Campos para Coleta */}
                      {(configuracoesPosDiagnostico.acaoAposDiagnostico === 'coletar' || configuracoesPosDiagnostico.acaoAposDiagnostico === 'ambos') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Campos para Coleta</label>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={configuracoesPosDiagnostico.camposColeta.nome}
                                onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({
                                  ...prev, 
                                  camposColeta: {...prev.camposColeta, nome: e.target.checked}
                                }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Nome (obrigatório)</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={configuracoesPosDiagnostico.camposColeta.email}
                                onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({
                                  ...prev, 
                                  camposColeta: {...prev.camposColeta, email: e.target.checked}
                                }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Email (obrigatório)</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={configuracoesPosDiagnostico.camposColeta.telefone}
                                onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({
                                  ...prev, 
                                  camposColeta: {...prev.camposColeta, telefone: e.target.checked}
                                }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Telefone (opcional)</span>
                            </label>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem Personalizada</label>
                            <textarea
                              value={configuracoesPosDiagnostico.camposColeta.mensagemPersonalizada}
                              onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({
                                ...prev, 
                                camposColeta: {...prev.camposColeta, mensagemPersonalizada: e.target.value}
                              }))}
                              placeholder="Ex: 'Para receber seu diagnóstico personalizado, preencha os dados abaixo:'"
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Entrega do Diagnóstico */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Como Entregar o Diagnóstico</h3>
                      <div className="group relative">
                        <button className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors">
                          ?
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <div className="text-center">
                            <strong>Escolha como entregar o diagnóstico:</strong><br/>
                            • <strong>Página:</strong> Cliente vê resultado diretamente na tela<br/>
                            • <strong>PDF:</strong> Marque se quiser que o cliente possa baixar<br/>
                            <em>Você recebe os contatos no seu dashboard!</em>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      
                      {/* Página de Resultado */}
                      <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={configuracoesPosDiagnostico.entregaDiagnostico.paginaResultado}
                            onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({
                              ...prev, 
                              entregaDiagnostico: {...prev.entregaDiagnostico, paginaResultado: e.target.checked}
                            }))}
                            className="mt-1"
                            disabled
                          />
                          <div>
                            <div className="font-medium text-sm text-green-800">📄 Página de Resultado</div>
                            <div className="text-xs text-green-700 mt-1">
                              <strong>Sempre ativa.</strong> Cliente acessa página com diagnóstico completo. 
                              YLADA captura o contato e você recebe o lead no dashboard.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PDF Download */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={configuracoesPosDiagnostico.entregaDiagnostico.pdfDownload}
                            onChange={(e) => setConfiguracoesPosDiagnostico(prev => ({
                              ...prev, 
                              entregaDiagnostico: {...prev.entregaDiagnostico, pdfDownload: e.target.checked}
                            }))}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-sm">📄 PDF para Download</div>
                            <div className="text-xs text-gray-500 mt-1">
                              <strong>Marque esta opção</strong> se você quiser que seus clientes possam baixar um PDF com o diagnóstico completo. 
                              Útil para quem gosta de guardar ou compartilhar o resultado.
                            </div>
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {etapaAtual === 3 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Sua Ferramenta Está Pronta!</h2>
                
                <div className="space-y-6">
                  {/* URL Gerada */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">🔗 Link da Sua Ferramenta:</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={ferramentaPersonalizada.url}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm font-mono"
                      />
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Copiar
                      </button>
                    </div>
                  </div>

                  {/* Configurações Escolhidas */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-3">⚙️ Configurações da Ferramenta:</h3>
                    <div className="space-y-2 text-sm text-green-800">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Diagnóstico:</span>
                        <span className="capitalize">{ferramentaPersonalizada.configuracoesPosDiagnostico.tipoResposta}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Ação pós-diagnóstico:</span>
                        <span>
                          {ferramentaPersonalizada.configuracoesPosDiagnostico.acaoAposDiagnostico === 'coletar' && '📧 Coletar dados'}
                          {ferramentaPersonalizada.configuracoesPosDiagnostico.acaoAposDiagnostico === 'redirecionar' && '🔗 Redirecionar'}
                          {ferramentaPersonalizada.configuracoesPosDiagnostico.acaoAposDiagnostico === 'ambos' && '📧🔗 Coletar + Redirecionar'}
                        </span>
                      </div>
                      {ferramentaPersonalizada.configuracoesPosDiagnostico.urlRedirecionamento && (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">URL:</span>
                          <span className="text-xs bg-white px-2 py-1 rounded border">
                            {ferramentaPersonalizada.configuracoesPosDiagnostico.urlRedirecionamento}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Entrega:</span>
                        <span>
                          {ferramentaPersonalizada.configuracoesPosDiagnostico.entregaDiagnostico.paginaResultado && '📄 Página'}
                          {ferramentaPersonalizada.configuracoesPosDiagnostico.entregaDiagnostico.pdfDownload && '📄 PDF'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-3">📱 QR Code para Compartilhamento:</h3>
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-3 rounded-lg border border-purple-300">
                        {gerandoQRCode ? (
                          <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                          </div>
                        ) : qrCodeDataURL ? (
                          <img 
                            src={qrCodeDataURL} 
                            alt="QR Code" 
                            className="w-24 h-24 rounded"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">QR Code</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-purple-700 mb-2">
                          Perfeito para cartões de visita, redes sociais e materiais impressos!
                        </p>
                        <button 
                          onClick={baixarQRCode}
                          disabled={!qrCodeDataURL || gerandoQRCode}
                          className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {gerandoQRCode ? '⏳ Gerando...' : '📥 Baixar QR Code'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setPreviewAtivo(true)}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      👁️ Visualizar Ferramenta
                    </button>
                    <Link
                      href="/pt/nutri/ferramentas"
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                      ✅ Gerenciar Ferramentas
                    </Link>
                  </div>

                  {/* Próximos Passos */}
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-3">🎯 Próximos Passos:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-600">1️⃣</span>
                        <div>
                          <strong className="text-yellow-800">Compartilhe o Link</strong>
                          <p className="text-yellow-700">Use o link ou QR Code para divulgar</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-600">2️⃣</span>
                        <div>
                          <strong className="text-yellow-800">Monitore os Leads</strong>
                          <p className="text-yellow-700">Acompanhe no seu dashboard</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-600">3️⃣</span>
                        <div>
                          <strong className="text-yellow-800">Entre em Contato</strong>
                          <p className="text-yellow-700">Use os dados coletados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Horizontal */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview Completo</h3>
                {templateSelecionado && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {telaPreviewAtual + 1} de {telasPreview.length}
                    </span>
                    <div className="flex space-x-1">
                      {telasPreview.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setTelaPreviewAtual(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === telaPreviewAtual ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {templateSelecionado ? (
                <div className="relative">
                  {/* Navegação Desktop */}
                  <div className="hidden md:block">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setTelaPreviewAtual(Math.max(0, telaPreviewAtual - 1))}
                        disabled={telaPreviewAtual === 0}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ←
                      </button>
                      
                      <div className="flex-1 overflow-hidden">
                        <div 
                          className="flex transition-transform duration-300 ease-in-out"
                          style={{ transform: `translateX(-${telaPreviewAtual * 100}%)` }}
                        >
                          {telasPreview.map((tela, index) => (
                            <div key={tela.id} className="w-full flex-shrink-0">
                              <div className="border border-gray-200 rounded-lg p-4 bg-white min-h-[300px]">
                                <div className="mb-2">
                                  <span className="text-xs font-medium text-blue-600">{tela.titulo}</span>
                                </div>
                                {tela.conteudo}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setTelaPreviewAtual(Math.min(telasPreview.length - 1, telaPreviewAtual + 1))}
                        disabled={telaPreviewAtual === telasPreview.length - 1}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  {/* Navegação Mobile */}
                  <div className="md:hidden space-y-4">
                    {telasPreview.map((tela, index) => (
                      <div key={tela.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="mb-2">
                          <span className="text-xs font-medium text-blue-600">{tela.titulo}</span>
                        </div>
                        {tela.conteudo}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <span className="text-2xl mb-2 block">👆</span>
                  <p className="text-sm">Selecione um template para ver o preview completo</p>
                </div>
              )}
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Dicas</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <p>Escolha cores que combinem com sua marca</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <p>Textos claros aumentam a conversão</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">•</span>
                  <p>Compartilhe em redes sociais para mais leads</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setEtapaAtual(Math.max(1, etapaAtual - 1))}
            disabled={etapaAtual === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Voltar
          </button>
          
          {etapaAtual === 1 && (
            <button
              onClick={() => templateSelecionado && setEtapaAtual(2)}
              disabled={!templateSelecionado}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Personalizar →
            </button>
          )}
          
          {etapaAtual === 2 && (
            <button
              onClick={criarFerramenta}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Criar Ferramenta →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}