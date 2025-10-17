'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowRight, User } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userExists, setUserExists] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const sessionId = searchParams.get('session_id')

  const checkSessionAndUser = async () => {
    try {
      // Primeiro, tentar obter dados da sessão do Stripe
      let sessionEmail = ''
      if (sessionId) {
        try {
          const response = await fetch(`/api/get-session-data?session_id=${sessionId}`)
          if (response.ok) {
            const sessionData = await response.json()
            if (sessionData.customer_email) {
              sessionEmail = sessionData.customer_email
              setUserEmail(sessionEmail)
            }
          }
        } catch (error) {
          console.error('Erro ao obter dados da sessão:', error)
        }
      }

      // Verificar se o usuário já existe no Supabase
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && user.email === sessionEmail) {
        // Usuário logado é o mesmo que fez o pagamento
        setUserExists(true)
        setUserEmail(user.email || '')
        setLoading(false)
        return
      } else if (user && user.email !== sessionEmail) {
        // Usuário logado é diferente do que fez o pagamento
        console.log('⚠️ Usuário logado diferente do pagamento:', user.email, 'vs', sessionEmail)
        setUserExists(false)
        setUserEmail(sessionEmail) // Usar email da sessão, não do usuário logado
        setLoading(false)
        return
      }

      // Usuário não está logado ou não existe
      setUserExists(false)
      setUserEmail(sessionEmail)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      setLoading(false)
    }
  }

  const createUserFromSession = async (sessionData: { customer_email: string }) => {
    try {
      // Criar usuário no Supabase
      const { data, error } = await supabase.auth.signUp({
        email: sessionData.customer_email,
        password: 'temp_password_' + Math.random().toString(36).substring(7),
        options: {
          emailRedirectTo: `${window.location.origin}/success`
        }
      })

      if (error) {
        console.error('Erro ao criar usuário:', error)
      } else {
        console.log('Usuário criado:', data)
        setUserExists(true)
        setUserEmail(sessionData.customer_email)
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  useEffect(() => {
    if (sessionId) {
      checkSessionAndUser()
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pagamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header de Sucesso */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Pagamento Confirmado! ✅
            </h1>
            <p className="text-gray-600">
              Sua assinatura foi ativada com sucesso. Bem-vindo ao Herbalead!
            </p>
          </div>

          {userExists ? (
            // Usuário já existe - ir direto para o dashboard
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  ✅ Conta Ativada
                </h2>
                <p className="text-green-700 mb-4">
                  Sua conta <strong>{userEmail}</strong> foi ativada com sucesso!
                </p>
                <p className="text-green-600 text-sm">
                  Você já pode acessar todas as funcionalidades do Herbalead.
                </p>
              </div>

              <Link
                href="/user"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <User className="w-5 h-5 mr-2" />
                Acessar Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          ) : (
            // Usuário novo - aguardar webhook processar
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">
                  🎉 Bem-vindo ao Herbalead!
                </h2>
                <p className="text-blue-700">
                  Seu pagamento foi processado com sucesso! Agora complete seu cadastro abaixo.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  ✅ O que acontece agora?
                </h3>
                <ul className="text-green-700 space-y-2">
                  <li>• Sua assinatura foi ativada</li>
                  <li>• Sua conta está sendo criada</li>
                  <li>• Você receberá um email de confirmação</li>
                  <li>• Em alguns minutos, você poderá acessar o dashboard</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Complete seu cadastro para acessar o Herbalead.
                </p>
                <Link
                  href="/complete-registration"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <User className="w-5 h-5 mr-2" />
                  Finalizar Cadastro
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          )}

                  {/* Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500 mb-4">
                      Precisa de ajuda? Entre em contato conosco.
                    </p>
                    
                    {/* Botão WhatsApp */}
                    <a
                      href="https://wa.me/5519996049800?text=Olá!%20Tive%20problemas%20com%20o%20cadastro%20após%20o%20pagamento.%20Pode%20me%20ajudar?"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Fale Conosco no WhatsApp
                    </a>
                  </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600">Carregando...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}