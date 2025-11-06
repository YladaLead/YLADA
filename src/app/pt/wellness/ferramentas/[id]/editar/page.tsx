'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { getAppUrl, buildWellnessToolUrl } from '@/lib/url-utils'

interface Configuracao {
  urlPersonalizada: string
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
  template_slug: string
  status: string
}

export default function EditarFerramentaWellness() {
  const params = useParams()
  const router = useRouter()
  const toolId = params.id as string

  const [loading, setLoading] = useState(true)
  const [toolData, setToolData] = useState<ToolData | null>(null)
  const [paisTelefone, setPaisTelefone] = useState('BR')
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
  const [slugOriginal, setSlugOriginal] = useState('')
  const [abaNomeProjeto, setAbaNomeProjeto] = useState(false)
  const [abaAparencia, setAbaAparencia] = useState(false)
  const [abaCTA, setAbaCTA] = useState(false)
  const [descricao, setDescricao] = useState('')
  const [userSlug, setUserSlug] = useState<string>('')
  const [slugNormalizado, setSlugNormalizado] = useState(false)
  const [generateShortUrl, setGenerateShortUrl] = useState(false)
  const [perfilWhatsapp, setPerfilWhatsapp] = useState<string | null>(null)
  const [carregandoPerfil, setCarregandoPerfil] = useState(true)
  const [erroUrlWhatsapp, setErroUrlWhatsapp] = useState(false) // Flag para erro de URL do WhatsApp

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
        const response = await fetch('/api/wellness/profile')
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
        `/api/wellness/ferramentas?id=${toolId}&profession=wellness`,
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
      
      // Calcular URL completa baseada no slug e userSlug atual
      const baseUrl = getAppUrl().replace(/^https?:\/\//, '') // Remove protocolo para exibição
      const urlCompletaCalculada = userSlug 
        ? `${baseUrl}/pt/wellness/${userSlug}/${tool.slug}`
        : `${baseUrl}/pt/wellness/[configure-seu-slug]/${tool.slug}`
      
      setConfiguracao({
        urlPersonalizada: tool.slug,
        urlCompleta: urlCompletaCalculada,
        emoji: tool.emoji || '',
        cores: tool.custom_colors || { principal: '#10B981', secundaria: '#059669' },
        tipoCta: tool.cta_type === 'whatsapp' ? 'whatsapp' : 'url',
        mensagemWhatsapp: tool.custom_whatsapp_message || '',
        urlExterna: tool.external_url || '',
        textoBotao: tool.cta_button_text || 'Conversar com Especialista'
      })
      
      // Atualizar URL completa se userSlug mudar depois
      if (userSlug) {
        const baseUrl = getAppUrl().replace(/^https?:\/\//, '') // Remove protocolo para exibição
        const novaUrl = `${baseUrl}/pt/wellness/${userSlug}/${tool.slug}`
        setConfiguracao(prev => ({ ...prev, urlCompleta: novaUrl }))
      }
      setUrlDisponivel(true)
    } catch (error: any) {
      console.error('Erro ao carregar ferramenta:', error)
      alert(error.message || 'Erro ao carregar ferramenta')
      router.push('/pt/wellness/ferramentas')
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
        ? `${baseUrl}/pt/wellness/${userSlug}/${slugTratado}`
        : `${baseUrl}/pt/wellness/[configure-seu-slug]/${slugTratado}`
      
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
        alert('Este nome de URL já está em uso. Escolha outro.')
        return
      }
    }

    if (!toolData) {
      alert('Erro: dados da ferramenta não carregados.')
      return
    }

    // Validar campos obrigatórios
    if (!configuracao.urlPersonalizada) {
      alert('Preencha o nome do projeto.')
      return
    }

    if (configuracao.tipoCta === 'whatsapp' && !perfilWhatsapp) {
      alert('Configure seu WhatsApp no perfil antes de atualizar ferramentas com CTA WhatsApp. Acesse: Configurações > Perfil')
      return
    }

    if (configuracao.tipoCta === 'url' && !configuracao.urlExterna) {
      alert('Informe a URL externa.')
      return
    }

    // Validar se URL externa não é do WhatsApp
    if (configuracao.tipoCta === 'url' && validarUrlWhatsapp(configuracao.urlExterna)) {
      alert('⚠️ URLs do WhatsApp não são permitidas em URLs externas.\n\nPara usar WhatsApp, escolha a opção "WhatsApp" no tipo de CTA. Essa opção usa automaticamente o número do seu perfil.')
      return
    }

    try {
      // Formatar título usando função melhorada
      const nomeAmigavel = gerarTituloDoSlug(configuracao.urlPersonalizada)

      const payload = {
        id: toolData.id,
        title: nomeAmigavel,
        description: descricao || toolData.description,
        slug: configuracao.urlPersonalizada,
        emoji: configuracao.emoji,
        custom_colors: configuracao.cores,
        cta_type: configuracao.tipoCta === 'whatsapp' ? 'whatsapp' : 'url_externa',
        whatsapp_number: configuracao.tipoCta === 'whatsapp' ? perfilWhatsapp : null,
        external_url: configuracao.tipoCta === 'url' ? configuracao.urlExterna : null,
        cta_button_text: configuracao.textoBotao,
        custom_whatsapp_message: configuracao.mensagemWhatsapp,
        generate_short_url: generateShortUrl
      }

      const response = await fetch('/api/wellness/ferramentas', {
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

      alert('Ferramenta atualizada com sucesso!')
      router.push('/pt/wellness/ferramentas')
    } catch (error: any) {
      console.error('Erro ao salvar ferramenta:', error)
      alert(error.message || 'Erro ao atualizar ferramenta. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
            href="/pt/wellness/ferramentas"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Editar Ferramenta" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda: Configuração */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-green-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações</h2>

              {/* Nome do Projeto - Colapsável */}
              <div className="mb-6">
                <button
                  onClick={() => setAbaNomeProjeto(!abaNomeProjeto)}
                  className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Nome do Projeto</span>
                  <span>{abaNomeProjeto ? '▼' : '▶'}</span>
                </button>
                {abaNomeProjeto && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Projeto (para URL) <span className="text-red-500">*</span>
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
                            setTimeout(() => setSlugNormalizado(false), 3000)
                          }
                          
                          setConfiguracao(prev => ({ ...prev, urlPersonalizada: valorTratado }))
                        }}
                        placeholder="Ex: calculadora-imc"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                          urlDisponivel 
                            ? 'border-green-300 focus:ring-green-500' 
                            : 'border-red-300 focus:ring-red-500'
                        }`}
                      />
                      {slugNormalizado && (
                        <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800">
                            ℹ️ <strong>Normalizado automaticamente:</strong> Acentos, espaços e caracteres especiais foram convertidos para formato de URL válido.
                          </p>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        URL será: {configuracao.urlCompleta || '...'}
                      </div>
                      {configuracao.urlPersonalizada && configuracao.urlPersonalizada !== slugOriginal && (
                        <div className={`mt-2 text-xs ${urlDisponivel ? 'text-green-600' : 'text-red-600'}`}>
                          {urlDisponivel ? '✓ Disponível' : '✗ Já está em uso'}
                        </div>
                      )}
                      {!userSlug && (
                        <div className="mt-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-xs text-yellow-800">
                            ⚠️ Configure seu slug no <Link href="/pt/wellness/configuracao" className="underline font-semibold">perfil</Link> para personalizar a URL.
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
                            Crie um link curto como <code className="bg-white px-1 py-0.5 rounded">{getAppUrl().replace(/^https?:\/\//, '')}/p/abc123</code> para facilitar compartilhamento.
                          </span>
                        </label>
                      </div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Aparência - Colapsável */}
              <div className="mb-6">
                <button
                  onClick={() => setAbaAparencia(!abaAparencia)}
                  className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl"
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
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => router.push('/pt/wellness/ferramentas')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarFerramenta}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Preview */}
          <div className="bg-white rounded-xl border-2 border-green-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📱 Preview</h3>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              {configuracao.emoji && (
                <div className="text-5xl mb-4 text-center">{configuracao.emoji}</div>
              )}
              <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {configuracao.urlPersonalizada 
                  ? gerarTituloDoSlug(configuracao.urlPersonalizada)
                  : 'Nome do Projeto'}
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

