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
    icon?: string
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
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas')
  const [buscaTemplate, setBuscaTemplate] = useState('')
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
  
  // Estados para controlar seções colapsáveis
  const [secoesAbertas, setSecoesAbertas] = useState({
    cores: true,
    nomeUrl: false,
    nomeProjeto: false,
    textos: false,
    configuracoes: false,
    entrega: false
  })
  
  const toggleSecao = (secao: keyof typeof secoesAbertas) => {
    setSecoesAbertas(prev => ({
      ...prev,
      [secao]: !prev[secao]
    }))
  }

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
    cta: 'Começar Agora',
    icon: '' // Ícone personalizado (emoji)
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

  // Templates disponíveis (baseados nas ferramentas YLADA) - Total: 38 templates (5 Quiz + 4 Calculadoras + 2 Checklists + 5 Conteúdo + 22 Diagnósticos)
  const templates: Template[] = [
    // QUIZES INTERATIVOS (5)
    {
      id: 'quiz-interativo',
      nome: 'Quiz Interativo',
      categoria: 'Quiz',
      objetivo: 'Atrair leads frios',
      icon: '🎯',
      descricao: 'Quiz com perguntas estratégicas para capturar informações dos clientes',
      preview: 'Perguntas estratégicas para atrair leads frios'
    },
    {
      id: 'quiz-bem-estar',
      nome: 'Quiz de Bem-Estar',
      categoria: 'Quiz',
      objetivo: 'Avaliação completa',
      icon: '🧘‍♀️',
      descricao: 'Avalie o bem-estar geral do cliente',
      preview: 'Avaliação completa de bem-estar'
    },
    {
      id: 'quiz-perfil-nutricional',
      nome: 'Quiz de Perfil Nutricional',
      categoria: 'Quiz',
      objetivo: 'Diagnóstico inicial',
      icon: '🥗',
      descricao: 'Identifique o perfil nutricional do cliente',
      preview: 'Diagnóstico inicial do perfil nutricional'
    },
    {
      id: 'quiz-detox',
      nome: 'Quiz Detox',
      categoria: 'Quiz',
      objetivo: 'Captação por curiosidade',
      icon: '🧽',
      descricao: 'Avalie a necessidade de processo detox',
      preview: 'Captação através de curiosidade sobre detox'
    },
    {
      id: 'quiz-energetico',
      nome: 'Quiz Energético',
      categoria: 'Quiz',
      objetivo: 'Segmentação',
      icon: '⚡',
      descricao: 'Identifique níveis de energia e cansaço',
      preview: 'Segmentação por níveis de energia'
    },
    
    // CALCULADORAS (4)
    {
      id: 'calculadora-imc',
      nome: 'Calculadora de IMC',
      categoria: 'Calculadora',
      objetivo: 'Avaliação corporal',
      icon: '📊',
      descricao: 'Calcule o Índice de Massa Corporal com interpretação personalizada',
      preview: 'Altura, peso e análise completa do resultado'
    },
    {
      id: 'calculadora-proteina',
      nome: 'Calculadora de Proteína',
      categoria: 'Calculadora',
      objetivo: 'Recomendação nutricional',
      icon: '🥩',
      descricao: 'Calcule a necessidade proteica diária do cliente',
      preview: 'Recomendação nutricional baseada em peso e objetivos'
    },
    {
      id: 'calculadora-agua',
      nome: 'Calculadora de Água',
      categoria: 'Calculadora',
      objetivo: 'Engajamento leve',
      icon: '💧',
      descricao: 'Calcule a necessidade diária de hidratação',
      preview: 'Engajamento leve através de hidratação'
    },
    {
      id: 'calculadora-calorias',
      nome: 'Calculadora de Calorias',
      categoria: 'Calculadora',
      objetivo: 'Diagnóstico energético',
      icon: '🔥',
      descricao: 'Calcule o gasto calórico diário e necessidades energéticas',
      preview: 'Diagnóstico completo de necessidades energéticas'
    },
    
    // CHECKLISTS (2)
    {
      id: 'checklist-detox',
      nome: 'Checklist Detox',
      categoria: 'Checklist',
      objetivo: 'Educação rápida',
      icon: '📋',
      descricao: 'Lista de verificação para processo de detox',
      preview: 'Educação rápida sobre detox'
    },
    {
      id: 'checklist-alimentar',
      nome: 'Checklist Alimentar',
      categoria: 'Checklist',
      objetivo: 'Avaliação completa',
      icon: '🍽️',
      descricao: 'Avalie hábitos alimentares do cliente',
      preview: 'Avaliação completa de hábitos alimentares'
    },
    
    // CONTEÚDO EDUCATIVO (5)
    {
      id: 'mini-ebook',
      nome: 'Mini E-book Educativo',
      categoria: 'Conteúdo',
      objetivo: 'Demonstrar autoridade',
      icon: '📚',
      descricao: 'E-book compacto para demonstrar expertise e autoridade',
      preview: 'Demonstração de autoridade através de conteúdo educativo'
    },
    {
      id: 'guia-nutraceutico',
      nome: 'Guia Nutracêutico',
      categoria: 'Conteúdo',
      objetivo: 'Atração de interesse',
      icon: '💊',
      descricao: 'Guia completo sobre suplementos e nutracêuticos',
      preview: 'Atração de interesse por suplementação'
    },
    {
      id: 'guia-proteico',
      nome: 'Guia Proteico',
      categoria: 'Conteúdo',
      objetivo: 'Especialização',
      icon: '🥛',
      descricao: 'Guia especializado sobre proteínas e fontes proteicas',
      preview: 'Especialização em nutrição proteica'
    },
    {
      id: 'tabela-comparativa',
      nome: 'Tabela Comparativa',
      categoria: 'Conteúdo',
      objetivo: 'Conversão',
      icon: '📊',
      descricao: 'Tabelas comparativas de alimentos e nutrientes',
      preview: 'Ferramenta de conversão através de comparações'
    },
    {
      id: 'tabela-substituicoes',
      nome: 'Tabela de Substituições',
      categoria: 'Conteúdo',
      objetivo: 'Valor agregado',
      icon: '🔄',
      descricao: 'Tabela de substituições de alimentos para mais variedade',
      preview: 'Valor agregado através de substituições inteligentes'
    },
    
    // DIAGNÓSTICOS ESPECÍFICOS (22)
    {
      id: 'template-diagnostico-parasitose',
      nome: 'Diagnóstico de Parasitose',
      categoria: 'Diagnóstico',
      objetivo: 'Diagnóstico específico',
      icon: '🦠',
      descricao: 'Ferramenta para diagnóstico de parasitose intestinal',
      preview: 'Diagnóstico específico de parasitose'
    },
    {
      id: 'diagnostico-eletritos',
      nome: 'Diagnóstico de Eletrólitos',
      categoria: 'Diagnóstico',
      objetivo: 'Detecção de desequilíbrio',
      icon: '⚡',
      descricao: 'Avalie sinais de desequilíbrio de sódio, potássio, magnésio e cálcio',
      preview: 'Detecta necessidade de reposição de eletrólitos'
    },
    {
      id: 'diagnostico-perfil-metabolico',
      nome: 'Avaliação do Perfil Metabólico',
      categoria: 'Diagnóstico',
      objetivo: 'Classificação metabólica',
      icon: '🔥',
      descricao: 'Identifique sinais de metabolismo acelerado, equilibrado ou lento',
      preview: 'Classifica seu perfil metabólico e orienta próximos passos'
    },
    {
      id: 'diagnostico-sintomas-intestinais',
      nome: 'Diagnóstico de Sintomas Intestinais',
      categoria: 'Diagnóstico',
      objetivo: 'Detecção de desequilíbrio',
      icon: '💩',
      descricao: 'Identifique sinais de constipação, disbiose, inflamação e irregularidade',
      preview: 'Detecta desequilíbrio intestinal e orienta próximos passos'
    },
    {
      id: 'avaliacao-sono-energia',
      nome: 'Avaliação do Sono e Energia',
      categoria: 'Diagnóstico',
      objetivo: 'Classificação de descanso',
      icon: '😴',
      descricao: 'Avalie se o sono está restaurando sua energia diária',
      preview: 'Classifica o descanso e energia (baixo/moderado/alto comprometimento)'
    },
    {
      id: 'teste-retencao-liquidos',
      nome: 'Teste de Retenção de Líquidos',
      categoria: 'Diagnóstico',
      objetivo: 'Detecção de retenção',
      icon: '💧',
      descricao: 'Avalie sinais de retenção hídrica e desequilíbrio mineral',
      preview: 'Detecta retenção hídrica e orienta próximos passos'
    },
    {
      id: 'avaliacao-fome-emocional',
      nome: 'Avaliação de Fome Emocional',
      categoria: 'Diagnóstico',
      objetivo: 'Avaliação emocional',
      icon: '🧠',
      descricao: 'Identifique se a alimentação está sendo influenciada por emoções e estresse',
      preview: 'Avalia influência emocional na alimentação'
    },
    {
      id: 'diagnostico-tipo-metabolismo',
      nome: 'Diagnóstico do Tipo de Metabolismo',
      categoria: 'Diagnóstico',
      objetivo: 'Classificação metabólica',
      icon: '⚙️',
      descricao: 'Avalie se seu metabolismo é lento, normal ou acelerado',
      preview: 'Classifica o tipo metabólico por sintomas e hábitos'
    },
    {
      id: 'disciplinado-emocional',
      nome: 'Você é mais disciplinado ou emocional com a comida?',
      categoria: 'Diagnóstico',
      objetivo: 'Perfil comportamental',
      icon: '❤️‍🔥',
      descricao: 'Avalie se o comportamento alimentar é guiado mais por razão ou emoções',
      preview: 'Identifica perfil comportamental: disciplinado, intermediário ou emocional'
    },
    {
      id: 'nutrido-alimentado',
      nome: 'Você está nutrido ou apenas alimentado?',
      categoria: 'Diagnóstico',
      objetivo: 'Avaliação nutricional',
      icon: '🍎',
      descricao: 'Descubra se está nutrido em nível celular ou apenas comendo calorias vazias',
      preview: 'Avalia qualidade nutricional e deficiências celulares'
    },
    {
      id: 'perfil-intestino',
      nome: 'Qual é seu perfil de intestino?',
      categoria: 'Diagnóstico',
      objetivo: 'Classificação intestinal',
      icon: '💩',
      descricao: 'Identifique o tipo de funcionamento intestinal e saúde digestiva',
      preview: 'Classifica perfil intestinal: equilibrado, preso/sensível ou disbiose'
    },
    {
      id: 'avaliacao-sensibilidades',
      nome: 'Avaliação de Intolerâncias/Sensibilidades',
      categoria: 'Diagnóstico',
      objetivo: 'Identificação de reações',
      icon: '⚠️',
      descricao: 'Detecte sinais de sensibilidades alimentares não diagnosticadas',
      preview: 'Identifica possíveis reações alimentares e orienta próximos passos'
    },
    {
      id: 'avaliacao-sindrome-metabolica',
      nome: 'Risco de Síndrome Metabólica',
      categoria: 'Diagnóstico',
      objetivo: 'Sinalização de risco',
      icon: '🚨',
      descricao: 'Avalie fatores de risco ligados à resistência à insulina e inflamação',
      preview: 'Sinaliza risco metabólico e orienta condutas'
    },
    {
      id: 'descoberta-perfil-bem-estar',
      nome: 'Descubra seu Perfil de Bem-Estar',
      categoria: 'Diagnóstico',
      objetivo: 'Diagnóstico leve',
      icon: '🧭',
      descricao: 'Identifique se seu perfil é Estético, Equilibrado ou Saúde/Performance',
      preview: 'Diagnóstico leve com convite à avaliação personalizada'
    },
    {
      id: 'quiz-tipo-fome',
      nome: 'Qual é o seu Tipo de Fome?',
      categoria: 'Diagnóstico',
      objetivo: 'Provoca curiosidade',
      icon: '🍽️',
      descricao: 'Identifique Fome Física, por Hábito ou Emocional',
      preview: 'Provoca curiosidade e direciona para avaliação'
    },
    {
      id: 'quiz-pedindo-detox',
      nome: 'Seu corpo está pedindo Detox?',
      categoria: 'Diagnóstico',
      objetivo: 'Sinalização de necessidade',
      icon: '💧',
      descricao: 'Avalie sinais de sobrecarga e acúmulo de toxinas',
      preview: 'Sinaliza necessidade de detox guiado'
    },
    {
      id: 'avaliacao-rotina-alimentar',
      nome: 'Você está se alimentando conforme sua rotina?',
      categoria: 'Diagnóstico',
      objetivo: 'Apontar alinhamento',
      icon: '⏰',
      descricao: 'Descubra se sua rotina alimentar está adequada aos horários e demandas',
      preview: 'Aponta alinhamento da rotina e sugere reeducação'
    },
    {
      id: 'pronto-emagrecer',
      nome: 'Pronto para Emagrecer com Saúde?',
      categoria: 'Diagnóstico',
      objetivo: 'Identificar prontidão',
      icon: '🏁',
      descricao: 'Avalie seu nível de prontidão física e emocional',
      preview: 'Identifica prontidão e direciona para preparação personalizada'
    },
    {
      id: 'autoconhecimento-corporal',
      nome: 'Você conhece o seu corpo?',
      categoria: 'Diagnóstico',
      objetivo: 'Avaliação de consciência',
      icon: '🧠',
      descricao: 'Avalie seu nível de autoconhecimento corporal e nutricional',
      preview: 'Mostra o quanto você entende seus sinais físicos e emocionais'
    }
  ]

  // Filtrar templates por categoria e busca
  const categoriasUnicas = ['todas', ...Array.from(new Set(templates.map(t => t.categoria)))]
  const templatesFiltrados = templates.filter(template => {
    const matchCategoria = categoriaFiltro === 'todas' || template.categoria === categoriaFiltro
    const matchBusca = buscaTemplate === '' || 
      template.nome.toLowerCase().includes(buscaTemplate.toLowerCase()) ||
      template.descricao.toLowerCase().includes(buscaTemplate.toLowerCase()) ||
      template.categoria.toLowerCase().includes(buscaTemplate.toLowerCase())
    return matchCategoria && matchBusca
  })

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

  // Detectar seção ativa para preview contextual
  const secaoAtiva = Object.entries(secoesAbertas).find(([_, aberta]) => aberta)?.[0] || null

  // Gerar preview dinâmico baseado no tipo de template
  const gerarTelasPreview = () => {
    if (!templateSelecionado) return []

    const categoria = templateSelecionado.categoria
    
    // Preparar previews contextuais baseados na seção ativa (antes de criar os previews base)
    const previewsContextuais = []
    if (etapaAtual === 2 && secaoAtiva) {
      if (secaoAtiva === 'configuracoes') {
        previewsContextuais.push({
          id: 'preview-configuracoes',
          titulo: 'Preview: Configurações de Diagnóstico',
          conteudo: (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-bold text-green-900 mb-2">Resultado do Diagnóstico</h5>
                <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                  <p><strong>DIAGNÓSTICO:</strong> {configuracoesPosDiagnostico.tipoResposta === 'completo' ? 'Diagnóstico completo com explicações detalhadas, causas e ações' : configuracoesPosDiagnostico.tipoResposta === 'resumo' ? 'Resultado resumido com pontos principais' : 'Apenas resultado final'}</p>
                  <p><strong>CAUSA RAIZ:</strong> Identificação das causas principais</p>
                  <p><strong>AÇÃO IMEDIATA:</strong> Passos para ação imediata</p>
                  <p><strong>PLANO 7 DIAS:</strong> Plano de ação para os próximos 7 dias</p>
                  <p><strong>SUPLEMENTAÇÃO:</strong> Recomendações de suplementação</p>
                  <p><strong>ALIMENTAÇÃO:</strong> Orientações alimentares</p>
                  <div className="bg-purple-50 p-3 rounded-lg mt-2">
                    <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                    <p className="text-gray-700">
                      {configuracoesPosDiagnostico.acaoAposDiagnostico === 'coletar' && 'Coletar dados do cliente'}
                      {configuracoesPosDiagnostico.acaoAposDiagnostico === 'redirecionar' && `Redirecionar para: ${configuracoesPosDiagnostico.urlRedirecionamento || 'URL'}`}
                      {configuracoesPosDiagnostico.acaoAposDiagnostico === 'ambos' && 'Coletar dados + Redirecionar'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
      
      if (secaoAtiva === 'entrega') {
        previewsContextuais.push({
          id: 'preview-entrega',
          titulo: 'Preview: Entrega do Diagnóstico',
          conteudo: (
            <div className="space-y-4">
              {configuracoesPosDiagnostico.entregaDiagnostico.paginaResultado && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-bold text-green-900 mb-2">📄 Página de Resultado</h5>
                  <p className="text-sm text-green-700 mb-3">O cliente verá o diagnóstico completo nesta página</p>
                  <div className="bg-white rounded-lg p-3 text-sm text-gray-800">
                    <p><strong>Status:</strong> Sempre ativa</p>
                    <p><strong>Captura:</strong> YLADA captura contato automaticamente</p>
                    <p><strong>Leads:</strong> Dados aparecem no seu dashboard</p>
                  </div>
                </div>
              )}
              {configuracoesPosDiagnostico.entregaDiagnostico.pdfDownload && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-bold text-blue-900 mb-2">📥 PDF para Download</h5>
                  <p className="text-sm text-blue-700 mb-3">Cliente pode baixar o diagnóstico em PDF</p>
                  <div className="bg-white rounded-lg p-3 text-sm text-gray-800">
                    <p><strong>Status:</strong> Ativado</p>
                    <p><strong>Formato:</strong> PDF profissional</p>
                    <p><strong>Uso:</strong> Guardar, consultar offline e compartilhar</p>
                  </div>
                </div>
              )}
              {!configuracoesPosDiagnostico.entregaDiagnostico.pdfDownload && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 text-center">📥 PDF para Download desabilitado</p>
                </div>
              )}
            </div>
          )
        })
      }
    }
    
    const entrada = {
      id: 'entrada',
      titulo: 'Tela de Entrada',
      conteudo: (
        <div className="text-center">
          <span className="text-3xl mb-2 block">{textosPersonalizados.icon || templateSelecionado.icon}</span>
          <h4 
            className="font-semibold mb-1"
            style={{ color: coresPersonalizadas.texto }}
          >
            {textosPersonalizados.titulo || templateSelecionado.nome}
          </h4>
          <p className="text-sm mb-3" style={{ color: coresPersonalizadas.texto + '80' }}>
            {textosPersonalizados.subtitulo || templateSelecionado.descricao}
          </p>
          <div className="mt-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-left italic">
              <strong>Preview:</strong> {templateSelecionado.preview}
            </p>
          </div>
          <div 
            className="text-white px-4 py-2 rounded-lg text-sm inline-block cursor-pointer"
            style={{ backgroundColor: coresPersonalizadas.primaria }}
          >
            {textosPersonalizados.cta}
          </div>
        </div>
      )
    }

    const resultado = {
      id: 'resultado',
      titulo: 'Captura de Lead',
      conteudo: (
        <div className="text-center">
          <span className="text-3xl mb-2 block">🎉</span>
          <h4 className="font-semibold text-gray-900 mb-2">{templateSelecionado.nome} Concluído!</h4>
          <p className="text-sm text-gray-600 mb-4">Receba seu resultado personalizado</p>
          <div className="space-y-2">
            {configuracoesPosDiagnostico.camposColeta.nome && (
              <input type="text" placeholder="Seu nome" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            )}
            {configuracoesPosDiagnostico.camposColeta.email && (
              <input type="email" placeholder="Seu email" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            )}
            {configuracoesPosDiagnostico.camposColeta.telefone && (
              <input type="tel" placeholder="Seu telefone" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            )}
            <div className="text-white px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: coresPersonalizadas.primaria }}>
              {configuracoesPosDiagnostico.acaoAposDiagnostico === 'redirecionar' ? 'Ir para WhatsApp' : 'Receber Resultado'}
            </div>
          </div>
        </div>
      )
    }

    // Preview específico para Calculadoras
    if (categoria === 'Calculadora') {
      const previewsBase = [
        entrada,
        {
          id: 'formulario',
          titulo: 'Formulário',
      conteudo: (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">{templateSelecionado.nome}</h4>
              {templateSelecionado.id === 'calculadora-imc' && (
                <>
        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                    <input type="number" placeholder="Ex: 175" className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                    <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-2 border border-gray-300 rounded-lg text-sm" disabled>Masculino</button>
                      <button className="p-2 border border-gray-300 rounded-lg text-sm" disabled>Feminino</button>
          </div>
            </div>
                </>
              )}
              {templateSelecionado.id === 'calculadora-proteina' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                    <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Atividade</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled>
                      <option>Sedentário</option>
                      <option>Leve</option>
                      <option>Moderado</option>
                      <option>Intenso</option>
                    </select>
            </div>
                </>
              )}
              {(templateSelecionado.id === 'calculadora-agua' || templateSelecionado.id === 'calculadora-calorias') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                    <input type="number" placeholder="Ex: 70" className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled />
            </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                    <input type="number" placeholder="Ex: 30" className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled />
          </div>
                </>
              )}
              <button 
                className="w-full text-white px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: coresPersonalizadas.primaria }}
                disabled
              >
                Calcular
              </button>
        </div>
      )
    },
    {
          id: 'resultado-calc',
          titulo: 'Resultado',
      conteudo: (
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-4">Resultado da Calculadora</h4>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                <div className="text-2xl font-bold" style={{ color: coresPersonalizadas.primaria }}>
                  {templateSelecionado.id === 'calculadora-imc' && 'IMC: 22.9'}
                  {templateSelecionado.id === 'calculadora-proteina' && '120g/dia'}
                  {templateSelecionado.id === 'calculadora-agua' && '2.5L/dia'}
                  {templateSelecionado.id === 'calculadora-calorias' && '2000 kcal/dia'}
            </div>
                <p className="text-sm text-gray-600 mt-2">Resultado personalizado baseado nos seus dados</p>
            </div>
              <div className="text-xs text-gray-500">
                Diagnóstico completo será exibido aqui
          </div>
        </div>
      )
    },
        resultado
      ]
      return [...previewsBase, ...previewsContextuais]
    }

    // Preview para Diagnósticos (10 perguntas com escala 1-5)
    if (categoria === 'Diagnóstico') {
      const perguntas = [
        { num: 1, texto: 'Você sente cansaço constante mesmo dormindo bem?' },
        { num: 2, texto: 'Tem dificuldade para emagrecer, mesmo comendo pouco?' },
        { num: 3, texto: 'Sente-se inchado(a) com frequência, especialmente ao final do dia?' },
        { num: 4, texto: 'Costuma ter mãos e pés frios ou sente frio com facilidade?' },
        { num: 5, texto: 'Sente fome exagerada ou vontade de comer doces frequentemente?' }
      ]
      
      const previewsBase = [
        entrada,
        ...perguntas.map((p, idx) => ({
          id: `pergunta${p.num}`,
          titulo: `Pergunta ${p.num}`,
      conteudo: (
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Pergunta {p.num} de 10</span>
                  <span className="text-xs text-gray-500">{p.num * 10}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: `${p.num * 10}%`, backgroundColor: coresPersonalizadas.primaria}}></div>
            </div>
          </div>
              <h4 className="font-semibold text-gray-900 mb-4">{p.num}. {p.texto}</h4>
              <div className="grid grid-cols-5 gap-2">
                {['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'].map((op, i) => (
                  <label key={i} className="flex items-center justify-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 text-xs">
                    <span>{op}</span>
                  </label>
                ))}
            </div>
            </div>
          )
        })),
        {
          id: 'resultado-diagnostico',
          titulo: 'Resultado',
          conteudo: (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Seu Resultado:</h4>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-bold text-green-900 mb-2">Resultado: Baixo (10–20)</h5>
                <div className="bg-white rounded-lg p-3 space-y-2 text-sm text-gray-800">
                  <p><strong>DIAGNÓSTICO:</strong> Poucos sintomas relatados.</p>
                  <p><strong>CAUSA RAIZ:</strong> Possível desequilíbrio pontual.</p>
                  <p><strong>AÇÃO IMEDIATA:</strong> Reforçar hábitos saudáveis.</p>
                  <p><strong>PLANO 7 DIAS:</strong> Rotina equilibrada com ajustes leves.</p>
                  <p><strong>SUPLEMENTAÇÃO:</strong> Apenas se indicado por profissional.</p>
                  <p><strong>ALIMENTAÇÃO:</strong> Priorizar alimentos frescos e equilibrados.</p>
                  <div className="bg-purple-50 p-3 rounded-lg mt-2">
                    <p className="font-semibold text-gray-900">PRÓXIMO PASSO:</p>
                    <p className="text-gray-700">Manter rotina e reavaliar se necessário.</p>
            </div>
            </div>
          </div>
        </div>
      )
    },
        resultado
      ]
      return [...previewsBase, ...previewsContextuais]
    }

    // Preview para Checklists
    if (categoria === 'Checklist') {
      const previewsBase = [
        entrada,
        {
          id: 'checklist',
          titulo: 'Checklist',
      conteudo: (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-4">{templateSelecionado.nome}</h4>
              {[
                'Consome frutas diariamente?',
                'Bebe pelo menos 2L de água por dia?',
                'Pratica atividade física regular?',
                'Dorme pelo menos 7 horas por noite?',
                'Evita alimentos ultraprocessados?'
              ].map((item, idx) => (
                <label key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="mr-3" disabled />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          )
        },
        resultado
      ]
      return [...previewsBase, ...previewsContextuais]
    }

    // Preview para Conteúdo Educativo
    if (categoria === 'Conteúdo') {
      const previewsBase = [
        entrada,
        {
          id: 'preview-conteudo',
          titulo: 'Preview do Conteúdo',
          conteudo: (
            <div className="text-center">
              <div className="p-8 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                <span className="text-4xl mb-4 block">{textosPersonalizados.icon || templateSelecionado.icon}</span>
                <h4 className="font-semibold text-gray-900 mb-2">{templateSelecionado.nome}</h4>
                <p className="text-sm text-gray-600 mb-4">{templateSelecionado.descricao}</p>
                <div className="text-xs text-gray-500">
                  📄 Conteúdo completo será exibido aqui
                </div>
              </div>
              <button 
              className="text-white px-4 py-2 rounded-lg text-sm"
              style={{ backgroundColor: coresPersonalizadas.primaria }}
                disabled
              >
                Baixar {templateSelecionado.nome.includes('E-book') ? 'E-book' : 'Guia'}
              </button>
            </div>
          )
        },
        resultado
      ]
      return [...previewsBase, ...previewsContextuais]
    }

    // Preview padrão para Quizes (5 perguntas)
    const perguntasQuiz = [
      { num: 1, texto: 'Qual sua principal dificuldade com alimentação?' },
      { num: 2, texto: 'Quantas refeições você faz por dia?' },
      { num: 3, texto: 'Qual seu objetivo principal?' },
      { num: 4, texto: 'Como está seu nível de energia?' },
      { num: 5, texto: 'Pratica atividade física regularmente?' }
    ]

    const previewsBase = [
      entrada,
      ...perguntasQuiz.map((p) => ({
        id: `pergunta${p.num}`,
        titulo: `Pergunta ${p.num}`,
        conteudo: (
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Pergunta {p.num} de 5</span>
                <span className="text-xs text-gray-500">{p.num * 20}%</span>
            </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full" style={{width: `${p.num * 20}%`, backgroundColor: coresPersonalizadas.primaria}}></div>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 mb-4">{p.num}. {p.texto}</h4>
            <div className="space-y-2">
              {p.num === 1 && ['Controle de porções', 'Falta de tempo para cozinhar', 'Compulsão alimentar', 'Não sei o que comer'].map((op, i) => (
                <div key={i} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm">{op}</span>
                </div>
              ))}
              {p.num === 2 && ['1-2 refeições', '3 refeições', '4-5 refeições', 'Mais de 5 refeições'].map((op, i) => (
                <div key={i} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm">{op}</span>
                </div>
              ))}
              {p.num === 3 && ['Perder peso', 'Ganhar massa muscular', 'Melhorar saúde', 'Manter peso atual'].map((op, i) => (
                <div key={i} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm">{op}</span>
                </div>
              ))}
              {p.num >= 4 && ['Sim, sempre', 'Às vezes', 'Raramente', 'Nunca'].map((op, i) => (
                <div key={i} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm">{op}</span>
                </div>
              ))}
          </div>
        </div>
      )
      })),
      resultado
    ]
    return [...previewsBase, ...previewsContextuais]
  }

  const telasPreview = gerarTelasPreview()

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
        cta: textosPersonalizados.cta,
        icon: textosPersonalizados.icon || templateSelecionado.icon
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
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
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
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Escolha um Template</h2>
                  
                  {/* Busca */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="🔍 Buscar template por nome, descrição ou categoria..."
                      value={buscaTemplate}
                      onChange={(e) => setBuscaTemplate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Filtro por Categoria */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categoriasUnicas.map((categoria) => (
                      <button
                        key={categoria}
                        onClick={() => setCategoriaFiltro(categoria)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          categoriaFiltro === categoria
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {categoria === 'todas' ? 'Todos' : categoria}
                      </button>
                    ))}
                  </div>
                  
                  {/* Contador */}
                  <div className="text-sm text-gray-600 mb-4">
                    Mostrando {templatesFiltrados.length} de {templates.length} templates
                  </div>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templatesFiltrados.map((template) => (
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
                </div>
                
                {templatesFiltrados.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum template encontrado com os filtros selecionados.</p>
                    <button 
                      onClick={() => {
                        setCategoriaFiltro('todas')
                        setBuscaTemplate('')
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-700 underline"
                    >
                      Limpar filtros
                    </button>
                  </div>
                )}
                
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
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSecao('cores')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">Cores</h3>
                        <div className="group relative">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors"
                          >
                            ?
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block pointer-events-none z-50 shadow-lg">
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
                      <span className="text-gray-500">{secoesAbertas.cores ? '▼' : '▶'}</span>
                    </button>
                    {secoesAbertas.cores && (
                      <div className="p-4">
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
                    )}
                  </div>

                  {/* Nome da URL */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSecao('nomeUrl')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">Nome da URL</h3>
                        <div className="group relative">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors"
                          >
                            ?
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block pointer-events-none z-50 shadow-lg">
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
                      <span className="text-gray-500">{secoesAbertas.nomeUrl ? '▼' : '▶'}</span>
                    </button>
                    {secoesAbertas.nomeUrl && (
                      <div className="p-4">
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
                    )}
                  </div>

                  {/* Nome do Projeto */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSecao('nomeProjeto')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">Nome do Projeto</h3>
                        <div className="group relative">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors"
                          >
                            ?
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block pointer-events-none z-50 shadow-lg">
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
                      <span className="text-gray-500">{secoesAbertas.nomeProjeto ? '▼' : '▶'}</span>
                    </button>
                    {secoesAbertas.nomeProjeto && (
                      <div className="p-4">
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
                      </div>
                    )}
                  </div>

                  {/* Textos */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSecao('textos')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">Textos</h3>
                        <div className="group relative">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors"
                          >
                            ?
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block pointer-events-none z-50 shadow-lg">
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
                      <span className="text-gray-500">{secoesAbertas.textos ? '▼' : '▶'}</span>
                    </button>
                    {secoesAbertas.textos && (
                      <div className="p-4">
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ícone (Emoji)</label>
                        <input
                          type="text"
                          value={textosPersonalizados.icon}
                          onChange={(e) => setTextosPersonalizados(prev => ({...prev, icon: e.target.value}))}
                          placeholder={templateSelecionado.icon}
                          maxLength={10}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl"
                        />
                        <p className="text-xs text-gray-500 mt-1">Deixe vazio para usar o ícone padrão do template</p>
                        <div className="mt-2 flex items-center space-x-2 text-xs text-gray-600">
                          <span>Ícone atual:</span>
                          <span className="text-2xl">{textosPersonalizados.icon || templateSelecionado.icon}</span>
                        </div>
                      </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Configurações Pós-Diagnóstico */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSecao('configuracoes')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">Configurações Pós-Diagnóstico</h3>
                        <div className="group relative">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors"
                          >
                            ?
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block pointer-events-none z-50 shadow-lg">
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
                      <span className="text-gray-500">{secoesAbertas.configuracoes ? '▼' : '▶'}</span>
                    </button>
                    {secoesAbertas.configuracoes && (
                      <div className="p-4">
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
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block pointer-events-none z-50 shadow-lg">
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
                    )}
                  </div>

                  {/* Entrega do Diagnóstico */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSecao('entrega')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">Como Entregar o Diagnóstico</h3>
                        <div className="group relative">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 bg-gray-400 text-white rounded-full text-xs hover:bg-gray-500 transition-colors"
                          >
                            ?
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block pointer-events-none z-50 shadow-lg">
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
                      <span className="text-gray-500">{secoesAbertas.entrega ? '▼' : '▶'}</span>
                    </button>
                    {secoesAbertas.entrega && (
                      <div className="p-4">
                        <div className="space-y-4">
                      
                      {/* Página de Resultado */}
                      <div className="p-4 border border-green-300 rounded-lg bg-green-50">
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
                          <div className="flex-1">
                            <div className="font-medium text-sm text-green-800 mb-2">📄 Página de Resultado</div>
                            <div className="text-xs text-green-700 mb-2">
                              <strong>Sempre ativa.</strong> Cliente acessa página com diagnóstico completo. 
                              YLADA captura o contato e você recebe o lead no dashboard.
                            </div>
                            <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
                              <div className="text-xs font-semibold text-green-900 mb-1">💡 Estratégia Comercial:</div>
                              <div className="text-xs text-green-800 space-y-1">
                                <p>• <strong>Geração de Leads:</strong> Cada diagnóstico concluído vira um lead qualificado no seu dashboard</p>
                                <p>• <strong>Engajamento Imediato:</strong> Cliente recebe resultado instantâneo, mantendo conexão com sua marca</p>
                                <p>• <strong>Experiência Controlada:</strong> Mantém cliente no seu ambiente digital com CTAs adicionais</p>
                                <p className="font-semibold mt-2">✨ Transforme cada diagnóstico em oportunidade de negócio!</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PDF Download */}
                      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
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
                          <div className="flex-1">
                            <div className="font-medium text-sm text-blue-900 mb-2">📥 PDF para Download</div>
                            <div className="text-xs text-blue-700 mb-2">
                              <strong>Marque esta opção</strong> para que seus clientes possam baixar um PDF profissional com o diagnóstico completo. 
                              Útil para guardar, consultar offline e compartilhar com outras pessoas.
                            </div>
                            <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
                              <div className="text-xs font-semibold text-blue-900 mb-1">💡 Estratégia Comercial:</div>
                              <div className="text-xs text-blue-800 space-y-1">
                                <p>• <strong>Valor Percebido:</strong> Documento profissional tangível aumenta satisfação do cliente</p>
                                <p>• <strong>Viralidade Orgânica:</strong> Clientes compartilham o PDF, ampliando alcance da sua marca</p>
                                <p>• <strong>Profissionalismo:</strong> Reforça credibilidade e posiciona você como especialista</p>
                                <p className="font-semibold mt-2">🚀 Transforme seus clientes em promotores da sua marca!</p>
                              </div>
                            </div>
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                              <strong>⚠️ Importante:</strong> Para habilitar PDF, é necessário configurar no Super Base (sistema de templates).
                            </div>
                          </div>
                        </label>
                      </div>
                        </div>
                      </div>
                    )}
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
