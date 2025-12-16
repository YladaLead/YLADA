'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CoachNavBar from '@/components/coach/CoachNavBar'
import { getAppUrl, buildCoachToolUrl } from '@/lib/url-utils'

interface Configuracao {
  urlPersonalizada: string // Slug para URL (sem acentos)
  tituloProjeto: string // Título para exibição (com acentos)
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
}

interface ToolData {
  id: string
  title: string
  description: string
  slug: string
  emoji: string
  custom_colors: {
    principal: string
    secundaria: string
  }
  cta_type: 'whatsapp' | 'url_externa'
  whatsapp_number?: string
  external_url?: string
  cta_button_text: string
  custom_whatsapp_message?: string
  show_whatsapp_button?: boolean // Mostrar botão WhatsApp pequeno
  template_slug: string
  status: string
}

export default function EditarFerramentaCoach() {
  const params = useParams()
  const router = useRouter()
  const toolId = params.id as string

  const [loading, setLoading] = useState(true)
  const [toolData, setToolData] = useState<ToolData | null>(null)
  const [paisTelefone, setPaisTelefone] = useState('BR')
  const [configuracao, setConfiguracao] = useState<Configuracao>({
    urlPersonalizada: '',
    tituloProjeto: '', // Título com acentos para exibição
    urlCompleta: '',
    emoji: '',
    cores: {
      principal: '#10B981',
      secundaria: '#059669'
    },
    tipoCta: 'whatsapp',
    mensagemWhatsapp: '',
    urlExterna: '',
    textoBotao: 'Conversar com Especialista',
    mostrarBotaoWhatsapp: true // Por padrão, mostrar o botão WhatsApp pequeno
  })
  const [urlDisponivel, setUrlDisponivel] = useState(true)
  const [slugOriginal, setSlugOriginal] = useState('')
  const [abaNomeProjeto, setAbaNomeProjeto] = useState(false)
  const [abaAparencia, setAbaAparencia] = useState(false)
  const [abaCTA, setAbaCTA] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [userSlug, setUserSlug] = useState<string>('')
  const [slugNormalizado, setSlugNormalizado] = useState(false)
  const [generateShortUrl, setGenerateShortUrl] = useState(false)
  const [shortCodeExistente, setShortCodeExistente] = useState<string | null>(null)
  const [removendoShortCode, setRemovendoShortCode] = useState(false)
  const [customShortCode, setCustomShortCode] = useState('')
  const [shortCodeDisponivel, setShortCodeDisponivel] = useState<boolean | null>(null)
  const [verificandoShortCode, setVerificandoShortCode] = useState(false)
  const [usarCodigoPersonalizado, setUsarCodigoPersonalizado] = useState(false)
  const [perfilWhatsapp, setPerfilWhatsapp] = useState<string | null>(null)
  const [carregandoPerfil, setCarregandoPerfil] = useState(true)
  const [erroUrlWhatsapp, setErroUrlWhatsapp] = useState(false) // Flag para erro de URL do WhatsApp
  const [salvando, setSalvando] = useState(false) // Estado de salvamento
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null) // Mensagem de sucesso
  const [mensagemErro, setMensagemErro] = useState<string | null>(null) // Mensagem de erro
  const [excluindo, setExcluindo] = useState(false) // Estado de exclusão
  const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState(false) // Modal de confirmação

  // Função para validar se URL é do WhatsApp
  const validarUrlWhatsapp = (url: string): boolean => {
    if (!url) return false
    const urlLower = url.toLowerCase()
    return urlLower.includes('wa.me') || 
           urlLower.includes('whatsapp.com') || 
           urlLower.includes('web.whatsapp.com') ||
           urlLower.includes('api.whatsapp.com')
  }

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

  const tratarUrl = (texto: string) => {
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

  // Carregar user_slug do perfil primeiro
  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await fetch('/api/coach/profile')
        if (response.ok) {
          const data = await response.json()
          if (data.profile?.userSlug) {
            setUserSlug(data.profile.userSlug)
          }
          if (data.profile?.whatsapp) {
            setPerfilWhatsapp(data.profile.whatsapp)
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

  // Carregar dados da ferramenta quando toolId estiver disponível (userSlug pode vir depois)
  useEffect(() => {
    if (toolId && !carregandoPerfil) {
      carregarFerramenta()
    }
  }, [toolId, carregandoPerfil])

  const carregarFerramenta = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `/api/coach/ferramentas?id=${toolId}&profession=coach`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Ferramenta não encontrada')
      }

      const data = await response.json()
      const tool = data.tool
      setToolData(tool)

      setSlugOriginal(tool.slug)
      setDescricao(tool.description || '')
      
      // Verificar se já tem código curto
      if (tool.short_code) {
        setShortCodeExistente(tool.short_code)
        setGenerateShortUrl(false) // Não mostrar checkbox se já tem
      } else {
        setShortCodeExistente(null)
      }
      
      // Calcular URL completa baseada no slug e userSlug atual
      const baseUrl = getAppUrl().replace(/^https?:\/\//, '') // Remove protocolo para exibição
      const urlCompletaCalculada = userSlug 
        ? `${baseUrl}/pt/c/${userSlug}/${tool.slug}`
        : `${baseUrl}/pt/c/[configure-seu-slug]/${tool.slug}`
      
      setConfiguracao({
        urlPersonalizada: tool.slug,
        tituloProjeto: tool.title || '', // Título com acentos para exibição
        urlCompleta: urlCompletaCalculada,
        emoji: tool.emoji || '',
        cores: tool.custom_colors || { principal: '#3B82F6', secundaria: '#2563EB' },
        tipoCta: tool.cta_type === 'whatsapp' ? 'whatsapp' : 'url',
        mensagemWhatsapp: tool.custom_whatsapp_message || '',
        urlExterna: tool.external_url || '',
        textoBotao: tool.cta_button_text || 'Conversar com Especialista',
        mostrarBotaoWhatsapp: tool.show_whatsapp_button !== false // Por padrão true se não estiver definido
      })
      
      // Atualizar URL completa se userSlug mudar depois
      if (userSlug) {
        const baseUrl = getAppUrl().replace(/^https?:\/\//, '') // Remove protocolo para exibição
        const novaUrl = `${baseUrl}/pt/c/${userSlug}/${tool.slug}`
        setConfiguracao(prev => ({ ...prev, urlCompleta: novaUrl }))
      }
      setUrlDisponivel(true)
    } catch (error: any) {
      console.error('Erro ao carregar ferramenta:', error)
      setMensagemErro(error.message || 'Erro ao carregar ferramenta')
      setTimeout(() => {
        router.push('/pt/coach/ferramentas')
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  // Validar URL disponível
  const validarUrl = async (url: string): Promise<boolean> => {
    if (!url || url.trim() === '') {
      setUrlDisponivel(false)
      return false
    }

    // Se não mudou, não precisa validar
    if (url === slugOriginal) {
      setUrlDisponivel(true)
      return true
    }

    try {
      const response = await fetch(`/api/coach/ferramentas/check-slug?slug=${encodeURIComponent(url)}`)
      const data = await response.json()
      
      setUrlDisponivel(data.available)
      return data.available
    } catch (error) {
      console.error('Erro ao validar URL:', error)
      setUrlDisponivel(false)
      return false
    }
  }

  // Atualizar URL completa quando slug mudar
  useEffect(() => {
    if (configuracao.urlPersonalizada) {
      const valorOriginal = configuracao.urlPersonalizada
      const slugTratado = tratarUrl(valorOriginal)
      
      // Se foi normalizado, mostrar aviso
      if (valorOriginal !== slugTratado && valorOriginal.length > 0) {
        setSlugNormalizado(true)
        setTimeout(() => setSlugNormalizado(false), 3000)
      }
      
      const baseUrl = getAppUrl().replace(/^https?:\/\//, '') // Remove protocolo para exibição
      const url = userSlug 
        ? `${baseUrl}/pt/c/${userSlug}/${slugTratado}`
        : `${baseUrl}/pt/c/[configure-seu-slug]/${slugTratado}`
      
      setConfiguracao(prev => ({ 
        ...prev, 
        urlPersonalizada: slugTratado,
        urlCompleta: url
      }))
      
      // Validar disponibilidade se mudou
      if (slugTratado !== slugOriginal) {
        const timeoutId = setTimeout(() => {
          validarUrl(slugTratado)
        }, 500)

        return () => clearTimeout(timeoutId)
      } else {
        setUrlDisponivel(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuracao.urlPersonalizada, userSlug])

  const salvarFerramenta = async () => {
    // Validar URL se mudou
    if (configuracao.urlPersonalizada !== slugOriginal) {
      const urlValida = await validarUrl(configuracao.urlPersonalizada)
      if (!urlValida) {
        setMensagemErro('Este nome de URL já está em uso. Escolha outro.')
        setTimeout(() => setMensagemErro(null), 5000)
        return
      }
    }

    if (!toolData) {
      setMensagemErro('Erro: dados da ferramenta não carregados.')
      setTimeout(() => setMensagemErro(null), 5000)
      return
    }

    // Validar campos obrigatórios
    if (!configuracao.tituloProjeto || !configuracao.urlPersonalizada) {
      setMensagemErro('Preencha o título do projeto.')
      setTimeout(() => setMensagemErro(null), 5000)
      return
    }

    if (configuracao.tipoCta === 'whatsapp' && !perfilWhatsapp) {
      setMensagemErro('Configure seu WhatsApp no perfil antes de atualizar ferramentas com CTA WhatsApp. Acesse: Configurações > Perfil')
      setTimeout(() => setMensagemErro(null), 5000)
      return
    }

    if (configuracao.tipoCta === 'url' && !configuracao.urlExterna) {
      setMensagemErro('Informe a URL externa.')
      setTimeout(() => setMensagemErro(null), 5000)
      return
    }

    // Validar se URL externa não é do WhatsApp
    if (configuracao.tipoCta === 'url' && validarUrlWhatsapp(configuracao.urlExterna)) {
      setMensagemErro('URLs do WhatsApp não são permitidas em URLs externas. Para usar WhatsApp, escolha a opção "WhatsApp" no tipo de CTA. Essa opção usa automaticamente o número do seu perfil.')
      setTimeout(() => setMensagemErro(null), 5000)
      return
    }

    try {
      setSalvando(true)
      setMensagemErro(null)
      
      // Usar título do projeto (com acentos) ou gerar a partir do slug se não tiver título
      const tituloFinal = configuracao.tituloProjeto || gerarTituloDoSlug(configuracao.urlPersonalizada)

      const payload = {
        id: toolData.id,
        title: tituloFinal, // Usar título do projeto (com acentos) para exibição
        description: descricao || toolData.description,
        slug: configuracao.urlPersonalizada,
        emoji: configuracao.emoji,
        custom_colors: configuracao.cores,
        cta_type: configuracao.tipoCta === 'whatsapp' ? 'whatsapp' : 'url_externa',
        whatsapp_number: configuracao.tipoCta === 'whatsapp' ? perfilWhatsapp : null,
        external_url: configuracao.tipoCta === 'url' ? configuracao.urlExterna : null,
        cta_button_text: configuracao.textoBotao,
        custom_whatsapp_message: configuracao.mensagemWhatsapp,
        show_whatsapp_button: configuracao.mostrarBotaoWhatsapp, // Mostrar botão WhatsApp pequeno
        generate_short_url: generateShortUrl,
        custom_short_code: usarCodigoPersonalizado && customShortCode.length >= 3 && shortCodeDisponivel ? customShortCode : null
      }

      const response = await fetch('/api/coach/ferramentas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar ferramenta')
      }

      // Mostrar mensagem de sucesso visual
      setMensagemSucesso('Ferramenta atualizada com sucesso!')
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/pt/coach/ferramentas')
      }, 2000)
    } catch (error: any) {
      console.error('Erro ao salvar ferramenta:', error)
      setMensagemErro(error.message || 'Erro ao atualizar ferramenta. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
    } finally {
      setSalvando(false)
    }
  }

  // Alternar status (ativa/inativa)
  const alternarStatus = async () => {
    if (!toolData) return
    
    try {
      setSalvando(true)
      const novoStatus = toolData.status === 'active' ? 'inactive' : 'active'
      
      const response = await fetch('/api/coach/ferramentas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: toolData.id,
          status: novoStatus
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar status')
      }

      // Atualizar estado local
      setToolData({ ...toolData, status: novoStatus })
      setMensagemSucesso(`Ferramenta ${novoStatus === 'active' ? 'ativada' : 'desativada'} com sucesso!`)
      setTimeout(() => setMensagemSucesso(null), 3000)
    } catch (error: any) {
      console.error('Erro ao alterar status:', error)
      setMensagemErro(error.message || 'Erro ao alterar status. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
    } finally {
      setSalvando(false)
    }
  }

  // Excluir ferramenta
  const excluirFerramenta = async () => {
    if (!toolData) return
    
    try {
      setExcluindo(true)
      
      const response = await fetch(`/api/coach/ferramentas?id=${toolData.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir ferramenta')
      }

      // Mostrar mensagem de sucesso e redirecionar
      setMensagemSucesso('Ferramenta excluída com sucesso!')
      setTimeout(() => {
        router.push('/pt/coach/ferramentas')
      }, 1500)
    } catch (error: any) {
      console.error('Erro ao excluir ferramenta:', error)
      setMensagemErro(error.message || 'Erro ao excluir ferramenta. Tente novamente.')
      setTimeout(() => setMensagemErro(null), 5000)
      setMostrarConfirmacaoExclusao(false)
    } finally {
      setExcluindo(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ferramenta...</p>
        </div>
      </div>
    )
  }

  if (!toolData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ferramenta não encontrada</p>
          <Link
            href="/pt/coach/ferramentas"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachNavBar showTitle={true} title="Editar Ferramenta" />

      {/* Mensagens de Sucesso/Erro */}
      {mensagemSucesso && (
        <div className="fixed top-4 right-4 bg-green-50 border-2 border-green-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-900 mb-1">Sucesso!</h3>
              <p className="text-xs text-green-700">{mensagemSucesso}</p>
            </div>
            <button 
              onClick={() => setMensagemSucesso(null)}
              className="text-green-600 hover:text-green-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {mensagemErro && (
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900 mb-1">Erro</h3>
              <p className="text-xs text-red-700">{mensagemErro}</p>
            </div>
            <button 
              onClick={() => setMensagemErro(null)}
              className="text-red-600 hover:text-red-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {mostrarConfirmacaoExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <span className="text-red-600 text-4xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
                <p className="text-sm text-gray-600">
                  Tem certeza que deseja excluir esta ferramenta? Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarConfirmacaoExclusao(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button
                onClick={excluirFerramenta}
                disabled={excluindo}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {excluindo ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda: Configuração */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações</h2>

              {/* Nome do Projeto - Colapsável */}
              <div className="mb-6">
                <button
                  onClick={() => setAbaNomeProjeto(!abaNomeProjeto)}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Nome do Projeto</span>
                  <span>{abaNomeProjeto ? '▼' : '▶'}</span>
                </button>
                {abaNomeProjeto && (
                  <div className="mt-4 space-y-4">
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
                            setTimeout(() => setSlugNormalizado(false), 3000)
                          }
                          
                          setConfiguracao(prev => ({ 
                            ...prev, 
                            tituloProjeto: tituloOriginal, // Mantém título original com acentos
                            urlPersonalizada: slugGerado // Gera slug automaticamente
                          }))
                        }}
                        placeholder="Ex: Calculadora de Água"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 <strong>Este é o título que aparecerá na tela do cliente.</strong> Você pode usar acentos e espaços normalmente.
                      </p>
                      
                      {/* Mostrar preview do slug gerado */}
                      {configuracao.urlPersonalizada && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">
                            <strong>🔗 Slug para URL (gerado automaticamente):</strong>
                          </p>
                          <p className={`text-sm font-mono px-2 py-1 rounded border ${
                            urlDisponivel 
                              ? 'bg-white text-gray-800 border-gray-300' 
                              : 'bg-red-50 text-red-800 border-red-300'
                          }`}>
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
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm font-semibold text-purple-900 mb-2">
                            🔗 Sua URL completa será:
                          </p>
                          <div className={`px-3 py-2 rounded ${urlDisponivel ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            <p className="text-sm font-medium mb-1">
                              {urlDisponivel ? '✓ Disponível' : '✗ Já em uso por você'} 
                            </p>
                            <p className="text-xs font-mono break-all text-gray-800">
                              {configuracao.urlCompleta}
                            </p>
                          </div>
                          <div className="mt-3 p-3 bg-purple-100 rounded-lg">
                            <p className="text-xs text-purple-800">
                              <strong>📋 Composição da URL:</strong><br/>
                              • <strong className="text-purple-900">{userSlug || '[seu-nome-url]'}</strong> = Seu nome único na URL (configurado no perfil)<br/>
                              • <strong className="text-purple-900">{configuracao.urlPersonalizada || '[nome-projeto]'}</strong> = Nome do projeto que você escolher<br/>
                              <br/>
                              <strong>💡 Importante:</strong> Diferentes pessoas podem usar o mesmo nome de projeto (ex: "água") porque a URL final será diferente com o seu nome único!
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {!userSlug && (
                        <div className="mt-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            ⚠️ Configure seu slug no <Link href="/pt/coach/configuracao" className="underline font-semibold">perfil</Link> para personalizar a URL.
                          </p>
                        </div>
                      )}
                      
                      {/* Código Curto Existente */}
                      {shortCodeExistente && (
                        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-sm font-medium text-gray-900 block">
                                ✅ URL Encurtada Ativa
                              </span>
                              <span className="text-xs text-gray-600 mt-1 block">
                                <code className="bg-white px-1 py-0.5 rounded font-mono">{getAppUrl()}/p/{shortCodeExistente}</code>
                              </span>
                            </div>
                            <button
                              onClick={async () => {
                                if (confirm('Tem certeza que deseja remover o código curto? Esta ação não pode ser desfeita.')) {
                                  try {
                                    setRemovendoShortCode(true)
                                    const response = await fetch('/api/coach/ferramentas', {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      credentials: 'include',
                                      body: JSON.stringify({
                                        id: toolId,
                                        remove_short_code: true
                                      }),
                                    })

                                    if (!response.ok) {
                                      throw new Error('Erro ao remover código curto')
                                    }

                                    setShortCodeExistente(null)
                                    setMensagemSucesso('Código curto removido com sucesso!')
                                    setTimeout(() => setMensagemSucesso(null), 3000)
                                  } catch (error: any) {
                                    console.error('Erro ao remover código curto:', error)
                                    setMensagemErro(error.message || 'Erro ao remover código curto')
                                    setTimeout(() => setMensagemErro(null), 5000)
                                  } finally {
                                    setRemovendoShortCode(false)
                                  }
                                }
                              }}
                              disabled={removendoShortCode}
                              className="text-xs text-red-600 hover:text-red-700 underline disabled:opacity-50"
                            >
                              {removendoShortCode ? 'Removendo...' : 'Remover'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Gerar Novo Código Curto */}
                      {!shortCodeExistente && (
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
                                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <label htmlFor="generateShortUrl" className="flex-1 cursor-pointer">
                                <span className="text-sm font-medium text-gray-900 block">
                                  🔗 Gerar URL Encurtada
                                </span>
                                <span className="text-xs text-gray-600 mt-1 block">
                                  Crie um link curto como <code className="bg-white px-1 py-0.5 rounded">{getAppUrl().replace(/^https?:\/\//, '')}/p/abc123</code> para facilitar compartilhamento.
                                </span>
                              </label>
                            </div>
                          </div>

                          {/* Opção de Código Personalizado */}
                          {generateShortUrl && (
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
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
                                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
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
                                                  `/api/coach/ferramentas/check-short-code?code=${encodeURIComponent(value)}&excludeId=${toolId}`
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
                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                                        />
                                      </div>
                                      {verificandoShortCode && (
                                        <p className="text-xs text-gray-500 mt-1">Verificando...</p>
                                      )}
                                      {!verificandoShortCode && shortCodeDisponivel === true && customShortCode.length >= 3 && (
                                        <p className="text-xs text-green-600 mt-1">✅ Código disponível!</p>
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
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição (opcional)
                      </label>
                      <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Uma descrição breve que aparece abaixo do título"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Aparência - Colapsável */}
              <div className="mb-6">
                <button
                  onClick={() => setAbaAparencia(!abaAparencia)}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Aparência</span>
                  <span>{abaAparencia ? '▼' : '▶'}</span>
                </button>
                {abaAparencia && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emoji (opcional)
                      </label>
                      <input
                        type="text"
                        value={configuracao.emoji}
                        onChange={(e) => setConfiguracao(prev => ({ ...prev, emoji: e.target.value }))}
                        placeholder="Ex: 📊"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Digite um emoji ou cole do seu dispositivo (clique com botão direito)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cores do Botão
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Cor Principal</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={configuracao.cores.principal}
                              onChange={(e) => setConfiguracao(prev => ({
                                ...prev,
                                cores: { ...prev.cores, principal: e.target.value }
                              }))}
                              className="w-20 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={configuracao.cores.principal}
                              onChange={(e) => setConfiguracao(prev => ({
                                ...prev,
                                cores: { ...prev.cores, principal: e.target.value }
                              }))}
                              placeholder="#10B981"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Cor Secundária</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={configuracao.cores.secundaria}
                              onChange={(e) => setConfiguracao(prev => ({
                                ...prev,
                                cores: { ...prev.cores, secundaria: e.target.value }
                              }))}
                              className="w-20 h-10 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={configuracao.cores.secundaria}
                              onChange={(e) => setConfiguracao(prev => ({
                                ...prev,
                                cores: { ...prev.cores, secundaria: e.target.value }
                              }))}
                              placeholder="#059669"
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA e Botão - Colapsável */}
              <div className="mb-6">
                <button
                  onClick={() => setAbaCTA(!abaCTA)}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">CTA e Botão</span>
                  <span>{abaCTA ? '▼' : '▶'}</span>
                </button>
                {abaCTA && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de CTA <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={configuracao.tipoCta}
                        onChange={(e) => {
                          setConfiguracao(prev => ({
                            ...prev,
                            tipoCta: e.target.value as 'whatsapp' | 'url'
                          }))
                          setErroUrlWhatsapp(false) // Limpar erro ao trocar tipo de CTA
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="url">URL Externa</option>
                      </select>
                    </div>

                    {configuracao.tipoCta === 'whatsapp' && (
                      <>
                        {carregandoPerfil ? (
                          <div className="animate-pulse bg-gray-100 h-20 rounded-lg"></div>
                        ) : perfilWhatsapp ? (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
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
                                  <Link href="/pt/coach/configuracao" className="text-purple-600 underline font-semibold">
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
                                  href="/pt/coach/configuracao"
                                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                >
                                  Ir para Configurações
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mensagem Pré-formatada (opcional)
                          </label>
                          <textarea
                            value={configuracao.mensagemWhatsapp}
                            onChange={(e) => setConfiguracao(prev => ({
                              ...prev,
                              mensagemWhatsapp: e.target.value
                            }))}
                            placeholder="Olá! Calculei meu IMC através do YLADA..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            disabled={!perfilWhatsapp}
                          />
                          <div className="mt-2 bg-purple-50 rounded-lg p-3">
                            <p className="text-xs text-purple-700 font-medium mb-1">💡 Placeholders disponíveis:</p>
                            <p className="text-xs text-purple-600">
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
                              onChange={(e) => setConfiguracao(prev => ({ ...prev, mostrarBotaoWhatsapp: e.target.checked }))}
                              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
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
                            setConfiguracao(prev => ({
                              ...prev,
                              urlExterna: url
                            }))
                          }}
                          placeholder="https://seu-site.com/contato"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                            erroUrlWhatsapp 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-purple-500'
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
                          💡 URL para onde o cliente será redirecionado após ver o resultado (ex: site, formulário, página de agendamento)
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto do Botão <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={configuracao.textoBotao}
                        onChange={(e) => setConfiguracao(prev => ({
                          ...prev,
                          textoBotao: e.target.value
                        }))}
                        placeholder="Conversar com Especialista"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Status e Ações */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Status da Ferramenta
                    </label>
                    <p className="text-xs text-gray-500">
                      {toolData.status === 'active' 
                        ? '✅ Ferramenta está ativa e visível para seus clientes'
                        : '⏸️ Ferramenta está inativa e não será exibida'}
                    </p>
                  </div>
                  <button
                    onClick={alternarStatus}
                    disabled={salvando}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      toolData.status === 'active' ? 'bg-purple-600' : 'bg-gray-300'
                    } ${salvando ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        toolData.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => router.push('/pt/coach/ferramentas')}
                  disabled={salvando || excluindo}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarFerramenta}
                  disabled={salvando || excluindo}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>

              {/* Botão de Excluir */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setMostrarConfirmacaoExclusao(true)}
                  disabled={salvando || excluindo}
                  className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🗑️ Excluir Ferramenta
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Preview */}
            <div className="bg-white rounded-xl border-2 border-purple-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📱 Preview</h3>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              {configuracao.emoji && (
                <div className="text-5xl mb-4 text-center">{configuracao.emoji}</div>
              )}
              <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {configuracao.urlPersonalizada 
                  ? configuracao.tituloProjeto
                  : 'Título do Projeto'}
              </h4>
              {descricao && (
                <p className="text-sm text-gray-600 mb-6 text-center">{descricao}</p>
              )}
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
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

