'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface WellnessOnboardingBannersProps {
  profile?: any
}

export default function WellnessOnboardingBanners({ profile }: WellnessOnboardingBannersProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [showSituacoesBanner, setShowSituacoesBanner] = useState(false)
  const [showPWABanner, setShowPWABanner] = useState(false)
  const [showPushBanner, setShowPushBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  // Verificar se situações particulares estão preenchidas
  useEffect(() => {
    if (profile && !profile.situacoes_particulares) {
      setShowSituacoesBanner(true)
    }
  }, [profile])

  // Verificar se PWA está instalado
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Verificar se está em modo standalone (PWA instalado)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')

    setIsInstalled(isStandalone)

    // Se não está instalado, mostrar banner após alguns segundos
    if (!isStandalone) {
      const timer = setTimeout(() => {
        setShowPWABanner(true)
      }, 3000) // Mostrar após 3 segundos
      return () => clearTimeout(timer)
    }
  }, [])

  // Verificar permissão de notificações
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return

    const permission = Notification.permission
    setNotificationPermission(permission)

    // Se não tem permissão, mostrar banner
    if (permission === 'default') {
      const timer = setTimeout(() => {
        setShowPushBanner(true)
      }, 5000) // Mostrar após 5 segundos (depois do PWA)
      return () => clearTimeout(timer)
    }
  }, [])

  // Não mostrar se não tem usuário
  if (!user) return null

  return (
    <div className="space-y-4 mb-6">
      {/* Banner: Preencher Situações Particulares */}
      {showSituacoesBanner && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 sm:p-5 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                📝
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                Complete seu perfil para o NOEL te conhecer melhor
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Descreva situações pessoais importantes (mudanças, desafios, objetivos) para que o NOEL possa oferecer orientações mais personalizadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/pt/wellness/conta/perfil"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors text-center"
                  onClick={() => setShowSituacoesBanner(false)}
                >
                  Preencher Agora →
                </Link>
                <button
                  onClick={() => setShowSituacoesBanner(false)}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  Lembrar depois
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSituacoesBanner(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Banner: Adicionar à Tela Inicial (PWA) */}
      {showPWABanner && !isInstalled && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-4 sm:p-5 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">
                📱
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                Adicione o app à tela inicial do seu celular
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Não precisa baixar aplicativo! Adicione à tela inicial para acesso rápido e receber notificações.
              </p>
              
              {/* Instruções por dispositivo */}
              <div className="bg-white rounded-lg p-3 mb-3 border border-purple-200">
                <p className="text-xs font-semibold text-gray-900 mb-2">Como adicionar:</p>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">📱 iPhone:</span>
                    <span>Menu Safari → Adicionar à Tela de Início</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">🤖 Android:</span>
                    <span>Menu do navegador → Adicionar à tela inicial</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setShowPWABanner(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  Entendi, obrigado!
                </button>
                <button
                  onClick={() => setShowPWABanner(false)}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  Lembrar depois
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPWABanner(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Banner: Ativar Notificações Push */}
      {showPushBanner && notificationPermission === 'default' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 sm:p-5 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                🔔
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                Ative as notificações para não perder nada
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Receba comunicados importantes, lembretes e atualizações mesmo com o app fechado. Funciona quando você adiciona o app à tela inicial.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href="/pt/wellness/configuracao"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors text-center"
                  onClick={() => setShowPushBanner(false)}
                >
                  Ativar Notificações →
                </Link>
                <button
                  onClick={() => setShowPushBanner(false)}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  Lembrar depois
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPushBanner(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 text-xl"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
