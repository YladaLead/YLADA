'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

function AcessoPorTokenContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [errorType, setErrorType] = useState<'invalid' | 'expired' | 'used' | 'network' | null>(null)

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setError('Token não fornecido na URL')
        setErrorType('invalid')
        setLoading(false)
        return
      }

      // Se o usuário já está logado, verificar se pode pular a validação do token
      if (user && !authLoading) {
        console.log('✅ Usuário já está logado, redirecionando direto para bem-vindo')
        const redirect = searchParams.get('redirect')
        const redirectPath = redirect ? decodeURIComponent(redirect) : '/pt/wellness/bem-vindo?payment=success'
        setTimeout(() => {
          window.location.href = redirectPath
        }, 500)
        return
      }

      try {
        // Validar token no backend
        const response = await fetch('/api/auth/access-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Token válido - fazer login automático usando magic link se disponível
          setSuccess(true)
          
          if (data.loginUrl) {
            // Verificar se o loginUrl contém localhost e substituir pela URL de produção
            let loginUrl = data.loginUrl
            if (loginUrl.includes('localhost') || loginUrl.includes('127.0.0.1')) {
              // Substituir localhost pela URL de produção
              const productionUrl = 'https://www.ylada.com'
              loginUrl = loginUrl.replace(/https?:\/\/[^\/]+/, productionUrl)
              console.log('⚠️ URL corrigida de localhost para produção:', loginUrl)
            }
            
            // Usar magic link para login automático
            console.log('🔐 Fazendo login automático via magic link...')
            window.location.href = loginUrl
          } else {
            // Fallback: verificar redirect ou usar padrão baseado no contexto
            const redirect = searchParams.get('redirect')
            // Se tem redirect, usar ele (pode ser dashboard ou bem-vindo)
            // Se não tem, assumir recuperação e ir para dashboard
            const redirectPath = redirect 
              ? decodeURIComponent(redirect) 
              : '/pt/wellness/dashboard'
            
            console.log('🔄 Redirecionando para (fallback):', redirectPath)
            setTimeout(() => {
              window.location.href = redirectPath
            }, 1500)
          }
        } else {
          // Detectar tipo de erro para melhorar mensagem
          const errorMsg = data.error || 'Token inválido ou expirado'
          if (errorMsg.includes('expirado') || errorMsg.includes('expired')) {
            setErrorType('expired')
          } else if (errorMsg.includes('usado') || errorMsg.includes('used')) {
            setErrorType('used')
          } else if (errorMsg.includes('inválido') || errorMsg.includes('invalid')) {
            setErrorType('invalid')
          } else {
            setErrorType('invalid')
          }
          setError(errorMsg)
        }
      } catch (err: any) {
        console.error('Erro ao validar token:', err)
        setErrorType('network')
        setError('Erro de conexão. Verifique sua internet e tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    // Aguardar um pouco para verificar se o usuário já está logado
    const timer = setTimeout(() => {
      validateToken()
    }, authLoading ? 1000 : 500)

    return () => clearTimeout(timer)
  }, [searchParams, router, user, authLoading])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/wellness">
            <Image
              src="/images/logo/wellness/Logo_Wellness_horizontal.png"
              alt="WELLNESS - Your Leading Data System"
              width={572}
              height={150}
              className="bg-transparent object-contain h-14 sm:h-16 lg:h-20 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {loading && (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Validando acesso...
              </h1>
              <p className="text-gray-600">
                Aguarde enquanto validamos seu link de acesso
              </p>
            </>
          )}

          {success && (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-4xl">✅</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Acesso Confirmado! ✅
              </h1>
              <p className="text-gray-600 mb-6">
                Você foi logado automaticamente. Redirecionando para completar seu cadastro...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            </>
          )}

          {error && (
            <>
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-4xl">
                    {errorType === 'expired' ? '⏰' : errorType === 'used' ? '🔒' : '❌'}
                  </span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {errorType === 'expired' 
                  ? 'Link Expirado' 
                  : errorType === 'used' 
                  ? 'Link Já Utilizado' 
                  : errorType === 'network'
                  ? 'Erro de Conexão'
                  : 'Link Inválido'}
              </h1>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                <p className="text-sm text-blue-800 mb-2">
                  {errorType === 'expired' 
                    ? '⏰ Este link de acesso expirou. Links são válidos por 30 dias.'
                    : errorType === 'used' 
                    ? '🔒 Este link já foi usado. Por segurança, cada link só pode ser usado uma vez.'
                    : errorType === 'network'
                    ? '🌐 Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
                    : '❌ Este link não é válido ou está corrompido.'}
                </p>
                <p className="text-sm text-blue-700 font-semibold">
                  💡 Não se preocupe! Você pode solicitar um novo link ou fazer login normalmente.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/pt/wellness/recuperar-acesso"
                  className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  📧 Solicitar Novo Link de Acesso
                </Link>
                <Link
                  href="/pt/wellness/login"
                  className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  🔑 Fazer Login (se já tem conta)
                </Link>
                <Link
                  href="/pt/wellness/login?signup=true"
                  className="block w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
                >
                  ✨ Criar Nova Conta
                </Link>
              </div>

              {errorType === 'expired' && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>💡 Dica:</strong> Links de acesso são válidos por 30 dias. Se você recebeu este e-mail há mais de 30 dias, solicite um novo link.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AcessoPorTokenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <AcessoPorTokenContent />
    </Suspense>
  )
}

