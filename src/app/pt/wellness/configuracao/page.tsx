'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { translateError } from '@/lib/error-messages'
import { createClient } from '@/lib/supabase-client'
import PushNotificationManager from '@/components/push/PushNotificationManager'
import CancelRetentionModal from '@/components/wellness/CancelRetentionModal'

export default function WellnessConfiguracaoPage() {
  const router = useRouter()
  const { user, userProfile, signOut } = useAuth()
  const authenticatedFetch = useAuthenticatedFetch()
  const [perfil, setPerfil] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    countryCode: 'BR',
    bio: '',
    headline: '',
    avatarUrl: '',
    userSlug: ''
  })
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [slugDisponivel, setSlugDisponivel] = useState(true)
  const [slugValidando, setSlugValidando] = useState(false)
  const [slugNormalizado, setSlugNormalizado] = useState(false)
  const [slugSugestoes, setSlugSugestoes] = useState<string[]>([])
  const [salvando, setSalvando] = useState(false)
  const [salvoComSucesso, setSalvoComSucesso] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [showSenhaAtual, setShowSenhaAtual] = useState(false)
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [salvandoSenha, setSalvandoSenha] = useState(false)
  const [erroSenha, setErroSenha] = useState<string | null>(null)
  const [sucessoSenha, setSucessoSenha] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [carregandoAssinatura, setCarregandoAssinatura] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Função para tratar slug (lowercase, sem espaços/acentos, COM hífens - formato nome-sobrenome)
  const tratarSlug = (texto: string): string => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove tudo exceto letras, números, espaços e hífens
      .trim() // Remove espaços no início e fim
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-|-$/g, '') // Remove hífens no início e fim
      .substring(0, 50) // Limitar a 50 caracteres (nome-sobrenome pode ser maior)
  }

  // Validar disponibilidade do slug
  const validarSlug = async (slug: string) => {
    if (!slug || slug.trim() === '') {
      setSlugDisponivel(false)
      return
    }

    try {
      setSlugValidando(true)
      const slugTratado = tratarSlug(slug)
      
      // Verificar palavras reservadas
      const palavrasReservadas = ['portal', 'ferramenta', 'ferramentas', 'home', 'configuracao', 'configuracoes', 'perfil', 'admin', 'api', 'pt', 'c', 'coach', 'nutri', 'wellness', 'nutra']
      if (palavrasReservadas.includes(slugTratado.toLowerCase())) {
        setSlugDisponivel(false)
        setErro(`"${slugTratado}" é uma palavra reservada e não pode ser usada. Escolha outro nome.`)
        return
      }
      
      // Verificar se slug já existe para outro usuário
      const response = await authenticatedFetch(`/api/wellness/profile?user_slug=${encodeURIComponent(slugTratado)}`)
      
      if (response.ok) {
        const data = await response.json()
        // Se não existe OU se existe mas é do próprio usuário, está disponível
        const disponivel = !data.exists || data.isOwn
        setSlugDisponivel(disponivel)
        
        // Se não está disponível, gerar sugestões
        if (!disponivel && slugTratado) {
          const sugestoes: string[] = []
          // Adicionar números no final
          for (let i = 1; i <= 3; i++) {
            sugestoes.push(`${slugTratado}-${i}`)
          }
          // Adicionar ano atual
          const ano = new Date().getFullYear().toString().slice(-2)
          sugestoes.push(`${slugTratado}-${ano}`)
          setSlugSugestoes(sugestoes)
        } else {
          setSlugSugestoes([])
        }
      } else {
        // Se erro na API, assume disponível se tem pelo menos 3 caracteres
        setSlugDisponivel(slugTratado.length >= 3)
        setSlugSugestoes([])
      }
    } catch (error) {
      setSlugDisponivel(false)
    } finally {
      setSlugValidando(false)
    }
  }

  // Atualizar slug automaticamente ao mudar nome (apenas se slug estiver vazio)
  useEffect(() => {
    if (!perfil.userSlug && perfil.nome) {
      // Tentar extrair nome e sobrenome do nome completo
      const partesNome = perfil.nome.trim().split(/\s+/)
      if (partesNome.length >= 2) {
        // Se tem nome e sobrenome, usar os dois primeiros
        const nomeCompleto = `${partesNome[0]} ${partesNome[1]}`
        const sugestao = tratarSlug(nomeCompleto)
        if (sugestao) {
          setPerfil(prev => ({ ...prev, userSlug: sugestao }))
        }
      } else {
        // Se só tem um nome, usar ele mesmo
        const sugestao = tratarSlug(perfil.nome)
        if (sugestao) {
          setPerfil(prev => ({ ...prev, userSlug: sugestao }))
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil.nome])

  // Validar slug em tempo real quando mudar (com debounce)
  useEffect(() => {
    if (!perfil.userSlug || perfil.userSlug.trim() === '') {
      setSlugDisponivel(true) // Reset se vazio
      return
    }

    // Debounce: esperar 500ms após parar de digitar
    const timer = setTimeout(() => {
      validarSlug(perfil.userSlug)
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil.userSlug])

  // Carregar perfil do usuário
  const carregarPerfil = async () => {
    if (!user) {
      console.log('⚠️ carregarPerfil: Usuário não disponível')
      return
    }
    
    try {
      console.log('🔄 carregarPerfil: Iniciando carregamento do perfil...')
      setCarregando(true)
      
      // Adicionar timestamp para evitar cache
      const response = await authenticatedFetch(`/api/wellness/profile?t=${Date.now()}`, {
        cache: 'no-store' // Forçar não usar cache
      })
      
      console.log('📡 carregarPerfil: Resposta recebida:', {
        ok: response.ok,
        status: response.status
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('📋 carregarPerfil: Dados recebidos:', data)
        
        if (data.profile) {
          const novoPerfil = {
            nome: data.profile.nome || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '',
            email: data.profile.email || user?.email || '',
            telefone: data.profile.telefone || data.profile.whatsapp || '',
            whatsapp: data.profile.whatsapp || data.profile.telefone || '',
            countryCode: data.profile.countryCode || 'BR',
            bio: data.profile.bio || '',
            headline: data.profile.headline || '',
            avatarUrl: data.profile.avatarUrl || '',
            userSlug: data.profile.userSlug || ''
          }
          
          console.log('✅ carregarPerfil: Definindo perfil:', novoPerfil)
          setPerfil(novoPerfil)
        } else {
          console.warn('⚠️ carregarPerfil: data.profile não existe')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ carregarPerfil: Erro na resposta:', {
          status: response.status,
          error: errorData
        })
        // Se erro ao carregar perfil, usar dados do usuário logado
        setPerfil(prev => ({
          ...prev,
          nome: prev.nome || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
          email: prev.email || user.email || ''
        }))
      }
    } catch (error) {
      console.error('❌ carregarPerfil: Erro ao carregar perfil:', error)
      // Em caso de erro, usar dados do usuário logado
      setPerfil(prev => ({
        ...prev,
        nome: prev.nome || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: prev.email || user.email || ''
      }))
    } finally {
      setCarregando(false)
      console.log('✅ carregarPerfil: Carregamento finalizado')
    }
  }

  // Carregar dados da assinatura
  const carregarAssinatura = async () => {
    if (!user) return
    
    try {
      setCarregandoAssinatura(true)
      const response = await authenticatedFetch('/api/wellness/subscription', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error)
    } finally {
      setCarregandoAssinatura(false)
    }
  }

  // Preencher dados iniciais do usuário logado imediatamente
  useEffect(() => {
    if (user && user.email) {
      // Preencher nome e email imediatamente com dados do login
      setPerfil(prev => ({
        ...prev,
        email: prev.email || user.email || '',
        nome: prev.nome || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || ''
      }))
      // Carregar perfil completo da API
      carregarPerfil()
      // Carregar dados da assinatura
      carregarAssinatura()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Sobe a foto pro bucket e guarda a URL no estado (salva junto no "Salvar perfil").
  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setEnviandoFoto(true)
      setErro(null)
      const form = new FormData()
      form.append('file', file)
      const res = await authenticatedFetch('/api/ylada/perfil/avatar', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok || !json?.url) throw new Error(json?.error || 'Erro ao subir a foto')
      setPerfil((prev) => ({ ...prev, avatarUrl: json.url }))
    } catch (err: any) {
      setErro(err.message || 'Erro ao subir a foto. Tente novamente.')
      setTimeout(() => setErro(null), 8000)
    } finally {
      setEnviandoFoto(false)
      e.target.value = ''
    }
  }

  // Salvar perfil
  const salvarPerfil = async () => {
    // Validações antes de salvar
    if (!perfil.nome || perfil.nome.trim() === '') {
      setErro('O nome completo é obrigatório.')
      setTimeout(() => setErro(null), 5000)
      return
    }

    if (!perfil.userSlug || perfil.userSlug.trim() === '') {
      setErro('O slug para URL é obrigatório.')
      setTimeout(() => setErro(null), 5000)
      return
    }

    // Validar formato do slug: apenas letras minúsculas, números e hífens (formato nome-sobrenome)
    const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/
    if (!slugRegex.test(perfil.userSlug)) {
      setErro('O slug deve conter apenas letras minúsculas, números e hífens. Formato: nome-sobrenome (ex: joao-silva)')
      setTimeout(() => setErro(null), 5000)
      return
    }

    if (!slugDisponivel) {
      setErro('O slug escolhido não está disponível. Escolha outro.')
      setTimeout(() => setErro(null), 5000)
      return
    }

    if (slugValidando) {
      setErro('Aguarde a validação do slug terminar.')
      setTimeout(() => setErro(null), 5000)
      return
    }

    try {
      setSalvando(true)
      setSalvoComSucesso(false)

      const response = await authenticatedFetch('/api/wellness/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: perfil.nome,
          email: perfil.email,
          telefone: perfil.telefone,
          whatsapp: perfil.whatsapp,
          countryCode: perfil.countryCode,
          bio: perfil.bio,
          headline: perfil.headline,
          avatarUrl: perfil.avatarUrl,
          userSlug: perfil.userSlug
        })
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Se erro 401 (não autenticado), tentar fazer refresh da sessão
        if (response.status === 401) {
          console.warn('⚠️ Erro 401 detectado, tentando fazer refresh da sessão...')
          try {
            const supabase = createClient()
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
            
            if (refreshedSession && !refreshError) {
              console.log('✅ Sessão atualizada com sucesso, tentando salvar novamente...')
              // Tentar salvar novamente após refresh
              const retryResponse = await authenticatedFetch('/api/wellness/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  nome: perfil.nome,
                  email: perfil.email,
                  telefone: perfil.telefone,
                  whatsapp: perfil.whatsapp,
                  countryCode: perfil.countryCode,
                  bio: perfil.bio,
                  headline: perfil.headline,
                  avatarUrl: perfil.avatarUrl,
                  userSlug: perfil.userSlug
                })
              })
              
              const retryData = await retryResponse.json()
              
              if (retryResponse.ok) {
                console.log('✅ Perfil salvo com sucesso após refresh da sessão:', retryData)
                setSalvoComSucesso(true)
                setErro(null)
                await carregarPerfil()
                setTimeout(() => setSalvoComSucesso(false), 8000)
                return // Sucesso, sair da função
              } else {
                // Se ainda falhou após refresh, mostrar erro
                console.error('❌ Erro persistiu após refresh da sessão:', {
                  status: retryResponse.status,
                  errorData: retryData
                })
                throw new Error(retryData.error || 'Erro ao salvar. Por favor, faça login novamente.')
              }
            } else {
              console.error('❌ Não foi possível atualizar a sessão:', refreshError)
              throw new Error('Sua sessão expirou. Por favor, faça login novamente.')
            }
          } catch (refreshErr: any) {
            console.error('❌ Erro ao tentar atualizar sessão:', refreshErr)
            throw new Error('Sua sessão expirou. Por favor, faça login novamente.')
          }
        }
        
        // Log detalhado do erro para debug
        console.error('❌ Erro ao salvar perfil:', {
          status: response.status,
          errorData: responseData,
          technical: responseData.technical
        })
        throw new Error(responseData.error || 'Erro ao salvar')
      }

      console.log('✅ Perfil salvo com sucesso:', responseData)

      // Salvar com sucesso!
      setSalvoComSucesso(true)
      setErro(null)
      
      // Recarregar dados do perfil após salvar
      await carregarPerfil()
      
      // Mostrar mensagem de sucesso por mais tempo (8 segundos)
      setTimeout(() => setSalvoComSucesso(false), 8000)
    } catch (error: any) {
      console.error('❌ Erro técnico ao salvar perfil:', {
        error,
        message: error?.message,
        stack: error?.stack
      })
      const mensagemAmigavel = translateError(error)
      setErro(mensagemAmigavel)
      setSalvoComSucesso(false) // Garantir que não mostra sucesso se teve erro
      // Esconder erro após 8 segundos (mais tempo para ler)
      setTimeout(() => setErro(null), 8000)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Configurações" />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Perfil */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📝 Informações do Perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input
                type="text"
                value={perfil.nome}
                onChange={(e) => setPerfil({...perfil, nome: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={perfil.email}
                onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone / WhatsApp *
              </label>
              <PhoneInputWithCountry
                value={perfil.whatsapp || perfil.telefone.replace(/\D/g, '')}
                onChange={(phone, countryCode) => {
                  setPerfil({
                    ...perfil, 
                    telefone: phone,
                    whatsapp: phone.replace(/\D/g, ''),
                    countryCode
                  })
                }}
                defaultCountryCode={perfil.countryCode}
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 O número será usado tanto para telefone quanto WhatsApp. Selecione o país pela bandeira para formatação automática.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto (aparece na sua página pública)</label>
              <div className="flex items-center gap-4">
                {perfil.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={perfil.avatarUrl} alt="Sua foto" className="h-16 w-16 rounded-full object-cover ring-1 ring-gray-200" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl font-semibold text-gray-400 ring-1 ring-gray-200">
                    {(perfil.nome.trim().charAt(0) || 'Y').toUpperCase()}
                  </div>
                )}
                <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {enviandoFoto ? 'Enviando...' : 'Escolher foto'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleUploadFoto} disabled={enviandoFoto} />
                </label>
                {perfil.avatarUrl && (
                  <button type="button" onClick={() => setPerfil({ ...perfil, avatarUrl: '' })} className="text-sm text-gray-500 hover:text-red-600">
                    Remover
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG ou WEBP, até 5 MB.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manchete (uma frase: o que você resolve)</label>
              <input
                type="text"
                value={perfil.headline}
                onChange={(e) => setPerfil({...perfil, headline: e.target.value.substring(0, 120)})}
                maxLength={120}
                placeholder="Ex: Ajudo donas de clínica a encher a agenda sem depender de indicação"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">{perfil.headline.length}/120 — aparece em destaque no topo da sua página pública.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={perfil.bio}
                onChange={(e) => setPerfil({...perfil, bio: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu Slug para URL (obrigatório) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={perfil.userSlug}
                  onChange={(e) => {
                    const valorOriginal = e.target.value
                    const slugTratado = tratarSlug(valorOriginal)
                    
                    // Se foi normalizado, mostrar aviso
                    if (valorOriginal !== slugTratado && valorOriginal.length > 0) {
                      setSlugNormalizado(true)
                      setTimeout(() => setSlugNormalizado(false), 3000) // Esconde após 3s
                    }
                    
                    setPerfil({...perfil, userSlug: slugTratado})
                  }}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 ${
                    slugDisponivel 
                      ? 'border-green-300 focus:ring-green-500' 
                      : 'border-red-300 focus:ring-red-500'
                  }`}
                  placeholder="joao-silva"
                />
                {slugValidando ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                ) : slugDisponivel && perfil.userSlug ? (
                  <span className="text-green-600 text-sm">✓ Disponível</span>
                ) : perfil.userSlug && !slugDisponivel ? (
                  <span className="text-red-600 text-sm">✗ Indisponível</span>
                ) : null}
              </div>
              {/* Sugestões de slug alternativo */}
              {slugSugestoes.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800 mb-2 font-medium">
                    ⚠️ Este slug já está em uso. Sugestões disponíveis:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {slugSugestoes.map((sugestao, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setPerfil({...perfil, userSlug: sugestao})
                          setSlugSugestoes([])
                        }}
                        className="px-3 py-1 text-xs bg-white border border-yellow-300 rounded hover:bg-yellow-100 text-yellow-800 font-medium"
                      >
                        {sugestao}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {slugNormalizado && (
                <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    ℹ️ <strong>Normalizado automaticamente:</strong> Acentos, espaços e caracteres especiais foram convertidos para formato de URL válido.
                  </p>
                </div>
              )}
              {/* Preview da URL */}
              {perfil.userSlug && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1 font-medium">Como vai aparecer sua URL:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-gray-800 bg-white px-2 py-1 rounded border border-gray-300 flex-1">
                      ylada.app/wellness/<strong className="text-green-600">{perfil.userSlug}</strong>/calculadora-agua
                    </code>
                    <button
                      type="button"
                      onClick={(e) => {
                        const url = `ylada.app/wellness/${perfil.userSlug}/calculadora-agua`
                        navigator.clipboard.writeText(url)
                        // Mostrar feedback
                        const btn = e.currentTarget
                        const originalText = btn.textContent
                        btn.textContent = '✓ Copiado!'
                        setTimeout(() => {
                          btn.textContent = originalText
                        }, 2000)
                      }}
                      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded border border-gray-300"
                      title="Copiar exemplo de URL"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                <strong>Formato:</strong> nome-sobrenome (ex: joao-silva, maria-santos)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                • Será normalizado automaticamente enquanto você digita<br/>
                • <strong>Formato nome-sobrenome</strong> - use hífens para separar (ex: joao-silva)<br/>
                • Apenas letras minúsculas, números e hífens<br/>
                • Será usado para criar seus links personalizados automaticamente
              </p>
            </div>
            <button 
              onClick={salvarPerfil}
              disabled={salvando}
              className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2 ${
                salvando ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {salvando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
            {salvoComSucesso && (
              <div className="mt-2 px-4 py-3 bg-green-50 border-2 border-green-300 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-bold">
                      Perfil salvo com sucesso!
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Suas alterações foram salvas. Você pode continuar editando ou fechar esta página.
                    </p>
                  </div>
                  <button
                    onClick={() => setSalvoComSucesso(false)}
                    className="text-green-600 hover:text-green-800 text-lg font-bold"
                    aria-label="Fechar mensagem de sucesso"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            {erro && (
              <div className="mt-2 px-4 py-3 bg-red-50 border-2 border-red-300 rounded-lg shadow-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-red-600 text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-bold mb-1">
                      Não foi possível salvar
                    </p>
                    <p className="text-sm text-red-700 mb-2">
                      {erro}
                    </p>
                    <p className="text-xs text-red-600 mt-2 italic">
                      Nenhuma alteração foi salva. Tente novamente após resolver o problema.
                    </p>
                    <p className="text-xs text-red-500 mt-2 font-mono bg-red-100 px-2 py-1 rounded">
                      💡 Abra o console do navegador (F12) para ver detalhes técnicos do erro
                    </p>
                  </div>
                  <button
                    onClick={() => setErro(null)}
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

        {/* Notificações Push */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔔 Notificações Push</h2>
          <p className="text-sm text-gray-600 mb-4">
            Ative notificações para receber comunicados mesmo com o app fechado. Funciona quando você adiciona o app à tela inicial.
          </p>
          {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && (
            <PushNotificationManager
              vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}
              autoRegister={false}
            />
          )}
          {(!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Notificações push não configuradas. Configure NEXT_PUBLIC_VAPID_PUBLIC_KEY no ambiente.
              </p>
            </div>
          )}
        </div>

        {/* Minha Assinatura */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">💳 Minha Assinatura</h2>
          {carregandoAssinatura ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Carregando informações da assinatura...</p>
            </div>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {subscription.plan_type === 'annual' ? 'Plano Anual' : 'Plano Mensal'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Status: <span className={`font-semibold ${subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {subscription.status === 'active' ? '✅ Ativa' : '❌ Inativa'}
                      </span>
                    </p>
                  </div>
                  {subscription.status === 'active' && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Vence em</p>
                      <p className="text-lg font-bold text-gray-900">
                        {subscription.current_period_end 
                          ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
                
                {subscription.current_period_end && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Data de vencimento:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(subscription.current_period_end).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {(() => {
                      const vencimento = new Date(subscription.current_period_end)
                      const hoje = new Date()
                      const diasRestantes = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
                      
                      if (diasRestantes < 0) {
                        return (
                          <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800 font-semibold">
                              ⚠️ Sua assinatura venceu há {Math.abs(diasRestantes)} {Math.abs(diasRestantes) === 1 ? 'dia' : 'dias'}
                            </p>
                          </div>
                        )
                      } else if (diasRestantes <= 7) {
                        return (
                          <div className="mt-3 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800 font-semibold">
                              ⚠️ Sua assinatura vence em {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}
                            </p>
                          </div>
                        )
                      } else if (diasRestantes <= 30) {
                        return (
                          <div className="mt-3 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              📅 Sua assinatura vence em {diasRestantes} dias
                            </p>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {subscription.status === 'active' && (
                  <>
                    <Link
                      href="/pt/wellness/checkout"
                      className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center shadow-md hover:shadow-lg"
                    >
                      🔄 Renovar Assinatura
                    </Link>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline transition-colors"
                    >
                      Cancelar assinatura
                    </button>
                  </>
                )}
                {subscription.status !== 'active' && (
                  <Link
                    href="/pt/wellness/checkout"
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center shadow-md hover:shadow-lg"
                  >
                    🚀 Ativar Assinatura
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-600 mb-4">
                  Você ainda não possui uma assinatura ativa. Assine agora para ter acesso a todas as ferramentas da plataforma.
                </p>
              </div>
              <Link
                href="/pt/wellness/checkout"
                className="block w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center shadow-md hover:shadow-lg"
              >
                🚀 Assinar Agora
              </Link>
            </div>
          )}
        </div>

        {/* Segurança */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🔒 Segurança</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
              <div className="relative">
                <input
                  type={showSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showSenhaAtual ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showSenhaAtual ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
              <div className="relative">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite sua nova senha (mín. 6 caracteres)"
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showNovaSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showNovaSenha ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
              <div className="relative">
                <input
                  type={showConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Confirme sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmarSenha ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {erroSenha && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {erroSenha}
              </div>
            )}
            {sucessoSenha && (
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                ✅ Senha atualizada com sucesso!
              </div>
            )}
            <button
              onClick={async (e) => {
                e.preventDefault()
                setErroSenha(null)
                setSucessoSenha(false)

                if (!senhaAtual) {
                  setErroSenha('Por favor, informe sua senha atual')
                  return
                }

                if (!novaSenha || novaSenha.length < 6) {
                  setErroSenha('A nova senha deve ter pelo menos 6 caracteres')
                  return
                }

                if (novaSenha !== confirmarSenha) {
                  setErroSenha('As senhas não coincidem')
                  return
                }

                if (senhaAtual === novaSenha) {
                  setErroSenha('A nova senha deve ser diferente da senha atual')
                  return
                }

                try {
                  setSalvandoSenha(true)
                  setErroSenha(null)
                  setSucessoSenha(false)

                  // Criar AbortController para timeout
                  const controller = new AbortController()
                  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos

                  try {
                    const response = await authenticatedFetch('/api/wellness/change-password', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        currentPassword: senhaAtual,
                        newPassword: novaSenha,
                      }),
                      signal: controller.signal,
                    })

                    clearTimeout(timeoutId)

                    const data = await response.json()

                    if (!response.ok) {
                      console.error('❌ Erro na resposta da API:', {
                        status: response.status,
                        error: data
                      })
                      throw new Error(data.error || data.message || 'Erro ao alterar senha')
                    }

                    console.log('✅ Senha alterada com sucesso:', data)

                    // Senha alterada com sucesso
                    setSucessoSenha(true)
                    setSenhaAtual('')
                    setNovaSenha('')
                    setConfirmarSenha('')

                    // Mostrar mensagem e fazer logout após 2 segundos
                    setTimeout(async () => {
                      try {
                        console.log('🔄 Fazendo logout após mudança de senha...')
                        
                        // Fazer logout para invalidar sessão antiga
                        await signOut()
                        
                        console.log('✅ Logout realizado com sucesso')
                        console.log('🔄 Redirecionando para login...')
                        
                        // Aguardar um pouco mais para garantir que logout completou
                        await new Promise(resolve => setTimeout(resolve, 500))
                        
                        // Redirecionar para login com mensagem de sucesso
                        router.push('/pt/wellness/login?password_changed=success')
                      } catch (logoutError) {
                        console.error('❌ Erro ao fazer logout:', logoutError)
                        // Mesmo se logout falhar, redirecionar
                        // Mas avisar o usuário que precisa fazer logout manual
                        alert('Senha alterada com sucesso! Por favor, faça logout e login novamente com sua nova senha.')
                        router.push('/pt/wellness/login?password_changed=success')
                      }
                    }, 2000)
                  } catch (fetchError: any) {
                    clearTimeout(timeoutId)
                    
                    if (fetchError.name === 'AbortError') {
                      throw new Error('O processo demorou muito. Verifique sua conexão e tente novamente.')
                    }
                    throw fetchError
                  }
                } catch (err: any) {
                  console.error('❌ Erro ao alterar senha:', err)
                  setErroSenha(err.message || 'Erro ao alterar senha. Verifique sua senha atual e tente novamente.')
                  setSucessoSenha(false)
                } finally {
                  // SEMPRE garantir que setSalvandoSenha(false) seja chamado
                  setSalvandoSenha(false)
                }
              }}
              disabled={salvandoSenha}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {salvandoSenha ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Atualizando...
                </>
              ) : (
                <>
                  💾 Atualizar Senha
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Modal de Cancelamento */}
      {subscription && subscription.status === 'active' && (
        <CancelRetentionModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirmCancel={async () => {
            // Recarregar assinatura após cancelamento
            await carregarAssinatura()
            setShowCancelModal(false)
          }}
          subscription={subscription}
          daysSincePurchase={(() => {
            if (!subscription.current_period_start && !subscription.created_at) return 0
            const dataInicio = new Date(subscription.current_period_start || subscription.created_at)
            const hoje = new Date()
            return Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
          })()}
          withinGuarantee={(() => {
            if (!subscription.current_period_start && !subscription.created_at) return false
            const dataInicio = new Date(subscription.current_period_start || subscription.created_at)
            const hoje = new Date()
            const diasDesdeCompra = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
            return diasDesdeCompra <= 7
          })()}
        />
      )}
    </div>
  )
}

