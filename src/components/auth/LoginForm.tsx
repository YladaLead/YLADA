'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Image from 'next/image'

const supabase = createClient()

interface LoginFormProps {
  perfil: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(initialSignUpMode)
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [lastInputTime, setLastInputTime] = useState(Date.now())

  // Verificar se já está autenticado - mas NÃO redirecionar enquanto está digitando
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Aguardar um pouco antes de verificar (evitar verificação imediata)
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // Verificar se o usuário está digitando (última entrada foi há menos de 3 segundos)
          const timeSinceLastInput = Date.now() - lastInputTime
          if (timeSinceLastInput > 3000) {
            // Só redirecionar se não está digitando há mais de 3 segundos
            console.log('✅ Já autenticado, redirecionando para:', redirectPath)
            window.location.href = redirectPath
          }
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err)
      } finally {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [redirectPath, lastInputTime])

  // Atualizar timestamp quando usuário digita
  const handleInputChange = (setter: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setLastInputTime(Date.now())
      setter(e.target.value)
    }
  }

  const perfilLabels = {
    nutri: 'Nutricionista',
    wellness: 'Consultor Wellness',
    coach: 'Coach',
    nutra: 'Consultor Nutra',
    admin: 'Administrador'
  }

  const perfilAreaLabels: Record<string, string> = {
    nutri: 'Nutricionista',
    wellness: 'Wellness',
    coach: 'Coach',
    nutra: 'Nutra'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // VALIDAÇÃO: Verificar perfil antes de fazer login/cadastro (opcional - não bloqueia)
      let checkData = { exists: false, hasProfile: false, canCreate: true }
      
      try {
        const checkResponse = await fetch('/api/auth/check-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        
        if (checkResponse.ok) {
          checkData = await checkResponse.json()
        }
        // Se falhar, continuar mesmo assim (não bloquear login)
      } catch (err) {
        // Ignorar erro e continuar com login
        console.warn('⚠️ Erro ao verificar perfil, continuando mesmo assim')
      }

      if (isSignUp) {
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
            setError('Verifique seu email para confirmar a conta antes de fazer login.')
            setIsSignUp(false)
          } else {
            router.push(redirectPath)
          }
        }
      } else {
        // LOGIN: Verificar se perfil corresponde à área
        if (checkData.exists && checkData.hasProfile && checkData.perfil) {
          // EXCEÇÃO: Admin e Suporte podem acessar qualquer área
          if (checkData.is_admin || checkData.is_support) {
            // Admin/Suporte pode fazer login em qualquer área
            // Continuar com login
          } else if (checkData.perfil !== perfil) {
            // Perfil não corresponde à área atual
            const areaLabel = perfilAreaLabels[checkData.perfil] || checkData.perfil
            setError(`Este email está cadastrado na área ${areaLabel}. Faça login na área correta.`)
            setLoading(false)
            return
          }
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

        console.log('✅ Login bem-sucedido!')

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

        // Redirecionar imediatamente para melhorar percepção de velocidade
        router.replace(redirectPath)

        // Se o router.replace não ocorrer (navegadores antigos), forçar via window.location
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.location.pathname !== redirectPath) {
            console.log('⚠️ router.replace não executou, forçando navegação manual.')
            window.location.href = redirectPath
          }
        }, 1200)

        // Após redirecionar, verificar em segundo plano se o perfil está completo.
        void (async () => {
          try {
            // Pequeno atraso para garantir que os cookies/sessão foram persistidos
            await new Promise(resolve => setTimeout(resolve, 200))
            const profileResponse = await fetch('/api/wellness/profile', {
              credentials: 'include'
            })
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json()
              const profile = profileData.profile
              
              if (!profile?.nome || !profile?.whatsapp) {
                console.log('ℹ️ Perfil incompleto detectado após login, redirecionando para onboarding.')
                router.replace('/pt/wellness/bem-vindo?migrado=true')
              }
            }
          } catch (profileError) {
            console.warn('⚠️ Erro ao verificar perfil pós-login:', profileError)
          }
        })()

        return
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  const logoSrc = logoPath || (perfil === 'wellness' 
    ? '/images/logo/wellness/Logo_Wellness_horizontal.png'
    : perfil === 'nutra' || logoColor === 'laranja'
    ? '/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png'
    : '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src={logoSrc}
              alt={perfil === 'wellness' ? 'WELLNESS - Your Leading Data System' : 'YLADA Logo'}
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
                : perfil === 'nutra' || logoColor === 'laranja'
                ? 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            {loading ? 'Carregando...' : isSignUp ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

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

