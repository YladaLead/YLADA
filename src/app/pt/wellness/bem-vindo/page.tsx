'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'

function BemVindoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, userProfile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [telefone, setTelefone] = useState('')
  const [telefoneCountryCode, setTelefoneCountryCode] = useState('BR')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Verificar se veio do pagamento
  const fromPayment = searchParams.get('payment') === 'success'

  useEffect(() => {
    // Aguardar mais tempo para o auth carregar após callback do Supabase
    // O callback pode levar alguns segundos para sincronizar a sessão
    const timer = setTimeout(() => {
      // Carregar dados do perfil se já existirem
      if (userProfile?.nome_completo) {
        setNomeCompleto(userProfile.nome_completo)
      } else if (user?.email) {
        // Tentar extrair nome do e-mail como fallback
        const emailName = user.email.split('@')[0]
        setNomeCompleto(emailName.charAt(0).toUpperCase() + emailName.slice(1))
      }
      
      // Carregar telefone se já existir (vem de whatsapp no banco)
      if (userProfile?.whatsapp) {
        setTelefone(userProfile.whatsapp)
      }
      setLoading(false)
    }, fromPayment ? 2000 : 1000) // Aguardar mais se veio do pagamento

    return () => clearTimeout(timer)
  }, [user, userProfile, fromPayment])

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!nomeCompleto.trim()) {
      setError('Por favor, informe seu nome completo')
      return
    }
    
    if (!telefone.trim()) {
      setError('Por favor, informe seu telefone/WhatsApp')
      return
    }
    
    // Validar formato de telefone (básico)
    const telefoneLimpo = telefone.replace(/\D/g, '')
    if (telefoneLimpo.length < 10) {
      setError('Por favor, informe um telefone válido (com DDD)')
      return
    }
    
    if (!senha) {
      setError('Por favor, crie uma senha para sua conta')
      return
    }
    
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Buscar sessão diretamente do Supabase (não depender do useAuth)
      const { createClient } = await import('@/lib/supabase-client')
      const supabase = createClient()
      
      // Tentar buscar sessão com múltiplas tentativas
      let currentSession = null
      let sessionUser = null
      
      // Tentativa 1: Buscar imediatamente
      const { data: { session: session1 }, error: error1 } = await supabase.auth.getSession()
      if (session1 && session1.user) {
        currentSession = session1
        sessionUser = session1.user
        console.log('✅ Sessão encontrada na primeira tentativa')
      } else {
        console.log('⏳ Primeira tentativa falhou, aguardando 1 segundo...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Tentativa 2: Após 1 segundo
        const { data: { session: session2 } } = await supabase.auth.getSession()
        if (session2 && session2.user) {
          currentSession = session2
          sessionUser = session2.user
          console.log('✅ Sessão encontrada na segunda tentativa')
        } else {
          console.log('⏳ Segunda tentativa falhou, aguardando mais 2 segundos...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Tentativa 3: Após mais 2 segundos
          const { data: { session: session3 } } = await supabase.auth.getSession()
          if (session3 && session3.user) {
            currentSession = session3
            sessionUser = session3.user
            console.log('✅ Sessão encontrada na terceira tentativa')
          } else {
            // Se ainda não encontrou, tentar recarregar a página para sincronizar cookies
            console.log('⚠️ Sessão não encontrada após 3 tentativas, recarregando página...')
            setError('Sincronizando sua sessão... Recarregando a página...')
            setTimeout(() => {
              window.location.reload()
            }, 2000)
            setSaving(false)
            return
          }
        }
      }
      
      if (!sessionUser) {
        setError('Não foi possível verificar sua sessão. Recarregando a página...')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        setSaving(false)
        return
      }
      
      console.log('✅ Usuário autenticado:', {
        id: sessionUser.id,
        email: sessionUser.email
      })

      // Primeiro, atualizar a senha no Supabase Auth
      if (senha) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: senha
        })
        
        if (passwordError) {
          console.error('Erro ao atualizar senha:', passwordError)
          setError('Erro ao definir senha. Tente novamente.')
          setSaving(false)
          return
        }
      }
      
      // Depois, atualizar o perfil
      console.log('📤 Enviando dados do perfil:', {
        nome: nomeCompleto.trim(),
        whatsapp: telefone.replace(/\D/g, '')
      })
      
      const response = await fetch('/api/wellness/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nome: nomeCompleto.trim(),
          whatsapp: telefone.replace(/\D/g, ''), // Apenas números
        }),
      })
      
      console.log('📥 Resposta da API:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      })
      
      // Se a resposta for 401 (não autenticado), tentar recarregar a página
      if (response.status === 401) {
        setError('Sua sessão expirou. Recarregando a página...')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        setSaving(false)
        return
      }

      // Tentar parsear a resposta
      let data
      try {
        const text = await response.text()
        console.log('📄 Resposta em texto:', text)
        data = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error('❌ Erro ao parsear resposta:', parseError)
        setError('Erro ao processar resposta do servidor. Tente novamente.')
        setSaving(false)
        return
      }

      console.log('📊 Dados parseados:', data)

      if (response.ok && data.success) {
        console.log('✅ Perfil salvo com sucesso!', data)
        
        // Verificar se os dados foram realmente salvos
        if (data.profile) {
          console.log('✅ Confirmação: Dados salvos no banco:', {
            nome: data.profile.nome_completo,
            whatsapp: data.profile.whatsapp,
            updated_at: data.profile.updated_at
          })
        } else {
          console.warn('⚠️ Atenção: Resposta OK mas sem dados do perfil')
        }
        
        setSaving(false) // Parar o loading primeiro
        setSuccess(true)
        setError(null)
        
        // Aguardar 3 segundos para garantir que a mensagem seja vista antes de redirecionar
        setTimeout(() => {
          console.log('🔄 Redirecionando para Home...')
          router.push('/pt/wellness/dashboard')
        }, 3000)
      } else {
        console.error('❌ Erro ao salvar perfil:', data)
        setError(data.error || 'Erro ao salvar perfil. Tente novamente.')
        setSaving(false)
      }
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err)
      setError('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  // Removido handleSkip - não permitir pular o cadastro

  // Se não está logado e não veio do pagamento, permitir acesso mesmo assim
  // (usuário pode ter acabado de pagar e ainda não estar logado)
  if (loading && !fromPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎉 Bem-vindo ao YLADA Wellness!
          </h1>
          <p className="text-xl text-gray-600">
            Sua conta foi criada com sucesso
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {fromPayment && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    ✅ Pagamento confirmado! Sua assinatura está ativa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {success ? (
            <div className="text-center py-12">
              {/* Ícone de sucesso grande e destacado */}
              <div className="inline-block bg-gradient-to-br from-green-400 to-green-600 rounded-full p-6 mb-6 shadow-lg animate-bounce">
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Título principal - MENSAGEM CLARA E DESTACADA */}
              <h2 className="text-4xl font-bold text-green-600 mb-4 animate-pulse">
                ✅ Seu Cadastro Foi Feito com Sucesso!
              </h2>
              
              {/* Mensagem de confirmação destacada */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 mb-6 max-w-md mx-auto">
                <p className="text-xl text-gray-800 mb-2 font-semibold">
                  🎉 Perfil Atualizado com Sucesso!
                </p>
                <p className="text-gray-700">
                  Seus dados foram salvos corretamente. Agora você pode acessar todas as funcionalidades da plataforma.
                </p>
              </div>
              
              {/* Contador de redirecionamento */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6 max-w-md mx-auto">
                <p className="text-blue-800 font-medium mb-2">
                  🚀 Redirecionando para a Home...
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-blue-700">
                    Você será redirecionado automaticamente em alguns segundos
                  </p>
                </div>
              </div>
              
              {/* Botão para ir imediatamente */}
              <button
                onClick={() => router.push('/pt/wellness/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg text-lg transform hover:scale-105"
              >
                🚀 Ir para o Dashboard Agora
              </button>
            </div>
          ) : (
            <>
              {/* Informações sobre o e-mail - apenas se não veio do pagamento */}
              {!fromPayment && user?.email && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">
                        📧 Verifique seu e-mail
                      </h3>
                      <p className="text-sm text-blue-800 mb-2">
                        Enviamos um e-mail para <strong>{user.email}</strong> com um link de acesso seguro à plataforma.
                      </p>
                      <p className="text-xs text-blue-700">
                        💡 <strong>Dica:</strong> Verifique também sua pasta de spam. O link é válido por 30 dias.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulário de completar perfil */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ✨ Último passo para começar!
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Complete seu cadastro com seus dados para personalizar sua experiência na plataforma.
                  </p>
                  <p className="text-sm text-gray-600">
                    ⏱️ <strong>Leva menos de 2 minutos</strong> - depois você já pode começar a criar suas ferramentas!
                  </p>
                </div>

                <form onSubmit={handleCompleteProfile}>
                  <div className="mb-6">
                    <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      id="nomeCompleto"
                      type="text"
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      placeholder="Ex: Maria Silva"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                      disabled={saving}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Este nome será usado em suas ferramentas e comunicações com seus clientes.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <PhoneInputWithCountry
                      value={telefone || ''}
                      onChange={(phone, countryCode) => {
                        setTelefone(phone)
                        setTelefoneCountryCode(countryCode || 'BR')
                      }}
                      defaultCountryCode={telefoneCountryCode}
                      className="w-full"
                      placeholder="11 99999-9999"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Seu telefone será usado para contato e suporte. Selecione o país pela bandeira para formatação automática.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                      Criar Senha *
                    </label>
                    <div className="relative">
                      <input
                        id="senha"
                        type={mostrarSenha ? "text" : "password"}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg pr-12"
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {mostrarSenha ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      🔒 Use uma senha forte com pelo menos 6 caracteres.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <input
                        id="confirmarSenha"
                        type={mostrarSenha ? "text" : "password"}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder="Digite a senha novamente"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg pr-12"
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {mostrarSenha ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={saving || !nomeCompleto.trim() || !telefone.trim() || !senha || senha !== confirmarSenha}
                      className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-center text-lg"
                    >
                      {saving ? '⏳ Salvando e verificando acesso...' : '✨ Finalizar Cadastro e Continuar'}
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      Todos os campos são obrigatórios para completar seu cadastro
                    </p>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Link de ajuda */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Precisa de ajuda?{' '}
            <Link href="/pt/wellness/suporte" className="text-green-600 hover:text-green-700 font-medium">
              Entre em contato com o suporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BemVindoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <BemVindoContent />
    </Suspense>
  )
}

