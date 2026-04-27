'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'
import { useLastVisitedPage } from '@/hooks/useLastVisitedPage'
import { trackYladaFunnelUserCreated } from '@/lib/ylada-funnel-client'

const supabase = createClient()

export type LoginFormPerfil =
  | 'nutri'
  | 'wellness'
  | 'coach'
  | 'nutra'
  | 'admin'
  | 'ylada'
  | 'med'
  | 'seller'
  | 'perfumaria'
  | 'estetica'
  | 'fitness'
  | 'joias'
  | 'coach-bem-estar'
  | 'psi'
  | 'psicanalise'
  | 'odonto'

/** Título padrão no topo das páginas de cadastro da matriz (abaixo do logo YLADA). */
export const YLADA_SIGNUP_PAGE_HERO = 'Crie sua conta e comece a usar agora. É gratuito.'

interface LoginFormProps {
  perfil: LoginFormPerfil
  redirectPath: string
  logoColor?: 'azul-claro' | 'verde' | 'laranja' | 'roxo'
  logoPath?: string
  initialSignUpMode?: boolean // Iniciar em modo cadastro
  /** Com cadastro ativo: usa logotipo YLADA em vez do logo vertical da área (ex.: Nutri). */
  useYladaBrandingOnSignUp?: boolean
  /** Substitui o título “Criar conta” no modo cadastro (ex.: hero da matriz). */
  signUpHeroTitle?: string
  /** Sem cadastro self-service: só login + recuperar senha; direciona quem não tem conta ao suporte (ex.: Pro Líderes). */
  disableSignUp?: boolean
  /** Login em /pro-lideres/entrar: usa `redirectPath` e rotas /pro-lideres na “última página”, sem redirecionar para onboarding /pt. */
  proLideresLogin?: boolean
  /** Login em /pro-estetica-corporal/entrar — mesmo comportamento do Pro Líderes para rotas desta área. */
  proEsteticaCorporalLogin?: boolean
  /** Login em /pro-estetica-capilar/entrar — destino fixo no painel vertical capilar (não matriz /pt). */
  proEsteticaCapilarLogin?: boolean
}

function forgotPasswordHref(perfil: LoginFormPerfil): string {
  if (perfil === 'ylada') return '/pt/recuperar-senha'
  if (perfil === 'wellness' || perfil === 'coach-bem-estar') return '/pt/wellness/recuperar-senha'
  if (perfil === 'nutri') return '/pt/nutri/recuperar-senha'
  if (perfil === 'coach') return '/pt/coach/recuperar-senha'
  return '/pt/recuperar-senha'
}

export default function LoginForm({ 
  perfil, 
  redirectPath,
  logoColor = 'azul-claro',
  logoPath,
  initialSignUpMode = false,
  useYladaBrandingOnSignUp = false,
  signUpHeroTitle,
  disableSignUp = false,
  proLideresLogin = false,
  proEsteticaCorporalLogin = false,
  proEsteticaCapilarLogin = false,
}: LoginFormProps) {
  const router = useRouter()
  const { getLastVisitedPage, clearLastVisitedPage } = useLastVisitedPage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(initialSignUpMode)
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hadTrialEmail, setHadTrialEmail] = useState(false)
  const [checkingTrialEmail, setCheckingTrialEmail] = useState(false)

  // Verificar se email fez trial (apenas Wellness) - debounced
  const checkEmailTrial = useCallback(async (emailToCheck: string) => {
    if ((perfil !== 'wellness' && perfil !== 'coach-bem-estar') || !emailToCheck?.includes('@')) {
      setHadTrialEmail(false)
      return
    }
    setCheckingTrialEmail(true)
    try {
      const res = await fetch('/api/wellness/check-email-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck.trim().toLowerCase() }),
      })
      if (res.ok) {
        const data = await res.json()
        setHadTrialEmail(!!data.hadTrial)
      } else {
        setHadTrialEmail(false)
      }
    } catch {
      setHadTrialEmail(false)
    } finally {
      setCheckingTrialEmail(false)
    }
  }, [perfil])

  useEffect(() => {
    if (!email?.includes('@')) {
      setHadTrialEmail(false)
      return
    }
    const timer = setTimeout(() => checkEmailTrial(email), 600)
    return () => clearTimeout(timer)
  }, [email, checkEmailTrial])

  useEffect(() => {
    if (disableSignUp && isSignUp) {
      setIsSignUp(false)
      setConfirmPassword('')
      setError(null)
    }
  }, [disableSignUp, isSignUp])

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

  const perfilLabels: Record<LoginFormPerfil, string> = {
    nutri: 'Nutricionista',
    wellness: 'Consultor Wellness',
    coach: 'Coach',
    nutra: 'Consultor Nutra',
    admin: 'Administrador',
    ylada: 'YLADA',
    med: 'Médicos',
    seller: 'Vendedores',
    perfumaria: 'Perfumaria',
    estetica: 'Estética',
    fitness: 'Fitness',
    joias: 'Joias e bijuterias',
    'coach-bem-estar': 'Coach de bem-estar',
    psi: 'Psicologia',
    psicanalise: 'Psicanálise',
    odonto: 'Odontologia',
  }

  const perfilAreaLabels: Record<LoginFormPerfil, string> = {
    nutri: 'Nutricionista',
    wellness: 'Wellness',
    coach: 'Coach',
    nutra: 'Nutra',
    admin: 'Administrador',
    ylada: 'YLADA',
    med: 'Médicos',
    seller: 'Vendedores',
    perfumaria: 'Perfumaria',
    estetica: 'Estética',
    fitness: 'Fitness',
    joias: 'Joias e bijuterias',
    'coach-bem-estar': 'Coach de bem-estar',
    psi: 'Psicologia',
    psicanalise: 'Psicanálise',
    odonto: 'Odontologia',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (disableSignUp && isSignUp) {
        setError('O cadastro por aqui não está disponível.')
        setLoading(false)
        return
      }

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

        // Validação: Confirmar senha
        if (password !== confirmPassword) {
          setError('As senhas não coincidem. Digite a mesma senha nos dois campos.')
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
              const areaLabel =
              perfilAreaLabels[checkData.perfil as LoginFormPerfil] || checkData.perfil
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
          // Se erro de email já existe, trocar para modo login para permitir entrar
          if (signUpError.message?.includes('already registered') || signUpError.message?.includes('already exists')) {
            setError('Este email já está cadastrado. Faça login abaixo.')
            setIsSignUp(false)
            setPassword('')
            setConfirmPassword('')
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
            setConfirmPassword('')
            setName('')
            return
          } else {
            // Sessão criada - usuário já está logado
            console.log('✅ Cadastro bem-sucedido com sessão ativa')
            trackYladaFunnelUserCreated(perfil)

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
            
            // Nutri: primeiro contato na área — home com Noel (mensagem fixa, sem API até a pessoa perguntar)
            let baseRedirectPath = redirectPath
            if (perfil === 'nutri') {
              baseRedirectPath = '/pt/nutri/home'
              console.log('ℹ️ Usuário Nutri cadastrado, redirecionando para /pt/nutri/home')
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
          } else if (perfil === 'ylada') {
            // Login em /pt/login (ylada): aceita todos os perfis — todos entram pela plataforma YLADA
            console.log('✅ Login YLADA (matriz) - aceita perfil:', checkData.perfil)
            // Continuar com login
          } else if (checkData.perfil !== perfil) {
            // Perfil não corresponde à área atual
            const areaLabel =
              perfilAreaLabels[checkData.perfil as LoginFormPerfil] || checkData.perfil
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
        let profileCheck: { id: string; perfil: string } | null = null
        try {
          const { data: profileResult, error: profileCheckError } = await supabase
            .from('user_profiles')
            .select('id, perfil')
            .eq('user_id', session.user.id)
            .maybeSingle()
          profileCheck = profileResult
          
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

        let baseRedirectPath = redirectPath

        // Login em /pt/login (ylada): todos vão para YLADA (matriz). Priorizar onboarding se perfil não preenchido.
        // Pro Líderes (/pro-lideres/entrar): não aplicar esta lógica — respeita redirectPath (ex.: convite).
        // Dono de tenant Pro Líderes / Pro Estética corporal: mesmo que entre por /pt/login, não mandar para onboarding da matriz.
        // Se tem nome+whatsapp mas falta profile_type/profession → perfil-empresarial (ex.: usuárias Nutri migradas).
        // Usuárias da área Nutri (e outras) que já estavam cadastradas: ir para o board (/pt/home) para evitar tela piscando.
        if (!proLideresLogin && !proEsteticaCorporalLogin && !proEsteticaCapilarLogin && perfil === 'ylada') {
          let skipYladaMatrixRedirect = false
          try {
            const { data: plTenant } = await supabase
              .from('leader_tenants')
              .select('id, vertical_code')
              .eq('owner_user_id', session.user.id)
              .maybeSingle()
            const vc = (plTenant?.vertical_code as string | undefined)?.trim()
            if (plTenant?.id && vc === 'h-lider') {
              baseRedirectPath = '/pro-lideres/painel'
              skipYladaMatrixRedirect = true
              console.log('🔄 Login: dono Pro Líderes (h-lider) — redirecionando para /pro-lideres/painel (não onboarding /pt)')
            } else if (plTenant?.id && vc === 'estetica-corporal') {
              baseRedirectPath = '/pro-estetica-corporal/painel'
              skipYladaMatrixRedirect = true
              console.log(
                '🔄 Login: dono Pro Estética corporal — redirecionando para /pro-estetica-corporal/painel (não onboarding /pt)'
              )
            }
          } catch (plErr) {
            console.warn('⚠️ Não foi possível verificar leader_tenants após login:', plErr)
          }

          if (skipYladaMatrixRedirect) {
            // Não aplicar regras de ylada_noel_profile / onboarding matriz
          } else {
          baseRedirectPath = '/pt/onboarding'
          try {
            const { data: yladaProfile } = await supabase
              .from('ylada_noel_profile')
              .select('area_specific, profile_type, profession')
              .eq('user_id', session.user.id)
              .eq('segment', 'ylada')
              .maybeSingle()
            const as = (yladaProfile?.area_specific || {}) as Record<string, unknown>
            const temNome = as?.nome && String(as.nome).trim().length >= 2
            const temWhatsapp = as?.whatsapp && String(as.whatsapp).replace(/\D/g, '').length >= 10
            const temPerfilEmpresarial = yladaProfile?.profile_type && yladaProfile?.profession
            if (!temNome || !temWhatsapp) {
              // Se não tem perfil ylada mas tem perfil de área (nutri, coach, etc.), ir para board
              if (!yladaProfile && profileCheck?.perfil && profileCheck.perfil !== 'ylada') {
                baseRedirectPath = '/pt/home'
                console.log('🔄 Login YLADA: usuária de área (ex. Nutri) sem perfil ylada, redirecionando para board')
              } else {
                console.log('🔄 Login YLADA: perfil incompleto (nome/whatsapp), redirecionando para onboarding')
              }
            } else if (!temPerfilEmpresarial) {
              baseRedirectPath = '/pt/home'
              console.log('🔄 Login YLADA: nome+whatsapp ok, falta perfil empresarial, redirecionando para board (preencher pelo menu)')
            } else {
              baseRedirectPath = '/pt/home'
              console.log('🔄 Login YLADA: perfil completo, redirecionando para home')
            }
          } catch (e) {
            console.warn('⚠️ Erro ao verificar perfil YLADA:', e)
            // Em erro: se tem perfil de área (nutri, coach), ir para board
            if (profileCheck?.perfil && profileCheck.perfil !== 'ylada') {
              baseRedirectPath = '/pt/home'
            }
          }
          }
        } else if (perfil === 'nutri') {
          baseRedirectPath = '/pt/nutri/home'
          console.log('ℹ️ Login Nutri: redirecionando para /pt/nutri/home (Noel)')
        }

        // 🚀 NOVO: Verificar última página visitada antes de redirecionar
        const lastPage = getLastVisitedPage()
        const excludedFromRedirect = [
          '/checkout', 
          '/login', 
          '/logout', 
          '/auth/callback', 
          '/404', 
          '/not-found', 
          '/acesso',
          '/configuracao', // Usuário novo não deve ir para configurações
          '/dashboard',
        ]
        const isLandingPage = lastPage && (
          lastPage === `/pt/${perfil}` || 
          lastPage === `/pt/${perfil}/` ||
          lastPage.match(/^\/pt\/(nutri|coach|wellness|nutra)\/?$/)
        )
        
        const isValidRoute =
          lastPage && 
          !isLandingPage && // Excluir páginas de vendas
          lastPage.startsWith('/') && 
          (lastPage.startsWith('/pt/') ||
            lastPage.startsWith('/en/') ||
            lastPage.startsWith('/es/') ||
            ((proLideresLogin && lastPage.startsWith('/pro-lideres')) ||
              (proEsteticaCorporalLogin && lastPage.startsWith('/pro-estetica-corporal')) ||
              (proEsteticaCapilarLogin && lastPage.startsWith('/pro-estetica-capilar')))) &&
          !excludedFromRedirect.some(path => lastPage.includes(path)) &&
          lastPage.length > 3 && // Garantir que não é apenas "/pt" ou "/e"
          !lastPage.includes('/checkout') && // Garantir que não é checkout
          !lastPage.includes('/login') && // Garantir que não é login
          !lastPage.includes('/onboarding') && // Não usar última página se for onboarding
          !lastPage.includes('/configuracao') && // Não usar última página se for configurações
          !lastPage.includes('/dashboard')
        
        // Pro Líderes / Pro Estética: nunca deixar "última página" (/pt/home, etc.) roubar o destino —
        // senão o login em /pro-…/entrar manda o utilizador para a matriz em vez do painel.
        // Quem entra por /pt/login mas é dono de tenant Pro (h-lider / estética corporal) já tem baseRedirectPath no painel Pro.
        const preferProWorkspaceDestination =
          proLideresLogin ||
          proEsteticaCorporalLogin ||
          proEsteticaCapilarLogin ||
          baseRedirectPath.startsWith('/pro-lideres') ||
          baseRedirectPath.startsWith('/pro-estetica-corporal') ||
          baseRedirectPath.startsWith('/pro-estetica-capilar')
        const finalRedirectPath = preferProWorkspaceDestination
          ? baseRedirectPath
          : isValidRoute
            ? lastPage
            : baseRedirectPath

        console.log(
          '🔄 Redirecionando após login para:',
          finalRedirectPath,
          preferProWorkspaceDestination
            ? '(destino fixo Pro workspace)'
            : isValidRoute
              ? '(última página visitada)'
              : isLandingPage
                ? '(página de vendas ignorada, usando padrão)'
                : '(padrão)'
        )

        if (proLideresLogin || proEsteticaCorporalLogin || proEsteticaCapilarLogin) {
          try {
            clearLastVisitedPage()
          } catch {
            /* evitar que /pt/… guardado roube o destino após login Pro */
          }
        }
        
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

  const yladaHorizontalLogo = '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro.png'

  const logoSrc =
    logoPath ||
    (useYladaBrandingOnSignUp && isSignUp
      ? yladaHorizontalLogo
        : perfil === 'wellness' || perfil === 'coach-bem-estar'
        ? '/images/logo/wellness-horizontal.png'
        : perfil === 'nutri'
          ? yladaHorizontalLogo
          : perfil === 'coach'
            ? '/images/logo/coach-horizontal.png'
            : perfil === 'ylada'
              ? yladaHorizontalLogo
              : (perfil === 'nutra' && logoColor === 'laranja') || logoColor === 'laranja'
                ? '/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png'
                : yladaHorizontalLogo)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src={logoSrc}
              alt={
                useYladaBrandingOnSignUp && isSignUp
                  ? 'YLADA'
                  : perfil === 'wellness' || perfil === 'coach-bem-estar'
                    ? 'YLADA - Coach de bem-estar'
                    : perfil === 'nutri'
                      ? 'YLADA'
                      : perfil === 'coach'
                        ? 'Coach by YLADA'
                        : perfil === 'ylada'
                          ? 'YLADA'
                          : 'YLADA Logo'
              }
              width={perfil === 'wellness' || perfil === 'coach-bem-estar' ? 572 : 280}
              height={perfil === 'wellness' || perfil === 'coach-bem-estar' ? 150 : 84}
              className="bg-transparent object-contain h-16 sm:h-20 w-auto"
              priority
            />
          </div>
          {isSignUp && signUpHeroTitle ? (
            <>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center leading-snug">
                {signUpHeroTitle}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Cadastre-se como {perfilLabels[perfil]}
              </p>
            </>
          ) : (
            <>
              {!isSignUp && proEsteticaCapilarLogin ? (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Entrar — Terapia capilar</h1>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    <strong className="text-gray-800">YLADA Pro — Terapia capilar.</strong> Usa o{' '}
                    <strong>e-mail dedicado</strong> que combinaste para esta área (não o mesmo de outros produtos
                    YLADA). Assim evitas conflitos de conta.
                  </p>
                </>
              ) : !isSignUp && proEsteticaCorporalLogin ? (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Entrar — Estética corporal</h1>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    <strong className="text-gray-800">YLADA Pro — Estética corporal.</strong> Usa o{' '}
                    <strong>e-mail dedicado</strong> que combinaste para esta área (não o mesmo de outros produtos
                    YLADA). Assim evitas conflitos de conta.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {isSignUp ? 'Criar conta' : 'Bem-vindo'}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    {isSignUp
                      ? `Cadastre-se como ${perfilLabels[perfil]}`
                      : `Entre na sua conta de ${perfilLabels[perfil]}`}
                  </p>
                </>
              )}
            </>
          )}
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
              placeholder={
                proEsteticaCapilarLogin || proEsteticaCorporalLogin
                  ? 'e-mail dedicado (ex.: pro.sua-clinica@…)'
                  : 'seu@email.com'
              }
            />
            {(proEsteticaCapilarLogin || proEsteticaCorporalLogin) && !isSignUp ? (
              <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                Se o sistema disser que o e-mail já está noutro espaço YLADA, trata de um endereço só para{' '}
                {proEsteticaCapilarLogin ? 'Terapia capilar' : 'Estética corporal'} ou fala connosco.
              </p>
            ) : null}
            {(perfil === 'wellness' || perfil === 'coach-bem-estar') && hadTrialEmail && !isSignUp && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-2">
                  Esse e-mail fez o trial de 3 dias.
                </p>
                <p className="text-sm text-green-700 mb-2">
                  Para continuar com acesso, assine aqui — não precisa fazer login antes.
                </p>
                <Link
                  href="/pt/wellness/assinar"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Assinar Agora
                </Link>
              </div>
            )}
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

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword)}
                  required={isSignUp}
                  minLength={6}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400"
                  placeholder="Repita a senha"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowConfirmPassword(!showConfirmPassword)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10 cursor-pointer"
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmPassword ? (
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
          )}

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
              (perfil === 'wellness' || perfil === 'coach-bem-estar')
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                : perfil === 'coach'
                ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                : (perfil === 'nutra' && logoColor === 'laranja') || logoColor === 'laranja'
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
              href={forgotPasswordHref(perfil)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium underline"
            >
              Esqueci minha senha
            </a>
          </div>
        )}

        {/* Toggle entre Login e Sign Up (omitido quando cadastro está desativado, ex.: Pro Líderes) */}
        {!disableSignUp && (
          <div className="mt-6 sm:mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                if (isSignUp) setConfirmPassword('')
              }}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              {isSignUp
                ? 'Já tem uma conta? Fazer login'
                : 'Não tem uma conta? Criar conta'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

