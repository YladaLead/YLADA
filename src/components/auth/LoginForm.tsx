'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'
import { useLastVisitedPage } from '@/hooks/useLastVisitedPage'

const supabase = createClient()

interface LoginFormProps {
  perfil: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin' | 'med'
  redirectPath: string
  logoColor?: 'azul-claro' | 'verde' | 'laranja' | 'roxo'
  logoPath?: string
  initialSignUpMode?: boolean // Iniciar em modo cadastro
}

export default function LoginForm({ 
  perfil, 
  redirectPath,
  logoColor = 'azul-claro',
  logoPath,
  initialSignUpMode = false
}: LoginFormProps) {
  const router = useRouter()
  const { getLastVisitedPage } = useLastVisitedPage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(initialSignUpMode)
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Verificar parâmetros da URL para mensagens de sucesso
  // E LIMPAR localStorage se houver /checkout salvo (evitar redirecionamento indesejado)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 🚨 LIMPAR localStorage se houver /checkout salvo
      // Isso evita redirecionamento automático para checkout antes do login
      try {
        const lastPage = localStorage.getItem('ylada_last_visited_page')
        if (lastPage && lastPage.includes('/checkout')) {
          console.log('🧹 Limpando /checkout do localStorage ao acessar página de login')
          localStorage.removeItem('ylada_last_visited_page')
          localStorage.removeItem('ylada_last_visited_timestamp')
        }
      } catch (e) {
        console.warn('⚠️ Erro ao limpar localStorage:', e)
      }

      const params = new URLSearchParams(window.location.search)
      if (params.get('password_changed') === 'success') {
        setSuccessMessage('Senha alterada com sucesso! Faça login com sua nova senha.')
        // Limpar parâmetro da URL
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      } else if (params.get('password_reset') === 'success') {
        setSuccessMessage('Senha redefinida com sucesso! Faça login com sua nova senha.')
        // Limpar parâmetro da URL
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      }
    }
  }, [])

  // 🚀 FASE 2: Removido redirecionamento - AutoRedirect cuida disso
  // Este componente apenas mostra o formulário de login
  // AutoRedirect vai redirecionar automaticamente se usuário já estiver autenticado

  // Atualizar valor dos inputs
  const handleInputChange = (setter: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
    }
  }

  const perfilLabels = {
    nutri: 'Nutricionista',
    wellness: 'Consultor Wellness',
    coach: 'Coach',
    nutra: 'Consultor Nutra',
    admin: 'Administrador',
    med: 'Medicina'
  }

  const perfilAreaLabels: Record<string, string> = {
    nutri: 'Nutricionista',
    wellness: 'Wellness',
    coach: 'Coach',
    nutra: 'Nutra',
    med: 'Medicina'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // VALIDAÇÃO: Verificar perfil antes de fazer login/cadastro (opcional - não bloqueia)
      let checkData = { exists: false, hasProfile: false, canCreate: true }
      
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        const checkResponse = await fetch('/api/auth/check-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (checkResponse.ok) {
          const json = await checkResponse.json()
          if (json && typeof json.exists === 'boolean') {
            checkData = json
          }
        }
        // Se falhar (500, timeout, rede), continuar com checkData padrão (não bloquear login)
      } catch (err) {
        console.warn('⚠️ Erro ao verificar perfil, continuando com login:', err instanceof Error ? err.message : '')
      }

      if (isSignUp) {
        // Validação: Nome completo é obrigatório no cadastro
        if (!name || name.trim() === '') {
          setError('O nome completo é obrigatório.')
          setLoading(false)
          return
        }

        // CADASTRO: Verificar se email já existe
        if (checkData.exists) {
          if (checkData.hasProfile && checkData.perfil) {
            // Email já tem perfil em outra área
            // EXCEÇÃO: Se for admin ou suporte, pode ter múltiplos perfis
            if (checkData.is_admin || checkData.is_support) {
              // Admin/Suporte pode criar conta em qualquer área
              // Continuar com cadastro
            } else {
              const areaLabel = perfilAreaLabels[checkData.perfil] || checkData.perfil
              setError(`Este email já está cadastrado na área ${areaLabel}. Faça login na área correta ou use outro email.`)
              setLoading(false)
              return
            }
          } else {
            // Email existe mas não tem perfil - pode criar perfil na área atual
            // Continuar com cadastro
          }
        }

        // Criar novo usuário
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              perfil,
              full_name: name
            }
          }
        })

        if (signUpError) {
          // Se erro de email já existe, informar melhor
          if (signUpError.message?.includes('already registered') || signUpError.message?.includes('already exists')) {
            setError('Este email já está cadastrado. Faça login ou use outro email.')
          } else {
            throw signUpError
          }
          return
        }

        if (data.user) {
          // Verificar se precisa confirmar email
          if (!data.session) {
            // Usuário criado mas precisa confirmar email
            setSuccessMessage('Conta criada com sucesso! Verifique seu email para confirmar a conta antes de fazer login.')
            setIsSignUp(false)
            setLoading(false)
            // Limpar formulário
            setEmail('')
            setPassword('')
            setName('')
            return
          } else {
            // Sessão criada - usuário já está logado
            console.log('✅ Cadastro bem-sucedido com sessão ativa')
            
            // Verificar e ativar autorizações pendentes para este email
            try {
              await fetch('/api/auth/activate-pending-authorization', {
                method: 'POST',
                credentials: 'include'
              })
              // Silencioso - não interrompe o fluxo se falhar
            } catch (e) {
              console.warn('Aviso: Não foi possível verificar autorizações pendentes:', e)
            }
            
            // 🚀 NOVO: Para área Nutri, sempre redirecionar para onboarding após cadastro (não tem diagnóstico ainda)
            let baseRedirectPath = redirectPath
            if (perfil === 'nutri') {
              baseRedirectPath = '/pt/nutri/onboarding'
              console.log('ℹ️ Usuário Nutri cadastrado, redirecionando para onboarding (novo usuário)')
            }

            // 🚀 NOVO: Verificar última página visitada antes de redirecionar
            const lastPage = getLastVisitedPage()
            // Validar que a última página é uma rota válida (deve começar com /pt/ ou /en/ ou /es/)
            // E não deve ser checkout, login, logout, callback, 404, etc.
            const excludedFromRedirect = ['/checkout', '/login', '/logout', '/auth/callback', '/404', '/not-found', '/acesso']
            const isLandingPage = lastPage && (
              lastPage === `/pt/${perfil}` || 
              lastPage === `/pt/${perfil}/` ||
              lastPage.match(/^\/pt\/(nutri|coach|wellness|nutra)\/?$/)
            )
            const isValidRoute = lastPage && 
              !isLandingPage && // Excluir páginas de vendas
              lastPage.startsWith('/') && 
              (lastPage.startsWith('/pt/') || lastPage.startsWith('/en/') || lastPage.startsWith('/es/')) &&
              !excludedFromRedirect.some(path => lastPage.includes(path)) &&
              lastPage.length > 3 && // Garantir que não é apenas "/pt" ou "/e"
              !lastPage.includes('/checkout') && // Garantir que não é checkout
              !lastPage.includes('/login') && // Garantir que não é login
              !lastPage.includes('/onboarding') // Não usar última página se for onboarding
            const finalRedirectPath = isValidRoute ? lastPage : baseRedirectPath
            
            console.log('🔄 Redirecionando após cadastro para:', finalRedirectPath, isValidRoute ? '(última página visitada)' : isLandingPage ? '(página de vendas ignorada, usando padrão)' : '(padrão)')
            
            // Verificar se já está na página de destino para evitar loop
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
            if (currentPath === finalRedirectPath || currentPath.startsWith(finalRedirectPath + '/')) {
              console.log('✅ Já está na página de destino, não redirecionar')
              setLoading(false)
              return
            }
            
            // 🚀 CORREÇÃO: Usar window.location.href para garantir redirecionamento em produção
            // router.replace pode não funcionar corretamente em alguns casos
            console.log('🚀 Iniciando redirecionamento após cadastro para:', finalRedirectPath)
            setTimeout(() => {
              console.log('🔄 Redirecionando via window.location para:', finalRedirectPath)
              window.location.href = finalRedirectPath
            }, 100)
            setLoading(false) // Marcar loading=false imediatamente
          }
        } else {
          setError('Erro ao criar conta. Tente novamente.')
          setLoading(false)
        }
      } else {
        // LOGIN: Verificar se perfil corresponde à área
        console.log('🔍 Verificando perfil para login:', {
          email,
          perfilDesejado: perfil,
          checkData,
          hasProfile: checkData.hasProfile,
          perfilAtual: checkData.perfil
        })
        
        if (checkData.exists && checkData.hasProfile && checkData.perfil) {
          // EXCEÇÃO: Admin e Suporte podem acessar qualquer área
          if (checkData.is_admin || checkData.is_support) {
            // Admin/Suporte pode fazer login em qualquer área
            console.log('✅ Admin/Suporte - permitindo login em qualquer área')
            // Continuar com login
          } else if (checkData.perfil !== perfil) {
            // Perfil não corresponde à área atual
            const areaLabel = perfilAreaLabels[checkData.perfil] || checkData.perfil
            console.error('❌ Perfil não corresponde:', {
              perfilAtual: checkData.perfil,
              perfilDesejado: perfil
            })
            setError(`Este email está cadastrado na área ${areaLabel}. Faça login na área correta.`)
            setLoading(false)
            return
          } else {
            console.log('✅ Perfil corresponde - continuando login')
          }
        } else {
          // Não tem perfil ou não existe - permitir login e criar perfil automaticamente
          console.log('⚠️ Usuário sem perfil ou não encontrado - permitindo login para criar perfil automaticamente')
        }

        // Fazer login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signInError) {
          // Melhorar mensagens de erro
          if (signInError.message?.includes('Invalid login credentials')) {
            setError('Email ou senha incorretos. Verifique suas credenciais.')
          } else {
            throw signInError
          }
          return
        }

        const session = data.session
        if (!session) {
          setError('Erro ao criar sessão. Tente novamente.')
          setLoading(false)
          return
        }

        console.log('✅ Login bem-sucedido!', {
          userId: session.user.id,
          email: session.user.email
        })

        // Verificar se perfil existe, se não, criar automaticamente
        try {
          const { data: profileCheck, error: profileCheckError } = await supabase
            .from('user_profiles')
            .select('id, perfil')
            .eq('user_id', session.user.id)
            .maybeSingle()
          
          if (!profileCheck && !profileCheckError) {
            // Perfil não existe - criar automaticamente
            console.log('📝 Criando perfil automaticamente após login...')
            const { data: newProfile, error: createProfileError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: session.user.id,
                email: session.user.email || email,
                nome_completo: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                perfil: perfil
              })
              .select()
              .single()
            
            if (createProfileError) {
              console.error('❌ Erro ao criar perfil automaticamente:', createProfileError)
              // Não bloquear login - perfil pode ser criado depois
            } else {
              console.log('✅ Perfil criado automaticamente:', newProfile)
            }
          } else if (profileCheck) {
            console.log('✅ Perfil já existe:', profileCheck)
          }
        } catch (profileError) {
          console.warn('⚠️ Erro ao verificar/criar perfil:', profileError)
          // Não bloquear login - perfil pode ser criado depois
        }

        // Verificar se a senha é provisória e se ainda está válida
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('temporary_password_expires_at')
            .eq('user_id', session.user.id)
            .maybeSingle()
          
          if (!profileError && profileData?.temporary_password_expires_at) {
            const expiresAt = new Date(profileData.temporary_password_expires_at)
            const now = new Date()
            
            if (now > expiresAt) {
              await supabase.auth.signOut()
              setError('Sua senha provisória expirou. Entre em contato com o suporte para gerar uma nova.')
              setLoading(false)
              return
            } else {
              const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              console.log(`⚠️ Senha provisória válida por mais ${daysLeft} dia(s)`)
            }
          }
        } catch (checkError) {
          console.warn('⚠️ Não foi possível verificar expiração da senha provisória:', checkError)
        }

        // 🚀 NOVO: Para área Nutri, verificar diagnóstico antes de redirecionar
        let baseRedirectPath = redirectPath
        let temDiagnostico = false
        if (perfil === 'nutri') {
          try {
            const { data: nutriProfile } = await supabase
              .from('user_profiles')
              .select('diagnostico_completo')
              .eq('user_id', session.user.id)
              .maybeSingle()
            
            temDiagnostico = !!nutriProfile?.diagnostico_completo
            
            // Se não tem diagnóstico, redirecionar para onboarding
            if (!temDiagnostico) {
              baseRedirectPath = '/pt/nutri/onboarding'
              console.log('ℹ️ Usuário Nutri sem diagnóstico, redirecionando para onboarding')
            } else {
              baseRedirectPath = '/pt/nutri/home'
              console.log('✅ Usuário Nutri com diagnóstico, redirecionando para home')
            }
          } catch (diagnosticoError) {
            console.warn('⚠️ Erro ao verificar diagnóstico, usando redirectPath padrão:', diagnosticoError)
            // Em caso de erro, assumir que não tem diagnóstico (mais seguro)
            baseRedirectPath = '/pt/nutri/onboarding'
            temDiagnostico = false
          }
        }

        // 🚀 NOVO: Verificar última página visitada antes de redirecionar
        const lastPage = getLastVisitedPage()
        // 🚨 CORREÇÃO: Para usuário Nutri sem diagnóstico, NUNCA usar lastPage
        // Sempre usar onboarding, independente de onde estava antes
        const excludedFromRedirect = [
          '/checkout', 
          '/login', 
          '/logout', 
          '/auth/callback', 
          '/404', 
          '/not-found', 
          '/acesso',
          '/configuracao', // Usuário novo não deve ir para configurações
          '/home', // Usuário sem diagnóstico não deve ir para home
          '/dashboard' // Usuário sem diagnóstico não deve ir para dashboard
        ]
        const isLandingPage = lastPage && (
          lastPage === `/pt/${perfil}` || 
          lastPage === `/pt/${perfil}/` ||
          lastPage.match(/^\/pt\/(nutri|coach|wellness|nutra)\/?$/)
        )
        
        // 🚨 CORREÇÃO: Se usuário Nutri não tem diagnóstico, ignorar lastPage completamente
        const shouldIgnoreLastPage = perfil === 'nutri' && !temDiagnostico
        
        const isValidRoute = !shouldIgnoreLastPage && // Ignorar lastPage se não tem diagnóstico
          lastPage && 
          !isLandingPage && // Excluir páginas de vendas
          lastPage.startsWith('/') && 
          (lastPage.startsWith('/pt/') || lastPage.startsWith('/en/') || lastPage.startsWith('/es/')) &&
          !excludedFromRedirect.some(path => lastPage.includes(path)) &&
          lastPage.length > 3 && // Garantir que não é apenas "/pt" ou "/e"
          !lastPage.includes('/checkout') && // Garantir que não é checkout
          !lastPage.includes('/login') && // Garantir que não é login
          !lastPage.includes('/onboarding') && // Não usar última página se for onboarding
          !lastPage.includes('/configuracao') && // Não usar última página se for configurações
          !lastPage.includes('/home') && // Não usar última página se for home
          !lastPage.includes('/dashboard') // Não usar última página se for dashboard
        
        const finalRedirectPath = isValidRoute ? lastPage : baseRedirectPath
        
        console.log('🔄 Redirecionando após login para:', finalRedirectPath, isValidRoute ? '(última página visitada)' : isLandingPage ? '(página de vendas ignorada, usando padrão)' : '(padrão)')
        
        // Verificar se já está na página de destino para evitar loop
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
        if (currentPath === finalRedirectPath || currentPath.startsWith(finalRedirectPath + '/')) {
          console.log('✅ Já está na página de destino, não redirecionar')
          setLoading(false)
          return
        }
        
        // 🚀 OTIMIZAÇÃO: Redirecionar imediatamente (sessão já foi criada)
        // useAuth vai detectar a sessão automaticamente via onAuthStateChange
        // Não precisa aguardar - a sessão já está disponível
        console.log('🚀 Iniciando redirecionamento para:', finalRedirectPath)
        
        // Usar window.location.href em produção para garantir que funciona
        // router.replace pode não funcionar corretamente em alguns casos
        if (typeof window !== 'undefined') {
          // Pequeno delay para garantir que a sessão foi salva
          setTimeout(() => {
            console.log('🔄 Redirecionando via window.location para:', finalRedirectPath)
            window.location.href = finalRedirectPath
          }, 100)
        } else {
          router.replace(finalRedirectPath)
        }
        
        setLoading(false) // Marcar loading=false imediatamente

        return
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  const logoSrc = logoPath || (perfil === 'wellness' 
    ? '/images/logo/wellness-horizontal.png'
    : perfil === 'nutri'
    ? '/images/logo/nutri-horizontal.png'
    : perfil === 'coach'
    ? '/images/logo/coach-horizontal.png'
    : perfil === 'med'
    ? '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro.png'
    : perfil === 'nutra' || logoColor === 'laranja'
    ? '/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png'
    : '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro.png')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src={logoSrc}
              alt={perfil === 'wellness' ? 'WELLNESS - Your Leading Data System' : perfil === 'nutri' ? 'Nutri by YLADA' : perfil === 'coach' ? 'Coach by YLADA' : perfil === 'med' ? 'Medicina by YLADA' : 'YLADA Logo'}
              width={perfil === 'wellness' ? 572 : 280}
              height={perfil === 'wellness' ? 150 : 84}
              className="bg-transparent object-contain h-16 sm:h-20 w-auto"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Criar conta' : 'Bem-vindo'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isSignUp 
              ? `Cadastre-se como ${perfilLabels[perfil]}`
              : `Entre na sua conta de ${perfilLabels[perfil]}`
            }
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleInputChange(setName)}
                required={isSignUp}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-900 placeholder-gray-400"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleInputChange(setPassword)}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowPassword(!showPassword)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10 cursor-pointer"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
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

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all duration-200 ${
              perfil === 'wellness'
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                : perfil === 'coach'
                ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                : perfil === 'nutra' || logoColor === 'laranja'
                ? 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            {loading ? 'Carregando...' : isSignUp ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        {/* Link "Esqueci minha senha" - apenas no modo login */}
        {!isSignUp && (
          <div className="mt-4 text-center">
            <a
              href={`/pt/${perfil === 'wellness' ? 'wellness' : perfil === 'nutri' ? 'nutri' : perfil === 'coach' ? 'coach' : perfil === 'med' ? 'med' : 'wellness'}/recuperar-senha`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium underline"
            >
              Esqueci minha senha
            </a>
          </div>
        )}

        {/* Toggle entre Login e Sign Up */}
        <div className="mt-6 sm:mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            {isSignUp 
              ? 'Já tem uma conta? Fazer login' 
              : 'Não tem uma conta? Criar conta'}
          </button>
        </div>
      </div>
    </div>
  )
}

