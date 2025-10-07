'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { User, LogOut, Plus, Eye, MessageSquare, Settings, Copy, Building, Phone, Mail, Zap, X, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  specialty?: string
  company?: string
  bio?: string
  profile_image?: string
  whatsapp_link?: string
  business_type?: string
  project_id?: string
  website_link?: string
}

export default function UserDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userLinks, setUserLinks] = useState<Array<{
    id: string;
    tool_name: string;
    project_name?: string;
    cta_text: string;
    redirect_url: string;
    custom_url: string;
    custom_message?: string;
    redirect_type: string;
    secure_id: string;
    is_active: boolean;
    views: number;
    created_at: string;
  }>>([])
  const [editingPhone, setEditingPhone] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [newLink, setNewLink] = useState({
    project_name: '',
    tool_name: '',
    cta_text: 'Saiba Mais',
    redirect_url: '',
    custom_message: '',
    redirect_type: 'whatsapp'
  })

  // Cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

  // Função para limpar e formatar telefone
  const cleanPhoneDisplay = (phone: string) => {
    if (!phone) return 'Não informado'
    
    // Extrair apenas números
    let cleanPhone = phone.replace(/\D/g, '')
    
    // Remover duplicações de código do país
    if (cleanPhone.startsWith('5555')) {
      cleanPhone = cleanPhone.substring(2)
    }
    
    // Garantir código do país
    if (!cleanPhone.startsWith('55')) {
      cleanPhone = '55' + cleanPhone
    }
    
    // Limitar a 13 dígitos
    if (cleanPhone.length > 13) {
      cleanPhone = cleanPhone.substring(0, 13)
    }
    
    // Formatar para exibição
    return '+55 ' + cleanPhone.substring(2)
  }

  const fetchUserLinks = useCallback(async (userId: string) => {
    try {
      console.log('🔗 Buscando links do usuário...')
      
      const { data: links, error } = await supabase
        .from('professional_links')
        .select('*')
        .eq('professional_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar links:', error)
        return
      }

      console.log('✅ Links encontrados:', links)
      setUserLinks(links || [])
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar links:', error)
    }
  }, [supabase])

  useEffect(() => {
    if (authChecked) return // Evitar execução múltipla
    
    const checkAuth = async () => {
      try {
        console.log('🔍 VERIFICAÇÃO DE AUTH INICIADA...')
        setAuthChecked(true) // Marcar como verificado
        
        // 1. Verificar sessão atual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('📊 Resultado da sessão:', { 
          hasSession: !!session, 
          userId: session?.user?.id,
          error: sessionError?.message 
        })

        if (sessionError) {
          console.error('❌ Erro na sessão:', sessionError)
          setError('Erro de autenticação: ' + sessionError.message)
          setLoading(false)
          return
        }
        
        if (!session) {
          console.log('❌ Nenhuma sessão encontrada - redirecionando')
          window.location.href = '/auth'
          return
        }

        console.log('✅ Sessão válida encontrada:', session.user.email)

        // 2. Buscar perfil do usuário
        console.log('🔍 Buscando perfil do usuário...')
        const { data: profile, error: profileError } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', session.user.id)
          .single()

        console.log('📊 Resultado do perfil:', { 
          hasProfile: !!profile, 
          profileName: profile?.name,
          error: profileError?.message,
          errorCode: profileError?.code
        })

        if (profileError) {
          console.error('❌ Erro ao buscar perfil:', profileError)
          
          // Se perfil não existe, criar automaticamente
          if (profileError.code === 'PGRST116') {
            console.log('🔍 Perfil não existe, criando...')
            
            const { data: newProfile, error: createError } = await supabase
              .from('professionals')
              .insert({
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'Usuário',
                email: session.user.email || '',
                phone: '',
                specialty: '',
                company: ''
              })
              .select()
              .single()

            if (createError) {
              console.error('❌ Erro ao criar perfil:', createError)
              setError('Erro ao criar perfil: ' + createError.message)
              setLoading(false)
              return
            }

            console.log('✅ Perfil criado:', newProfile.name)
            setUser(newProfile)
          } else {
            setError('Erro ao buscar perfil: ' + profileError.message)
            setLoading(false)
            return
          }
        } else if (profile) {
          console.log('✅ Perfil encontrado:', profile.name)
          setUser(profile)
        }

        // Buscar links do usuário
        await fetchUserLinks(session.user.id)

      } catch (error) {
        console.error('❌ Erro geral:', error)
        setError('Erro inesperado: ' + (error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [supabase, authChecked, fetchUserLinks])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const toggleLinkStatus = async (linkId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('professional_links')
        .update({ is_active: !currentStatus })
        .eq('id', linkId)

      if (!error) {
        setUserLinks(prevLinks => 
          prevLinks.map(link => 
            link.id === linkId ? { ...link, is_active: !currentStatus } : link
          )
        )
        alert(`Link ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`)
      } else {
        console.error('❌ Erro ao alterar status do link:', error)
        alert('Erro ao alterar status do link')
      }
    } catch (error) {
      console.error('❌ Erro ao alterar status do link:', error)
      alert('Erro ao alterar status do link')
    }
  }

  const deleteLink = async (linkId: string) => {
    if (!confirm('Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('professional_links')
        .delete()
        .eq('id', linkId)

      if (!error) {
        setUserLinks(prevLinks => prevLinks.filter(link => link.id !== linkId))
        alert('Link excluído com sucesso!')
      } else {
        console.error('❌ Erro ao excluir link:', error)
        alert('Erro ao excluir link')
      }
    } catch (error) {
      console.error('❌ Erro ao excluir link:', error)
      alert('Erro ao excluir link')
    }
  }

  const editLink = (link: { id: string; project_name?: string; tool_name?: string; cta_text?: string; redirect_url?: string; custom_message?: string; redirect_type?: string }) => {
    // Preencher o formulário com os dados do link
    setNewLink({
      project_name: link.project_name || '',
      tool_name: link.tool_name || '',
      cta_text: link.cta_text || 'Falar com Especialista',
      redirect_url: link.redirect_url || '',
      custom_message: link.custom_message || '',
      redirect_type: link.redirect_type || 'whatsapp'
    })
    
    // Abrir o modal
    setShowLinkModal(true)
    
    // TODO: Implementar modo de edição (atualizar vs criar novo)
    alert('Modo de edição será implementado em breve!')
  }

  const createCustomLink = async () => {
    console.log('🔗 INICIANDO CRIAÇÃO DE LINK...')
    console.log('👤 User:', user)
    console.log('📝 NewLink:', newLink)
    console.log('🌐 Supabase client:', !!supabase)
    
    if (!user) {
      console.error('❌ Usuário não encontrado')
      alert('Erro: Usuário não encontrado')
      return
    }
    
    if (!newLink.tool_name) {
      console.error('❌ Ferramenta não selecionada')
      alert('Por favor, selecione uma ferramenta')
      return
    }
    
    if (!newLink.redirect_url) {
      console.error('❌ URL de redirecionamento não informada')
      alert('Por favor, informe a URL de redirecionamento')
      return
    }

    try {
      // Gerar slug automático baseado no nome da ferramenta
      const toolSlug = newLink.tool_name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .substring(0, 30) // Limita a 30 caracteres
      
      // Gerar slug do usuário baseado no nome
      const userSlug = user.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .substring(0, 20) // Limita a 20 caracteres
      
      const customSlug = `${userSlug}-${toolSlug}`
      
      // Gerar ID único para segurança
      const timestamp = Date.now()
      const randomHash = Math.random().toString(36).substring(2, 8)
      const secureId = `${customSlug}-${timestamp}-${randomHash}`
      
      // Gerar URL personalizada simplificada: apenas nome-do-link
      const projectDomain = user.project_id || 'fitlead' // Default para FitLead
      const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'ylada.com'
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
      const customUrl = `${protocol}://${projectDomain}.${baseDomain}/${customSlug}`
      
      console.log('🔐 Secure ID:', secureId)
      console.log('🌐 Custom URL:', customUrl)
      
      // Gerar URL da ferramenta (não WhatsApp)
      const toolUrl = `${protocol}://${projectDomain}.${baseDomain}/tools/${newLink.tool_name}?ref=${secureId}`
      
      const linkData = {
        professional_id: user.id,
        project_name: newLink.project_name,
        tool_name: newLink.tool_name,
        cta_text: newLink.cta_text,
        redirect_url: toolUrl, // URL da ferramenta, não WhatsApp
        custom_url: customUrl,
        custom_message: newLink.custom_message,
        redirect_type: newLink.redirect_type,
        secure_id: secureId,
        custom_slug: customSlug,
        is_active: true
      }
      
      console.log('📊 Dados para inserir:', linkData)
      
      const { data, error } = await supabase
        .from('professional_links')
        .insert(linkData)
        .select()
        .single()

      console.log('📤 Resposta do Supabase:', { data, error })

      if (!error && data) {
        console.log('✅ Link criado com sucesso!')
        alert(`Link criado com sucesso!\n\nURL: ${customUrl}\n\nEste link é exclusivo e protegido.`)
        setShowLinkModal(false)
        setNewLink({ 
          project_name: '', 
          tool_name: '', 
          cta_text: 'Saiba Mais', 
          redirect_url: '',
          custom_message: '',
          redirect_type: 'whatsapp'
        })
        
        // Recarregar lista de links
        if (user) {
          await fetchUserLinks(user.id)
        }
      } else {
        console.error('❌ Erro ao criar link:', error)
        alert(`Erro ao criar link: ${error?.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao criar link:', error)
      alert(`Erro inesperado: ${error}`)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    try {
      // Se está atualizando o telefone, usar o editingPhone se disponível
      if (editingPhone) {
        updates.phone = editingPhone
      }
      
      // Se está atualizando o telefone, limpar e formatar corretamente
      if (updates.phone) {
        let cleanPhone = updates.phone.replace(/\D/g, '')
        
        // Remover duplicações de código do país
        if (cleanPhone.startsWith('5555')) {
          cleanPhone = cleanPhone.substring(2) // Remove o 55 duplicado
        }
        
        // Garantir que tem código do país
        if (!cleanPhone.startsWith('55')) {
          cleanPhone = '55' + cleanPhone
        }
        
        // Limitar a 13 dígitos máximo
        if (cleanPhone.length > 13) {
          cleanPhone = cleanPhone.substring(0, 13)
        }
        
        // Formatar como +55 xxxxxxxxxxx
        updates.phone = '+55 ' + cleanPhone.substring(2)
      }

      console.log('📝 Atualizando perfil com:', updates)

      const { error } = await supabase
        .from('professionals')
        .update(updates)
        .eq('id', user.id)

      if (!error) {
        setUser({ ...user, ...updates })
        setEditingPhone('') // Limpar o estado de edição
        alert('Perfil atualizado com sucesso!')
        setShowProfileModal(false)
        
        // Recarregar dados do usuário para garantir sincronização
        const { data: updatedUser } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (updatedUser) {
          setUser(updatedUser)
        }
      } else {
        console.error('❌ Erro ao atualizar perfil:', error)
        alert('Erro ao atualizar perfil: ' + error.message)
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error)
      alert('Erro ao atualizar perfil')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/auth'}
              className="w-full bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            >
              Fazer Login
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Acesso Negado</h1>
          <p className="text-gray-600 mb-4">Você precisa fazer login primeiro.</p>
          <Link 
            href="/auth" 
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Área do Profissional</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.name}</p>
              </div>
            </div>
              <button
                onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
              <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('links')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'links'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Links Personalizados
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meu Perfil
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configurações
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
          
          {/* Quick Actions - MOVED TO TOP */}
          <div className="bg-emerald-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <button 
                     onClick={() => {
                       // Auto-preencher WhatsApp se o usuário tiver telefone
                       if (user?.phone) {
                         // Extrair apenas números do telefone
                         let phoneNumbers = user.phone.replace(/\D/g, '')
                         
                         // Remover duplicações de código do país
                         if (phoneNumbers.startsWith('5555')) {
                           phoneNumbers = phoneNumbers.substring(2) // Remove o 55 duplicado
                         }
                         
                         // Se não começar com código do país, adicionar 55
                         if (!phoneNumbers.startsWith('55')) {
                           phoneNumbers = '55' + phoneNumbers
                         }
                         
                         // Limitar a 13 dígitos máximo (55 + 11 dígitos)
                         if (phoneNumbers.length > 13) {
                           phoneNumbers = phoneNumbers.substring(0, 13)
                         }
                         
                         setNewLink({
                           project_name: '',
                           tool_name: '',
                           cta_text: 'Saiba Mais',
                           redirect_url: `https://wa.me/${phoneNumbers}`,
                           custom_message: '',
                           redirect_type: 'whatsapp'
                         })
                       }
                       setShowLinkModal(true)
                     }}
                     className="flex items-center space-x-3 bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
                   >
                <Plus className="w-6 h-6 text-emerald-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Criar Link</p>
                  <p className="text-sm text-gray-600">Novo link personalizado</p>
                </div>
              </button>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="flex items-center space-x-3 bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Configurar</p>
                  <p className="text-sm text-gray-600">Editar perfil</p>
                </div>
              </button>
              <button 
                onClick={() => setShowReportsModal(true)}
                className="flex items-center space-x-3 bg-white rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Visualizar</p>
                  <p className="text-sm text-gray-600">Ver relatórios</p>
                </div>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Perfil</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
      </div>
              </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium text-gray-900">
                      {user.phone ? (
                        <span className="flex items-center space-x-1">
                          <span className="text-sm">
                            {user.phone.startsWith('+55') ? '🇧🇷' : 
                             user.phone.startsWith('+1') ? '🇺🇸' :
                             user.phone.startsWith('+52') ? '🇲🇽' :
                             user.phone.startsWith('+54') ? '🇦🇷' :
                             user.phone.startsWith('+56') ? '🇨🇱' :
                             user.phone.startsWith('+57') ? '🇨🇴' :
                             user.phone.startsWith('+58') ? '🇻🇪' :
                             user.phone.startsWith('+51') ? '🇵🇪' :
                             user.phone.startsWith('+598') ? '🇺🇾' :
                             user.phone.startsWith('+595') ? '🇵🇾' : '📞'}
                          </span>
                          <span>{cleanPhoneDisplay(user.phone)}</span>
                        </span>
                      ) : 'Não informado'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Empresa</p>
                    <p className="font-medium text-gray-900">{user.company || 'Não informado'}</p>
              </div>
            </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Especialidade</p>
                    <p className="font-medium text-gray-900">{user.specialty || 'Não informado'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Negócio</p>
                    <p className="font-medium text-gray-900">
                      {user.business_type === 'fitness' && '🏋️ Fitness & Academia'}
                      {user.business_type === 'nutrition' && '🥗 Nutrição & Alimentação'}
                      {user.business_type === 'wellness' && '🧘 Bem-estar & Spa'}
                      {user.business_type === 'business' && '💼 Negócios & Coaching'}
                      {user.business_type === 'beauty' && '💄 Beleza & Estética'}
                      {user.business_type === 'health' && '🏥 Saúde & Medicina'}
                      {user.business_type === 'lifestyle' && '🌟 Lifestyle & Desenvolvimento'}
                      {!user.business_type && 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de Leads</span>
                  <span className="text-2xl font-bold text-emerald-600">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Links Ativos</span>
                  <span className="text-2xl font-bold text-blue-600">{userLinks.filter(link => link.is_active).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conversões</span>
                  <span className="text-2xl font-bold text-purple-600">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Recentes */}
          {userLinks.length > 0 && (
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Links Recentes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userLinks.slice(0, 3).map((link) => (
                  <div key={link.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          {link.project_name || link.tool_name.replace('-', ' ')}
                        </h4>
                        {link.project_name && (
                          <p className="text-xs text-gray-500 capitalize">
                            {link.tool_name.replace('-', ' ')}
                          </p>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        link.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {link.is_active ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      Criado em {new Date(link.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{link.views} visualizações</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(link.custom_url)
                          alert('Link copiado para a área de transferência!')
                        }}
                        className="bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-emerald-700 flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {userLinks.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('links')}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Ver todos os {userLinks.length} links →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'links' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Links Personalizados</h2>
            <button
              onClick={() => {
                // Auto-preencher WhatsApp se o usuário tiver telefone
                if (user?.phone) {
                  // Extrair apenas números do telefone
                  let phoneNumbers = user.phone.replace(/\D/g, '')
                  
                  // Remover duplicações de código do país
                  if (phoneNumbers.startsWith('5555')) {
                    phoneNumbers = phoneNumbers.substring(2) // Remove o 55 duplicado
                  }
                  
                  // Se não começar com código do país, adicionar 55
                  if (!phoneNumbers.startsWith('55')) {
                    phoneNumbers = '55' + phoneNumbers
                  }
                  
                  // Limitar a 13 dígitos máximo (55 + 11 dígitos)
                  if (phoneNumbers.length > 13) {
                    phoneNumbers = phoneNumbers.substring(0, 13)
                  }
                  
                  setNewLink({
                    project_name: '',
                    tool_name: '',
                    cta_text: 'Saiba Mais',
                    redirect_url: `https://wa.me/${phoneNumbers}`,
                    custom_message: '',
                    redirect_type: 'whatsapp',
                  })
                }
                setShowLinkModal(true)
              }}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Criar Novo Link</span>
            </button>
          </div>

          {userLinks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum link criado ainda</h3>
              <p className="text-gray-600 mb-6">Crie seu primeiro link personalizado para começar a gerar leads.</p>
              <button
                onClick={() => {
                  if (user?.phone) {
                    // Extrair apenas números do telefone
                    let phoneNumbers = user.phone.replace(/\D/g, '')
                    
                    // Remover duplicações de código do país
                    if (phoneNumbers.startsWith('5555')) {
                      phoneNumbers = phoneNumbers.substring(2) // Remove o 55 duplicado
                    }
                    
                    // Se não começar com código do país, adicionar 55
                    if (!phoneNumbers.startsWith('55')) {
                      phoneNumbers = '55' + phoneNumbers
                    }
                    
                    // Limitar a 13 dígitos máximo (55 + 11 dígitos)
                    if (phoneNumbers.length > 13) {
                      phoneNumbers = phoneNumbers.substring(0, 13)
                    }
                    
                    setNewLink({
                      project_name: '',
                      tool_name: '',
                      cta_text: 'Saiba Mais',
                      redirect_url: `https://wa.me/${phoneNumbers}`,
                      custom_message: '',
                      redirect_type: 'whatsapp',
                    })
                  }
                  setShowLinkModal(true)
                }}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
              >
                Criar Primeiro Link
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userLinks.map((link) => (
                <div key={link.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {link.project_name || link.tool_name.replace('-', ' ')}
                      </h3>
                      {link.project_name && (
                        <p className="text-sm text-gray-500 capitalize">
                          {link.tool_name.replace('-', ' ')}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Criado em {new Date(link.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      link.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {link.is_active ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">URL do Link</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-mono bg-white p-2 rounded border break-all flex-1">
                          {link.custom_url}
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(link.custom_url)
                            alert('Link copiado!')
                          }}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Redireciona para</p>
                      <p className="text-sm text-gray-900 break-all">{link.redirect_url}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Texto do Botão</p>
                      <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded text-sm font-medium text-emerald-800">
                        {link.cta_text || 'Falar com Especialista'}
                      </div>
                    </div>
                    
                    {link.custom_message && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Mensagem Personalizada</p>
                        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                          {link.custom_message}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <span><strong>{link.views}</strong> visualizações</span>
                      <span>Tipo: {link.redirect_type}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      {/* Primeira linha - Ações principais */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(link.custom_url)
                            alert('Link copiado para a área de transferência!')
                          }}
                          className="bg-emerald-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-emerald-700 flex items-center space-x-1"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </button>
                        <button
                          onClick={() => {
                            window.open(link.custom_url, '_blank')
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Testar</span>
                        </button>
                      </div>
                      
                      {/* Segunda linha - Ações de gerenciamento */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editLink(link)}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => toggleLinkStatus(link.id, link.is_active)}
                          className={`text-sm font-medium flex items-center space-x-1 ${
                            link.is_active 
                              ? 'text-red-600 hover:text-red-700' 
                              : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {link.is_active ? (
                            <>
                              <ToggleRight className="w-4 h-4" />
                              <span>Desativar</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4" />
                              <span>Ativar</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h2>
          <div className="max-w-2xl">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Perfil</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium text-gray-900">
                      {user.phone ? (
                        <span className="flex items-center space-x-2">
                          <span>{cleanPhoneDisplay(user.phone)}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">Não informado</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Empresa</p>
                    <p className="font-medium text-gray-900">
                      {user.company || <span className="text-gray-400">Não informado</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Especialidade</p>
                    <p className="font-medium text-gray-900">
                      {user.specialty || <span className="text-gray-400">Não informado</span>}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
                >
                  <Settings className="w-5 h-5" />
                  <span>Editar Perfil</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h2>
          <div className="max-w-2xl">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações da Conta</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">Notificações por Email</p>
                    <p className="text-sm text-gray-600">Receber atualizações sobre seus links</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">Modo Escuro</p>
                    <p className="text-sm text-gray-600">Interface com tema escuro</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</main>

            {/* Modal Criar Link */}
            {showLinkModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Criar Link Personalizado</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Projeto/Estratégia
                        </label>
                        <input
                          type="text"
                          value={newLink.project_name}
                          onChange={(e) => setNewLink({...newLink, project_name: e.target.value})}
                          placeholder="Ex: Campanha Instagram, Leads Nutrição, Vendas Q1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Dê um nome para identificar esta estratégia</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ferramenta
                        </label>
                    <select
                          value={newLink.tool_name}
                          onChange={(e) => setNewLink({...newLink, tool_name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="">Selecione uma ferramenta</option>
                          
                          {/* Ferramentas Existentes */}
                          <optgroup label="📊 Ferramentas Básicas">
                            <option value="bmi">Calculadora de IMC</option>
                            <option value="protein">Necessidades de Proteína</option>
                            <option value="body-composition">Composição Corporal</option>
                            <option value="meal-planner">Planejador de Refeições</option>
                            <option value="hydration">Monitor de Hidratação</option>
                            <option value="nutrition-assessment">Avaliação Nutricional</option>
                            <option value="health-goals">Objetivos de Saúde</option>
                          </optgroup>
                          
                          {/* Novas Ferramentas - Leads Frios */}
                          <optgroup label="🎯 Para Leads Frios">
                            <option value="perfil-bem-estar">Quiz: Perfil de Bem-Estar</option>
                            <option value="bem-estar-diario">Tabela: Bem-Estar Diário</option>
                            <option value="alimentacao-saudavel">Quiz: Alimentação Saudável</option>
                          </optgroup>
                          
                          {/* Novas Ferramentas - Clientes Atuais */}
                          <optgroup label="💚 Para Clientes Atuais">
                            <option value="desafio-7-dias">Tabela: Desafio 7 Dias</option>
                            <option value="aproveitando-100">Quiz: Aproveitando 100%</option>
                            <option value="metas-semanais">Tabela: Metas Semanais</option>
                          </optgroup>
                          
                          {/* Novas Ferramentas - Recrutamento */}
                          <optgroup label="🧭 Para Recrutamento">
                            <option value="inspirar-pessoas">Quiz: Inspirar Pessoas</option>
                            <option value="perfil-empreendedor">Quiz: Perfil Empreendedor</option>
                            <option value="onboarding-rapido">Tabela: Onboarding Rápido</option>
                          </optgroup>
                    </select>
                  </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mensagem Personalizada
                        </label>
                        <textarea
                          value={newLink.custom_message}
                          onChange={(e) => setNewLink({...newLink, custom_message: e.target.value})}
                          placeholder="Ex: Clique no botão e saiba como melhorar sua saúde com nossos produtos exclusivos..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Esta mensagem aparecerá antes do botão de ação</p>
                      </div>
                
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto do Botão
                        </label>
                  <input
                    type="text"
                          value={newLink.cta_text}
                          onChange={(e) => setNewLink({...newLink, cta_text: e.target.value})}
                          placeholder="Saiba Mais"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Redirecionamento
                        </label>
                        <select
                          value={newLink.redirect_type}
                          onChange={(e) => {
                            const redirectType = e.target.value
                            let redirectUrl = newLink.redirect_url
                            
                            // Auto-preencher WhatsApp se o usuário tiver telefone cadastrado
                            // MAS só se ainda não foi preenchido ou se está mudando de tipo
                            if (redirectType === 'whatsapp' && user?.phone && (!redirectUrl.includes('wa.me') || newLink.redirect_type !== 'whatsapp')) {
                              // Extrair apenas números do telefone
                              let phoneNumbers = user.phone.replace(/\D/g, '')
                              
                              // Remover duplicações de código do país
                              if (phoneNumbers.startsWith('5555')) {
                                phoneNumbers = phoneNumbers.substring(2) // Remove o 55 duplicado
                              }
                              
                              // Se não começar com código do país, adicionar 55
                              if (!phoneNumbers.startsWith('55')) {
                                phoneNumbers = '55' + phoneNumbers
                              }
                              
                              // Limitar a 13 dígitos máximo (55 + 11 dígitos)
                              if (phoneNumbers.length > 13) {
                                phoneNumbers = phoneNumbers.substring(0, 13)
                              }
                              
                              redirectUrl = `https://wa.me/${phoneNumbers}`
                            }
                            
                            setNewLink({
                              ...newLink, 
                              redirect_type: redirectType,
                              redirect_url: redirectUrl
                            })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="whatsapp">WhatsApp</option>
                          <option value="website">Site Pessoal</option>
                          <option value="landing">Página de Vendas</option>
                          <option value="instagram">Instagram</option>
                          <option value="telegram">Telegram</option>
                          <option value="email">Email</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Link de Redirecionamento
                        </label>
                        <input
                          type="url"
                          value={newLink.redirect_url || (newLink.redirect_type === 'whatsapp' && user?.phone ? `https://wa.me/${user.phone.replace(/\D/g, '')}` : '')}
                          onChange={(e) => setNewLink({...newLink, redirect_url: e.target.value})}
                          placeholder={
                            newLink.redirect_type === 'whatsapp' 
                              ? "https://wa.me/5511999999999" 
                              : newLink.redirect_type === 'website'
                              ? "https://seusite.com.br"
                              : newLink.redirect_type === 'instagram'
                              ? "https://instagram.com/seuusuario"
                              : "https://exemplo.com"
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {newLink.redirect_type === 'whatsapp' && (
                            user?.phone ? 
                              '✅ Link do WhatsApp preenchido automaticamente com seu telefone cadastrado' :
                              'Formato: https://wa.me/5511999999999'
                          )}
                          {newLink.redirect_type === 'website' && 'Seu site pessoal ou página de vendas'}
                          {newLink.redirect_type === 'instagram' && 'Seu perfil do Instagram'}
                          {newLink.redirect_type === 'telegram' && 'Seu usuário do Telegram'}
                          {newLink.redirect_type === 'email' && 'Seu email de contato'}
                        </p>
                      </div>
          </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">🔒 Proteção Exclusiva</h4>
                      <p className="text-xs text-blue-700">
                        • Seu link será único e protegido<br/>
                        • Acesso apenas para usuários ativos<br/>
                        • Monitoramento de uso em tempo real<br/>
                        • Desativação automática se necessário
                      </p>
                  </div>
                  
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setShowLinkModal(false)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={createCustomLink}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Criar Link Protegido
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

      {/* Modal Configurar Perfil */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Perfil</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    onChange={(e) => setUser({...user!, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={editingPhone || user?.phone || ''}
                    onChange={(e) => {
                      setEditingPhone(e.target.value)
                    }}
                    placeholder="+55 11 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidade
                  </label>
                  <input
                    type="text"
                    value={user?.specialty || ''}
                    onChange={(e) => setUser({...user!, specialty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Negócio
                  </label>
                  <select
                    value={user?.business_type || 'fitness'}
                    onChange={(e) => setUser({...user!, business_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="fitness">🏋️ Fitness & Academia</option>
                    <option value="nutrition">🥗 Nutrição & Alimentação</option>
                    <option value="wellness">🧘 Bem-estar & Spa</option>
                    <option value="business">💼 Negócios & Coaching</option>
                    <option value="beauty">💄 Beleza & Estética</option>
                    <option value="health">🏥 Saúde & Medicina</option>
                    <option value="lifestyle">🌟 Lifestyle & Desenvolvimento</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={user?.company || ''}
                    onChange={(e) => setUser({...user!, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                    </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link do WhatsApp
                  </label>
                  <input
                    type="url"
                    value={user?.whatsapp_link || ''}
                    onChange={(e) => setUser({...user!, whatsapp_link: e.target.value})}
                    placeholder="https://wa.me/5511999999999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                          <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                  onClick={() => updateProfile(user!)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                          >
                            Salvar
                          </button>
              </div>
            </div>
                        </div>
                      </div>
                    )}

      {/* Modal Relatórios */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Relatórios e Estatísticas</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">0</div>
                    <div className="text-sm text-gray-600">Total de Leads</div>
                          </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Links Ativos</div>
                        </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Conversões</div>
                  </div>
                </div>
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Nenhum dado disponível ainda.</p>
                  <p className="text-sm">Crie seus primeiros links para começar a gerar leads!</p>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowReportsModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}