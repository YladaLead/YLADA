'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Configuracao {
  urlPersonalizada: string
  urlCompleta: string
  emoji: string
  cores: {
    principal: string
    secundaria: string
  }
  tipoCta: 'whatsapp' | 'url'
  numeroWhatsapp: string
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
    numeroWhatsapp: '',
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

  const nomeDoUsuario = 'Carlos Oliveira'

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

  // Carregar dados da ferramenta
  useEffect(() => {
    carregarFerramenta()
  }, [toolId])

  const carregarFerramenta = async () => {
    try {
      setLoading(true)
      const userId = 'user-temp-001' // TODO: Autenticação

      const response = await fetch(
        `/api/wellness/ferramentas?id=${toolId}&user_id=${userId}&profession=wellness`
      )

      if (!response.ok) {
        throw new Error('Ferramenta não encontrada')
      }

      const data = await response.json()
      const tool = data.tool
      setToolData(tool)

      // Extrair país do WhatsApp se existir
      if (tool.whatsapp_number) {
        const numero = tool.whatsapp_number
        for (const [country, info] of Object.entries(codigosTelefone)) {
          if (numero.startsWith(info.codigo)) {
            setPaisTelefone(country)
            const numeroSemCodigo = numero.replace(info.codigo, '')
            setConfiguracao(prev => ({
              ...prev,
              numeroWhatsapp: numeroSemCodigo
            }))
            break
          }
        }
      }

      // Preencher configuração com dados da ferramenta
      const urlNome = tratarUrl(nomeDoUsuario)
      const urlCompleta = `ylada.app/wellness/${urlNome}/${tool.slug}`

      setSlugOriginal(tool.slug)
      setDescricao(tool.description || '')
      setConfiguracao({
        urlPersonalizada: tool.slug,
        urlCompleta,
        emoji: tool.emoji || '',
        cores: tool.custom_colors || { principal: '#10B981', secundaria: '#059669' },
        tipoCta: tool.cta_type === 'whatsapp' ? 'whatsapp' : 'url',
        numeroWhatsapp: tool.whatsapp_number?.replace(/\+[0-9]+/, '') || '',
        mensagemWhatsapp: tool.custom_whatsapp_message || '',
        urlExterna: tool.external_url || '',
        textoBotao: tool.cta_button_text || 'Conversar com Especialista'
      })
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
      const slugTratado = tratarUrl(configuracao.urlPersonalizada)
      const urlNome = tratarUrl(nomeDoUsuario)
      const url = `ylada.app/wellness/${urlNome}/${slugTratado}`
      
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
  }, [configuracao.urlPersonalizada])

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

    if (configuracao.tipoCta === 'whatsapp' && !configuracao.numeroWhatsapp) {
      alert('Informe o número do WhatsApp.')
      return
    }

    if (configuracao.tipoCta === 'url' && !configuracao.urlExterna) {
      alert('Informe a URL externa.')
      return
    }

    try {
      const userId = 'user-temp-001' // TODO: Autenticação

      const nomeAmigavel = configuracao.urlPersonalizada
        .split('-')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ')

      const payload = {
        id: toolData.id,
        user_id: userId,
        title: nomeAmigavel,
        description: descricao || toolData.description,
        slug: configuracao.urlPersonalizada,
        emoji: configuracao.emoji,
        custom_colors: configuracao.cores,
        cta_type: configuracao.tipoCta === 'whatsapp' ? 'whatsapp' : 'url_externa',
        whatsapp_number: configuracao.tipoCta === 'whatsapp' 
          ? `${codigosTelefone[paisTelefone as keyof typeof codigosTelefone].codigo}${configuracao.numeroWhatsapp}`
          : null,
        external_url: configuracao.tipoCta === 'url' ? configuracao.urlExterna : null,
        cta_button_text: configuracao.textoBotao,
        custom_whatsapp_message: configuracao.mensagemWhatsapp,
      }

      const response = await fetch('/api/wellness/ferramentas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">
                Editar Ferramenta
              </h1>
            </div>
            <Link
              href="/pt/wellness/ferramentas"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

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
                          const tratado = tratarUrl(e.target.value)
                          setConfiguracao(prev => ({ ...prev, urlPersonalizada: tratado }))
                        }}
                        placeholder="Ex: calculadora-imc"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        URL será: {configuracao.urlCompleta || '...'}
                      </div>
                      {configuracao.urlPersonalizada && configuracao.urlPersonalizada !== slugOriginal && (
                        <div className={`mt-2 text-xs ${urlDisponivel ? 'text-green-600' : 'text-red-600'}`}>
                          {urlDisponivel ? '✓ Disponível' : '✗ Já está em uso'}
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
                        onChange={(e) => setConfiguracao(prev => ({
                          ...prev,
                          tipoCta: e.target.value as 'whatsapp' | 'url'
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="url">URL Externa</option>
                      </select>
                    </div>

                    {configuracao.tipoCta === 'whatsapp' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            País e Telefone <span className="text-red-500">*</span>
                          </label>
                          <div className="flex gap-2">
                            <select
                              value={paisTelefone}
                              onChange={(e) => setPaisTelefone(e.target.value)}
                              className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              {Object.entries(codigosTelefone).map(([code, info]) => (
                                <option key={code} value={code}>
                                  {info.bandeira} {info.codigo}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={configuracao.numeroWhatsapp}
                              onChange={(e) => setConfiguracao(prev => ({
                                ...prev,
                                numeroWhatsapp: e.target.value.replace(/\D/g, '')
                              }))}
                              placeholder="11 99999-9999"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
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
                          onChange={(e) => setConfiguracao(prev => ({
                            ...prev,
                            urlExterna: e.target.value
                          }))}
                          placeholder="https://seu-site.com/contato"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
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
                  ? configuracao.urlPersonalizada
                      .split('-')
                      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                      .join(' ')
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
                      📱 Abrirá WhatsApp: {codigosTelefone[paisTelefone as keyof typeof codigosTelefone]?.codigo} {configuracao.numeroWhatsapp || '...'}
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

