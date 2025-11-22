'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import CoachNavBar from "@/components/coach/CoachNavBar"
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { translateError } from '@/lib/error-messages'

function CoachConfiguracaoContent() {
  const { user, userProfile } = useAuth()
  const [perfil, setPerfil] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    countryCode: 'BR',
    bio: '',
    userSlug: ''
  })
  const [slugDisponivel, setSlugDisponivel] = useState(true)
  const [slugValidando, setSlugValidando] = useState(false)
  const [slugNormalizado, setSlugNormalizado] = useState(false)
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

  // Função para tratar slug (lowercase, sem espaços/acentos, SEM hífens - apenas um nome unificado)
  const tratarSlug = (texto: string): string => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]/g, '') // Remove TUDO que não é letra/número (incluindo hífens e espaços)
      .substring(0, 30) // Limitar a 30 caracteres
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
      
      // Verificar se slug já existe para outro usuário
      const response = await fetch(`/api/coach/profile?user_slug=${encodeURIComponent(slugTratado)}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        // Se não existe OU se existe mas é do próprio usuário, está disponível
        setSlugDisponivel(!data.exists || data.isOwn)
      } else {
        // Se erro na API, assume disponível se tem pelo menos 3 caracteres
        setSlugDisponivel(slugTratado.length >= 3)
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
      const sugestao = tratarSlug(perfil.nome)
      if (sugestao) {
        setPerfil(prev => ({ ...prev, userSlug: sugestao }))
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
      return
    }
    
    try {
      setCarregando(true)
      
      // Adicionar timestamp para evitar cache
      const response = await fetch(`/api/coach/profile?t=${Date.now()}`, {
        credentials: 'include',
        cache: 'no-store' // Forçar não usar cache
      })
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.profile) {
          const novoPerfil = {
            nome: data.profile.nome || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '',
            email: data.profile.email || user?.email || '',
            telefone: data.profile.telefone || data.profile.whatsapp || '',
            whatsapp: data.profile.whatsapp || data.profile.telefone || '',
            countryCode: data.profile.countryCode || 'BR',
            bio: data.profile.bio || '',
            userSlug: data.profile.userSlug || data.profile.user_slug || ''
          }
          
          setPerfil(novoPerfil)
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
      console.error('❌ carregarPerfil: Erro ao carregar perfil Coach:', error)
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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

    // Validar que o slug não contém hífens (deve ser um nome unificado)
    if (perfil.userSlug.includes('-')) {
      setErro('O slug deve ser um nome único sem hífens. Use apenas letras e números.')
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

      const response = await fetch('/api/coach/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nome: perfil.nome,
          email: perfil.email,
          telefone: perfil.telefone,
          whatsapp: perfil.whatsapp,
          countryCode: perfil.countryCode,
          bio: perfil.bio,
          userSlug: perfil.userSlug
        })
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Log detalhado do erro para debug
        console.error('❌ Erro ao salvar perfil Coach:', {
          status: response.status,
          errorData: responseData,
          technical: responseData.technical
        })
        throw new Error(responseData.error || 'Erro ao salvar')
      }

      // Perfil salvo com sucesso

      // Salvar com sucesso!
      setSalvoComSucesso(true)
      setErro(null)
      
      // Recarregar dados do perfil após salvar
      await carregarPerfil()
      
      // Mostrar mensagem de sucesso por mais tempo (8 segundos)
      setTimeout(() => setSalvoComSucesso(false), 8000)
    } catch (error: any) {
      console.error('❌ Erro técnico ao salvar perfil Coach:', {
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
      <CoachNavBar showTitle={true} title="Configurações" />

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={perfil.email}
                onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio/Bio</label>
              <textarea
                value={perfil.bio}
                onChange={(e) => setPerfil({...perfil, bio: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
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
                      ? 'border-purple-300 focus:ring-purple-500' 
                      : 'border-red-300 focus:ring-red-500'
                  }`}
                  placeholder="joaosilva"
                />
                {slugValidando ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                ) : slugDisponivel && perfil.userSlug ? (
                  <span className="text-purple-600 text-sm">✓ Disponível</span>
                ) : perfil.userSlug && !slugDisponivel ? (
                  <span className="text-red-600 text-sm">✗ Indisponível</span>
                ) : null}
              </div>
              {slugNormalizado && (
                <div className="mt-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-800">
                    ℹ️ <strong>Normalizado automaticamente:</strong> Acentos, espaços e caracteres especiais foram convertidos para formato de URL válido.
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Este slug será usado nas suas URLs: ylada.app/nutri/<strong>{perfil.userSlug || 'seuslug'}</strong>/[nome-ferramenta]
              </p>
              <p className="text-xs text-gray-400 mt-1">
                • Será normalizado automaticamente enquanto você digita<br/>
                • <strong>Apenas um nome único</strong> - sem hífens, sem espaços<br/>
                • Apenas letras minúsculas e números (ex: joaosilva, aracy, maria123)<br/>
                • Será usado para criar seus links personalizados
              </p>
            </div>
            <button 
              onClick={salvarPerfil}
              disabled={salvando}
              className={`bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center space-x-2 ${
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
              <div className="mt-2 px-4 py-3 bg-purple-50 border-2 border-purple-300 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600 text-xl">✓</span>
                  <div className="flex-1">
                    <p className="text-sm text-purple-800 font-bold">
                      Perfil salvo com sucesso!
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      Suas alterações foram salvas. Você pode continuar editando ou fechar esta página.
                    </p>
                  </div>
                  <button
                    onClick={() => setSalvoComSucesso(false)}
                    className="text-purple-600 hover:text-purple-800 text-lg font-bold"
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
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <div className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
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
                  const response = await fetch('/api/coach/change-password', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      currentPassword: senhaAtual,
                      newPassword: novaSenha,
                    }),
                  })

                  const data = await response.json()

                  if (!response.ok) {
                    throw new Error(data.error || 'Erro ao alterar senha')
                  }

                  setSucessoSenha(true)
                  setSenhaAtual('')
                  setNovaSenha('')
                  setConfirmarSenha('')

                  setTimeout(() => {
                    setSucessoSenha(false)
                  }, 5000)
                } catch (err: any) {
                  console.error('Erro ao alterar senha:', err)
                  setErroSenha(err.message || 'Erro ao alterar senha')
                } finally {
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
    </div>
  )
}

export default function CoachConfiguracaoPage() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <CoachConfiguracaoContent />
    </ProtectedRoute>
  )
}

