'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { getAppUrl } from '@/lib/url-utils'

interface Template {
  id: string
  nome: string
  categoria: string
  objetivo: string
  icon: string
  descricao: string
  slug: string // Ex: 'calc-imc', 'quiz-ganhos', etc
}

interface Configuracao {
  urlPersonalizada: string // Ex: "calculadora-imc" - agora é o nome principal também
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
}

export default function NovaFerramentaWellness() {
  const [templateSelecionado, setTemplateSelecionado] = useState<Template | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<'todas' | 'Calculadora' | 'Quiz' | 'Planilha'>('todas')
  const [busca, setBusca] = useState('')
  const [configuracao, setConfiguracao] = useState<Configuracao>({
    urlPersonalizada: '',
    urlCompleta: '',
    emoji: '',
    cores: {
      principal: '#10B981',
      secundaria: '#059669'
    },
    tipoCta: 'whatsapp',
    mensagemWhatsapp: '',
    urlExterna: '',
    textoBotao: 'Conversar com Especialista'
  })
  const [urlDisponivel, setUrlDisponivel] = useState(true)
  const [emojiEditadoManual, setEmojiEditadoManual] = useState(false) // Flag para saber se usuário já editou
  const [abaNomeProjeto, setAbaNomeProjeto] = useState(false) // Controla aba de nome do projeto
  const [abaAparencia, setAbaAparencia] = useState(false) // Controla aba de aparência
  const [abaCTA, setAbaCTA] = useState(false) // Controla aba de CTA
  const [descricao, setDescricao] = useState('') // Descrição opcional embaixo do título
  const [slugNormalizado, setSlugNormalizado] = useState(false) // Flag para mostrar aviso de normalização
  const [generateShortUrl, setGenerateShortUrl] = useState(false) // Gerar URL encurtada
  const [perfilWhatsapp, setPerfilWhatsapp] = useState<string | null>(null) // WhatsApp do perfil
  const [perfilCountryCode, setPerfilCountryCode] = useState<string>('BR') // Código do país do perfil
  const [carregandoPerfil, setCarregandoPerfil] = useState(true)
  const [erroUrlWhatsapp, setErroUrlWhatsapp] = useState(false) // Flag para erro de URL do WhatsApp
  const [erroSalvamento, setErroSalvamento] = useState<string | null>(null) // Erro ao salvar ferramenta
  const [salvando, setSalvando] = useState(false) // Estado de salvamento
  const [templates, setTemplates] = useState<Template[]>([]) // Templates do banco de dados
  const [carregandoTemplates, setCarregandoTemplates] = useState(true) // Estado de carregamento dos templates

  // Nome do usuário logado (simulado - depois virá do sistema)
  const nomeDoUsuario = 'Carlos Oliveira'

  // Carregar templates do banco de dados
  useEffect(() => {
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/wellness/templates', {
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

  // Função para validar se URL é do WhatsApp
  const validarUrlWhatsapp = (url: string): boolean => {
    if (!url) return false
    const urlLower = url.toLowerCase()
    return urlLower.includes('wa.me') || 
           urlLower.includes('whatsapp.com') || 
           urlLower.includes('web.whatsapp.com') ||
           urlLower.includes('api.whatsapp.com')
  }

  // Carregar WhatsApp do perfil
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setCarregandoPerfil(true)
        const response = await fetch('/api/wellness/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.profile?.whatsapp) {
            setPerfilWhatsapp(data.profile.whatsapp)
          }
          if (data.profile?.countryCode) {
            setPerfilCountryCode(data.profile.countryCode)
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
        const response = await fetch('/api/wellness/templates', {
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
      if (!configuracao.urlPersonalizada) {
        // Sugerir baseado no nome do template
        const sugestao = tratarUrl(templateSelecionado.nome)
        setConfiguracao(prev => ({ ...prev, urlPersonalizada: sugestao }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateSelecionado])

  // Atualizar URL completa automaticamente e validar disponibilidade
  useEffect(() => {
    if (configuracao.urlPersonalizada && templateSelecionado) {
      const slugTratado = tratarUrl(configuracao.urlPersonalizada)
      const urlNome = tratarUrl(nomeDoUsuario)
      const baseUrl = getAppUrl().replace(/^https?:\/\//, '') // Remove protocolo para exibição
      const url = `${baseUrl}/pt/wellness/${urlNome}/${slugTratado}`
      
      // Atualizar URL completa
      setConfiguracao(prev => ({ 
        ...prev, 
        urlPersonalizada: slugTratado, // Mantém sempre tratado
        urlCompleta: url
      }))
      
      // Validar disponibilidade via API (debounce)
      const timeoutId = setTimeout(() => {
        validarUrl(slugTratado)
      }, 500) // Aguarda 500ms após parar de digitar

      return () => clearTimeout(timeoutId)
    }
  }, [configuracao.urlPersonalizada, templateSelecionado])

  // Validar URL disponível usando API
  const validarUrl = async (url: string): Promise<boolean> => {
    if (!url || url.trim() === '') {
      setUrlDisponivel(false)
      return false
    }

    try {
      const response = await fetch(`/api/wellness/ferramentas/check-slug?slug=${encodeURIComponent(url)}`)
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
      if (!configuracao.urlPersonalizada) {
        setErroSalvamento('Preencha o nome do projeto.')
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

      // Converter slug para nome amigável usando função melhorada
      const nomeAmigavel = gerarTituloDoSlug(configuracao.urlPersonalizada)

      const payload = {
        template_slug: templateSelecionado.slug,
        title: nomeAmigavel, // Usar o nome do projeto formatado como título
        description: descricao || templateSelecionado.descricao, // Usar descrição personalizada ou padrão
        slug: configuracao.urlPersonalizada,
        emoji: configuracao.emoji,
        custom_colors: configuracao.cores,
        cta_type: configuracao.tipoCta === 'whatsapp' ? 'whatsapp' : 'url_externa',
        whatsapp_number: configuracao.tipoCta === 'whatsapp' ? perfilWhatsapp : null,
        external_url: configuracao.tipoCta === 'url' ? configuracao.urlExterna : null,
        cta_button_text: configuracao.textoBotao,
        custom_whatsapp_message: configuracao.mensagemWhatsapp,
        profession: 'wellness',
        generate_short_url: generateShortUrl
      }

      const response = await fetch('/api/wellness/ferramentas', {
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
          payload: payload
        })
        
        // Se houver detalhes técnicos, mostrar no console
        if (data.technical) {
          console.error('🔍 Detalhes técnicos do erro:', data.technical)
        }
        
        throw new Error(data.error || 'Erro ao criar ferramenta')
      }

      // Sucesso! Redirecionar para a lista de ferramentas
      alert(`Ferramenta criada com sucesso!\n\nURL: ${data.tool?.full_url || configuracao.urlCompleta}`)
      window.location.href = '/pt/wellness/ferramentas'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title={templateSelecionado ? `Configurar: ${templateSelecionado.nome}` : 'Criar Novo Link'} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
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
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
                }`}
              >
                Todas ({templates.length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Calculadora')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Calculadora'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
                }`}
              >
                🧮 Calculadoras ({templates.filter(t => t.categoria === 'Calculadora').length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Quiz')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Quiz'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
                }`}
              >
                🎯 Quizzes ({templates.filter(t => t.categoria === 'Quiz').length})
              </button>
              <button
                onClick={() => setFiltroCategoria('Planilha')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroCategoria === 'Planilha'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-green-300'
                }`}
              >
                📋 Planilhas ({templates.filter(t => t.categoria === 'Planilha').length})
              </button>
            </div>

            {carregandoTemplates ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-green-400 transition-all hover:shadow-lg cursor-pointer group"
                  onClick={() => criarFerramenta(template)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {template.nome}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
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
              <div id="configuracao" className="bg-white rounded-xl border-2 border-green-200 p-8">
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
                            Nome do Projeto <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={configuracao.urlPersonalizada}
                            onChange={(e) => {
                              const valorOriginal = e.target.value
                              const valorTratado = tratarUrl(valorOriginal)
                              
                              // Se foi normalizado, mostrar aviso
                              if (valorOriginal !== valorTratado && valorOriginal.length > 0) {
                                setSlugNormalizado(true)
                                setTimeout(() => setSlugNormalizado(false), 3000) // Esconde após 3s
                              }
                              
                              setConfiguracao({ ...configuracao, urlPersonalizada: valorTratado })
                            }}
                            placeholder="Ex: calculadora-imc"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          {slugNormalizado && (
                            <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs text-blue-800">
                                ℹ️ <strong>Normalizado automaticamente:</strong> Acentos, espaços e caracteres especiais foram convertidos para formato de URL válido.
                              </p>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            💡 <strong>O que é?</strong> Nome da sua ferramenta (aparecerá como título) e também será usado na URL. Ex: "calculadora-imc", "quiz-ganhos". Será tratado automaticamente enquanto você digita.
                          </p>
                          {configuracao.urlCompleta && (
                            <div className={`mt-2 px-3 py-2 rounded ${urlDisponivel ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              <p className="text-sm font-medium">
                                {urlDisponivel ? '✓ Disponível' : '✗ Já em uso'} 
                                <span className="ml-2 text-xs font-mono">{configuracao.urlCompleta}</span>
                              </p>
                            </div>
                          )}
                          <div className="mt-4 flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <input
                              type="checkbox"
                              id="generateShortUrl"
                              checked={generateShortUrl}
                              onChange={(e) => setGenerateShortUrl(e.target.checked)}
                              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl"
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
                              ? gerarTituloDoSlug(configuracao.urlPersonalizada)
                              : 'Digite o nome do projeto acima'}
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                            💡 <strong>O que é?</strong> Cores do botão que o cliente verá. Use tons de verde para Wellness
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
                                  className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                                  className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
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
                                      <Link href="/pt/wellness/configuracao" className="text-green-600 underline font-semibold">
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
                                      href="/pt/wellness/configuracao"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                  : 'border-gray-300 focus:ring-green-500'
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
                          </div>
                        )}
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
                    className={`flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center ${
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
            <div className="bg-white rounded-xl border-2 border-green-200 p-8">
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
                    ? gerarTituloDoSlug(configuracao.urlPersonalizada)
                    : 'Nome do Projeto'}
                </h4>

                {/* 3. Descrição (se tiver) */}
                {descricao && (
                  <p className="text-sm text-gray-600 mb-6 text-center">{descricao}</p>
                )}

                {/* 4. CTA e Botão */}
                {configuracao.textoBotao && (
                  <div 
                    className="rounded-lg p-6 text-center"
                    style={{ background: `linear-gradient(135deg, ${configuracao.cores.principal} 0%, ${configuracao.cores.secundaria} 100%)` }}
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
