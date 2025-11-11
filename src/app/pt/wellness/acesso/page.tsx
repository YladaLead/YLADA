'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

function AcessoPorTokenContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setError('Token não fornecido na URL')
        setLoading(false)
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
            // Usar magic link para login automático
            console.log('🔐 Fazendo login automático via magic link...')
            window.location.href = data.loginUrl
          } else {
            // Fallback: redirecionar para bem-vindo (usuário pode precisar fazer login manualmente)
            const redirect = searchParams.get('redirect')
            const redirectPath = redirect ? decodeURIComponent(redirect) : '/pt/wellness/bem-vindo?payment=success'
            
            setTimeout(() => {
              window.location.href = redirectPath
            }, 1500)
          }
        } else {
          setError(data.error || 'Token inválido ou expirado')
        }
      } catch (err: any) {
        console.error('Erro ao validar token:', err)
        setError('Erro ao processar token. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    validateToken()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/wellness">
            <Image
              src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
              alt="YLADA Logo"
              width={280}
              height={84}
              className="bg-transparent object-contain h-12 sm:h-14 lg:h-16 w-auto"
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
                  <span className="text-4xl">❌</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Link Inválido
              </h1>
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">{error}</p>
              </div>
              <div className="space-y-3">
                <Link
                  href="/pt/wellness/recuperar-acesso"
                  className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  📧 Solicitar Novo Link
                </Link>
                <Link
                  href="/pt/wellness/login"
                  className="block w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Voltar para o Login
                </Link>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                <p>Possíveis motivos:</p>
                <ul className="list-disc list-inside mt-2 text-left">
                  <li>Link já foi usado</li>
                  <li>Link expirou (válido por 30 dias)</li>
                  <li>Link inválido ou corrompido</li>
                </ul>
              </div>
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

