'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
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

    // Se não estiver logado, aguardar mais tempo (pode estar carregando após callback)
    if (!user && authLoading) {
      setError('Aguarde, estamos verificando seu acesso...')
      return
    }
    
    // Se ainda não estiver logado após aguardar, tentar recarregar ou verificar novamente
    if (!user && !authLoading) {
      // Se veio do pagamento, pode ser que a sessão ainda esteja sendo sincronizada
      if (fromPayment) {
        setError('Aguarde, estamos finalizando seu login...')
        // Aguardar mais um pouco e tentar novamente
        setTimeout(async () => {
          // Tentar buscar sessão novamente
          const { createClient } = await import('@/lib/supabase-client')
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            // Recarregar para pegar a sessão
            window.location.reload()
          } else {
            setError('Não foi possível fazer login automaticamente. Por favor, faça login manualmente.')
          }
        }, 3000)
        return
      } else {
        setError('Você precisa estar logado. Verificando seu acesso...')
        // Recarregar a página para tentar pegar a sessão
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        return
      }
    }

    setSaving(true)
    setError(null)

    try {
      // Primeiro, atualizar a senha no Supabase Auth
      if (senha) {
        const { createClient } = await import('@/lib/supabase-client')
        const supabase = createClient()
        
        const { error: passwordError } = await supabase.auth.updateUser({
          password: senha
        })
        
        if (passwordError) {
          console.error('Erro ao atualizar senha:', passwordError)
          setError('Erro ao definir senha. Tente novamente.')
          return
        }
      }
      
      // Depois, atualizar o perfil
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

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          router.push('/pt/wellness/dashboard')
        }, 2000)
      } else {
        setError(data.error || 'Erro ao salvar perfil. Tente novamente.')
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
            <div className="text-center py-8">
              <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Perfil atualizado com sucesso!
              </h2>
              <p className="text-gray-600 mb-4">
                Redirecionando para sua área de trabalho...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
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
                    <input
                      id="telefone"
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="Ex: (11) 98765-4321"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                      disabled={saving}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Seu telefone será usado para contato e suporte.
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
                      {saving ? '⏳ Salvando...' : '✨ Finalizar Cadastro e Continuar'}
                    </button>
                    <p className="text-xs text-center text-gray-500">
                      Todos os campos são obrigatórios para completar seu cadastro
                    </p>
                  </div>
                </form>
              </div>

              {/* O que vem a seguir */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚀 O que você pode fazer agora:
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">📝</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Criar Ferramentas</h4>
                    <p className="text-sm text-gray-600">
                      Crie questionários e formulários personalizados para seus clientes
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Gerar Leads</h4>
                    <p className="text-sm text-gray-600">
                      Capture informações e converta visitantes em clientes
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold text-gray-900 mb-1">Acompanhar Resultados</h4>
                    <p className="text-sm text-gray-600">
                      Veja estatísticas e métricas de suas ferramentas
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Link de ajuda */}
        <div className="text-center">
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

