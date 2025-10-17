'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, User, KeyRound, Eye, EyeOff, Phone } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function CompleteRegistrationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+55')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showRecoveryForm, setShowRecoveryForm] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryLoading, setRecoveryLoading] = useState(false)
  const [recoveryError, setRecoveryError] = useState('')

  // Lista de países com códigos
  const countries = [
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
    { code: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: '+1', name: 'Canadá', flag: '🇨🇦' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+57', name: 'Colômbia', flag: '🇨🇴' },
    { code: '+51', name: 'Peru', flag: '🇵🇪' },
    { code: '+598', name: 'Uruguai', flag: '🇺🇾' },
    { code: '+591', name: 'Bolívia', flag: '🇧🇴' },
    { code: '+595', name: 'Paraguai', flag: '🇵🇾' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+34', name: 'Espanha', flag: '🇪🇸' },
  ]

  useEffect(() => {
    // Verificar se há session_id válido (após pagamento)
    const sessionId = searchParams.get('session_id')
    
    if (sessionId) {
      // Se há session_id, tentar obter email da sessão
      fetchSessionEmail(sessionId)
    } else {
      // Se não há session_id, tentar obter email da URL ou localStorage
      const emailFromUrl = searchParams.get('email')
      const emailFromStorage = localStorage.getItem('user_email')
      
      if (emailFromUrl) {
        setEmail(emailFromUrl)
      } else if (emailFromStorage) {
        setEmail(emailFromStorage)
      } else {
        // Se não há email, mostrar interface de recuperação
        setShowRecoveryForm(true)
      }
    }
  }, [searchParams, router])

  const fetchSessionEmail = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/get-session-data?session_id=${sessionId}`)
      if (response.ok) {
        const sessionData = await response.json()
        if (sessionData.customer_email) {
          setEmail(sessionData.customer_email)
        }
      }
    } catch (error) {
      console.error('Erro ao obter email da sessão:', error)
    }
  }

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryError('')
    setRecoveryLoading(true)

    try {
      const response = await fetch('/api/recover-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: recoveryEmail }),
      })

      const data = await response.json()

      if (response.ok && data.found) {
        setEmail(recoveryEmail)
        setShowRecoveryForm(false)
        setSuccess('Pagamento encontrado! Complete seu cadastro abaixo.')
      } else {
        setRecoveryError(data.error || 'Erro ao recuperar pagamento')
      }
    } catch (error) {
      setRecoveryError('Erro de conexão. Tente novamente.')
    } finally {
      setRecoveryLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validações
    if (!name.trim()) {
      setError('Nome é obrigatório.')
      setLoading(false)
      return
    }

    if (!phone.trim()) {
      setError('Telefone é obrigatório.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

            try {
              // Primeiro, verificar se usuário já existe na tabela professionals
              const { data: existingUser, error: checkError } = await supabase
                .from('professionals')
                .select('id, email')
                .eq('email', email)
                .single()

              if (existingUser && !checkError) {
                // Usuário já existe - apenas atualizar senha e perfil
                console.log('Usuário já existe, atualizando senha...')
                
                // Atualizar senha usando admin API
                const { error: updateError } = await supabase.auth.admin.updateUserById(
                  existingUser.id,
                  {
                    password: password,
                    user_metadata: {
                      full_name: name,
                      phone: `${countryCode}${phone}`,
                    }
                  }
                )

                if (updateError) {
                  console.error('Erro ao atualizar senha:', updateError)
                  setError('Erro ao atualizar senha. Entre em contato.')
                  return
                }

                // Atualizar perfil na tabela professionals
                const { error: profileError } = await supabase
                  .from('professionals')
                  .update({
                    name: name,
                    phone: `${countryCode}${phone}`,
                    is_active: true,
                    updated_at: new Date().toISOString()
                  })
                  .eq('email', email)

                if (profileError) {
                  console.error('Erro ao atualizar perfil:', profileError)
                  setError('Erro ao atualizar perfil. Entre em contato.')
                } else {
                  setSuccess('Perfil atualizado com sucesso! Redirecionando...')
                  localStorage.setItem('user_email', email)
                  localStorage.setItem('user_name', name)
                  
                  setTimeout(() => {
                    router.push('/user')
                  }, 2000)
                }
              } else {
                // Usuário não existe - criar novo
                console.log('Usuário não existe, criando novo...')
                
                const { data: authData, error: authError } = await supabase.auth.signUp({
                  email: email,
                  password: password,
                  options: {
                    emailRedirectTo: `${window.location.origin}/success`,
                    data: {
                      full_name: name,
                      phone: `${countryCode}${phone}`,
                    }
                  }
                })

                if (authError) {
                  console.error('Erro ao criar usuário:', authError)
                  setError(authError.message)
                  return
                }

                // Criar perfil na tabela professionals
                if (authData.user) {
                  const { error: profileError } = await supabase
                    .from('professionals')
                    .insert({
                      id: authData.user.id,
                      name: name,
                      email: email,
                      phone: `${countryCode}${phone}`,
                      is_active: true,
                      is_admin: false
                    })

                  if (profileError) {
                    console.error('Erro ao criar perfil:', profileError)
                    setError('Usuário criado, mas erro ao salvar perfil. Entre em contato.')
                  } else {
                    // Tentar vincular assinatura usando endpoint dedicado
                    try {
                      const linkResponse = await fetch('/api/link-subscription', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: email })
                      })

                      if (linkResponse.ok) {
                        const linkResult = await linkResponse.json()
                        console.log('✅ Assinatura vinculada:', linkResult.message)
                      } else {
                        console.log('⚠️ Não foi possível vincular assinatura automaticamente')
                      }
                    } catch (linkError) {
                      console.error('❌ Erro ao vincular assinatura:', linkError)
                    }

                    setSuccess('Cadastro realizado com sucesso! Redirecionando...')
                    localStorage.setItem('user_email', email)
                    localStorage.setItem('user_name', name)
                    
                    setTimeout(() => {
                      router.push('/user')
                    }, 2000)
                  }
                }
              }
            } catch (error) {
              console.error('Erro geral:', error)
              setError('Erro ao processar cadastro. Tente novamente.')
            }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete seu Cadastro
            </h1>
            <p className="text-gray-600">
              Defina sua senha para acessar o Herbalead
            </p>
          </div>

          {/* Form */}
          {showRecoveryForm ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  🔍 Recuperar Acesso
                </h2>
                <p className="text-blue-700 mb-4">
                  Digite o email usado no pagamento para recuperar seu acesso e completar o cadastro.
                </p>
                
                <form onSubmit={handleRecovery} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email usado no pagamento *
                    </label>
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  {recoveryError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-red-700 text-sm">{recoveryError}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {recoveryLoading ? 'Buscando...' : 'Recuperar Acesso'}
                  </button>
                </form>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-2">Não fez nenhum pagamento?</p>
                <Link
                  href="/payment"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Fazer pagamento agora
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <div className="flex">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  {countries.map((country) => (
                    <option key={country.code + country.name} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="11999999999"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Confirme sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <KeyRound className="w-5 h-5 mr-2" />
                  Criar Conta
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Fazer Login
              </Link>
            </p>
            
            {/* Botão WhatsApp */}
            <a
              href="https://api.whatsapp.com/send?phone=5519996049800&text=Acabei%20de%20fazer%20a%20minha%20inscri%C3%A7%C3%A3o%20e%20estou%20com%20duvida"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Suporte no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CompleteRegistrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600">Carregando...</p>
        </div>
      </div>
    }>
      <CompleteRegistrationContent />
    </Suspense>
  )
}
