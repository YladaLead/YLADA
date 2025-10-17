'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  // Remover redirecionamento automático
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push('/payment')
  //   }, 2000)
  //   return () => clearTimeout(timer)
  // }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Criar Conta
                </h1>
                <p className="text-sm text-gray-600">
                  Para começar, escolha seu plano primeiro
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Redirecionando para Pagamento...
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Para criar sua conta no HerbaLead, você precisa escolher um plano primeiro.
            <br /><br />
            <strong>Não se preocupe!</strong> Você tem 7 dias para cancelar sem questionamentos.
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>7 dias de garantia total</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Sem taxa de setup</span>
            </div>
          </div>

          {/* Loading */}
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          </div>

          {/* Manual redirect */}
          <p className="text-sm text-gray-500 mb-4">
            Não foi redirecionado automaticamente?
          </p>
          
          <Link 
            href="/payment"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Escolher Plano Agora
          </Link>
        </div>
      </main>
    </div>
  )
}