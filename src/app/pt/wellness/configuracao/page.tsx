'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { useAuth } from '@/hooks/useAuth'

export default function WellnessConfiguracaoPage() {
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

  // Função para tratar slug (lowercase, sem espaços/acentos, hífens)
  const tratarSlug = (texto: string): string => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui tudo que não é letra/número por hífen
      .replace(/-+/g, '-') // Remove múltiplos hífens seguidos
      .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
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
      const response = await fetch(`/api/wellness/profile?user_slug=${encodeURIComponent(slugTratado)}`, {
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

  // Carregar perfil do usuário
  const carregarPerfil = async () => {
    if (!user) return
    
    try {
      setCarregando(true)
      const response = await fetch('/api/wellness/profile', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setPerfil({
            nome: data.profile.nome || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '',
            email: data.profile.email || user?.email || '',
            telefone: data.profile.telefone || data.profile.whatsapp || '',
            whatsapp: data.profile.whatsapp || data.profile.telefone || '',
            countryCode: data.profile.countryCode || 'BR',
            bio: data.profile.bio || '',
            userSlug: data.profile.userSlug || ''
          })
        }
      } else {
        // Se erro ao carregar perfil, usar dados do usuário logado
        setPerfil(prev => ({
          ...prev,
          nome: prev.nome || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
          email: prev.email || user.email || ''
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      // Em caso de erro, usar dados do usuário logado
      setPerfil(prev => ({
        ...prev,
        nome: prev.nome || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: prev.email || user.email || ''
      }))
    } finally {
      setCarregando(false)
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
    try {
      setSalvando(true)
      setSalvoComSucesso(false)

      const response = await fetch('/api/wellness/profile', {
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

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao salvar')
      }

      setSalvoComSucesso(true)
      setTimeout(() => setSalvoComSucesso(false), 3000)
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error)
      alert(error.message || 'Erro ao salvar perfil. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <Image
                  src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
                  alt="YLADA"
                  width={280}
                  height={84}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
                <p className="text-sm text-gray-600">Gerencie sua conta e preferências</p>
              </div>
            </div>
            <Link
              href="/pt/wellness/dashboard"
              className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={perfil.email}
                onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seu Slug para URL (obrigatório)
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
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
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
              {slugNormalizado && (
                <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    ℹ️ <strong>Normalizado automaticamente:</strong> Acentos, espaços e caracteres especiais foram convertidos para formato de URL válido.
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Este slug será usado nas suas URLs: ylada.app/wellness/<strong>{perfil.userSlug || 'seu-slug'}</strong>/[nome-ferramenta]
              </p>
              <p className="text-xs text-gray-400 mt-1">
                • Será normalizado automaticamente enquanto você digita<br/>
                • Apenas letras minúsculas, números e hífens<br/>
                • Será usado para criar seus links personalizados
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
              <div className="mt-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Perfil salvo com sucesso!
                </p>
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
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all">
              Atualizar Senha
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

