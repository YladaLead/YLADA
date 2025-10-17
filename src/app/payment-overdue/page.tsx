'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CreditCard, RefreshCw, ArrowLeft } from 'lucide-react'
import HerbaleadLogo from '@/components/HerbaleadLogo'

export default function PaymentOverduePage() {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
    username: string;
    subscription_status: string;
    subscription_plan: string;
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Buscar dados do usuário
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/subscription')
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          planType: userData?.subscription_plan || 'monthly',
          email: userData?.email 
        })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao criar assinatura')
      }
      
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Payment error:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <HerbaleadLogo />
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500">
            {/* Alert Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Pagamento em Atraso
              </h1>
              <p className="text-gray-600">
                Sua assinatura precisa ser renovada para continuar usando o HerbaLead
              </p>
            </div>

            {/* Status Info */}
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <CreditCard className="w-5 h-5 text-red-600 mr-2" />
                <span className="font-semibold text-red-800">Status da Assinatura</span>
              </div>
              <p className="text-red-700">
                {userData?.subscription_status === 'past_due' && 'Pagamento em atraso'}
                {userData?.subscription_status === 'canceled' && 'Assinatura cancelada'}
                {userData?.subscription_status === 'unpaid' && 'Pagamento não processado'}
                {!userData?.subscription_status && 'Assinatura não encontrada'}
              </p>
              {userData?.subscription_plan && (
                <p className="text-sm text-red-600 mt-1">
                  Plano: {userData.subscription_plan === 'monthly' ? 'Mensal' : 'Anual'}
                </p>
              )}
            </div>

            {/* Impact Message */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">O que isso significa?</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Seus links personalizados estão temporariamente indisponíveis</li>
                <li>• O acesso ao dashboard está bloqueado</li>
                <li>• As ferramentas de geração de leads estão pausadas</li>
                <li>• Seus dados estão seguros e serão restaurados após o pagamento</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Renovar Assinatura Agora
                  </>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Fazer Logout
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Precisa de ajuda? Entre em contato conosco em{' '}
                <a href="mailto:suporte@herbalead.com" className="text-emerald-600 hover:underline">
                  suporte@herbalead.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
