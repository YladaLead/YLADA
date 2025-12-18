'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import NutriNavBar from '@/components/nutri/NutriNavBar'
import { getAppUrl } from '@/lib/url-utils'
import { normalizeTemplateSlug, CANONICAL_TEMPLATE_SLUGS } from '@/lib/template-slug-map'

interface Template {
  id: string
  nome: string
  categoria: string
  objetivo: string
  icon: string
  descricao: string
  slug: string // Ex: 'calc-imc', 'quiz-ganhos', etc
  templateId?: string // UUID do banco de dados
}

interface Configuracao {
  urlPersonalizada: string // Ex: "calculadora-imc" - slug para URL (sem acentos)
  tituloProjeto: string // Ex: "Calculadora de Água" - título para exibição (com acentos)
  urlCompleta: string
  emoji: string
  cores: {
    principal: string
    secundaria: string
  }
  tipoCta: 'whatsapp' | 'url'
  mensagemWhatsapp: string
  urlExterna: string
  textoBotao: string
  mostrarBotaoWhatsapp: boolean // Mostrar botão WhatsApp pequeno ao lado do CTA principal
  coletarDados: boolean
  camposColeta: {
    nome: boolean
    email: boolean
    telefone: boolean
  }
  mensagemPersonalizada: string
}

function NovaFerramentaNutriContent() {
  const searchParams = useSearchParams()
  const [templateSelecionado, setTemplateSelecionado] = useState<Template | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<'todas' | 'Calculadora' | 'Quiz' | 'Planilha'>('todas')
  const [busca, setBusca] = useState('')
  const [configuracao, setConfiguracao] = useState<Configuracao>({
    urlPersonalizada: '',
    tituloProjeto: '', // Título com acentos para exibição
    urlCompleta: '',
    emoji: '',
    cores: {
      principal: '#3B82F6',
      secundaria: '#2563EB'
    },
    tipoCta: 'whatsapp',
    mensagemWhatsapp: '',
    urlExterna: '',
    textoBotao: 'Agendar Consulta',
    mostrarBotaoWhatsapp: true, // Por padrão, mostrar o botão WhatsApp pequeno
    coletarDados: true,
    camposColeta: {
      nome: true,
      email: true,
      telefone: false
    },
    mensagemPersonalizada: ''
  })
  const [urlDisponivel, setUrlDisponivel] = useState(true)
  const [emojiEditadoManual, setEmojiEditadoManual] = useState(false) // Flag para saber se usuário já editou
  const [abaNomeProjeto, setAbaNomeProjeto] = useState(false) // Controla aba de nome do projeto
  const [abaAparencia, setAbaAparencia] = useState(false) // Controla aba de aparência
  const [abaCTA, setAbaCTA] = useState(false) // Controla aba de CTA
  const [descricao, setDescricao] = useState('') // Descrição opcional embaixo do título
  const [slugNormalizado, setSlugNormalizado] = useState(false) // Flag para mostrar aviso de normalização
  const [generateShortUrl, setGenerateShortUrl] = useState(false) // Gerar URL encurtada
  const [customShortCode, setCustomShortCode] = useState('')
  const [shortCodeDisponivel, setShortCodeDisponivel] = useState<boolean | null>(null)
  const [verificandoShortCode, setVerificandoShortCode] = useState(false)
  const [usarCodigoPersonalizado, setUsarCodigoPersonalizado] = useState(false)
  const [perfilWhatsapp, setPerfilWhatsapp] = useState<string | null>(null) // WhatsApp do perfil
  const [perfilCountryCode, setPerfilCountryCode] = useState<string>('BR') // Código do país do perfil
  const [userSlug, setUserSlug] = useState<string | null>(null) // user_slug do perfil
  const [carregandoPerfil, setCarregandoPerfil] = useState(true)
  const [erroUrlWhatsapp, setErroUrlWhatsapp] = useState(false) // Flag para erro de URL do WhatsApp
  const [erroSalvamento, setErroSalvamento] = useState<string | null>(null) // Erro ao salvar ferramenta
  const [salvando, setSalvando] = useState(false) // Estado de salvamento
  const [templates, setTemplates] = useState<Template[]>([]) // Templates do banco de dados
  const [carregandoTemplates, setCarregandoTemplates] = useState(true) // Estado de carregamento dos templates
  const [mostrarIntroducao, setMostrarIntroducao] = useState(true) // Controla se mostra a introdução
  const [naoMostrarNovamente, setNaoMostrarNovamente] = useState(false) // Checkbox "não mostrar novamente"

  // Carregar templates do banco de dados
  useEffect(() => {
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/nutri/templates', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.templates && data.templates.length > 0) {
            // Mapear templates da API para o formato esperado
            const templatesFormatados: Template[] = data.templates.map((t: any) => ({
              id: t.id || t.slug,
              nome: t.nome,
              categoria: t.categoria,
              objetivo: t.objetivo || 'Avaliar',
              icon: t.icon || (t.categoria === 'Calculadora' ? '🧮' : t.categoria === 'Quiz' ? '🎯' : '📊'),
              descricao: t.descricao || '',
              slug: t.slug || t.id
            }))
            setTemplates(templatesFormatados)
            console.log(`✅ ${templatesFormatados.length} templates carregados do banco de dados`)
          } else {
            console.warn('⚠️ Nenhum template encontrado na API')
            setTemplates([])
          }
        } else {
          console.error('❌ Erro ao carregar templates:', response.status)
          setTemplates([])
        }
      } catch (error) {
        console.error('❌ Erro ao carregar templates:', error)
        setTemplates([])
      } finally {
        setCarregandoTemplates(false)
      }
    }

    carregarTemplates()
  }, [])

  // Pré-selecionar template da URL quando templates forem carregados
  useEffect(() => {
    const templateParam = searchParams.get('template')
    
    if (templateParam && templates.length > 0 && !templateSelecionado) {
      // Buscar template por slug, id ou templateId (UUID do banco)
      const templateEncontrado = templates.find(
        t => t.slug === templateParam || t.id === templateParam || t.templateId === templateParam
      )
      
      if (templateEncontrado) {
        console.log('✅ Template pré-selecionado da URL:', templateEncontrado.nome)
        setTemplateSelecionado(templateEncontrado)
        
        // Filtrar categoria automaticamente
        if (templateEncontrado.categoria) {
          const categoriaMap: Record<string, 'todas' | 'Calculadora' | 'Quiz' | 'Planilha'> = {
            'Calculadora': 'Calculadora',
            'Quiz': 'Quiz',
            'Planilha': 'Planilha'
          }
          const categoria = categoriaMap[templateEncontrado.categoria] || 'todas'
          setFiltroCategoria(categoria)
        }
      } else {
        console.warn('⚠️ Template não encontrado:', templateParam)
      }
    }
  }, [searchParams, templates, templateSelecionado])

  // Função para validar se URL é do WhatsApp
  const validarUrlWhatsapp = (url: string): boolean => {
    if (!url) return false
    const urlLower = url.toLowerCase()
    return urlLower.includes('wa.me') || 
           urlLower.includes('whatsapp.com') || 
           urlLower.includes('web.whatsapp.com') ||
           urlLower.includes('api.whatsapp.com')
  }

  // Carregar WhatsApp e user_slug do perfil
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setCarregandoPerfil(true)
        const response = await fetch('/api/nutri/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.profile?.whatsapp) {
            setPerfilWhatsapp(data.profile.whatsapp)
          }
          if (data.profile?.countryCode) {
            setPerfilCountryCode(data.profile.countryCode)
          }
          if (data.profile?.userSlug) {
            setUserSlug(data.profile.userSlug)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
      } finally {
        setCarregandoPerfil(false)
      }
    }
    carregarPerfil()
  }, [])

  // Códigos de telefone por país
  const codigosTelefone = {
    'BR': { codigo: '+55', bandeira: '🇧🇷', nome: 'Brasil' },
    'US': { codigo: '+1', bandeira: '🇺🇸', nome: 'EUA' },
    'MX': { codigo: '+52', bandeira: '🇲🇽', nome: 'México' },
    'AR': { codigo: '+54', bandeira: '🇦🇷', nome: 'Argentina' },
    'CO': { codigo: '+57', bandeira: '🇨🇴', nome: 'Colômbia' },
    'CL': { codigo: '+56', bandeira: '🇨🇱', nome: 'Chile' },
    'PE': { codigo: '+51', bandeira: '🇵🇪', nome: 'Peru' },
    'PY': { codigo: '+595', bandeira: '🇵🇾', nome: 'Paraguai' },
    'UY': { codigo: '+598', bandeira: '🇺🇾', nome: 'Uruguai' },
    'EC': { codigo: '+593', bandeira: '🇪🇨', nome: 'Equador' },
    'VE': { codigo: '+58', bandeira: '🇻🇪', nome: 'Venezuela' },
    'CR': { codigo: '+506', bandeira: '🇨🇷', nome: 'Costa Rica' },
    'BO': { codigo: '+591', bandeira: '🇧🇴', nome: 'Bolívia' },
    'PT': { codigo: '+351', bandeira: '🇵🇹', nome: 'Portugal' },
    'ES': { codigo: '+34', bandeira: '🇪🇸', nome: 'Espanha' }
  }

  // Carregar templates do banco de dados
  useEffect(() => {
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/nutri/templates', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.templates && data.templates.length > 0) {
            // Mapear templates da API para o formato esperado
            const templatesFormatados: Template[] = data.templates.map((t: any) => ({
              id: t.id || t.slug,
              nome: t.nome,
              categoria: t.categoria,
              objetivo: t.objetivo || 'Avaliar',
              icon: t.icon || (t.categoria === 'Calculadora' ? '🧮' : t.categoria === 'Quiz' ? '🎯' : '📊'),
              descricao: t.descricao || '',
              slug: t.slug || t.id,
              templateId: t.templateId // UUID do banco de dados
            }))
            setTemplates(templatesFormatados)
            console.log(`✅ ${templatesFormatados.length} templates carregados do banco de dados`)
          } else {
            // Nenhum template encontrado no banco - exibir array vazio
            console.warn('⚠️ Nenhum template encontrado na API')
            setTemplates([])
          }
        } else {
          // Erro na API - exibir array vazio
          console.error('❌ Erro ao carregar templates:', response.status)
          setTemplates([])
        }
    } catch (error) {
        // Erro ao carregar - exibir array vazio
        console.error('❌ Erro ao carregar templates:', error)
        setTemplates([])
    } finally {
        setCarregandoTemplates(false)
      }
    }

    carregarTemplates()
  }, [])

  // Gerar URL amigável
  const gerarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Gerar título amigável a partir do slug
  // Trata palavras de ligação, acentos e capitalização corretamente
  const gerarTituloDoSlug = (slug: string): string => {
    if (!slug) return ''
    
    // Lista de palavras de ligação que devem permanecer minúsculas (exceto se forem a primeira palavra)
    const palavrasLigacao = new Set([
      'de', 'da', 'do', 'das', 'dos',
      'em', 'na', 'no', 'nas', 'nos',
      'para', 'por', 'com', 'sem',
      'a', 'o', 'as', 'os',
      'e', 'ou', 'mas',
      'que', 'qual', 'quais',
      'um', 'uma', 'uns', 'umas'
    ])
    
    // Dividir o slug por hífen
    const palavras = slug.split('-')
    
    // Processar cada palavra
    const palavrasProcessadas = palavras.map((palavra, index) => {
      // Se for a primeira palavra, sempre capitalizar
      if (index === 0) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1)
      }
      
      // Se for palavra de ligação, manter minúscula
      if (palavrasLigacao.has(palavra.toLowerCase())) {
        return palavra.toLowerCase()
      }
      
      // Caso contrário, capitalizar primeira letra
      return palavra.charAt(0).toUpperCase() + palavra.slice(1)
    })
    
    // Juntar com espaços
    return palavrasProcessadas.join(' ')
  }

  // Função para tratar URL automaticamente (remove maiúsculas, espaços, acentos)
  const tratarUrl = (texto: string) => {
    return gerarSlug(texto) // Já faz tudo: minúsculo, remove acentos, espaços vira hífen
  }

  // Sugerir dados ao selecionar template (apenas na primeira vez, não sobrescreve se usuário já editou)
  useEffect(() => {
    if (templateSelecionado) {
      // Emoji: só sugere se campo estiver vazio E usuário ainda não editou manualmente
      if (!configuracao.emoji && !emojiEditadoManual) {
        setConfiguracao(prev => ({ ...prev, emoji: templateSelecionado.icon }))
      }
      if (!configuracao.tituloProjeto) {
        // Sugerir título baseado no nome do template (com acentos)
        const tituloSugerido = templateSelecionado.nome
        const slugSugerido = tratarUrl(tituloSugerido)
        setConfiguracao(prev => ({ 
          ...prev, 
          tituloProjeto: tituloSugerido,
          urlPersonalizada: slugSugerido 
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateSelecionado])

  // Atualizar URL completa automaticamente e validar disponibilidade
  useEffect(() => {
    if (configuracao.urlPersonalizada && templateSelecionado) {
      // Usar user_slug do perfil, ou fallback se não tiver
      const urlNome = userSlug || 'seu-usuario' // Fallback temporário até ter user_slug
      const baseUrl = getAppUrl().replace(/^https?:\/\//, '') // Remove protocolo para exibição
      const url = `${baseUrl}/pt/nutri/${urlNome}/${configuracao.urlPersonalizada}`
      
      // Atualizar URL completa (slug já está tratado no onChange do título)
      setConfiguracao(prev => ({ 
        ...prev, 
        urlCompleta: url
      }))
      
      // Validar disponibilidade via API (debounce)
      const timeoutId = setTimeout(() => {
        validarUrl(configuracao.urlPersonalizada)
      }, 500) // Aguarda 500ms após parar de digitar

      return () => clearTimeout(timeoutId)
    }
  }, [configuracao.urlPersonalizada, templateSelecionado, userSlug])

  // Validar URL disponível usando API
  const validarUrl = async (url: string): Promise<boolean> => {
    if (!url || url.trim() === '') {
      setUrlDisponivel(false)
      return false
    }

    try {
      const response = await fetch(`/api/nutri/ferramentas/check-slug?slug=${encodeURIComponent(url)}`)
      const data = await response.json()
      
      setUrlDisponivel(data.available)
      return data.available
    } catch (error) {
      console.error('Erro ao validar URL:', error)
      setUrlDisponivel(false)
      return false
    }
  }

  // Validar URL sincronamente (para uso em submit)
  const validarUrlSync = (url: string): boolean => {
    // Validação básica - a validação completa será feita na API no momento do submit
    return Boolean(url && url.trim().length > 0 && urlDisponivel)
  }

  const criarFerramenta = (template: Template) => {
    setTemplateSelecionado(template)
    setEmojiEditadoManual(false) // Reset flag ao selecionar novo template, para permitir sugestão novamente
    // Scroll para configuração
    setTimeout(() => {
      document.getElementById('configuracao')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const salvarFerramenta = async () => {
    try {
      setSalvando(true)
      setErroSalvamento(null)
      
      // Validar URL antes de salvar
      const urlValida = await validarUrl(configuracao.urlPersonalizada)
      if (!urlValida) {
        setErroSalvamento('Este nome de URL já está em uso. Escolha outro.')
        setTimeout(() => setErroSalvamento(null), 8000)
        setSalvando(false)
        return
      }

      if (!templateSelecionado) {
        setErroSalvamento('Selecione um template primeiro.')
        setTimeout(() => setErroSalvamento(null), 8000)
        setSalvando(false)
        return
      }

      // Validar campos obrigatórios
      if (!configuracao.tituloProjeto || !configuracao.urlPersonalizada) {
        setErroSalvamento('Preencha o título do projeto.')
        setTimeout(() => setErroSalvamento(null), 8000)
        setSalvando(false)
        return
      }

      if (configuracao.tipoCta === 'whatsapp' && !perfilWhatsapp) {
        setErroSalvamento('Configure seu WhatsApp no perfil antes de criar ferramentas com CTA WhatsApp. Acesse: Configurações > Perfil')
        setTimeout(() => setErroSalvamento(null), 8000)
        setSalvando(false)
        return
      }

      if (configuracao.tipoCta === 'url' && !configuracao.urlExterna) {
        setErroSalvamento('Informe a URL externa.')
        setTimeout(() => setErroSalvamento(null), 8000)
        setSalvando(false)
        return
      }

      // Validar se URL externa não é do WhatsApp
      if (configuracao.tipoCta === 'url' && validarUrlWhatsapp(configuracao.urlExterna)) {
        setErroSalvamento('URLs do WhatsApp não são permitidas em URLs externas. Para usar WhatsApp, escolha a opção "WhatsApp" no tipo de CTA.')
        setTimeout(() => setErroSalvamento(null), 8000)
        setSalvando(false)
        return
      }

      // ✅ NORMALIZAR template_slug para garantir que sempre use o slug canônico
      // Passar 'nutri' como profession para manter slugs originais (calculadora-imc, etc)
      const templateSlugNormalizado = normalizeTemplateSlug(templateSelecionado.slug, 'nutri')
      
      // ✅ VALIDAR se o template existe na lista de templates válidos
      if (!CANONICAL_TEMPLATE_SLUGS.includes(templateSlugNormalizado as any)) {
        console.warn('⚠️ Template slug não encontrado na lista canônica:', {
          original: templateSelecionado.slug,
          normalizado: templateSlugNormalizado,
          template: templateSelecionado
        })
        // Continuar mesmo assim, mas logar o problema
      }

      // Usar título do projeto (com acentos) ou gerar a partir do slug se não tiver título
      const tituloFinal = configuracao.tituloProjeto || gerarTituloDoSlug(configuracao.urlPersonalizada)

      const payload = {
        template_slug: templateSlugNormalizado, // ✅ Usar slug normalizado
        title: tituloFinal, // Usar título do projeto (com acentos) para exibição
        description: descricao || templateSelecionado.descricao, // Usar descrição personalizada ou padrão
        slug: configuracao.urlPersonalizada,
        emoji: configuracao.emoji,
        custom_colors: configuracao.cores,
        cta_type: configuracao.tipoCta === 'whatsapp' ? 'whatsapp' : 'url_externa',
        whatsapp_number: configuracao.tipoCta === 'whatsapp' ? perfilWhatsapp : null,
        external_url: configuracao.tipoCta === 'url' ? configuracao.urlExterna : null,
        cta_button_text: configuracao.textoBotao,
        custom_whatsapp_message: configuracao.mensagemWhatsapp,
        show_whatsapp_button: configuracao.mostrarBotaoWhatsapp, // Mostrar botão WhatsApp pequeno
        profession: 'nutri',
        generate_short_url: generateShortUrl,
        custom_short_code: usarCodigoPersonalizado && customShortCode.length >= 3 && shortCodeDisponivel ? customShortCode : null,
        leader_data_collection: {
          coletar_dados: configuracao.coletarDados,
          campos_coleta: configuracao.camposColeta,
          mensagem_personalizada: configuracao.mensagemPersonalizada
        }
      }

      const response = await fetch('/api/nutri/ferramentas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        // Log detalhado do erro para debug
        console.error('❌ Erro ao criar ferramenta:', {
          status: response.status,
          errorData: data,
          technical: data.technical,
          code: data.code,
          hint: data.hint,
          payload: payload
        })
        
        // Se houver detalhes técnicos, mostrar no console
        if (data.technical) {
          console.error('🔍 Detalhes técnicos do erro:', data.technical)
          if (data.hint) {
            console.error('💡 Dica:', data.hint)
          }
        }
        
        // Se for erro de coluna faltando, mostrar mensagem mais específica
        if (data.code === '42703' || data.technical?.includes('column') || data.technical?.includes('does not exist')) {
          throw new Error('O banco de dados precisa ser atualizado. Execute o script SQL "garantir-colunas-user-templates.sql" e tente novamente.')
        }
        
        throw new Error(data.error || 'Erro ao criar ferramenta')
      }

      // Sucesso! Mostrar mensagem amigável e redirecionar
      const urlCompleta = data.tool?.full_url || configuracao.urlCompleta
      
      // Criar mensagem de sucesso visual
      const mensagemSucesso = document.createElement('div')
      mensagemSucesso.className = 'fixed top-4 right-4 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-lg p-4 z-50 max-w-md'
      mensagemSucesso.innerHTML = `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <span class="text-blue-600 text-2xl">✅</span>
                </div>
          <div class="flex-1">
            <h3 class="text-sm font-bold text-blue-900 mb-1">Ferramenta criada com sucesso!</h3>
            <p class="text-xs text-blue-700 mb-2">Sua ferramenta está pronta para uso.</p>
            <div class="bg-white rounded p-2 mb-2 border border-blue-200">
              <p class="text-xs text-gray-600 font-mono break-all">${urlCompleta}</p>
              </div>
              <button 
              onclick="navigator.clipboard.writeText('${urlCompleta}').then(() => alert('URL copiada!'))"
              class="text-xs text-blue-700 hover:text-blue-900 underline"
              >
              Copiar URL
              </button>
            </div>
          <button 
            onclick="this.parentElement.parentElement.remove()"
            class="text-blue-600 hover:text-blue-800 text-lg font-bold"
          >
            ×
          </button>
            </div>
      `
      document.body.appendChild(mensagemSucesso)
      
      // Remover mensagem após 5 segundos e redirecionar
      setTimeout(() => {
        mensagemSucesso.remove()
        window.location.href = '/pt/nutri/ferramentas'
      }, 5000)
    } catch (error: any) {
      console.error('❌ Erro técnico ao salvar ferramenta:', {
        error,
        message: error?.message,
        stack: error?.stack
      })
      setErroSalvamento(error.message || 'Erro ao criar ferramenta. Tente novamente.')
      // Esconder erro após 8 segundos
      setTimeout(() => setErroSalvamento(null), 8000)
    } finally {
      setSalvando(false)
    }
  }

  // Carregar preferência de não mostrar introdução do localStorage
  useEffect(() => {
    const preferencia = localStorage.getItem('nutri_nao_mostrar_introducao')
    if (preferencia === 'true') {
      setMostrarIntroducao(false)
    }
  }, [])

  // Salvar preferência quando checkbox for marcado
  const handleNaoMostrarNovamente = (checked: boolean) => {
    setNaoMostrarNovamente(checked)
    if (checked) {
      localStorage.setItem('nutri_nao_mostrar_introducao', 'true')
    } else {
      localStorage.removeItem('nutri_nao_mostrar_introducao')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NutriNavBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introdução Opcional - Só mostra se não tiver template selecionado */}
        {!templateSelecionado && mostrarIntroducao && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-3xl mr-3">👋</span>
                  Bem-vindo ao Criador de Ferramentas Nutri!
                </h2>
                <p className="text-gray-700 mb-4 text-lg">
                  Crie links personalizados para suas ferramentas de forma rápida e fácil. 
                  Cada ferramenta que você criar terá uma <strong>página de apresentação inicial</strong> 
                  explicando por que ela é importante e o que o cliente vai descobrir.
                </p>
                
                <div className="bg-white rounded-lg p-5 mb-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg flex items-center">
                    <span className="text-xl mr-2">💡</span>
                    Como funciona:
                  </h3>
                  <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                    <li className="pl-2">
                      <strong>Escolha uma ferramenta</strong> da lista abaixo (Calculadora, Quiz ou Planilha)
                    </li>
                    <li className="pl-2">
                      <strong>Personalize</strong> o nome, emoji, cores e botão de ação
                    </li>
                    <li className="pl-2">
                      <strong>Configure</strong> para onde o cliente será redirecionado (WhatsApp ou URL externa)
                    </li>
                    <li className="pl-2">
                      <strong>Compartilhe</strong> o link gerado com seus clientes
                    </li>
                  </ol>
              </div>

                <div className="bg-blue-50 rounded-lg p-5 mb-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">✨</span>
                    O que torna especial:
                  </h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">✓</span>
                      <span><strong>Página de apresentação inicial:</strong> Cada ferramenta terá uma landing page explicando por que ela é importante e o que o cliente vai descobrir</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">✓</span>
                      <span><strong>Totalmente personalizável:</strong> Cores, emoji, título, descrição e botão de ação</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">✓</span>
                      <span><strong>URL personalizada:</strong> Crie links fáceis de compartilhar e memorizar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2 font-bold">✓</span>
                      <span><strong>Integração com WhatsApp:</strong> Redirecione clientes diretamente para conversar com você</span>
                    </li>
                  </ul>
            </div>

                <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={naoMostrarNovamente}
                      onChange={(e) => handleNaoMostrarNovamente(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Não mostrar esta introdução novamente
                    </span>
                  </label>
                  <button
                    onClick={() => setMostrarIntroducao(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Criar Meu Link →
                  </button>
            </div>
          </div>
              <button
                onClick={() => setMostrarIntroducao(false)}
                className="ml-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                title="Fechar introdução"
              >
                ×
              </button>
        </div>
                </div>
        )}

        {/* Escolher Template */}
        {!templateSelecionado && (
          <>
                <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Qual ferramenta você quer usar?
              </h2>
              <p className="text-gray-600 mb-4">
                Escolha uma ferramenta e crie seu link personalizado. É grátis e leva segundos!
              </p>
                  
                  {/* Busca */}
              <div className="relative">
                    <input
                      type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="🔍 Buscar ferramenta por nome..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <span className="absolute left-4 top-3.5 text-2xl">🔍</span>
              </div>
                  </div>
                  
            {/* Filtros por Categoria */}
            <div className="mb-6 flex flex-wrap gap-3">
                      <button
                onClick={() => setFiltroCategoria('todas')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'todas'
                            ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
                        }`}
                      >
                Todas ({templates.length})
                      </button>
              <button
                onClick={() => setFiltroCategoria('Calculadora')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Calculadora'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
                }`}
              >
                🧮 Calculadoras ({templates.filter(t => t.categoria === 'Calculadora').length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Quiz')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Quiz'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
                }`}
              >
                🎯 Quizzes ({templates.filter(t => t.categoria === 'Quiz').length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Planilha')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Planilha'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
                }`}
              >
                📋 Planilhas ({templates.filter(t => t.categoria === 'Planilha').length})
              </button>
                  </div>
                  
            {carregandoTemplates ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando ferramentas...</p>
                  </div>
                </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-2">Nenhuma ferramenta encontrada.</p>
                <p className="text-sm text-gray-500">Verifique se os templates estão configurados no banco de dados.</p>
              </div>
            ) : (
              <>
                {busca && (
                  <p className="text-sm text-gray-600 mb-4">
                    {templates.filter(t => {
                      const matchCategoria = filtroCategoria === 'todas' || t.categoria === filtroCategoria
                      const matchBusca = busca === '' || 
                        t.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        t.descricao.toLowerCase().includes(busca.toLowerCase())
                      return matchCategoria && matchBusca
                    }).length} ferramenta(s) encontrada(s)
                  </p>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates
                    .filter(t => {
                      const matchCategoria = filtroCategoria === 'todas' || t.categoria === filtroCategoria
                      const matchBusca = busca === '' || 
                        t.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        t.descricao.toLowerCase().includes(busca.toLowerCase())
                      return matchCategoria && matchBusca
                    })
                    .map((template) => (
                    <div
                      key={template.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg cursor-pointer group"
                  onClick={() => criarFerramenta(template)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {template.nome}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {template.categoria}
                            </span>
                          </div>
                        </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.descricao}
                    </p>
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                      <strong>Objetivo:</strong> {template.objetivo}
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
              </>
            )}
              </>
            )}

        {/* Configurar Ferramenta */}
        {templateSelecionado && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda: Formulário */}
                <div className="space-y-6">
              <div id="configuracao" className="bg-white rounded-xl border-2 border-blue-200 p-8">
                <div className="space-y-6">
                  {/* 1. NOME DO PROJETO - ABA COLAPSÁVEL */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setAbaNomeProjeto(!abaNomeProjeto)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📝</span>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">Nome do Projeto <span className="text-red-500">*</span></h3>
                          <p className="text-xs text-gray-600">Nome da ferramenta e URL</p>
                            </div>
                          </div>
                      <span className="text-gray-400">{abaNomeProjeto ? '▼' : '▶'}</span>
                    </button>
                    {abaNomeProjeto && (
                      <div className="p-6 space-y-4 border-t border-gray-200">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título do Projeto <span className="text-red-500">*</span>
                          </label>
                        <input
                            type="text"
                            value={configuracao.tituloProjeto}
                            onChange={(e) => {
                              const tituloOriginal = e.target.value
                              // Gerar slug automaticamente a partir do título
                              const slugGerado = tratarUrl(tituloOriginal)
                              
                              // Se foi normalizado, mostrar aviso
                              if (tituloOriginal !== slugGerado && tituloOriginal.length > 0) {
                                setSlugNormalizado(true)
                                setTimeout(() => setSlugNormalizado(false), 3000) // Esconde após 3s
                              }
                              
                              setConfiguracao({ 
                                ...configuracao, 
                                tituloProjeto: tituloOriginal, // Mantém título original com acentos
                                urlPersonalizada: slugGerado // Gera slug automaticamente
                              })
                            }}
                            placeholder="Ex: Calculadora de Água"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            💡 <strong>Este é o título que aparecerá na tela do cliente.</strong> Você pode usar acentos e espaços normalmente. Ex: "Calculadora de Água", "Quiz de Ganhos".
                          </p>
                          
                          {/* Mostrar preview do slug gerado */}
                          {configuracao.urlPersonalizada && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">
                                <strong>🔗 Slug para URL (gerado automaticamente):</strong>
                              </p>
                              <p className="text-sm font-mono text-gray-800 bg-white px-2 py-1 rounded border border-gray-300">
                                {configuracao.urlPersonalizada}
                              </p>
                              {slugNormalizado && (
                                <p className="text-xs text-blue-600 mt-2">
                                  ℹ️ O slug foi normalizado automaticamente (acentos e espaços removidos para a URL)
                                </p>
                              )}
                            </div>
                          )}
                          
                          {/* 🚀 MELHORIA: Mostrar composição completa da URL com user_slug */}
                          {configuracao.urlCompleta && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm font-semibold text-blue-900 mb-2">
                                🔗 Sua URL completa será:
                              </p>
                              <div className={`px-3 py-2 rounded ${urlDisponivel ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                <p className="text-sm font-medium mb-1">
                                  {urlDisponivel ? '✓ Disponível' : '✗ Já em uso por você'} 
                                </p>
                                <p className="text-xs font-mono break-all text-gray-800">
                                  {configuracao.urlCompleta}
                                </p>
                      </div>
                              <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                                <p className="text-xs text-blue-800">
                                  <strong>📋 Composição da URL:</strong><br/>
                                  • <strong className="text-blue-900">{userSlug || '[seu-nome-url]'}</strong> = Seu nome único na URL (configurado no perfil)<br/>
                                  • <strong className="text-blue-900">{configuracao.urlPersonalizada || '[nome-projeto]'}</strong> = Nome do projeto que você escolher<br/>
                                  <br/>
                                  <strong>💡 Importante:</strong> Diferentes pessoas podem usar o mesmo nome de projeto (ex: "água") porque a URL final será diferente com o seu nome único!
                                </p>
                      </div>
                            </div>
                          )}
                          <div className="mt-4 space-y-3">
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="flex items-start space-x-3">
                        <input
                                  type="checkbox"
                                  id="generateShortUrl"
                                  checked={generateShortUrl}
                                  onChange={(e) => {
                                    setGenerateShortUrl(e.target.checked)
                                    if (!e.target.checked) {
                                      setUsarCodigoPersonalizado(false)
                                      setCustomShortCode('')
                                      setShortCodeDisponivel(null)
                                    }
                                  }}
                                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="generateShortUrl" className="flex-1 cursor-pointer">
                                  <span className="text-sm font-medium text-gray-900 block">
                                    🔗 Gerar URL Encurtada
                                  </span>
                                  <span className="text-xs text-gray-600 mt-1 block">
                                    Crie um link curto como <code className="bg-white px-1 py-0.5 rounded">{getAppUrl().replace(/^https?:\/\//, '')}/p/abc123</code> para facilitar compartilhamento via WhatsApp, SMS ou impresso.
                                  </span>
                                </label>
                      </div>
                  </div>

                            {/* Opção de Código Personalizado */}
                            {generateShortUrl && (
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start space-x-3 mb-3">
                                  <input
                                    type="checkbox"
                                    id="usarCodigoPersonalizado"
                                    checked={usarCodigoPersonalizado}
                                    onChange={(e) => {
                                      setUsarCodigoPersonalizado(e.target.checked)
                                      if (!e.target.checked) {
                                        setCustomShortCode('')
                                        setShortCodeDisponivel(null)
                                      }
                                    }}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label htmlFor="usarCodigoPersonalizado" className="flex-1 cursor-pointer">
                                    <span className="text-sm font-medium text-gray-900 block">
                                      ✏️ Personalizar Código
                                    </span>
                                    <span className="text-xs text-gray-600 mt-1 block">
                                      Escolha seu próprio código (3-10 caracteres, letras, números e hífens)
                                    </span>
                                  </label>
                            </div>

                                {usarCodigoPersonalizado && (
                                  <div className="mt-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-gray-600 font-mono">{getAppUrl()}/p/</span>
                        <input
                          type="text"
                                            value={customShortCode}
                                            onChange={async (e) => {
                                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 10)
                                              setCustomShortCode(value)
                                              
                                              if (value.length >= 3) {
                                                setVerificandoShortCode(true)
                                                try {
                                                  const response = await fetch(
                                                    `/api/nutri/check-short-code?code=${encodeURIComponent(value)}`
                                                  )
                                                  const data = await response.json()
                                                  setShortCodeDisponivel(data.available)
                                                } catch (error) {
                                                  console.error('Erro ao verificar código:', error)
                                                  setShortCodeDisponivel(false)
                                                } finally {
                                                  setVerificandoShortCode(false)
                                                }
                                              } else {
                                                setShortCodeDisponivel(null)
                                              }
                                            }}
                                            placeholder="meu-codigo"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                          />
                                        </div>
                                        {verificandoShortCode && (
                                          <p className="text-xs text-gray-500 mt-1">Verificando...</p>
                                        )}
                                        {!verificandoShortCode && shortCodeDisponivel === true && customShortCode.length >= 3 && (
                                          <p className="text-xs text-blue-600 mt-1">✅ Código disponível!</p>
                                        )}
                                        {!verificandoShortCode && shortCodeDisponivel === false && customShortCode.length >= 3 && (
                                          <p className="text-xs text-red-600 mt-1">❌ Este código já está em uso</p>
                                        )}
                                        {customShortCode.length > 0 && customShortCode.length < 3 && (
                                          <p className="text-xs text-yellow-600 mt-1">⚠️ Mínimo de 3 caracteres</p>
                          )}
                        </div>
                      </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                      </div>
                      </div>
                    )}
                  </div>

                  {/* 2. APARÊNCIA - ABA COLAPSÁVEL */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                            type="button"
                      onClick={() => setAbaAparencia(!abaAparencia)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎨</span>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">Aparência</h3>
                          <p className="text-xs text-gray-600">Emoji, título e descrição</p>
                            </div>
                          </div>
                      <span className="text-gray-400">{abaAparencia ? '▼' : '▶'}</span>
                    </button>
                    {abaAparencia && (
                      <div className="p-6 space-y-6 border-t border-gray-200">
                        {/* Emoji */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ícone/Emoji da Ferramenta
                          </label>
                      <input
                        type="text"
                            value={configuracao.emoji}
                            onChange={(e) => {
                              setEmojiEditadoManual(true)
                              setConfiguracao({ ...configuracao, emoji: e.target.value })
                            }}
                            placeholder="🎯 (opcional)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl"
                            onFocus={() => setEmojiEditadoManual(true)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                            💡 <strong>Opcional.</strong> Digite seu emoji ou cole do celular/computador (botão direito → colar emoji)
                          </p>
                  </div>

                        {/* Título (gerado automaticamente do nome do projeto) */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título (gerado automaticamente)
                          </label>
                          <div className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700">
                            {configuracao.urlPersonalizada 
                              ? configuracao.tituloProjeto
                              : 'Digite o título do projeto acima'}
                            </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Este título será gerado automaticamente a partir do "Nome do Projeto" enquanto você digita
                          </p>
                          </div>

                        {/* Descrição */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição (opcional)
                          </label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Descubra seu IMC e receba orientações personalizadas para seu objetivo..."
                          rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            💡 <strong>Opcional.</strong> Texto que aparecerá embaixo do título na ferramenta. Pode deixar vazio.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. CTA E BOTÃO - ABA COLAPSÁVEL */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                            type="button"
                      onClick={() => setAbaCTA(!abaCTA)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🔘</span>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">CTA e Botão</h3>
                          <p className="text-xs text-gray-600">Texto, cores e redirecionamento</p>
                            </div>
                          </div>
                      <span className="text-gray-400">{abaCTA ? '▼' : '▶'}</span>
                    </button>
                    {abaCTA && (
                      <div className="p-6 space-y-6 border-t border-gray-200">
                        {/* Tipo de CTA */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Depois do resultado, o cliente vai para:
                          </label>
                          <select
                            value={configuracao.tipoCta}
                            onChange={(e) => {
                              setConfiguracao({ ...configuracao, tipoCta: e.target.value as 'whatsapp' | 'url' })
                              setErroUrlWhatsapp(false) // Limpar erro ao trocar tipo de CTA
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="whatsapp">WhatsApp (recomendado)</option>
                            <option value="url">URL Externa</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            💡 <strong>O que é?</strong> Para onde o cliente será redirecionado após ver o resultado
                          </p>
                        </div>

                        {/* Texto do Botão */}
                            <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Texto do Botão <span className="text-red-500">*</span>
                          </label>
                            <input
                            type="text"
                            value={configuracao.textoBotao}
                            onChange={(e) => setConfiguracao({ ...configuracao, textoBotao: e.target.value })}
                            placeholder="Conversar com Especialista"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            💡 <strong>O que é?</strong> Texto que aparecerá no botão de ação. Ex: "Conversar comigo", "Saiba mais"
                          </p>
                      </div>

                        {/* Cores Personalizadas */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cores do Botão
                          </label>
                          <p className="text-xs text-gray-500 mb-3">
                            💡 <strong>O que é?</strong> Cores do botão que o cliente verá. Use tons de azul para Nutri
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-gray-600 mb-1 block">Cor Principal</label>
                              <div className="flex items-center space-x-3">
                            <input
                                  type="color"
                                  value={configuracao.cores.principal}
                                  onChange={(e) => setConfiguracao({ ...configuracao, cores: { ...configuracao.cores, principal: e.target.value } })}
                                  className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer flex-shrink-0"
                                />
                            <input
                                  type="text"
                                  value={configuracao.cores.principal}
                                  onChange={(e) => setConfiguracao({ ...configuracao, cores: { ...configuracao.cores, principal: e.target.value } })}
                                  className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                              <label className="text-xs text-gray-600 mb-1 block">Cor Secundária</label>
                              <div className="flex items-center space-x-3">
                          <input
                                  type="color"
                                  value={configuracao.cores.secundaria}
                                  onChange={(e) => setConfiguracao({ ...configuracao, cores: { ...configuracao.cores, secundaria: e.target.value } })}
                                  className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer flex-shrink-0"
                                />
                              <input
                                  type="text"
                                  value={configuracao.cores.secundaria}
                                  onChange={(e) => setConfiguracao({ ...configuracao, cores: { ...configuracao.cores, secundaria: e.target.value } })}
                                  className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                          </div>
                          </div>
                        </div>
                  </div>

                        {/* Configuração WhatsApp */}
                        {configuracao.tipoCta === 'whatsapp' && (
                          <>
                            {carregandoPerfil ? (
                              <div className="animate-pulse bg-gray-100 h-20 rounded-lg"></div>
                            ) : perfilWhatsapp ? (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                                  <span className="text-2xl">✅</span>
                          <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                      WhatsApp do Perfil
                                    </p>
                                    <p className="text-sm text-gray-700 font-mono mb-2">
                                      {perfilWhatsapp}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Este número será usado em todas as suas ferramentas. Para alterar, acesse{' '}
                                      <Link href="/pt/nutri/configuracao" className="text-blue-600 underline font-semibold">
                                        Configurações → Perfil
                                      </Link>
                                    </p>
                            </div>
                              </div>
                            </div>
                            ) : (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                  <span className="text-2xl">⚠️</span>
                          <div className="flex-1">
                                    <p className="text-sm font-medium text-yellow-900 mb-2">
                                      WhatsApp não configurado
                                    </p>
                                    <p className="text-xs text-yellow-800 mb-3">
                                      Configure seu WhatsApp no perfil para usar esta opção.
                                    </p>
                                      <Link
                                      href="/pt/nutri/configuracao"
                                      className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                                    >
                                      Ir para Configurações
                                    </Link>
                            </div>
                              </div>
                            </div>
                            )}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mensagem pré-formatada <span className="text-red-500">*</span>
                        </label>
                              <textarea
                                value={configuracao.mensagemWhatsapp}
                                onChange={(e) => setConfiguracao({ ...configuracao, mensagemWhatsapp: e.target.value })}
                                placeholder="Olá! Calculei meu IMC através do YLADA e gostaria de saber mais sobre como alcançar meu objetivo. Pode me ajudar?"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={!perfilWhatsapp}
                              />
                              <div className="mt-2 bg-blue-50 rounded-lg p-3">
                                <p className="text-xs text-blue-700 font-medium mb-1">💡 Placeholders disponíveis:</p>
                                <p className="text-xs text-blue-600">
                                  [RESULTADO] - Resultado obtido na ferramenta<br/>
                                  [NOME_CLIENTE] - Nome do cliente (se coletado)<br/>
                                  [DATA] - Data/hora do uso
                                </p>
                      </div>
                        </div>
                        
                        {/* Opção para mostrar botão WhatsApp pequeno */}
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={configuracao.mostrarBotaoWhatsapp}
                              onChange={(e) => setConfiguracao({ ...configuracao, mostrarBotaoWhatsapp: e.target.checked })}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                Mostrar botão WhatsApp pequeno
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                Exibe um botão pequeno do WhatsApp ao lado do botão CTA principal, permitindo que o usuário entre em contato diretamente
                              </p>
                            </div>
                          </label>
                        </div>
                          </>
                        )}

                        {/* Configuração URL Externa */}
                        {configuracao.tipoCta === 'url' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              URL de Redirecionamento <span className="text-red-500">*</span>
                            </label>
                      <input
                              type="url"
                              value={configuracao.urlExterna}
                              onChange={(e) => {
                                const url = e.target.value
                                const isWhatsappUrl = validarUrlWhatsapp(url)
                                setErroUrlWhatsapp(isWhatsappUrl)
                                setConfiguracao({ ...configuracao, urlExterna: url })
                              }}
                              placeholder="https://seu-site.com/contato"
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                                erroUrlWhatsapp 
                                  ? 'border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-blue-500'
                              }`}
                            />
                            {erroUrlWhatsapp && (
                              <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-xs text-red-800">
                                  ⚠️ <strong>URL do WhatsApp detectada!</strong> URLs do WhatsApp não são permitidas aqui.
                                </p>
                                <p className="text-xs text-red-700 mt-1">
                                  Para usar WhatsApp, escolha a opção <strong>"WhatsApp"</strong> no tipo de CTA acima. Essa opção usa automaticamente o número do seu perfil.
                                </p>
                    </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              💡 <strong>O que é?</strong> URL para onde o cliente será redirecionado após ver o resultado (ex: site, formulário, página de agendamento)
                            </p>
                  
                            {/* Opção para mostrar botão WhatsApp pequeno (quando CTA é URL externa) */}
                            {perfilWhatsapp && (
                              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={configuracao.mostrarBotaoWhatsapp}
                                    onChange={(e) => setConfiguracao({ ...configuracao, mostrarBotaoWhatsapp: e.target.checked })}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      Mostrar botão WhatsApp pequeno
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      Exibe um botão pequeno do WhatsApp ao lado do botão CTA principal, permitindo que o usuário entre em contato diretamente
                                    </p>
                                  </div>
                                </label>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Coletar Dados do Líder */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <label className="flex items-center space-x-2 mb-3">
                            <input
                              type="checkbox"
                              checked={configuracao.coletarDados}
                              onChange={(e) => setConfiguracao({ ...configuracao, coletarDados: e.target.checked })}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-blue-900">Coletar dados do cliente antes do resultado</span>
                          </label>
                          
                          {configuracao.coletarDados && (
                            <div className="ml-6 mt-3 space-y-2">
                              <h4 className="text-xs font-medium text-blue-700 mb-2">Campos para coletar:</h4>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={configuracao.camposColeta.nome}
                                    onChange={(e) => setConfiguracao({ 
                                      ...configuracao, 
                                      camposColeta: { ...configuracao.camposColeta, nome: e.target.checked } 
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-blue-700">Nome</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={configuracao.camposColeta.email}
                                    onChange={(e) => setConfiguracao({ 
                                      ...configuracao, 
                                      camposColeta: { ...configuracao.camposColeta, email: e.target.checked } 
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-blue-700">Email</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={configuracao.camposColeta.telefone}
                                    onChange={(e) => setConfiguracao({ 
                                      ...configuracao, 
                                      camposColeta: { ...configuracao.camposColeta, telefone: e.target.checked } 
                                    })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-blue-700">Telefone</span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <label className="block text-sm font-medium text-blue-700 mb-2">
                                  Mensagem de agradecimento (opcional)
                                </label>
                                <textarea
                                  value={configuracao.mensagemPersonalizada}
                                  onChange={(e) => setConfiguracao({ ...configuracao, mensagemPersonalizada: e.target.value })}
                                  placeholder="Obrigado por preencher! Seu resultado será enviado em breve."
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-blue-600 mt-1">
                                  💡 Esta mensagem aparecerá após o cliente enviar os dados.
                                </p>
                              </div>
                              <p className="text-xs text-blue-600 mt-2">
                                💡 Os dados coletados serão salvos automaticamente como leads na sua área de gestão.
                              </p>
                            </div>
                          )}
                        </div>
                        </div>
                      )}
                    </div>
                  </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setTemplateSelecionado(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    ← Escolher Outra Ferramenta
                  </button>
                  <button
                    onClick={salvarFerramenta}
                    disabled={salvando}
                    className={`flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${
                      salvando ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {salvando ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Criando...
                      </>
                    ) : (
                      'Criar Meu Link'
                    )}
                  </button>
                  {erroSalvamento && (
                    <div className="mt-4 px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg shadow-sm">
                      <div className="flex items-start space-x-2">
                        <span className="text-red-600 text-xl">⚠️</span>
                      <div className="flex-1">
                          <p className="text-sm text-red-800 font-bold mb-1">
                            Não foi possível criar a ferramenta
                          </p>
                          <p className="text-sm text-red-700">
                            {erroSalvamento}
                          </p>
                          <p className="text-xs text-red-600 mt-2 italic">
                            Tente novamente após resolver o problema. Se o erro persistir, entre em contato com o suporte.
                          </p>
                      </div>
                    <button
                          onClick={() => setErroSalvamento(null)}
                          className="text-red-600 hover:text-red-800 text-lg font-bold"
                          aria-label="Fechar mensagem de erro"
                    >
                          ×
                    </button>
                </div>
              </div>
            )}
          </div>
                    </div>
                  </div>

            {/* Coluna Direita: Preview */}
            <div className="bg-white rounded-xl border-2 border-blue-200 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📱 Preview</h3>
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                {/* Sequência exata do que está sendo configurado */}
                
                {/* 1. Emoji (se tiver) */}
                {configuracao.emoji && (
                  <div className="text-5xl mb-4 text-center">{configuracao.emoji}</div>
                )}

                {/* 2. Título (Nome do Projeto formatado) */}
                <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  {configuracao.urlPersonalizada 
                    ? configuracao.tituloProjeto
                    : 'Título do Projeto'}
                </h4>

                {/* 3. Descrição (se tiver) */}
                {descricao && (
                  <p className="text-sm text-gray-600 mb-6 text-center">{descricao}</p>
                )}

                {/* 4. CTA e Botão */}
                {configuracao.textoBotao && (
                  <div 
                    className="rounded-lg p-6 text-center"
                    style={{ backgroundColor: configuracao.cores.principal }}
                  >
                      <button
                      disabled
                      className="bg-white text-gray-900 px-6 py-4 rounded-lg font-bold text-lg w-full hover:bg-gray-50 transition-all shadow-lg"
                      >
                      {configuracao.textoBotao}
                      </button>
                    
                    {configuracao.tipoCta === 'whatsapp' && (
                      <p className="text-xs text-white/80 mt-3">
                        📱 Abrirá WhatsApp: {perfilWhatsapp || 'Configure no perfil'}
                      </p>
                    )}
                    
                    {configuracao.tipoCta === 'url' && (
                      <p className="text-xs text-white/80 mt-3">
                        🌐 Redirecionará para: {configuracao.urlExterna ? (
                          <span className="break-all">{configuracao.urlExterna}</span>
                        ) : (
                          'URL não informada'
                        )}
                      </p>
                    )}

                    {configuracao.tipoCta === 'whatsapp' && configuracao.mensagemWhatsapp && (
                      <div className="mt-4 bg-white/20 rounded-lg p-3 text-left">
                        <p className="text-xs text-white font-medium mb-1">Mensagem:</p>
                        <p className="text-xs text-white/90">{configuracao.mensagemWhatsapp.substring(0, 80)}{configuracao.mensagemWhatsapp.length > 80 ? '...' : ''}</p>
                </div>
              )}
            </div>
                )}

                {!configuracao.textoBotao && (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-500 italic">
                      Configure o CTA acima para ver o preview completo
                    </p>
                </div>
                )}
                </div>
                </div>
              </div>
        )}
      </main>
            </div>
  )
}

export default function NovaFerramentaNutri() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <NovaFerramentaNutriContent />
    </Suspense>
  )
}
