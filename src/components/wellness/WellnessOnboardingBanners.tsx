'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface WellnessOnboardingBannersProps {
  profile?: any
}

interface BannerPreferences {
  dismissedProfileBanner: boolean
  dismissedPWABanner: boolean
  dismissedNotificationsBanner: boolean
}

export default function WellnessOnboardingBanners({ profile }: WellnessOnboardingBannersProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [showSituacoesBanner, setShowSituacoesBanner] = useState(false)
  const [showPWABanner, setShowPWABanner] = useState(false)
  const [showPushBanner, setShowPushBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [preferences, setPreferences] = useState<BannerPreferences>({
    dismissedProfileBanner: false,
    dismissedPWABanner: false,
    dismissedNotificationsBanner: false
  })
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)

  // Carregar preferências salvas
  useEffect(() => {
    if (!user) return

    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/wellness/banner-preferences', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.preferences) {
            setPreferences(data.preferences)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar preferências de banners:', error)
      } finally {
        setPreferencesLoaded(true)
      }
    }

    loadPreferences()
  }, [user])

  // Salvar preferência quando banner é fechado
  const savePreference = useCallback(async (bannerType: 'profile' | 'pwa' | 'notifications') => {
    if (!user) return

    const preferenceKey = 
      bannerType === 'profile' ? 'dismissedProfileBanner' :
      bannerType === 'pwa' ? 'dismissedPWABanner' :
      'dismissedNotificationsBanner'

    try {
      await fetch('/api/wellness/banner-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          [preferenceKey]: true
        })
      })
      
      // Atualizar estado local
      setPreferences(prev => ({
        ...prev,
        [preferenceKey]: true
      }))
    } catch (error) {
      console.error('Erro ao salvar preferência:', error)
    }
  }, [user])

  // Verificar se situações particulares estão preenchidas E se perfil está completo
  useEffect(() => {
    if (!preferencesLoaded) return
    
    // Verificar se o perfil NOEL está completo (onboarding_completo)
    const isProfileComplete = profile?.onboarding_completo === true
    
    // Se o perfil estiver completo, marcar banner como dismissed automaticamente
    if (isProfileComplete && !preferences.dismissedProfileBanner) {
      // Marcar como dismissed automaticamente quando perfil está completo
      savePreference('profile')
      setShowSituacoesBanner(false)
      return
    }
    
    // Só mostrar banner se:
    // 1. Perfil NÃO está completo
    // 2. E não tem situacoes_particulares (ou está vazio)
    // 3. E não foi fechado anteriormente
    const hasSituacoes = profile?.situacoes_particulares && 
                         profile.situacoes_particulares.trim().length > 0
    
    if (profile && !isProfileComplete && !hasSituacoes && !preferences.dismissedProfileBanner) {
      setShowSituacoesBanner(true)
    } else {
      setShowSituacoesBanner(false)
    }
  }, [profile, preferences.dismissedProfileBanner, preferencesLoaded, savePreference])

  // Verificar se PWA está instalado
  useEffect(() => {
    if (typeof window === 'undefined' || !preferencesLoaded) return

    // Verificar se está em modo standalone (PWA instalado)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')

    setIsInstalled(isStandalone)

    // Só mostrar banner se:
    // 1. Não está instalado
    // 2. E não foi fechado anteriormente
    if (!isStandalone && !preferences.dismissedPWABanner) {
      const timer = setTimeout(() => {
        setShowPWABanner(true)
      }, 3000) // Mostrar após 3 segundos
      return () => clearTimeout(timer)
    } else {
      setShowPWABanner(false)
    }
  }, [preferences.dismissedPWABanner, preferencesLoaded])

  // Verificar permissão de notificações
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window) || !preferencesLoaded) return

    const permission = Notification.permission
    setNotificationPermission(permission)

    // Só mostrar banner se:
    // 1. Permissão é 'default' (ainda não foi perguntado)
    // 2. E não foi fechado anteriormente
    // 3. E não foi negado (se foi negado, não mostrar mais - já foi desativado pelo usuário)
    if (permission === 'denied' || preferences.dismissedNotificationsBanner) {
      // Se foi negado ou fechado, não mostrar mais
      setShowPushBanner(false)
    } else if (permission === 'default' && !preferences.dismissedNotificationsBanner) {
      // Só mostrar se ainda não foi perguntado e não foi fechado
      const timer = setTimeout(() => {
        setShowPushBanner(true)
      }, 5000) // Mostrar após 5 segundos (depois do PWA)
      return () => clearTimeout(timer)
    } else {
      setShowPushBanner(false)
    }
  }, [preferences.dismissedNotificationsBanner, preferencesLoaded])

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
                  onClick={() => {
                    setShowSituacoesBanner(false)
                    savePreference('profile')
                  }}
                >
                  Preencher Agora →
                </Link>
                <button
                  onClick={() => {
                    setShowSituacoesBanner(false)
                    savePreference('profile')
                  }}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  Lembrar depois
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSituacoesBanner(false)
                savePreference('profile')
              }}
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
                  onClick={() => {
                    setShowPWABanner(false)
                    savePreference('pwa')
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                >
                  Entendi, obrigado!
                </button>
                <button
                  onClick={() => {
                    setShowPWABanner(false)
                    savePreference('pwa')
                  }}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  Lembrar depois
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPWABanner(false)
                savePreference('pwa')
              }}
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
                  onClick={() => {
                    setShowPushBanner(false)
                    savePreference('notifications')
                  }}
                >
                  Ativar Notificações →
                </Link>
                <button
                  onClick={() => {
                    setShowPushBanner(false)
                    savePreference('notifications')
                  }}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-300"
                >
                  Lembrar depois
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setShowPushBanner(false)
                savePreference('notifications')
              }}
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
